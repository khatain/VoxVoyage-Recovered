import { useEffect, useRef, type MutableRefObject } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import type { AvatarConfig, ResolvedAppearance } from '../../types/game';
import {
  JAIPUR_BOUNDS,
  JAIPUR_INTERACTIVE_TARGETS,
  JAIPUR_SPAWN,
  type JaipurPoiId,
} from '../../data/jaipurWorld';
import {
  findNearestInteractivePoi,
  resolveJaipurCollision,
} from '../../utils/jaipurCollision';
import {
  createProceduralAvatarRig,
  disposeObjectGeometries,
} from '../avatar/proceduralAvatarRig';
import type { JoystickVector } from './VirtualJoystick';
import type {
  ActiveAutoWalkRequest,
  ActiveQuickTravelRequest,
} from '../../utils/worldNavigation';

export interface JaipurSceneProps {
  avatar: AvatarConfig;
  appearance: ResolvedAppearance;
  reducedMotion: boolean;
  cameraSensitivity: number;
  paused: boolean;
  exploredPoiIds: JaipurPoiId[];
  guidedPoiId?: JaipurPoiId | null;
  activeDialogueOpen: boolean;
  interactGestureSeq: number;
  celebrationSeq: number;
  joystickRef: MutableRefObject<JoystickVector>;
  autoWalkRequest?: ActiveAutoWalkRequest | null;
  quickTravelRequest?: ActiveQuickTravelRequest | null;
  onAutoWalkComplete?: (result: { targetId: string; status: 'arrived' | 'unreachable' }) => void;
  onManualInterrupt?: () => void;
  onNearestPoiChange: (poiId: JaipurPoiId | null) => void;
  onActivatePoi?: (poiId: JaipurPoiId) => void;
  onPlayerPositionChange?: (pos: { x: number; z: number }) => void;
  onWebGLFailure: () => void;
}

const _colorA = new THREE.Color();
const _colorB = new THREE.Color();
const _vecA = new THREE.Vector3();

const DAY_SKY_TOP = new THREE.Color('#278CD6');
const DAY_SKY_BOTTOM = new THREE.Color('#CBEAF9');
const NIGHT_SKY_TOP = new THREE.Color('#090E26');
const NIGHT_SKY_BOTTOM = new THREE.Color('#2A1E52');

const DAY_FOG = new THREE.Color('#B5E2FA');
const NIGHT_FOG = new THREE.Color('#18193D');

const DAY_HEMI_SKY = new THREE.Color('#E3F6FF');
const NIGHT_HEMI_SKY = new THREE.Color('#5A79C8');
const DAY_HEMI_GROUND = new THREE.Color('#C97B63');
const NIGHT_HEMI_GROUND = new THREE.Color('#241B36');

const DAY_KEY_COLOR = new THREE.Color('#FFF1D6');
const NIGHT_KEY_COLOR = new THREE.Color('#A7C6FF');
const DAY_KEY_POS = new THREE.Vector3(14, 21, 13);
const NIGHT_KEY_POS = new THREE.Vector3(-12, 18, 12);

const DAY_CLOUD_COLOR = new THREE.Color('#FFFFFF');
const NIGHT_CLOUD_COLOR = new THREE.Color('#47578C');

const WALK_SPEED = 4.4;

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
    grad.addColorStop(0, 'rgba(20, 24, 42, 0.45)');
    grad.addColorStop(0.55, 'rgba(20, 24, 42, 0.2)');
    grad.addColorStop(1, 'rgba(20, 24, 42, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createJaipurFlagstoneTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#E8BE9E';
    ctx.fillRect(0, 0, 512, 512);

    const tileW = 64;
    const tileH = 64;
    const tones = ['#ECC4A5', '#E3B492', '#DDA884', '#F0CBB0', '#E6B997'];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const offset = (row % 2) * (tileW * 0.5);
        const x = (col * tileW + offset) % 512;
        const y = row * tileH;
        const tone = tones[(row * 5 + col * 3) % tones.length];
        ctx.fillStyle = tone;
        ctx.fillRect(x, y, tileW - 3, tileH - 3);
        if (x + tileW > 512) {
          ctx.fillRect(x - 512, y, tileW - 3, tileH - 3);
        }
        // Subtle sandstone grain specks
        ctx.fillStyle = 'rgba(130, 74, 52, 0.08)';
        ctx.fillRect(x + 12, y + 16, 4, 4);
        ctx.fillRect(x + 36, y + 40, 3, 3);
      }
    }

    ctx.strokeStyle = 'rgba(160, 96, 68, 0.35)';
    ctx.lineWidth = 2;
    for (let y = 0; y <= 512; y += tileH) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(512, y);
      ctx.stroke();
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(7, 7);
  tex.anisotropy = Math.min(8, maxAnisotropy);
  tex.needsUpdate = true;
  return tex;
}

function createStripedAwningTexture(colorA: string, colorB: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const stripeCount = 8;
    const w = 256 / stripeCount;
    for (let i = 0; i < stripeCount; i++) {
      ctx.fillStyle = i % 2 === 0 ? colorA : colorB;
      ctx.fillRect(i * w, 0, w + 1, 128);
    }
    ctx.fillStyle = 'rgba(255, 255, 255, 0.16)';
    ctx.fillRect(0, 108, 256, 20);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

function createCloudCluster(material: THREE.Material): THREE.Group {
  const cloud = new THREE.Group();
  const puffs: [number, number, number, number][] = [
    [0, 0, 0, 1.3],
    [-1.1, -0.14, 0.15, 0.92],
    [1.12, -0.12, -0.12, 0.96],
    [0.24, 0.44, 0.08, 0.78],
  ];
  const geo = new THREE.SphereGeometry(1, 12, 9);
  puffs.forEach(([px, py, pz, s]) => {
    const m = new THREE.Mesh(geo, material);
    m.position.set(px, py, pz);
    m.scale.set(s * 1.3, s * 0.78, s * 0.92);
    cloud.add(m);
  });
  return cloud;
}

interface NpcAaravRig {
  root: THREE.Group;
  torso: THREE.Group;
  head: THREE.Group;
  rightArm: THREE.Group;
  leftArm: THREE.Group;
  leftEyelid: THREE.Mesh;
  rightEyelid: THREE.Mesh;
  dispose: () => void;
}

function createAaravNpcRig(castShadow: boolean): NpcAaravRig {
  const root = new THREE.Group();

  const skinMat = new THREE.MeshStandardMaterial({ color: '#C6865A', roughness: 0.64, metalness: 0.02 });
  const hairMat = new THREE.MeshStandardMaterial({ color: '#1F1B1D', roughness: 0.55, metalness: 0.05 });
  const kurtaMat = new THREE.MeshStandardMaterial({ color: '#FAF0DC', roughness: 0.8, metalness: 0.02 });
  const vestMat = new THREE.MeshStandardMaterial({ color: '#D9644A', roughness: 0.72, metalness: 0.04 });
  const sashMat = new THREE.MeshStandardMaterial({ color: '#F2C66D', roughness: 0.4, metalness: 0.35 });
  const pantMat = new THREE.MeshStandardMaterial({ color: '#27344B', roughness: 0.82, metalness: 0.02 });
  const shoeMat = new THREE.MeshStandardMaterial({ color: '#5A3825', roughness: 0.58, metalness: 0.06 });
  const scleraMat = new THREE.MeshStandardMaterial({ color: '#FFFFFF', roughness: 0.2, metalness: 0 });
  const irisMat = new THREE.MeshStandardMaterial({ color: '#1B1822', roughness: 0.2, metalness: 0.04 });
  const mouthMat = new THREE.MeshStandardMaterial({ color: '#783B2E', roughness: 0.55, metalness: 0 });

  const hips = new THREE.Group();
  hips.position.set(0, 0.64, 0);
  root.add(hips);

  // Legs
  [-1, 1].forEach((side) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.065, 0.52, 12), pantMat);
    leg.position.set(side * 0.095, -0.30, 0);
    leg.castShadow = castShadow;
    hips.add(leg);

    const shoe = new THREE.Mesh(new THREE.SphereGeometry(0.082, 12, 9), shoeMat);
    shoe.scale.set(0.95, 0.62, 1.35);
    shoe.position.set(side * 0.095, -0.59, 0.035);
    shoe.castShadow = castShadow;
    hips.add(shoe);
  });

  const torso = new THREE.Group();
  torso.position.set(0, 0.03, 0);
  hips.add(torso);

  // Kurta tunic + Nehru vest
  const tunic = new THREE.Mesh(new THREE.CylinderGeometry(0.20, 0.195, 0.56, 18), kurtaMat);
  tunic.scale.set(1.02, 1, 0.82);
  tunic.position.set(0, 0.24, 0);
  tunic.castShadow = castShadow;
  torso.add(tunic);

  const vest = new THREE.Mesh(new THREE.CylinderGeometry(0.208, 0.184, 0.44, 18), vestMat);
  vest.scale.set(1.03, 1, 0.85);
  vest.position.set(0, 0.30, 0);
  vest.castShadow = castShadow;
  torso.add(vest);

  // Saffron/Gold Heritage Guide Sash across chest
  const sash = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.46, 0.34), sashMat);
  sash.position.set(-0.02, 0.30, 0.01);
  sash.rotation.z = -0.34;
  torso.add(sash);

  // Collar + Buttons
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.12, 0.06, 16), vestMat);
  collar.position.set(0, 0.535, 0);
  torso.add(collar);

  for (let i = 0; i < 3; i++) {
    const btn = new THREE.Mesh(new THREE.SphereGeometry(0.014, 8, 6), sashMat);
    btn.position.set(0, 0.43 - i * 0.10, 0.172);
    torso.add(btn);
  }

  // Arms
  const buildArm = (side: -1 | 1) => {
    const pivot = new THREE.Group();
    pivot.position.set(side * 0.245, 0.46, 0);
    pivot.rotation.z = side * -0.15;
    torso.add(pivot);

    const sleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.052, 0.23, 12), kurtaMat);
    sleeve.position.set(0, -0.11, 0);
    sleeve.castShadow = castShadow;
    pivot.add(sleeve);

    const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.04, 0.17, 10), skinMat);
    forearm.position.set(0, -0.28, 0);
    forearm.castShadow = castShadow;
    pivot.add(forearm);

    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.054, 10, 8), skinMat);
    hand.position.set(0, -0.38, 0);
    pivot.add(hand);
    return pivot;
  };

  const leftArm = buildArm(-1);
  const rightArm = buildArm(1);

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.076, 0.10, 12), skinMat);
  neck.position.set(0, 0.56, 0);
  torso.add(neck);

  const head = new THREE.Group();
  head.position.set(0, 0.62, 0);
  torso.add(head);

  const cranium = new THREE.Mesh(new THREE.SphereGeometry(0.24, 22, 16), skinMat);
  cranium.scale.set(0.98, 1.04, 0.96);
  cranium.position.set(0, 0.22, 0);
  cranium.castShadow = castShadow;
  head.add(cranium);

  // Ears & Nose
  [-1, 1].forEach((side) => {
    const ear = new THREE.Mesh(new THREE.SphereGeometry(0.048, 10, 8), skinMat);
    ear.position.set(side * 0.228, 0.21, 0);
    ear.scale.set(0.65, 1, 0.75);
    head.add(ear);
  });
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.026, 8, 8), skinMat);
  nose.position.set(0, 0.195, 0.235);
  head.add(nose);

  // Hair cap + swept front wave
  const hairCap = new THREE.Mesh(
    new THREE.SphereGeometry(0.255, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.58),
    hairMat,
  );
  hairCap.position.set(0, 0.235, -0.015);
  hairCap.rotation.x = -0.25;
  hairCap.castShadow = castShadow;
  head.add(hairCap);

  const hairWave = new THREE.Mesh(new THREE.SphereGeometry(0.14, 14, 10), hairMat);
  hairWave.scale.set(1.35, 0.65, 0.85);
  hairWave.position.set(-0.02, 0.42, 0.11);
  hairWave.rotation.set(0.25, 0, 0.15);
  head.add(hairWave);

  // Eyes + Eyelids + Friendly Brows + Smile
  const buildEye = (side: -1 | 1) => {
    const ex = side * 0.084;
    const ey = 0.232;
    const ez = 0.205;
    const sclera = new THREE.Mesh(new THREE.SphereGeometry(0.036, 12, 10), scleraMat);
    sclera.scale.set(0.95, 1.08, 0.65);
    sclera.position.set(ex, ey, ez);
    head.add(sclera);

    const iris = new THREE.Mesh(new THREE.SphereGeometry(0.022, 10, 8), irisMat);
    iris.scale.set(1, 1.08, 0.55);
    iris.position.set(ex, ey, ez + 0.016);
    head.add(iris);

    const eyelid = new THREE.Mesh(
      new THREE.SphereGeometry(0.039, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.54),
      skinMat,
    );
    eyelid.scale.set(1, 1.1, 0.72);
    eyelid.position.set(ex, ey, ez + 0.002);
    eyelid.rotation.x = -Math.PI * 0.42;
    head.add(eyelid);

    const brow = new THREE.Mesh(new THREE.CapsuleGeometry(0.011, 0.048, 6, 8), hairMat);
    brow.position.set(ex, ey + 0.066, ez + 0.015);
    brow.rotation.z = Math.PI / 2 + side * 0.05;
    head.add(brow);
    return eyelid;
  };

  const leftEyelid = buildEye(-1);
  const rightEyelid = buildEye(1);

  const smile = new THREE.Mesh(
    new THREE.TorusGeometry(0.045, 0.009, 8, 16, Math.PI * 0.78),
    mouthMat,
  );
  smile.position.set(0, 0.14, 0.222);
  smile.rotation.z = -Math.PI * 0.89;
  head.add(smile);

  return {
    root,
    torso,
    head,
    rightArm,
    leftArm,
    leftEyelid,
    rightEyelid,
    dispose: () => {
      disposeObjectGeometries(root);
      [
        skinMat,
        hairMat,
        kurtaMat,
        vestMat,
        sashMat,
        pantMat,
        shoeMat,
        scleraMat,
        irisMat,
        mouthMat,
      ].forEach((m) => m.dispose());
    },
  };
}

export default function JaipurExplorationScene({
  avatar,
  appearance,
  reducedMotion,
  cameraSensitivity,
  paused,
  exploredPoiIds,
  guidedPoiId = null,
  activeDialogueOpen,
  interactGestureSeq,
  celebrationSeq,
  joystickRef,
  autoWalkRequest = null,
  quickTravelRequest = null,
  onAutoWalkComplete,
  onManualInterrupt,
  onNearestPoiChange,
  onActivatePoi,
  onPlayerPositionChange,
  onWebGLFailure,
}: JaipurSceneProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const appearanceRef = useRef(appearance);
  appearanceRef.current = appearance;
  const reducedMotionRef = useRef(reducedMotion);
  reducedMotionRef.current = reducedMotion;
  const sensitivityRef = useRef(cameraSensitivity);
  sensitivityRef.current = cameraSensitivity;
  const pausedRef = useRef(paused);
  pausedRef.current = paused;
  const exploredRef = useRef<Set<JaipurPoiId>>(new Set(exploredPoiIds));
  exploredRef.current = new Set(exploredPoiIds);
  const guidedPoiRef = useRef<JaipurPoiId | null>(guidedPoiId);
  guidedPoiRef.current = guidedPoiId;
  const dialogueOpenRef = useRef(activeDialogueOpen);
  dialogueOpenRef.current = activeDialogueOpen;
  const autoWalkRef = useRef<ActiveAutoWalkRequest | null>(autoWalkRequest);
  autoWalkRef.current = autoWalkRequest;
  const quickTravelRef = useRef<ActiveQuickTravelRequest | null>(quickTravelRequest);
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

  // Sync saved Phase 1A avatar config dynamically without recreating the scene
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
    renderer.toneMappingExposure = 1.08;
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
      0.011,
    );

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTarget = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;
    scene.environmentIntensity = appearanceRef.current === 'night' ? 0.34 : 0.65;

    const camera = new THREE.PerspectiveCamera(48, width / height, 0.25, 160);

    // Track disposable textures/materials/geometries created for Jaipur world
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
          float h = clamp((normalize(vWorldPos).y + 0.08) / 0.88, 0.0, 1.0);
          gl_FragColor = vec4(mix(uBottom, uTop, smoothstep(0.0, 1.0, h)), 1.0);
        }
      `,
    });
    const skyDome = new THREE.Mesh(new THREE.SphereGeometry(95, 24, 16), skyMat);
    scene.add(skyDome);
    disposables.push(skyMat, skyDome.geometry);

    // Night Stars + Moon
    const starCount = 260;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(0.15 + Math.random() * 0.85);
      const r = 74;
      starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = r * Math.cos(phi);
      starPositions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: '#FFF4D6',
      size: 0.48,
      transparent: true,
      opacity: appearanceRef.current === 'night' ? 0.85 : 0,
      depthWrite: false,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);
    disposables.push(starGeo, starMat);

    const moonMat = new THREE.MeshBasicMaterial({
      color: '#FFF3CC',
      transparent: true,
      opacity: appearanceRef.current === 'night' ? 0.95 : 0,
    });
    const moon = new THREE.Mesh(new THREE.SphereGeometry(2.6, 18, 14), moonMat);
    moon.position.set(-28, 32, -48);
    scene.add(moon);
    disposables.push(moon.geometry, moonMat);

    // Drifting Clouds
    const cloudMat = new THREE.MeshStandardMaterial({
      color: appearanceRef.current === 'night' ? NIGHT_CLOUD_COLOR : DAY_CLOUD_COLOR,
      roughness: 0.95,
      metalness: 0,
      transparent: true,
      opacity: appearanceRef.current === 'night' ? 0.38 : 0.92,
    });
    disposables.push(cloudMat);
    const clouds: { group: THREE.Group; baseX: number; speed: number; range: number }[] = [];
    for (let i = 0; i < 6; i++) {
      const c = createCloudCluster(cloudMat);
      const bx = -28 + i * 11;
      c.position.set(bx, 18 + (i % 3) * 2.5, -24 - (i % 2) * 14);
      const s = 1.1 + (i % 3) * 0.35;
      c.scale.setScalar(s);
      scene.add(c);
      clouds.push({ group: c, baseX: bx, speed: 0.35 + (i % 3) * 0.14, range: 36 });
    }

    // Lights
    const hemiLight = new THREE.HemisphereLight(
      appearanceRef.current === 'night' ? NIGHT_HEMI_SKY : DAY_HEMI_SKY,
      appearanceRef.current === 'night' ? NIGHT_HEMI_GROUND : DAY_HEMI_GROUND,
      appearanceRef.current === 'night' ? 0.72 : 1.05,
    );
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(
      appearanceRef.current === 'night' ? NIGHT_KEY_COLOR : DAY_KEY_COLOR,
      appearanceRef.current === 'night' ? 1.1 : 2.15,
    );
    keyLight.position.copy(appearanceRef.current === 'night' ? NIGHT_KEY_POS : DAY_KEY_POS);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      keyLight.shadow.camera.near = 2;
      keyLight.shadow.camera.far = 55;
      keyLight.shadow.camera.left = -18;
      keyLight.shadow.camera.right = 18;
      keyLight.shadow.camera.top = 18;
      keyLight.shadow.camera.bottom = -18;
      keyLight.shadow.bias = -0.0007;
    }
    scene.add(keyLight);

    // Warm Courtyard Lantern PointLights (turn on gently at night)
    const lanternLights: THREE.PointLight[] = [];
    const lanternPositions: [number, number, number][] = [
      [-6.5, 2.75, -0.2],
      [6.4, 2.75, -0.8],
      [-2.8, 3.0, -7.8],
      [2.8, 3.0, -7.8],
    ];
    lanternPositions.forEach(([lx, ly, lz]) => {
      const pLight = new THREE.PointLight('#FFB357', appearanceRef.current === 'night' ? 4.8 : 0.25, 11, 1.6);
      pLight.position.set(lx, ly, lz);
      scene.add(pLight);
      lanternLights.push(pLight);
    });

    // Shared World Materials (Jaipur Pink City Palette)
    const flagstoneTex = createJaipurFlagstoneTexture(maxAnisotropy);
    disposables.push(flagstoneTex);

    const plazaMat = new THREE.MeshStandardMaterial({
      map: flagstoneTex,
      roughness: 0.85,
      metalness: 0.03,
    });
    const outerGardenMat = new THREE.MeshStandardMaterial({ color: '#8DB86A', roughness: 0.92, metalness: 0 });
    const pinkSandstoneMat = new THREE.MeshStandardMaterial({ color: '#E38A78', roughness: 0.78, metalness: 0.02 });
    const coralWallMat = new THREE.MeshStandardMaterial({ color: '#D36D5A', roughness: 0.8, metalness: 0.02 });
    const creamTrimMat = new THREE.MeshStandardMaterial({ color: '#FAF0DE', roughness: 0.68, metalness: 0.03 });
    const sandstoneDarkMat = new THREE.MeshStandardMaterial({ color: '#B45646', roughness: 0.82, metalness: 0.02 });
    const brassMat = new THREE.MeshStandardMaterial({ color: '#F2C66D', roughness: 0.26, metalness: 0.82 });
    const woodMat = new THREE.MeshStandardMaterial({ color: '#7D4F35', roughness: 0.78, metalness: 0.04 });
    const waterMat = new THREE.MeshStandardMaterial({
      color: '#34C6BE',
      roughness: 0.14,
      metalness: 0.15,
      emissive: '#136068',
      emissiveIntensity: 0.22,
    });
    const lanternGlowMat = new THREE.MeshStandardMaterial({
      color: '#FFE6A8',
      emissive: '#FF9E3D',
      emissiveIntensity: appearanceRef.current === 'night' ? 1.8 : 0.25,
      roughness: 0.3,
    });
    const potMat = new THREE.MeshStandardMaterial({ color: '#B55B3D', roughness: 0.76, metalness: 0.02 });
    const bluePotMat = new THREE.MeshStandardMaterial({ color: '#2972B6', roughness: 0.35, metalness: 0.08 });
    const trunkMat = new THREE.MeshStandardMaterial({ color: '#7A543E', roughness: 0.88, metalness: 0 });
    const leafMat = new THREE.MeshStandardMaterial({ color: '#4E9B47', roughness: 0.72, metalness: 0.02 });

    disposables.push(
      plazaMat,
      outerGardenMat,
      pinkSandstoneMat,
      coralWallMat,
      creamTrimMat,
      sandstoneDarkMat,
      brassMat,
      woodMat,
      waterMat,
      lanternGlowMat,
      potMat,
      bluePotMat,
      trunkMat,
      leafMat,
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

    // 1. Plaza Floor + Outer Garden Apron
    addWorldMesh(new THREE.BoxGeometry(25.2, 0.4, 23.6), plazaMat, [0, -0.2, 0.2], [0, 0, 0], [1, 1, 1], true, false);
    addWorldMesh(new THREE.CylinderGeometry(36, 36, 0.3, 32), outerGardenMat, [0, -0.4, 0], [0, 0, 0], [1, 1, 1], true, false);

    // Decorative courtyard mandala border around center
    addWorldMesh(new THREE.RingGeometry(2.6, 3.1, 8), creamTrimMat, [0, 0.015, -0.6], [-Math.PI / 2, 0, Math.PI / 8], [1, 1, 1], true, false);
    addWorldMesh(new THREE.RingGeometry(4.1, 4.35, 8), coralWallMat, [0, 0.014, -0.6], [-Math.PI / 2, 0, Math.PI / 8], [1, 1, 1], true, false);

    // 2. Central Lotus Fountain ((0, -0.6), r = 1.95)
    addWorldMesh(new THREE.CylinderGeometry(1.88, 1.95, 0.48, 8), pinkSandstoneMat, [0, 0.24, -0.6]);
    addWorldMesh(new THREE.CylinderGeometry(1.66, 1.66, 0.50, 8), sandstoneDarkMat, [0, 0.245, -0.6]);
    addWorldMesh(new THREE.CylinderGeometry(1.58, 1.58, 0.06, 24), waterMat, [0, 0.41, -0.6], [0, 0, 0], [1, 1, 1], true, false);
    // Tiered lotus pillar
    addWorldMesh(new THREE.CylinderGeometry(0.32, 0.45, 0.95, 10), pinkSandstoneMat, [0, 0.72, -0.6]);
    addWorldMesh(new THREE.CylinderGeometry(0.75, 0.25, 0.22, 10), creamTrimMat, [0, 1.18, -0.6]);
    addWorldMesh(new THREE.CylinderGeometry(0.18, 0.24, 0.58, 10), pinkSandstoneMat, [0, 1.48, -0.6]);
    addWorldMesh(new THREE.ConeGeometry(0.24, 0.34, 8), brassMat, [0, 1.88, -0.6]);

    // Animated fountain droplets
    const dropletCount = 10;
    const droplets: { mesh: THREE.Mesh; phase: number; angle: number }[] = [];
    const dropletGeo = new THREE.SphereGeometry(0.055, 8, 6);
    for (let i = 0; i < dropletCount; i++) {
      const m = new THREE.Mesh(dropletGeo, waterMat);
      worldGroup.add(m);
      droplets.push({ mesh: m, phase: i / dropletCount, angle: (i * Math.PI * 2) / dropletCount });
    }

    // 3. North Grand Pink Palace & Heritage Archway (z <= -9.3, POI at (0, -7.4))
    // Flanking palace wings
    addWorldMesh(new THREE.BoxGeometry(8.8, 4.9, 3.0), pinkSandstoneMat, [-8.1, 2.45, -10.8]);
    addWorldMesh(new THREE.BoxGeometry(8.8, 4.9, 3.0), pinkSandstoneMat, [8.1, 2.45, -10.8]);
    // White trim bands
    addWorldMesh(new THREE.BoxGeometry(25.2, 0.22, 3.12), creamTrimMat, [0, 4.95, -10.8]);
    addWorldMesh(new THREE.BoxGeometry(8.8, 0.14, 3.08), creamTrimMat, [-8.1, 2.6, -10.8]);
    addWorldMesh(new THREE.BoxGeometry(8.8, 0.14, 3.08), creamTrimMat, [8.1, 2.6, -10.8]);

    // Central Grand Archway Tower
    addWorldMesh(new THREE.BoxGeometry(3.1, 6.2, 3.1), coralWallMat, [-2.4, 3.1, -10.8]);
    addWorldMesh(new THREE.BoxGeometry(3.1, 6.2, 3.1), coralWallMat, [2.4, 3.1, -10.8]);
    addWorldMesh(new THREE.BoxGeometry(4.6, 2.4, 3.1), pinkSandstoneMat, [0, 5.2, -10.8]);
    addWorldMesh(new THREE.BoxGeometry(5.6, 0.26, 3.24), creamTrimMat, [0, 6.42, -10.8]);
    // Scalloped arch crown + inner warm portal
    addWorldMesh(new THREE.TorusGeometry(1.45, 0.28, 10, 20, Math.PI), creamTrimMat, [0, 2.8, -9.28]);
    addWorldMesh(new THREE.BoxGeometry(2.6, 3.4, 0.25), sandstoneDarkMat, [0, 1.7, -10.2], [0, 0, 0], [1, 1, 1], true, false);
    addWorldMesh(new THREE.BoxGeometry(2.2, 3.1, 0.26), woodMat, [0, 1.55, -10.05]);

    // Iconic Jharokha overhanging balconies on wings & rooftop Chhatri cupolas
    [-7.8, -4.8, 4.8, 7.8].forEach((jx) => {
      addWorldMesh(new THREE.BoxGeometry(1.65, 1.45, 0.85), creamTrimMat, [jx, 3.35, -9.15]);
      addWorldMesh(new THREE.ConeGeometry(1.05, 0.85, 6), coralWallMat, [jx, 4.4, -9.15]);
      addWorldMesh(new THREE.BoxGeometry(1.15, 0.9, 0.14), sandstoneDarkMat, [jx, 3.3, -8.7]);
    });

    // Rooftop Chhatri domes along palace skyline
    [-9.5, -2.5, 0, 2.5, 9.5].forEach((dx, idx) => {
      const baseH = idx >= 1 && idx <= 3 ? 6.55 : 5.06;
      const rScale = idx === 2 ? 1.25 : 0.85;
      addWorldMesh(new THREE.CylinderGeometry(0.95 * rScale, 1.05 * rScale, 0.85, 8), creamTrimMat, [dx, baseH + 0.42, -10.4]);
      addWorldMesh(new THREE.SphereGeometry(1.02 * rScale, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.58), pinkSandstoneMat, [dx, baseH + 0.82, -10.4]);
      addWorldMesh(new THREE.ConeGeometry(0.18 * rScale, 0.52 * rScale, 8), brassMat, [dx, baseH + 1.85 * rScale, -10.4]);
    });

    // Ornate Pink City Palace Crest Relief on East Wing (frames the Palace vocabulary object)
    addWorldMesh(new THREE.BoxGeometry(2.1, 2.6, 0.25), creamTrimMat, [7.6, 1.3, -9.18]);
    addWorldMesh(new THREE.BoxGeometry(1.6, 2.1, 0.26), coralWallMat, [7.6, 1.15, -9.08]);
    addWorldMesh(new THREE.ConeGeometry(0.32, 0.52, 8), brassMat, [7.6, 2.86, -9.15]);

    // 4. West Jaipur Market Stalls (matching JAIPUR_BOX_OBSTACLES: north z=-3.9, center z=0.1, south z=4.1)
    const stallConfigs: { z: number; cA: string; cB: string; kind: 'spices' | 'textiles' | 'pottery' }[] = [
      { z: -3.9, cA: '#D95338', cB: '#FAF0DE', kind: 'spices' },
      { z: 0.1, cA: '#1D9A93', cB: '#F2C66D', kind: 'textiles' },
      { z: 4.1, cA: '#D47B2C', cB: '#FFF5E1', kind: 'pottery' },
    ];

    stallConfigs.forEach(({ z, cA, cB, kind }) => {
      const stallX = -9.2;
      // Timber counter & back frame
      addWorldMesh(new THREE.BoxGeometry(3.7, 0.92, 2.55), woodMat, [stallX, 0.46, z]);
      addWorldMesh(new THREE.BoxGeometry(3.85, 0.12, 2.7), creamTrimMat, [stallX, 0.95, z]);
      // 4 canopy posts
      [
        [stallX - 1.7, z - 1.15],
        [stallX + 1.7, z - 1.15],
        [stallX - 1.7, z + 1.15],
        [stallX + 1.7, z + 1.15],
      ].forEach(([px, pz]) => {
        addWorldMesh(new THREE.CylinderGeometry(0.08, 0.08, 2.75, 8), woodMat, [px, 1.38, pz]);
      });

      // Slanted striped fabric awning
      const awningTex = createStripedAwningTexture(cA, cB);
      const awningMat = new THREE.MeshStandardMaterial({ map: awningTex, roughness: 0.85, metalness: 0.02 });
      disposables.push(awningTex, awningMat);
      addWorldMesh(new THREE.BoxGeometry(4.3, 0.14, 3.0), awningMat, [stallX + 0.15, 2.78, z], [0, 0, -0.18]);

      // Distinct cultural merchandise per stall
      if (kind === 'spices') {
        const spiceColors = ['#E5A91A', '#C83B28', '#4A8E3D', '#E46E2B'];
        spiceColors.forEach((sc, i) => {
          const sMat = new THREE.MeshStandardMaterial({ color: sc, roughness: 0.9 });
          disposables.push(sMat);
          const sz = z - 0.85 + i * 0.56;
          addWorldMesh(new THREE.CylinderGeometry(0.24, 0.18, 0.12, 12), woodMat, [stallX + 0.85, 1.06, sz]);
          addWorldMesh(new THREE.ConeGeometry(0.21, 0.24, 12), sMat, [stallX + 0.85, 1.22, sz]);
        });
      } else if (kind === 'textiles') {
        const fabricColors = ['#D94A64', '#24B8B0', '#F2C66D', '#7E57C2'];
        fabricColors.forEach((fc, i) => {
          const fMat = new THREE.MeshStandardMaterial({ color: fc, roughness: 0.72 });
          disposables.push(fMat);
          const sz = z - 0.82 + i * 0.55;
          // Bright rolled cloth bolts on counter
          addWorldMesh(new THREE.CylinderGeometry(0.15, 0.15, 0.74, 12), fMat, [stallX + 0.78, 1.16, sz], [0, 0, Math.PI / 2]);
          // Draped colorful silk fabric banners hanging visibly along the front beam
          addWorldMesh(new THREE.BoxGeometry(0.08, 1.18, 0.44), fMat, [stallX + 2.02, 1.98, sz], [0, 0, 0.08]);
        });
        addWorldMesh(new THREE.BoxGeometry(0.55, 0.06, 2.1), coralWallMat, [stallX + 1.35, 0.65, z], [0, 0, 0.32]);
      } else {
        // Jaipur Blue Pottery & Brass vessels
        [-0.75, 0, 0.75].forEach((dz, i) => {
          const m = i === 1 ? brassMat : bluePotMat;
          addWorldMesh(new THREE.SphereGeometry(0.22, 12, 10), m, [stallX + 0.85, 1.18, z + dz], [0, 0, 0], [1, 1.18, 1]);
          addWorldMesh(new THREE.CylinderGeometry(0.09, 0.12, 0.14, 10), m, [stallX + 0.85, 1.42, z + dz]);
        });
      }
    });

    // 5. East Heritage Chhatri Pavilion (x: 6.7..11.2, z: -3.2..1.6)
    const pavX = 8.95;
    const pavZ = -0.8;
    addWorldMesh(new THREE.BoxGeometry(4.4, 0.42, 4.7), pinkSandstoneMat, [pavX, 0.21, pavZ]);
    addWorldMesh(new THREE.BoxGeometry(3.4, 0.04, 3.6), coralWallMat, [pavX, 0.44, pavZ]);
    [
      [pavX - 1.65, pavZ - 1.75],
      [pavX + 1.65, pavZ - 1.75],
      [pavX - 1.65, pavZ + 1.75],
      [pavX + 1.65, pavZ + 1.75],
    ].forEach(([cx, cz]) => {
      addWorldMesh(new THREE.CylinderGeometry(0.16, 0.2, 2.85, 10), creamTrimMat, [cx, 1.84, cz]);
      addWorldMesh(new THREE.BoxGeometry(0.46, 0.2, 0.46), coralWallMat, [cx, 0.52, cz]);
    });
    // Pavilion roof & fluted dome
    addWorldMesh(new THREE.BoxGeometry(4.6, 0.34, 4.8), coralWallMat, [pavX, 3.4, pavZ]);
    addWorldMesh(new THREE.CylinderGeometry(1.75, 1.95, 0.45, 8), creamTrimMat, [pavX, 3.78, pavZ]);
    addWorldMesh(new THREE.SphereGeometry(1.7, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55), pinkSandstoneMat, [pavX, 4.0, pavZ]);
    addWorldMesh(new THREE.ConeGeometry(0.24, 0.72, 8), brassMat, [pavX, 5.85, pavZ]);

    // 6. Courtyard Perimeter Walls + Corner Benches (bench_sw, bench_se)
    // West & East & South colonnade walls (outside bounds)
    addWorldMesh(new THREE.BoxGeometry(0.8, 2.2, 23.2), pinkSandstoneMat, [-12.5, 1.1, 0.2]);
    addWorldMesh(new THREE.BoxGeometry(0.8, 2.2, 23.2), pinkSandstoneMat, [12.5, 1.1, 0.2]);
    addWorldMesh(new THREE.BoxGeometry(9.5, 1.6, 0.8), pinkSandstoneMat, [-7.6, 0.8, 11.7]);
    addWorldMesh(new THREE.BoxGeometry(9.5, 1.6, 0.8), pinkSandstoneMat, [7.6, 0.8, 11.7]);
    // South entry gateway pillars
    addWorldMesh(new THREE.BoxGeometry(1.1, 3.1, 1.1), coralWallMat, [-2.7, 1.55, 11.7]);
    addWorldMesh(new THREE.BoxGeometry(1.1, 3.1, 1.1), coralWallMat, [2.7, 1.55, 11.7]);
    addWorldMesh(new THREE.TorusGeometry(2.4, 0.22, 8, 20, Math.PI), creamTrimMat, [0, 2.9, 11.7]);

    // Benches (matching bench_sw (-4.3, 8.0) and bench_se (4.3, 8.0))
    [-4.3, 4.3].forEach((bx) => {
      addWorldMesh(new THREE.BoxGeometry(2.1, 0.46, 0.95), creamTrimMat, [bx, 0.23, 8.0]);
      addWorldMesh(new THREE.BoxGeometry(2.2, 0.12, 1.05), coralWallMat, [bx, 0.50, 8.0]);
    });

    // 7. Street Lantern Posts + Glowing Lanterns
    lanternPositions.forEach(([lx, ly, lz]) => {
      addWorldMesh(new THREE.CylinderGeometry(0.08, 0.11, ly - 0.15, 8), sandstoneDarkMat, [lx, (ly - 0.15) / 2, lz]);
      addWorldMesh(new THREE.SphereGeometry(0.22, 10, 8), lanternGlowMat, [lx, ly, lz], [0, 0, 0], [1, 1.25, 1], false, false);
      addWorldMesh(new THREE.ConeGeometry(0.28, 0.22, 6), brassMat, [lx, ly + 0.26, lz]);
    });

    // 8. Courtyard Planters & Swaying Palms (matching planter_nw, planter_ne, planter_sw, planter_se)
    const planterCoords: [number, number][] = [
      [-5.6, -6.8],
      [5.6, -6.8],
      [-7.8, 8.2],
      [7.8, 8.2],
    ];
    const treeCrowns: THREE.Group[] = [];
    planterCoords.forEach(([px, pz], idx) => {
      addWorldMesh(new THREE.CylinderGeometry(0.76, 0.62, 0.62, 8), potMat, [px, 0.31, pz]);
      addWorldMesh(new THREE.CylinderGeometry(0.84, 0.84, 0.12, 8), creamTrimMat, [px, 0.62, pz]);
      addWorldMesh(new THREE.CylinderGeometry(0.14, 0.22, 2.6, 8), trunkMat, [px, 1.9, pz]);

      const crown = new THREE.Group();
      crown.position.set(px, 3.15, pz);
      for (let f = 0; f < 6; f++) {
        const angle = (f * Math.PI * 2) / 6 + idx * 0.4;
        const frond = new THREE.Mesh(new THREE.ConeGeometry(0.48, 1.75, 6), leafMat);
        frond.rotation.z = -Math.PI * 0.36;
        frond.rotation.order = 'YXZ';
        frond.rotation.y = angle;
        frond.position.set(Math.cos(angle) * 0.62, 0.05, -Math.sin(angle) * 0.62);
        frond.castShadow = !isSoftwareGl;
        crown.add(frond);
      }
      worldGroup.add(crown);
      treeCrowns.push(crown);
    });

    // Instanced colorful marigold flower clusters beside planters & facade
    const flowerGeo = new THREE.DodecahedronGeometry(0.14, 0);
    const flowerMat = new THREE.MeshStandardMaterial({ color: '#FFFFFF', roughness: 0.7 });
    disposables.push(flowerGeo, flowerMat);
    const marigoldCount = 16;
    const marigoldInst = new THREE.InstancedMesh(flowerGeo, flowerMat, marigoldCount);
    const dummy = new THREE.Object3D();
    const flowerPalette = [new THREE.Color('#FF9F1C'), new THREE.Color('#FF6B35'), new THREE.Color('#FFD166')];
    for (let i = 0; i < marigoldCount; i++) {
      const pIdx = i % planterCoords.length;
      const [bx, bz] = planterCoords[pIdx];
      const ang = (Math.floor(i / planterCoords.length) * Math.PI) / 2 + 0.4;
      dummy.position.set(bx + Math.cos(ang) * 0.44, 0.72, bz + Math.sin(ang) * 0.44);
      dummy.scale.setScalar(0.9 + (i % 3) * 0.16);
      dummy.updateMatrix();
      marigoldInst.setMatrixAt(i, dummy.matrix);
      marigoldInst.setColorAt(i, flowerPalette[i % flowerPalette.length]);
    }
    marigoldInst.instanceMatrix.needsUpdate = true;
    if (marigoldInst.instanceColor) marigoldInst.instanceColor.needsUpdate = true;
    worldGroup.add(marigoldInst);

    // 9. Interactive 3D Beacons (Aarav + 5 Word Detective Objects)
    const clickableBeacons: THREE.Mesh[] = [];
    const hitGeo = new THREE.SphereGeometry(0.75, 10, 8);
    const hitMat = new THREE.MeshBasicMaterial({ visible: false });
    disposables.push(hitGeo, hitMat);

    const poiBeacons = new Map<
      JaipurPoiId,
      { ring: THREE.Mesh; ringMat: THREE.MeshBasicMaterial; gem: THREE.Mesh; gemMat: THREE.MeshStandardMaterial }
    >();
    JAIPUR_INTERACTIVE_TARGETS.forEach((poi) => {
      const ringGeo = new THREE.RingGeometry(0.58, 0.78, 28);
      const ringMat = new THREE.MeshBasicMaterial({
        color: poi.accentColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.78,
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
      const gemY = poi.kind === 'npc' ? 2.18 : 1.68;
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

    // 3D Celebration Sparkle Burst (triggered on 5/5 Word Detective Completion)
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

    // 10. NPC Aarav Sharma at (5.4, -0.8)
    const aaravRig = createAaravNpcRig(!isSoftwareGl);
    aaravRig.root.position.set(5.4, 0, -0.8);
    aaravRig.root.rotation.y = -Math.PI * 0.42;
    scene.add(aaravRig.root);

    const contactTex = createContactShadowTexture();
    disposables.push(contactTex);
    const contactMat = new THREE.MeshBasicMaterial({
      map: contactTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.75,
    });
    const shadowPlaneGeo = new THREE.PlaneGeometry(0.95, 0.95);
    disposables.push(contactMat, shadowPlaneGeo);

    const aaravShadow = new THREE.Mesh(shadowPlaneGeo, contactMat);
    aaravShadow.rotation.x = -Math.PI / 2;
    aaravShadow.position.set(5.4, 0.02, -0.8);
    scene.add(aaravShadow);

    // 11. Player Avatar (Reusing Saved Phase 1A Rig)
    const playerRig = createProceduralAvatarRig(avatar, !isSoftwareGl);
    playerRigRef.current = playerRig;
    prevAvatarStructRef.current = `${avatar.modelId}:${avatar.hairStyle}:${avatar.outfitId}`;
    playerRig.root.position.set(JAIPUR_SPAWN.x, 0, JAIPUR_SPAWN.z);
    scene.add(playerRig.root);

    const playerShadow = new THREE.Mesh(shadowPlaneGeo, contactMat);
    playerShadow.rotation.x = -Math.PI / 2;
    playerShadow.position.set(JAIPUR_SPAWN.x, 0.02, JAIPUR_SPAWN.z);
    scene.add(playerShadow);

    // Input State (zero React state re-renders inside game loop)
    const pressedKeys = new Set<string>();
    const onKeyDown = (e: KeyboardEvent) => {
      if (pausedRef.current) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      pressedKeys.add(e.code);
    };
    const onKeyUp = (e: KeyboardEvent) => {
      pressedKeys.delete(e.code);
    };

    // Camera Orbit via Pointer Drag + Mouse Wheel
    let camYaw = 0; // looking north (-Z) initially
    let camPitch = 0.38;
    let camDist = 6.2;
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
          const hitId = hits[0].object.userData.poiId as JaipurPoiId;
          if (hitId === lastPoiReported) {
            onActivatePoiRef.current?.(hitId);
          }
        }
      }
    };
    const onWheel = (e: WheelEvent) => {
      if (pausedRef.current) return;
      e.preventDefault();
      camDist = Math.max(4.4, Math.min(8.6, camDist + e.deltaY * 0.004));
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerup', onPointerUp);
    renderer.domElement.addEventListener('pointercancel', onPointerUp);
    renderer.domElement.addEventListener('wheel', onWheel, { passive: false });

    // ResizeObserver
    const handleResize = () => {
      const w = Math.max(container.clientWidth, 320);
      const h = Math.max(container.clientHeight, 320);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Simulation state
    let playerX = JAIPUR_SPAWN.x;
    let playerZ = JAIPUR_SPAWN.z;
    let playerYaw = Math.PI; // facing North (-Z) from spawn into the Jaipur square
    let walkPhase = 0;
    let speedNorm = 0;
    let nightMix = appearanceRef.current === 'night' ? 1 : 0;
    let lastPoiReported: JaipurPoiId | null = null;
    let lastPosReportTime = 0;
    let activeAutoWalkId = 0;
    let lastCompletedAutoWalkId = 0;
    let autoWalkWaypointIdx = 0;
    let lastQuickTravelId = 0;
    let stuckTimer = 0;
    let stuckAnchorX = playerX;
    let stuckAnchorZ = playerZ;
    let snapCameraNextFrame = false;

    onPositionRef.current?.({ x: playerX, z: playerZ });

    // Initialize camera immediately behind player
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

      // 1. Day / Night Smooth Scene Interpolation
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
      hemiLight.intensity = THREE.MathUtils.lerp(1.05, 0.72, nightMix);

      keyLight.color.copy(DAY_KEY_COLOR).lerp(NIGHT_KEY_COLOR, nightMix);
      keyLight.intensity = THREE.MathUtils.lerp(2.15, 1.12, nightMix);
      _vecA.copy(DAY_KEY_POS).lerp(NIGHT_KEY_POS, nightMix);
      keyLight.position.copy(_vecA);

      cloudMat.color.copy(DAY_CLOUD_COLOR).lerp(NIGHT_CLOUD_COLOR, nightMix);
      cloudMat.opacity = THREE.MathUtils.lerp(0.92, 0.38, nightMix);
      starMat.opacity = nightMix * 0.88;
      moonMat.opacity = nightMix * 0.96;

      lanternGlowMat.emissiveIntensity = THREE.MathUtils.lerp(0.25, 1.85, nightMix);
      const pLightVal = THREE.MathUtils.lerp(0.2, 5.2, nightMix);
      for (const pl of lanternLights) {
        pl.intensity = pLightVal;
      }

      // Quick Travel Instant Relocation (Collision-Safe)
      const pendingQt = quickTravelRef.current;
      if (pendingQt && pendingQt.requestId !== lastQuickTravelId) {
        lastQuickTravelId = pendingQt.requestId;
        if (autoWalkRef.current) lastCompletedAutoWalkId = autoWalkRef.current.requestId;
        activeAutoWalkId = 0;
        const safeQt = resolveJaipurCollision(pendingQt.arrivalPoint.x, pendingQt.arrivalPoint.z);
        playerX = safeQt.x;
        playerZ = safeQt.z;
        playerYaw = pendingQt.facingYaw;
        snapCameraNextFrame = true;
        onPositionRef.current?.({ x: playerX, z: playerZ });
      }

      // 2. Gather Player Movement Input (Keyboard + Virtual Joystick, overrides Auto-Walk)
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

        // Camera-relative horizontal basis vectors:
        // forward = (-sin(camYaw), -cos(camYaw)), right = (cos(camYaw), -sin(camYaw))
        const forwardX = -Math.sin(camYaw);
        const forwardZ = -Math.cos(camYaw);
        const rightX = Math.cos(camYaw);
        const rightZ = -Math.sin(camYaw);

        const worldDirX = rightX * nx + forwardX * -ny;
        const worldDirZ = rightZ * nx + forwardZ * -ny;

        const moveDist = WALK_SPEED * clampedMag * dt;
        const resolved = resolveJaipurCollision(
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
            const snapped = resolveJaipurCollision(wp.x, wp.z);
            playerX = snapped.x;
            playerZ = snapped.z;
            autoWalkWaypointIdx += 1;

            if (autoWalkWaypointIdx >= aw.waypoints.length) {
              lastCompletedAutoWalkId = aw.requestId;
              activeAutoWalkId = 0;
              speedNorm = 0;
              const destTarget = JAIPUR_INTERACTIVE_TARGETS.find((t) => t.id === aw.targetId);
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
            const resolved = resolveJaipurCollision(
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

      playerRig.root.position.set(playerX, 0, playerZ);
      playerRig.root.rotation.y = playerYaw;
      playerShadow.position.set(playerX, 0.02, playerZ);

      // 3. Player Avatar Procedural Animation (Idle / Walk / Interact)
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

      // Friendly interaction gesture wave on Inspect / Talk
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

      // Celebration burst animation when all 5 Word Detective objects are found
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

      // Eye blink for player
      const blinkCycle = elapsed % 3.6;
      const blinkAmt = blinkCycle > 3.44 ? Math.sin(((blinkCycle - 3.44) / 0.16) * Math.PI) : 0;
      const lidRot = THREE.MathUtils.lerp(-Math.PI * 0.42, 0.12, blinkAmt);
      parts.leftEyelid.rotation.x = lidRot;
      parts.rightEyelid.rotation.x = lidRot;

      // 4. Nearest Interactive Target detection (only notify React when ID changes)
      const nearestPoi = findNearestInteractivePoi(playerX, playerZ);
      const nearestId = nearestPoi?.id ?? null;
      if (nearestId !== lastPoiReported) {
        lastPoiReported = nearestId;
        onNearestPoiRef.current(nearestId);
      }
      if (elapsed - lastPosReportTime > 0.25) {
        lastPosReportTime = elapsed;
        onPositionRef.current?.({ x: playerX, z: playerZ });
      }

      // 5. NPC Aarav Sharma Idle & Turn-to-Face-Player Behavior
      const distToAarav = Math.hypot(playerX - 5.4, playerZ - -0.8);
      const shouldFacePlayer = distToAarav < 3.4 || dialogueOpenRef.current;
      const aaravTargetYaw = shouldFacePlayer
        ? Math.atan2(playerX - 5.4, playerZ - -0.8)
        : -Math.PI * 0.42;
      aaravRig.root.rotation.y +=
        shortestAngleDiff(aaravRig.root.rotation.y, aaravTargetYaw) *
        (reduced ? 1 : Math.min(1, dt * 5.2));

      if (!reduced) {
        aaravRig.torso.position.y = 0.03 + Math.sin(elapsed * 1.9 + 1.0) * 0.012;
        aaravRig.head.rotation.y = shouldFacePlayer ? 0 : Math.sin(elapsed * 0.8) * 0.14;
        if (dialogueOpenRef.current) {
          aaravRig.rightArm.rotation.x = -0.45 + Math.sin(elapsed * 4.5) * 0.18;
        } else {
          aaravRig.rightArm.rotation.x += (0 - aaravRig.rightArm.rotation.x) * Math.min(1, dt * 6);
        }
      }
      const aaravBlink = (elapsed + 1.7) % 4.1;
      const aaravBlinkAmt = aaravBlink > 3.94 ? Math.sin(((aaravBlink - 3.94) / 0.16) * Math.PI) : 0;
      const aaravLidRot = THREE.MathUtils.lerp(-Math.PI * 0.42, 0.12, aaravBlinkAmt);
      aaravRig.leftEyelid.rotation.x = aaravLidRot;
      aaravRig.rightEyelid.rotation.x = aaravLidRot;

      // 6. Animate Interactive Beacons (Aarav + 5 Word Detective Objects), Clouds, Fountain & Palm Fronds
      const guidedId = guidedPoiRef.current;
      JAIPUR_INTERACTIVE_TARGETS.forEach((poi, idx) => {
        const b = poiBeacons.get(poi.id);
        if (!b) return;
        const isVisited = exploredRef.current.has(poi.id);
        const isNear = poi.id === nearestId;
        const isGuided = guidedId === poi.id;

        _colorA.set(isGuided ? '#FBBF24' : isVisited ? '#2ED6A3' : poi.accentColor);
        b.ringMat.color.copy(_colorA);
        b.gemMat.color.copy(_colorA);
        b.gemMat.emissive.copy(_colorA);
        b.gemMat.emissiveIntensity = isGuided ? 1.25 : isNear ? 1.18 : isVisited ? 0.35 : 0.62;
        b.ringMat.opacity = isGuided ? 0.96 : isNear ? 0.95 : isVisited ? 0.45 : 0.72;

        if (!reduced) {
          const baseY = (poi.kind === 'npc' ? 2.18 : 1.68) + (isGuided ? 0.35 : 0);
          b.gem.position.y = baseY + Math.sin(elapsed * 2.5 + idx) * 0.14;
          b.gem.rotation.y += dt * (isGuided || isNear ? 2.4 : 1.2);
          b.gem.scale.setScalar(isGuided ? 1.28 : isVisited ? 0.75 : isNear ? 1.18 : 1.0);
          const rScale = isGuided || isNear ? 1.14 + Math.sin(elapsed * 5) * 0.06 : 1.0;
          b.ring.scale.setScalar(rScale);
        } else {
          b.gem.scale.setScalar(isGuided ? 1.25 : isVisited ? 0.75 : 1.0);
        }
      });

      if (!reduced) {
        for (const c of clouds) {
          c.group.position.x =
            ((c.baseX + elapsed * c.speed + c.range) % (c.range * 2)) - c.range;
        }
        for (const d of droplets) {
          const t = (elapsed * 0.85 + d.phase) % 1;
          const r = 0.25 + t * 0.92;
          const arcY = 1.92 + (4 * t * (1 - t)) * 0.72 - t * 1.48;
          d.mesh.position.set(Math.cos(d.angle) * r, arcY, -0.6 + Math.sin(d.angle) * r);
          d.mesh.visible = arcY > 0.36;
        }
        treeCrowns.forEach((crown, idx) => {
          crown.rotation.z = Math.sin(elapsed * 1.3 + idx * 1.2) * 0.035;
        });
      }

      // 7. Third-Person Follow Camera with Courtyard Boundary Clamp
      const desiredCamX = THREE.MathUtils.clamp(
        playerX + Math.sin(camYaw) * Math.cos(camPitch) * camDist,
        JAIPUR_BOUNDS.minX + 0.6,
        JAIPUR_BOUNDS.maxX - 0.6,
      );
      const desiredCamZ = THREE.MathUtils.clamp(
        playerZ + Math.cos(camYaw) * Math.cos(camPitch) * camDist,
        -8.8, // Keep camera in front of the North Pink Palace wall so it never clips inside geometry
        JAIPUR_BOUNDS.maxZ + 0.3,
      );
      const desiredCamY = Math.max(0.95, 1.28 + Math.sin(camPitch) * camDist);

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
      aaravRig.dispose();
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
      aria-label="Jaipur Pink City 3D Exploration"
    />
  );
}
