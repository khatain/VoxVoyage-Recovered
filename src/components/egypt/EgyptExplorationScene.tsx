import { useEffect, useRef, type MutableRefObject } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import type { AvatarConfig, ResolvedAppearance } from '../../types/game';
import {
  EGYPT_BOUNDS,
  EGYPT_INTERACTIVE_TARGETS,
  EGYPT_NPC_POSITIONS,
  EGYPT_SPAWN,
  type EgyptNpcId,
  type EgyptPoiId,
} from '../../data/egyptWorld';
import { findNearestEgyptPoi, resolveEgyptCollision } from '../../utils/egyptCollision';
import {
  createProceduralAvatarRig,
  disposeObjectGeometries,
} from '../avatar/proceduralAvatarRig';
import {
  createDatePalmRig,
  createDesertSandTexture,
  createEgyptNpcRig,
  createEgyptSignTexture,
  createExpeditionMapTexture,
  createFeluccaBoatGroup,
  createHieroglyphReliefTexture,
  createLimestoneCourseTexture,
  createNileWaterTexture,
  createPotteryAmphoraGroup,
  createScrollArtworkTexture,
  createShorelineReedsGroup,
  createSphinxMonumentGroup,
  createStonePathTexture,
  type DatePalmRig,
  type EgyptNpcRig,
} from './egyptProceduralModels';
import type { JoystickVector } from '../india/VirtualJoystick';
import type {
  ActiveAutoWalkRequest,
  ActiveQuickTravelRequest,
  NavPoint2D,
} from '../../utils/worldNavigation';

export interface EgyptSceneProps {
  avatar: AvatarConfig;
  appearance: ResolvedAppearance;
  reducedMotion: boolean;
  cameraSensitivity: number;
  paused: boolean;
  visitedPoiIds: EgyptPoiId[];
  guidedPoiId?: EgyptPoiId | null;
  activeNpcId?: EgyptNpcId | null;
  interactGestureSeq: number;
  joystickRef: MutableRefObject<JoystickVector>;
  autoWalkRequest?: ActiveAutoWalkRequest | null;
  quickTravelRequest?: ActiveQuickTravelRequest | null;
  onPositionChange?: (pos: NavPoint2D) => void;
  onAutoWalkComplete?: (result: { targetId: string; status: 'arrived' | 'unreachable' }) => void;
  onManualInterrupt?: () => void;
  onNearestPoiChange: (poiId: EgyptPoiId | null) => void;
  onActivatePoi?: (poiId: EgyptPoiId) => void;
  onWebGLFailure: () => void;
}

const _colorA = new THREE.Color();
const _vecA = new THREE.Vector3();

// Sunlit Egyptian Sahara Golden Sky & Starry Nile Twilight
const DAY_SKY_TOP = new THREE.Color('#2378C8');
const DAY_SKY_BOTTOM = new THREE.Color('#F5DEB5');
const NIGHT_SKY_TOP = new THREE.Color('#09132E');
const NIGHT_SKY_BOTTOM = new THREE.Color('#25365E');

const DAY_FOG = new THREE.Color('#F2D9AE');
const NIGHT_FOG = new THREE.Color('#162344');

const DAY_HEMI_SKY = new THREE.Color('#FFF2D6');
const NIGHT_HEMI_SKY = new THREE.Color('#6D8CE0');
const DAY_HEMI_GROUND = new THREE.Color('#B58955');
const NIGHT_HEMI_GROUND = new THREE.Color('#1D2436');

const DAY_KEY_COLOR = new THREE.Color('#FFF3D1');
const NIGHT_KEY_COLOR = new THREE.Color('#B9D2FF');
const DAY_KEY_POS = new THREE.Vector3(24, 30, 18);
const NIGHT_KEY_POS = new THREE.Vector3(-18, 22, 14);

const DAY_CLOUD_COLOR = new THREE.Color('#FFFDF7');
const NIGHT_CLOUD_COLOR = new THREE.Color('#3F5185');

const DAY_WATER_COLOR = new THREE.Color('#1294AE');
const NIGHT_WATER_COLOR = new THREE.Color('#0B3B5A');

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
    grad.addColorStop(0, 'rgba(30, 22, 14, 0.44)');
    grad.addColorStop(0.55, 'rgba(30, 22, 14, 0.16)');
    grad.addColorStop(1, 'rgba(30, 22, 14, 0)');
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
    [0, 0, 0, 1.4],
    [-1.2, -0.15, 0.1, 0.95],
    [1.2, -0.1, -0.1, 1.0],
    [0.2, 0.42, 0.1, 0.8],
  ];
  const geo = new THREE.SphereGeometry(1, 12, 9);
  puffs.forEach(([px, py, pz, s]) => {
    const m = new THREE.Mesh(geo, material);
    m.position.set(px, py, pz);
    m.scale.set(s * 1.45, s * 0.65, s * 0.92);
    cloud.add(m);
  });
  return cloud;
}

export default function EgyptExplorationScene({
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
}: EgyptSceneProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const appearanceRef = useRef(appearance);
  appearanceRef.current = appearance;
  const reducedMotionRef = useRef(reducedMotion);
  reducedMotionRef.current = reducedMotion;
  const sensitivityRef = useRef(cameraSensitivity);
  sensitivityRef.current = cameraSensitivity;
  const pausedRef = useRef(paused);
  pausedRef.current = paused;
  const visitedRef = useRef<Set<EgyptPoiId>>(new Set(visitedPoiIds));
  visitedRef.current = new Set(visitedPoiIds);
  const guidedPoiRef = useRef<EgyptPoiId | null>(guidedPoiId);
  guidedPoiRef.current = guidedPoiId;
  const activeNpcRef = useRef<EgyptNpcId | null>(activeNpcId);
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
    renderer.toneMappingExposure = 1.05;
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
      0.0062,
    );

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTarget = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;
    scene.environmentIntensity = 0.72;

    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 220);

    // Sky Dome Shader
    const skyGeo = new THREE.SphereGeometry(125, 32, 20);
    const skyUniforms = {
      topColor: {
        value: appearanceRef.current === 'night' ? NIGHT_SKY_TOP.clone() : DAY_SKY_TOP.clone(),
      },
      bottomColor: {
        value:
          appearanceRef.current === 'night' ? NIGHT_SKY_BOTTOM.clone() : DAY_SKY_BOTTOM.clone(),
      },
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
          float h = clamp(normalize(vWorldPos).y * 0.85 + 0.2, 0.0, 1.0);
          gl_FragColor = vec4(mix(bottomColor, topColor, pow(h, 0.7)), 1.0);
        }
      `,
    });
    scene.add(new THREE.Mesh(skyGeo, skyMat));

    // Starfield (Night)
    const starPositions: number[] = [];
    for (let i = 0; i < 160; i++) {
      const theta = ((i * 73) % 360) * (Math.PI / 180);
      const phi = (15 + ((i * 37) % 60)) * (Math.PI / 180);
      const r = 98;
      starPositions.push(
        r * Math.cos(phi) * Math.cos(theta),
        r * Math.sin(phi),
        r * Math.cos(phi) * Math.sin(theta),
      );
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xfff5d6,
      size: 0.72,
      transparent: true,
      opacity: appearanceRef.current === 'night' ? 0.88 : 0,
    });
    scene.add(new THREE.Points(starGeo, starMat));

    // Lights
    const isNightInit = appearanceRef.current === 'night';
    const hemiLight = new THREE.HemisphereLight(
      isNightInit ? NIGHT_HEMI_SKY.getHex() : DAY_HEMI_SKY.getHex(),
      isNightInit ? NIGHT_HEMI_GROUND.getHex() : DAY_HEMI_GROUND.getHex(),
      isNightInit ? 0.56 : 0.92,
    );
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(
      isNightInit ? NIGHT_KEY_COLOR.getHex() : DAY_KEY_COLOR.getHex(),
      isNightInit ? 0.92 : 1.75,
    );
    keyLight.position.copy(isNightInit ? NIGHT_KEY_POS : DAY_KEY_POS);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.near = 2;
    keyLight.shadow.camera.far = 90;
    keyLight.shadow.camera.left = -28;
    keyLight.shadow.camera.right = 28;
    keyLight.shadow.camera.top = 28;
    keyLight.shadow.camera.bottom = -28;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    // Textures
    const sandTex = createDesertSandTexture(maxAnisotropy);
    const pathTex = createStonePathTexture(maxAnisotropy);
    const limestoneTex = createLimestoneCourseTexture(maxAnisotropy);
    const reliefTex = createHieroglyphReliefTexture(maxAnisotropy);
    const nileWaterTex = createNileWaterTexture(maxAnisotropy);
    const scrollTex = createScrollArtworkTexture(maxAnisotropy);
    const campMapTex = createExpeditionMapTexture(maxAnisotropy);
    const scribeSignTex = createEgyptSignTexture(
      'SCRIBE WORKSHOP',
      'Papyrus & Ancient Writing',
      '#132743',
      '#12B8B0',
      maxAnisotropy,
    );
    const templeSignTex = createEgyptSignTexture(
      'TEMPLE OF THE SUN',
      'Solar Pylon & Lotus Axis',
      '#1A2855',
      '#E7B43C',
      maxAnisotropy,
    );
    const chamberSignTex = createEgyptSignTexture(
      'CHAMBER OF WISDOM',
      'SEALED · FINAL EXPEDITION REQUIRED',
      '#2B1C12',
      '#E7B43C',
      maxAnisotropy,
    );
    const shadowTex = createContactShadowTexture();

    // Shared glow materials for lanterns & sacred glyphs
    const lanternGlowMat = new THREE.MeshStandardMaterial({
      color: 0xffd166,
      emissive: 0xffa62b,
      emissiveIntensity: isNightInit ? 1.85 : 0.3,
      roughness: 0.3,
    });
    const sealedSealGlowMat = new THREE.MeshStandardMaterial({
      color: 0x12b8b0,
      emissive: 0x12b8b0,
      emissiveIntensity: isNightInit ? 1.35 : 0.5,
      roughness: 0.35,
    });

    // -----------------------------------------------------------------------
    // 1. Desert Plateau Terrain, Connecting Stone Pathways & Nile River
    // -----------------------------------------------------------------------
    const desertGround = new THREE.Mesh(
      new THREE.PlaneGeometry(140, 140),
      new THREE.MeshStandardMaterial({ map: sandTex, roughness: 0.94 }),
    );
    desertGround.rotation.x = -Math.PI / 2;
    desertGround.receiveShadow = true;
    scene.add(desertGround);

    const pathMat = new THREE.MeshStandardMaterial({ map: pathTex, roughness: 0.88 });
    // Main North-South Avenue (Nile Camp -> Giza Plaza -> Chamber Forecourt)
    const mainAvenue = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.06, 26.5), pathMat);
    mainAvenue.position.set(0, 0.03, 1.2);
    mainAvenue.receiveShadow = true;
    scene.add(mainAvenue);

    // East-West Avenue (Temple of the Sun <-> Giza Plaza <-> Ancient Scribe Workshop)
    const crossAvenue = new THREE.Mesh(new THREE.BoxGeometry(27.0, 0.06, 4.8), pathMat);
    crossAvenue.position.set(0, 0.03, 2.2);
    crossAvenue.receiveShadow = true;
    scene.add(crossAvenue);

    // Central Giza Plaza Stone Octagon/Disc
    const plazaFloor = new THREE.Mesh(
      new THREE.CylinderGeometry(5.8, 6.1, 0.08, 16),
      pathMat,
    );
    plazaFloor.position.set(0, 0.04, 0.2);
    plazaFloor.receiveShadow = true;
    scene.add(plazaFloor);

    // Nile Waterfront Stone Embankment & Non-Walkable Water Surface (z > 15.2)
    const embankmentMat = new THREE.MeshStandardMaterial({
      color: 0xd0a66c,
      map: limestoneTex,
      roughness: 0.85,
    });
    const embankment = new THREE.Mesh(new THREE.BoxGeometry(46, 0.56, 0.72), embankmentMat);
    embankment.position.set(0, 0.24, 15.25);
    embankment.receiveShadow = true;
    embankment.castShadow = true;
    scene.add(embankment);

    const copingCap = new THREE.Mesh(new THREE.BoxGeometry(46, 0.1, 0.82), embankmentMat);
    copingCap.position.set(0, 0.54, 15.25);
    copingCap.receiveShadow = true;
    scene.add(copingCap);

    const nileWaterMat = new THREE.MeshStandardMaterial({
      color: isNightInit ? NIGHT_WATER_COLOR.getHex() : DAY_WATER_COLOR.getHex(),
      map: nileWaterTex,
      roughness: 0.2,
      metalness: 0.16,
    });
    const nileWater = new THREE.Mesh(new THREE.PlaneGeometry(140, 42), nileWaterMat);
    nileWater.rotation.x = -Math.PI / 2;
    nileWater.position.set(0, -0.22, 36.2);
    scene.add(nileWater);

    // Subtle shallow shoreline foam edge south of stone embankment
    const shallowsMat = new THREE.MeshStandardMaterial({
      color: 0x7bdff0,
      transparent: true,
      opacity: 0.36,
      roughness: 0.4,
    });
    const shallowsStrip = new THREE.Mesh(new THREE.PlaneGeometry(54, 0.7), shallowsMat);
    shallowsStrip.rotation.x = -Math.PI / 2;
    shallowsStrip.position.set(0, -0.19, 15.85);
    scene.add(shallowsStrip);

    // Shoreline Nile Papyrus Reed Clusters strictly south of walkable embankment (z >= 15.7)
    [-14.5, -9.2, -4.1, 4.4, 9.8, 15.0].forEach((rx, idx) => {
      const reeds = createShorelineReedsGroup();
      reeds.position.set(rx, -0.22, 15.75 + (idx % 2) * 0.24);
      reeds.rotation.y = idx * 0.85;
      scene.add(reeds);
    });

    // Planked Wooden Nile Dock Jetty extending south over the water
    const timberMat = new THREE.MeshStandardMaterial({ color: 0x7a502d, roughness: 0.78 });
    const timberDarkMat = new THREE.MeshStandardMaterial({ color: 0x5c391e, roughness: 0.84 });
    const ropeMat = new THREE.MeshStandardMaterial({ color: 0xc9a36a, roughness: 0.9 });
    const dockDeck = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.18, 3.6), timberMat);
    dockDeck.position.set(0, 0.24, 15.8);
    dockDeck.receiveShadow = true;
    dockDeck.castShadow = true;
    scene.add(dockDeck);
    for (let pz = 14.25; pz <= 17.35; pz += 0.44) {
      const plank = new THREE.Mesh(new THREE.BoxGeometry(3.32, 0.05, 0.34), timberDarkMat);
      plank.position.set(0, 0.35, pz);
      plank.receiveShadow = true;
      scene.add(plank);
    }
    for (const px of [-1.45, 1.45]) {
      for (const pz of [14.5, 17.2]) {
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, 1.02, 8), timberMat);
        post.position.set(px, 0.45, pz);
        post.castShadow = true;
        scene.add(post);

        const ropeWrap = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.032, 6, 12), ropeMat);
        ropeWrap.rotation.x = Math.PI / 2;
        ropeWrap.position.set(px, 0.74, pz);
        scene.add(ropeWrap);
      }
    }
    // Dock pier lantern on southeast bollard
    const dockLanternCap = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.12, 6), timberDarkMat);
    dockLanternCap.position.set(1.45, 1.24, 17.2);
    scene.add(dockLanternCap);
    const dockLantern = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.28, 0.2), lanternGlowMat);
    dockLantern.position.set(1.45, 1.07, 17.2);
    scene.add(dockLantern);

    // Animated Felucca Boats on the Nile
    const boats: { group: THREE.Group; baseX: number; range: number; speed: number }[] = [];
    const felucca1 = createFeluccaBoatGroup();
    felucca1.position.set(-8, -0.22, 22.5);
    felucca1.rotation.y = Math.PI * 0.48;
    scene.add(felucca1);
    boats.push({ group: felucca1, baseX: -8, range: 6, speed: 0.34 });

    const felucca2 = createFeluccaBoatGroup();
    felucca2.position.set(11, -0.22, 27.5);
    felucca2.rotation.y = -Math.PI * 0.46;
    scene.add(felucca2);
    boats.push({ group: felucca2, baseX: 11, range: 5.5, speed: -0.28 });

    // -----------------------------------------------------------------------
    // 2. Monumental Giza Horizon Backdrop (3 Great Pyramids + Companion Pyramids + Dunes)
    // -----------------------------------------------------------------------
    const limestoneMat = new THREE.MeshStandardMaterial({
      color: 0xe8be7d,
      map: limestoneTex,
      roughness: 0.86,
    });
    const goldCapstoneMat = new THREE.MeshStandardMaterial({
      color: 0xe7b43c,
      roughness: 0.28,
      metalness: 0.55,
    });
    const pyramidSpecs: [number, number, number, number, boolean][] = [
      [-18, -36, 17.5, 13.5, true],
      [14, -42, 15.0, 11.4, true],
      [-1, -48, 11.5, 8.6, true],
      [-30, -45, 7.6, 5.8, false],
      [25, -49, 6.8, 5.2, false],
    ];
    pyramidSpecs.forEach(([px, pz, baseSize, h, hasPortico], idx) => {
      const pGroup = new THREE.Group();
      pGroup.position.set(px, 0, pz);

      const terrace = new THREE.Mesh(
        new THREE.BoxGeometry(baseSize * 1.12, 0.65, baseSize * 1.12),
        limestoneMat,
      );
      terrace.position.y = 0.32;
      pGroup.add(terrace);

      const body = new THREE.Mesh(new THREE.ConeGeometry(baseSize * 0.72, h, 4), limestoneMat);
      body.position.y = 0.6 + h / 2;
      body.rotation.y = Math.PI / 4;
      pGroup.add(body);

      const capstone = new THREE.Mesh(
        new THREE.ConeGeometry(baseSize * 0.145, h * 0.18, 4),
        goldCapstoneMat,
      );
      capstone.position.y = 0.6 + h * 0.91;
      capstone.rotation.y = Math.PI / 4;
      pGroup.add(capstone);

      if (hasPortico && idx === 0) {
        const porticoFrame = new THREE.Mesh(new THREE.BoxGeometry(3.4, 2.2, 1.5), limestoneMat);
        porticoFrame.position.set(0, 1.1, baseSize * 0.52);
        pGroup.add(porticoFrame);
        const porticoVoid = new THREE.Mesh(
          new THREE.BoxGeometry(1.7, 1.45, 0.35),
          new THREE.MeshStandardMaterial({ color: 0x261b12, roughness: 0.95 }),
        );
        porticoVoid.position.set(0, 0.9, baseSize * 0.52 + 0.65);
        pGroup.add(porticoVoid);
      }

      scene.add(pGroup);
    });

    // Distant Rolling Sand Dunes
    const duneMat = new THREE.MeshStandardMaterial({ color: 0xe5bb7d, roughness: 0.95 });
    const duneCoords: [number, number, number][] = [
      [-34, -22, 9],
      [35, -20, 8.5],
      [-38, 4, 7.5],
      [39, 6, 8],
    ];
    duneCoords.forEach(([dx, dz, rad]) => {
      const dune = new THREE.Mesh(
        new THREE.SphereGeometry(rad, 16, 10, 0, Math.PI * 2, 0, Math.PI * 0.5),
        duneMat,
      );
      dune.scale.set(1.6, 0.34, 1.1);
      dune.position.set(dx, -0.3, dz);
      scene.add(dune);
    });

    // Clouds
    const cloudMat = new THREE.MeshStandardMaterial({
      color: isNightInit ? NIGHT_CLOUD_COLOR.getHex() : DAY_CLOUD_COLOR.getHex(),
      roughness: 0.9,
      flatShading: true,
    });
    const clouds: { group: THREE.Group; baseX: number; speed: number }[] = [];
    [
      [-22, 24, -24, 0.8],
      [18, 26, -30, 0.65],
      [2, 28, -36, 0.55],
    ].forEach(([cx, cy, cz, speed]) => {
      const c = createCloudCluster(cloudMat);
      c.position.set(cx, cy, cz);
      scene.add(c);
      clouds.push({ group: c, baseX: cx, speed });
    });

    // -----------------------------------------------------------------------
    // 3. Landmark 1–5 3D Architecture (Aligned 1:1 with Collision Boxes/Circles)
    // -----------------------------------------------------------------------
    const sandstoneWallMat = new THREE.MeshStandardMaterial({
      color: 0xdfb77a,
      map: limestoneTex,
      roughness: 0.84,
    });
    const sandstoneDarkMat = new THREE.MeshStandardMaterial({ color: 0xb5864c, roughness: 0.88 });
    const reliefPanelMat = new THREE.MeshStandardMaterial({
      map: reliefTex,
      roughness: 0.78,
    });
    const lapisMat = new THREE.MeshStandardMaterial({ color: 0x254eac, roughness: 0.45 });
    const turquoiseMat = new THREE.MeshStandardMaterial({ color: 0x12b8b0, roughness: 0.45 });
    const creamCanvasMat = new THREE.MeshStandardMaterial({ color: 0xf6ead2, roughness: 0.86 });
    const tentInteriorMat = new THREE.MeshStandardMaterial({ color: 0x2d2219, roughness: 0.95 });
    const coralStripeMat = new THREE.MeshStandardMaterial({ color: 0xed7852, roughness: 0.72 });
    const terracottaCrateMat = new THREE.MeshStandardMaterial({ color: 0x9c6635, roughness: 0.82 });

    // Helper for warm desert camp/temple lanterns
    const addLantern = (x: number, y: number, z: number) => {
      const cap = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.11, 4), timberDarkMat);
      cap.position.set(x, y + 0.21, z);
      cap.rotation.y = Math.PI / 4;
      scene.add(cap);
      const l = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.34, 0.24), lanternGlowMat);
      l.position.set(x, y, z);
      scene.add(l);
    };

    // STOP 1: Nile Expedition Camp
    // Main Canvas Tent (minX: -6.4, maxX: -2.8, minZ: 9.0, maxZ: 12.2 -> center -4.6, 10.6)
    const mainTent = new THREE.Group();
    mainTent.position.set(-4.6, 0, 10.6);
    const mainBody = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.7, 2.8), creamCanvasMat);
    mainBody.position.y = 0.85;
    mainBody.castShadow = true;
    mainBody.receiveShadow = true;
    mainTent.add(mainBody);
    // Open tent doorway & rolled canvas flaps facing north toward camp center (-Z local)
    const mainDoorVoid = new THREE.Mesh(new THREE.BoxGeometry(1.18, 1.38, 0.14), tentInteriorMat);
    mainDoorVoid.position.set(0, 0.69, -1.36);
    mainTent.add(mainDoorVoid);
    for (const side of [-1, 1]) {
      const flap = new THREE.Mesh(new THREE.BoxGeometry(0.24, 1.34, 0.16), turquoiseMat);
      flap.position.set(side * 0.68, 0.68, -1.39);
      flap.rotation.z = side * 0.12;
      mainTent.add(flap);
    }
    for (const px of [-1.62, 1.62]) {
      for (const pz of [-1.42, 1.42]) {
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.065, 1.85, 8), timberMat);
        pole.position.set(px, 0.92, pz);
        mainTent.add(pole);
      }
    }
    const mainRoof = new THREE.Mesh(new THREE.ConeGeometry(2.55, 1.38, 4), turquoiseMat);
    mainRoof.position.y = 2.4;
    mainRoof.rotation.y = Math.PI / 4;
    mainRoof.castShadow = true;
    mainTent.add(mainRoof);
    const mainValance = new THREE.Mesh(new THREE.BoxGeometry(3.48, 0.18, 3.06), coralStripeMat);
    mainValance.position.y = 1.72;
    mainTent.add(mainValance);
    const mainFinial = new THREE.Mesh(new THREE.SphereGeometry(0.11, 8, 8), goldCapstoneMat);
    mainFinial.position.y = 3.12;
    mainTent.add(mainFinial);
    // Expedition supply crate tucked strictly inside tent front-left corner
    const mainCrate = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.44, 0.46), terracottaCrateMat);
    mainCrate.position.set(-1.12, 0.22, -1.25);
    mainCrate.castShadow = true;
    mainTent.add(mainCrate);
    scene.add(mainTent);
    addLantern(-2.85, 1.55, 9.2);

    // Supply Shelter Tent (minX: 3.4, maxX: 6.6, minZ: 9.4, maxZ: 12.4 -> center 5.0, 10.9)
    const supplyTent = new THREE.Group();
    supplyTent.position.set(5.0, 0, 10.9);
    const supBody = new THREE.Mesh(new THREE.BoxGeometry(2.85, 1.55, 2.6), creamCanvasMat);
    supBody.position.y = 0.78;
    supBody.castShadow = true;
    supplyTent.add(supBody);
    const supDoorVoid = new THREE.Mesh(new THREE.BoxGeometry(1.08, 1.24, 0.14), tentInteriorMat);
    supDoorVoid.position.set(0, 0.62, -1.26);
    supplyTent.add(supDoorVoid);
    for (const px of [-1.42, 1.42]) {
      for (const pz of [-1.3, 1.3]) {
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 1.66, 8), timberMat);
        pole.position.set(px, 0.83, pz);
        supplyTent.add(pole);
      }
    }
    const supRoof = new THREE.Mesh(new THREE.ConeGeometry(2.25, 1.15, 4), coralStripeMat);
    supRoof.position.y = 2.12;
    supRoof.rotation.y = Math.PI / 4;
    supRoof.castShadow = true;
    supplyTent.add(supRoof);
    const supValance = new THREE.Mesh(new THREE.BoxGeometry(3.06, 0.16, 2.82), turquoiseMat);
    supValance.position.y = 1.55;
    supplyTent.add(supValance);
    // Stacked expedition crates inside shelter footprint
    const crate1 = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.44, 0.5), terracottaCrateMat);
    crate1.position.set(-0.98, 0.22, -1.12);
    crate1.castShadow = true;
    supplyTent.add(crate1);
    const crate2 = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.32, 0.36), timberMat);
    crate2.position.set(-0.96, 0.6, -1.12);
    crate2.rotation.y = 0.22;
    supplyTent.add(crate2);
    scene.add(supplyTent);
    addLantern(3.45, 1.45, 9.6);

    // Camp Briefing Map Table (minX: -2.5, maxX: -1.3, minZ: 7.5, maxZ: 8.7 -> center -1.9, 8.1)
    const tableGroup = new THREE.Group();
    tableGroup.position.set(-1.9, 0, 8.1);
    const tableTop = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.1, 1.05), timberMat);
    tableTop.position.y = 0.78;
    tableTop.castShadow = true;
    tableGroup.add(tableTop);
    const mapSheet = new THREE.Mesh(
      new THREE.PlaneGeometry(0.84, 0.78),
      new THREE.MeshStandardMaterial({ map: campMapTex, roughness: 0.75 }),
    );
    mapSheet.rotation.x = -Math.PI / 2;
    mapSheet.position.y = 0.84;
    tableGroup.add(mapSheet);
    // Expedition notebook & brass compass on briefing table
    const fieldBook = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.035, 0.18), lapisMat);
    fieldBook.position.set(0.36, 0.85, 0.3);
    fieldBook.rotation.y = 0.35;
    tableGroup.add(fieldBook);
    const compass = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.03, 12), goldCapstoneMat);
    compass.position.set(-0.36, 0.85, -0.3);
    tableGroup.add(compass);
    for (const lx of [-0.46, 0.46]) {
      for (const lz of [-0.42, 0.42]) {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.76, 0.1), timberMat);
        leg.position.set(lx, 0.38, lz);
        tableGroup.add(leg);
      }
    }
    const crossBrace = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.07, 0.08), timberDarkMat);
    crossBrace.position.set(0, 0.24, 0);
    tableGroup.add(crossBrace);
    scene.add(tableGroup);

    // STOP 2: Giza Pyramid Plaza — Sculpted Sphinx Monument & Survey Obelisk
    // Sphinx Plinth (minX: -8.6, maxX: -4.8, minZ: -3.5, maxZ: -0.7 -> center -6.7, -2.1)
    const sphinxGroup = createSphinxMonumentGroup(
      sandstoneWallMat,
      sandstoneDarkMat,
      lapisMat,
      goldCapstoneMat,
    );
    sphinxGroup.position.set(-6.7, 0, -2.1);
    scene.add(sphinxGroup);

    // Giza Plaza Obelisk (x: -3.6, z: 2.5, r: 0.85)
    const obeliskGroup = new THREE.Group();
    obeliskGroup.position.set(-3.6, 0, 2.5);
    const obBase = new THREE.Mesh(new THREE.BoxGeometry(1.38, 0.56, 1.38), sandstoneDarkMat);
    obBase.position.y = 0.28;
    obBase.castShadow = true;
    obeliskGroup.add(obBase);
    const obPlinth = new THREE.Mesh(new THREE.BoxGeometry(1.06, 0.34, 1.06), sandstoneWallMat);
    obPlinth.position.y = 0.73;
    obeliskGroup.add(obPlinth);
    const obShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.46, 3.85, 4), limestoneMat);
    obShaft.position.y = 2.82;
    obShaft.rotation.y = Math.PI / 4;
    obShaft.castShadow = true;
    obeliskGroup.add(obShaft);
    const obCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.34, 0.18, 4), lapisMat);
    obCollar.position.y = 4.42;
    obCollar.rotation.y = Math.PI / 4;
    obeliskGroup.add(obCollar);
    const obTip = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.62, 4), goldCapstoneMat);
    obTip.position.y = 5.05;
    obTip.rotation.y = Math.PI / 4;
    obeliskGroup.add(obTip);
    scene.add(obeliskGroup);

    // STOP 3: Ancient Scribe Workshop (East Courtyard)
    // Pavilion (minX: 13.8, maxX: 18.6, minZ: -0.2, maxZ: 5.2 -> center 16.2, 2.5)
    const workshopGroup = new THREE.Group();
    workshopGroup.position.set(16.2, 0, 2.5);
    const wBase = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.34, 5.2), sandstoneDarkMat);
    wBase.position.y = 0.17;
    wBase.receiveShadow = true;
    workshopGroup.add(wBase);
    const wHall = new THREE.Mesh(new THREE.BoxGeometry(3.6, 3.15, 4.5), sandstoneWallMat);
    wHall.position.set(0.45, 1.88, 0);
    wHall.castShadow = true;
    workshopGroup.add(wHall);
    // Decorative Hieroglyphic Relief panel facing west courtyard
    const wRelief = new THREE.Mesh(new THREE.PlaneGeometry(3.7, 1.1), reliefPanelMat);
    wRelief.position.set(-1.37, 1.5, 0);
    wRelief.rotation.y = -Math.PI / 2;
    workshopGroup.add(wRelief);
    // Recessed arched doorway in pavilion west wall
    const wDoorFrame = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.85, 1.32), lapisMat);
    wDoorFrame.position.set(-1.38, 1.24, 0);
    workshopGroup.add(wDoorFrame);
    const wDoorPanel = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.68, 1.04), timberDarkMat);
    wDoorPanel.position.set(-1.42, 1.16, 0);
    workshopGroup.add(wDoorPanel);
    // Twin portico columns + awning supporting sign canopy
    for (const cz of [-1.95, 1.95]) {
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 2.65, 10), sandstoneWallMat);
      col.position.set(-1.95, 1.64, cz);
      col.castShadow = true;
      workshopGroup.add(col);
      const capRing = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.16, 0.24, 10), turquoiseMat);
      capRing.position.set(-1.95, 2.95, cz);
      workshopGroup.add(capRing);
    }
    const wTrimTop = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.34, 4.85), turquoiseMat);
    wTrimTop.position.set(0.35, 3.6, 0);
    workshopGroup.add(wTrimTop);
    const wCanopy = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.16, 4.75), lapisMat);
    wCanopy.position.set(-1.62, 3.04, 0);
    wCanopy.castShadow = true;
    workshopGroup.add(wCanopy);
    const wAwningStripe = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.18, 4.75), goldCapstoneMat);
    wAwningStripe.position.set(-2.34, 2.94, 0);
    workshopGroup.add(wAwningStripe);
    // Wooden scroll shelf tucked under north portico overhang
    const scrollShelf = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.85, 0.9), timberMat);
    scrollShelf.position.set(-1.55, 0.76, -1.32);
    workshopGroup.add(scrollShelf);
    for (let s = 0; s < 3; s++) {
      const rolledScroll = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.06, 0.42, 8),
        creamCanvasMat,
      );
      rolledScroll.rotation.z = Math.PI / 2;
      rolledScroll.position.set(-1.58, 1.25 + (s % 2) * 0.1, -1.52 + s * 0.2);
      workshopGroup.add(rolledScroll);
      const ribbon = new THREE.Mesh(new THREE.CylinderGeometry(0.066, 0.066, 0.05, 8), coralStripeMat);
      ribbon.rotation.z = Math.PI / 2;
      ribbon.position.set(-1.58, 1.25 + (s % 2) * 0.1, -1.52 + s * 0.2);
      workshopGroup.add(ribbon);
    }
    const wSign = new THREE.Mesh(
      new THREE.PlaneGeometry(3.1, 1.05),
      new THREE.MeshBasicMaterial({ map: scribeSignTex }),
    );
    wSign.position.set(-1.66, 3.55, 0);
    wSign.rotation.y = -Math.PI / 2;
    workshopGroup.add(wSign);
    scene.add(workshopGroup);
    addLantern(13.9, 2.4, 0.3);
    addLantern(13.9, 2.4, 4.7);

    // Outdoor Scribe Papyrus Desk (minX: 12.2, maxX: 13.5, minZ: 4.1, maxZ: 5.3 -> center 12.85, 4.7)
    const scribeDesk = new THREE.Group();
    scribeDesk.position.set(12.85, 0, 4.7);
    const sDeskBase = new THREE.Mesh(new THREE.BoxGeometry(1.12, 0.78, 1.02), timberMat);
    sDeskBase.position.y = 0.39;
    sDeskBase.castShadow = true;
    scribeDesk.add(sDeskBase);
    const sDeskTop = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.08, 1.1), timberDarkMat);
    sDeskTop.position.y = 0.81;
    scribeDesk.add(sDeskTop);
    // Illustrated open papyrus scroll with wooden rollers + ink bowls & reed pen
    const papyrusSheet = new THREE.Mesh(
      new THREE.PlaneGeometry(0.66, 0.56),
      new THREE.MeshStandardMaterial({ map: scrollTex, roughness: 0.72 }),
    );
    papyrusSheet.rotation.x = -Math.PI / 2;
    papyrusSheet.position.set(-0.08, 0.86, 0);
    scribeDesk.add(papyrusSheet);
    for (const rz of [-0.28, 0.28]) {
      const roller = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.72, 8), timberMat);
      roller.rotation.z = Math.PI / 2;
      roller.position.set(-0.08, 0.87, rz);
      scribeDesk.add(roller);
    }
    const lapisInk = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.06, 0.08, 10), lapisMat);
    lapisInk.position.set(0.38, 0.89, -0.24);
    scribeDesk.add(lapisInk);
    const ochreInk = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.055, 0.08, 10), coralStripeMat);
    ochreInk.position.set(0.38, 0.89, 0.04);
    scribeDesk.add(ochreInk);
    const glyphTablet = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.05, 0.3), sandstoneWallMat);
    glyphTablet.position.set(0.36, 0.88, 0.32);
    glyphTablet.rotation.y = -0.25;
    scribeDesk.add(glyphTablet);
    scene.add(scribeDesk);

    // Scribe Pottery Amphorae & Woven Papyrus Basket (x: 14.0, z: 6.4)
    const potteryGroup = createPotteryAmphoraGroup();
    potteryGroup.position.set(14.0, 0, 6.4);
    scene.add(potteryGroup);

    // STOP 4: Temple of the Sun (West Courtyard)
    // Pylon (minX: -18.8, maxX: -14.2, minZ: -0.8, maxZ: 5.2 -> center -16.5, 2.2)
    const pylonGroup = new THREE.Group();
    pylonGroup.position.set(-16.5, 0, 2.2);
    const pyTerrace = new THREE.Mesh(new THREE.BoxGeometry(4.45, 0.28, 5.85), sandstoneDarkMat);
    pyTerrace.position.y = 0.14;
    pyTerrace.receiveShadow = true;
    pylonGroup.add(pyTerrace);
    for (const tz of [-1.72, 1.72]) {
      // Tapered battered pylon tower silhouette (base + upper + cavetto cornice)
      const towerBase = new THREE.Mesh(new THREE.BoxGeometry(4.0, 2.5, 2.08), sandstoneWallMat);
      towerBase.position.set(0, 1.48, tz);
      towerBase.castShadow = true;
      towerBase.receiveShadow = true;
      pylonGroup.add(towerBase);

      const towerUpper = new THREE.Mesh(new THREE.BoxGeometry(3.62, 2.15, 1.84), sandstoneWallMat);
      towerUpper.position.set(0, 3.8, tz);
      towerUpper.castShadow = true;
      pylonGroup.add(towerUpper);

      const cornice = new THREE.Mesh(new THREE.BoxGeometry(3.92, 0.28, 2.06), turquoiseMat);
      cornice.position.set(0, 4.98, tz);
      pylonGroup.add(cornice);

      const towerFrieze = new THREE.Mesh(new THREE.PlaneGeometry(1.58, 1.4), reliefPanelMat);
      towerFrieze.position.set(2.01, 1.6, tz);
      towerFrieze.rotation.y = Math.PI / 2;
      pylonGroup.add(towerFrieze);
    }
    const pyLintel = new THREE.Mesh(new THREE.BoxGeometry(3.55, 1.1, 5.4), sandstoneDarkMat);
    pyLintel.position.set(0, 4.15, 0);
    pyLintel.castShadow = true;
    pylonGroup.add(pyLintel);
    // Winged Solar Disc Emblem facing east courtyard (+X)
    const sunDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.56, 0.56, 0.24, 18), goldCapstoneMat);
    sunDisc.rotation.z = Math.PI / 2;
    sunDisc.position.set(1.86, 4.22, 0);
    pylonGroup.add(sunDisc);
    for (const side of [-1, 1]) {
      const wingUpper = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.24, 1.38), turquoiseMat);
      wingUpper.position.set(1.84, 4.28, side * 1.15);
      wingUpper.rotation.x = side * -0.14;
      pylonGroup.add(wingUpper);
      const wingGold = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.14, 1.18), goldCapstoneMat);
      wingGold.position.set(1.84, 4.08, side * 1.06);
      wingGold.rotation.x = side * -0.14;
      pylonGroup.add(wingGold);
    }
    // Ceremonial Sun-Dial Altar Pedestal strictly inside recessed pylon archway
    const sunAltarBase = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.58, 0.95, 8), sandstoneDarkMat);
    sunAltarBase.position.set(0.65, 0.72, 0);
    sunAltarBase.castShadow = true;
    pylonGroup.add(sunAltarBase);
    const sunAltarDial = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.08, 12), lapisMat);
    sunAltarDial.position.set(0.65, 1.24, 0);
    pylonGroup.add(sunAltarDial);
    const sunAltarGnomon = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.34, 4), goldCapstoneMat);
    sunAltarGnomon.position.set(0.65, 1.42, 0);
    pylonGroup.add(sunAltarGnomon);

    const tSign = new THREE.Mesh(
      new THREE.PlaneGeometry(3.05, 1.0),
      new THREE.MeshBasicMaterial({ map: templeSignTex }),
    );
    tSign.position.set(2.02, 2.86, 0);
    tSign.rotation.y = Math.PI / 2;
    pylonGroup.add(tSign);
    scene.add(pylonGroup);
    addLantern(-14.4, 2.25, 0.48);
    addLantern(-14.4, 2.25, 3.92);

    // 4 Temple Lotus Columns (strictly inside r = 0.66)
    [
      [-13.1, -1.5],
      [-13.1, 5.8],
      [-18.1, -1.5],
      [-18.1, 5.8],
    ].forEach(([cx, cz]) => {
      const col = new THREE.Group();
      col.position.set(cx, 0, cz);
      const plinth = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.64, 0.36, 8), sandstoneDarkMat);
      plinth.position.y = 0.18;
      col.add(plinth);
      const plinthStep = new THREE.Mesh(new THREE.CylinderGeometry(0.49, 0.54, 0.18, 8), sandstoneWallMat);
      plinthStep.position.y = 0.45;
      col.add(plinthStep);
      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.44, 3.45, 10), sandstoneWallMat);
      shaft.position.y = 2.22;
      shaft.castShadow = true;
      col.add(shaft);
      const neckBand1 = new THREE.Mesh(new THREE.TorusGeometry(0.39, 0.045, 6, 12), lapisMat);
      neckBand1.rotation.x = Math.PI / 2;
      neckBand1.position.y = 3.74;
      col.add(neckBand1);
      const neckBand2 = new THREE.Mesh(new THREE.TorusGeometry(0.37, 0.04, 6, 12), goldCapstoneMat);
      neckBand2.rotation.x = Math.PI / 2;
      neckBand2.position.y = 3.86;
      col.add(neckBand2);
      const capital = new THREE.Mesh(new THREE.CylinderGeometry(0.64, 0.34, 0.68, 10), turquoiseMat);
      capital.position.y = 4.24;
      col.add(capital);
      const abacus = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.16, 0.88), sandstoneDarkMat);
      abacus.position.y = 4.65;
      col.add(abacus);
      scene.add(col);
    });

    // STOP 5: Sealed Chamber of Wisdom Façade (North — minX: -5.2, maxX: 5.2, minZ: -18.5, maxZ: -12.6)
    const chamberGroup = new THREE.Group();
    chamberGroup.position.set(0, 0, -15.5);
    const cApron = new THREE.Mesh(new THREE.BoxGeometry(10.2, 0.24, 5.75), sandstoneDarkMat);
    cApron.position.y = 0.12;
    cApron.receiveShadow = true;
    chamberGroup.add(cApron);

    const cBackdrop = new THREE.Mesh(new THREE.BoxGeometry(10.0, 5.2, 5.2), sandstoneDarkMat);
    cBackdrop.position.y = 2.7;
    cBackdrop.castShadow = true;
    cBackdrop.receiveShadow = true;
    chamberGroup.add(cBackdrop);

    const cUpperPylon = new THREE.Mesh(new THREE.BoxGeometry(9.4, 1.35, 4.75), sandstoneWallMat);
    cUpperPylon.position.y = 5.95;
    cUpperPylon.castShadow = true;
    chamberGroup.add(cUpperPylon);

    const cCornice = new THREE.Mesh(new THREE.BoxGeometry(10.1, 0.32, 5.25), turquoiseMat);
    cCornice.position.y = 6.72;
    chamberGroup.add(cCornice);

    // Flanking Hieroglyphic Relief Panels & Stone Lectern Tablets strictly inside facade footprint
    for (const side of [-1, 1]) {
      const sideRelief = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 1.45), reliefPanelMat);
      sideRelief.position.set(side * 3.65, 3.05, 2.62);
      chamberGroup.add(sideRelief);

      const tabletPed = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.95, 0.38), sandstoneDarkMat);
      tabletPed.position.set(side * 3.65, 0.65, 2.68);
      chamberGroup.add(tabletPed);

      const tabletFace = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.72, 0.14), lapisMat);
      tabletFace.position.set(side * 3.65, 1.24, 2.72);
      tabletFace.rotation.x = -0.35;
      chamberGroup.add(tabletFace);
    }

    // Inlaid Gold & Lapis Portal Frame + Physically Sealed Basalt Double Door
    const cFrameOuter = new THREE.Mesh(new THREE.BoxGeometry(4.95, 4.95, 0.48), goldCapstoneMat);
    cFrameOuter.position.set(0, 2.55, 2.66);
    chamberGroup.add(cFrameOuter);
    const cFrameInner = new THREE.Mesh(new THREE.BoxGeometry(4.42, 4.55, 0.48), lapisMat);
    cFrameInner.position.set(0, 2.38, 2.74);
    chamberGroup.add(cFrameInner);

    const sealedDoorMat = new THREE.MeshStandardMaterial({
      color: 0x263143,
      roughness: 0.42,
      metalness: 0.35,
    });
    const sealedDoor = new THREE.Mesh(new THREE.BoxGeometry(3.8, 4.1, 0.34), sealedDoorMat);
    sealedDoor.position.set(0, 2.15, 2.86);
    chamberGroup.add(sealedDoor);

    const doorCenterSeam = new THREE.Mesh(new THREE.BoxGeometry(0.1, 4.05, 0.1), goldCapstoneMat);
    doorCenterSeam.position.set(0, 2.15, 3.02);
    chamberGroup.add(doorCenterSeam);

    for (const barY of [1.1, 3.2]) {
      const lockBar = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.16, 0.12), goldCapstoneMat);
      lockBar.position.set(0, barY, 3.02);
      chamberGroup.add(lockBar);
    }

    const lockRim = new THREE.Mesh(new THREE.CylinderGeometry(0.76, 0.76, 0.18, 8), goldCapstoneMat);
    lockRim.rotation.x = Math.PI / 2;
    lockRim.position.set(0, 2.15, 3.04);
    chamberGroup.add(lockRim);

    const lockMedallion = new THREE.Mesh(
      new THREE.CylinderGeometry(0.58, 0.58, 0.22, 8),
      sealedSealGlowMat,
    );
    lockMedallion.rotation.x = Math.PI / 2;
    lockMedallion.position.set(0, 2.15, 3.06);
    chamberGroup.add(lockMedallion);

    const cSign = new THREE.Mesh(
      new THREE.PlaneGeometry(4.4, 1.3),
      new THREE.MeshBasicMaterial({ map: chamberSignTex }),
    );
    cSign.position.set(0, 5.65, 2.48);
    chamberGroup.add(cSign);
    scene.add(chamberGroup);

    // 2 Chamber Guardian Sentinel Plinths (x: ±5.8, z: -12.2, r: 0.78)
    for (const gx of [-5.8, 5.8]) {
      const gGroup = new THREE.Group();
      gGroup.position.set(gx, 0, -12.2);
      const pedBase = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.74, 0.42, 8), sandstoneDarkMat);
      pedBase.position.y = 0.21;
      gGroup.add(pedBase);
      const ped = new THREE.Mesh(new THREE.CylinderGeometry(0.56, 0.62, 1.02, 8), sandstoneWallMat);
      ped.position.y = 0.93;
      ped.castShadow = true;
      gGroup.add(ped);
      // Sculpted seated sentinel guardian figure
      const sentinelTorso = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.92, 0.56), lapisMat);
      sentinelTorso.position.y = 1.9;
      sentinelTorso.castShadow = true;
      gGroup.add(sentinelTorso);
      const sentinelHood = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.34, 0.42, 6), goldCapstoneMat);
      sentinelHood.position.y = 2.52;
      gGroup.add(sentinelHood);
      const torchCup = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.12, 0.16, 8), goldCapstoneMat);
      torchCup.position.y = 2.8;
      gGroup.add(torchCup);
      const torch = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 8), lanternGlowMat);
      torch.position.y = 3.02;
      gGroup.add(torch);
      scene.add(gGroup);
    }

    // 2 Expedition Signposts
    [
      { x: 4.4, z: 5.8, yaw: -0.4 },
      { x: -4.4, z: -6.2, yaw: 0.4 },
    ].forEach((sp) => {
      const postGrp = new THREE.Group();
      postGrp.position.set(sp.x, 0, sp.z);
      postGrp.rotation.y = sp.yaw;
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 2.1, 8), timberMat);
      pole.position.y = 1.05;
      pole.castShadow = true;
      postGrp.add(pole);
      const arm1 = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.24, 0.08), coralStripeMat);
      arm1.position.set(0.25, 1.85, 0);
      postGrp.add(arm1);
      const arm2 = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.24, 0.08), turquoiseMat);
      arm2.position.set(-0.22, 1.5, 0);
      postGrp.add(arm2);
      scene.add(postGrp);
    });

    // 6 Swaying Date Palms (Aligned with EGYPT_CIRCLE_OBSTACLES)
    const palmRigs: DatePalmRig[] = [];
    [
      [-9.4, 11.4, 1.05],
      [9.5, 11.2, 1.02],
      [-16.2, 10.8, 1.15],
      [16.0, 10.6, 1.12],
      [-16.4, -7.8, 1.08],
      [16.2, -7.8, 1.08],
    ].forEach(([px, pz, scale]) => {
      const rig = createDatePalmRig(scale);
      rig.root.position.set(px, 0, pz);
      scene.add(rig.root);
      palmRigs.push(rig);
    });

    // 4 Desert Rock Outcrops
    const rockMat = new THREE.MeshStandardMaterial({ color: 0xc29258, roughness: 0.92, flatShading: true });
    [
      [-18.5, -13.6, 0.95],
      [18.4, -13.4, 0.95],
      [-12.4, -14.6, 0.88],
      [12.6, -14.6, 0.88],
    ].forEach(([rx, rz, sc], idx) => {
      const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(sc, 0), rockMat);
      rock.scale.set(1.2, 0.82, 1.1);
      rock.position.set(rx, sc * 0.45, rz);
      rock.rotation.y = idx * 1.1;
      rock.castShadow = true;
      scene.add(rock);
    });

    // -----------------------------------------------------------------------
    // 4. Player Avatar, 4 Interactive NPCs & POI Markers
    // -----------------------------------------------------------------------
    const playerRig = createProceduralAvatarRig(avatar, !isSoftwareGl);
    playerRig.root.position.set(EGYPT_SPAWN.x, 0, EGYPT_SPAWN.z);
    playerRig.root.rotation.y = EGYPT_SPAWN.yaw;
    scene.add(playerRig.root);
    playerRigRef.current = playerRig;
    prevAvatarStructRef.current = `${avatar.modelId}:${avatar.hairStyle}:${avatar.outfitId}`;

    const playerShadow = new THREE.Mesh(
      new THREE.PlaneGeometry(1.15, 1.15),
      new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }),
    );
    playerShadow.rotation.x = -Math.PI / 2;
    playerShadow.position.set(EGYPT_SPAWN.x, 0.025, EGYPT_SPAWN.z);
    scene.add(playerShadow);

    const npcRigs: Record<EgyptNpcId, EgyptNpcRig> = {
      npc_layla: createEgyptNpcRig('npc_layla'),
      npc_omar: createEgyptNpcRig('npc_omar'),
      npc_mariam: createEgyptNpcRig('npc_mariam'),
      npc_karim: createEgyptNpcRig('npc_karim'),
    };
    (Object.keys(npcRigs) as EgyptNpcId[]).forEach((npcId) => {
      const rig = npcRigs[npcId];
      const pos = EGYPT_NPC_POSITIONS[npcId];
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

    // Interactive POI ground rings + floating clickable diamonds
    const poiMarkers: {
      id: EgyptPoiId;
      ringMat: THREE.MeshBasicMaterial;
      diamond: THREE.Mesh;
      diamondMat: THREE.MeshStandardMaterial;
      baseY: number;
      accentHex: string;
    }[] = [];

    const ringGeo = new THREE.RingGeometry(0.62, 0.84, 28);
    const diamondGeo = new THREE.OctahedronGeometry(0.24, 0);

    for (const target of EGYPT_INTERACTIVE_TARGETS) {
      const ringMat = new THREE.MeshBasicMaterial({
        color: target.accentColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.78,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(target.position.x, 0.075, target.position.z);
      scene.add(ring);

      const diamondMat = new THREE.MeshStandardMaterial({
        color: target.accentColor,
        emissive: target.accentColor,
        emissiveIntensity: 0.65,
        roughness: 0.25,
      });
      const diamond = new THREE.Mesh(diamondGeo, diamondMat);
      const baseY = target.kind === 'npc' ? 2.18 : 2.38;
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

    let playerX = EGYPT_SPAWN.x;
    let playerZ = EGYPT_SPAWN.z;
    let playerYaw = EGYPT_SPAWN.yaw;
    let lastNearestPoi: EgyptPoiId | null = null;
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

      // Day / Night transitions
      skyUniforms.topColor.value.lerp(isNightNow ? NIGHT_SKY_TOP : DAY_SKY_TOP, 0.08);
      skyUniforms.bottomColor.value.lerp(isNightNow ? NIGHT_SKY_BOTTOM : DAY_SKY_BOTTOM, 0.08);
      if (scene.fog instanceof THREE.FogExp2) {
        scene.fog.color.lerp(isNightNow ? NIGHT_FOG : DAY_FOG, 0.08);
      }
      hemiLight.color.lerp(isNightNow ? NIGHT_HEMI_SKY : DAY_HEMI_SKY, 0.08);
      hemiLight.groundColor.lerp(isNightNow ? NIGHT_HEMI_GROUND : DAY_HEMI_GROUND, 0.08);
      hemiLight.intensity = THREE.MathUtils.lerp(hemiLight.intensity, isNightNow ? 0.56 : 0.92, 0.08);
      keyLight.color.lerp(isNightNow ? NIGHT_KEY_COLOR : DAY_KEY_COLOR, 0.08);
      keyLight.intensity = THREE.MathUtils.lerp(keyLight.intensity, isNightNow ? 0.92 : 1.75, 0.08);
      _vecA.copy(isNightNow ? NIGHT_KEY_POS : DAY_KEY_POS);
      keyLight.position.lerp(_vecA, 0.05);
      cloudMat.color.lerp(isNightNow ? NIGHT_CLOUD_COLOR : DAY_CLOUD_COLOR, 0.08);
      nileWaterMat.color.lerp(isNightNow ? NIGHT_WATER_COLOR : DAY_WATER_COLOR, 0.08);
      lanternGlowMat.emissiveIntensity = THREE.MathUtils.lerp(
        lanternGlowMat.emissiveIntensity,
        isNightNow ? 1.85 : 0.3,
        0.08,
      );
      sealedSealGlowMat.emissiveIntensity = THREE.MathUtils.lerp(
        sealedSealGlowMat.emissiveIntensity,
        isNightNow ? 1.35 : 0.5,
        0.08,
      );
      starMat.opacity = THREE.MathUtils.lerp(starMat.opacity, isNightNow ? 0.88 : 0, 0.08);

      // Ambient Nile water ripples, boats, clouds & palms
      nileWaterTex.offset.x = (nileWaterTex.offset.x + dt * 0.03 * motionScale) % 1;
      clouds.forEach((c) => {
        c.group.position.x = c.baseX + Math.sin(elapsed * 0.045 * c.speed) * 4 * motionScale;
      });
      boats.forEach((b) => {
        b.group.position.x = b.baseX + Math.sin(elapsed * 0.1 * b.speed) * b.range * motionScale;
        b.group.position.y = -0.22 + Math.sin(elapsed * 1.3 + b.baseX) * 0.035 * motionScale;
      });
      palmRigs.forEach((palm, idx) => {
        palm.crownGroup.rotation.z = Math.sin(elapsed * 0.9 + idx) * 0.045 * motionScale;
      });

      // Quick Travel
      const pendingQuickTravel = quickTravelRef.current;
      if (pendingQuickTravel && pendingQuickTravel.requestId !== lastQuickTravelId) {
        lastQuickTravelId = pendingQuickTravel.requestId;
        if (autoWalkRef.current) {
          lastCompletedAutoWalkId = autoWalkRef.current.requestId;
        }
        activeAutoWalkId = 0;
        const safeQt = resolveEgyptCollision(
          pendingQuickTravel.arrivalPoint.x,
          pendingQuickTravel.arrivalPoint.z,
        );
        playerX = safeQt.x;
        playerZ = safeQt.z;
        playerYaw = pendingQuickTravel.facingYaw;
        snapCameraNextFrame = true;
        onPositionRef.current?.({ x: playerX, z: playerZ });
      }

      // Player Movement (Manual overrides Auto-Walk)
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

          const next = resolveEgyptCollision(
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
              const snapped = resolveEgyptCollision(wp.x, wp.z);
              playerX = snapped.x;
              playerZ = snapped.z;
              autoWalkWaypointIdx += 1;

              if (autoWalkWaypointIdx >= aw.waypoints.length) {
                lastCompletedAutoWalkId = aw.requestId;
                activeAutoWalkId = 0;
                const destTarget = EGYPT_INTERACTIVE_TARGETS.find(
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
              const next = resolveEgyptCollision(
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

      // Animate player avatar
      const rig = playerRigRef.current;
      if (rig) {
        rig.root.position.set(playerX, 0, playerZ);
        rig.root.rotation.y = playerYaw;
        playerShadow.position.set(playerX, 0.025, playerZ);

        const stride = movingSpeed > 0.25 ? Math.sin(walkPhase) * 0.55 : 0;
        rig.parts.leftLeg.rotation.x = THREE.MathUtils.lerp(
          rig.parts.leftLeg.rotation.x,
          stride,
          0.24,
        );
        rig.parts.rightLeg.rotation.x = THREE.MathUtils.lerp(
          rig.parts.rightLeg.rotation.x,
          -stride,
          0.24,
        );
        rig.parts.leftArm.rotation.x = THREE.MathUtils.lerp(
          rig.parts.leftArm.rotation.x,
          -stride * 0.85,
          0.24,
        );

        if (interactTimerRef.current > 0) {
          interactTimerRef.current = Math.max(0, interactTimerRef.current - dt);
          rig.parts.rightArm.rotation.x = THREE.MathUtils.lerp(
            rig.parts.rightArm.rotation.x,
            -1.25,
            0.32,
          );
        } else {
          rig.parts.rightArm.rotation.x = THREE.MathUtils.lerp(
            rig.parts.rightArm.rotation.x,
            stride * 0.85,
            0.24,
          );
        }

        const bob =
          movingSpeed > 0.25
            ? Math.abs(Math.sin(walkPhase)) * 0.05
            : Math.sin(elapsed * 2.2) * 0.015;
        rig.parts.hips.position.y = bob;
      }

      // Animate 4 Egypt NPCs
      const activeNpc = activeNpcRef.current;
      (Object.keys(npcRigs) as EgyptNpcId[]).forEach((npcId, idx) => {
        const npc = npcRigs[npcId];
        const base = EGYPT_NPC_POSITIONS[npcId];
        const isTalking = activeNpc === npcId;
        const targetNpcYaw = isTalking
          ? Math.atan2(playerX - base.x, playerZ - base.z)
          : base.idleYaw;
        npc.root.rotation.y +=
          shortestAngleDiff(npc.root.rotation.y, targetNpcYaw) * Math.min(1, dt * 6);
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

      // Nearest POI & Guided Beacon
      const nearest = findNearestEgyptPoi(playerX, playerZ);
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

      // 3rd-Person Chase Camera
      const camDist = 8.4;
      const desiredCamX = playerX + Math.sin(camYaw) * Math.cos(camPitch) * camDist;
      const desiredCamY = Math.max(1.5, Math.sin(camPitch) * camDist + 1.6);
      const desiredCamZ = Math.min(
        EGYPT_BOUNDS.maxZ + 6,
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
      (Object.values(npcRigs) as EgyptNpcRig[]).forEach((r) => r.dispose());
      palmRigs.forEach((p) => p.dispose());
      disposeObjectGeometries(scene);

      [
        sandTex,
        pathTex,
        limestoneTex,
        reliefTex,
        nileWaterTex,
        scrollTex,
        campMapTex,
        scribeSignTex,
        templeSignTex,
        chamberSignTex,
        shadowTex,
      ].forEach((t) => t.dispose());
      envTarget.dispose();
      pmrem.dispose();
      renderer.dispose();
      container.innerHTML = '';
    };
  }, []);

  return <div ref={containerRef} className="h-full w-full" aria-label="Egypt Expedition 3D World" />;
}
