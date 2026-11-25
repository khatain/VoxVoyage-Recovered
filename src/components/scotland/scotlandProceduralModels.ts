import * as THREE from 'three';
import { disposeObjectGeometries } from '../avatar/proceduralAvatarRig';

export interface ScotlandNpcRig {
  root: THREE.Group;
  torso: THREE.Group;
  head: THREE.Group;
  rightArm: THREE.Group;
  leftArm: THREE.Group;
  leftEyelid: THREE.Mesh;
  rightEyelid: THREE.Mesh;
  propPivot: THREE.Group;
  dispose: () => void;
}

export interface HighlandTreeRig {
  root: THREE.Group;
  crownGroup: THREE.Group;
  dispose: () => void;
}

export interface HighlandBirdRig {
  root: THREE.Group;
  leftWing: THREE.Group;
  rightWing: THREE.Group;
  centerX: number;
  centerZ: number;
  radius: number;
  altitude: number;
  speed: number;
  phase: number;
  dispose: () => void;
}

export function createHighlandGrassTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#4E8248';
    ctx.fillRect(0, 0, 512, 512);

    const patches = ['#42733F', '#5C9151', '#679C58', '#4A794C', '#6F6392'];
    for (let i = 0; i < 480; i++) {
      const px = (i * 83) % 512;
      const py = (i * 149) % 512;
      const r = 7 + (i % 6) * 5;
      ctx.fillStyle = patches[i % patches.length];
      ctx.globalAlpha = i % 11 === 0 ? 0.14 : 0.24;
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
  tex.repeat.set(18, 18);
  tex.anisotropy = Math.min(8, maxAnisotropy);
  tex.needsUpdate = true;
  return tex;
}

export function createCobblestoneTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#737985';
    ctx.fillRect(0, 0, 256, 256);

    const stoneShades = ['#9BA3AE', '#8C94A0', '#A7AFB8', '#838A96', '#95999F'];
    let idx = 0;
    for (let row = 0; row < 8; row++) {
      const y = row * 32 + 3;
      const offset = (row % 2) * 16;
      for (let col = -1; col < 8; col++) {
        const x = col * 34 + offset + 2;
        ctx.fillStyle = stoneShades[idx % stoneShades.length];
        ctx.beginPath();
        ctx.roundRect(x, y, 28, 25, 6);
        ctx.fill();
        idx++;
      }
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(6, 6);
  tex.anisotropy = Math.min(8, maxAnisotropy);
  tex.needsUpdate = true;
  return tex;
}

export function createTartanTexture(
  baseHex: string,
  stripeAHex: string,
  stripeBHex: string,
  maxAnisotropy: number,
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = baseHex;
    ctx.fillRect(0, 0, 256, 256);

    ctx.globalAlpha = 0.55;
    ctx.fillStyle = stripeAHex;
    for (let i = 0; i < 256; i += 64) {
      ctx.fillRect(i, 0, 22, 256);
      ctx.fillRect(0, i, 256, 22);
    }

    ctx.globalAlpha = 0.72;
    ctx.fillStyle = stripeBHex;
    for (let i = 34; i < 256; i += 64) {
      ctx.fillRect(i, 0, 7, 256);
      ctx.fillRect(0, i, 256, 7);
    }

    ctx.globalAlpha = 0.85;
    ctx.fillStyle = '#F7F3E3';
    for (let i = 10; i < 256; i += 64) {
      ctx.fillRect(i, 0, 3, 256);
      ctx.fillRect(0, i, 256, 3);
    }
    ctx.globalAlpha = 1;
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = Math.min(8, maxAnisotropy);
  tex.needsUpdate = true;
  return tex;
}

export function createSignPosterTexture(
  title: string,
  subtitle: string,
  accentHex: string,
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#FAF6EB';
    ctx.fillRect(0, 0, 512, 256);
    ctx.fillStyle = accentHex;
    ctx.fillRect(0, 0, 512, 66);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText(title, 26, 44);

    ctx.fillStyle = '#20304A';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText(subtitle, 26, 118);

    // Subtle Scottish thistle & hills emblem
    ctx.fillStyle = '#4B7B58';
    ctx.beginPath();
    ctx.moveTo(40, 220);
    ctx.quadraticCurveTo(145, 160, 255, 220);
    ctx.quadraticCurveTo(360, 152, 470, 220);
    ctx.lineTo(470, 236);
    ctx.lineTo(40, 236);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#7E57A6';
    ctx.beginPath();
    ctx.arc(445, 134, 16, 0, Math.PI * 2);
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

function buildHeadEyesAndMouth(
  head: THREE.Group,
  skinMat: THREE.Material,
  hairMat: THREE.Material,
  irisColor: string,
  mouthColor: string,
  disposables: { dispose: () => void }[],
) {
  const scleraMat = new THREE.MeshStandardMaterial({ color: '#FFFFFF', roughness: 0.2, metalness: 0 });
  const irisMat = new THREE.MeshStandardMaterial({ color: irisColor, roughness: 0.22, metalness: 0.04 });
  const mouthMat = new THREE.MeshStandardMaterial({ color: mouthColor, roughness: 0.55, metalness: 0 });
  disposables.push(scleraMat, irisMat, mouthMat);

  const buildEye = (side: -1 | 1) => {
    const ex = side * 0.082;
    const ey = 0.225;
    const ez = 0.202;

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

    const brow = new THREE.Mesh(new THREE.CapsuleGeometry(0.0095, 0.044, 6, 8), hairMat);
    brow.position.set(ex, ey + 0.062, ez + 0.015);
    brow.rotation.z = Math.PI / 2 + side * 0.05;
    head.add(brow);
    return eyelid;
  };

  const leftEyelid = buildEye(-1);
  const rightEyelid = buildEye(1);

  const smile = new THREE.Mesh(
    new THREE.TorusGeometry(0.043, 0.0085, 8, 16, Math.PI * 0.78),
    mouthMat,
  );
  smile.position.set(0, 0.138, 0.22);
  smile.rotation.z = -Math.PI * 0.89;
  head.add(smile);

  return { leftEyelid, rightEyelid };
}

/**
 * Eilidh MacLeod: Teen Scottish student & exchange buddy.
 * Wears a modern teal outdoor windbreaker, woven tartan scarf, dark jeans, and small explorer backpack.
 */
export function createEilidhNpcRig(
  castShadow: boolean,
  maxAnisotropy: number,
): ScotlandNpcRig {
  const root = new THREE.Group();
  const disposables: { dispose: () => void }[] = [];

  const tartanScarfTex = createTartanTexture('#215B55', '#B93E38', '#E7B94B', maxAnisotropy);
  tartanScarfTex.repeat.set(2, 2);
  disposables.push(tartanScarfTex);

  const skinMat = new THREE.MeshStandardMaterial({ color: '#F3C9B2', roughness: 0.62, metalness: 0.02 });
  const cheekMat = new THREE.MeshStandardMaterial({ color: '#E89B8B', roughness: 0.7 });
  const hairMat = new THREE.MeshStandardMaterial({ color: '#9D4323', roughness: 0.58, metalness: 0.05 });
  const jacketMat = new THREE.MeshStandardMaterial({ color: '#2F6F73', roughness: 0.64, metalness: 0.04 });
  const jacketTrimMat = new THREE.MeshStandardMaterial({ color: '#204A4E', roughness: 0.68, metalness: 0.04 });
  const scarfMat = new THREE.MeshStandardMaterial({ map: tartanScarfTex, roughness: 0.86, metalness: 0.01 });
  const pantMat = new THREE.MeshStandardMaterial({ color: '#2C3C55', roughness: 0.82, metalness: 0.02 });
  const bootMat = new THREE.MeshStandardMaterial({ color: '#5D3C2A', roughness: 0.7, metalness: 0.04 });
  const packMat = new THREE.MeshStandardMaterial({ color: '#C8783A', roughness: 0.76, metalness: 0.02 });
  const zipMat = new THREE.MeshStandardMaterial({ color: '#F2C66D', roughness: 0.3, metalness: 0.6 });
  disposables.push(
    skinMat,
    cheekMat,
    hairMat,
    jacketMat,
    jacketTrimMat,
    scarfMat,
    pantMat,
    bootMat,
    packMat,
    zipMat,
  );

  const hips = new THREE.Group();
  hips.position.set(0, 0.6, 0);
  root.add(hips);

  [-1, 1].forEach((side) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.072, 0.058, 0.49, 12), pantMat);
    leg.position.set(side * 0.09, -0.28, 0);
    leg.castShadow = castShadow;
    hips.add(leg);

    const boot = new THREE.Mesh(new THREE.SphereGeometry(0.076, 12, 9), bootMat);
    boot.scale.set(0.92, 0.62, 1.3);
    boot.position.set(side * 0.09, -0.55, 0.03);
    boot.castShadow = castShadow;
    hips.add(boot);
  });

  const torso = new THREE.Group();
  torso.position.set(0, 0.03, 0);
  hips.add(torso);

  // Outdoor casual jacket (teen proportions slightly slimmer)
  const jacket = new THREE.Mesh(new THREE.CylinderGeometry(0.175, 0.165, 0.49, 18), jacketMat);
  jacket.scale.set(1.0, 1, 0.8);
  jacket.position.set(0, 0.24, 0);
  jacket.castShadow = castShadow;
  torso.add(jacket);

  const zipperLine = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.45, 0.02), zipMat);
  zipperLine.position.set(0, 0.24, 0.14);
  torso.add(zipperLine);

  const hem = new THREE.Mesh(new THREE.CylinderGeometry(0.172, 0.174, 0.055, 16), jacketTrimMat);
  hem.scale.set(1.0, 1, 0.82);
  hem.position.set(0, 0.02, 0);
  torso.add(hem);

  // Woven tartan scarf + front draped end
  const scarfRing = new THREE.Mesh(new THREE.TorusGeometry(0.115, 0.042, 10, 18), scarfMat);
  scarfRing.rotation.x = Math.PI / 2;
  scarfRing.position.set(0, 0.49, 0.01);
  scarfRing.castShadow = castShadow;
  torso.add(scarfRing);

  const scarfTail = new THREE.Mesh(new THREE.BoxGeometry(0.085, 0.23, 0.028), scarfMat);
  scarfTail.position.set(0.055, 0.37, 0.148);
  scarfTail.rotation.z = -0.1;
  torso.add(scarfTail);

  // Small backpack
  const pack = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.31, 0.13), packMat);
  pack.position.set(0, 0.27, -0.18);
  pack.castShadow = castShadow;
  torso.add(pack);
  const packFlap = new THREE.Mesh(new THREE.BoxGeometry(0.246, 0.08, 0.14), bootMat);
  packFlap.position.set(0, 0.39, -0.18);
  torso.add(packFlap);

  const buildArm = (side: -1 | 1) => {
    const pivot = new THREE.Group();
    pivot.position.set(side * 0.22, 0.44, 0);
    pivot.rotation.z = side * -0.16;
    torso.add(pivot);

    const sleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.056, 0.044, 0.34, 12), jacketMat);
    sleeve.position.set(0, -0.17, 0);
    sleeve.castShadow = castShadow;
    pivot.add(sleeve);

    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.048, 10, 8), skinMat);
    hand.position.set(0, -0.355, 0);
    pivot.add(hand);
    return pivot;
  };

  const leftArm = buildArm(-1);
  const rightArm = buildArm(1);

  // Held small notebook prop in left hand pivot
  const propPivot = new THREE.Group();
  propPivot.position.set(0, -0.34, 0.05);
  leftArm.add(propPivot);
  const notebook = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.15, 0.024), zipMat);
  propPivot.add(notebook);

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.058, 0.066, 0.09, 12), skinMat);
  neck.position.set(0, 0.52, 0);
  torso.add(neck);

  const head = new THREE.Group();
  head.position.set(0, 0.58, 0);
  torso.add(head);

  const cranium = new THREE.Mesh(new THREE.SphereGeometry(0.228, 22, 16), skinMat);
  cranium.scale.set(0.97, 1.03, 0.95);
  cranium.position.set(0, 0.215, 0);
  cranium.castShadow = castShadow;
  head.add(cranium);

  [-1, 1].forEach((side) => {
    const ear = new THREE.Mesh(new THREE.SphereGeometry(0.042, 10, 8), skinMat);
    ear.position.set(side * 0.218, 0.205, 0);
    ear.scale.set(0.65, 1, 0.75);
    head.add(ear);

    const blush = new THREE.Mesh(new THREE.SphereGeometry(0.028, 8, 8), cheekMat);
    blush.scale.set(1.2, 0.7, 0.45);
    blush.position.set(side * 0.125, 0.168, 0.185);
    head.add(blush);
  });

  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.022, 8, 8), skinMat);
  nose.position.set(0, 0.19, 0.222);
  head.add(nose);

  // Layered auburn wavy hair
  const hairCap = new THREE.Mesh(
    new THREE.SphereGeometry(0.236, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.58),
    hairMat,
  );
  hairCap.position.set(0, 0.232, -0.015);
  hairCap.rotation.x = -0.25;
  hairCap.castShadow = castShadow;
  head.add(hairCap);

  const hairLockPositions: [number, number, number, number][] = [
    [-0.195, 0.14, -0.04, 0.095],
    [0.195, 0.14, -0.04, 0.095],
    [-0.165, 0.03, -0.1, 0.09],
    [0.165, 0.03, -0.1, 0.09],
    [0, 0.12, -0.21, 0.135],
    [-0.09, 0.02, -0.19, 0.105],
    [0.09, 0.02, -0.19, 0.105],
  ];
  hairLockPositions.forEach(([hx, hy, hz, hr]) => {
    const lock = new THREE.Mesh(new THREE.SphereGeometry(hr, 10, 8), hairMat);
    lock.position.set(hx, hy, hz);
    lock.castShadow = castShadow;
    head.add(lock);
  });

  const { leftEyelid, rightEyelid } = buildHeadEyesAndMouth(
    head,
    skinMat,
    hairMat,
    '#2F6E64',
    '#B5524C',
    disposables,
  );

  // Scale slightly younger/teen height
  root.scale.setScalar(0.95);

  return {
    root,
    torso,
    head,
    rightArm,
    leftArm,
    leftEyelid,
    rightEyelid,
    propPivot,
    dispose: () => {
      disposeObjectGeometries(root);
      disposables.forEach((d) => d.dispose());
    },
  };
}

/**
 * Fiona Campbell: Adult local cultural heritage guide.
 * Wears practical Highland wool cardigan, cream blouse collar, woven tartan sash with pewter brooch, and heather-pinned bun.
 */
export function createFionaNpcRig(
  castShadow: boolean,
  maxAnisotropy: number,
): ScotlandNpcRig {
  const root = new THREE.Group();
  const disposables: { dispose: () => void }[] = [];

  const sashTex = createTartanTexture('#5F3D78', '#2C6A5B', '#F0D58C', maxAnisotropy);
  sashTex.repeat.set(2, 2);
  disposables.push(sashTex);

  const skinMat = new THREE.MeshStandardMaterial({ color: '#EEBFA6', roughness: 0.62, metalness: 0.02 });
  const hairMat = new THREE.MeshStandardMaterial({ color: '#5A4136', roughness: 0.62, metalness: 0.04 });
  const cardiganMat = new THREE.MeshStandardMaterial({ color: '#4E5F47', roughness: 0.84, metalness: 0.02 });
  const blouseMat = new THREE.MeshStandardMaterial({ color: '#F6F2E7', roughness: 0.78, metalness: 0.01 });
  const sashMat = new THREE.MeshStandardMaterial({ map: sashTex, roughness: 0.85, metalness: 0.02 });
  const trouserMat = new THREE.MeshStandardMaterial({ color: '#3F3A36', roughness: 0.86, metalness: 0.02 });
  const shoeMat = new THREE.MeshStandardMaterial({ color: '#4A3122', roughness: 0.68, metalness: 0.05 });
  const pewterMat = new THREE.MeshStandardMaterial({ color: '#C8D0D8', roughness: 0.28, metalness: 0.75 });
  const folioMat = new THREE.MeshStandardMaterial({ color: '#7D4E32', roughness: 0.72, metalness: 0.03 });
  disposables.push(
    skinMat,
    hairMat,
    cardiganMat,
    blouseMat,
    sashMat,
    trouserMat,
    shoeMat,
    pewterMat,
    folioMat,
  );

  const hips = new THREE.Group();
  hips.position.set(0, 0.64, 0);
  root.add(hips);

  [-1, 1].forEach((side) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.082, 0.068, 0.52, 12), trouserMat);
    leg.position.set(side * 0.095, -0.3, 0);
    leg.castShadow = castShadow;
    hips.add(leg);

    const shoe = new THREE.Mesh(new THREE.SphereGeometry(0.082, 12, 9), shoeMat);
    shoe.scale.set(0.95, 0.62, 1.32);
    shoe.position.set(side * 0.095, -0.59, 0.035);
    shoe.castShadow = castShadow;
    hips.add(shoe);
  });

  const torso = new THREE.Group();
  torso.position.set(0, 0.03, 0);
  hips.add(torso);

  const cardigan = new THREE.Mesh(new THREE.CylinderGeometry(0.195, 0.185, 0.53, 18), cardiganMat);
  cardigan.scale.set(1.02, 1, 0.82);
  cardigan.position.set(0, 0.26, 0);
  cardigan.castShadow = castShadow;
  torso.add(cardigan);

  const blouseCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.125, 0.07, 16), blouseMat);
  blouseCollar.position.set(0, 0.53, 0.01);
  torso.add(blouseCollar);

  // Diagonal Tartan Sash & Pewter Brooch Pin
  const sash = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.54, 0.34), sashMat);
  sash.position.set(-0.02, 0.28, 0.01);
  sash.rotation.z = -0.52;
  torso.add(sash);

  const brooch = new THREE.Mesh(new THREE.TorusGeometry(0.034, 0.01, 8, 16), pewterMat);
  brooch.position.set(-0.1, 0.42, 0.165);
  torso.add(brooch);

  const buildArm = (side: -1 | 1) => {
    const pivot = new THREE.Group();
    pivot.position.set(side * 0.24, 0.46, 0);
    pivot.rotation.z = side * -0.14;
    torso.add(pivot);

    const sleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.25, 12), cardiganMat);
    sleeve.position.set(0, -0.125, 0);
    sleeve.castShadow = castShadow;
    pivot.add(sleeve);

    const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.046, 0.038, 0.15, 10), skinMat);
    forearm.position.set(0, -0.305, 0);
    pivot.add(forearm);

    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.052, 10, 8), skinMat);
    hand.position.set(0, -0.39, 0);
    pivot.add(hand);
    return pivot;
  };

  const leftArm = buildArm(-1);
  const rightArm = buildArm(1);

  // Leather heritage field folio in left hand
  const propPivot = new THREE.Group();
  propPivot.position.set(0, -0.36, 0.06);
  leftArm.add(propPivot);
  const folio = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.21, 0.032), folioMat);
  propPivot.add(folio);
  const folioPages = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.19, 0.036), blouseMat);
  propPivot.add(folioPages);

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.064, 0.072, 0.1, 12), skinMat);
  neck.position.set(0, 0.56, 0);
  torso.add(neck);

  const head = new THREE.Group();
  head.position.set(0, 0.62, 0);
  torso.add(head);

  const cranium = new THREE.Mesh(new THREE.SphereGeometry(0.235, 22, 16), skinMat);
  cranium.scale.set(0.98, 1.04, 0.96);
  cranium.position.set(0, 0.22, 0);
  cranium.castShadow = castShadow;
  head.add(cranium);

  [-1, 1].forEach((side) => {
    const ear = new THREE.Mesh(new THREE.SphereGeometry(0.044, 10, 8), skinMat);
    ear.position.set(side * 0.225, 0.21, 0);
    ear.scale.set(0.65, 1, 0.75);
    head.add(ear);
  });
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), skinMat);
  nose.position.set(0, 0.195, 0.23);
  head.add(nose);

  // Smooth updo hairstyle with back chignon bun & heather-silver comb
  const hairCap = new THREE.Mesh(
    new THREE.SphereGeometry(0.242, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.56),
    hairMat,
  );
  hairCap.position.set(0, 0.24, -0.02);
  hairCap.rotation.x = -0.22;
  hairCap.castShadow = castShadow;
  head.add(hairCap);

  const bun = new THREE.Mesh(new THREE.SphereGeometry(0.115, 14, 10), hairMat);
  bun.position.set(0, 0.23, -0.235);
  bun.castShadow = castShadow;
  head.add(bun);

  const hairPin = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.028, 0.024), pewterMat);
  hairPin.position.set(0.04, 0.31, -0.21);
  hairPin.rotation.z = 0.25;
  head.add(hairPin);

  const { leftEyelid, rightEyelid } = buildHeadEyesAndMouth(
    head,
    skinMat,
    hairMat,
    '#3B5E7A',
    '#9A4D46',
    disposables,
  );

  return {
    root,
    torso,
    head,
    rightArm,
    leftArm,
    leftEyelid,
    rightEyelid,
    propPivot,
    dispose: () => {
      disposeObjectGeometries(root);
      disposables.forEach((d) => d.dispose());
    },
  };
}

/**
 * Scottish Highland Pine or Rowan tree with layered stylized canopy for breeze sway.
 */
export function createHighlandTreeRig(
  kind: 'pine' | 'rowan',
  scale: number,
  castShadow: boolean,
): HighlandTreeRig {
  const root = new THREE.Group();
  const disposables: { dispose: () => void }[] = [];

  const trunkMat = new THREE.MeshStandardMaterial({
    color: kind === 'pine' ? '#6B4834' : '#735744',
    roughness: 0.9,
    metalness: 0,
  });
  const needleMat = new THREE.MeshStandardMaterial({
    color: kind === 'pine' ? '#2E6647' : '#4E8244',
    roughness: 0.78,
    metalness: 0.02,
  });
  const needleTipMat = new THREE.MeshStandardMaterial({
    color: kind === 'pine' ? '#3B7B54' : '#65984D',
    roughness: 0.74,
    metalness: 0.02,
  });
  const berryMat = new THREE.MeshStandardMaterial({
    color: '#D6453A',
    roughness: 0.45,
    metalness: 0.04,
  });
  disposables.push(trunkMat, needleMat, needleTipMat, berryMat);

  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.28, 2.2, 10), trunkMat);
  trunk.position.set(0, 1.1, 0);
  trunk.castShadow = castShadow;
  trunk.receiveShadow = true;
  root.add(trunk);

  const crownGroup = new THREE.Group();
  crownGroup.position.set(0, 2.0, 0);
  root.add(crownGroup);

  if (kind === 'pine') {
    const tiers: [number, number, number, THREE.Material][] = [
      [1.45, 1.55, 0.35, needleMat],
      [1.15, 1.35, 1.15, needleTipMat],
      [0.82, 1.15, 1.85, needleMat],
    ];
    tiers.forEach(([r, h, py, mat]) => {
      const cone = new THREE.Mesh(new THREE.ConeGeometry(r, h, 9), mat);
      cone.position.set(0, py, 0);
      cone.castShadow = castShadow;
      cone.receiveShadow = true;
      crownGroup.add(cone);
    });
  } else {
    const clusters: [number, number, number, number, THREE.Material][] = [
      [0, 0.65, 0, 1.05, needleMat],
      [-0.65, 0.35, 0.3, 0.72, needleTipMat],
      [0.68, 0.4, -0.25, 0.75, needleTipMat],
      [0.15, 1.15, 0.15, 0.68, needleTipMat],
    ];
    clusters.forEach(([cx, cy, cz, cr, mat]) => {
      const puff = new THREE.Mesh(new THREE.DodecahedronGeometry(cr, 1), mat);
      puff.position.set(cx, cy, cz);
      puff.scale.set(1.1, 0.82, 1.1);
      puff.castShadow = castShadow;
      puff.receiveShadow = true;
      crownGroup.add(puff);
    });

    // Small decorative red rowan berry clusters
    const berrySpots: [number, number, number][] = [
      [-0.75, 0.25, 0.62],
      [0.72, 0.35, 0.48],
      [0.2, 0.8, 0.72],
    ];
    berrySpots.forEach(([bx, by, bz]) => {
      const b = new THREE.Mesh(new THREE.SphereGeometry(0.11, 8, 6), berryMat);
      b.position.set(bx, by, bz);
      crownGroup.add(b);
    });
  }

  root.scale.setScalar(scale);

  return {
    root,
    crownGroup,
    dispose: () => {
      disposeObjectGeometries(root);
      disposables.forEach((d) => d.dispose());
    },
  };
}

export function createHighlandBirdRig(
  centerX: number,
  centerZ: number,
  radius: number,
  altitude: number,
  speed: number,
  phase: number,
): HighlandBirdRig {
  const root = new THREE.Group();
  const bodyMat = new THREE.MeshStandardMaterial({ color: '#2F3D4C', roughness: 0.6 });
  const wingMat = new THREE.MeshStandardMaterial({ color: '#455A70', roughness: 0.62 });

  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.08, 0.26, 6, 8), bodyMat);
  body.rotation.x = Math.PI / 2;
  root.add(body);

  const leftWing = new THREE.Group();
  leftWing.position.set(-0.06, 0.02, 0);
  const leftBlade = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.025, 0.16), wingMat);
  leftBlade.position.set(-0.23, 0, 0);
  leftWing.add(leftBlade);
  root.add(leftWing);

  const rightWing = new THREE.Group();
  rightWing.position.set(0.06, 0.02, 0);
  const rightBlade = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.025, 0.16), wingMat);
  rightBlade.position.set(0.23, 0, 0);
  rightWing.add(rightBlade);
  root.add(rightWing);

  return {
    root,
    leftWing,
    rightWing,
    centerX,
    centerZ,
    radius,
    altitude,
    speed,
    phase,
    dispose: () => {
      disposeObjectGeometries(root);
      bodyMat.dispose();
      wingMat.dispose();
    },
  };
}
