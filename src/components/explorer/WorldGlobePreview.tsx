import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { createEarthTextureBundle } from '../../data/earthGeography';
import type { AppLanguage, CountryId, CountryWorld, ResolvedAppearance } from '../../types/game';
import { CountryFlagBadge, drawFlagOnCanvas } from '../common/CountryFlagBadge';

interface WorldGlobePreviewProps {
  countries: CountryWorld[];
  selectedCountryId: CountryId;
  onSelectCountry: (id: CountryId) => void;
  language: AppLanguage;
  reducedMotion: boolean;
  appearance: ResolvedAppearance;
  sceneMode: 'title' | 'map';
  onWebGLFailure: () => void;
}

const _quatA = new THREE.Quaternion();
const _quatPitch = new THREE.Quaternion();
const _quatYaw = new THREE.Quaternion();
const _targetQuat = new THREE.Quaternion();
const _workColorA = new THREE.Color();
const _workColorB = new THREE.Color();
const _workVecA = new THREE.Vector3();
const _workVecB = new THREE.Vector3();
const _upAxis = new THREE.Vector3(0, 1, 0);
const _rightAxis = new THREE.Vector3(1, 0, 0);

// Pre-allocated Day / Night sky & lighting palette
const DAY_SKY_TOP = new THREE.Color('#2E96D9');
const DAY_SKY_BOTTOM = new THREE.Color('#CBEBFB');
const NIGHT_SKY_TOP = new THREE.Color('#0A0E26');
const NIGHT_SKY_BOTTOM = new THREE.Color('#261C4D');

const DAY_FOG_COLOR = new THREE.Color('#9EDBF7');
const NIGHT_FOG_COLOR = new THREE.Color('#16183A');

const DAY_HEMI_SKY = new THREE.Color('#DCF4FF');
const NIGHT_HEMI_SKY = new THREE.Color('#5A79C2');
const DAY_HEMI_GROUND = new THREE.Color('#4B7F78');
const NIGHT_HEMI_GROUND = new THREE.Color('#171833');

const DAY_KEY_COLOR = new THREE.Color('#FFF4D4');
const NIGHT_KEY_COLOR = new THREE.Color('#9EBEFF');
const DAY_KEY_POS = new THREE.Vector3(5.2, 6.4, 5.0);
const NIGHT_KEY_POS = new THREE.Vector3(-4.2, 5.6, 4.2);

const DAY_RIM_COLOR = new THREE.Color('#3AD2C8');
const NIGHT_RIM_COLOR = new THREE.Color('#8C76EE');

const DAY_CLOUD_COLOR = new THREE.Color('#FFFFFF');
const NIGHT_CLOUD_COLOR = new THREE.Color('#4B5B8F');

const DAY_ATMOS_COLOR = new THREE.Color('#6CE2FF');
const NIGHT_ATMOS_COLOR = new THREE.Color('#5A82F5');

const THAILAND_ORIGIN = { lat: 13.7563, lng: 100.5018 };

function latLngToVector3(
  lat: number,
  lng: number,
  radius: number,
  out: THREE.Vector3,
): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  out.set(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
  return out;
}

function createStarDotTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(32, 32, 1, 32, 32, 30);
    grad.addColorStop(0, 'rgba(255, 252, 238, 1)');
    grad.addColorStop(0.35, 'rgba(225, 238, 255, 0.85)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function paintFlagBannerCanvas(
  canvas: HTMLCanvasElement,
  countryId: CountryId,
  label: string,
  isActive: boolean,
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const W = canvas.width;
  const H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  // Compact floating pill card
  const padX = 10;
  const padY = 10;
  const cardW = W - padX * 2;
  const cardH = H - padY * 2;

  ctx.save();
  ctx.shadowColor = 'rgba(10, 20, 40, 0.45)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 4;

  ctx.beginPath();
  ctx.roundRect(padX, padY, cardW, cardH, 18);
  ctx.fillStyle = isActive ? '#15253E' : 'rgba(247, 249, 252, 0.96)';
  ctx.fill();
  ctx.restore();

  ctx.beginPath();
  ctx.roundRect(padX, padY, cardW, cardH, 18);
  ctx.lineWidth = isActive ? 5 : 3;
  ctx.strokeStyle = isActive ? '#F2C66D' : 'rgba(32, 48, 74, 0.35)';
  ctx.stroke();

  // Crisp country flag on the left of the pill
  const flagW = 66;
  const flagH = 44;
  const flagX = padX + 14;
  const flagY = padY + (cardH - flagH) / 2;
  drawFlagOnCanvas(ctx, countryId, flagX, flagY, flagW, flagH);

  ctx.beginPath();
  ctx.roundRect(flagX, flagY, flagW, flagH, 4);
  ctx.lineWidth = 2;
  ctx.strokeStyle = isActive ? 'rgba(255,255,255,0.45)' : 'rgba(19,30,49,0.22)';
  ctx.stroke();

  // Country Name text
  ctx.fillStyle = isActive ? '#F7F9FC' : '#131E31';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.font = '800 30px "Plus Jakarta Sans", "Noto Sans Thai", system-ui, sans-serif';
  const textX = flagX + flagW + 14;
  const maxTextW = padX + cardW - textX - 12;
  ctx.fillText(label, textX, H / 2 + 1, maxTextW);
}

interface LandmarkBuildResult {
  root: THREE.Group;
  glowMaterials: THREE.MeshStandardMaterial[];
  geometries: THREE.BufferGeometry[];
  materials: THREE.Material[];
}

function createCountryLandmarkMiniature(countryId: CountryId): LandmarkBuildResult {
  const root = new THREE.Group();
  const glowMaterials: THREE.MeshStandardMaterial[] = [];
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];

  const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
    geometries.push(g);
    return g;
  };
  const trackMat = <T extends THREE.Material>(m: T): T => {
    materials.push(m);
    return m;
  };

  if (countryId === 'india') {
    // Hawa Mahal: Pink-City sandstone base + stepped coral facade + golden domes
    const baseMat = trackMat(
      new THREE.MeshStandardMaterial({ color: '#E8A87C', roughness: 0.75, metalness: 0.05 }),
    );
    const pinkMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: '#E06B5D',
        emissive: '#FF9478',
        emissiveIntensity: 0.16,
        roughness: 0.55,
      }),
    );
    const creamMat = trackMat(
      new THREE.MeshStandardMaterial({ color: '#FFF0D6', roughness: 0.5 }),
    );
    const goldMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: '#F2C66D',
        emissive: '#F2C66D',
        emissiveIntensity: 0.35,
        roughness: 0.25,
        metalness: 0.7,
      }),
    );
    glowMaterials.push(pinkMat, goldMat);

    const plinth = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.11, 0.125, 0.025, 16)), baseMat);
    plinth.position.y = 0.012;

    const lowerWall = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.15, 0.07, 0.065)), pinkMat);
    lowerWall.position.y = 0.055;

    const midWall = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.12, 0.06, 0.055)), pinkMat);
    midWall.position.y = 0.115;

    const topCrown = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.08, 0.045, 0.042)), creamMat);
    topCrown.position.y = 0.165;

    const domeGeo = trackGeo(new THREE.SphereGeometry(0.02, 10, 8, 0, Math.PI * 2, 0, Math.PI * 0.65));
    const centerDome = new THREE.Mesh(domeGeo, goldMat);
    centerDome.position.set(0, 0.19, 0);
    const leftDome = new THREE.Mesh(domeGeo, goldMat);
    leftDome.scale.setScalar(0.78);
    leftDome.position.set(-0.048, 0.145, 0.005);
    const rightDome = new THREE.Mesh(domeGeo, goldMat);
    rightDome.scale.setScalar(0.78);
    rightDome.position.set(0.048, 0.145, 0.005);

    // Decorative front jharokha arch accent
    const archTrim = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.036, 0.055, 0.072)), creamMat);
    archTrim.position.y = 0.062;

    root.add(plinth, lowerWall, midWall, topCrown, centerDome, leftDome, rightDome, archTrim);
  } else if (countryId === 'kenya') {
    // Maasai Mara Savanna Acacia Landscape
    const grassMat = trackMat(
      new THREE.MeshStandardMaterial({ color: '#6FB84B', roughness: 0.85 }),
    );
    const waterMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: '#2CC5CF',
        emissive: '#24B8B0',
        emissiveIntensity: 0.2,
        roughness: 0.2,
      }),
    );
    const trunkMat = trackMat(
      new THREE.MeshStandardMaterial({ color: '#6E4627', roughness: 0.9 }),
    );
    const canopyMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: '#3D8F40',
        emissive: '#5FB852',
        emissiveIntensity: 0.14,
        roughness: 0.78,
      }),
    );
    glowMaterials.push(canopyMat, waterMat);

    const pad = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.115, 0.128, 0.024, 18)), grassMat);
    pad.position.y = 0.012;

    const pond = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.045, 0.045, 0.008, 12)), waterMat);
    pond.position.set(0.042, 0.024, 0.035);

    // Tall Acacia Tree
    const trunk1 = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.01, 0.016, 0.11, 8)), trunkMat);
    trunk1.position.set(-0.022, 0.075, -0.01);
    trunk1.rotation.z = 0.08;

    const canopy1 = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.085, 0.055, 0.024, 14)), canopyMat);
    canopy1.position.set(-0.026, 0.135, -0.01);

    const canopy1Top = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.052, 10, 8)), canopyMat);
    canopy1Top.scale.set(1.4, 0.35, 1.3);
    canopy1Top.position.set(-0.026, 0.15, -0.01);

    // Smaller Acacia Tree
    const trunk2 = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.008, 0.012, 0.072, 8)), trunkMat);
    trunk2.position.set(0.042, 0.055, -0.035);
    trunk2.rotation.z = -0.1;

    const canopy2 = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.055, 0.035, 0.02, 12)), canopyMat);
    canopy2.position.set(0.046, 0.095, -0.035);

    root.add(pad, pond, trunk1, canopy1, canopy1Top, trunk2, canopy2);
  } else if (countryId === 'scotland') {
    // Highland Castle Keep & Turrets on Emerald Mound
    const hillMat = trackMat(
      new THREE.MeshStandardMaterial({ color: '#459656', roughness: 0.85 }),
    );
    const stoneMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: '#B5C0CC',
        emissive: '#9EB3C8',
        emissiveIntensity: 0.14,
        roughness: 0.72,
      }),
    );
    const roofMat = trackMat(
      new THREE.MeshStandardMaterial({ color: '#2F5B84', roughness: 0.45 }),
    );
    const warmGlowMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: '#FFE08A',
        emissive: '#FFBA4A',
        emissiveIntensity: 0.65,
        roughness: 0.3,
      }),
    );
    glowMaterials.push(stoneMat, warmGlowMat);

    const mound = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.115, 0.13, 0.028, 16)), hillMat);
    mound.position.y = 0.014;

    const keep = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.105, 0.088, 0.08)), stoneMat);
    keep.position.set(0, 0.068, 0);

    const mainTower = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.034, 0.038, 0.13, 12)), stoneMat);
    mainTower.position.set(-0.042, 0.09, 0.02);

    const mainRoof = new THREE.Mesh(trackGeo(new THREE.ConeGeometry(0.042, 0.06, 12)), roofMat);
    mainRoof.position.set(-0.042, 0.182, 0.02);

    const sideTower = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.026, 0.028, 0.1, 10)), stoneMat);
    sideTower.position.set(0.048, 0.075, -0.02);

    const sideRoof = new THREE.Mesh(trackGeo(new THREE.ConeGeometry(0.034, 0.048, 10)), roofMat);
    sideRoof.position.set(0.048, 0.148, -0.02);

    const gate = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.028, 0.038, 0.085)), warmGlowMat);
    gate.position.set(0.01, 0.048, 0.002);

    root.add(mound, keep, mainTower, mainRoof, sideTower, sideRoof, gate);
  } else if (countryId === 'australia') {
    // Sydney Opera House Harbor Sail Vaults
    const harborMat = trackMat(
      new THREE.MeshStandardMaterial({ color: '#1C8DA8', roughness: 0.25, metalness: 0.1 }),
    );
    const deckMat = trackMat(
      new THREE.MeshStandardMaterial({ color: '#DCE3EC', roughness: 0.6 }),
    );
    const sailMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: '#FFFFFF',
        emissive: '#FFF1D2',
        emissiveIntensity: 0.24,
        roughness: 0.3,
        metalness: 0.05,
      }),
    );
    glowMaterials.push(sailMat);

    const harbor = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.12, 0.132, 0.02, 18)), harborMat);
    harbor.position.y = 0.01;

    const podium = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.17, 0.022, 0.11)), deckMat);
    podium.position.y = 0.03;

    const shellGeo = trackGeo(new THREE.ConeGeometry(0.044, 0.105, 10));

    const sail1 = new THREE.Mesh(shellGeo, sailMat);
    sail1.scale.set(0.65, 1.18, 1.15);
    sail1.position.set(-0.04, 0.088, 0);
    sail1.rotation.z = -0.34;

    const sail2 = new THREE.Mesh(shellGeo, sailMat);
    sail2.scale.set(0.68, 1.32, 1.2);
    sail2.position.set(0.006, 0.095, 0.008);
    sail2.rotation.z = -0.3;

    const sail3 = new THREE.Mesh(shellGeo, sailMat);
    sail3.scale.set(0.58, 0.96, 1.0);
    sail3.position.set(0.052, 0.078, -0.008);
    sail3.rotation.z = 0.35;

    root.add(harbor, podium, sail1, sail2, sail3);
  } else {
    // Egypt: Pyramids of Giza on Golden Desert Pad
    const sandMat = trackMat(
      new THREE.MeshStandardMaterial({ color: '#E3BA68', roughness: 0.85 }),
    );
    const limestoneMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: '#E7BC5B',
        emissive: '#F2C66D',
        emissiveIntensity: 0.22,
        roughness: 0.65,
      }),
    );
    const goldCapMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: '#FFE084',
        emissive: '#F2C66D',
        emissiveIntensity: 0.45,
        roughness: 0.25,
        metalness: 0.65,
      }),
    );
    glowMaterials.push(limestoneMat, goldCapMat);

    const pad = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.118, 0.13, 0.022, 16)), sandMat);
    pad.position.y = 0.011;

    const greatPyramid = new THREE.Mesh(trackGeo(new THREE.ConeGeometry(0.072, 0.115, 4)), limestoneMat);
    greatPyramid.position.set(-0.022, 0.078, 0.014);
    greatPyramid.rotation.y = Math.PI * 0.25;

    const greatCap = new THREE.Mesh(trackGeo(new THREE.ConeGeometry(0.018, 0.028, 4)), goldCapMat);
    greatCap.position.set(-0.022, 0.123, 0.014);
    greatCap.rotation.y = Math.PI * 0.25;

    const secondPyramid = new THREE.Mesh(trackGeo(new THREE.ConeGeometry(0.054, 0.084, 4)), limestoneMat);
    secondPyramid.position.set(0.048, 0.062, -0.024);
    secondPyramid.rotation.y = Math.PI * 0.25;

    root.add(pad, greatPyramid, greatCap, secondPyramid);
  }

  return { root, glowMaterials, geometries, materials };
}

export default function WorldGlobePreview({
  countries,
  selectedCountryId,
  onSelectCountry,
  language,
  reducedMotion,
  appearance,
  sceneMode,
  onWebGLFailure,
}: WorldGlobePreviewProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [hoveredCountryId, setHoveredCountryId] = useState<CountryId | null>(null);

  const onSelectRef = useRef(onSelectCountry);
  onSelectRef.current = onSelectCountry;
  const selectedIdRef = useRef(selectedCountryId);
  selectedIdRef.current = selectedCountryId;
  const languageRef = useRef<AppLanguage>(language);
  languageRef.current = language;
  const reducedMotionRef = useRef(reducedMotion);
  reducedMotionRef.current = reducedMotion;
  const appearanceRef = useRef<ResolvedAppearance>(appearance);
  appearanceRef.current = appearance;
  const sceneModeRef = useRef<'title' | 'map'>(sceneMode);
  sceneModeRef.current = sceneMode;
  const onFailureRef = useRef(onWebGLFailure);
  onFailureRef.current = onWebGLFailure;

  const targetFocusRef = useRef<{ lat: number; lng: number; active: boolean }>({
    lat: 26.9,
    lng: 75.8,
    active: false,
  });
  const selectBounceRef = useRef(0);
  const refreshBadgesRef = useRef<(() => void) | null>(null);

  // Trigger smooth focus & bounce whenever selectedCountryId changes
  useEffect(() => {
    const country = countries.find((c) => c.id === selectedCountryId);
    if (!country) return;
    targetFocusRef.current = {
      lat: country.coordinates.lat,
      lng: country.coordinates.lng,
      active: true,
    };
    selectBounceRef.current = 1.0;
    refreshBadgesRef.current?.();
  }, [countries, selectedCountryId]);

  // Repaint localized country names on 3D flag badges when EN/TH switches
  useEffect(() => {
    refreshBadgesRef.current?.();
  }, [language, sceneMode]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
        alpha: false,
      });
    } catch {
      onFailureRef.current();
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const initialW = container.clientWidth || window.innerWidth;
    const initialH = container.clientHeight || window.innerHeight;
    renderer.setSize(initialW, initialH);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      onFailureRef.current();
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);

    const scene = new THREE.Scene();
    const initialNightMix = appearanceRef.current === 'night' ? 1 : 0;
    scene.background = DAY_SKY_BOTTOM.clone().lerp(NIGHT_SKY_BOTTOM, initialNightMix);
    const fog = new THREE.FogExp2(
      DAY_FOG_COLOR.clone().lerp(NIGHT_FOG_COLOR, initialNightMix).getHex(),
      0.018,
    );
    scene.fog = fog;

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envTarget = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envTarget.texture;
    scene.environmentIntensity = initialNightMix > 0.5 ? 0.55 : 0.92;
    roomEnv.dispose();
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(42, initialW / initialH, 0.1, 100);
    camera.position.set(0, 0.65, sceneModeRef.current === 'title' ? 6.6 : 5.3);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.minDistance = 3.4;
    controls.maxDistance = 8.4;
    controls.minPolarAngle = Math.PI * 0.2;
    controls.maxPolarAngle = Math.PI * 0.78;
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.target.set(0, 0, 0);

    controls.addEventListener('start', () => {
      targetFocusRef.current.active = false;
    });

    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];
    const textures: THREE.Texture[] = [];

    // Full-World Sky Dome
    const skyGeo = new THREE.SphereGeometry(36, 32, 24);
    const skyPosAttr = skyGeo.attributes.position;
    const skyColors = new Float32Array(skyPosAttr.count * 3);
    const skyColorAttr = new THREE.BufferAttribute(skyColors, 3);
    skyGeo.setAttribute('color', skyColorAttr);
    const skyMat = new THREE.MeshBasicMaterial({
      vertexColors: true,
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
    });
    const skyDome = new THREE.Mesh(skyGeo, skyMat);
    scene.add(skyDome);
    geometries.push(skyGeo);
    materials.push(skyMat);

    const updateSkyDomeColors = (nightMix: number) => {
      _workColorA.copy(DAY_SKY_TOP).lerp(NIGHT_SKY_TOP, nightMix);
      _workColorB.copy(DAY_SKY_BOTTOM).lerp(NIGHT_SKY_BOTTOM, nightMix);
      for (let i = 0; i < skyPosAttr.count; i++) {
        const y = skyPosAttr.getY(i);
        const t = THREE.MathUtils.clamp((y + 10) / 36, 0, 1);
        const r = THREE.MathUtils.lerp(_workColorB.r, _workColorA.r, t);
        const g = THREE.MathUtils.lerp(_workColorB.g, _workColorA.g, t);
        const b = THREE.MathUtils.lerp(_workColorB.b, _workColorA.b, t);
        skyColorAttr.setXYZ(i, r, g, b);
      }
      skyColorAttr.needsUpdate = true;
    };
    updateSkyDomeColors(initialNightMix);

    // Lighting
    const hemiLight = new THREE.HemisphereLight('#DCF4FF', '#4B7F78', 1.25);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight('#FFF4D4', 2.15);
    keyLight.position.copy(DAY_KEY_POS);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight('#3AD2C8', 0.85);
    rimLight.position.set(-4.5, 3.0, -4.5);
    scene.add(rimLight);

    // Night Starfield
    const starCount = 380;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const r = 18 + Math.random() * 7;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = r * Math.cos(phi);
      starPositions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starTex = createStarDotTexture();
    const starMat = new THREE.PointsMaterial({
      map: starTex,
      size: 0.36,
      transparent: true,
      opacity: initialNightMix * 0.94,
      depthWrite: false,
      fog: false,
      blending: THREE.AdditiveBlending,
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);
    geometries.push(starGeo);
    materials.push(starMat);
    textures.push(starTex);

    // Night Moon
    const moonGroup = new THREE.Group();
    moonGroup.position.set(-5.2, 3.6, -10.5);
    const moonGeo = new THREE.SphereGeometry(0.68, 24, 24);
    const moonMat = new THREE.MeshBasicMaterial({
      color: '#FFF6D6',
      transparent: true,
      opacity: initialNightMix,
      fog: false,
    });
    const moonMesh = new THREE.Mesh(moonGeo, moonMat);
    const moonHaloGeo = new THREE.SphereGeometry(1.02, 24, 24);
    const moonHaloMat = new THREE.MeshBasicMaterial({
      color: '#9BB9FF',
      transparent: true,
      opacity: initialNightMix * 0.25,
      depthWrite: false,
      fog: false,
    });
    const moonHalo = new THREE.Mesh(moonHaloGeo, moonHaloMat);
    moonGroup.add(moonMesh, moonHalo);
    moonGroup.scale.setScalar(Math.max(0.01, initialNightMix));
    scene.add(moonGroup);
    geometries.push(moonGeo, moonHaloGeo);
    materials.push(moonMat, moonHaloMat);

    // Floating World Assembly (clean open-sky presentation without obscuring brass ring)
    const worldAnchor = new THREE.Group();
    scene.add(worldAnchor);

    // Rotating Globe Pivot
    const globePivot = new THREE.Group();
    worldAnchor.add(globePivot);

    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const earthBundle = createEarthTextureBundle(maxAniso);
    textures.push(
      earthBundle.albedoMap,
      earthBundle.bumpMap,
      earthBundle.roughnessMap,
      earthBundle.cloudsMap,
      earthBundle.nightLightsMap,
    );

    const globeRadius = 1.54;
    const globeGeo = new THREE.SphereGeometry(globeRadius, 64, 48);
    const globeMat = new THREE.MeshStandardMaterial({
      map: earthBundle.albedoMap,
      bumpMap: earthBundle.bumpMap,
      bumpScale: 0.036,
      roughnessMap: earthBundle.roughnessMap,
      roughness: 1.0,
      metalness: 0.06,
      emissive: new THREE.Color('#FFD27D'),
      emissiveMap: earthBundle.nightLightsMap,
      emissiveIntensity: initialNightMix * 1.2,
    });
    const globeMesh = new THREE.Mesh(globeGeo, globeMat);
    globeMesh.castShadow = true;
    globeMesh.receiveShadow = true;
    globePivot.add(globeMesh);
    geometries.push(globeGeo);
    materials.push(globeMat);

    // Soft Rotating Atmospheric Earth Cloud Layer
    const cloudSphereGeo = new THREE.SphereGeometry(globeRadius * 1.022, 48, 36);
    const cloudSphereMat = new THREE.MeshStandardMaterial({
      map: earthBundle.cloudsMap,
      color: DAY_CLOUD_COLOR.clone().lerp(NIGHT_CLOUD_COLOR, initialNightMix),
      transparent: true,
      opacity: THREE.MathUtils.lerp(0.84, 0.32, initialNightMix),
      depthWrite: false,
      roughness: 0.96,
      metalness: 0.0,
    });
    const cloudSphereMesh = new THREE.Mesh(cloudSphereGeo, cloudSphereMat);
    globePivot.add(cloudSphereMesh);
    geometries.push(cloudSphereGeo);
    materials.push(cloudSphereMat);

    // Subtle Atmospheric Fresnel Halo Shell (outer sky glow around globe limb)
    const atmosGeo = new THREE.SphereGeometry(globeRadius * 1.085, 48, 32);
    const atmosUniforms = {
      uGlowColor: { value: DAY_ATMOS_COLOR.clone().lerp(NIGHT_ATMOS_COLOR, initialNightMix) },
      uIntensity: { value: THREE.MathUtils.lerp(0.68, 0.85, initialNightMix) },
    };
    const atmosMat = new THREE.ShaderMaterial({
      uniforms: atmosUniforms,
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewDir;
        void main() {
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          vNormal = normalize(normalMatrix * normal);
          vViewDir = normalize(-mvPos.xyz);
          gl_Position = projectionMatrix * mvPos;
        }
      `,
      fragmentShader: `
        uniform vec3 uGlowColor;
        uniform float uIntensity;
        varying vec3 vNormal;
        varying vec3 vViewDir;
        void main() {
          float rim = pow(clamp(-dot(vNormal, vViewDir) / 0.44, 0.0, 1.0), 2.1);
          gl_FragColor = vec4(uGlowColor, rim * uIntensity);
        }
      `,
      side: THREE.BackSide,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      fog: false,
    });
    const atmosMesh = new THREE.Mesh(atmosGeo, atmosMat);
    worldAnchor.add(atmosMesh);
    geometries.push(atmosGeo);
    materials.push(atmosMat);

    // Distant Orbiting Stylized Fluffy Clouds in the Sky
    const cloudRingGroup = new THREE.Group();
    scene.add(cloudRingGroup);

    const cloudPuffGeo = new THREE.SphereGeometry(0.2, 14, 12);
    const skyCloudMat = new THREE.MeshStandardMaterial({
      color: DAY_CLOUD_COLOR.clone().lerp(NIGHT_CLOUD_COLOR, initialNightMix),
      roughness: 0.94,
      metalness: 0.0,
      transparent: true,
      opacity: THREE.MathUtils.lerp(0.9, 0.3, initialNightMix),
    });
    geometries.push(cloudPuffGeo);
    materials.push(skyCloudMat);

    const cloudConfigs = [
      { angle: 0.2, y: 1.25, dist: 3.2, scale: 1.12, speed: 0.065 },
      { angle: 1.1, y: -0.95, dist: 3.5, scale: 0.95, speed: 0.052 },
      { angle: 2.0, y: 1.55, dist: 4.1, scale: 1.32, speed: 0.045 },
      { angle: 2.9, y: -0.4, dist: 3.1, scale: 0.85, speed: 0.07 },
      { angle: 3.8, y: 0.85, dist: 3.8, scale: 1.2, speed: 0.058 },
      { angle: 4.6, y: -1.3, dist: 4.3, scale: 1.28, speed: 0.042 },
      { angle: 5.4, y: 1.8, dist: 3.6, scale: 1.02, speed: 0.064 },
      { angle: 6.0, y: 0.2, dist: 4.6, scale: 1.35, speed: 0.038 },
    ];
    const cloudClusters: { pivot: THREE.Group; speed: number }[] = [];

    cloudConfigs.forEach((cfg) => {
      const orbitPivot = new THREE.Group();
      const cluster = new THREE.Group();

      const p1 = new THREE.Mesh(cloudPuffGeo, skyCloudMat);
      p1.scale.set(1.35, 0.85, 0.95);
      const p2 = new THREE.Mesh(cloudPuffGeo, skyCloudMat);
      p2.position.set(0.22, -0.04, 0.03);
      p2.scale.set(0.95, 0.72, 0.82);
      const p3 = new THREE.Mesh(cloudPuffGeo, skyCloudMat);
      p3.position.set(-0.22, -0.05, -0.02);
      p3.scale.set(0.9, 0.68, 0.8);
      const p4 = new THREE.Mesh(cloudPuffGeo, skyCloudMat);
      p4.position.set(0.04, 0.12, 0.02);
      p4.scale.set(0.88, 0.82, 0.78);

      cluster.add(p1, p2, p3, p4);
      cluster.scale.setScalar(cfg.scale);
      cluster.position.set(cfg.dist, cfg.y, 0);
      cluster.lookAt(0, cfg.y, 0);

      orbitPivot.rotation.y = cfg.angle;
      orbitPivot.add(cluster);
      cloudRingGroup.add(orbitPivot);
      cloudClusters.push({ pivot: orbitPivot, speed: cfg.speed });
    });

    // Thailand Origin Beacon + Flight Arcs + 3D Country Landmarks & Flag Sprites
    const clickableMeshes: THREE.Mesh[] = [];
    const pinGroups: Record<
      string,
      {
        group: THREE.Group;
        glowMaterials: THREE.MeshStandardMaterial[];
        haloMat: THREE.MeshBasicMaterial;
        haloMesh: THREE.Mesh;
        sprite: THREE.Sprite;
        spriteCanvas: HTMLCanvasElement;
        spriteTex: THREE.CanvasTexture;
        country: CountryWorld;
      }
    > = {};

    const originPos = latLngToVector3(
      THAILAND_ORIGIN.lat,
      THAILAND_ORIGIN.lng,
      globeRadius + 0.012,
      new THREE.Vector3(),
    );

    const homeRingGeo = new THREE.RingGeometry(0.04, 0.072, 24);
    const homeRingMat = new THREE.MeshBasicMaterial({
      color: '#24B8B0',
      side: THREE.DoubleSide,
    });
    const homeRing = new THREE.Mesh(homeRingGeo, homeRingMat);
    homeRing.position.copy(originPos);
    homeRing.lookAt(originPos.clone().multiplyScalar(2));
    globePivot.add(homeRing);
    geometries.push(homeRingGeo);
    materials.push(homeRingMat);

    const haloRingGeo = new THREE.RingGeometry(0.115, 0.155, 28);
    const flagPoleGeo = new THREE.CylinderGeometry(0.008, 0.01, 0.24, 8);
    const poleFinialGeo = new THREE.SphereGeometry(0.016, 10, 10);
    const poleMat = new THREE.MeshStandardMaterial({
      color: '#F7F9FC',
      roughness: 0.3,
      metalness: 0.4,
    });
    const finialGoldMat = new THREE.MeshStandardMaterial({
      color: '#F2C66D',
      emissive: '#F2C66D',
      emissiveIntensity: 0.3,
      roughness: 0.25,
      metalness: 0.75,
    });
    const hitSphereGeo = new THREE.SphereGeometry(0.32, 10, 10);
    const hitSphereMat = new THREE.MeshBasicMaterial({ visible: false });
    geometries.push(haloRingGeo, flagPoleGeo, poleFinialGeo, hitSphereGeo);
    materials.push(poleMat, finialGoldMat, hitSphereMat);

    countries.forEach((country) => {
      const surfacePos = latLngToVector3(
        country.coordinates.lat,
        country.coordinates.lng,
        globeRadius,
        new THREE.Vector3(),
      );
      const normalDir = surfacePos.clone().normalize();

      const pinGroup = new THREE.Group();
      pinGroup.position.copy(surfacePos);
      pinGroup.quaternion.setFromUnitVectors(_upAxis, normalDir);

      // Ground glow ring under landmark miniature
      const haloMat = new THREE.MeshBasicMaterial({
        color: country.themeColors.accent,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide,
      });
      materials.push(haloMat);
      const haloMesh = new THREE.Mesh(haloRingGeo, haloMat);
      haloMesh.rotation.x = -Math.PI / 2;
      haloMesh.position.y = 0.006;

      // Iconic 3D Miniature Landmark for each country
      const landmark = createCountryLandmarkMiniature(country.id);
      landmark.geometries.forEach((g) => geometries.push(g));
      landmark.materials.forEach((m) => materials.push(m));

      // Flagpole + Crisp Camera-Facing Flag & Country Name Banner Sprite
      const pole = new THREE.Mesh(flagPoleGeo, poleMat);
      pole.position.set(0.095, 0.125, 0.02);
      const finial = new THREE.Mesh(poleFinialGeo, finialGoldMat);
      finial.position.set(0.095, 0.25, 0.02);

      const spriteCanvas = document.createElement('canvas');
      spriteCanvas.width = 300;
      spriteCanvas.height = 100;
      paintFlagBannerCanvas(
        spriteCanvas,
        country.id,
        country.countryName[languageRef.current],
        country.id === selectedIdRef.current,
      );
      const spriteTex = new THREE.CanvasTexture(spriteCanvas);
      spriteTex.colorSpace = THREE.SRGBColorSpace;
      textures.push(spriteTex);

      const spriteMat = new THREE.SpriteMaterial({
        map: spriteTex,
        transparent: true,
        depthTest: true,
        depthWrite: false,
      });
      materials.push(spriteMat);

      const sprite = new THREE.Sprite(spriteMat);
      sprite.position.set(0, 0.34, 0);
      sprite.scale.set(0.56, 0.188, 1);
      sprite.visible = sceneModeRef.current === 'map';

      // Invisible Layer-1 Click Hitbox covering Landmark + Flag
      const hitProxy = new THREE.Mesh(hitSphereGeo, hitSphereMat);
      hitProxy.position.y = 0.2;
      hitProxy.userData.countryId = country.id;
      hitProxy.layers.set(1);
      clickableMeshes.push(hitProxy);

      pinGroup.add(haloMesh, landmark.root, pole, finial, sprite, hitProxy);
      globePivot.add(pinGroup);

      pinGroups[country.id] = {
        group: pinGroup,
        glowMaterials: landmark.glowMaterials,
        haloMat,
        haloMesh,
        sprite,
        spriteCanvas,
        spriteTex,
        country,
      };

      // Travel Flight Arc from Thailand
      const midPoint = originPos
        .clone()
        .add(surfacePos)
        .multiplyScalar(0.5)
        .normalize()
        .multiplyScalar(globeRadius + 0.34);
      const curve = new THREE.QuadraticBezierCurve3(
        originPos.clone(),
        midPoint,
        surfacePos.clone(),
      );
      const arcGeo = new THREE.TubeGeometry(curve, 24, 0.011, 6, false);
      const arcMat = new THREE.MeshBasicMaterial({
        color: '#24B8B0',
        transparent: true,
        opacity: 0.6,
      });
      const arcMesh = new THREE.Mesh(arcGeo, arcMat);
      arcMesh.userData.arcCountryId = country.id;
      globePivot.add(arcMesh);
      geometries.push(arcGeo);
      materials.push(arcMat);
    });

    // Expose instant localized badge repaint callback
    refreshBadgesRef.current = () => {
      const lang = languageRef.current;
      const activeId = selectedIdRef.current;
      const showLabels = sceneModeRef.current === 'map';
      Object.values(pinGroups).forEach((entry) => {
        paintFlagBannerCanvas(
          entry.spriteCanvas,
          entry.country.id,
          entry.country.countryName[lang],
          entry.country.id === activeId,
        );
        entry.spriteTex.needsUpdate = true;
        entry.sprite.visible = showLabels;
      });
    };

    // Raycaster on Layer 1
    const raycaster = new THREE.Raycaster();
    raycaster.layers.set(1);
    const pointer = new THREE.Vector2();
    let lastMove = 0;

    const updatePointer = (clientX: number, clientY: number) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (sceneModeRef.current !== 'map') {
        renderer.domElement.style.cursor = 'grab';
        setHoveredCountryId(null);
        return;
      }
      const now = performance.now();
      if (now - lastMove < 50) return;
      lastMove = now;
      updatePointer(e.clientX, e.clientY);
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(clickableMeshes, false);
      if (hits.length > 0) {
        const cid = hits[0].object.userData.countryId as CountryId;
        renderer.domElement.style.cursor = 'pointer';
        setHoveredCountryId(cid);
      } else {
        renderer.domElement.style.cursor = 'grab';
        setHoveredCountryId(null);
      }
    };

    let downPos = { x: 0, y: 0 };
    const onPointerDown = (e: PointerEvent) => {
      downPos = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = (e: PointerEvent) => {
      if (sceneModeRef.current !== 'map') return;
      const dx = e.clientX - downPos.x;
      const dy = e.clientY - downPos.y;
      if (Math.hypot(dx, dy) > 8) return;
      updatePointer(e.clientX, e.clientY);
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(clickableMeshes, false);
      if (hits.length > 0) {
        const cid = hits[0].object.userData.countryId as CountryId;
        onSelectRef.current(cid);
      }
    };

    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointerup', onPointerUp);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Compute camera-aware globe focus quaternion keeping North upright
    const computeFocusQuaternion = (lat: number, lng: number, outQuat: THREE.Quaternion) => {
      _workVecA.copy(camera.position).normalize();
      const camAzimuth = Math.atan2(_workVecA.x, _workVecA.z);
      const camLat = Math.asin(THREE.MathUtils.clamp(_workVecA.y, -0.95, 0.95));

      const yaw = camAzimuth - (lng + 90) * (Math.PI / 180);
      const pitch = THREE.MathUtils.clamp(
        (lat * (Math.PI / 180) - camLat) * 0.65,
        -0.55,
        0.55,
      );

      // Horizontal right axis relative to current camera azimuth
      _rightAxis.set(Math.cos(camAzimuth), 0, -Math.sin(camAzimuth)).normalize();
      _quatYaw.setFromAxisAngle(_upAxis, yaw);
      _quatPitch.setFromAxisAngle(_rightAxis, pitch);
      outQuat.multiplyQuaternions(_quatPitch, _quatYaw);
    };

    const initialCountry = countries.find((c) => c.id === selectedIdRef.current);
    if (initialCountry) {
      computeFocusQuaternion(
        initialCountry.coordinates.lat,
        initialCountry.coordinates.lng,
        globePivot.quaternion,
      );
    }

    let frameId = 0;
    let disposed = false;
    let currentNightMix = initialNightMix;
    let prevAppliedMix = -1;
    let prevMode: 'title' | 'map' = sceneModeRef.current;
    const clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync?.(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      if (!sync) {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      gl.flush();
      const poll = () => {
        if (disposed) {
          gl.deleteSync(sync);
          return;
        }
        const state = gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    const tick = () => {
      if (disposed) return;
      const dt = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();
      const targetNightMix = appearanceRef.current === 'night' ? 1 : 0;

      // Smooth Day <-> Night transition
      if (reducedMotionRef.current) {
        currentNightMix = targetNightMix;
      } else {
        currentNightMix = THREE.MathUtils.damp(currentNightMix, targetNightMix, 2.5, dt);
        if (Math.abs(currentNightMix - targetNightMix) < 0.002) {
          currentNightMix = targetNightMix;
        }
      }

      if (Math.abs(currentNightMix - prevAppliedMix) > 0.0005) {
        prevAppliedMix = currentNightMix;
        updateSkyDomeColors(currentNightMix);

        if (scene.background instanceof THREE.Color) {
          scene.background.copy(DAY_SKY_BOTTOM).lerp(NIGHT_SKY_BOTTOM, currentNightMix);
        }
        fog.color.copy(DAY_FOG_COLOR).lerp(NIGHT_FOG_COLOR, currentNightMix);

        hemiLight.color.copy(DAY_HEMI_SKY).lerp(NIGHT_HEMI_SKY, currentNightMix);
        hemiLight.groundColor.copy(DAY_HEMI_GROUND).lerp(NIGHT_HEMI_GROUND, currentNightMix);
        hemiLight.intensity = THREE.MathUtils.lerp(1.25, 0.58, currentNightMix);

        keyLight.color.copy(DAY_KEY_COLOR).lerp(NIGHT_KEY_COLOR, currentNightMix);
        keyLight.intensity = THREE.MathUtils.lerp(2.15, 1.05, currentNightMix);
        _workVecA.copy(DAY_KEY_POS).lerp(NIGHT_KEY_POS, currentNightMix);
        keyLight.position.copy(_workVecA);

        rimLight.color.copy(DAY_RIM_COLOR).lerp(NIGHT_RIM_COLOR, currentNightMix);
        rimLight.intensity = THREE.MathUtils.lerp(0.85, 0.98, currentNightMix);

        scene.environmentIntensity = THREE.MathUtils.lerp(0.92, 0.52, currentNightMix);

        globeMat.emissiveIntensity = currentNightMix * 1.2;

        cloudSphereMat.color.copy(DAY_CLOUD_COLOR).lerp(NIGHT_CLOUD_COLOR, currentNightMix);
        cloudSphereMat.opacity = THREE.MathUtils.lerp(0.84, 0.32, currentNightMix);

        atmosUniforms.uGlowColor.value
          .copy(DAY_ATMOS_COLOR)
          .lerp(NIGHT_ATMOS_COLOR, currentNightMix);
        atmosUniforms.uIntensity.value = THREE.MathUtils.lerp(0.68, 0.85, currentNightMix);

        skyCloudMat.color.copy(DAY_CLOUD_COLOR).lerp(NIGHT_CLOUD_COLOR, currentNightMix);
        skyCloudMat.opacity = THREE.MathUtils.lerp(0.9, 0.3, currentNightMix);

        starMat.opacity = currentNightMix * 0.94;
        starField.visible = currentNightMix > 0.02;

        moonMat.opacity = currentNightMix;
        moonHaloMat.opacity = currentNightMix * 0.25;
        moonGroup.visible = currentNightMix > 0.02;
        moonGroup.scale.setScalar(Math.max(0.01, currentNightMix));
        moonGroup.position.y = THREE.MathUtils.lerp(1.6, 3.6, currentNightMix);
      }

      // Smooth camera & anchor choreography between Title Screen and World Map
      const isTitle = sceneModeRef.current === 'title';
      if (prevMode !== sceneModeRef.current) {
        prevMode = sceneModeRef.current;
        if (!isTitle) {
          const c = countries.find((item) => item.id === selectedIdRef.current);
          if (c) {
            targetFocusRef.current = {
              lat: c.coordinates.lat,
              lng: c.coordinates.lng,
              active: true,
            };
          }
        }
        refreshBadgesRef.current?.();
      }

      const targetOffsetX = isTitle && (container.clientWidth || 1000) >= 900 ? 1.15 : 0;
      const targetCamZ = isTitle ? 6.6 : 5.25;

      if (reducedMotionRef.current) {
        worldAnchor.position.x = targetOffsetX;
        worldAnchor.position.y = 0;
      } else {
        worldAnchor.position.x = THREE.MathUtils.damp(
          worldAnchor.position.x,
          targetOffsetX,
          4.0,
          dt,
        );
        worldAnchor.position.y = Math.sin(elapsed * 1.15) * 0.08;
      }

      // Smoothly ease camera distance when switching Title <-> Map
      const currentDist = camera.position.length();
      if (Math.abs(currentDist - targetCamZ) > 0.05 && !targetFocusRef.current.active) {
        const nextDist = reducedMotionRef.current
          ? targetCamZ
          : THREE.MathUtils.damp(currentDist, targetCamZ, 3.2, dt);
        camera.position.setLength(nextDist);
      }

      // Clouds & Earth cloud layer gentle drift
      if (!reducedMotionRef.current) {
        cloudSphereMesh.rotation.y += dt * 0.016;
        cloudClusters.forEach((c) => {
          c.pivot.rotation.y += dt * c.speed;
        });
        if (starField.visible) {
          starField.rotation.y += dt * 0.014;
        }
      }

      // Globe rotation: scenic spin on Title, smooth focus on Map
      if (!isTitle && targetFocusRef.current.active) {
        computeFocusQuaternion(
          targetFocusRef.current.lat,
          targetFocusRef.current.lng,
          _targetQuat,
        );
        if (reducedMotionRef.current) {
          globePivot.quaternion.copy(_targetQuat);
          targetFocusRef.current.active = false;
        } else {
          _quatA.copy(globePivot.quaternion);
          _quatA.slerp(_targetQuat, 1 - Math.exp(-5.8 * dt));
          globePivot.quaternion.copy(_quatA);
          if (_quatA.angleTo(_targetQuat) < 0.004) {
            targetFocusRef.current.active = false;
          }
        }
      } else if (!reducedMotionRef.current && !isSoftwareGl) {
        globePivot.rotation.y += dt * (isTitle ? 0.14 : 0.032);
      }

      // Decay country selection bounce
      if (selectBounceRef.current > 0.001) {
        selectBounceRef.current = reducedMotionRef.current
          ? 0
          : THREE.MathUtils.damp(selectBounceRef.current, 0, 7, dt);
      }

      const activeId = selectedIdRef.current;
      Object.entries(pinGroups).forEach(([cid, entry]) => {
        const isActive = cid === activeId && !isTitle;
        const bounce = isActive ? selectBounceRef.current * 0.34 : 0;
        const targetScale = (isActive ? 1.32 : isTitle ? 0.88 : 0.96) + bounce;
        const currentScale = entry.group.scale.x;
        const nextScale = reducedMotionRef.current
          ? targetScale
          : THREE.MathUtils.damp(currentScale, targetScale, 9, dt);
        entry.group.scale.setScalar(nextScale);

        // Pulse ground ring & illuminate landmark glow on Night or Selected
        const nightBoost = THREE.MathUtils.lerp(0.15, 0.85, currentNightMix);
        const pulse = reducedMotionRef.current ? 0 : Math.sin(elapsed * 3.2) * 0.14;

        entry.haloMat.opacity = isActive ? 0.88 : THREE.MathUtils.lerp(0.32, 0.62, currentNightMix);
        const haloScale = isActive ? 1.18 + Math.sin(elapsed * 3.2) * 0.08 : 0.95;
        entry.haloMesh.scale.setScalar(haloScale);

        entry.glowMaterials.forEach((mat) => {
          mat.emissiveIntensity = isActive
            ? 0.45 + nightBoost * 0.45 + pulse
            : 0.12 + nightBoost * 0.35;
        });

        // Subtle label pop on active destination
        const spriteW = isActive ? 0.64 : 0.54;
        const spriteH = isActive ? 0.214 : 0.18;
        entry.sprite.scale.set(spriteW, spriteH, 1);
      });

      globePivot.children.forEach((child) => {
        if (child instanceof THREE.Mesh && child.userData.arcCountryId) {
          const mat = child.material as THREE.MeshBasicMaterial;
          const isActive = child.userData.arcCountryId === activeId && !isTitle;
          const dayColor = isActive ? '#F2C66D' : '#24B8B0';
          const nightColor = isActive ? '#FF9478' : '#F2C66D';
          _workColorA.set(dayColor);
          _workColorB.set(nightColor);
          mat.color.copy(_workColorA).lerp(_workColorB, currentNightMix);
          mat.opacity = isActive ? 0.92 : THREE.MathUtils.lerp(0.38, 0.55, currentNightMix);
        }
      });

      _workVecB.set(0, 0, 0);

      controls.update();
      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    };

    tick();

    return () => {
      disposed = true;
      refreshBadgesRef.current = null;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      controls.dispose();
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());
      envTarget.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [countries]);

  const hoveredCountry =
    sceneMode === 'map' ? countries.find((c) => c.id === hoveredCountryId) : undefined;

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div
        ref={mountRef}
        className="h-full w-full"
        aria-label={
          language === 'en'
            ? 'Interactive 3D VoxVoyage Floating World Globe'
            : 'ลูกโลก 3 มิติ VoxVoyage'
        }
      />

      {hoveredCountry && (
        <div className="pointer-events-none absolute top-20 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 rounded-xl bg-[#131E31]/92 px-3.5 py-2 text-xs font-semibold text-[#F7F9FC] border border-[#F2C66D]/55 shadow-lg">
          <CountryFlagBadge countryId={hoveredCountry.id} className="h-4 w-6 shrink-0" />
          <span>{hoveredCountry.countryName[language]}</span>
          <span className="text-white/40">·</span>
          <span className="text-[#24B8B0]">{hoveredCountry.title[language]}</span>
        </div>
      )}
    </div>
  );
}
