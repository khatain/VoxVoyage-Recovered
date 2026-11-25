import { useEffect, useRef, type MutableRefObject } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import type { AvatarConfig, ResolvedAppearance } from '../../types/game';
import {
  SCOTLAND_BOUNDS,
  SCOTLAND_EILIDH_POS,
  SCOTLAND_FIONA_POS,
  SCOTLAND_INTERACTIVE_TARGETS,
  SCOTLAND_SPAWN,
  type ScotlandNpcId,
  type ScotlandPoiId,
} from '../../data/scotlandWorld';
import { findNearestScotlandPoi, resolveScotlandCollision } from '../../utils/scotlandCollision';
import {
  createProceduralAvatarRig,
  disposeObjectGeometries,
} from '../avatar/proceduralAvatarRig';
import {
  createCobblestoneTexture,
  createEilidhNpcRig,
  createFionaNpcRig,
  createHighlandBirdRig,
  createHighlandGrassTexture,
  createHighlandTreeRig,
  createSignPosterTexture,
  createTartanTexture,
  type HighlandBirdRig,
  type HighlandTreeRig,
} from './scotlandProceduralModels';
import type { JoystickVector } from '../india/VirtualJoystick';
import type {
  ActiveAutoWalkRequest,
  ActiveQuickTravelRequest,
} from '../../utils/worldNavigation';

export interface ScotlandSceneProps {
  avatar: AvatarConfig;
  appearance: ResolvedAppearance;
  reducedMotion: boolean;
  cameraSensitivity: number;
  paused: boolean;
  visitedPoiIds: ScotlandPoiId[];
  guidedPoiId?: ScotlandPoiId | null;
  activeNpcId?: ScotlandNpcId | null;
  interactGestureSeq: number;
  joystickRef: MutableRefObject<JoystickVector>;
  autoWalkRequest?: ActiveAutoWalkRequest | null;
  quickTravelRequest?: ActiveQuickTravelRequest | null;
  onAutoWalkComplete?: (result: { targetId: string; status: 'arrived' | 'unreachable' }) => void;
  onManualInterrupt?: () => void;
  onNearestPoiChange: (poiId: ScotlandPoiId | null) => void;
  onActivatePoi?: (poiId: ScotlandPoiId) => void;
  onPlayerPositionChange?: (pos: { x: number; z: number }) => void;
  onWebGLFailure: () => void;
}

const _colorA = new THREE.Color();
const _vecA = new THREE.Vector3();

// Crisp Scottish Highland Daylight & Cozy Moonlit Slate Night
const DAY_SKY_TOP = new THREE.Color('#3F87C4');
const DAY_SKY_BOTTOM = new THREE.Color('#D3ECFA');
const NIGHT_SKY_TOP = new THREE.Color('#091129');
const NIGHT_SKY_BOTTOM = new THREE.Color('#202B52');

const DAY_FOG = new THREE.Color('#CBE5F4');
const NIGHT_FOG = new THREE.Color('#162040');

const DAY_HEMI_SKY = new THREE.Color('#E6F5FF');
const NIGHT_HEMI_SKY = new THREE.Color('#5E7FC8');
const DAY_HEMI_GROUND = new THREE.Color('#4B7748');
const NIGHT_HEMI_GROUND = new THREE.Color('#1E2634');

const DAY_KEY_COLOR = new THREE.Color('#FFF6E3');
const NIGHT_KEY_COLOR = new THREE.Color('#AECBFF');
const DAY_KEY_POS = new THREE.Vector3(20, 26, 16);
const NIGHT_KEY_POS = new THREE.Vector3(-16, 22, 14);

const DAY_CLOUD_COLOR = new THREE.Color('#FFFFFF');
const NIGHT_CLOUD_COLOR = new THREE.Color('#46598B');

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
    grad.addColorStop(0, 'rgba(18, 26, 40, 0.42)');
    grad.addColorStop(0.55, 'rgba(18, 26, 40, 0.18)');
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
    [0, 0, 0, 1.45],
    [-1.2, -0.15, 0.15, 0.98],
    [1.22, -0.1, -0.1, 1.04],
    [0.25, 0.48, 0.08, 0.84],
  ];
  const geo = new THREE.SphereGeometry(1, 12, 9);
  puffs.forEach(([px, py, pz, s]) => {
    const m = new THREE.Mesh(geo, material);
    m.position.set(px, py, pz);
    m.scale.set(s * 1.4, s * 0.78, s * 0.96);
    cloud.add(m);
  });
  return cloud;
}

function getBridgeElevation(x: number, z: number): number {
  if (x >= 2.85 && x <= 6.15 && z >= -9.5 && z <= -7.5) {
    const t = (x - 2.85) / (6.15 - 2.85);
    return Math.sin(t * Math.PI) * 0.22;
  }
  return 0;
}

export default function ScotlandExplorationScene({
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
  onAutoWalkComplete,
  onManualInterrupt,
  onNearestPoiChange,
  onActivatePoi,
  onPlayerPositionChange,
  onWebGLFailure,
}: ScotlandSceneProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const appearanceRef = useRef(appearance);
  appearanceRef.current = appearance;
  const reducedMotionRef = useRef(reducedMotion);
  reducedMotionRef.current = reducedMotion;
  const sensitivityRef = useRef(cameraSensitivity);
  sensitivityRef.current = cameraSensitivity;
  const pausedRef = useRef(paused);
  pausedRef.current = paused;
  const visitedRef = useRef<Set<ScotlandPoiId>>(new Set(visitedPoiIds));
  visitedRef.current = new Set(visitedPoiIds);
  const guidedPoiRef = useRef<ScotlandPoiId | null>(guidedPoiId);
  guidedPoiRef.current = guidedPoiId;
  const activeNpcRef = useRef<ScotlandNpcId | null>(activeNpcId);
  activeNpcRef.current = activeNpcId;

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

  useEffect(() => {
    if (interactGestureSeq > 0) {
      interactTimerRef.current = 1.15;
    }
  }, [interactGestureSeq]);

  // Keep player's saved customized avatar synced dynamically
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
      0.0076,
    );

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTarget = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;
    scene.environmentIntensity = appearanceRef.current === 'night' ? 0.36 : 0.68;

    const camera = new THREE.PerspectiveCamera(48, width / height, 0.25, 200);
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
    const skyDome = new THREE.Mesh(new THREE.SphereGeometry(130, 24, 16), skyMat);
    scene.add(skyDome);
    disposables.push(skyMat, skyDome.geometry);

    // Night Stars & Moon + Day Sun
    const starCount = 280;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const theta = ((i * 137.5) % 360) * (Math.PI / 180);
      const phi = Math.acos(0.14 + ((i * 29) % 100) / 118);
      const r = 102;
      starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = r * Math.cos(phi);
      starPositions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: '#F4F7FF',
      size: 0.54,
      transparent: true,
      opacity: appearanceRef.current === 'night' ? 0.9 : 0,
      depthWrite: false,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);
    disposables.push(starGeo, starMat);

    const moonMat = new THREE.MeshBasicMaterial({
      color: '#EEF4FF',
      transparent: true,
      opacity: appearanceRef.current === 'night' ? 0.95 : 0,
    });
    const moon = new THREE.Mesh(new THREE.SphereGeometry(3.0, 18, 14), moonMat);
    moon.position.set(-34, 40, -68);
    scene.add(moon);
    disposables.push(moon.geometry, moonMat);

    const sunMat = new THREE.MeshBasicMaterial({
      color: '#FFF6CA',
      transparent: true,
      opacity: appearanceRef.current === 'night' ? 0 : 0.92,
    });
    const sunDisc = new THREE.Mesh(new THREE.SphereGeometry(3.3, 18, 14), sunMat);
    sunDisc.position.set(36, 43, -64);
    scene.add(sunDisc);
    disposables.push(sunDisc.geometry, sunMat);

    // Drifting Highland Clouds
    const cloudMat = new THREE.MeshStandardMaterial({
      color: appearanceRef.current === 'night' ? NIGHT_CLOUD_COLOR : DAY_CLOUD_COLOR,
      roughness: 0.94,
      metalness: 0,
      transparent: true,
      opacity: appearanceRef.current === 'night' ? 0.36 : 0.9,
    });
    disposables.push(cloudMat);
    const clouds: { group: THREE.Group; baseX: number; speed: number; range: number }[] = [];
    for (let i = 0; i < 8; i++) {
      const c = createCloudCluster(cloudMat);
      const bx = -46 + i * 13;
      c.position.set(bx, 21 + (i % 3) * 3.2, -32 - (i % 2) * 20);
      c.scale.setScalar(1.3 + (i % 3) * 0.4);
      scene.add(c);
      clouds.push({ group: c, baseX: bx, speed: 0.35 + (i % 3) * 0.14, range: 56 });
    }

    // Scene Lighting
    const hemiLight = new THREE.HemisphereLight(
      appearanceRef.current === 'night' ? NIGHT_HEMI_SKY : DAY_HEMI_SKY,
      appearanceRef.current === 'night' ? NIGHT_HEMI_GROUND : DAY_HEMI_GROUND,
      appearanceRef.current === 'night' ? 0.78 : 1.15,
    );
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(
      appearanceRef.current === 'night' ? NIGHT_KEY_COLOR : DAY_KEY_COLOR,
      appearanceRef.current === 'night' ? 1.2 : 2.15,
    );
    keyLight.position.copy(appearanceRef.current === 'night' ? NIGHT_KEY_POS : DAY_KEY_POS);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      keyLight.shadow.camera.near = 2;
      keyLight.shadow.camera.far = 72;
      keyLight.shadow.camera.left = -25;
      keyLight.shadow.camera.right = 25;
      keyLight.shadow.camera.top = 25;
      keyLight.shadow.camera.bottom = -25;
      keyLight.shadow.bias = -0.0007;
    }
    scene.add(keyLight);

    // Warm Village & Market Lantern PointLights
    const lanternLights: THREE.PointLight[] = [];
    const lanternPositions: [number, number, number][] = [
      [-4.1, 2.25, 7.8],
      [4.3, 2.25, 8.2],
      [-11.3, 2.2, 2.2],
      [11.7, 2.2, 2.2],
      [-10.4, 2.4, -9.8],
      [8.6, 2.2, -10.8],
    ];
    lanternPositions.forEach(([lx, ly, lz]) => {
      const pl = new THREE.PointLight('#FFBA66', appearanceRef.current === 'night' ? 5.0 : 0.25, 13, 1.5);
      pl.position.set(lx, ly, lz);
      scene.add(pl);
      lanternLights.push(pl);
    });

    // Procedural Textures & Materials
    const grassTex = createHighlandGrassTexture(maxAnisotropy);
    const cobbleTex = createCobblestoneTexture(maxAnisotropy);
    const tartanRedTex = createTartanTexture('#9B2E2B', '#1C4B44', '#EAB64A', maxAnisotropy);
    const tartanGreenTex = createTartanTexture('#235B4C', '#2E3A6B', '#F0C75E', maxAnisotropy);
    const tartanRoyalTex = createTartanTexture('#3E4C91', '#9D3B46', '#F4D576', maxAnisotropy);
    const tartanSignTex = createSignPosterTexture('TARTAN & WEAVE', 'Craft & Loom Studio', '#B4443C');
    const marketSignTex = createSignPosterTexture('HIGHLAND MARKET', 'Oatcakes · Shortbread · Berries', '#D6892C');
    const gamesSignTex = createSignPosterTexture('HIGHLAND GAMES', 'Music & Summer Gathering', '#4D5BA8');
    const castleSignTex = createSignPosterTexture('HIGHLAND LOCH', 'Historic Stone Castle View', '#3B78A8');
    disposables.push(
      grassTex,
      cobbleTex,
      tartanRedTex,
      tartanGreenTex,
      tartanRoyalTex,
      tartanSignTex,
      marketSignTex,
      gamesSignTex,
      castleSignTex,
    );

    const meadowMat = new THREE.MeshStandardMaterial({ map: grassTex, roughness: 0.92, metalness: 0 });
    const cobbleMat = new THREE.MeshStandardMaterial({ map: cobbleTex, roughness: 0.86, metalness: 0.02 });
    const munroGreenMat = new THREE.MeshStandardMaterial({ color: '#4B7D4A', roughness: 0.94, metalness: 0 });
    const munroHeatherMat = new THREE.MeshStandardMaterial({ color: '#616C75', roughness: 0.95, metalness: 0 });
    const munroMistPeakMat = new THREE.MeshStandardMaterial({ color: '#6E7F91', roughness: 0.92, metalness: 0.02 });
    const graniteMat = new THREE.MeshStandardMaterial({ color: '#A7ABB2', roughness: 0.86, metalness: 0.03 });
    const darkStoneMat = new THREE.MeshStandardMaterial({ color: '#6E747E', roughness: 0.88, metalness: 0.04 });
    const castleStoneMat = new THREE.MeshStandardMaterial({ color: '#90959E', roughness: 0.88, metalness: 0.03 });
    const slateRoofMat = new THREE.MeshStandardMaterial({ color: '#394657', roughness: 0.72, metalness: 0.08 });
    const timberMat = new THREE.MeshStandardMaterial({ color: '#6D472F', roughness: 0.8, metalness: 0.03 });
    const warmWoodMat = new THREE.MeshStandardMaterial({ color: '#9D6D47', roughness: 0.76, metalness: 0.02 });
    const creamPlasterMat = new THREE.MeshStandardMaterial({ color: '#EDE7DC', roughness: 0.85, metalness: 0.01 });
    const heatherBloomMat = new THREE.MeshStandardMaterial({ color: '#8A5DB8', roughness: 0.8, metalness: 0 });
    const tartanRedMat = new THREE.MeshStandardMaterial({ map: tartanRedTex, roughness: 0.84 });
    const tartanGreenMat = new THREE.MeshStandardMaterial({ map: tartanGreenTex, roughness: 0.84 });
    const tartanRoyalMat = new THREE.MeshStandardMaterial({ map: tartanRoyalTex, roughness: 0.84 });
    const brassMat = new THREE.MeshStandardMaterial({ color: '#E8BC63', roughness: 0.25, metalness: 0.82 });
    const berryRedMat = new THREE.MeshStandardMaterial({ color: '#C83B4A', roughness: 0.5 });
    const shortbreadMat = new THREE.MeshStandardMaterial({ color: '#E4BD74', roughness: 0.75 });
    const creamClothMat = new THREE.MeshStandardMaterial({ color: '#F5EFE2', roughness: 0.86 });
    const lochWaterMat = new THREE.MeshStandardMaterial({
      color: '#2A7FA8',
      roughness: 0.14,
      metalness: 0.22,
      emissive: '#103D58',
      emissiveIntensity: 0.24,
    });
    const burnWaterMat = new THREE.MeshStandardMaterial({
      color: '#3B97C2',
      roughness: 0.16,
      metalness: 0.16,
      emissive: '#175470',
      emissiveIntensity: 0.2,
    });
    const windowGlowMat = new THREE.MeshStandardMaterial({
      color: '#FFE9B5',
      emissive: '#FFB34D',
      emissiveIntensity: appearanceRef.current === 'night' ? 1.65 : 0.22,
      roughness: 0.3,
    });
    const tarmacMossMat = new THREE.MeshStandardMaterial({ color: '#6B7A5D', roughness: 0.9 });

    const tartanSignMat = new THREE.MeshStandardMaterial({ map: tartanSignTex, roughness: 0.68 });
    const marketSignMat = new THREE.MeshStandardMaterial({ map: marketSignTex, roughness: 0.68 });
    const gamesSignMat = new THREE.MeshStandardMaterial({ map: gamesSignTex, roughness: 0.68 });
    const castleSignMat = new THREE.MeshStandardMaterial({ map: castleSignTex, roughness: 0.68 });

    disposables.push(
      meadowMat,
      cobbleMat,
      munroGreenMat,
      munroHeatherMat,
      munroMistPeakMat,
      graniteMat,
      darkStoneMat,
      castleStoneMat,
      slateRoofMat,
      timberMat,
      warmWoodMat,
      creamPlasterMat,
      heatherBloomMat,
      tartanRedMat,
      tartanGreenMat,
      tartanRoyalMat,
      brassMat,
      berryRedMat,
      shortbreadMat,
      creamClothMat,
      lochWaterMat,
      burnWaterMat,
      windowGlowMat,
      tarmacMossMat,
      tartanSignMat,
      marketSignMat,
      gamesSignMat,
      castleSignMat,
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

    // 1. Expansive Highland Meadow Ground & Loch Water Plane
    addWorldMesh(
      new THREE.CylinderGeometry(120, 120, 0.4, 48),
      meadowMat,
      [0, -0.2, 0],
      [0, 0, 0],
      [1, 1, 1],
      true,
      false,
    );

    // Shimmering Scottish Loch along Northern Edge (z = -14.35 northward to -64)
    const lochMesh = addWorldMesh(
      new THREE.PlaneGeometry(170, 52),
      lochWaterMat,
      [0, 0.02, -40.2],
      [-Math.PI / 2, 0, 0],
      [1, 1, 1],
      true,
      false,
    );
    // Stone & Gravel Loch Shoreline Edge
    for (let x = -22; x <= 22; x += 2.2) {
      addWorldMesh(
        new THREE.DodecahedronGeometry(0.45 + ((Math.abs(x) * 3) % 3) * 0.14, 0),
        darkStoneMat,
        [x, 0.12, -14.2 + Math.sin(x * 0.6) * 0.25],
        [0.1, x * 0.4, 0],
        [1.5, 0.48, 1.1],
        true,
        false,
      );
    }

    // Distant Loch Shore Bank & Rolling Highland Munro Mountains
    addWorldMesh(
      new THREE.BoxGeometry(170, 1.4, 28),
      munroGreenMat,
      [0, 0.4, -46],
      [0, 0, 0],
      [1, 1, 1],
      true,
      false,
    );

    const hillPlacements: [number, number, number, number, number, THREE.Material][] = [
      [-46, -42, 22, 11.5, 16, munroGreenMat],
      [-16, -54, 26, 15.0, 18, munroHeatherMat],
      [18, -56, 28, 16.5, 18, munroMistPeakMat],
      [48, -44, 24, 12.8, 16, munroGreenMat],
      [-48, -8, 16, 8.2, 22, munroGreenMat],
      [48, -6, 16, 8.5, 22, munroHeatherMat],
      [-42, 26, 18, 6.8, 14, munroGreenMat],
      [44, 24, 18, 7.0, 14, munroGreenMat],
      [0, 48, 28, 6.2, 13, munroHeatherMat],
    ];
    hillPlacements.forEach(([hx, hz, rx, ry, rz, mat], idx) => {
      addWorldMesh(
        new THREE.SphereGeometry(1, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.5),
        mat,
        [hx, -0.3, hz],
        [0, idx * 0.4, 0],
        [rx, ry, rz],
        true,
        false,
      );
    });

    // 2. Highland Burn (stream) & Walkable Stone Arch Bridge
    const burnMeshSouth = addWorldMesh(
      new THREE.BoxGeometry(1.45, 0.03, 4.1),
      burnWaterMat,
      [4.5, 0.015, -5.2],
      [0, 0, 0],
      [1, 1, 1],
      true,
      false,
    );
    const burnMeshNorth = addWorldMesh(
      new THREE.BoxGeometry(1.45, 0.03, 5.2),
      burnWaterMat,
      [4.5, 0.015, -12.0],
      [0, 0, 0],
      [1, 1, 1],
      true,
      false,
    );
    // Cobblestone stream banks
    [-0.82, 0.82].forEach((ox) => {
      for (let z = -14.0; z <= -3.5; z += 1.05) {
        if (z > -9.8 && z < -7.2) continue;
        addWorldMesh(
          new THREE.DodecahedronGeometry(0.28, 0),
          darkStoneMat,
          [4.5 + ox, 0.08, z],
          [0, z, 0],
          [1.0, 0.55, 1.3],
        );
      }
    });

    // Walkable Arched Stone Footbridge spanning Highland Burn at x=2.8..6.2, z=-8.5
    const bridgeDeckSteps = 7;
    for (let i = 0; i < bridgeDeckSteps; i++) {
      const t = (i + 0.5) / bridgeDeckSteps;
      const sx = 2.85 + t * 3.3;
      const sy = Math.sin(t * Math.PI) * 0.22;
      addWorldMesh(
        new THREE.BoxGeometry(0.56, 0.12, 2.05),
        graniteMat,
        [sx, sy, -8.5],
        [0, 0, Math.cos(t * Math.PI) * 0.16],
        [1, 1, 1],
        true,
        true,
      );
    }
    // Stone Bridge Parapet Walls (matches collision boxes at z=-9.72 and z=-7.28)
    [-9.72, -7.28].forEach((pz) => {
      addWorldMesh(new THREE.BoxGeometry(3.35, 0.62, 0.36), darkStoneMat, [4.5, 0.31, pz]);
      addWorldMesh(new THREE.BoxGeometry(3.48, 0.14, 0.44), graniteMat, [4.5, 0.66, pz]);
      [-1.58, 1.58].forEach((px) => {
        addWorldMesh(new THREE.BoxGeometry(0.48, 0.92, 0.48), graniteMat, [4.5 + px, 0.46, pz]);
        addWorldMesh(new THREE.ConeGeometry(0.32, 0.24, 4), darkStoneMat, [4.5 + px, 1.04, pz], [0, Math.PI / 4, 0]);
      });
    });

    // 3. Connected Village Cobblestone Paths
    const addCobbleSegment = (x1: number, z1: number, x2: number, z2: number, w: number) => {
      const dx = x2 - x1;
      const dz = z2 - z1;
      const len = Math.hypot(dx, dz);
      const angle = Math.atan2(dx, dz);
      addWorldMesh(
        new THREE.BoxGeometry(w, 0.025, len),
        cobbleMat,
        [(x1 + x2) / 2, 0.009, (z1 + z2) / 2],
        [0, angle, 0],
        [1, 1, 1],
        true,
        false,
      );
    };
    addCobbleSegment(0, 14.8, 0, 2.5, 2.6); // Spawn -> Village Square
    addCobbleSegment(0, 3.6, -10.5, 2.2, 2.1); // Village -> Tartan Workshop
    addCobbleSegment(0, 3.6, 10.5, 2.2, 2.1); // Village -> Highland Food Market
    addCobbleSegment(0, 3.6, -2.0, -3.2, 2.1); // Village -> Central Crossroads (Fiona)
    addCobbleSegment(-2.0, -3.2, -8.8, -7.8, 2.0); // Crossroads -> Highland Games Ground
    addCobbleSegment(-2.0, -3.2, 2.8, -8.5, 2.0); // Crossroads -> Stone Bridge Approach
    addCobbleSegment(6.2, -8.5, 9.2, -9.2, 2.0); // Stone Bridge -> Lochside Castle Viewpoint

    // Circular Village Square Cobble Plaza around Central Fountain
    addWorldMesh(
      new THREE.CylinderGeometry(4.6, 4.8, 0.026, 32),
      cobbleMat,
      [0, 0.008, 5.2],
      [0, 0, 0],
      [1, 1, 1],
      true,
      false,
    );

    // 4. Landmark 1: Highland Village Square (Stone Cottages, Central Fountain, Flower Boxes, Welcome Banners)
    const buildStoneCottage = (cx: number, cz: number, yaw: number) => {
      const cottage = new THREE.Group();
      cottage.position.set(cx, 0, cz);
      cottage.rotation.y = yaw;
      worldGroup.add(cottage);

      const addPart = (
        geo: THREE.BufferGeometry,
        mat: THREE.Material,
        pos: [number, number, number],
        rot: [number, number, number] = [0, 0, 0],
        cast = !isSoftwareGl,
      ) => {
        const m = new THREE.Mesh(geo, mat);
        m.position.set(pos[0], pos[1], pos[2]);
        m.rotation.set(rot[0], rot[1], rot[2]);
        m.castShadow = cast;
        m.receiveShadow = true;
        cottage.add(m);
      };

      // Granite cottage walls & cream mortar base
      addPart(new THREE.BoxGeometry(4.2, 0.35, 3.4), darkStoneMat, [0, 0.175, 0]);
      addPart(new THREE.BoxGeometry(4.0, 2.15, 3.2), graniteMat, [0, 1.38, 0]);
      // Pitched slate roof + chimney stack
      addPart(new THREE.ConeGeometry(3.05, 1.65, 4), slateRoofMat, [0, 3.24, 0], [0, Math.PI / 4, 0]);
      addPart(new THREE.BoxGeometry(0.54, 1.25, 0.54), darkStoneMat, [-1.25, 3.55, -0.45]);
      addPart(new THREE.BoxGeometry(0.66, 0.16, 0.66), graniteMat, [-1.25, 4.2, -0.45]);
      // Timber door facing village square + glowing window panes
      addPart(new THREE.BoxGeometry(0.86, 1.48, 0.12), timberMat, [0, 0.96, 1.61]);
      addPart(new THREE.SphereGeometry(0.06, 8, 8), brassMat, [0.28, 0.96, 1.68]);
      [-1.18, 1.18].forEach((wx) => {
        addPart(new THREE.BoxGeometry(0.8, 0.72, 0.12), timberMat, [wx, 1.48, 1.6]);
        addPart(new THREE.BoxGeometry(0.66, 0.58, 0.14), windowGlowMat, [wx, 1.48, 1.61], [0, 0, 0], false);
        // Flower box of purple Scottish heather
        addPart(new THREE.BoxGeometry(0.86, 0.24, 0.32), warmWoodMat, [wx, 0.95, 1.72]);
        for (let f = -1; f <= 1; f++) {
          addPart(new THREE.SphereGeometry(0.14, 8, 6), heatherBloomMat, [wx + f * 0.24, 1.12, 1.74]);
        }
      });
    };

    buildStoneCottage(-6.8, 7.8, 0.42);
    buildStoneCottage(6.9, 8.2, -0.46);

    // Central Village Stone Fountain at (0, 6.4)
    addWorldMesh(new THREE.CylinderGeometry(1.42, 1.54, 0.54, 12), darkStoneMat, [0, 0.27, 6.4]);
    addWorldMesh(new THREE.CylinderGeometry(1.22, 1.22, 0.12, 12), burnWaterMat, [0, 0.5, 6.4], [0, 0, 0], [1, 1, 1], true, false);
    addWorldMesh(new THREE.CylinderGeometry(0.3, 0.42, 1.18, 10), graniteMat, [0, 0.85, 6.4]);
    addWorldMesh(new THREE.CylinderGeometry(0.66, 0.36, 0.24, 10), graniteMat, [0, 1.42, 6.4]);
    addWorldMesh(new THREE.SphereGeometry(0.2, 10, 8), brassMat, [0, 1.7, 6.4]);

    // Welcome Tartan Bunting Banner Posts near Village Square (0, 2.2)
    [-2.1, 2.1].forEach((bx) => {
      addWorldMesh(new THREE.CylinderGeometry(0.08, 0.1, 2.6, 8), timberMat, [bx, 1.3, 1.6]);
    });
    addWorldMesh(new THREE.BoxGeometry(4.4, 0.14, 0.14), timberMat, [0, 2.55, 1.6]);
    addWorldMesh(new THREE.BoxGeometry(3.8, 0.48, 0.08), tartanGreenMat, [0, 2.26, 1.6]);

    // 5. Landmark 2: Tartan & Heritage Workshop (-14.2, 2.2 & loom at -10.4, -0.6)
    const wsX = -14.3;
    const wsZ = 2.2;
    addWorldMesh(new THREE.BoxGeometry(4.5, 2.5, 4.3), creamPlasterMat, [wsX, 1.25, wsZ]);
    addWorldMesh(new THREE.BoxGeometry(4.62, 0.45, 4.42), darkStoneMat, [wsX, 0.22, wsZ]);
    addWorldMesh(new THREE.ConeGeometry(3.55, 1.75, 4), slateRoofMat, [wsX, 3.35, wsZ], [0, Math.PI / 4, 0]);
    // Timber front awning & Workshop sign facing East
    addWorldMesh(new THREE.BoxGeometry(1.15, 0.12, 3.6), tartanRedMat, [wsX + 2.75, 2.1, wsZ], [0, 0, -0.25]);
    addWorldMesh(new THREE.CylinderGeometry(0.07, 0.08, 2.0, 8), timberMat, [wsX + 3.2, 1.0, wsZ - 1.5]);
    addWorldMesh(new THREE.CylinderGeometry(0.07, 0.08, 2.0, 8), timberMat, [wsX + 3.2, 1.0, wsZ + 1.5]);
    addWorldMesh(new THREE.BoxGeometry(0.14, 0.85, 2.1), tartanSignMat, [wsX + 2.32, 2.65, wsZ]);
    addWorldMesh(new THREE.BoxGeometry(0.12, 1.45, 0.9), timberMat, [wsX + 2.26, 0.95, wsZ]);
    addWorldMesh(new THREE.BoxGeometry(0.12, 0.72, 0.95), windowGlowMat, [wsX + 2.26, 1.35, wsZ + 1.3], [0, 0, 0], [1, 1, 1], false, false);

    // Outdoor Wooden Weaving Loom & Draped Tartan Bolts at (-10.4, -0.6)
    const loomX = -10.4;
    const loomZ = -0.6;
    addWorldMesh(new THREE.CylinderGeometry(0.06, 0.07, 1.65, 8), timberMat, [loomX - 0.75, 0.82, loomZ]);
    addWorldMesh(new THREE.CylinderGeometry(0.06, 0.07, 1.65, 8), timberMat, [loomX + 0.75, 0.82, loomZ]);
    addWorldMesh(new THREE.BoxGeometry(1.65, 0.1, 0.12), timberMat, [loomX, 1.6, loomZ]);
    addWorldMesh(new THREE.BoxGeometry(1.5, 0.1, 0.12), timberMat, [loomX, 0.5, loomZ]);
    addWorldMesh(new THREE.BoxGeometry(0.62, 0.98, 0.05), tartanRedMat, [loomX - 0.36, 1.05, loomZ]);
    addWorldMesh(new THREE.BoxGeometry(0.62, 0.98, 0.05), tartanRoyalMat, [loomX + 0.36, 1.05, loomZ]);
    // Craft Wool Spools Table
    addWorldMesh(new THREE.BoxGeometry(0.95, 0.52, 0.65), warmWoodMat, [loomX, 0.26, loomZ + 0.45]);

    // 6. Landmark 3: Highland Food Market (Stalls at (13.9, 0.85) & (13.9, 4.15))
    const buildMarketStall = (mx: number, mz: number, bannerMat: THREE.Material, foodColorA: string) => {
      addWorldMesh(new THREE.BoxGeometry(2.6, 0.92, 1.8), warmWoodMat, [mx, 0.46, mz]);
      addWorldMesh(new THREE.BoxGeometry(2.75, 0.1, 1.95), creamClothMat, [mx, 0.96, mz]);
      [
        [-1.25, -0.82],
        [1.25, -0.82],
        [-1.25, 0.82],
        [1.25, 0.82],
      ].forEach(([px, pz]) => {
        addWorldMesh(new THREE.CylinderGeometry(0.06, 0.06, 2.2, 8), timberMat, [mx + px, 1.1, mz + pz]);
      });
      addWorldMesh(new THREE.BoxGeometry(2.9, 0.14, 2.1), bannerMat, [mx, 2.26, mz], [0, 0, 0.12]);
      // Trays of Golden Oatcakes, Shortbread & Berry Baskets
      addWorldMesh(new THREE.BoxGeometry(0.65, 0.18, 0.55), shortbreadMat, [mx - 0.55, 1.08, mz - 0.2]);
      addWorldMesh(new THREE.CylinderGeometry(0.32, 0.26, 0.24, 12), berryRedMat, [mx + 0.45, 1.12, mz + 0.2]);
      const extraMat = new THREE.MeshStandardMaterial({ color: foodColorA, roughness: 0.72 });
      disposables.push(extraMat);
      addWorldMesh(new THREE.CylinderGeometry(0.28, 0.24, 0.22, 10), extraMat, [mx - 0.2, 1.1, mz + 0.35]);
    };
    buildMarketStall(13.9, 0.85, tartanRedMat, '#E8A84C');
    buildMarketStall(13.9, 4.15, tartanGreenMat, '#7D4D88');
    // Market Welcome Sign & Cozy Stone Hearth Kettle nearby
    addWorldMesh(new THREE.CylinderGeometry(0.06, 0.07, 1.85, 8), timberMat, [12.1, 0.92, 2.5]);
    addWorldMesh(new THREE.BoxGeometry(0.14, 0.85, 1.8), marketSignMat, [12.1, 1.55, 2.5]);
    addWorldMesh(new THREE.CylinderGeometry(0.55, 0.68, 0.65, 10), darkStoneMat, [14.5, 0.32, 2.5]);
    addWorldMesh(new THREE.SphereGeometry(0.32, 12, 8), windowGlowMat, [14.5, 0.64, 2.5], [0, 0, 0], [1, 0.7, 1], false, false);

    // 7. Landmark 4: Highland Games Festival Ground ((-13.2, -10.8) stage + (-7.4, -12.3) prop rack)
    const stageX = -13.2;
    const stageZ = -10.8;
    addWorldMesh(new THREE.BoxGeometry(4.4, 0.48, 3.2), warmWoodMat, [stageX, 0.24, stageZ]);
    addWorldMesh(new THREE.BoxGeometry(4.52, 0.1, 3.32), darkStoneMat, [stageX, 0.05, stageZ]);
    [-2.0, 2.0].forEach((px) => {
      addWorldMesh(new THREE.CylinderGeometry(0.07, 0.08, 2.55, 8), timberMat, [stageX + px, 1.48, stageZ - 1.35]);
    });
    addWorldMesh(new THREE.BoxGeometry(4.2, 0.14, 0.14), timberMat, [stageX, 2.7, stageZ - 1.35]);
    addWorldMesh(new THREE.BoxGeometry(3.75, 1.05, 0.12), gamesSignMat, [stageX, 2.08, stageZ - 1.35]);
    // Folk Drum (Bodhran) & Fiddle Case Props on Stage
    addWorldMesh(new THREE.CylinderGeometry(0.34, 0.34, 0.22, 14), creamClothMat, [stageX - 0.85, 0.82, stageZ + 0.2], [Math.PI / 2, 0.25, 0]);
    addWorldMesh(new THREE.BoxGeometry(0.45, 0.14, 0.92), timberMat, [stageX + 0.85, 0.55, stageZ + 0.3], [0, -0.3, 0]);

    // Safe Decorative Caber & Stone-Put Rack at (-7.4, -12.3)
    const rackX = -7.4;
    const rackZ = -12.3;
    [-1.1, 1.1].forEach((rx) => {
      addWorldMesh(new THREE.CylinderGeometry(0.07, 0.08, 1.15, 8), timberMat, [rackX + rx, 0.58, rackZ]);
    });
    addWorldMesh(new THREE.CylinderGeometry(0.11, 0.14, 2.65, 10), warmWoodMat, [rackX, 0.96, rackZ], [0, 0, Math.PI / 2]);
    // Tartan Festival Pennants
    const pennantBanners: THREE.Mesh[] = [];
    for (let i = 0; i < 6; i++) {
      const pMesh = addWorldMesh(
        new THREE.ConeGeometry(0.22, 0.42, 4),
        i % 2 === 0 ? tartanRedMat : tartanRoyalMat,
        [-11.6 + i * 1.1, 2.75, -8.8 - (i % 2) * 0.15],
        [Math.PI, 0, 0],
      );
      pennantBanners.push(pMesh);
    }

    // 8. Landmark 5: Lochside Castle Viewpoint ((8.8, -9.0) + Pier + Cairn + Distant Stone Castle across Loch)
    // Lakeside Viewing Timber Pier + Railing at (9.0, -13.4)
    addWorldMesh(new THREE.BoxGeometry(3.2, 0.18, 2.4), warmWoodMat, [9.0, 0.16, -13.1]);
    addWorldMesh(new THREE.BoxGeometry(3.1, 0.1, 0.1), timberMat, [9.0, 0.95, -14.22]);
    [-1.45, 0, 1.45].forEach((rx) => {
      addWorldMesh(new THREE.CylinderGeometry(0.06, 0.07, 1.0, 8), timberMat, [9.0 + rx, 0.52, -14.22]);
    });
    // Castle Viewpoint Heritage Sign at (7.5, -11.4)
    addWorldMesh(new THREE.CylinderGeometry(0.06, 0.07, 1.8, 8), timberMat, [7.2, 0.9, -11.2]);
    addWorldMesh(new THREE.BoxGeometry(1.55, 0.82, 0.12), castleSignMat, [7.2, 1.52, -11.2], [0, -0.35, 0]);

    // Stone Cairn & Brass Spyglass Viewfinder at (11.4, -10.5)
    addWorldMesh(new THREE.CylinderGeometry(0.45, 0.62, 0.85, 10), graniteMat, [11.4, 0.42, -10.5]);
    addWorldMesh(new THREE.CylinderGeometry(0.07, 0.09, 0.8, 8), timberMat, [10.4, 0.4, -13.6]);
    addWorldMesh(new THREE.CylinderGeometry(0.07, 0.1, 0.56, 10), brassMat, [10.4, 0.88, -13.6], [Math.PI / 2 - 0.12, -0.15, 0]);

    // Distant Highland Stone Castle on Loch Peninsula (x = 10.5, z = -37)
    const castle = new THREE.Group();
    castle.position.set(10.5, 0, -37.0);
    castle.rotation.y = -0.22;
    castle.scale.setScalar(1.65);
    worldGroup.add(castle);

    const addCastlePart = (
      geo: THREE.BufferGeometry,
      mat: THREE.Material,
      pos: [number, number, number],
      rot: [number, number, number] = [0, 0, 0],
    ) => {
      const m = new THREE.Mesh(geo, mat);
      m.position.set(pos[0], pos[1], pos[2]);
      m.rotation.set(rot[0], rot[1], rot[2]);
      m.receiveShadow = true;
      castle.add(m);
    };
    addCastlePart(new THREE.CylinderGeometry(6.8, 7.8, 1.6, 12), darkStoneMat, [0, 0.7, 0]);
    addCastlePart(new THREE.BoxGeometry(7.2, 4.4, 4.6), castleStoneMat, [0, 3.2, 0]);
    addCastlePart(new THREE.BoxGeometry(2.6, 6.4, 2.8), graniteMat, [-1.4, 4.5, 0.2]);
    addCastlePart(new THREE.ConeGeometry(2.15, 2.4, 4), slateRoofMat, [-1.4, 8.85, 0.2], [0, Math.PI / 4, 0]);
    [-3.7, 3.7].forEach((tx) => {
      addCastlePart(new THREE.CylinderGeometry(1.15, 1.25, 5.4, 12), castleStoneMat, [tx, 3.8, 2.1]);
      addCastlePart(new THREE.ConeGeometry(1.38, 1.9, 12), slateRoofMat, [tx, 7.4, 2.1]);
    });
    // Castle banner & warm keep windows
    addCastlePart(new THREE.CylinderGeometry(0.06, 0.06, 2.2, 6), timberMat, [2.2, 7.4, 0]);
    addCastlePart(new THREE.BoxGeometry(1.2, 0.65, 0.08), tartanRoyalMat, [2.85, 8.15, 0]);
    addCastlePart(new THREE.BoxGeometry(0.45, 0.75, 0.14), windowGlowMat, [-1.4, 5.2, 1.65]);
    addCastlePart(new THREE.BoxGeometry(0.45, 0.75, 0.14), windowGlowMat, [1.2, 3.6, 2.35]);

    // 9. Scottish Highland Trees (matching obstacle layout + distant scenic trees)
    const trees: HighlandTreeRig[] = [];
    const treePlacements: { x: number; z: number; kind: 'pine' | 'rowan'; scale: number }[] = [
      { x: -12.8, z: 10.6, kind: 'pine', scale: 1.08 },
      { x: 13.0, z: 10.4, kind: 'pine', scale: 1.05 },
      { x: -15.5, z: -4.6, kind: 'rowan', scale: 1.02 },
      { x: 16.4, z: -4.4, kind: 'rowan', scale: 1.04 },
      { x: -16.2, z: -13.6, kind: 'pine', scale: 1.12 },
      { x: 15.8, z: -9.8, kind: 'rowan', scale: 1.0 },
      // Background perimeter trees outside playable bounds
      { x: -23.5, z: 12.0, kind: 'pine', scale: 1.25 },
      { x: 23.0, z: 11.5, kind: 'pine', scale: 1.22 },
      { x: -24.0, z: -7.5, kind: 'rowan', scale: 1.15 },
      { x: 24.5, z: -8.5, kind: 'pine', scale: 1.25 },
    ];
    treePlacements.forEach((tp) => {
      const rig = createHighlandTreeRig(tp.kind, tp.scale, !isSoftwareGl);
      rig.root.position.set(tp.x, 0, tp.z);
      scene.add(rig.root);
      trees.push(rig);
    });

    // Mossy Highland Boulders matching obstacle positions
    const boulderCoords: [number, number, number][] = [
      [-15.2, 12.8, 1.05],
      [15.6, 12.6, 1.0],
      [-18.0, -8.0, 1.1],
    ];
    boulderCoords.forEach(([bx, bz, br], idx) => {
      addWorldMesh(
        new THREE.DodecahedronGeometry(br, 0),
        darkStoneMat,
        [bx, br * 0.42, bz],
        [0.15, idx * 1.2, 0.1],
        [1.15, 0.78, 1.05],
      );
      addWorldMesh(
        new THREE.DodecahedronGeometry(br * 0.55, 0),
        tarmacMossMat,
        [bx + 0.45, br * 0.65, bz - 0.2],
        [0, idx, 0.2],
        [1.1, 0.42, 1.0],
      );
    });

    // Instanced Highland Grass & Purple Heather Tufts
    const tuftGeo = new THREE.ConeGeometry(0.11, 0.48, 5);
    tuftGeo.translate(0, 0.24, 0);
    const tuftMat = new THREE.MeshStandardMaterial({ color: '#FFFFFF', roughness: 0.85, metalness: 0 });
    disposables.push(tuftGeo, tuftMat);

    const tuftSeeds: { x: number; z: number; s: number; rotY: number; phase: number; color: THREE.Color }[] = [];
    const tuftPalette = [
      new THREE.Color('#4B8847'),
      new THREE.Color('#5E9850'),
      new THREE.Color('#8D62BC'), // Scottish Heather purple!
      new THREE.Color('#427744'),
    ];
    for (let i = 0; i < 96; i++) {
      const gx = (((i * 71) % 380) / 10) - 19;
      const gz = (((i * 109) % 300) / 10) - 13.5;
      // Keep clear of central fountain plaza, burn stream, and cottages
      if (Math.hypot(gx, gz - 5.2) < 5.0 || (gx > 3.1 && gx < 6.0 && gz < -3.0)) continue;
      if (Math.abs(gx) < 2.2 && gz > 2.0) continue;
      tuftSeeds.push({
        x: gx,
        z: gz,
        s: 0.72 + (i % 4) * 0.2,
        rotY: (i * 0.85) % (Math.PI * 2),
        phase: i * 0.42,
        color: tuftPalette[i % tuftPalette.length],
      });
    }
    const tuftInst = new THREE.InstancedMesh(tuftGeo, tuftMat, tuftSeeds.length);
    const tuftDummy = new THREE.Object3D();
    tuftSeeds.forEach((g, idx) => {
      tuftDummy.position.set(g.x, 0, g.z);
      tuftDummy.rotation.set(0, g.rotY, 0);
      tuftDummy.scale.set(g.s, g.s, g.s);
      tuftDummy.updateMatrix();
      tuftInst.setMatrixAt(idx, tuftDummy.matrix);
      tuftInst.setColorAt(idx, g.color);
    });
    tuftInst.instanceMatrix.needsUpdate = true;
    if (tuftInst.instanceColor) tuftInst.instanceColor.needsUpdate = true;
    tuftInst.computeBoundingSphere();
    worldGroup.add(tuftInst);

    // 10. Highland Sky Birds gliding above the loch
    const birds: HighlandBirdRig[] = [
      createHighlandBirdRig(-6, -20, 14, 13.5, 0.22, 0.2),
      createHighlandBirdRig(8, -24, 16, 14.8, 0.24, 2.0),
      createHighlandBirdRig(0, -18, 12, 16.0, 0.19, 4.1),
    ];
    birds.forEach((b) => scene.add(b.root));

    // 11. Interactive POI Beacons (Eilidh, Fiona, and 5 Cultural Landmarks)
    const clickableBeacons: THREE.Mesh[] = [];
    const hitGeo = new THREE.SphereGeometry(0.84, 10, 8);
    const hitMat = new THREE.MeshBasicMaterial({ visible: false });
    disposables.push(hitGeo, hitMat);

    const poiBeacons = new Map<
      ScotlandPoiId,
      { ring: THREE.Mesh; ringMat: THREE.MeshBasicMaterial; gem: THREE.Mesh; gemMat: THREE.MeshStandardMaterial }
    >();
    SCOTLAND_INTERACTIVE_TARGETS.forEach((poi) => {
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

      const gemGeo = new THREE.OctahedronGeometry(0.24, 0);
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

    // 12. Two Distinct Scottish NPCs: Eilidh MacLeod & Fiona Campbell
    const contactTex = createContactShadowTexture();
    const contactMat = new THREE.MeshBasicMaterial({
      map: contactTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.72,
    });
    const shadowPlaneGeo = new THREE.PlaneGeometry(0.98, 0.98);
    disposables.push(contactTex, contactMat, shadowPlaneGeo);

    const eilidhRig = createEilidhNpcRig(!isSoftwareGl, maxAnisotropy);
    eilidhRig.root.position.set(SCOTLAND_EILIDH_POS.x, 0, SCOTLAND_EILIDH_POS.z);
    eilidhRig.root.rotation.y = SCOTLAND_EILIDH_POS.idleYaw;
    scene.add(eilidhRig.root);

    const eilidhShadow = new THREE.Mesh(shadowPlaneGeo, contactMat);
    eilidhShadow.rotation.x = -Math.PI / 2;
    eilidhShadow.position.set(SCOTLAND_EILIDH_POS.x, 0.02, SCOTLAND_EILIDH_POS.z);
    scene.add(eilidhShadow);

    const fionaRig = createFionaNpcRig(!isSoftwareGl, maxAnisotropy);
    fionaRig.root.position.set(SCOTLAND_FIONA_POS.x, 0, SCOTLAND_FIONA_POS.z);
    fionaRig.root.rotation.y = SCOTLAND_FIONA_POS.idleYaw;
    scene.add(fionaRig.root);

    const fionaShadow = new THREE.Mesh(shadowPlaneGeo, contactMat);
    fionaShadow.rotation.x = -Math.PI / 2;
    fionaShadow.position.set(SCOTLAND_FIONA_POS.x, 0.02, SCOTLAND_FIONA_POS.z);
    scene.add(fionaShadow);

    // 13. Saved Player Avatar Rig from Phase 1A
    const playerRig = createProceduralAvatarRig(avatar, !isSoftwareGl);
    playerRigRef.current = playerRig;
    prevAvatarStructRef.current = `${avatar.modelId}:${avatar.hairStyle}:${avatar.outfitId}`;
    playerRig.root.position.set(SCOTLAND_SPAWN.x, 0, SCOTLAND_SPAWN.z);
    scene.add(playerRig.root);

    const playerShadow = new THREE.Mesh(shadowPlaneGeo, contactMat);
    playerShadow.rotation.x = -Math.PI / 2;
    playerShadow.position.set(SCOTLAND_SPAWN.x, 0.02, SCOTLAND_SPAWN.z);
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
          const hitId = hits[0].object.userData.poiId as ScotlandPoiId;
          const target = SCOTLAND_INTERACTIVE_TARGETS.find((t) => t.id === hitId);
          if (
            target &&
            (hitId === lastPoiReported ||
              Math.hypot(playerX - target.position.x, playerZ - target.position.z) <= target.interactionRadius + 1.2)
          ) {
            onActivatePoiRef.current?.(hitId);
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

    let playerX = SCOTLAND_SPAWN.x;
    let playerZ = SCOTLAND_SPAWN.z;
    let playerYaw = SCOTLAND_SPAWN.yaw;
    let walkPhase = 0;
    let speedNorm = 0;
    let nightMix = appearanceRef.current === 'night' ? 1 : 0;
    let lastPoiReported: ScotlandPoiId | null = null;
    let lastPosReportTime = 0;
    let activeAutoWalkId = 0;
    let lastCompletedAutoWalkId = 0;
    let autoWalkWaypointIdx = 0;
    let lastQuickTravelId = 0;
    let snapCameraNextFrame = false;
    let stuckTimer = 0;
    let stuckAnchorX = SCOTLAND_SPAWN.x;
    let stuckAnchorZ = SCOTLAND_SPAWN.z;

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
      scene.environmentIntensity = THREE.MathUtils.lerp(0.68, 0.36, nightMix);

      hemiLight.color.copy(DAY_HEMI_SKY).lerp(NIGHT_HEMI_SKY, nightMix);
      hemiLight.groundColor.copy(DAY_HEMI_GROUND).lerp(NIGHT_HEMI_GROUND, nightMix);
      hemiLight.intensity = THREE.MathUtils.lerp(1.15, 0.78, nightMix);

      keyLight.color.copy(DAY_KEY_COLOR).lerp(NIGHT_KEY_COLOR, nightMix);
      keyLight.intensity = THREE.MathUtils.lerp(2.15, 1.2, nightMix);
      _vecA.copy(DAY_KEY_POS).lerp(NIGHT_KEY_POS, nightMix);
      keyLight.position.copy(_vecA);

      cloudMat.color.copy(DAY_CLOUD_COLOR).lerp(NIGHT_CLOUD_COLOR, nightMix);
      cloudMat.opacity = THREE.MathUtils.lerp(0.9, 0.36, nightMix);
      starMat.opacity = nightMix * 0.9;
      moonMat.opacity = nightMix * 0.95;
      sunMat.opacity = (1 - nightMix) * 0.92;

      windowGlowMat.emissiveIntensity = THREE.MathUtils.lerp(0.22, 1.68, nightMix);
      const pLightVal = THREE.MathUtils.lerp(0.25, 5.0, nightMix);
      for (const pl of lanternLights) {
        pl.intensity = pLightVal;
      }

      // Quick Travel Instant Relocation (Collision-Safe)
      const pendingQt = quickTravelRef.current;
      if (pendingQt && pendingQt.requestId !== lastQuickTravelId) {
        lastQuickTravelId = pendingQt.requestId;
        if (autoWalkRef.current) lastCompletedAutoWalkId = autoWalkRef.current.requestId;
        activeAutoWalkId = 0;
        const safeQt = resolveScotlandCollision(
          pendingQt.arrivalPoint.x,
          pendingQt.arrivalPoint.z,
        );
        playerX = safeQt.x;
        playerZ = safeQt.z;
        playerYaw = pendingQt.facingYaw;
        snapCameraNextFrame = true;
        onPositionRef.current?.({ x: playerX, z: playerZ });
      }

      // 2. Player Movement (Keyboard + Joystick, overrides Auto-Walk)
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
        const resolved = resolveScotlandCollision(
          playerX + worldDirX * moveDist,
          playerZ + worldDirZ * moveDist,
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
            const snapped = resolveScotlandCollision(wp.x, wp.z);
            playerX = snapped.x;
            playerZ = snapped.z;
            autoWalkWaypointIdx += 1;

            if (autoWalkWaypointIdx >= aw.waypoints.length) {
              lastCompletedAutoWalkId = aw.requestId;
              activeAutoWalkId = 0;
              speedNorm = 0;
              const destTarget = SCOTLAND_INTERACTIVE_TARGETS.find((t) => t.id === aw.targetId);
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
            const resolved = resolveScotlandCollision(
              playerX + dirX * stepDist,
              playerZ + dirZ * stepDist,
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

      const playerY = getBridgeElevation(playerX, playerZ);
      playerRig.root.position.set(playerX, playerY, playerZ);
      playerRig.root.rotation.y = playerYaw;
      playerShadow.position.set(playerX, playerY + 0.02, playerZ);

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
        const waveT = (1.15 - interactTimerRef.current) * 8.0;
        if (!reduced) {
          parts.rightArm.rotation.z = -1.65 + Math.sin(waveT) * 0.28;
          parts.rightForearm.rotation.z = -0.45 + Math.cos(waveT) * 0.25;
        }
      } else {
        parts.rightArm.rotation.z += (-0.14 - parts.rightArm.rotation.z) * Math.min(1, dt * 8);
        parts.rightForearm.rotation.z += (0 - parts.rightForearm.rotation.z) * Math.min(1, dt * 8);
      }

      const blinkCycle = elapsed % 3.6;
      const blinkAmt = blinkCycle > 3.44 ? Math.sin(((blinkCycle - 3.44) / 0.16) * Math.PI) : 0;
      const lidRot = THREE.MathUtils.lerp(-Math.PI * 0.42, 0.12, blinkAmt);
      parts.leftEyelid.rotation.x = lidRot;
      parts.rightEyelid.rotation.x = lidRot;

      // 4. Nearest Interactive Target Check
      const nearestPoi = findNearestScotlandPoi(playerX, playerZ);
      const nearestId = nearestPoi?.id ?? null;
      if (nearestId !== lastPoiReported) {
        lastPoiReported = nearestId;
        onNearestPoiRef.current(nearestId);
      }
      if (elapsed - lastPosReportTime > 0.25) {
        lastPosReportTime = elapsed;
        onPositionRef.current?.({ x: playerX, z: playerZ });
      }

      // 5. Eilidh & Fiona Idle, Wave & Turn-to-Player Animations
      const animateScotlandNpc = (
        rig: ReturnType<typeof createEilidhNpcRig>,
        pos: { x: number; z: number; idleYaw: number },
        npcId: ScotlandNpcId,
        phaseShift: number,
      ) => {
        const dist = Math.hypot(playerX - pos.x, playerZ - pos.z);
        const shouldFacePlayer = dist < 3.6 || activeNpcRef.current === npcId;
        const targetYaw = shouldFacePlayer
          ? Math.atan2(playerX - pos.x, playerZ - pos.z)
          : pos.idleYaw;
        rig.root.rotation.y +=
          shortestAngleDiff(rig.root.rotation.y, targetYaw) *
          (reduced ? 1 : Math.min(1, dt * 5.0));

        if (!reduced) {
          rig.torso.position.y = 0.03 + Math.sin(elapsed * 1.9 + phaseShift) * 0.012;
          rig.head.rotation.y = shouldFacePlayer ? 0 : Math.sin(elapsed * 0.8 + phaseShift) * 0.15;
          rig.propPivot.rotation.x = Math.sin(elapsed * 1.6 + phaseShift) * 0.05;
          if (activeNpcRef.current === npcId || (dist < 3.5 && dist > 1.0)) {
            rig.rightArm.rotation.z = -1.42 + Math.sin(elapsed * 4.5 + phaseShift) * 0.22;
            rig.rightArm.rotation.x = -0.34;
          } else {
            rig.rightArm.rotation.z += (-0.15 - rig.rightArm.rotation.z) * Math.min(1, dt * 6);
            rig.rightArm.rotation.x += (0 - rig.rightArm.rotation.x) * Math.min(1, dt * 6);
          }
        }
        const npcBlink = (elapsed + phaseShift) % 3.9;
        const npcBlinkAmt = npcBlink > 3.74 ? Math.sin(((npcBlink - 3.74) / 0.16) * Math.PI) : 0;
        const npcLidRot = THREE.MathUtils.lerp(-Math.PI * 0.42, 0.12, npcBlinkAmt);
        rig.leftEyelid.rotation.x = npcLidRot;
        rig.rightEyelid.rotation.x = npcLidRot;
      };

      animateScotlandNpc(eilidhRig, SCOTLAND_EILIDH_POS, 'npc_eilidh', 0.7);
      animateScotlandNpc(fionaRig, SCOTLAND_FIONA_POS, 'npc_fiona', 2.2);

      // 6. Animate POI Beacons, Clouds, Breeze Sway & Birds
      SCOTLAND_INTERACTIVE_TARGETS.forEach((poi, idx) => {
        const b = poiBeacons.get(poi.id);
        if (!b) return;
        const isVisited = visitedRef.current.has(poi.id);
        const isNear = poi.id === nearestId;
        const isGuided = poi.id === guidedPoiRef.current;

        _colorA.set(isGuided ? '#F2C66D' : isVisited ? '#2ED6A3' : poi.accentColor);
        b.ringMat.color.copy(_colorA);
        b.gemMat.color.copy(_colorA);
        b.gemMat.emissive.copy(_colorA);
        b.gemMat.emissiveIntensity = isGuided ? 1.45 : isNear ? 1.18 : isVisited ? 0.35 : 0.62;
        b.ringMat.opacity = isGuided ? 0.98 : isNear ? 0.95 : isVisited ? 0.46 : 0.74;

        if (!reduced) {
          const baseY = poi.kind === 'npc' ? 2.2 : 1.72;
          b.gem.position.y = baseY + Math.sin(elapsed * (isGuided ? 3.4 : 2.4) + idx) * (isGuided ? 0.24 : 0.14);
          b.gem.rotation.y += dt * (isGuided ? 3.2 : isNear ? 2.4 : 1.2);
          b.gem.scale.setScalar(isGuided ? 1.32 : isVisited ? 0.76 : isNear ? 1.18 : 1.0);
          const rScale = isGuided
            ? 1.38 + Math.sin(elapsed * 4.8) * 0.16
            : isNear
              ? 1.14 + Math.sin(elapsed * 5) * 0.06
              : 1.0;
          b.ring.scale.setScalar(rScale);
        } else {
          b.gem.scale.setScalar(isGuided ? 1.28 : isVisited ? 0.76 : 1.0);
          b.ring.scale.setScalar(isGuided ? 1.32 : 1.0);
        }
      });

      if (!reduced) {
        for (const c of clouds) {
          c.group.position.x =
            ((c.baseX + elapsed * c.speed + c.range) % (c.range * 2)) - c.range;
        }

        // Subtle loch & burn shimmer
        lochMesh.position.y = 0.02 + Math.sin(elapsed * 1.4) * 0.008;
        burnMeshSouth.position.y = 0.015 + Math.sin(elapsed * 2.4) * 0.004;
        burnMeshNorth.position.y = 0.015 + Math.cos(elapsed * 2.4) * 0.004;

        // Fluttering Highland Games pennants
        pennantBanners.forEach((p, idx) => {
          p.rotation.z = Math.sin(elapsed * 3.8 + idx * 0.9) * 0.16;
        });

        // Highland Pine & Rowan canopy breeze sway
        trees.forEach((t, idx) => {
          t.crownGroup.rotation.z = Math.sin(elapsed * 1.25 + idx * 0.8) * 0.026;
        });

        // Distant Highland birds gliding across the loch
        for (const bird of birds) {
          bird.root.visible = nightMix < 0.75;
          const ang = elapsed * bird.speed + bird.phase;
          bird.root.position.set(
            bird.centerX + Math.cos(ang) * bird.radius,
            bird.altitude + Math.sin(ang * 2) * 0.4,
            bird.centerZ + Math.sin(ang) * bird.radius,
          );
          bird.root.rotation.y = -ang;
          const flap = Math.sin(elapsed * 4.8 + bird.phase) * 0.32;
          bird.leftWing.rotation.z = flap;
          bird.rightWing.rotation.z = -flap;
        }

        // Swaying meadow grass & heather tufts
        tuftSeeds.forEach((g, idx) => {
          tuftDummy.position.set(g.x, 0, g.z);
          tuftDummy.rotation.set(
            Math.sin(elapsed * 1.9 + g.phase) * 0.09,
            g.rotY,
            Math.cos(elapsed * 1.6 + g.phase) * 0.07,
          );
          tuftDummy.scale.set(g.s, g.s, g.s);
          tuftDummy.updateMatrix();
          tuftInst.setMatrixAt(idx, tuftDummy.matrix);
        });
        tuftInst.instanceMatrix.needsUpdate = true;
      }

      // 7. Third-Person Follow Camera with Safe Highland Bounds
      const desiredCamX = THREE.MathUtils.clamp(
        playerX + Math.sin(camYaw) * Math.cos(camPitch) * camDist,
        SCOTLAND_BOUNDS.minX - 2.5,
        SCOTLAND_BOUNDS.maxX + 2.5,
      );
      const desiredCamZ = THREE.MathUtils.clamp(
        playerZ + Math.cos(camYaw) * Math.cos(camPitch) * camDist,
        SCOTLAND_BOUNDS.minZ - 2.5,
        SCOTLAND_BOUNDS.maxZ + 3.2,
      );
      const desiredCamY = Math.max(0.95, playerY + 1.3 + Math.sin(camPitch) * camDist);

      if (snapCameraNextFrame || reduced) {
        camPos.set(desiredCamX, desiredCamY, desiredCamZ);
        snapCameraNextFrame = false;
      } else {
        const camFollowAlpha = Math.min(1, dt * 8.5);
        camPos.x += (desiredCamX - camPos.x) * camFollowAlpha;
        camPos.y += (desiredCamY - camPos.y) * camFollowAlpha;
        camPos.z += (desiredCamZ - camPos.z) * camFollowAlpha;
      }

      camLookTarget.set(playerX, playerY + 1.32, playerZ);
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
      eilidhRig.dispose();
      fionaRig.dispose();
      trees.forEach((t) => t.dispose());
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
      aria-label="Scotland Highland Heroes 3D Exploration"
    />
  );
}
