import { useEffect, useRef, type MutableRefObject } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import type { AvatarConfig, ResolvedAppearance } from '../../types/game';
import {
  AUSTRALIA_BOUNDS,
  AUSTRALIA_INTERACTIVE_TARGETS,
  AUSTRALIA_NPC_POSITIONS,
  AUSTRALIA_SPAWN,
  type AustraliaNpcId,
  type AustraliaPoiId,
} from '../../data/australiaWorld';
import { findNearestAustraliaPoi, resolveAustraliaCollision } from '../../utils/australiaCollision';
import {
  createProceduralAvatarRig,
  disposeObjectGeometries,
} from '../avatar/proceduralAvatarRig';
import {
  createAwningStripeTexture,
  createBoardwalkPlankTexture,
  createCoastalPalmRig,
  createHarbourGullRig,
  createParkLawnTexture,
  createSandstonePlazaTexture,
  createSydneyNpcRig,
  createSydneySignTexture,
  createTimetableBoardTexture,
  type CoastalPalmRig,
  type HarbourGullRig,
  type SydneyNpcRig,
} from './sydneyProceduralModels';
import type { JoystickVector } from '../india/VirtualJoystick';
import type {
  ActiveAutoWalkRequest,
  ActiveQuickTravelRequest,
  NavPoint2D,
} from '../../utils/worldNavigation';

export interface SydneySceneProps {
  avatar: AvatarConfig;
  appearance: ResolvedAppearance;
  reducedMotion: boolean;
  cameraSensitivity: number;
  paused: boolean;
  visitedPoiIds: AustraliaPoiId[];
  guidedPoiId?: AustraliaPoiId | null;
  activeNpcId?: AustraliaNpcId | null;
  interactGestureSeq: number;
  joystickRef: MutableRefObject<JoystickVector>;
  autoWalkRequest?: ActiveAutoWalkRequest | null;
  quickTravelRequest?: ActiveQuickTravelRequest | null;
  onPositionChange?: (pos: NavPoint2D) => void;
  onAutoWalkComplete?: (result: { targetId: string; status: 'arrived' | 'unreachable' }) => void;
  onManualInterrupt?: () => void;
  onNearestPoiChange: (poiId: AustraliaPoiId | null) => void;
  onActivatePoi?: (poiId: AustraliaPoiId) => void;
  onWebGLFailure: () => void;
}

const _colorA = new THREE.Color();
const _vecA = new THREE.Vector3();

// Bright Coastal Sydney Sun & Twilight Harbour Night
const DAY_SKY_TOP = new THREE.Color('#1E88E5');
const DAY_SKY_BOTTOM = new THREE.Color('#BDE7FA');
const NIGHT_SKY_TOP = new THREE.Color('#081229');
const NIGHT_SKY_BOTTOM = new THREE.Color('#1C2D54');

const DAY_FOG = new THREE.Color('#BEE4F7');
const NIGHT_FOG = new THREE.Color('#142244');

const DAY_HEMI_SKY = new THREE.Color('#E8F6FF');
const NIGHT_HEMI_SKY = new THREE.Color('#6488D4');
const DAY_HEMI_GROUND = new THREE.Color('#8E826C');
const NIGHT_HEMI_GROUND = new THREE.Color('#1B2435');

const DAY_KEY_COLOR = new THREE.Color('#FFF7E2');
const NIGHT_KEY_COLOR = new THREE.Color('#B5D1FF');
const DAY_KEY_POS = new THREE.Vector3(22, 28, 16);
const NIGHT_KEY_POS = new THREE.Vector3(-18, 22, 14);

const DAY_CLOUD_COLOR = new THREE.Color('#FFFFFF');
const NIGHT_CLOUD_COLOR = new THREE.Color('#3D5082');

const DAY_WATER_COLOR = new THREE.Color('#0E84B8');
const NIGHT_WATER_COLOR = new THREE.Color('#0C3658');

const WALK_SPEED = 4.7;

function shortestAngleDiff(current: number, target: number): number {
  let diff = ((target - current + Math.PI) % (Math.PI * 2)) - Math.PI;
  if (diff < -Math.PI) diff += Math.PI * 2;
  return diff;
}

function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(64, 64, 6, 64, 64, 62);
    grad.addColorStop(0, 'rgba(18, 26, 40, 0.42)');
    grad.addColorStop(0.55, 'rgba(18, 26, 40, 0.16)');
    grad.addColorStop(1, 'rgba(18, 26, 40, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createCloudCluster(material: THREE.Material): THREE.Group {
  const cloud = new THREE.Group();
  const puffs: [number, number, number, number][] = [
    [0, 0, 0, 1.5],
    [-1.25, -0.15, 0.1, 1.0],
    [1.25, -0.1, -0.1, 1.05],
    [0.2, 0.45, 0.1, 0.85],
  ];
  const geo = new THREE.SphereGeometry(1, 12, 9);
  puffs.forEach(([px, py, pz, s]) => {
    const m = new THREE.Mesh(geo, material);
    m.position.set(px, py, pz);
    m.scale.set(s * 1.4, s * 0.72, s * 0.96);
    cloud.add(m);
  });
  return cloud;
}

function createSailboatGroup(hullHex: number, sailHex: number): THREE.Group {
  const boat = new THREE.Group();
  const hullMat = new THREE.MeshStandardMaterial({ color: hullHex, roughness: 0.45 });
  const deckMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.55 });
  const mastMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.5 });
  const sailMat = new THREE.MeshStandardMaterial({
    color: sailHex,
    roughness: 0.7,
    side: THREE.DoubleSide,
  });

  const hull = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.42, 3.0), hullMat);
  hull.position.y = 0.2;
  boat.add(hull);

  const cabin = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.28, 1.3), deckMat);
  cabin.position.set(0, 0.52, -0.2);
  boat.add(cabin);

  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 3.2, 8), mastMat);
  mast.position.set(0, 1.9, 0.1);
  boat.add(mast);

  const mainSail = new THREE.Mesh(new THREE.ConeGeometry(1.2, 2.5, 3), sailMat);
  mainSail.scale.set(0.08, 1, 1.15);
  mainSail.position.set(0, 2.1, -0.55);
  boat.add(mainSail);

  return boat;
}

export default function SydneyExplorationScene({
  avatar,
  appearance,
  reducedMotion,
  cameraSensitivity,
  paused,
  visitedPoiIds,
  guidedPoiId = null,
  activeNpcId = null,
  interactGestureSeq,
  joystickRef,
  autoWalkRequest = null,
  quickTravelRequest = null,
  onPositionChange,
  onAutoWalkComplete,
  onManualInterrupt,
  onNearestPoiChange,
  onActivatePoi,
  onWebGLFailure,
}: SydneySceneProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const appearanceRef = useRef(appearance);
  appearanceRef.current = appearance;
  const reducedMotionRef = useRef(reducedMotion);
  reducedMotionRef.current = reducedMotion;
  const sensitivityRef = useRef(cameraSensitivity);
  sensitivityRef.current = cameraSensitivity;
  const pausedRef = useRef(paused);
  pausedRef.current = paused;
  const visitedRef = useRef<Set<AustraliaPoiId>>(new Set(visitedPoiIds));
  visitedRef.current = new Set(visitedPoiIds);
  const guidedPoiRef = useRef<AustraliaPoiId | null>(guidedPoiId);
  guidedPoiRef.current = guidedPoiId;
  const activeNpcRef = useRef<AustraliaNpcId | null>(activeNpcId);
  activeNpcRef.current = activeNpcId;
  const autoWalkRef = useRef<ActiveAutoWalkRequest | null>(autoWalkRequest);
  autoWalkRef.current = autoWalkRequest;
  const quickTravelRef = useRef<ActiveQuickTravelRequest | null>(quickTravelRequest);
  quickTravelRef.current = quickTravelRequest;

  const onPositionRef = useRef(onPositionChange);
  onPositionRef.current = onPositionChange;
  const onAutoWalkCompleteRef = useRef(onAutoWalkComplete);
  onAutoWalkCompleteRef.current = onAutoWalkComplete;
  const onManualInterruptRef = useRef(onManualInterrupt);
  onManualInterruptRef.current = onManualInterrupt;
  const onNearestPoiRef = useRef(onNearestPoiChange);
  onNearestPoiRef.current = onNearestPoiChange;
  const onActivatePoiRef = useRef(onActivatePoi);
  onActivatePoiRef.current = onActivatePoi;
  const onFailureRef = useRef(onWebGLFailure);
  onFailureRef.current = onWebGLFailure;

  const playerRigRef = useRef<ReturnType<typeof createProceduralAvatarRig> | null>(null);
  const prevAvatarStructRef = useRef<string>('');
  const interactTimerRef = useRef(0);

  useEffect(() => {
    if (interactGestureSeq > 0) {
      interactTimerRef.current = 1.1;
    }
  }, [interactGestureSeq]);

  useEffect(() => {
    const rig = playerRigRef.current;
    if (!rig) return;
    const structKey = `${avatar.modelId}:${avatar.hairStyle}:${avatar.outfitId}`;
    if (structKey !== prevAvatarStructRef.current) {
      rig.rebuild(avatar);
      prevAvatarStructRef.current = structKey;
    } else {
      rig.updateColors(avatar);
    }
  }, [avatar]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = Math.max(container.clientWidth, 320);
    const height = Math.max(container.clientHeight, 320);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: 'high-performance',
        alpha: false,
      });
    } catch {
      onFailureRef.current();
      return;
    }

    const gl = renderer.getContext();
    let isSoftwareGl = false;
    try {
      const dbg = gl.getExtension('WEBGL_debug_renderer_info');
      const rName = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : '';
      isSoftwareGl = /SwiftShader|llvmpipe|Software Rasterizer|Microsoft Basic/i.test(rName);
    } catch {
      isSoftwareGl = false;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isSoftwareGl ? 1.25 : 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.06;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.touchAction = 'none';
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      onFailureRef.current();
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost, false);

    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(
      appearanceRef.current === 'night' ? NIGHT_FOG.getHex() : DAY_FOG.getHex(),
      0.0068,
    );

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTarget = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;
    scene.environmentIntensity = 0.72;

    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 200);

    // Sky Dome Shader
    const skyGeo = new THREE.SphereGeometry(120, 32, 20);
    const skyUniforms = {
      topColor: { value: appearanceRef.current === 'night' ? NIGHT_SKY_TOP.clone() : DAY_SKY_TOP.clone() },
      bottomColor: { value: appearanceRef.current === 'night' ? NIGHT_SKY_BOTTOM.clone() : DAY_SKY_BOTTOM.clone() },
    };
    const skyMat = new THREE.ShaderMaterial({
      uniforms: skyUniforms,
      side: THREE.BackSide,
      depthWrite: false,
      vertexShader: `
        varying vec3 vWorldPos;
        void main() {
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vWorldPos = wp.xyz;
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,
      fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 bottomColor;
        varying vec3 vWorldPos;
        void main() {
          float h = clamp(normalize(vWorldPos).y * 0.9 + 0.12, 0.0, 1.0);
          gl_FragColor = vec4(mix(bottomColor, topColor, pow(h, 0.75)), 1.0);
        }
      `,
    });
    const skyDome = new THREE.Mesh(skyGeo, skyMat);
    scene.add(skyDome);

    // Twinkling harbour stars (Night)
    const starPositions = new Float32Array(260 * 3);
    for (let i = 0; i < 260; i++) {
      const theta = ((i * 137.5) % 360) * (Math.PI / 180);
      const phi = Math.acos(0.18 + ((i * 29) % 75) / 100);
      const r = 88;
      starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = r * Math.cos(phi);
      starPositions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xe6f0ff,
      size: 0.52,
      transparent: true,
      opacity: appearanceRef.current === 'night' ? 0.85 : 0,
      depthWrite: false,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // Coastal Sydney Lighting
    const hemiLight = new THREE.HemisphereLight(
      appearanceRef.current === 'night' ? NIGHT_HEMI_SKY.getHex() : DAY_HEMI_SKY.getHex(),
      appearanceRef.current === 'night' ? NIGHT_HEMI_GROUND.getHex() : DAY_HEMI_GROUND.getHex(),
      appearanceRef.current === 'night' ? 0.56 : 0.9,
    );
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(
      appearanceRef.current === 'night' ? NIGHT_KEY_COLOR.getHex() : DAY_KEY_COLOR.getHex(),
      appearanceRef.current === 'night' ? 0.92 : 1.78,
    );
    keyLight.position.copy(appearanceRef.current === 'night' ? NIGHT_KEY_POS : DAY_KEY_POS);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.near = 2;
    keyLight.shadow.camera.far = 85;
    keyLight.shadow.camera.left = -25;
    keyLight.shadow.camera.right = 25;
    keyLight.shadow.camera.top = 25;
    keyLight.shadow.camera.bottom = -25;
    keyLight.shadow.bias = -0.0007;
    scene.add(keyLight);

    // Clouds
    const cloudMat = new THREE.MeshStandardMaterial({
      color: appearanceRef.current === 'night' ? NIGHT_CLOUD_COLOR.getHex() : DAY_CLOUD_COLOR.getHex(),
      roughness: 0.95,
      metalness: 0,
    });
    const clouds: { group: THREE.Group; baseX: number; speed: number }[] = [];
    const cloudSpots: [number, number, number, number][] = [
      [-26, 22, -26, 0.35],
      [6, 25, -34, 0.25],
      [28, 21, -22, 0.3],
      [-14, 24, 12, 0.22],
    ];
    cloudSpots.forEach(([cx, cy, cz, speed]) => {
      const c = createCloudCluster(cloudMat);
      c.position.set(cx, cy, cz);
      scene.add(c);
      clouds.push({ group: c, baseX: cx, speed });
    });

    // Textures
    const sandstoneTex = createSandstonePlazaTexture(maxAnisotropy);
    const boardwalkTex = createBoardwalkPlankTexture(maxAnisotropy);
    const lawnTex = createParkLawnTexture(maxAnisotropy);
    const awningTex = createAwningStripeTexture('#EA580C', '#FFF7ED', maxAnisotropy);
    const timetableTex = createTimetableBoardTexture(maxAnisotropy);
    const transitSignTex = createSydneySignTexture(
      'CITY TRANSIT STATION',
      'Trains · Ferries · Platforms 1–4',
      '#1E3A8A',
      '#38BDF8',
      maxAnisotropy,
    );
    const cafeSignTex = createSydneySignTexture(
      'HARBOUR MARKET & CAFE',
      'Fresh Pastries · Smoothies · Coffee',
      '#7C2D12',
      '#FB923C',
      maxAnisotropy,
    );
    const darlingSignTex = createSydneySignTexture(
      'DARLING HARBOUR HUB',
      'Visitor Info · Tours · Aquarium',
      '#4C1D95',
      '#2DD4BF',
      maxAnisotropy,
    );
    const helpSignTex = createSydneySignTexture(
      'HELP POINT · INFO',
      'Maps · Directions · Assistance',
      '#065F46',
      '#F2C66D',
      maxAnisotropy,
    );
    const shadowTex = createContactShadowTexture();

    // Ground: Sydney Sandstone Esplanade (Walkable Terrain)
    const groundMat = new THREE.MeshStandardMaterial({
      map: sandstoneTex,
      roughness: 0.88,
      metalness: 0.04,
    });
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(52, 42), groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(0, 0, 2.5);
    ground.receiveShadow = true;
    scene.add(ground);

    // Waterfront Timber Boardwalk along the north seawall (z = -12.8)
    const boardwalkMat = new THREE.MeshStandardMaterial({
      map: boardwalkTex,
      roughness: 0.78,
    });
    const boardwalk = new THREE.Mesh(new THREE.BoxGeometry(44, 0.06, 3.2), boardwalkMat);
    boardwalk.position.set(0, 0.03, -12.3);
    boardwalk.receiveShadow = true;
    scene.add(boardwalk);

    // Green Harbour Gardens lawn patch (NW corner)
    const lawnMat = new THREE.MeshStandardMaterial({ map: lawnTex, roughness: 0.9 });
    const gardenLawn = new THREE.Mesh(new THREE.BoxGeometry(14.5, 0.04, 10.5), lawnMat);
    gardenLawn.position.set(-12.2, 0.02, -7.2);
    gardenLawn.receiveShadow = true;
    scene.add(gardenLawn);

    // Decorative circular sandstone compass mosaic at Circular Quay (0, 4.0)
    const quayRing = new THREE.Mesh(
      new THREE.RingGeometry(2.3, 2.8, 36),
      new THREE.MeshStandardMaterial({ color: 0x0ea5e9, roughness: 0.65 }),
    );
    quayRing.rotation.x = -Math.PI / 2;
    quayRing.position.set(0, 0.015, 4.0);
    scene.add(quayRing);

    // Sydney Harbour Water Plane (North beyond z = -13.8)
    const harbourWaterMat = new THREE.MeshStandardMaterial({
      color: appearanceRef.current === 'night' ? NIGHT_WATER_COLOR.getHex() : DAY_WATER_COLOR.getHex(),
      roughness: 0.2,
      metalness: 0.35,
    });
    const harbourWater = new THREE.Mesh(new THREE.PlaneGeometry(160, 80), harbourWaterMat);
    harbourWater.rotation.x = -Math.PI / 2;
    harbourWater.position.set(0, -0.35, -53.8);
    scene.add(harbourWater);

    // Low Seawall Coping & Illuminated Promenade Bollards along z = -13.7
    const seawallMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.72 });
    const seawall = new THREE.Mesh(new THREE.BoxGeometry(44, 0.65, 0.45), seawallMat);
    seawall.position.set(0, 0.32, -13.75);
    seawall.castShadow = true;
    scene.add(seawall);

    const lampGlowMat = new THREE.MeshStandardMaterial({
      color: 0xfff3c4,
      emissive: 0xffc66b,
      emissiveIntensity: appearanceRef.current === 'night' ? 1.7 : 0.28,
      roughness: 0.3,
    });
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4, metalness: 0.5 });

    for (let lx = -16; lx <= 16; lx += 8) {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 2.4, 8), metalMat);
      post.position.set(lx, 1.2, -13.5);
      scene.add(post);
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.18, 10, 8), lampGlowMat);
      bulb.position.set(lx, 2.48, -13.5);
      scene.add(bulb);
    }

    // -----------------------------------------------------------------------
    // 1. Iconic Sydney Opera-Inspired Sail Pavilion & Bridge Backdrop (Across the Harbour)
    // -----------------------------------------------------------------------
    const operaGroup = new THREE.Group();
    operaGroup.position.set(-2.5, -0.2, -20.5);
    const operaDeck = new THREE.Mesh(
      new THREE.BoxGeometry(15.5, 1.3, 8.2),
      new THREE.MeshStandardMaterial({ color: 0xd6cfc2, roughness: 0.78 }),
    );
    operaDeck.position.y = 0.65;
    operaGroup.add(operaDeck);

    const sailShellMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      emissive: 0xfff7ed,
      emissiveIntensity: appearanceRef.current === 'night' ? 0.25 : 0.05,
      roughness: 0.28,
      metalness: 0.08,
    });
    const glassCurtainMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      emissive: 0xfcd34d,
      emissiveIntensity: appearanceRef.current === 'night' ? 0.85 : 0.12,
      roughness: 0.18,
      metalness: 0.6,
    });

    const sailOffsets = [
      { x: -4.1, z: -0.4, sx: 1.9, sy: 4.5, sz: 2.3 },
      { x: -0.6, z: 0.2, sx: 2.3, sy: 5.8, sz: 2.7 },
      { x: 3.1, z: -0.2, sx: 1.8, sy: 4.1, sz: 2.2 },
      { x: 5.5, z: 0.4, sx: 1.35, sy: 3.0, sz: 1.8 },
    ];
    for (const s of sailOffsets) {
      const shell = new THREE.Mesh(
        new THREE.SphereGeometry(1, 16, 12, 0, Math.PI, 0, Math.PI * 0.62),
        sailShellMat,
      );
      shell.scale.set(s.sx, s.sy, s.sz);
      shell.position.set(s.x, 1.25, s.z);
      shell.rotation.z = -0.18;
      operaGroup.add(shell);

      const glassBase = new THREE.Mesh(new THREE.CylinderGeometry(s.sx * 0.72, s.sx * 0.8, 1.4, 10), glassCurtainMat);
      glassBase.position.set(s.x, 1.9, s.z + 0.35);
      operaGroup.add(glassBase);
    }
    scene.add(operaGroup);

    // Sydney Harbour Bridge-Inspired Steel Arch Silhouette across the Bay
    const bridgeGroup = new THREE.Group();
    bridgeGroup.position.set(4, -0.35, -36);
    const pylonMat = new THREE.MeshStandardMaterial({ color: 0xc2b8a3, roughness: 0.82 });
    const steelMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.48, metalness: 0.55 });
    for (const side of [-1, 1]) {
      const pylon = new THREE.Mesh(new THREE.BoxGeometry(2.2, 11.5, 2.6), pylonMat);
      pylon.position.set(side * 19, 5.75, 0);
      bridgeGroup.add(pylon);
    }
    const deckSpan = new THREE.Mesh(new THREE.BoxGeometry(48, 1.0, 2.2), steelMat);
    deckSpan.position.set(0, 4.4, 0);
    bridgeGroup.add(deckSpan);

    const upperArch = new THREE.Mesh(
      new THREE.TorusGeometry(19, 0.45, 8, 32, Math.PI),
      steelMat,
    );
    upperArch.position.set(0, 4.2, 0);
    upperArch.scale.set(1.0, 0.68, 1.0);
    bridgeGroup.add(upperArch);
    scene.add(bridgeGroup);

    // Sailboats & Harbour Ferry gliding gently across the bay
    const boats: { group: THREE.Group; baseX: number; speed: number; range: number; z: number }[] = [];
    const sailboatA = createSailboatGroup(0x0284c7, 0xffffff);
    sailboatA.position.set(-14, -0.35, -18);
    scene.add(sailboatA);
    boats.push({ group: sailboatA, baseX: -14, speed: 0.7, range: 10, z: -18 });

    const ferryGroup = createSailboatGroup(0x166534, 0xf2c66d);
    ferryGroup.scale.set(1.4, 1.15, 1.5);
    ferryGroup.position.set(14, -0.35, -24);
    scene.add(ferryGroup);
    boats.push({ group: ferryGroup, baseX: 12, speed: -0.95, range: 16, z: -24 });

    // -----------------------------------------------------------------------
    // 2. Five Interactive Districts & Landmarks (Grounded cleanly on y = 0)
    // -----------------------------------------------------------------------
    // 2A. Circular Quay Info Kiosk (-2.9, 5.5) + Compass Planter (0, -1.6)
    const quayKiosk = new THREE.Group();
    quayKiosk.position.set(-2.9, 0, 5.5);
    const kioskBase = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 1.2, 1.1),
      new THREE.MeshStandardMaterial({ color: 0x0ea5e9, roughness: 0.48 }),
    );
    kioskBase.position.y = 0.6;
    kioskBase.castShadow = true;
    quayKiosk.add(kioskBase);
    const kioskRoof = new THREE.Mesh(
      new THREE.CylinderGeometry(1.15, 1.25, 0.16, 6),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.4 }),
    );
    kioskRoof.position.y = 2.45;
    kioskRoof.castShadow = true;
    quayKiosk.add(kioskRoof);
    for (const sx of [-0.55, 0.55]) {
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.3, 8), metalMat);
      pillar.position.set(sx, 1.8, -0.4);
      quayKiosk.add(pillar);
    }
    scene.add(quayKiosk);

    const compassPlanter = new THREE.Group();
    compassPlanter.position.set(0, 0, -1.6);
    const planterRim = new THREE.Mesh(
      new THREE.CylinderGeometry(1.15, 1.22, 0.52, 18),
      new THREE.MeshStandardMaterial({ color: 0xd6c7b2, roughness: 0.78 }),
    );
    planterRim.position.y = 0.26;
    planterRim.castShadow = true;
    compassPlanter.add(planterRim);
    const planterFoliage = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.88, 1),
      new THREE.MeshStandardMaterial({ color: 0x2e8b57, roughness: 0.8 }),
    );
    planterFoliage.scale.set(1, 0.65, 1);
    planterFoliage.position.y = 0.72;
    compassPlanter.add(planterFoliage);
    scene.add(compassPlanter);

    // 2B. City Transit Station (West, x: -17.6..-12.4, z: 1.6..7.4) + Ticket Booth (-11.5, 2.75)
    const transitGroup = new THREE.Group();
    transitGroup.position.set(-15.0, 0, 4.5);
    const stationBody = new THREE.Mesh(
      new THREE.BoxGeometry(5.0, 3.6, 5.6),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.55 }),
    );
    stationBody.position.y = 1.8;
    stationBody.castShadow = true;
    stationBody.receiveShadow = true;
    transitGroup.add(stationBody);

    const stationRoof = new THREE.Mesh(
      new THREE.BoxGeometry(5.8, 0.36, 6.2),
      new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.45 }),
    );
    stationRoof.position.y = 3.78;
    stationRoof.castShadow = true;
    transitGroup.add(stationRoof);

    const stationArch = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 2.4, 2.6),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.35 }),
    );
    stationArch.position.set(2.42, 1.2, 0);
    transitGroup.add(stationArch);

    const transitSignMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(3.8, 1.3),
      new THREE.MeshStandardMaterial({ map: transitSignTex, roughness: 0.4 }),
    );
    transitSignMesh.rotation.y = Math.PI / 2;
    transitSignMesh.position.set(2.58, 3.05, 0);
    transitGroup.add(transitSignMesh);

    const timetableMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2.2, 1.15),
      new THREE.MeshStandardMaterial({
        map: timetableTex,
        emissive: 0x38bdf8,
        emissiveIntensity: appearanceRef.current === 'night' ? 0.4 : 0.12,
        roughness: 0.3,
      }),
    );
    timetableMesh.rotation.y = Math.PI / 2;
    timetableMesh.position.set(2.56, 1.6, 1.85);
    transitGroup.add(timetableMesh);
    scene.add(transitGroup);

    const ticketBooth = new THREE.Group();
    ticketBooth.position.set(-11.5, 0, 2.75);
    const boothBody = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 1.8, 0.95),
      new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.5 }),
    );
    boothBody.position.y = 0.9;
    boothBody.castShadow = true;
    ticketBooth.add(boothBody);
    const boothCap = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 0.25, 1.15),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.4 }),
    );
    boothCap.position.y = 1.92;
    ticketBooth.add(boothCap);
    scene.add(ticketBooth);

    // 2C. Harbour Market & Café (East, x: 12.4..17.6, z: 1.6..7.0) + Pantry + Patio Tables
    const cafeGroup = new THREE.Group();
    cafeGroup.position.set(15.0, 0, 4.3);
    const cafeBody = new THREE.Mesh(
      new THREE.BoxGeometry(5.0, 3.3, 5.2),
      new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.68 }),
    );
    cafeBody.position.y = 1.65;
    cafeBody.castShadow = true;
    cafeGroup.add(cafeBody);

    const cafeRoof = new THREE.Mesh(
      new THREE.BoxGeometry(5.6, 0.35, 5.8),
      new THREE.MeshStandardMaterial({ color: 0x7c2d12, roughness: 0.7 }),
    );
    cafeRoof.position.y = 3.45;
    cafeGroup.add(cafeRoof);

    const cafeAwning = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 0.16, 4.8),
      new THREE.MeshStandardMaterial({ map: awningTex, roughness: 0.72 }),
    );
    cafeAwning.position.set(-2.9, 2.35, 0);
    cafeAwning.rotation.z = 0.24;
    cafeGroup.add(cafeAwning);

    const cafeSignMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(3.6, 1.25),
      new THREE.MeshStandardMaterial({ map: cafeSignTex, roughness: 0.45 }),
    );
    cafeSignMesh.rotation.y = -Math.PI / 2;
    cafeSignMesh.position.set(-2.55, 2.95, 0);
    cafeGroup.add(cafeSignMesh);
    scene.add(cafeGroup);

    const pantryCounter = new THREE.Mesh(
      new THREE.BoxGeometry(1.0, 1.1, 0.9),
      new THREE.MeshStandardMaterial({ color: 0x9a3412, roughness: 0.6 }),
    );
    pantryCounter.position.set(11.6, 0.55, 2.5);
    pantryCounter.castShadow = true;
    scene.add(pantryCounter);

    for (const [tx, tz] of [
      [11.0, 0.2],
      [14.4, 8.6],
    ]) {
      const tableGroup = new THREE.Group();
      tableGroup.position.set(tx, 0, tz);
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.75, 8), metalMat);
      leg.position.y = 0.375;
      tableGroup.add(leg);
      const top = new THREE.Mesh(
        new THREE.CylinderGeometry(0.62, 0.62, 0.07, 14),
        new THREE.MeshStandardMaterial({ color: 0xfff7ed, roughness: 0.45 }),
      );
      top.position.y = 0.76;
      top.castShadow = true;
      tableGroup.add(top);
      const umbrellaPole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.9, 6), metalMat);
      umbrellaPole.position.y = 1.6;
      tableGroup.add(umbrellaPole);
      const umbrella = new THREE.Mesh(
        new THREE.ConeGeometry(1.05, 0.45, 8),
        new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.68 }),
      );
      umbrella.position.y = 2.45;
      umbrella.castShadow = true;
      tableGroup.add(umbrella);
      scene.add(tableGroup);
    }

    // 2D. Darling Harbour Discovery Hub (Northeast, x: 11.4..17.2, z: -11.4..-7.4)
    const darlingGroup = new THREE.Group();
    darlingGroup.position.set(14.3, 0, -9.4);
    const darlingBody = new THREE.Mesh(
      new THREE.BoxGeometry(5.4, 3.6, 3.8),
      new THREE.MeshStandardMaterial({ color: 0xfaf5ff, roughness: 0.5 }),
    );
    darlingBody.position.y = 1.8;
    darlingBody.castShadow = true;
    darlingGroup.add(darlingBody);

    const darlingRoof = new THREE.Mesh(
      new THREE.CylinderGeometry(2.6, 3.4, 1.1, 4),
      new THREE.MeshStandardMaterial({ color: 0x6d28d9, roughness: 0.42 }),
    );
    darlingRoof.rotation.y = Math.PI / 4;
    darlingRoof.position.y = 4.1;
    darlingGroup.add(darlingRoof);

    const darlingSignMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(3.8, 1.3),
      new THREE.MeshStandardMaterial({ map: darlingSignTex, roughness: 0.4 }),
    );
    darlingSignMesh.rotation.y = -Math.PI / 4;
    darlingSignMesh.position.set(-2.2, 2.75, 2.02);
    darlingGroup.add(darlingSignMesh);
    scene.add(darlingGroup);

    const darlingPodium = new THREE.Mesh(
      new THREE.BoxGeometry(1.15, 1.5, 0.85),
      new THREE.MeshStandardMaterial({ color: 0x7c3aed, roughness: 0.45 }),
    );
    darlingPodium.position.set(13.3, 0.75, -5.85);
    darlingPodium.castShadow = true;
    scene.add(darlingPodium);

    // 2E. Harbour Gardens Help Point (Northwest, x: -16.4..-11.8, z: -11.0..-8.4)
    const helpKioskGroup = new THREE.Group();
    helpKioskGroup.position.set(-14.1, 0, -9.7);
    const helpDeck = new THREE.Mesh(
      new THREE.BoxGeometry(4.2, 0.2, 2.4),
      new THREE.MeshStandardMaterial({ color: 0xd6c7b2, roughness: 0.76 }),
    );
    helpDeck.position.y = 0.1;
    helpKioskGroup.add(helpDeck);

    const totem = new THREE.Mesh(
      new THREE.BoxGeometry(1.3, 2.9, 0.7),
      new THREE.MeshStandardMaterial({ color: 0x0f766e, roughness: 0.42 }),
    );
    totem.position.y = 1.5;
    totem.castShadow = true;
    helpKioskGroup.add(totem);

    const helpSignMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1.85, 0.95),
      new THREE.MeshStandardMaterial({ map: helpSignTex, roughness: 0.35 }),
    );
    helpSignMesh.rotation.y = Math.PI / 6;
    helpSignMesh.position.set(0.35, 2.25, 0.5);
    helpKioskGroup.add(helpSignMesh);
    scene.add(helpKioskGroup);

    // Timber bench at Harbour Gardens (-6.5, -9.75)
    const parkBench = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 0.5, 0.65),
      new THREE.MeshStandardMaterial({ color: 0x926942, roughness: 0.75 }),
    );
    parkBench.position.set(-6.5, 0.25, -9.75);
    parkBench.castShadow = true;
    scene.add(parkBench);

    // Coastal Palms framing Sydney Esplanade & Harbour Gardens
    const palmRigs: CoastalPalmRig[] = [];
    const palmPlacements: [number, number, number][] = [
      [-16.2, -4.2, 1.05],
      [-17.6, -11.8, 1.18],
      [-7.2, -4.0, 0.92],
      [-15.0, 11.4, 1.1],
      [15.2, 11.2, 1.08],
      [17.8, -4.4, 1.02],
    ];
    palmPlacements.forEach(([tx, tz, sc]) => {
      const palm = createCoastalPalmRig(sc);
      palm.root.position.set(tx, 0, tz);
      scene.add(palm.root);
      palmRigs.push(palm);
    });

    // Harbour Gulls circling overhead
    const gullRigs: HarbourGullRig[] = [];
    const gullConfigs = [
      { centerX: -4, centerZ: -12, radius: 7.5, altitude: 9.2, speed: 0.45, phase: 0.2 },
      { centerX: 8, centerZ: -15, radius: 8.5, altitude: 10.6, speed: -0.38, phase: 2.1 },
    ];
    gullConfigs.forEach((cfg) => {
      const gull = createHarbourGullRig(cfg);
      scene.add(gull.root);
      gullRigs.push(gull);
    });

    // -----------------------------------------------------------------------
    // 3. Player Avatar + 4 Distinct Sydney NPCs
    // -----------------------------------------------------------------------
    const playerRig = createProceduralAvatarRig(avatar, !isSoftwareGl);
    playerRigRef.current = playerRig;
    prevAvatarStructRef.current = `${avatar.modelId}:${avatar.hairStyle}:${avatar.outfitId}`;
    playerRig.root.position.set(AUSTRALIA_SPAWN.x, 0, AUSTRALIA_SPAWN.z);
    playerRig.root.rotation.y = AUSTRALIA_SPAWN.yaw;
    scene.add(playerRig.root);

    const playerShadow = new THREE.Mesh(
      new THREE.PlaneGeometry(1.15, 1.15),
      new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }),
    );
    playerShadow.rotation.x = -Math.PI / 2;
    playerShadow.position.set(AUSTRALIA_SPAWN.x, 0.025, AUSTRALIA_SPAWN.z);
    scene.add(playerShadow);

    const npcRigs: Record<AustraliaNpcId, SydneyNpcRig> = {
      npc_olivia: createSydneyNpcRig('npc_olivia'),
      npc_noah: createSydneyNpcRig('npc_noah'),
      npc_mia: createSydneyNpcRig('npc_mia'),
      npc_jack: createSydneyNpcRig('npc_jack'),
    };
    (Object.keys(npcRigs) as AustraliaNpcId[]).forEach((npcId) => {
      const pos = AUSTRALIA_NPC_POSITIONS[npcId];
      const rig = npcRigs[npcId];
      rig.root.position.set(pos.x, 0, pos.z);
      rig.root.rotation.y = pos.idleYaw;
      scene.add(rig.root);

      const nShadow = new THREE.Mesh(
        new THREE.PlaneGeometry(1.1, 1.1),
        new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }),
      );
      nShadow.rotation.x = -Math.PI / 2;
      nShadow.position.set(pos.x, 0.025, pos.z);
      scene.add(nShadow);
    });

    // -----------------------------------------------------------------------
    // 4. Interactive POI Ground Rings + Floating Beacons (Highlight Guided Stop)
    // -----------------------------------------------------------------------
    const poiMarkers: {
      id: AustraliaPoiId;
      ringMat: THREE.MeshBasicMaterial;
      diamond: THREE.Mesh;
      diamondMat: THREE.MeshStandardMaterial;
      baseY: number;
      accentHex: string;
    }[] = [];

    const ringGeo = new THREE.RingGeometry(0.95, 1.15, 28);
    const diamondGeo = new THREE.OctahedronGeometry(0.24, 0);

    for (const target of AUSTRALIA_INTERACTIVE_TARGETS) {
      const ringMat = new THREE.MeshBasicMaterial({
        color: target.accentColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.78,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(target.position.x, 0.03, target.position.z);
      scene.add(ring);

      const diamondMat = new THREE.MeshStandardMaterial({
        color: target.accentColor,
        emissive: target.accentColor,
        emissiveIntensity: 0.55,
        roughness: 0.25,
      });
      const diamond = new THREE.Mesh(diamondGeo, diamondMat);
      const baseY = target.kind === 'npc' ? 2.15 : 2.35;
      diamond.position.set(target.position.x, baseY, target.position.z);
      scene.add(diamond);

      poiMarkers.push({
        id: target.id,
        ringMat,
        diamond,
        diamondMat,
        baseY,
        accentHex: target.accentColor,
      });
    }

    // -----------------------------------------------------------------------
    // 5. Controls, Camera Orbit & Animation Loop
    // -----------------------------------------------------------------------
    const keys = {
      up: false,
      down: false,
      left: false,
      right: false,
      rotLeft: false,
      rotRight: false,
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === 'KeyW' || e.code === 'ArrowUp') keys.up = true;
      if (e.code === 'KeyS' || e.code === 'ArrowDown') keys.down = true;
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') keys.left = true;
      if (e.code === 'KeyD' || e.code === 'ArrowRight') keys.right = true;
      if (e.code === 'KeyQ') keys.rotLeft = true;
      if (e.code === 'KeyR') keys.rotRight = true;
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'KeyW' || e.code === 'ArrowUp') keys.up = false;
      if (e.code === 'KeyS' || e.code === 'ArrowDown') keys.down = false;
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') keys.left = false;
      if (e.code === 'KeyD' || e.code === 'ArrowRight') keys.right = false;
      if (e.code === 'KeyQ') keys.rotLeft = false;
      if (e.code === 'KeyR') keys.rotRight = false;
    };
    const onBlur = () => {
      keys.up = keys.down = keys.left = keys.right = keys.rotLeft = keys.rotRight = false;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onBlur);

    let camYaw = 0;
    let camPitch = 0.42;
    let isDragging = false;
    let dragDistance = 0;
    let lastPointerX = 0;
    let lastPointerY = 0;

    const raycaster = new THREE.Raycaster();
    const pointerNdc = new THREE.Vector2();

    const onPointerDown = (e: PointerEvent) => {
      if (pausedRef.current) return;
      isDragging = true;
      dragDistance = 0;
      lastPointerX = e.clientX;
      lastPointerY = e.clientY;
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging || pausedRef.current) return;
      const dx = e.clientX - lastPointerX;
      const dy = e.clientY - lastPointerY;
      dragDistance += Math.hypot(dx, dy);
      lastPointerX = e.clientX;
      lastPointerY = e.clientY;
      const sens = sensitivityRef.current;
      camYaw -= dx * 0.0055 * sens;
      camPitch = THREE.MathUtils.clamp(camPitch + dy * 0.004 * sens, 0.22, 0.92);
    };
    const onPointerUp = (e: PointerEvent) => {
      if (isDragging && dragDistance < 8 && !pausedRef.current) {
        const rect = renderer.domElement.getBoundingClientRect();
        pointerNdc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        pointerNdc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(pointerNdc, camera);
        const hits = raycaster.intersectObjects(
          poiMarkers.map((m) => m.diamond),
          false,
        );
        if (hits.length > 0) {
          const hitMesh = hits[0].object;
          const marker = poiMarkers.find((m) => m.diamond === hitMesh);
          if (marker) {
            onActivatePoiRef.current?.(marker.id);
          }
        }
      }
      isDragging = false;
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    const onResize = () => {
      if (!container) return;
      const w = Math.max(container.clientWidth, 320);
      const h = Math.max(container.clientHeight, 320);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(container);

    let playerX = AUSTRALIA_SPAWN.x;
    let playerZ = AUSTRALIA_SPAWN.z;
    let playerYaw = AUSTRALIA_SPAWN.yaw;
    let lastNearestPoi: AustraliaPoiId | null = null;
    let walkPhase = 0;
    let elapsed = 0;
    let lastNow = performance.now();
    let rafId = 0;

    let activeAutoWalkId = 0;
    let lastCompletedAutoWalkId = 0;
    let autoWalkWaypointIdx = 0;
    let lastQuickTravelId = 0;
    let stuckTimer = 0;
    let stuckAnchorX = playerX;
    let stuckAnchorZ = playerZ;
    let posEmitTimer = 0;
    let snapCameraNextFrame = false;

    onPositionRef.current?.({ x: playerX, z: playerZ });

    const animate = (now: number) => {
      rafId = requestAnimationFrame(animate);
      const dt = Math.min((now - lastNow) / 1000, 0.05);
      lastNow = now;
      elapsed += dt;

      const isNightNow = appearanceRef.current === 'night';
      const motionScale = reducedMotionRef.current ? 0.25 : 1.0;

      // Smooth Day / Night visual transition
      skyUniforms.topColor.value.lerp(isNightNow ? NIGHT_SKY_TOP : DAY_SKY_TOP, 0.08);
      skyUniforms.bottomColor.value.lerp(isNightNow ? NIGHT_SKY_BOTTOM : DAY_SKY_BOTTOM, 0.08);
      if (scene.fog instanceof THREE.FogExp2) {
        scene.fog.color.lerp(isNightNow ? NIGHT_FOG : DAY_FOG, 0.08);
      }
      hemiLight.color.lerp(isNightNow ? NIGHT_HEMI_SKY : DAY_HEMI_SKY, 0.08);
      hemiLight.groundColor.lerp(isNightNow ? NIGHT_HEMI_GROUND : DAY_HEMI_GROUND, 0.08);
      hemiLight.intensity = THREE.MathUtils.lerp(hemiLight.intensity, isNightNow ? 0.56 : 0.9, 0.08);
      keyLight.color.lerp(isNightNow ? NIGHT_KEY_COLOR : DAY_KEY_COLOR, 0.08);
      keyLight.intensity = THREE.MathUtils.lerp(keyLight.intensity, isNightNow ? 0.92 : 1.78, 0.08);
      _vecA.copy(isNightNow ? NIGHT_KEY_POS : DAY_KEY_POS);
      keyLight.position.lerp(_vecA, 0.05);
      cloudMat.color.lerp(isNightNow ? NIGHT_CLOUD_COLOR : DAY_CLOUD_COLOR, 0.08);
      harbourWaterMat.color.lerp(isNightNow ? NIGHT_WATER_COLOR : DAY_WATER_COLOR, 0.08);
      lampGlowMat.emissiveIntensity = THREE.MathUtils.lerp(
        lampGlowMat.emissiveIntensity,
        isNightNow ? 1.75 : 0.26,
        0.08,
      );
      sailShellMat.emissiveIntensity = THREE.MathUtils.lerp(
        sailShellMat.emissiveIntensity,
        isNightNow ? 0.34 : 0.05,
        0.08,
      );
      glassCurtainMat.emissiveIntensity = THREE.MathUtils.lerp(
        glassCurtainMat.emissiveIntensity,
        isNightNow ? 0.95 : 0.14,
        0.08,
      );
      starMat.opacity = THREE.MathUtils.lerp(starMat.opacity, isNightNow ? 0.88 : 0, 0.08);

      // Ambient animated scenery (clouds, boats, palm breeze, gulls)
      clouds.forEach((c) => {
        c.group.position.x = c.baseX + Math.sin(elapsed * 0.05 * c.speed) * 4 * motionScale;
      });
      boats.forEach((b) => {
        b.group.position.x = b.baseX + Math.sin(elapsed * 0.12 * b.speed) * b.range * motionScale;
        b.group.position.y = -0.35 + Math.sin(elapsed * 1.4 + b.baseX) * 0.04 * motionScale;
      });
      palmRigs.forEach((palm, idx) => {
        palm.crownGroup.rotation.z = Math.sin(elapsed * 0.9 + idx) * 0.045 * motionScale;
      });
      gullRigs.forEach((g) => {
        const ang = elapsed * g.speed * motionScale + g.phase;
        g.root.position.set(
          g.centerX + Math.cos(ang) * g.radius,
          g.altitude + Math.sin(elapsed * 1.6 + g.phase) * 0.35,
          g.centerZ + Math.sin(ang) * g.radius,
        );
        g.root.rotation.y = -ang + (g.speed > 0 ? Math.PI : 0);
        const flap = Math.sin(elapsed * 7.5 + g.phase) * 0.42 * motionScale;
        g.leftWing.rotation.z = flap;
        g.rightWing.rotation.z = -flap;
      });

      // Quick Travel Instant Relocation (Collision-Safe)
      const pendingQuickTravel = quickTravelRef.current;
      if (pendingQuickTravel && pendingQuickTravel.requestId !== lastQuickTravelId) {
        lastQuickTravelId = pendingQuickTravel.requestId;
        if (autoWalkRef.current) {
          lastCompletedAutoWalkId = autoWalkRef.current.requestId;
        }
        activeAutoWalkId = 0;
        const safeQt = resolveAustraliaCollision(
          pendingQuickTravel.arrivalPoint.x,
          pendingQuickTravel.arrivalPoint.z,
        );
        playerX = safeQt.x;
        playerZ = safeQt.z;
        playerYaw = pendingQuickTravel.facingYaw;
        snapCameraNextFrame = true;
        onPositionRef.current?.({ x: playerX, z: playerZ });
      }

      // Player Movement (Manual always overrides Auto-Walk)
      let movingSpeed = 0;
      if (!pausedRef.current) {
        if (keys.rotLeft) camYaw += 1.6 * dt * sensitivityRef.current;
        if (keys.rotRight) camYaw -= 1.6 * dt * sensitivityRef.current;

        const j = joystickRef.current;
        const inputX = (keys.right ? 1 : 0) - (keys.left ? 1 : 0) + j.x;
        const inputZ = (keys.down ? 1 : 0) - (keys.up ? 1 : 0) + j.y;
        const mag = Math.hypot(inputX, inputZ);

        if (mag > 0.08) {
          if (activeAutoWalkId !== 0) {
            lastCompletedAutoWalkId = activeAutoWalkId;
            activeAutoWalkId = 0;
            onManualInterruptRef.current?.();
          }

          const normX = inputX / Math.max(1, mag);
          const normZ = inputZ / Math.max(1, mag);
          const cosY = Math.cos(camYaw);
          const sinY = Math.sin(camYaw);
          const worldDx = normX * cosY + normZ * sinY;
          const worldDz = -normX * sinY + normZ * cosY;

          const next = resolveAustraliaCollision(
            playerX + worldDx * WALK_SPEED * dt,
            playerZ + worldDz * WALK_SPEED * dt,
          );
          movingSpeed = Math.hypot(next.x - playerX, next.z - playerZ) / Math.max(dt, 0.001);
          playerX = next.x;
          playerZ = next.z;

          const targetYaw = Math.atan2(worldDx, worldDz);
          playerYaw += shortestAngleDiff(playerYaw, targetYaw) * Math.min(1, dt * 11);
        } else {
          const aw = autoWalkRef.current;
          if (!aw) {
            activeAutoWalkId = 0;
          } else if (aw.requestId !== lastCompletedAutoWalkId) {
            if (aw.requestId !== activeAutoWalkId) {
              activeAutoWalkId = aw.requestId;
              autoWalkWaypointIdx = 0;
              stuckTimer = 0;
              stuckAnchorX = playerX;
              stuckAnchorZ = playerZ;
            }
            const wp = aw.waypoints[autoWalkWaypointIdx] ?? aw.arrivalPoint;
            const dx = wp.x - playerX;
            const dz = wp.z - playerZ;
            const dist = Math.hypot(dx, dz);
            const stepDist = WALK_SPEED * dt;

            if (dist <= Math.max(0.14, stepDist)) {
              const snapped = resolveAustraliaCollision(wp.x, wp.z);
              playerX = snapped.x;
              playerZ = snapped.z;
              autoWalkWaypointIdx += 1;

              if (autoWalkWaypointIdx >= aw.waypoints.length) {
                lastCompletedAutoWalkId = aw.requestId;
                activeAutoWalkId = 0;
                const destTarget = AUSTRALIA_INTERACTIVE_TARGETS.find(
                  (t) => t.id === aw.targetId,
                );
                if (destTarget) {
                  playerYaw = Math.atan2(
                    destTarget.position.x - playerX,
                    destTarget.position.z - playerZ,
                  );
                }
                onPositionRef.current?.({ x: playerX, z: playerZ });
                onAutoWalkCompleteRef.current?.({
                  targetId: aw.targetId,
                  status: 'arrived',
                });
              }
            } else {
              const dirX = dx / dist;
              const dirZ = dz / dist;
              const next = resolveAustraliaCollision(
                playerX + dirX * stepDist,
                playerZ + dirZ * stepDist,
              );
              movingSpeed = Math.hypot(next.x - playerX, next.z - playerZ) / Math.max(dt, 0.001);
              playerX = next.x;
              playerZ = next.z;
              const targetYaw = Math.atan2(dirX, dirZ);
              playerYaw += shortestAngleDiff(playerYaw, targetYaw) * Math.min(1, dt * 11);

              stuckTimer += dt;
              if (stuckTimer >= 0.5) {
                const netMove = Math.hypot(playerX - stuckAnchorX, playerZ - stuckAnchorZ);
                if (netMove < 0.05) {
                  lastCompletedAutoWalkId = aw.requestId;
                  activeAutoWalkId = 0;
                  onAutoWalkCompleteRef.current?.({
                    targetId: aw.targetId,
                    status: 'unreachable',
                  });
                } else {
                  stuckTimer = 0;
                  stuckAnchorX = playerX;
                  stuckAnchorZ = playerZ;
                }
              }
            }
          }
        }
      }

      posEmitTimer += dt;
      if (posEmitTimer >= 0.2) {
        posEmitTimer = 0;
        onPositionRef.current?.({ x: playerX, z: playerZ });
      }

      if (movingSpeed > 0.25) {
        walkPhase += dt * 9.5;
      }

      // Animate player procedural avatar
      const rig = playerRigRef.current;
      if (rig) {
        rig.root.position.set(playerX, 0, playerZ);
        rig.root.rotation.y = playerYaw;
        playerShadow.position.set(playerX, 0.025, playerZ);

        const stride = movingSpeed > 0.25 ? Math.sin(walkPhase) * 0.55 : 0;
        rig.parts.leftLeg.rotation.x = THREE.MathUtils.lerp(rig.parts.leftLeg.rotation.x, stride, 0.24);
        rig.parts.rightLeg.rotation.x = THREE.MathUtils.lerp(rig.parts.rightLeg.rotation.x, -stride, 0.24);
        rig.parts.leftArm.rotation.x = THREE.MathUtils.lerp(rig.parts.leftArm.rotation.x, -stride * 0.85, 0.24);

        if (interactTimerRef.current > 0) {
          interactTimerRef.current = Math.max(0, interactTimerRef.current - dt);
          rig.parts.rightArm.rotation.x = THREE.MathUtils.lerp(rig.parts.rightArm.rotation.x, -1.25, 0.32);
        } else {
          rig.parts.rightArm.rotation.x = THREE.MathUtils.lerp(rig.parts.rightArm.rotation.x, stride * 0.85, 0.24);
        }

        const bob = movingSpeed > 0.25 ? Math.abs(Math.sin(walkPhase)) * 0.05 : Math.sin(elapsed * 2.2) * 0.015;
        rig.parts.hips.position.y = bob;
      }

      // Animate NPCs (turn toward player during dialogue, subtle wave/blink)
      const activeNpc = activeNpcRef.current;
      (Object.keys(npcRigs) as AustraliaNpcId[]).forEach((npcId, idx) => {
        const npc = npcRigs[npcId];
        const base = AUSTRALIA_NPC_POSITIONS[npcId];
        const isTalking = activeNpc === npcId;
        const targetNpcYaw = isTalking
          ? Math.atan2(playerX - base.x, playerZ - base.z)
          : base.idleYaw;
        npc.root.rotation.y += shortestAngleDiff(npc.root.rotation.y, targetNpcYaw) * Math.min(1, dt * 6);
        npc.torso.position.y = 0.96 + Math.sin(elapsed * 2.0 + idx) * 0.014 * motionScale;
        npc.leftArm.rotation.z = 0.08 + Math.sin(elapsed * 2.4 + idx) * 0.06 * motionScale;
        npc.rightArm.rotation.x = isTalking
          ? -0.45 + Math.sin(elapsed * 5.2) * 0.14
          : Math.sin(elapsed * 1.7 + idx) * 0.08 * motionScale;

        const blinkCycle = (elapsed + idx * 1.3) % 4.1;
        const isBlink = blinkCycle > 3.92;
        npc.leftEyelid.scale.y = isBlink ? 1.8 : 0.08;
        npc.rightEyelid.scale.y = isBlink ? 1.8 : 0.08;
      });

      // Nearest POI & Guided Beacon Pulse
      const nearest = findNearestAustraliaPoi(playerX, playerZ);
      const nextNearestId = nearest?.id ?? null;
      if (nextNearestId !== lastNearestPoi) {
        lastNearestPoi = nextNearestId;
        onNearestPoiRef.current(nextNearestId);
      }

      const guidedId = guidedPoiRef.current;
      const visitedSet = visitedRef.current;
      poiMarkers.forEach((m, idx) => {
        const isGuided = guidedId === m.id;
        const isVisited = visitedSet.has(m.id);
        const targetColor = isGuided ? '#FBBF24' : isVisited ? '#10B981' : m.accentHex;
        _colorA.set(targetColor);
        m.ringMat.color.copy(_colorA);
        m.diamondMat.color.copy(_colorA);
        m.diamondMat.emissive.copy(_colorA);
        m.diamondMat.emissiveIntensity = isGuided ? 1.15 : isVisited ? 0.35 : 0.6;
        m.ringMat.opacity = isGuided
          ? 0.95
          : isVisited
            ? 0.45
            : 0.72 + Math.sin(elapsed * 3 + idx) * 0.15;

        const scaleMult = isGuided ? 1.35 + Math.sin(elapsed * 4.5) * 0.14 : 1.0;
        m.diamond.scale.setScalar(scaleMult);
        m.diamond.position.y =
          m.baseY + (isGuided ? 0.5 : 0) + Math.sin(elapsed * 2.5 + idx) * 0.14 * motionScale;
        m.diamond.rotation.y += dt * (isGuided ? 2.4 : 1.2) * motionScale;
      });

      // Smooth 3rd-Person Chase Camera (or instant snap on Quick Travel)
      const camDist = 8.4;
      const desiredCamX = playerX + Math.sin(camYaw) * Math.cos(camPitch) * camDist;
      const desiredCamY = Math.max(1.5, Math.sin(camPitch) * camDist + 1.6);
      const desiredCamZ = Math.min(
        AUSTRALIA_BOUNDS.maxZ + 6,
        playerZ + Math.cos(camYaw) * Math.cos(camPitch) * camDist,
      );
      if (snapCameraNextFrame) {
        camera.position.set(desiredCamX, desiredCamY, desiredCamZ);
        snapCameraNextFrame = false;
      } else {
        camera.position.x = THREE.MathUtils.lerp(camera.position.x, desiredCamX, 0.12);
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, desiredCamY, 0.12);
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, desiredCamZ, 0.12);
      }
      camera.lookAt(playerX, 1.35, playerZ);

      renderer.render(scene, camera);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);

      playerRig.dispose();
      (Object.values(npcRigs) as SydneyNpcRig[]).forEach((r) => r.dispose());
      palmRigs.forEach((p) => p.dispose());
      gullRigs.forEach((g) => g.dispose());
      disposeObjectGeometries(scene);

      [
        sandstoneTex,
        boardwalkTex,
        lawnTex,
        awningTex,
        timetableTex,
        transitSignTex,
        cafeSignTex,
        darlingSignTex,
        helpSignTex,
        shadowTex,
      ].forEach((t) => t.dispose());
      envTarget.dispose();
      pmrem.dispose();
      renderer.dispose();
      container.innerHTML = '';
    };
  }, []);

  return <div ref={containerRef} className="h-full w-full" aria-label="Sydney Harbour 3D World" />;
}
