import { useEffect, useRef, type MutableRefObject } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import type { AvatarConfig, ResolvedAppearance } from '../../types/game';
import {
  KENYA_AMINA_POS,
  KENYA_BOUNDS,
  KENYA_INTERACTIVE_TARGETS,
  KENYA_SPAWN,
  KENYA_TOURIST_VIEWPOINTS,
  type KenyaLandmarkId,
  type KenyaPoiId,
} from '../../data/kenyaWorld';
import { getActiveConversationForTourist, type TouristNpcId } from '../../data/kenyaPractice';
import { findNearestKenyaPoi, resolveKenyaCollision } from '../../utils/kenyaCollision';
import {
  createProceduralAvatarRig,
  disposeObjectGeometries,
} from '../avatar/proceduralAvatarRig';
import {
  createAminaNpcRig,
  createDanielTouristRig,
  createElephantRig,
  createEmmaTouristRig,
  createGiraffeRig,
  createSoaringBird,
  createZebraRig,
  type AnimatedElephantRig,
  type AnimatedGiraffeRig,
  type AnimatedZebraRig,
  type SoaringBirdRig,
} from './kenyaProceduralModels';
import type { JoystickVector } from '../india/VirtualJoystick';
import type {
  ActiveAutoWalkRequest,
  ActiveQuickTravelRequest,
} from '../../utils/worldNavigation';

export interface KenyaSceneProps {
  avatar: AvatarConfig;
  appearance: ResolvedAppearance;
  reducedMotion: boolean;
  cameraSensitivity: number;
  paused: boolean;
  visitedPoiIds: KenyaPoiId[];
  guidedPoiId?: KenyaPoiId | null;
  practicedIds?: KenyaLandmarkId[];
  ambassadorStageActive?: boolean;
  activeDialogueOpen: boolean;
  activeTouristNpcId?: TouristNpcId | null;
  interactGestureSeq: number;
  celebrationSeq?: number;
  joystickRef: MutableRefObject<JoystickVector>;
  autoWalkRequest?: ActiveAutoWalkRequest | null;
  quickTravelRequest?: ActiveQuickTravelRequest | null;
  onAutoWalkComplete?: (result: { targetId: string; status: 'arrived' | 'unreachable' }) => void;
  onManualInterrupt?: () => void;
  onNearestPoiChange: (poiId: KenyaPoiId | null) => void;
  onActivatePoi?: (poiId: KenyaPoiId) => void;
  onPlayerPositionChange?: (pos: { x: number; z: number }) => void;
  onWebGLFailure: () => void;
}

const _colorA = new THREE.Color();
const _vecA = new THREE.Vector3();

const DAY_SKY_TOP = new THREE.Color('#2B90D9');
const DAY_SKY_BOTTOM = new THREE.Color('#CDECFB');
const NIGHT_SKY_TOP = new THREE.Color('#090E26');
const NIGHT_SKY_BOTTOM = new THREE.Color('#291D52');

const DAY_FOG = new THREE.Color('#BFE6F7');
const NIGHT_FOG = new THREE.Color('#17193D');

const DAY_HEMI_SKY = new THREE.Color('#E7F8FF');
const NIGHT_HEMI_SKY = new THREE.Color('#5A79C8');
const DAY_HEMI_GROUND = new THREE.Color('#B59A5A');
const NIGHT_HEMI_GROUND = new THREE.Color('#221E36');

const DAY_KEY_COLOR = new THREE.Color('#FFF3D6');
const NIGHT_KEY_COLOR = new THREE.Color('#A7C6FF');
const DAY_KEY_POS = new THREE.Vector3(18, 25, 16);
const NIGHT_KEY_POS = new THREE.Vector3(-14, 20, 14);

const DAY_CLOUD_COLOR = new THREE.Color('#FFFFFF');
const NIGHT_CLOUD_COLOR = new THREE.Color('#47578C');

const WALK_SPEED = 4.6;

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
    grad.addColorStop(0, 'rgba(20, 24, 42, 0.42)');
    grad.addColorStop(0.55, 'rgba(20, 24, 42, 0.18)');
    grad.addColorStop(1, 'rgba(20, 24, 42, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createSavannaGroundTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#B8B85B';
    ctx.fillRect(0, 0, 512, 512);

    const patches = ['#AEAF52', '#C6BD66', '#9CA94D', '#D0B96A', '#91A349'];
    for (let i = 0; i < 420; i++) {
      const px = (i * 73) % 512;
      const py = (i * 137) % 512;
      const r = 8 + (i % 5) * 6;
      ctx.fillStyle = patches[i % patches.length];
      ctx.globalAlpha = 0.28;
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(16, 16);
  tex.anisotropy = Math.min(8, maxAnisotropy);
  tex.needsUpdate = true;
  return tex;
}

function createBoardPosterTexture(title: string, subtitle: string, accent: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#F7EEDB';
    ctx.fillRect(0, 0, 512, 256);
    ctx.fillStyle = accent;
    ctx.fillRect(0, 0, 512, 56);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText(title, 24, 38);
    ctx.fillStyle = '#334155';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText(subtitle, 24, 102);

    // Simple iconic reserve trail diagram
    ctx.strokeStyle = '#C99658';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(60, 210);
    ctx.quadraticCurveTo(256, 130, 448, 196);
    ctx.stroke();

    ctx.fillStyle = '#4E9A54';
    [95, 240, 395].forEach((cx, idx) => {
      ctx.beginPath();
      ctx.arc(cx, idx === 1 ? 148 : 178, 13, 0, Math.PI * 2);
      ctx.fill();
    });
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

function createCloudCluster(material: THREE.Material): THREE.Group {
  const cloud = new THREE.Group();
  const puffs: [number, number, number, number][] = [
    [0, 0, 0, 1.4],
    [-1.15, -0.15, 0.15, 0.96],
    [1.18, -0.12, -0.12, 1.0],
    [0.24, 0.48, 0.08, 0.82],
  ];
  const geo = new THREE.SphereGeometry(1, 12, 9);
  puffs.forEach(([px, py, pz, s]) => {
    const m = new THREE.Mesh(geo, material);
    m.position.set(px, py, pz);
    m.scale.set(s * 1.35, s * 0.78, s * 0.94);
    cloud.add(m);
  });
  return cloud;
}

export default function KenyaExplorationScene({
  avatar,
  appearance,
  reducedMotion,
  cameraSensitivity,
  paused,
  visitedPoiIds,
  guidedPoiId = null,
  practicedIds = [],
  ambassadorStageActive = false,
  activeDialogueOpen,
  activeTouristNpcId = null,
  interactGestureSeq,
  celebrationSeq = 0,
  joystickRef,
  autoWalkRequest = null,
  quickTravelRequest = null,
  onAutoWalkComplete,
  onManualInterrupt,
  onNearestPoiChange,
  onActivatePoi,
  onPlayerPositionChange,
  onWebGLFailure,
}: KenyaSceneProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const appearanceRef = useRef(appearance);
  appearanceRef.current = appearance;
  const reducedMotionRef = useRef(reducedMotion);
  reducedMotionRef.current = reducedMotion;
  const sensitivityRef = useRef(cameraSensitivity);
  sensitivityRef.current = cameraSensitivity;
  const pausedRef = useRef(paused);
  pausedRef.current = paused;
  const visitedRef = useRef<Set<KenyaPoiId>>(new Set(visitedPoiIds));
  visitedRef.current = new Set(visitedPoiIds);
  const guidedPoiRef = useRef<KenyaPoiId | null>(guidedPoiId);
  guidedPoiRef.current = guidedPoiId;
  const practicedIdsRef = useRef<KenyaLandmarkId[]>(practicedIds);
  practicedIdsRef.current = practicedIds;
  const stageActiveRef = useRef(ambassadorStageActive);
  stageActiveRef.current = ambassadorStageActive;
  const dialogueOpenRef = useRef(activeDialogueOpen);
  dialogueOpenRef.current = activeDialogueOpen;
  const activeTouristRef = useRef<TouristNpcId | null>(activeTouristNpcId);
  activeTouristRef.current = activeTouristNpcId;

  const autoWalkRef = useRef(autoWalkRequest);
  autoWalkRef.current = autoWalkRequest;
  const quickTravelRef = useRef(quickTravelRequest);
  quickTravelRef.current = quickTravelRequest;
  const onAutoWalkCompleteRef = useRef(onAutoWalkComplete);
  onAutoWalkCompleteRef.current = onAutoWalkComplete;
  const onManualInterruptRef = useRef(onManualInterrupt);
  onManualInterruptRef.current = onManualInterrupt;

  const onNearestPoiRef = useRef(onNearestPoiChange);
  onNearestPoiRef.current = onNearestPoiChange;
  const onActivatePoiRef = useRef(onActivatePoi);
  onActivatePoiRef.current = onActivatePoi;
  const onPositionRef = useRef(onPlayerPositionChange);
  onPositionRef.current = onPlayerPositionChange;
  const onFailureRef = useRef(onWebGLFailure);
  onFailureRef.current = onWebGLFailure;

  const playerRigRef = useRef<ReturnType<typeof createProceduralAvatarRig> | null>(null);
  const prevAvatarStructRef = useRef<string>('');
  const interactTimerRef = useRef(0);
  const celebrateTimerRef = useRef(0);

  useEffect(() => {
    if (interactGestureSeq > 0) {
      interactTimerRef.current = 1.25;
    }
  }, [interactGestureSeq]);

  useEffect(() => {
    if (celebrationSeq > 0) {
      celebrateTimerRef.current = 2.4;
    }
  }, [celebrationSeq]);

  // Keep player's saved Phase 1A customized avatar synced dynamically
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
      0.0082,
    );

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTarget = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;
    scene.environmentIntensity = appearanceRef.current === 'night' ? 0.34 : 0.65;

    const camera = new THREE.PerspectiveCamera(48, width / height, 0.25, 190);
    const disposables: { dispose: () => void }[] = [];

    // Sky gradient dome
    const skyUniforms = {
      uTop: { value: (appearanceRef.current === 'night' ? NIGHT_SKY_TOP : DAY_SKY_TOP).clone() },
      uBottom: { value: (appearanceRef.current === 'night' ? NIGHT_SKY_BOTTOM : DAY_SKY_BOTTOM).clone() },
    };
    const skyMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: skyUniforms,
      vertexShader: `
        varying vec3 vWorldPos;
        void main() {
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vWorldPos = wp.xyz;
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,
      fragmentShader: `
        uniform vec3 uTop;
        uniform vec3 uBottom;
        varying vec3 vWorldPos;
        void main() {
          float h = clamp((normalize(vWorldPos).y + 0.06) / 0.88, 0.0, 1.0);
          gl_FragColor = vec4(mix(uBottom, uTop, smoothstep(0.0, 1.0, h)), 1.0);
        }
      `,
    });
    const skyDome = new THREE.Mesh(new THREE.SphereGeometry(125, 24, 16), skyMat);
    scene.add(skyDome);
    disposables.push(skyMat, skyDome.geometry);

    // Night Stars & Moon
    const starCount = 280;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const theta = ((i * 137.5) % 360) * (Math.PI / 180);
      const phi = Math.acos(0.14 + ((i * 29) % 100) / 118);
      const r = 98;
      starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = r * Math.cos(phi);
      starPositions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: '#FFF4D6',
      size: 0.54,
      transparent: true,
      opacity: appearanceRef.current === 'night' ? 0.88 : 0,
      depthWrite: false,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);
    disposables.push(starGeo, starMat);

    const moonMat = new THREE.MeshBasicMaterial({
      color: '#FFF3CC',
      transparent: true,
      opacity: appearanceRef.current === 'night' ? 0.96 : 0,
    });
    const moon = new THREE.Mesh(new THREE.SphereGeometry(3.1, 18, 14), moonMat);
    moon.position.set(-34, 38, -64);
    scene.add(moon);
    disposables.push(moon.geometry, moonMat);

    // Sun Disc in Day Sky
    const sunMat = new THREE.MeshBasicMaterial({
      color: '#FFF4B8',
      transparent: true,
      opacity: appearanceRef.current === 'night' ? 0 : 0.92,
    });
    const sunDisc = new THREE.Mesh(new THREE.SphereGeometry(3.5, 18, 14), sunMat);
    sunDisc.position.set(38, 42, -62);
    scene.add(sunDisc);
    disposables.push(sunDisc.geometry, sunMat);

    // Soft Drifting Clouds
    const cloudMat = new THREE.MeshStandardMaterial({
      color: appearanceRef.current === 'night' ? NIGHT_CLOUD_COLOR : DAY_CLOUD_COLOR,
      roughness: 0.95,
      metalness: 0,
      transparent: true,
      opacity: appearanceRef.current === 'night' ? 0.36 : 0.92,
    });
    disposables.push(cloudMat);
    const clouds: { group: THREE.Group; baseX: number; speed: number; range: number }[] = [];
    for (let i = 0; i < 7; i++) {
      const c = createCloudCluster(cloudMat);
      const bx = -42 + i * 14;
      c.position.set(bx, 20 + (i % 3) * 3, -30 - (i % 2) * 18);
      c.scale.setScalar(1.35 + (i % 3) * 0.4);
      scene.add(c);
      clouds.push({ group: c, baseX: bx, speed: 0.32 + (i % 3) * 0.14, range: 52 });
    }

    // Scene Lighting (Natural Bright Savanna Day / Moonlit Lantern Night)
    const hemiLight = new THREE.HemisphereLight(
      appearanceRef.current === 'night' ? NIGHT_HEMI_SKY : DAY_HEMI_SKY,
      appearanceRef.current === 'night' ? NIGHT_HEMI_GROUND : DAY_HEMI_GROUND,
      appearanceRef.current === 'night' ? 0.74 : 1.12,
    );
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(
      appearanceRef.current === 'night' ? NIGHT_KEY_COLOR : DAY_KEY_COLOR,
      appearanceRef.current === 'night' ? 1.15 : 2.22,
    );
    keyLight.position.copy(appearanceRef.current === 'night' ? NIGHT_KEY_POS : DAY_KEY_POS);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      keyLight.shadow.camera.near = 2;
      keyLight.shadow.camera.far = 68;
      keyLight.shadow.camera.left = -24;
      keyLight.shadow.camera.right = 24;
      keyLight.shadow.camera.top = 24;
      keyLight.shadow.camera.bottom = -24;
      keyLight.shadow.bias = -0.0007;
    }
    scene.add(keyLight);

    // Ranger Camp + Lookout Warm Lantern PointLights
    const lanternLights: THREE.PointLight[] = [];
    const lanternPositions: [number, number, number][] = [
      [-2.8, 2.25, 8.8],
      [2.9, 2.25, 8.8],
      [-4.9, 2.1, 10.2],
      [8.2, 3.6, -11.4],
    ];
    lanternPositions.forEach(([lx, ly, lz]) => {
      const pLight = new THREE.PointLight('#FFB357', appearanceRef.current === 'night' ? 5.2 : 0.2, 13, 1.55);
      pLight.position.set(lx, ly, lz);
      scene.add(pLight);
      lanternLights.push(pLight);
    });

    // Shared World Materials (Maasai Mara Vibrant Palette)
    const groundTex = createSavannaGroundTexture(maxAnisotropy);
    const campBoardTex = createBoardPosterTexture('MAASAI MARA', 'Wildlife & Trails', '#D97B48');
    const lookoutBoardTex = createBoardPosterTexture('CONSERVATION', 'Protect Wild Corridors', '#3E8E5A');
    disposables.push(groundTex, campBoardTex, lookoutBoardTex);

    const savannaMat = new THREE.MeshStandardMaterial({ map: groundTex, roughness: 0.92, metalness: 0 });
    const trailMat = new THREE.MeshStandardMaterial({ color: '#D7AE74', roughness: 0.88, metalness: 0.01 });
    const hillMat = new THREE.MeshStandardMaterial({ color: '#8EA25A', roughness: 0.94, metalness: 0 });
    const distantRidgeMat = new THREE.MeshStandardMaterial({ color: '#7B9367', roughness: 0.96, metalness: 0 });
    const timberMat = new THREE.MeshStandardMaterial({ color: '#784E32', roughness: 0.8, metalness: 0.03 });
    const deckMat = new THREE.MeshStandardMaterial({ color: '#9D6D47', roughness: 0.78, metalness: 0.02 });
    const canvasMat = new THREE.MeshStandardMaterial({ color: '#E3CB9F', roughness: 0.86, metalness: 0.01 });
    const canvasTrimMat = new THREE.MeshStandardMaterial({ color: '#4B6F46', roughness: 0.82, metalness: 0.02 });
    const jeepBodyMat = new THREE.MeshStandardMaterial({ color: '#D8B372', roughness: 0.45, metalness: 0.14 });
    const jeepStripeMat = new THREE.MeshStandardMaterial({ color: '#3E6A44', roughness: 0.5, metalness: 0.1 });
    const tireMat = new THREE.MeshStandardMaterial({ color: '#24262D', roughness: 0.85, metalness: 0.04 });
    const rimMat = new THREE.MeshStandardMaterial({ color: '#CBD5E1', roughness: 0.28, metalness: 0.7 });
    const glassMat = new THREE.MeshStandardMaterial({
      color: '#9ED6EA',
      roughness: 0.12,
      metalness: 0.25,
      transparent: true,
      opacity: 0.72,
    });
    const brassMat = new THREE.MeshStandardMaterial({ color: '#F2C66D', roughness: 0.26, metalness: 0.82 });
    const rockMat = new THREE.MeshStandardMaterial({ color: '#8F8275', roughness: 0.88, metalness: 0.02 });
    const barkMat = new THREE.MeshStandardMaterial({ color: '#6E4C36', roughness: 0.9, metalness: 0 });
    const acaciaLeafMat = new THREE.MeshStandardMaterial({ color: '#5A8D3C', roughness: 0.76, metalness: 0.02 });
    const acaciaLeafLightMat = new THREE.MeshStandardMaterial({ color: '#73A647', roughness: 0.74, metalness: 0.02 });
    const reedMat = new THREE.MeshStandardMaterial({ color: '#6F8E3E', roughness: 0.82, metalness: 0.01 });
    const shoreSandMat = new THREE.MeshStandardMaterial({ color: '#C9AC77', roughness: 0.9, metalness: 0.01 });
    const waterMat = new THREE.MeshStandardMaterial({
      color: '#2EAFC0',
      roughness: 0.14,
      metalness: 0.18,
      emissive: '#115866',
      emissiveIntensity: 0.22,
    });
    const lanternGlowMat = new THREE.MeshStandardMaterial({
      color: '#FFE6A8',
      emissive: '#FF9E3D',
      emissiveIntensity: appearanceRef.current === 'night' ? 1.85 : 0.22,
      roughness: 0.3,
    });
    const campBoardMat = new THREE.MeshStandardMaterial({ map: campBoardTex, roughness: 0.68 });
    const lookoutBoardMat = new THREE.MeshStandardMaterial({ map: lookoutBoardTex, roughness: 0.68 });

    disposables.push(
      savannaMat,
      trailMat,
      hillMat,
      distantRidgeMat,
      timberMat,
      deckMat,
      canvasMat,
      canvasTrimMat,
      jeepBodyMat,
      jeepStripeMat,
      tireMat,
      rimMat,
      glassMat,
      brassMat,
      rockMat,
      barkMat,
      acaciaLeafMat,
      acaciaLeafLightMat,
      reedMat,
      shoreSandMat,
      waterMat,
      lanternGlowMat,
      campBoardMat,
      lookoutBoardMat,
    );

    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    const addWorldMesh = (
      geo: THREE.BufferGeometry,
      mat: THREE.Material,
      pos: [number, number, number],
      rot: [number, number, number] = [0, 0, 0],
      scale: [number, number, number] = [1, 1, 1],
      receive = true,
      cast = !isSoftwareGl,
    ) => {
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(pos[0], pos[1], pos[2]);
      mesh.rotation.set(rot[0], rot[1], rot[2]);
      mesh.scale.set(scale[0], scale[1], scale[2]);
      mesh.receiveShadow = receive;
      mesh.castShadow = cast;
      worldGroup.add(mesh);
      return mesh;
    };

    // 1. Expansive Open Savanna Ground extending continuously to the fog horizon
    addWorldMesh(
      new THREE.CylinderGeometry(115, 115, 0.4, 48),
      savannaMat,
      [0, -0.2, 0],
      [0, 0, 0],
      [1, 1, 1],
      true,
      false,
    );

    // Distant Rolling Savanna Hills & Escarpments (open landscape framing, never boxy walls)
    const hillPlacements: [number, number, number, number, number][] = [
      [-38, -42, 16, 6.5, 11],
      [-8, -52, 22, 8.2, 13],
      [28, -46, 18, 7.0, 12],
      [48, -16, 15, 5.8, 16],
      [-46, -12, 15, 6.2, 15],
      [-40, 26, 16, 5.2, 12],
      [42, 24, 15, 5.4, 12],
      [4, 46, 20, 4.8, 11],
    ];
    hillPlacements.forEach(([hx, hz, rx, ry, rz], idx) => {
      addWorldMesh(
        new THREE.SphereGeometry(1, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.5),
        idx % 2 === 0 ? hillMat : distantRidgeMat,
        [hx, -0.25, hz],
        [0, idx * 0.5, 0],
        [rx, ry, rz],
        true,
        false,
      );
    });

    // Connected Packed-Earth Safari Dirt Trails leading cleanly from Camp to all 5 POIs
    const addTrailSegment = (x1: number, z1: number, x2: number, z2: number, width: number) => {
      const dx = x2 - x1;
      const dz = z2 - z1;
      const len = Math.hypot(dx, dz);
      const angle = Math.atan2(dx, dz);
      addWorldMesh(
        new THREE.BoxGeometry(width, 0.03, len),
        trailMat,
        [(x1 + x2) / 2, 0.008, (z1 + z2) / 2],
        [0, angle, 0],
        [1, 1, 1],
        true,
        false,
      );
    };
    addTrailSegment(0, 14.5, 0, 2.2, 2.8); // Spawn -> Camp -> Hub
    addTrailSegment(0, 2.5, -9.8, -1.4, 2.2); // Hub -> Elephant Grassland
    addTrailSegment(0, 2.5, 9.6, -1.2, 2.2); // Hub -> Giraffe Acacia Grove
    addTrailSegment(0, 2.5, -3.0, -8.0, 2.2); // Hub -> Zebra Watering Hole
    addTrailSegment(0, 2.5, 6.0, -9.0, 2.2); // Hub -> Conservation Lookout
    addTrailSegment(-3.0, -8.0, 6.0, -9.0, 1.8); // Northern scenic ridge link
    // Ranger Camp circular clearing pad
    addWorldMesh(
      new THREE.CylinderGeometry(5.6, 5.8, 0.025, 28),
      trailMat,
      [0, 0.006, 9.6],
      [0, 0, 0],
      [1, 1, 1],
      true,
      false,
    );

    // 2. Safari Ranger Camp (Tent, Jeep, Information Board, Crates & Lanterns)
    // Safari Tent centered at (-4.9, 9.9) inside box (-6.9..-2.9, 8.1..11.7)
    const tentX = -4.9;
    const tentZ = 9.9;
    addWorldMesh(new THREE.BoxGeometry(3.8, 0.22, 3.4), deckMat, [tentX, 0.11, tentZ]);
    addWorldMesh(new THREE.BoxGeometry(3.4, 1.45, 3.0), canvasMat, [tentX, 0.92, tentZ]);
    // Pitched roof ridge + dark emerald trim
    addWorldMesh(
      new THREE.CylinderGeometry(0.1, 2.35, 1.35, 4),
      canvasMat,
      [tentX, 2.22, tentZ],
      [0, Math.PI / 4, 0],
      [1.06, 1, 0.96],
    );
    addWorldMesh(new THREE.BoxGeometry(3.52, 0.18, 3.12), canvasTrimMat, [tentX, 1.62, tentZ]);
    // Open Tent Doorway Frame facing East toward Camp center
    addWorldMesh(new THREE.BoxGeometry(0.14, 1.32, 1.35), timberMat, [tentX + 1.68, 0.88, tentZ]);
    addWorldMesh(new THREE.CylinderGeometry(0.14, 0.14, 1.5, 10), canvasTrimMat, [tentX + 1.72, 1.58, tentZ], [Math.PI / 2, 0, 0]);

    // Rugged 4x4 Safari Jeep centered at (5.2, 10.6) inside box (3.1..7.3, 9.1..12.1)
    const jeepX = 5.2;
    const jeepZ = 10.6;
    const jeepGroup = new THREE.Group();
    jeepGroup.position.set(jeepX, 0, jeepZ);
    jeepGroup.rotation.y = Math.PI * 0.84;
    worldGroup.add(jeepGroup);

    const addJeepPart = (
      geo: THREE.BufferGeometry,
      mat: THREE.Material,
      pos: [number, number, number],
      rot: [number, number, number] = [0, 0, 0],
    ) => {
      const m = new THREE.Mesh(geo, mat);
      m.position.set(pos[0], pos[1], pos[2]);
      m.rotation.set(rot[0], rot[1], rot[2]);
      m.castShadow = !isSoftwareGl;
      m.receiveShadow = true;
      jeepGroup.add(m);
      return m;
    };

    // Jeep Lower Chassis + Conservation Stripe + Hood
    addJeepPart(new THREE.BoxGeometry(1.78, 0.72, 3.35), jeepBodyMat, [0, 0.74, 0]);
    addJeepPart(new THREE.BoxGeometry(1.82, 0.18, 3.38), jeepStripeMat, [0, 0.72, 0]);
    addJeepPart(new THREE.BoxGeometry(1.68, 0.44, 1.05), jeepBodyMat, [0, 1.12, 1.08]);
    // Windshield + Open-air Safari Rollbars & Canvas Canopy
    addJeepPart(new THREE.BoxGeometry(1.56, 0.68, 0.08), glassMat, [0, 1.48, 0.56], [-0.22, 0, 0]);
    [
      [-0.78, 0.48],
      [0.78, 0.48],
      [-0.78, -1.45],
      [0.78, -1.45],
    ].forEach(([px, pz]) => {
      addJeepPart(new THREE.CylinderGeometry(0.05, 0.05, 1.12, 8), timberMat, [px, 1.62, pz]);
    });
    addJeepPart(new THREE.BoxGeometry(1.74, 0.12, 2.2), canvasMat, [0, 2.18, -0.48]);
    // 4 Knobby Wheels + Spare Tire on tailgate
    [
      [-0.88, 1.08],
      [0.88, 1.08],
      [-0.88, -1.08],
      [0.88, -1.08],
    ].forEach(([wx, wz]) => {
      addJeepPart(new THREE.CylinderGeometry(0.42, 0.42, 0.3, 14), tireMat, [wx, 0.42, wz], [0, 0, Math.PI / 2]);
      addJeepPart(new THREE.CylinderGeometry(0.22, 0.22, 0.32, 10), rimMat, [wx, 0.42, wz], [0, 0, Math.PI / 2]);
    });
    addJeepPart(new THREE.CylinderGeometry(0.36, 0.36, 0.22, 14), tireMat, [0, 0.96, -1.78], [Math.PI / 2, 0, 0]);
    addJeepPart(new THREE.SphereGeometry(0.11, 8, 8), lanternGlowMat, [-0.55, 0.82, 1.68]);
    addJeepPart(new THREE.SphereGeometry(0.11, 8, 8), lanternGlowMat, [0.55, 0.82, 1.68]);

    // Wooden Camp Information Board (-1.55, 8.05) inside box (-2.4..-0.7, 7.6..8.5)
    addWorldMesh(new THREE.CylinderGeometry(0.08, 0.09, 2.1, 8), timberMat, [-2.2, 1.05, 8.05]);
    addWorldMesh(new THREE.CylinderGeometry(0.08, 0.09, 2.1, 8), timberMat, [-0.9, 1.05, 8.05]);
    addWorldMesh(new THREE.BoxGeometry(1.5, 0.9, 0.1), deckMat, [-1.55, 1.48, 8.05]);
    addWorldMesh(new THREE.BoxGeometry(1.36, 0.74, 0.12), campBoardMat, [-1.55, 1.48, 8.06]);
    addWorldMesh(new THREE.BoxGeometry(1.68, 0.14, 0.45), timberMat, [-1.55, 2.04, 8.05]);

    // Supply Crate (-2.4, 12.2)
    addWorldMesh(new THREE.BoxGeometry(0.9, 0.68, 0.9), deckMat, [-2.4, 0.34, 12.2], [0, 0.3, 0]);

    // Warm Camp Lantern Posts
    lanternPositions.forEach(([lx, ly, lz]) => {
      addWorldMesh(new THREE.CylinderGeometry(0.07, 0.09, ly - 0.12, 8), timberMat, [lx, (ly - 0.12) / 2, lz]);
      addWorldMesh(new THREE.SphereGeometry(0.18, 10, 8), lanternGlowMat, [lx, ly, lz], [0, 0, 0], [1, 1.25, 1], false, false);
      addWorldMesh(new THREE.ConeGeometry(0.24, 0.18, 6), brassMat, [lx, ly + 0.22, lz]);
    });

    // 3. Iconic Flat-Top East African Acacia Trees
    const acaciaCrowns: THREE.Group[] = [];
    const buildAcaciaTree = (tx: number, tz: number, hScale: number) => {
      addWorldMesh(
        new THREE.CylinderGeometry(0.22 * hScale, 0.34 * hScale, 2.9 * hScale, 10),
        barkMat,
        [tx, 1.45 * hScale, tz],
      );
      // Forking upper boughs
      addWorldMesh(
        new THREE.CylinderGeometry(0.11 * hScale, 0.16 * hScale, 1.6 * hScale, 8),
        barkMat,
        [tx - 0.55 * hScale, 3.1 * hScale, tz + 0.18 * hScale],
        [0.12, 0, 0.58],
      );
      addWorldMesh(
        new THREE.CylinderGeometry(0.11 * hScale, 0.16 * hScale, 1.55 * hScale, 8),
        barkMat,
        [tx + 0.62 * hScale, 3.15 * hScale, tz - 0.22 * hScale],
        [-0.14, 0, -0.62],
      );

      const crown = new THREE.Group();
      crown.position.set(tx, 3.65 * hScale, tz);
      const canopyParts: [number, number, number, number, number, THREE.Material][] = [
        [0, 0.15, 0, 2.75 * hScale, 0.52 * hScale, acaciaLeafMat],
        [-1.15 * hScale, -0.1, 0.35 * hScale, 1.8 * hScale, 0.42 * hScale, acaciaLeafLightMat],
        [1.2 * hScale, 0.05, -0.3 * hScale, 1.95 * hScale, 0.44 * hScale, acaciaLeafMat],
      ];
      canopyParts.forEach(([cx, cy, cz, rad, ht, mat]) => {
        const disc = new THREE.Mesh(new THREE.CylinderGeometry(rad * 0.92, rad, ht, 14), mat);
        disc.position.set(cx, cy, cz);
        disc.castShadow = !isSoftwareGl;
        disc.receiveShadow = true;
        crown.add(disc);
      });
      worldGroup.add(crown);
      acaciaCrowns.push(crown);
    };

    buildAcaciaTree(13.4, -2.6, 1.15);
    buildAcaciaTree(15.8, 1.8, 1.0);
    buildAcaciaTree(12.0, -6.2, 0.95);
    buildAcaciaTree(-8.2, 6.2, 0.92);
    buildAcaciaTree(1.8, -14.8, 1.05);
    // Distant decorative background acacia silhouettes outside bounds
    buildAcaciaTree(-24.5, -14.0, 1.2);
    buildAcaciaTree(24.0, -10.0, 1.18);
    buildAcaciaTree(-22.0, 14.0, 1.05);
    buildAcaciaTree(23.5, 13.5, 1.12);

    // 4. Zebra Watering Hole (-5.2, -12.0) radius 3.4
    addWorldMesh(
      new THREE.CylinderGeometry(3.65, 3.9, 0.05, 32),
      shoreSandMat,
      [-5.2, 0.012, -12.0],
      [0, 0, 0],
      [1, 1, 1],
      true,
      false,
    );
    addWorldMesh(
      new THREE.CylinderGeometry(3.18, 3.25, 0.06, 32),
      waterMat,
      [-5.2, 0.025, -12.0],
      [0, 0, 0],
      [1, 1, 1],
      true,
      false,
    );
    // Shoreline stones & reeds
    for (let i = 0; i < 12; i++) {
      const ang = (i / 12) * Math.PI * 2;
      const sx = -5.2 + Math.cos(ang) * 3.35;
      const sz = -12.0 + Math.sin(ang) * 3.35;
      if (i % 2 === 0) {
        addWorldMesh(
          new THREE.DodecahedronGeometry(0.28 + (i % 3) * 0.08, 0),
          rockMat,
          [sx, 0.14, sz],
          [0, ang, 0],
          [1.2, 0.65, 1],
        );
      } else {
        for (let r = 0; r < 3; r++) {
          addWorldMesh(
            new THREE.CylinderGeometry(0.02, 0.035, 0.85 + r * 0.14, 6),
            reedMat,
            [sx + r * 0.12 - 0.12, 0.42, sz + (r % 2) * 0.12],
            [0.08 * (r - 1), 0, -0.06],
          );
        }
      }
    }

    // 5. Elevated Wooden Conservation Lookout ((10.0, -13.1), box: 7.5..12.5 x -15.4..-10.8)
    const lookX = 10.0;
    const lookZ = -13.1;
    // 4 Corner timber stilts + deck
    [
      [lookX - 1.9, lookZ - 1.9],
      [lookX + 1.9, lookZ - 1.9],
      [lookX - 1.9, lookZ + 1.9],
      [lookX + 1.9, lookZ + 1.9],
    ].forEach(([px, pz]) => {
      addWorldMesh(new THREE.CylinderGeometry(0.14, 0.16, 3.85, 8), timberMat, [px, 1.92, pz]);
    });
    // Platform deck at y=1.85
    addWorldMesh(new THREE.BoxGeometry(4.4, 0.24, 4.2), deckMat, [lookX, 1.85, lookZ]);
    // Railings
    addWorldMesh(new THREE.BoxGeometry(4.3, 0.12, 0.12), timberMat, [lookX, 2.68, lookZ - 1.95]);
    addWorldMesh(new THREE.BoxGeometry(0.12, 0.12, 4.1), timberMat, [lookX - 1.95, 2.68, lookZ]);
    addWorldMesh(new THREE.BoxGeometry(0.12, 0.12, 4.1), timberMat, [lookX + 1.95, 2.68, lookZ]);
    addWorldMesh(new THREE.BoxGeometry(2.8, 0.12, 0.12), timberMat, [lookX + 0.75, 2.68, lookZ + 1.95]);
    // Slanted wooden access ramp facing SW toward trail
    addWorldMesh(
      new THREE.BoxGeometry(1.35, 0.16, 2.5),
      deckMat,
      [lookX - 1.3, 0.92, lookZ + 2.55],
      [0.64, 0, 0],
    );
    // Shaded Canopy Roof + Spotting Scope
    addWorldMesh(
      new THREE.ConeGeometry(3.35, 1.05, 4),
      canvasMat,
      [lookX, 4.28, lookZ],
      [0, Math.PI / 4, 0],
    );
    addWorldMesh(new THREE.CylinderGeometry(0.05, 0.06, 0.85, 8), timberMat, [lookX + 0.5, 2.38, lookZ + 1.5]);
    addWorldMesh(new THREE.CylinderGeometry(0.08, 0.1, 0.55, 10), brassMat, [lookX + 0.5, 2.86, lookZ + 1.5], [Math.PI / 2 - 0.1, 0.3, 0]);

    // Conservation Info Sign beside Lookout (6.8, -10.45) inside box (6.2..7.4, -10.9..-10.0)
    addWorldMesh(new THREE.CylinderGeometry(0.07, 0.08, 1.9, 8), timberMat, [6.4, 0.95, -10.45]);
    addWorldMesh(new THREE.CylinderGeometry(0.07, 0.08, 1.9, 8), timberMat, [7.2, 0.95, -10.45]);
    addWorldMesh(new THREE.BoxGeometry(1.18, 0.78, 0.1), deckMat, [6.8, 1.42, -10.45]);
    addWorldMesh(new THREE.BoxGeometry(1.06, 0.64, 0.12), lookoutBoardMat, [6.8, 1.42, -10.44]);

    // 5B. Open-Air Conservation Presentation Stage at Conservation Lookout (walkable flush deck at (5.8, -12.6))
    const stageBannerTex = createBoardPosterTexture(
      'SAVE THE SAVANNA',
      'Wildlife Ambassador Stage',
      '#2E8B57',
    );
    const stageBannerMat = new THREE.MeshStandardMaterial({
      map: stageBannerTex,
      roughness: 0.6,
    });
    const stageTrimMat = new THREE.MeshStandardMaterial({
      color: '#F2C66D',
      emissive: '#F2C66D',
      emissiveIntensity: 0.18,
      roughness: 0.35,
      metalness: 0.45,
    });
    disposables.push(stageBannerTex, stageBannerMat, stageTrimMat);

    const stageSpotLight = new THREE.PointLight('#FFD884', 0.2, 9, 1.6);
    stageSpotLight.position.set(5.8, 2.35, -12.3);
    scene.add(stageSpotLight);

    // Flush walkable timber stage platform (height 0.05 — player walks smoothly onto it)
    addWorldMesh(
      new THREE.BoxGeometry(2.35, 0.05, 1.75),
      deckMat,
      [5.8, 0.025, -12.6],
      [0, 0, 0],
      [1, 1, 1],
      true,
      false,
    );
    // Warm golden stage border strip & corner lantern studs along rear edge
    addWorldMesh(
      new THREE.BoxGeometry(2.42, 0.025, 1.82),
      stageTrimMat,
      [5.8, 0.014, -12.6],
      [0, 0, 0],
      [1, 1, 1],
      true,
      false,
    );
    // Rear stage timber archway & Save the Savanna backdrop banner
    addWorldMesh(new THREE.CylinderGeometry(0.06, 0.075, 2.15, 8), timberMat, [4.75, 1.07, -13.45]);
    addWorldMesh(new THREE.CylinderGeometry(0.06, 0.075, 2.15, 8), timberMat, [6.85, 1.07, -13.45]);
    addWorldMesh(new THREE.BoxGeometry(2.25, 0.12, 0.14), timberMat, [5.8, 2.12, -13.45]);
    addWorldMesh(new THREE.BoxGeometry(1.92, 0.92, 0.08), deckMat, [5.8, 1.62, -13.45]);
    addWorldMesh(new THREE.BoxGeometry(1.8, 0.8, 0.1), stageBannerMat, [5.8, 1.62, -13.43]);
    addWorldMesh(new THREE.SphereGeometry(0.11, 8, 8), lanternGlowMat, [4.75, 2.24, -13.45], [0, 0, 0], [1, 1, 1], false, false);
    addWorldMesh(new THREE.SphereGeometry(0.11, 8, 8), lanternGlowMat, [6.85, 2.24, -13.45], [0, 0, 0], [1, 1, 1], false, false);

    // 6. Scenic Savanna Kopje Boulders framing playable bounds
    const kopjes: [number, number, number][] = [
      [-14.8, -11.8, 1.3],
      [-13.6, 9.8, 1.15],
      [13.5, 9.5, 1.2],
    ];
    kopjes.forEach(([kx, kz, kr], idx) => {
      addWorldMesh(
        new THREE.DodecahedronGeometry(kr, 0),
        rockMat,
        [kx, kr * 0.42, kz],
        [0.2, idx * 1.1, 0.15],
        [1.15, 0.78, 1.05],
      );
      addWorldMesh(
        new THREE.DodecahedronGeometry(kr * 0.58, 0),
        rockMat,
        [kx + 0.75, kr * 0.25, kz + 0.4],
        [0, idx * 0.7, 0.3],
      );
    });

    // Instanced Savanna Grass Tufts across plains
    const grassGeo = new THREE.ConeGeometry(0.11, 0.56, 5);
    grassGeo.translate(0, 0.28, 0);
    const grassMat = new THREE.MeshStandardMaterial({ color: '#FFFFFF', roughness: 0.85, metalness: 0 });
    disposables.push(grassGeo, grassMat);

    const grassSeeds: { x: number; z: number; s: number; rotY: number; phase: number; color: THREE.Color }[] = [];
    const grassPalette = [
      new THREE.Color('#95AA46'),
      new THREE.Color('#A8B64C'),
      new THREE.Color('#C4B358'),
      new THREE.Color('#7C9A42'),
    ];
    for (let i = 0; i < 84; i++) {
      const gx = (((i * 67) % 380) / 10) - 19;
      const gz = (((i * 113) % 350) / 10) - 17.5;
      // Keep grass clear of central camp pad & watering hole
      if (Math.hypot(gx, gz - 9.6) < 4.5 || Math.hypot(gx + 5.2, gz + 12.0) < 3.9) continue;
      grassSeeds.push({
        x: gx,
        z: gz,
        s: 0.75 + (i % 4) * 0.22,
        rotY: (i * 0.9) % (Math.PI * 2),
        phase: i * 0.45,
        color: grassPalette[i % grassPalette.length],
      });
    }
    const grassInst = new THREE.InstancedMesh(grassGeo, grassMat, grassSeeds.length);
    const grassDummy = new THREE.Object3D();
    grassSeeds.forEach((g, idx) => {
      grassDummy.position.set(g.x, 0, g.z);
      grassDummy.rotation.set(0, g.rotY, 0);
      grassDummy.scale.set(g.s, g.s, g.s);
      grassDummy.updateMatrix();
      grassInst.setMatrixAt(idx, grassDummy.matrix);
      grassInst.setColorAt(idx, g.color);
    });
    grassInst.instanceMatrix.needsUpdate = true;
    if (grassInst.instanceColor) grassInst.instanceColor.needsUpdate = true;
    grassInst.computeBoundingSphere();
    worldGroup.add(grassInst);

    // 7. Wildlife Animals (Elephants, Giraffes, Zebras, and Soaring Sky Birds)
    const elephants: AnimatedElephantRig[] = [
      createElephantRig(1.05, 0.2, !isSoftwareGl),
      createElephantRig(0.62, 1.7, !isSoftwareGl),
      createElephantRig(0.95, 3.1, !isSoftwareGl),
    ];
    elephants[0].root.position.set(-14.2, 0, -2.6);
    elephants[0].root.rotation.y = Math.PI * 0.42;
    elephants[1].root.position.set(-12.4, 0, -4.8);
    elephants[1].root.rotation.y = Math.PI * 0.28;
    elephants[2].root.position.set(-15.8, 0, 0.2);
    elephants[2].root.rotation.y = Math.PI * 0.58;
    elephants.forEach((e) => scene.add(e.root));

    const giraffes: AnimatedGiraffeRig[] = [
      createGiraffeRig(1.06, 0.4, -Math.PI * 0.35, !isSoftwareGl, maxAnisotropy),
      createGiraffeRig(0.94, 2.2, -Math.PI * 0.58, !isSoftwareGl, maxAnisotropy),
    ];
    giraffes[0].root.position.set(13.7, 0, 0.4);
    giraffes[1].root.position.set(11.4, 0, -3.9);
    giraffes.forEach((g) => scene.add(g.root));

    const zebras: AnimatedZebraRig[] = [
      createZebraRig(1.0, 0.5, Math.PI * 0.65, !isSoftwareGl, maxAnisotropy),
      createZebraRig(0.94, 2.3, -Math.PI * 0.72, !isSoftwareGl, maxAnisotropy),
    ];
    zebras[0].root.position.set(-8.3, 0, -10.2);
    zebras[1].root.position.set(-2.2, 0, -14.1);
    zebras.forEach((z) => scene.add(z.root));

    const birds: SoaringBirdRig[] = [
      createSoaringBird(-4, -8, 14, 12.5, 0.24, 0.0),
      createSoaringBird(-2, -9, 15.5, 13.4, 0.22, 1.4),
      createSoaringBird(6, -6, 13, 14.2, 0.26, 2.8),
      createSoaringBird(2, 0, 17, 15.0, 0.19, 4.2),
    ];
    birds.forEach((b) => scene.add(b.root));

    // 8. Interactive 3D POI Beacons (Amina + 5 Safari Landmarks)
    const clickableBeacons: THREE.Mesh[] = [];
    const hitGeo = new THREE.SphereGeometry(0.82, 10, 8);
    const hitMat = new THREE.MeshBasicMaterial({ visible: false });
    disposables.push(hitGeo, hitMat);

    const poiBeacons = new Map<
      KenyaPoiId,
      { ring: THREE.Mesh; ringMat: THREE.MeshBasicMaterial; gem: THREE.Mesh; gemMat: THREE.MeshStandardMaterial }
    >();
    KENYA_INTERACTIVE_TARGETS.forEach((poi) => {
      const ringGeo = new THREE.RingGeometry(0.62, 0.84, 28);
      const ringMat = new THREE.MeshBasicMaterial({
        color: poi.accentColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.82,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(poi.position.x, 0.036, poi.position.z);
      scene.add(ring);

      const gemGeo = new THREE.OctahedronGeometry(0.25, 0);
      const gemMat = new THREE.MeshStandardMaterial({
        color: poi.accentColor,
        emissive: poi.accentColor,
        emissiveIntensity: 0.55,
        roughness: 0.25,
        metalness: 0.4,
      });
      const gem = new THREE.Mesh(gemGeo, gemMat);
      const gemY = poi.kind === 'npc' ? 2.2 : 1.72;
      gem.position.set(poi.position.x, gemY, poi.position.z);
      scene.add(gem);

      const hitProxy = new THREE.Mesh(hitGeo, hitMat);
      hitProxy.position.set(poi.position.x, 1.25, poi.position.z);
      hitProxy.userData.poiId = poi.id;
      hitProxy.layers.set(1);
      scene.add(hitProxy);
      clickableBeacons.push(hitProxy);

      disposables.push(ringGeo, ringMat, gemGeo, gemMat);
      poiBeacons.set(poi.id, { ring, ringMat, gem, gemMat });
    });

    // 3D Celebration Sparkle Burst (triggered on 5/5 Discover the Wild completion)
    const burstGroup = new THREE.Group();
    burstGroup.visible = false;
    scene.add(burstGroup);
    const burstGeo = new THREE.OctahedronGeometry(0.11, 0);
    const burstMat = new THREE.MeshStandardMaterial({
      color: '#F2C66D',
      emissive: '#FFD166',
      emissiveIntensity: 0.9,
      roughness: 0.2,
      metalness: 0.65,
    });
    disposables.push(burstGeo, burstMat);
    const burstParticles: { mesh: THREE.Mesh; angle: number; speed: number }[] = [];
    for (let i = 0; i < 12; i++) {
      const m = new THREE.Mesh(burstGeo, burstMat);
      burstGroup.add(m);
      burstParticles.push({
        mesh: m,
        angle: (i / 12) * Math.PI * 2,
        speed: 0.9 + (i % 3) * 0.3,
      });
    }

    // 9. NPC Amina Odhiambo at Ranger Camp
    const aminaRig = createAminaNpcRig(!isSoftwareGl);
    aminaRig.root.position.set(KENYA_AMINA_POS.x, 0, KENYA_AMINA_POS.z);
    aminaRig.root.rotation.y = KENYA_AMINA_POS.idleYaw;
    scene.add(aminaRig.root);

    const contactTex = createContactShadowTexture();
    const contactMat = new THREE.MeshBasicMaterial({
      map: contactTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.72,
    });
    const shadowPlaneGeo = new THREE.PlaneGeometry(0.98, 0.98);
    disposables.push(contactTex, contactMat, shadowPlaneGeo);

    const aminaShadow = new THREE.Mesh(shadowPlaneGeo, contactMat);
    aminaShadow.rotation.x = -Math.PI / 2;
    aminaShadow.position.set(KENYA_AMINA_POS.x, 0.02, KENYA_AMINA_POS.z);
    scene.add(aminaShadow);

    // 9B. Safari Tourist NPCs (Emma - Curious Tourist, Daniel - Conservation Visitor)
    const emmaInitialStop = getActiveConversationForTourist('emma', practicedIdsRef.current).id;
    const emmaInitialView = KENYA_TOURIST_VIEWPOINTS[emmaInitialStop];
    const emmaRig = createEmmaTouristRig(!isSoftwareGl);
    emmaRig.root.position.set(emmaInitialView.x, 0, emmaInitialView.z);
    emmaRig.root.rotation.y = emmaInitialView.idleYaw;
    scene.add(emmaRig.root);

    const emmaShadow = new THREE.Mesh(shadowPlaneGeo, contactMat);
    emmaShadow.rotation.x = -Math.PI / 2;
    emmaShadow.position.set(emmaInitialView.x, 0.02, emmaInitialView.z);
    scene.add(emmaShadow);

    const emmaHit = new THREE.Mesh(hitGeo, hitMat);
    emmaHit.position.set(emmaInitialView.x, 1.15, emmaInitialView.z);
    emmaHit.userData.touristNpcId = 'emma';
    emmaHit.layers.set(1);
    scene.add(emmaHit);
    clickableBeacons.push(emmaHit);

    const danielInitialStop = getActiveConversationForTourist('daniel', practicedIdsRef.current).id;
    const danielInitialView = KENYA_TOURIST_VIEWPOINTS[danielInitialStop];
    const danielRig = createDanielTouristRig(!isSoftwareGl);
    danielRig.root.position.set(danielInitialView.x, 0, danielInitialView.z);
    danielRig.root.rotation.y = danielInitialView.idleYaw;
    scene.add(danielRig.root);

    const danielShadow = new THREE.Mesh(shadowPlaneGeo, contactMat);
    danielShadow.rotation.x = -Math.PI / 2;
    danielShadow.position.set(danielInitialView.x, 0.02, danielInitialView.z);
    scene.add(danielShadow);

    const danielHit = new THREE.Mesh(hitGeo, hitMat);
    danielHit.position.set(danielInitialView.x, 1.15, danielInitialView.z);
    danielHit.userData.touristNpcId = 'daniel';
    danielHit.layers.set(1);
    scene.add(danielHit);
    clickableBeacons.push(danielHit);

    // 10. Saved Player Avatar Rig from Phase 1A
    const playerRig = createProceduralAvatarRig(avatar, !isSoftwareGl);
    playerRigRef.current = playerRig;
    prevAvatarStructRef.current = `${avatar.modelId}:${avatar.hairStyle}:${avatar.outfitId}`;
    playerRig.root.position.set(KENYA_SPAWN.x, 0, KENYA_SPAWN.z);
    scene.add(playerRig.root);

    const playerShadow = new THREE.Mesh(shadowPlaneGeo, contactMat);
    playerShadow.rotation.x = -Math.PI / 2;
    playerShadow.position.set(KENYA_SPAWN.x, 0.02, KENYA_SPAWN.z);
    scene.add(playerShadow);

    // Input & Orbit Camera Controls
    const pressedKeys = new Set<string>();
    const onKeyDown = (e: KeyboardEvent) => {
      if (pausedRef.current) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      pressedKeys.add(e.code);
    };
    const onKeyUp = (e: KeyboardEvent) => {
      pressedKeys.delete(e.code);
    };

    let camYaw = 0;
    let camPitch = 0.36;
    let camDist = 6.5;
    let dragPointerId: number | null = null;
    let lastClientX = 0;
    let lastClientY = 0;

    const onWindowBlur = () => {
      pressedKeys.clear();
      dragPointerId = null;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onWindowBlur);

    const raycaster = new THREE.Raycaster();
    raycaster.layers.set(1);
    const pointerNdc = new THREE.Vector2();
    let downClientX = 0;
    let downClientY = 0;

    const onPointerDown = (e: PointerEvent) => {
      if (pausedRef.current) return;
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      dragPointerId = e.pointerId;
      lastClientX = e.clientX;
      lastClientY = e.clientY;
      downClientX = e.clientX;
      downClientY = e.clientY;
      try {
        renderer.domElement.setPointerCapture(e.pointerId);
      } catch {
        // ignore if unsupported
      }
    };
    const onPointerMove = (e: PointerEvent) => {
      if (pausedRef.current || dragPointerId !== e.pointerId) return;
      const dx = e.clientX - lastClientX;
      const dy = e.clientY - lastClientY;
      lastClientX = e.clientX;
      lastClientY = e.clientY;

      const sens = 0.0052 * sensitivityRef.current;
      camYaw -= dx * sens;
      camPitch = Math.max(0.16, Math.min(0.92, camPitch + dy * sens * 0.85));
    };
    const onPointerUp = (e: PointerEvent) => {
      if (dragPointerId !== e.pointerId) return;
      dragPointerId = null;
      try {
        if (renderer.domElement.hasPointerCapture(e.pointerId)) {
          renderer.domElement.releasePointerCapture(e.pointerId);
        }
      } catch {
        // ignore
      }
      if (!pausedRef.current && Math.hypot(e.clientX - downClientX, e.clientY - downClientY) <= 8) {
        const rect = renderer.domElement.getBoundingClientRect();
        pointerNdc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        pointerNdc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(pointerNdc, camera);
        const hits = raycaster.intersectObjects(clickableBeacons, false);
        if (hits.length > 0) {
          const hitData = hits[0].object.userData;
          if (hitData.touristNpcId) {
            const npcId = hitData.touristNpcId as TouristNpcId;
            const convId = getActiveConversationForTourist(npcId, practicedIdsRef.current).id;
            const hitPos = hits[0].object.position;
            if (
              convId === lastPoiReported ||
              Math.hypot(playerX - hitPos.x, playerZ - hitPos.z) <= 4.5
            ) {
              onActivatePoiRef.current?.(convId);
            }
          } else {
            const hitId = hitData.poiId as KenyaPoiId;
            if (hitId === lastPoiReported) {
              onActivatePoiRef.current?.(hitId);
            }
          }
        }
      }
    };
    const onWheel = (e: WheelEvent) => {
      if (pausedRef.current) return;
      e.preventDefault();
      camDist = Math.max(4.6, Math.min(9.5, camDist + e.deltaY * 0.004));
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerup', onPointerUp);
    renderer.domElement.addEventListener('pointercancel', onPointerUp);
    renderer.domElement.addEventListener('wheel', onWheel, { passive: false });

    const handleResize = () => {
      const w = Math.max(container.clientWidth, 320);
      const h = Math.max(container.clientHeight, 320);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    let playerX = KENYA_SPAWN.x;
    let playerZ = KENYA_SPAWN.z;
    let playerYaw = KENYA_SPAWN.yaw;
    let walkPhase = 0;
    let speedNorm = 0;
    let nightMix = appearanceRef.current === 'night' ? 1 : 0;
    let lastPoiReported: KenyaPoiId | null = null;
    let lastPosReportTime = 0;
    let activeAutoWalkId = 0;
    let lastCompletedAutoWalkId = 0;
    let autoWalkWaypointIdx = 0;
    let lastQuickTravelId = 0;
    let snapCameraNextFrame = false;
    let stuckTimer = 0;
    let stuckAnchorX = KENYA_SPAWN.x;
    let stuckAnchorZ = KENYA_SPAWN.z;

    const camPos = new THREE.Vector3(
      playerX + Math.sin(camYaw) * Math.cos(camPitch) * camDist,
      1.35 + Math.sin(camPitch) * camDist,
      playerZ + Math.cos(camYaw) * Math.cos(camPitch) * camDist,
    );
    const camLookTarget = new THREE.Vector3(playerX, 1.35, playerZ);
    camera.position.copy(camPos);
    camera.lookAt(camLookTarget);

    let disposed = false;
    let rafId = 0;
    let lastTime = performance.now();
    let elapsed = 0;

    const tick = (now: number) => {
      if (disposed) return;
      rafId = requestAnimationFrame(tick);

      if (isSoftwareGl && now - lastTime < 32) {
        return;
      }

      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      elapsed += dt;

      const reduced = reducedMotionRef.current;

      // 1. Day / Night Smooth Transition
      const targetNight = appearanceRef.current === 'night' ? 1 : 0;
      if (reduced) {
        nightMix = targetNight;
      } else {
        nightMix += (targetNight - nightMix) * Math.min(1, dt * 1.45);
      }

      skyUniforms.uTop.value.copy(DAY_SKY_TOP).lerp(NIGHT_SKY_TOP, nightMix);
      skyUniforms.uBottom.value.copy(DAY_SKY_BOTTOM).lerp(NIGHT_SKY_BOTTOM, nightMix);
      (scene.fog as THREE.FogExp2).color.copy(DAY_FOG).lerp(NIGHT_FOG, nightMix);
      scene.environmentIntensity = THREE.MathUtils.lerp(0.65, 0.34, nightMix);

      hemiLight.color.copy(DAY_HEMI_SKY).lerp(NIGHT_HEMI_SKY, nightMix);
      hemiLight.groundColor.copy(DAY_HEMI_GROUND).lerp(NIGHT_HEMI_GROUND, nightMix);
      hemiLight.intensity = THREE.MathUtils.lerp(1.12, 0.74, nightMix);

      keyLight.color.copy(DAY_KEY_COLOR).lerp(NIGHT_KEY_COLOR, nightMix);
      keyLight.intensity = THREE.MathUtils.lerp(2.22, 1.15, nightMix);
      _vecA.copy(DAY_KEY_POS).lerp(NIGHT_KEY_POS, nightMix);
      keyLight.position.copy(_vecA);

      cloudMat.color.copy(DAY_CLOUD_COLOR).lerp(NIGHT_CLOUD_COLOR, nightMix);
      cloudMat.opacity = THREE.MathUtils.lerp(0.92, 0.36, nightMix);
      starMat.opacity = nightMix * 0.88;
      moonMat.opacity = nightMix * 0.96;
      sunMat.opacity = (1 - nightMix) * 0.92;

      lanternGlowMat.emissiveIntensity = THREE.MathUtils.lerp(0.22, 1.88, nightMix);
      const pLightVal = THREE.MathUtils.lerp(0.2, 5.2, nightMix);
      for (const pl of lanternLights) {
        pl.intensity = pLightVal;
      }
      const stageBoost = stageActiveRef.current ? 1 : 0;
      stageSpotLight.intensity =
        THREE.MathUtils.lerp(0.2, 4.6, nightMix) + stageBoost * 1.4;
      stageTrimMat.emissiveIntensity = 0.18 + stageBoost * 0.45;

      const getDynamicCirclesNow = () => {
        const stageCeremonyNow = stageActiveRef.current && practicedIdsRef.current.length >= 5;
        const emmaActiveId = getActiveConversationForTourist('emma', practicedIdsRef.current).id;
        const emmaViewNow = stageCeremonyNow
          ? { x: 4.5, z: -10.4 }
          : KENYA_TOURIST_VIEWPOINTS[emmaActiveId];
        const danielActiveId = getActiveConversationForTourist('daniel', practicedIdsRef.current).id;
        const danielViewNow = stageCeremonyNow
          ? { x: 4.3, z: -11.6 }
          : KENYA_TOURIST_VIEWPOINTS[danielActiveId];
        return [
          { x: emmaViewNow.x, z: emmaViewNow.z, radius: 0.48 },
          { x: danielViewNow.x, z: danielViewNow.z, radius: 0.48 },
        ];
      };

      // Quick Travel Instant Relocation (Collision-Safe)
      const pendingQt = quickTravelRef.current;
      if (pendingQt && pendingQt.requestId !== lastQuickTravelId) {
        lastQuickTravelId = pendingQt.requestId;
        if (autoWalkRef.current) lastCompletedAutoWalkId = autoWalkRef.current.requestId;
        activeAutoWalkId = 0;
        const safeQt = resolveKenyaCollision(
          pendingQt.arrivalPoint.x,
          pendingQt.arrivalPoint.z,
          0.42,
          getDynamicCirclesNow(),
        );
        playerX = safeQt.x;
        playerZ = safeQt.z;
        playerYaw = pendingQt.facingYaw;
        snapCameraNextFrame = true;
        onPositionRef.current?.({ x: playerX, z: playerZ });
      }

      // 2. Player Movement (Keyboard + Mobile Joystick, overrides Auto-Walk)
      let rawX = 0;
      let rawY = 0;
      if (pausedRef.current) {
        if (pressedKeys.size > 0) pressedKeys.clear();
        dragPointerId = null;
      } else {
        if (pressedKeys.has('KeyW') || pressedKeys.has('ArrowUp')) rawY -= 1;
        if (pressedKeys.has('KeyS') || pressedKeys.has('ArrowDown')) rawY += 1;
        if (pressedKeys.has('KeyA') || pressedKeys.has('ArrowLeft')) rawX -= 1;
        if (pressedKeys.has('KeyD') || pressedKeys.has('ArrowRight')) rawX += 1;

        rawX += joystickRef.current.x;
        rawY += joystickRef.current.y;
      }

      const inputMag = Math.hypot(rawX, rawY);
      if (inputMag > 0.05) {
        if (activeAutoWalkId !== 0) {
          lastCompletedAutoWalkId = activeAutoWalkId;
          activeAutoWalkId = 0;
          onManualInterruptRef.current?.();
        }
        const clampedMag = Math.min(1, inputMag);
        const nx = rawX / inputMag;
        const ny = rawY / inputMag;

        const forwardX = -Math.sin(camYaw);
        const forwardZ = -Math.cos(camYaw);
        const rightX = Math.cos(camYaw);
        const rightZ = -Math.sin(camYaw);

        const worldDirX = rightX * nx + forwardX * -ny;
        const worldDirZ = rightZ * nx + forwardZ * -ny;

        const moveDist = WALK_SPEED * clampedMag * dt;
        const resolved = resolveKenyaCollision(
          playerX + worldDirX * moveDist,
          playerZ + worldDirZ * moveDist,
          0.42,
          getDynamicCirclesNow(),
        );
        playerX = resolved.x;
        playerZ = resolved.z;

        const targetYaw = Math.atan2(worldDirX, worldDirZ);
        const turnRate = reduced ? 1 : Math.min(1, dt * 11);
        playerYaw += shortestAngleDiff(playerYaw, targetYaw) * turnRate;
        speedNorm += (clampedMag - speedNorm) * Math.min(1, dt * 12);
      } else if (!pausedRef.current) {
        const aw = autoWalkRef.current;
        if (!aw) {
          activeAutoWalkId = 0;
          speedNorm += (0 - speedNorm) * Math.min(1, dt * 12);
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
            const snapped = resolveKenyaCollision(wp.x, wp.z, 0.42, getDynamicCirclesNow());
            playerX = snapped.x;
            playerZ = snapped.z;
            autoWalkWaypointIdx += 1;

            if (autoWalkWaypointIdx >= aw.waypoints.length) {
              lastCompletedAutoWalkId = aw.requestId;
              activeAutoWalkId = 0;
              speedNorm = 0;
              const destTarget = KENYA_INTERACTIVE_TARGETS.find((t) => t.id === aw.targetId);
              if (destTarget) {
                playerYaw = Math.atan2(
                  destTarget.position.x - playerX,
                  destTarget.position.z - playerZ,
                );
              }
              onPositionRef.current?.({ x: playerX, z: playerZ });
              onAutoWalkCompleteRef.current?.({ targetId: aw.targetId, status: 'arrived' });
            }
          } else {
            const dirX = dx / dist;
            const dirZ = dz / dist;
            const resolved = resolveKenyaCollision(
              playerX + dirX * stepDist,
              playerZ + dirZ * stepDist,
              0.42,
              getDynamicCirclesNow(),
            );
            playerX = resolved.x;
            playerZ = resolved.z;

            const targetYaw = Math.atan2(dirX, dirZ);
            const turnRate = reduced ? 1 : Math.min(1, dt * 11);
            playerYaw += shortestAngleDiff(playerYaw, targetYaw) * turnRate;
            speedNorm += (1 - speedNorm) * Math.min(1, dt * 12);

            stuckTimer += dt;
            if (stuckTimer >= 0.5) {
              if (Math.hypot(playerX - stuckAnchorX, playerZ - stuckAnchorZ) < 0.05) {
                lastCompletedAutoWalkId = aw.requestId;
                activeAutoWalkId = 0;
                speedNorm = 0;
                onAutoWalkCompleteRef.current?.({ targetId: aw.targetId, status: 'unreachable' });
              } else {
                stuckTimer = 0;
                stuckAnchorX = playerX;
                stuckAnchorZ = playerZ;
              }
            }
          }
        } else {
          speedNorm += (0 - speedNorm) * Math.min(1, dt * 12);
        }
      } else {
        speedNorm += (0 - speedNorm) * Math.min(1, dt * 12);
      }

      playerRig.root.position.set(playerX, 0, playerZ);
      playerRig.root.rotation.y = playerYaw;
      playerShadow.position.set(playerX, 0.02, playerZ);

      // 3. Player Avatar Procedural Animation
      const parts = playerRig.parts;
      if (speedNorm > 0.06 && !reduced) {
        walkPhase += dt * 9.2 * speedNorm;
        const swing = Math.sin(walkPhase) * 0.62 * speedNorm;
        const bounce = Math.abs(Math.cos(walkPhase)) * 0.045 * speedNorm;
        parts.hips.position.y = 0.64 + bounce;
        parts.leftLeg.rotation.x = swing;
        parts.rightLeg.rotation.x = -swing;
        parts.leftArm.rotation.x = -swing * 0.72;
        parts.rightArm.rotation.x = swing * 0.72;
        parts.torso.rotation.x = 0.06 * speedNorm;
        parts.head.rotation.x = -0.03 * speedNorm;
      } else {
        const idleBreath = reduced ? 0 : Math.sin(elapsed * 2.1) * 0.012;
        parts.hips.position.y = 0.64 + idleBreath;
        parts.leftLeg.rotation.x *= 0.82;
        parts.rightLeg.rotation.x *= 0.82;
        parts.leftArm.rotation.x *= 0.82;
        parts.rightArm.rotation.x *= 0.82;
        parts.torso.rotation.x *= 0.82;
        parts.head.rotation.x = reduced ? 0 : Math.sin(elapsed * 1.4) * 0.025;
      }

      if (interactTimerRef.current > 0) {
        interactTimerRef.current = Math.max(0, interactTimerRef.current - dt);
        const waveT = (1.25 - interactTimerRef.current) * 8.0;
        if (!reduced) {
          parts.rightArm.rotation.z = -1.65 + Math.sin(waveT) * 0.28;
          parts.rightForearm.rotation.z = -0.45 + Math.cos(waveT) * 0.25;
        }
      } else {
        parts.rightArm.rotation.z += (-0.14 - parts.rightArm.rotation.z) * Math.min(1, dt * 8);
        parts.rightForearm.rotation.z += (0 - parts.rightForearm.rotation.z) * Math.min(1, dt * 8);
      }

      if (celebrateTimerRef.current > 0) {
        celebrateTimerRef.current = Math.max(0, celebrateTimerRef.current - dt);
        const progress = 1 - celebrateTimerRef.current / 2.4;
        if (!reduced) {
          burstGroup.visible = true;
          burstGroup.position.set(playerX, 0, playerZ);
          for (const bp of burstParticles) {
            const rad = 0.45 + progress * 1.35 * bp.speed;
            const ang = bp.angle + progress * 4.5;
            bp.mesh.position.set(
              Math.cos(ang) * rad,
              0.9 + Math.sin(progress * Math.PI) * 1.45,
              Math.sin(ang) * rad,
            );
            bp.mesh.rotation.y += dt * 6;
            bp.mesh.scale.setScalar(Math.max(0.05, Math.sin(progress * Math.PI) * 1.25));
          }
          parts.hips.position.y = 0.64 + Math.abs(Math.sin(progress * Math.PI * 4)) * 0.16;
          parts.leftArm.rotation.z = 1.65;
          parts.rightArm.rotation.z = -1.65;
        } else {
          burstGroup.visible = false;
        }
      } else {
        burstGroup.visible = false;
        parts.leftArm.rotation.z += (0.14 - parts.leftArm.rotation.z) * Math.min(1, dt * 8);
      }

      const blinkCycle = elapsed % 3.6;
      const blinkAmt = blinkCycle > 3.44 ? Math.sin(((blinkCycle - 3.44) / 0.16) * Math.PI) : 0;
      const lidRot = THREE.MathUtils.lerp(-Math.PI * 0.42, 0.12, blinkAmt);
      parts.leftEyelid.rotation.x = lidRot;
      parts.rightEyelid.rotation.x = lidRot;

      // 4. Nearest Interactive Target Check
      const nearestPoi = findNearestKenyaPoi(playerX, playerZ);
      const nearestId = nearestPoi?.id ?? null;
      if (nearestId !== lastPoiReported) {
        lastPoiReported = nearestId;
        onNearestPoiRef.current(nearestId);
      }
      if (elapsed - lastPosReportTime > 0.25) {
        lastPosReportTime = elapsed;
        onPositionRef.current?.({ x: playerX, z: playerZ });
      }

      // 5. NPC Amina Odhiambo Idle, Wave & Turn-to-Player
      const distToAmina = Math.hypot(playerX - KENYA_AMINA_POS.x, playerZ - KENYA_AMINA_POS.z);
      const shouldFacePlayer = distToAmina < 3.6 || dialogueOpenRef.current;
      const aminaTargetYaw = shouldFacePlayer
        ? Math.atan2(playerX - KENYA_AMINA_POS.x, playerZ - KENYA_AMINA_POS.z)
        : KENYA_AMINA_POS.idleYaw;
      aminaRig.root.rotation.y +=
        shortestAngleDiff(aminaRig.root.rotation.y, aminaTargetYaw) *
        (reduced ? 1 : Math.min(1, dt * 5.2));

      if (!reduced) {
        aminaRig.torso.position.y = 0.03 + Math.sin(elapsed * 1.9 + 0.8) * 0.012;
        aminaRig.head.rotation.y = shouldFacePlayer ? 0 : Math.sin(elapsed * 0.85) * 0.14;
        if (dialogueOpenRef.current || (distToAmina < 3.5 && distToAmina > 1.0)) {
          aminaRig.rightArm.rotation.z = -1.45 + Math.sin(elapsed * 4.8) * 0.24;
          aminaRig.rightArm.rotation.x = -0.35;
        } else {
          aminaRig.rightArm.rotation.z += (-0.15 - aminaRig.rightArm.rotation.z) * Math.min(1, dt * 6);
          aminaRig.rightArm.rotation.x += (0 - aminaRig.rightArm.rotation.x) * Math.min(1, dt * 6);
        }
      }
      const aminaBlink = (elapsed + 1.4) % 4.0;
      const aminaBlinkAmt = aminaBlink > 3.84 ? Math.sin(((aminaBlink - 3.84) / 0.16) * Math.PI) : 0;
      const aminaLidRot = THREE.MathUtils.lerp(-Math.PI * 0.42, 0.12, aminaBlinkAmt);
      aminaRig.leftEyelid.rotation.x = aminaLidRot;
      aminaRig.rightEyelid.rotation.x = aminaLidRot;

      // 5B. Tourist NPCs Emma & Daniel Viewpoint Placement, Turn-to-Player & Expressions
      const animateTouristNpc = (
        rig: ReturnType<typeof createEmmaTouristRig>,
        shadow: THREE.Mesh,
        hitProxy: THREE.Mesh,
        npcId: TouristNpcId,
        phaseShift: number,
      ) => {
        const stopId = getActiveConversationForTourist(npcId, practicedIdsRef.current).id;
        const defaultSpot = KENYA_TOURIST_VIEWPOINTS[stopId];
        const stageCeremony = stageActiveRef.current && practicedIdsRef.current.length >= 5;
        const spot =
          stageCeremony && npcId === 'emma'
            ? { x: 4.5, z: -10.4, idleYaw: 0.62 }
            : stageCeremony && npcId === 'daniel'
              ? { x: 4.3, z: -11.6, idleYaw: 1.9 }
              : defaultSpot;
        rig.root.position.set(spot.x, 0, spot.z);
        shadow.position.set(spot.x, 0.02, spot.z);
        hitProxy.position.set(spot.x, 1.15, spot.z);

        const dist = Math.hypot(playerX - spot.x, playerZ - spot.z);
        const facePlayer = dist < 3.8 || activeTouristRef.current === npcId;
        const targetYaw = facePlayer
          ? Math.atan2(playerX - spot.x, playerZ - spot.z)
          : spot.idleYaw;
        rig.root.rotation.y +=
          shortestAngleDiff(rig.root.rotation.y, targetYaw) *
          (reduced ? 1 : Math.min(1, dt * 4.8));

        if (!reduced) {
          rig.torso.position.y = 0.03 + Math.sin(elapsed * 1.85 + phaseShift) * 0.011;
          rig.head.rotation.y = facePlayer ? 0 : Math.sin(elapsed * 0.8 + phaseShift) * 0.18;
          rig.head.rotation.x = facePlayer ? 0 : Math.sin(elapsed * 0.65 + phaseShift) * 0.05;
          rig.propPivot.rotation.x = Math.sin(elapsed * 1.5 + phaseShift) * 0.04;
          if (activeTouristRef.current === npcId || (celebrateTimerRef.current > 0 && stageCeremony)) {
            rig.rightArm.rotation.z = -1.15 + Math.sin(elapsed * 4.4) * 0.2;
            rig.rightArm.rotation.x = -0.32;
          } else {
            rig.rightArm.rotation.z += (-0.16 - rig.rightArm.rotation.z) * Math.min(1, dt * 5);
            rig.rightArm.rotation.x += (0 - rig.rightArm.rotation.x) * Math.min(1, dt * 5);
          }
        }
        const blinkC = (elapsed + phaseShift) % 3.8;
        const blinkAmtN = blinkC > 3.64 ? Math.sin(((blinkC - 3.64) / 0.16) * Math.PI) : 0;
        const lidRotN = THREE.MathUtils.lerp(-Math.PI * 0.42, 0.12, blinkAmtN);
        rig.leftEyelid.rotation.x = lidRotN;
        rig.rightEyelid.rotation.x = lidRotN;
      };

      animateTouristNpc(emmaRig, emmaShadow, emmaHit, 'emma', 0.55);
      animateTouristNpc(danielRig, danielShadow, danielHit, 'daniel', 2.1);

      // 6. Animate POI Beacons, Clouds, Wildlife, Acacia Sway & Grass Wind
      const guidedId = guidedPoiRef.current;
      KENYA_INTERACTIVE_TARGETS.forEach((poi, idx) => {
        const b = poiBeacons.get(poi.id);
        if (!b) return;
        const isVisited = visitedRef.current.has(poi.id);
        const isNear = poi.id === nearestId;
        const isGuided = guidedId === poi.id;

        _colorA.set(isGuided ? '#FBBF24' : isVisited ? '#2ED6A3' : poi.accentColor);
        b.ringMat.color.copy(_colorA);
        b.gemMat.color.copy(_colorA);
        b.gemMat.emissive.copy(_colorA);
        b.gemMat.emissiveIntensity = isGuided ? 1.3 : isNear ? 1.18 : isVisited ? 0.35 : 0.62;
        b.ringMat.opacity = isGuided ? 0.98 : isNear ? 0.95 : isVisited ? 0.46 : 0.74;

        if (!reduced) {
          const baseY = (poi.kind === 'npc' ? 2.2 : 1.72) + (isGuided ? 0.3 : 0);
          b.gem.position.y = baseY + Math.sin(elapsed * (isGuided ? 3.2 : 2.4) + idx) * (isGuided ? 0.22 : 0.14);
          b.gem.rotation.y += dt * (isGuided || isNear ? 2.4 : 1.2);
          b.gem.scale.setScalar(isGuided ? 1.3 : isVisited ? 0.76 : isNear ? 1.18 : 1.0);
          const rScale = isGuided
            ? 1.32 + Math.sin(elapsed * 4.8) * 0.14
            : isNear
              ? 1.14 + Math.sin(elapsed * 5) * 0.06
              : 1.0;
          b.ring.scale.setScalar(rScale);
        } else {
          b.gem.scale.setScalar(isGuided ? 1.25 : isVisited ? 0.76 : 1.0);
        }
      });

      if (!reduced) {
        for (const c of clouds) {
          c.group.position.x =
            ((c.baseX + elapsed * c.speed + c.range) % (c.range * 2)) - c.range;
        }

        // Gentle elephant trunk & ear sway
        for (const el of elephants) {
          const t = elapsed * 1.45 + el.phaseOffset;
          el.trunkBase.rotation.x = Math.sin(t) * 0.22;
          el.trunkBase.rotation.z = Math.cos(t * 0.8) * 0.08;
          el.trunkTip.rotation.x = 0.25 + Math.sin(t * 1.3 + 0.6) * 0.28;
          el.leftEar.rotation.y = Math.sin(t * 0.9) * 0.14;
          el.rightEar.rotation.y = -Math.sin(t * 0.9) * 0.14;
          el.tail.rotation.z = Math.sin(t * 2.2) * 0.12;
        }

        // Calm giraffe head turns
        for (const gf of giraffes) {
          const t = elapsed * 0.7 + gf.phaseOffset;
          gf.neckPivot.rotation.x = Math.sin(t) * 0.06;
          gf.headPivot.rotation.y = Math.sin(t * 1.15) * 0.28;
          gf.headPivot.rotation.x = Math.cos(t * 0.8) * 0.09;
          gf.tail.rotation.z = Math.sin(elapsed * 2.6 + gf.phaseOffset) * 0.14;
        }

        // Zebra gentle grazing head nods
        for (const zb of zebras) {
          const t = elapsed * 1.15 + zb.phaseOffset;
          zb.neckPivot.rotation.x = 0.14 + Math.sin(t) * 0.18;
          zb.tail.rotation.z = Math.sin(elapsed * 2.8 + zb.phaseOffset) * 0.16;
        }

        // Distant birds gliding in open sky (hidden gently at night)
        for (const bird of birds) {
          bird.root.visible = nightMix < 0.75;
          const ang = elapsed * bird.speed + bird.phase;
          bird.root.position.set(
            bird.centerX + Math.cos(ang) * bird.radius,
            bird.altitude + Math.sin(ang * 2) * 0.45,
            bird.centerZ + Math.sin(ang) * bird.radius,
          );
          bird.root.rotation.y = -ang;
          const flap = Math.sin(elapsed * 5.2 + bird.phase) * 0.34;
          bird.leftWing.rotation.z = flap;
          bird.rightWing.rotation.z = -flap;
        }

        // Wind-swaying acacia canopies & savanna grass blades
        acaciaCrowns.forEach((crown, idx) => {
          crown.rotation.z = Math.sin(elapsed * 1.1 + idx * 0.9) * 0.028;
        });

        grassSeeds.forEach((g, idx) => {
          grassDummy.position.set(g.x, 0, g.z);
          grassDummy.rotation.set(
            Math.sin(elapsed * 1.8 + g.phase) * 0.09,
            g.rotY,
            Math.cos(elapsed * 1.5 + g.phase) * 0.07,
          );
          grassDummy.scale.set(g.s, g.s, g.s);
          grassDummy.updateMatrix();
          grassInst.setMatrixAt(idx, grassDummy.matrix);
        });
        grassInst.instanceMatrix.needsUpdate = true;
      }

      // 7. Third-Person Follow Camera with Safe Savanna Perimeter Framing
      const desiredCamX = THREE.MathUtils.clamp(
        playerX + Math.sin(camYaw) * Math.cos(camPitch) * camDist,
        KENYA_BOUNDS.minX - 2.5,
        KENYA_BOUNDS.maxX + 2.5,
      );
      const desiredCamZ = THREE.MathUtils.clamp(
        playerZ + Math.cos(camYaw) * Math.cos(camPitch) * camDist,
        KENYA_BOUNDS.minZ - 2.5,
        KENYA_BOUNDS.maxZ + 3.2,
      );
      const desiredCamY = Math.max(0.95, 1.3 + Math.sin(camPitch) * camDist);

      if (snapCameraNextFrame || reduced) {
        camPos.set(desiredCamX, desiredCamY, desiredCamZ);
        snapCameraNextFrame = false;
      } else {
        const camFollowAlpha = Math.min(1, dt * 8.5);
        camPos.x += (desiredCamX - camPos.x) * camFollowAlpha;
        camPos.y += (desiredCamY - camPos.y) * camFollowAlpha;
        camPos.z += (desiredCamZ - camPos.z) * camFollowAlpha;
      }

      camLookTarget.set(playerX, 1.32, playerZ);
      camera.position.copy(camPos);
      camera.lookAt(camLookTarget);

      renderer.render(scene, camera);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onWindowBlur);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      renderer.domElement.removeEventListener('pointercancel', onPointerUp);
      renderer.domElement.removeEventListener('wheel', onWheel);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);

      playerRigRef.current = null;
      playerRig.dispose();
      aminaRig.dispose();
      emmaRig.dispose();
      danielRig.dispose();
      elephants.forEach((e) => e.dispose());
      giraffes.forEach((g) => g.dispose());
      zebras.forEach((z) => z.dispose());
      birds.forEach((b) => b.dispose());
      disposeObjectGeometries(worldGroup);
      disposables.forEach((d) => d.dispose());
      envTarget.dispose();
      pmrem.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-full w-full cursor-grab active:cursor-grabbing"
      aria-label="Kenya Maasai Mara WildSpeak Safari 3D Exploration"
    />
  );
}
