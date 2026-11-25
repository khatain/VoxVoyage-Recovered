import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import type { AvatarConfig, ResolvedAppearance } from '../../types/game';
import { createProceduralAvatarRig, disposeObjectGeometries } from './proceduralAvatarRig';

interface AvatarStudioSceneProps {
  avatar: AvatarConfig;
  appearance: ResolvedAppearance;
  reducedMotion: boolean;
  gestureRequest: { type: 'greet' | 'celebrate'; seq: number };
  onWebGLFailure: () => void;
}

const _colorA = new THREE.Color();
const _colorB = new THREE.Color();
const _vecA = new THREE.Vector3();

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

const DAY_KEY_COLOR = new THREE.Color('#FFF4D6');
const NIGHT_KEY_COLOR = new THREE.Color('#A8C4FF');
const DAY_KEY_POS = new THREE.Vector3(3.4, 5.2, 4.0);
const NIGHT_KEY_POS = new THREE.Vector3(-3.2, 4.6, 3.6);

const DAY_RIM_COLOR = new THREE.Color('#3AD2C8');
const NIGHT_RIM_COLOR = new THREE.Color('#8C76EE');

const DAY_CLOUD_COLOR = new THREE.Color('#FFFFFF');
const NIGHT_CLOUD_COLOR = new THREE.Color('#4B5B8F');

function createPlatformTopTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    const cx = 256;
    const cy = 256;
    const grad = ctx.createRadialGradient(cx, cy, 24, cx, cy, 256);
    grad.addColorStop(0, '#FAFBFD');
    grad.addColorStop(0.68, '#E6EEF8');
    grad.addColorStop(1, '#CEDCEC');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    // Compass rings
    ctx.strokeStyle = 'rgba(32, 48, 74, 0.16)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, 212, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(36, 184, 176, 0.36)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(cx, cy, 172, 0, Math.PI * 2);
    ctx.stroke();

    // 8-point compass ticks
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      const inner = i % 2 === 0 ? 115 : 148;
      ctx.strokeStyle = i % 2 === 0 ? 'rgba(217, 155, 38, 0.5)' : 'rgba(32, 48, 74, 0.2)';
      ctx.lineWidth = i % 2 === 0 ? 4 : 2;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * inner, cy + Math.sin(a) * inner);
      ctx.lineTo(cx + Math.cos(a) * 204, cy + Math.sin(a) * 204);
      ctx.stroke();
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = Math.min(8, maxAnisotropy);
  tex.needsUpdate = true;
  return tex;
}

function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(64, 64, 6, 64, 64, 62);
    grad.addColorStop(0, 'rgba(19, 30, 49, 0.5)');
    grad.addColorStop(0.55, 'rgba(19, 30, 49, 0.22)');
    grad.addColorStop(1, 'rgba(19, 30, 49, 0)');
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
    [0, 0, 0, 0.62],
    [-0.52, -0.06, 0.08, 0.44],
    [0.54, -0.05, -0.06, 0.46],
    [0.14, 0.22, 0.04, 0.38],
  ];
  const geo = new THREE.SphereGeometry(1, 14, 10);
  puffs.forEach(([px, py, pz, s]) => {
    const puff = new THREE.Mesh(geo, material);
    puff.position.set(px, py, pz);
    puff.scale.set(s * 1.35, s * 0.85, s);
    cloud.add(puff);
  });
  return cloud;
}

export function AvatarStudioScene({
  avatar,
  appearance,
  reducedMotion,
  gestureRequest,
  onWebGLFailure,
}: AvatarStudioSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  const avatarRef = useRef(avatar);
  avatarRef.current = avatar;
  const appearanceRef = useRef(appearance);
  appearanceRef.current = appearance;
  const reducedMotionRef = useRef(reducedMotion);
  reducedMotionRef.current = reducedMotion;

  const rebuildCharacterRef = useRef<(() => void) | null>(null);
  const updateColorsRef = useRef<(() => void) | null>(null);
  const triggerGestureRef = useRef<((type: 'greet' | 'celebrate') => void) | null>(null);
  const lastGestureSeqRef = useRef(gestureRequest.seq);

  // Sync color changes immediately without tearing down geometry
  useEffect(() => {
    updateColorsRef.current?.();
  }, [avatar.skinTone, avatar.hairColor, avatar.outfitColor, avatar.backpackColor]);

  // Rebuild modular body/hair/outfit geometry when structural choices change
  useEffect(() => {
    rebuildCharacterRef.current?.();
  }, [avatar.modelId, avatar.hairStyle, avatar.outfitId]);

  // Trigger requested gestures (greet wave or celebration hop + sparkles)
  useEffect(() => {
    if (gestureRequest.seq !== lastGestureSeqRef.current) {
      lastGestureSeqRef.current = gestureRequest.seq;
      triggerGestureRef.current?.(gestureRequest.type);
    }
  }, [gestureRequest.seq, gestureRequest.type]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = (() => {
      const probe = document.createElement('canvas').getContext('webgl2');
      if (!probe) return true;
      const ext = probe.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : probe.RENDERER;
      const gpu = String(probe.getParameter(param));
      probe.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
      });
    } catch {
      onWebGLFailure();
      return;
    }

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
    const scene = new THREE.Scene();

    const initialNight = appearanceRef.current === 'night' ? 1 : 0;
    let currentNightMix = initialNight;

    const fogColor = DAY_FOG_COLOR.clone().lerp(NIGHT_FOG_COLOR, currentNightMix);
    scene.background = fogColor.clone();
    scene.fog = new THREE.Fog(fogColor, 14, 42);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envRT = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0.35, 1.42, 4.15);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0.78, 0);
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.minDistance = 2.85;
    controls.maxDistance = 5.5;
    controls.minPolarAngle = Math.PI * 0.27;
    controls.maxPolarAngle = Math.PI * 0.56;
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.07;
    controls.rotateSpeed = 0.75;
    controls.update();

    let userInteracting = false;
    const onControlStart = () => {
      userInteracting = true;
    };
    const onControlEnd = () => {
      userInteracting = false;
    };
    controls.addEventListener('start', onControlStart);
    controls.addEventListener('end', onControlEnd);

    // 1. Sky Dome (vertex colored Day/Night gradient)
    const skyGeo = new THREE.SphereGeometry(40, 32, 20);
    const skyPos = skyGeo.attributes.position;
    const skyColors = new Float32Array(skyPos.count * 3);
    skyGeo.setAttribute('color', new THREE.BufferAttribute(skyColors, 3));
    const skyMat = new THREE.MeshBasicMaterial({
      vertexColors: true,
      side: THREE.BackSide,
      fog: false,
      depthWrite: false,
    });
    const skyDome = new THREE.Mesh(skyGeo, skyMat);
    scene.add(skyDome);

    const applySkyColors = (mix: number) => {
      _colorA.copy(DAY_SKY_TOP).lerp(NIGHT_SKY_TOP, mix);
      _colorB.copy(DAY_SKY_BOTTOM).lerp(NIGHT_SKY_BOTTOM, mix);
      const attr = skyGeo.attributes.color as THREE.BufferAttribute;
      for (let i = 0; i < skyPos.count; i++) {
        const y = skyPos.getY(i);
        const t = THREE.MathUtils.clamp((y + 12) / 46, 0, 1);
        const r = THREE.MathUtils.lerp(_colorB.r, _colorA.r, t);
        const g = THREE.MathUtils.lerp(_colorB.g, _colorA.g, t);
        const b = THREE.MathUtils.lerp(_colorB.b, _colorA.b, t);
        attr.setXYZ(i, r, g, b);
      }
      attr.needsUpdate = true;
    };
    applySkyColors(currentNightMix);

    // 2. Night Stars & Moon
    const starCount = 260;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 0.85 + 0.15);
      const r = 34;
      starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = r * Math.cos(phi);
      starPositions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: '#FFFDF4',
      size: 0.24,
      transparent: true,
      opacity: currentNightMix * 0.9,
      fog: false,
      depthWrite: false,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    const moonMat = new THREE.MeshBasicMaterial({
      color: '#FFF2CE',
      transparent: true,
      opacity: currentNightMix,
      fog: false,
    });
    const moon = new THREE.Mesh(new THREE.SphereGeometry(1.15, 22, 18), moonMat);
    moon.position.set(-10, 9.5, -20);
    moon.visible = currentNightMix > 0.02;
    scene.add(moon);

    // 3. Drifting Clouds
    const cloudMat = new THREE.MeshStandardMaterial({
      color: DAY_CLOUD_COLOR.clone().lerp(NIGHT_CLOUD_COLOR, currentNightMix),
      roughness: 0.92,
      metalness: 0,
      transparent: true,
      opacity: 0.9,
    });
    const clouds: { group: THREE.Group; radius: number; angle: number; speed: number; y: number }[] = [];
    for (let i = 0; i < 8; i++) {
      const group = createCloudCluster(cloudMat);
      const angle = (i / 8) * Math.PI * 2;
      const radius = 12 + (i % 3) * 3.5;
      const y = 2.4 + (i % 3) * 1.4;
      const s = 0.72 + (i % 3) * 0.22;
      group.scale.setScalar(s);
      group.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius - 3);
      group.lookAt(0, y, 0);
      scene.add(group);
      clouds.push({ group, radius, angle, speed: 0.022 + (i % 2) * 0.012, y });
    }

    // 4. Three-Point Lighting Rig
    const hemiLight = new THREE.HemisphereLight(
      DAY_HEMI_SKY.clone().lerp(NIGHT_HEMI_SKY, currentNightMix),
      DAY_HEMI_GROUND.clone().lerp(NIGHT_HEMI_GROUND, currentNightMix),
      THREE.MathUtils.lerp(0.95, 0.58, currentNightMix),
    );
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(
      DAY_KEY_COLOR.clone().lerp(NIGHT_KEY_COLOR, currentNightMix),
      THREE.MathUtils.lerp(1.55, 0.92, currentNightMix),
    );
    keyLight.position.copy(DAY_KEY_POS).lerp(NIGHT_KEY_POS, currentNightMix);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      keyLight.shadow.camera.near = 0.5;
      keyLight.shadow.camera.far = 16;
      keyLight.shadow.camera.left = -2.6;
      keyLight.shadow.camera.right = 2.6;
      keyLight.shadow.camera.top = 2.8;
      keyLight.shadow.camera.bottom = -2.2;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(
      DAY_RIM_COLOR.clone().lerp(NIGHT_RIM_COLOR, currentNightMix),
      THREE.MathUtils.lerp(0.7, 1.05, currentNightMix),
    );
    rimLight.position.set(-3.8, 3.0, -3.5);
    scene.add(rimLight);

    // 5. Floating Stage Group (Pedestal + Contact Shadow + Character)
    const stageGroup = new THREE.Group();
    scene.add(stageGroup);

    const platformTex = createPlatformTopTexture(maxAnisotropy);
    const platformTopMat = new THREE.MeshStandardMaterial({
      map: platformTex,
      roughness: 0.55,
      metalness: 0.06,
    });
    const platformTop = new THREE.Mesh(
      new THREE.CylinderGeometry(1.32, 1.38, 0.14, 48),
      platformTopMat,
    );
    platformTop.position.set(0, -0.07, 0);
    platformTop.receiveShadow = true;
    stageGroup.add(platformTop);

    const goldRimMat = new THREE.MeshStandardMaterial({
      color: '#F2C66D',
      roughness: 0.24,
      metalness: 0.85,
    });
    const platformRim = new THREE.Mesh(
      new THREE.TorusGeometry(1.34, 0.04, 16, 64),
      goldRimMat,
    );
    platformRim.rotation.x = Math.PI / 2;
    platformRim.position.set(0, -0.015, 0);
    stageGroup.add(platformRim);

    const platformBaseMat = new THREE.MeshStandardMaterial({
      color: '#20304A',
      roughness: 0.62,
      metalness: 0.22,
    });
    const platformBase = new THREE.Mesh(
      new THREE.CylinderGeometry(1.28, 0.78, 0.24, 36),
      platformBaseMat,
    );
    platformBase.position.set(0, -0.25, 0);
    stageGroup.add(platformBase);

    const glowRingMat = new THREE.MeshStandardMaterial({
      color: '#24B8B0',
      emissive: '#24B8B0',
      emissiveIntensity: 0.9,
      roughness: 0.3,
      metalness: 0.2,
    });
    const glowRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.84, 0.026, 12, 48),
      glowRingMat,
    );
    glowRing.rotation.x = Math.PI / 2;
    glowRing.position.set(0, -0.37, 0);
    stageGroup.add(glowRing);

    const contactShadowTex = createContactShadowTexture();
    const contactShadow = new THREE.Mesh(
      new THREE.PlaneGeometry(1.05, 1.05),
      new THREE.MeshBasicMaterial({
        map: contactShadowTex,
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
      }),
    );
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.set(0, 0.004, 0);
    stageGroup.add(contactShadow);

    // 6. Celebration Sparkle Particles
    const sparkleCount = 32;
    const sparklePositions = new Float32Array(sparkleCount * 3);
    const sparkleAngles = new Float32Array(sparkleCount);
    const sparkleRadii = new Float32Array(sparkleCount);
    for (let i = 0; i < sparkleCount; i++) {
      sparkleAngles[i] = (i / sparkleCount) * Math.PI * 2;
      sparkleRadii[i] = 0.55 + Math.random() * 0.85;
      sparklePositions[i * 3] = Math.cos(sparkleAngles[i]) * sparkleRadii[i];
      sparklePositions[i * 3 + 1] = 0.2;
      sparklePositions[i * 3 + 2] = Math.sin(sparkleAngles[i]) * sparkleRadii[i];
    }
    const sparkleGeo = new THREE.BufferGeometry();
    sparkleGeo.setAttribute('position', new THREE.BufferAttribute(sparklePositions, 3));
    const sparkleMat = new THREE.PointsMaterial({
      color: '#F2C66D',
      size: 0.14,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    const sparkles = new THREE.Points(sparkleGeo, sparkleMat);
    sparkles.visible = false;
    stageGroup.add(sparkles);

    // 7. Procedural Character Rig (shared with Jaipur exploration scene)
    const avatarRig = createProceduralAvatarRig(avatarRef.current, !isSoftwareGl);
    const characterRoot = avatarRig.root;
    stageGroup.add(characterRoot);

    // Animation state machine
    let greetTimer = reducedMotionRef.current ? 0 : 1.7;
    let celebrateTimer = 0;
    let blinkCooldown = 2.6;
    let blinkPhase = 0;

    rebuildCharacterRef.current = () => {
      avatarRig.rebuild(avatarRef.current);
      if (!reducedMotionRef.current) {
        greetTimer = Math.max(greetTimer, 0.95);
      }
    };
    updateColorsRef.current = () => {
      avatarRig.updateColors(avatarRef.current);
    };
    triggerGestureRef.current = (type) => {
      if (type === 'celebrate') {
        celebrateTimer = reducedMotionRef.current ? 0.55 : 1.35;
        greetTimer = 0;
      } else {
        greetTimer = reducedMotionRef.current ? 0.5 : 2.1;
      }
    };

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    const onResize = () => {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      onWebGLFailure();
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);

    const clock = new THREE.Clock();
    let frameId = 0;
    let disposed = false;

    const afterDraw = (cb: () => void) => {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (!gl.fenceSync) {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) {
          if (sync) gl.deleteSync(sync);
          return;
        }
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    };

    const tick = () => {
      if (disposed) return;
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;
      const rm = reducedMotionRef.current;

      // 1. Day/Night sky, fog & light interpolation
      const targetNight = appearanceRef.current === 'night' ? 1 : 0;
      if (Math.abs(currentNightMix - targetNight) > 0.002) {
        currentNightMix = rm
          ? targetNight
          : THREE.MathUtils.damp(currentNightMix, targetNight, 2.2, dt);
        applySkyColors(currentNightMix);
        fogColor.copy(DAY_FOG_COLOR).lerp(NIGHT_FOG_COLOR, currentNightMix);
        if (scene.fog instanceof THREE.Fog) {
          scene.fog.color.copy(fogColor);
        }
        (scene.background as THREE.Color).copy(fogColor);
        hemiLight.color.copy(DAY_HEMI_SKY).lerp(NIGHT_HEMI_SKY, currentNightMix);
        hemiLight.groundColor.copy(DAY_HEMI_GROUND).lerp(NIGHT_HEMI_GROUND, currentNightMix);
        hemiLight.intensity = THREE.MathUtils.lerp(0.95, 0.58, currentNightMix);
        keyLight.color.copy(DAY_KEY_COLOR).lerp(NIGHT_KEY_COLOR, currentNightMix);
        keyLight.intensity = THREE.MathUtils.lerp(1.55, 0.92, currentNightMix);
        keyLight.position.copy(DAY_KEY_POS).lerp(NIGHT_KEY_POS, currentNightMix);
        rimLight.color.copy(DAY_RIM_COLOR).lerp(NIGHT_RIM_COLOR, currentNightMix);
        rimLight.intensity = THREE.MathUtils.lerp(0.7, 1.05, currentNightMix);
        cloudMat.color.copy(DAY_CLOUD_COLOR).lerp(NIGHT_CLOUD_COLOR, currentNightMix);
        starMat.opacity = currentNightMix * 0.9;
        moonMat.opacity = currentNightMix;
        moon.visible = currentNightMix > 0.02;
      }

      // 2. Cloud drift
      if (!rm) {
        clouds.forEach((c) => {
          c.angle += c.speed * dt;
          c.group.position.set(
            Math.cos(c.angle) * c.radius,
            c.y + Math.sin(t * 0.4 + c.angle) * 0.08,
            Math.sin(c.angle) * c.radius - 3,
          );
          c.group.lookAt(0, c.y, 0);
        });
      }

      // 3. Gentle platform hover & slow studio rotation when idle
      stageGroup.position.y = rm ? 0 : Math.sin(t * 1.15) * 0.024;
      glowRingMat.emissiveIntensity = rm ? 0.85 : 0.75 + Math.sin(t * 2.4) * 0.25;

      if (!rm && !userInteracting && celebrateTimer <= 0) {
        characterRoot.rotation.y = Math.sin(t * 0.35) * 0.16;
      }

      // 4. Character procedural animations (breathing, blinking, head movement, greeting, celebration)
      const parts = avatarRig.parts;
      if (parts) {
        const breath = rm ? 0 : Math.sin(t * 2.1);
        parts.torso.scale.set(
          1 + breath * 0.014,
          1 + breath * 0.012,
          1 + breath * 0.016,
        );
        parts.hips.position.y = 0.64 + breath * 0.008;

        blinkCooldown -= dt;
        if (blinkCooldown <= 0 && blinkPhase <= 0) {
          blinkPhase = 0.14;
          blinkCooldown = 2.7 + Math.random() * 2.2;
        }
        let lidRot = -Math.PI * 0.42;
        if (blinkPhase > 0) {
          blinkPhase = Math.max(0, blinkPhase - dt);
          const closeFactor = Math.sin((1 - blinkPhase / 0.14) * Math.PI);
          lidRot = THREE.MathUtils.lerp(-Math.PI * 0.42, 0.04, closeFactor);
        }
        parts.leftEyelid.rotation.x = lidRot;
        parts.rightEyelid.rotation.x = lidRot;

        if (greetTimer > 0) greetTimer = Math.max(0, greetTimer - dt);
        if (celebrateTimer > 0) celebrateTimer = Math.max(0, celebrateTimer - dt);

        if (celebrateTimer > 0) {
          const progress = 1 - celebrateTimer / (rm ? 0.55 : 1.35);
          const hop = rm ? 0 : Math.abs(Math.sin(progress * Math.PI * 2)) * 0.18;
          characterRoot.position.y = hop;
          characterRoot.rotation.y = rm ? 0 : Math.sin(progress * Math.PI * 2) * 0.28;
          parts.leftArm.rotation.z = THREE.MathUtils.damp(parts.leftArm.rotation.z, 2.35, 12, dt);
          parts.rightArm.rotation.z = THREE.MathUtils.damp(parts.rightArm.rotation.z, -2.35, 12, dt);
          parts.leftForearm.rotation.z = THREE.MathUtils.damp(parts.leftForearm.rotation.z, -0.25, 12, dt);
          parts.rightForearm.rotation.z = THREE.MathUtils.damp(parts.rightForearm.rotation.z, 0.25, 12, dt);
          parts.head.rotation.set(-0.08, 0, Math.sin(t * 9) * 0.08);
          parts.mouthMesh.scale.set(1.22, 1.32, 1);

          sparkles.visible = !rm;
          if (!rm) {
            const posAttr = sparkleGeo.attributes.position as THREE.BufferAttribute;
            for (let i = 0; i < sparkleCount; i++) {
              const a = sparkleAngles[i] + progress * 2.2;
              const r = sparkleRadii[i] * (0.85 + progress * 0.55);
              posAttr.setXYZ(
                i,
                Math.cos(a) * r,
                0.25 + ((i % 4) * 0.22 + progress * 1.45),
                Math.sin(a) * r,
              );
            }
            posAttr.needsUpdate = true;
            sparkleMat.opacity = Math.sin(progress * Math.PI) * 0.95;
          }
        } else {
          sparkles.visible = false;
          characterRoot.position.y = THREE.MathUtils.damp(characterRoot.position.y, 0, 10, dt);

          if (greetTimer > 0) {
            const wave = rm ? 0 : Math.sin(t * 10.5) * 0.36;
            parts.rightArm.rotation.z = THREE.MathUtils.damp(parts.rightArm.rotation.z, -2.25, 10, dt);
            parts.rightForearm.rotation.z = THREE.MathUtils.damp(parts.rightForearm.rotation.z, 0.35 + wave, 14, dt);
            parts.leftArm.rotation.z = THREE.MathUtils.damp(parts.leftArm.rotation.z, 0.14, 8, dt);
            parts.leftForearm.rotation.z = THREE.MathUtils.damp(parts.leftForearm.rotation.z, 0, 8, dt);
            parts.head.rotation.y = THREE.MathUtils.damp(parts.head.rotation.y, 0.08, 6, dt);
            parts.head.rotation.z = THREE.MathUtils.damp(parts.head.rotation.z, -0.07, 6, dt);
            parts.mouthMesh.scale.set(1.15, 1.18, 1);
          } else {
            const sway = rm ? 0 : Math.sin(t * 1.6) * 0.04;
            parts.leftArm.rotation.z = THREE.MathUtils.damp(parts.leftArm.rotation.z, 0.14 + sway, 6, dt);
            parts.rightArm.rotation.z = THREE.MathUtils.damp(parts.rightArm.rotation.z, -0.14 - sway, 6, dt);
            parts.leftForearm.rotation.z = THREE.MathUtils.damp(parts.leftForearm.rotation.z, -0.04, 6, dt);
            parts.rightForearm.rotation.z = THREE.MathUtils.damp(parts.rightForearm.rotation.z, 0.04, 6, dt);
            parts.head.rotation.y = THREE.MathUtils.damp(
              parts.head.rotation.y,
              rm ? 0 : Math.sin(t * 0.68) * 0.09,
              4,
              dt,
            );
            parts.head.rotation.x = THREE.MathUtils.damp(
              parts.head.rotation.x,
              rm ? 0 : Math.sin(t * 0.95) * 0.035,
              4,
              dt,
            );
            parts.head.rotation.z = THREE.MathUtils.damp(parts.head.rotation.z, 0, 5, dt);
            parts.mouthMesh.scale.set(1, 1, 1);
          }
        }
      }

      controls.update();
      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    };

    if (isSoftwareGl) {
      renderer.render(scene, camera);
      afterDraw(tick);
    } else {
      frameId = requestAnimationFrame(tick);
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('resize', onResize);
      controls.removeEventListener('start', onControlStart);
      controls.removeEventListener('end', onControlEnd);
      controls.dispose();
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);

      disposeObjectGeometries(scene);
      avatarRig.dispose();
      platformTex.dispose();
      platformTopMat.dispose();
      goldRimMat.dispose();
      platformBaseMat.dispose();
      glowRingMat.dispose();
      contactShadowTex.dispose();
      (contactShadow.material as THREE.Material).dispose();
      skyMat.dispose();
      starMat.dispose();
      moonMat.dispose();
      cloudMat.dispose();
      sparkleMat.dispose();
      envRT.dispose();
      renderer.dispose();

      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [onWebGLFailure]);

  // Unused _vecA guard kept at module scope for future extensions if needed
  void _vecA;
  void _colorB;

  return <div ref={mountRef} className="h-full w-full touch-none" />;
}
