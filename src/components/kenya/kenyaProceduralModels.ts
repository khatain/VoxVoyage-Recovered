import * as THREE from 'three';
import { disposeObjectGeometries } from '../avatar/proceduralAvatarRig';

export interface AminaNpcRig {
  root: THREE.Group;
  torso: THREE.Group;
  head: THREE.Group;
  rightArm: THREE.Group;
  leftArm: THREE.Group;
  leftEyelid: THREE.Mesh;
  rightEyelid: THREE.Mesh;
  dispose: () => void;
}

export interface TouristNpcRig extends AminaNpcRig {
  propPivot: THREE.Group;
}

export interface AnimatedElephantRig {
  root: THREE.Group;
  trunkBase: THREE.Group;
  trunkTip: THREE.Group;
  leftEar: THREE.Group;
  rightEar: THREE.Group;
  tail: THREE.Mesh;
  phaseOffset: number;
  dispose: () => void;
}

export interface AnimatedGiraffeRig {
  root: THREE.Group;
  neckPivot: THREE.Group;
  headPivot: THREE.Group;
  tail: THREE.Mesh;
  phaseOffset: number;
  baseYaw: number;
  dispose: () => void;
}

export interface AnimatedZebraRig {
  root: THREE.Group;
  neckPivot: THREE.Group;
  tail: THREE.Mesh;
  phaseOffset: number;
  dispose: () => void;
}

export interface SoaringBirdRig {
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

function createGiraffePatternTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#E8BE6E';
    ctx.fillRect(0, 0, 256, 256);
    ctx.fillStyle = '#99532A';
    const spots: [number, number, number, number][] = [
      [24, 24, 28, 22],
      [78, 18, 30, 24],
      [138, 28, 26, 24],
      [198, 20, 32, 26],
      [42, 74, 34, 26],
      [104, 72, 28, 28],
      [164, 78, 30, 24],
      [220, 74, 26, 28],
      [18, 130, 28, 30],
      [74, 134, 32, 26],
      [132, 128, 30, 30],
      [194, 136, 30, 24],
      [46, 188, 30, 28],
      [108, 190, 28, 26],
      [166, 194, 32, 26],
      [222, 186, 24, 28],
      [20, 234, 26, 18],
      [88, 236, 28, 18],
      [152, 234, 26, 18],
      [212, 232, 28, 18],
    ];
    for (const [x, y, w, h] of spots) {
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 6);
      ctx.fill();
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = Math.min(8, maxAnisotropy);
  tex.needsUpdate = true;
  return tex;
}

function createZebraStripeTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#F3EFE4';
    ctx.fillRect(0, 0, 256, 256);
    ctx.fillStyle = '#25262E';
    for (let x = 0; x < 256; x += 28) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + 14, 0);
      ctx.lineTo(x + 20, 128);
      ctx.lineTo(x + 10, 256);
      ctx.lineTo(x - 4, 256);
      ctx.lineTo(x + 6, 128);
      ctx.closePath();
      ctx.fill();
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = Math.min(8, maxAnisotropy);
  tex.needsUpdate = true;
  return tex;
}

export function createAminaNpcRig(castShadow: boolean): AminaNpcRig {
  const root = new THREE.Group();

  const skinMat = new THREE.MeshStandardMaterial({ color: '#7A4A33', roughness: 0.62, metalness: 0.02 });
  const hairMat = new THREE.MeshStandardMaterial({ color: '#1B181E', roughness: 0.65, metalness: 0.04 });
  const shirtMat = new THREE.MeshStandardMaterial({ color: '#5F744A', roughness: 0.78, metalness: 0.02 });
  const shirtTrimMat = new THREE.MeshStandardMaterial({ color: '#475A36', roughness: 0.8, metalness: 0.02 });
  const pantMat = new THREE.MeshStandardMaterial({ color: '#B89D72', roughness: 0.84, metalness: 0.01 });
  const hatMat = new THREE.MeshStandardMaterial({ color: '#CEAF76', roughness: 0.78, metalness: 0.02 });
  const beltMat = new THREE.MeshStandardMaterial({ color: '#533827', roughness: 0.62, metalness: 0.06 });
  const badgeMat = new THREE.MeshStandardMaterial({ color: '#F2C66D', roughness: 0.25, metalness: 0.78 });
  const scleraMat = new THREE.MeshStandardMaterial({ color: '#FFFFFF', roughness: 0.2, metalness: 0 });
  const irisMat = new THREE.MeshStandardMaterial({ color: '#1B1822', roughness: 0.2, metalness: 0.04 });
  const mouthMat = new THREE.MeshStandardMaterial({ color: '#5C2C24', roughness: 0.55, metalness: 0 });

  const hips = new THREE.Group();
  hips.position.set(0, 0.64, 0);
  root.add(hips);

  [-1, 1].forEach((side) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.065, 0.52, 12), pantMat);
    leg.position.set(side * 0.095, -0.3, 0);
    leg.castShadow = castShadow;
    hips.add(leg);

    const boot = new THREE.Mesh(new THREE.SphereGeometry(0.082, 12, 9), beltMat);
    boot.scale.set(0.95, 0.64, 1.34);
    boot.position.set(side * 0.095, -0.59, 0.035);
    boot.castShadow = castShadow;
    hips.add(boot);
  });

  const torso = new THREE.Group();
  torso.position.set(0, 0.03, 0);
  hips.add(torso);

  // Ranger khaki-olive uniform shirt
  const shirt = new THREE.Mesh(new THREE.CylinderGeometry(0.195, 0.175, 0.52, 18), shirtMat);
  shirt.scale.set(1.02, 1, 0.82);
  shirt.position.set(0, 0.26, 0);
  shirt.castShadow = castShadow;
  torso.add(shirt);

  // Collar + Ranger utility belt + brass buckle + pocket badge
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.125, 0.065, 16), shirtTrimMat);
  collar.position.set(0, 0.53, 0);
  torso.add(collar);

  const belt = new THREE.Mesh(new THREE.CylinderGeometry(0.184, 0.184, 0.055, 18), beltMat);
  belt.scale.set(1.03, 1, 0.84);
  belt.position.set(0, 0.05, 0);
  torso.add(belt);

  const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.068, 0.064, 0.03), badgeMat);
  buckle.position.set(0, 0.05, 0.155);
  torso.add(buckle);

  const rangerBadge = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.036, 0.02, 12), badgeMat);
  rangerBadge.rotation.x = Math.PI / 2;
  rangerBadge.position.set(0.09, 0.37, 0.162);
  torso.add(rangerBadge);

  [-0.088, 0.088].forEach((px) => {
    const pocket = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.085, 0.024), shirtTrimMat);
    pocket.position.set(px, 0.27, 0.156);
    torso.add(pocket);
  });

  // Arms
  const buildArm = (side: -1 | 1) => {
    const pivot = new THREE.Group();
    pivot.position.set(side * 0.24, 0.46, 0);
    pivot.rotation.z = side * -0.15;
    torso.add(pivot);

    const sleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.052, 0.21, 12), shirtMat);
    sleeve.position.set(0, -0.105, 0);
    sleeve.castShadow = castShadow;
    pivot.add(sleeve);

    const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.04, 0.18, 10), skinMat);
    forearm.position.set(0, -0.275, 0);
    forearm.castShadow = castShadow;
    pivot.add(forearm);

    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.054, 10, 8), skinMat);
    hand.position.set(0, -0.38, 0);
    pivot.add(hand);
    return pivot;
  };

  const leftArm = buildArm(-1);
  const rightArm = buildArm(1);

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.066, 0.074, 0.1, 12), skinMat);
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

  [-1, 1].forEach((side) => {
    const ear = new THREE.Mesh(new THREE.SphereGeometry(0.048, 10, 8), skinMat);
    ear.position.set(side * 0.228, 0.21, 0);
    ear.scale.set(0.65, 1, 0.75);
    head.add(ear);
  });
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.026, 8, 8), skinMat);
  nose.position.set(0, 0.195, 0.235);
  head.add(nose);

  // Textured braided/curly hair beneath the safari hat
  const hairPuffs: [number, number, number, number][] = [
    [-0.19, 0.14, -0.06, 0.085],
    [0.19, 0.14, -0.06, 0.085],
    [-0.15, 0.10, -0.17, 0.092],
    [0.15, 0.10, -0.17, 0.092],
    [0, 0.09, -0.22, 0.098],
  ];
  hairPuffs.forEach(([hx, hy, hz, hr]) => {
    const puff = new THREE.Mesh(new THREE.SphereGeometry(hr, 10, 8), hairMat);
    puff.position.set(hx, hy, hz);
    puff.castShadow = castShadow;
    head.add(puff);
  });

  // Classic wide-brimmed Safari Ranger Hat
  const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.39, 0.41, 0.036, 22), hatMat);
  brim.position.set(0, 0.365, -0.01);
  brim.rotation.x = -0.08;
  brim.castShadow = castShadow;
  head.add(brim);

  const hatCrown = new THREE.Mesh(new THREE.CylinderGeometry(0.20, 0.23, 0.14, 18), hatMat);
  hatCrown.position.set(0, 0.445, -0.015);
  hatCrown.rotation.x = -0.08;
  hatCrown.castShadow = castShadow;
  head.add(hatCrown);

  const hatBand = new THREE.Mesh(new THREE.CylinderGeometry(0.228, 0.234, 0.04, 18), beltMat);
  hatBand.position.set(0, 0.395, -0.012);
  hatBand.rotation.x = -0.08;
  head.add(hatBand);

  const buildEye = (side: -1 | 1) => {
    const ex = side * 0.084;
    const ey = 0.23;
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

    const brow = new THREE.Mesh(new THREE.CapsuleGeometry(0.01, 0.046, 6, 8), hairMat);
    brow.position.set(ex, ey + 0.064, ez + 0.015);
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
        shirtMat,
        shirtTrimMat,
        pantMat,
        hatMat,
        beltMat,
        badgeMat,
        scleraMat,
        irisMat,
        mouthMat,
      ].forEach((m) => m.dispose());
    },
  };
}

export function createElephantRig(
  scale: number,
  phaseOffset: number,
  castShadow: boolean,
): AnimatedElephantRig {
  const root = new THREE.Group();
  root.scale.setScalar(scale);

  const hideMat = new THREE.MeshStandardMaterial({ color: '#7D848E', roughness: 0.88, metalness: 0.02 });
  const earInnerMat = new THREE.MeshStandardMaterial({ color: '#9E8587', roughness: 0.82, metalness: 0.01 });
  const tuskMat = new THREE.MeshStandardMaterial({ color: '#F7EEDB', roughness: 0.35, metalness: 0.08 });
  const eyeMat = new THREE.MeshStandardMaterial({ color: '#1F2028', roughness: 0.3 });

  // Torso body
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.86, 18, 14), hideMat);
  body.scale.set(0.95, 0.92, 1.32);
  body.position.set(0, 1.18, 0);
  body.castShadow = castShadow;
  body.receiveShadow = true;
  root.add(body);

  // 4 Pillar legs
  const legOffsets: [number, number][] = [
    [-0.45, 0.56],
    [0.45, 0.56],
    [-0.44, -0.58],
    [0.44, -0.58],
  ];
  legOffsets.forEach(([lx, lz]) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.24, 0.96, 12), hideMat);
    leg.position.set(lx, 0.48, lz);
    leg.castShadow = castShadow;
    leg.receiveShadow = true;
    root.add(leg);
  });

  // Head
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.56, 16, 12), hideMat);
  head.position.set(0, 1.52, 1.02);
  head.castShadow = castShadow;
  root.add(head);

  [-1, 1].forEach((side) => {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 8), eyeMat);
    eye.position.set(side * 0.34, 1.62, 1.42);
    root.add(eye);

    const tusk = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.075, 0.62, 10), tuskMat);
    tusk.position.set(side * 0.22, 1.24, 1.48);
    tusk.rotation.x = Math.PI * 0.34;
    tusk.rotation.z = side * -0.18;
    tusk.castShadow = castShadow;
    root.add(tusk);
  });

  // Flapping Ears
  const buildEar = (side: -1 | 1) => {
    const earPivot = new THREE.Group();
    earPivot.position.set(side * 0.46, 1.58, 0.85);
    const earMesh = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.86, 0.1), hideMat);
    earMesh.position.set(side * 0.3, -0.04, 0);
    earMesh.rotation.y = side * -0.35;
    earMesh.castShadow = castShadow;
    earPivot.add(earMesh);

    const earInner = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.64, 0.06), earInnerMat);
    earInner.position.set(side * 0.3, -0.04, 0.04);
    earInner.rotation.y = side * -0.35;
    earPivot.add(earInner);
    root.add(earPivot);
    return earPivot;
  };
  const leftEar = buildEar(-1);
  const rightEar = buildEar(1);

  // Articulated 2-part Trunk
  const trunkBase = new THREE.Group();
  trunkBase.position.set(0, 1.36, 1.52);
  root.add(trunkBase);

  const upperTrunk = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.11, 0.56, 12), hideMat);
  upperTrunk.position.set(0, -0.25, 0.08);
  upperTrunk.rotation.x = 0.24;
  upperTrunk.castShadow = castShadow;
  trunkBase.add(upperTrunk);

  const trunkTip = new THREE.Group();
  trunkTip.position.set(0, -0.5, 0.15);
  trunkBase.add(trunkTip);

  const lowerTrunk = new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.072, 0.48, 10), hideMat);
  lowerTrunk.position.set(0, -0.22, 0.06);
  lowerTrunk.rotation.x = -0.25;
  lowerTrunk.castShadow = castShadow;
  trunkTip.add(lowerTrunk);

  const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.045, 0.52, 8), hideMat);
  tail.position.set(0, 1.02, -1.16);
  tail.rotation.x = -0.32;
  root.add(tail);

  return {
    root,
    trunkBase,
    trunkTip,
    leftEar,
    rightEar,
    tail,
    phaseOffset,
    dispose: () => {
      disposeObjectGeometries(root);
      [hideMat, earInnerMat, tuskMat, eyeMat].forEach((m) => m.dispose());
    },
  };
}

export function createGiraffeRig(
  scale: number,
  phaseOffset: number,
  baseYaw: number,
  castShadow: boolean,
  maxAnisotropy: number,
): AnimatedGiraffeRig {
  const root = new THREE.Group();
  root.scale.setScalar(scale);
  root.rotation.y = baseYaw;

  const coatTex = createGiraffePatternTexture(maxAnisotropy);
  const coatMat = new THREE.MeshStandardMaterial({ map: coatTex, roughness: 0.82, metalness: 0.01 });
  const tanMat = new THREE.MeshStandardMaterial({ color: '#E8BE6E', roughness: 0.84, metalness: 0.01 });
  const darkMat = new THREE.MeshStandardMaterial({ color: '#4A3122', roughness: 0.72, metalness: 0.02 });

  // Torso
  const torso = new THREE.Mesh(new THREE.SphereGeometry(0.54, 16, 12), coatMat);
  torso.scale.set(0.84, 0.92, 1.38);
  torso.position.set(0, 1.62, 0);
  torso.castShadow = castShadow;
  root.add(torso);

  // 4 Slender Legs
  const legs: [number, number][] = [
    [-0.25, 0.44],
    [0.25, 0.44],
    [-0.25, -0.46],
    [0.25, -0.46],
  ];
  legs.forEach(([lx, lz]) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.058, 1.56, 10), tanMat);
    leg.position.set(lx, 0.78, lz);
    leg.castShadow = castShadow;
    root.add(leg);

    const hoof = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.075, 0.1, 8), darkMat);
    hoof.position.set(lx, 0.05, lz);
    root.add(hoof);
  });

  // Neck + Head
  const neckPivot = new THREE.Group();
  neckPivot.position.set(0, 1.88, 0.48);
  root.add(neckPivot);

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.24, 1.65, 12), coatMat);
  neck.position.set(0, 0.78, 0.14);
  neck.rotation.x = 0.18;
  neck.castShadow = castShadow;
  neckPivot.add(neck);

  const mane = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.55, 0.08), darkMat);
  mane.position.set(0, 0.8, -0.02);
  mane.rotation.x = 0.18;
  neckPivot.add(mane);

  const headPivot = new THREE.Group();
  headPivot.position.set(0, 1.58, 0.28);
  neckPivot.add(headPivot);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 10), tanMat);
  head.scale.set(0.88, 0.9, 1.38);
  head.position.set(0, 0, 0.1);
  head.castShadow = castShadow;
  headPivot.add(head);

  const muzzle = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 8), darkMat);
  muzzle.position.set(0, -0.04, 0.3);
  headPivot.add(muzzle);

  [-0.07, 0.07].forEach((ox) => {
    const ossicone = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.024, 0.18, 8), darkMat);
    ossicone.position.set(ox, 0.2, 0.02);
    headPivot.add(ossicone);
  });

  const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.032, 0.65, 8), tanMat);
  tail.position.set(0, 1.32, -0.78);
  tail.rotation.x = -0.25;
  root.add(tail);

  return {
    root,
    neckPivot,
    headPivot,
    tail,
    phaseOffset,
    baseYaw,
    dispose: () => {
      disposeObjectGeometries(root);
      coatTex.dispose();
      [coatMat, tanMat, darkMat].forEach((m) => m.dispose());
    },
  };
}

export function createZebraRig(
  scale: number,
  phaseOffset: number,
  yaw: number,
  castShadow: boolean,
  maxAnisotropy: number,
): AnimatedZebraRig {
  const root = new THREE.Group();
  root.scale.setScalar(scale);
  root.rotation.y = yaw;

  const stripeTex = createZebraStripeTexture(maxAnisotropy);
  const stripeMat = new THREE.MeshStandardMaterial({ map: stripeTex, roughness: 0.78, metalness: 0.02 });
  const darkMat = new THREE.MeshStandardMaterial({ color: '#24252C', roughness: 0.72, metalness: 0.02 });

  const body = new THREE.Mesh(new THREE.SphereGeometry(0.45, 16, 12), stripeMat);
  body.scale.set(0.86, 0.9, 1.36);
  body.position.set(0, 0.96, 0);
  body.castShadow = castShadow;
  root.add(body);

  const legOffsets: [number, number][] = [
    [-0.2, 0.36],
    [0.2, 0.36],
    [-0.2, -0.38],
    [0.2, -0.38],
  ];
  legOffsets.forEach(([lx, lz]) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.052, 0.84, 10), stripeMat);
    leg.position.set(lx, 0.42, lz);
    leg.castShadow = castShadow;
    root.add(leg);
    const hoof = new THREE.Mesh(new THREE.CylinderGeometry(0.056, 0.06, 0.08, 8), darkMat);
    hoof.position.set(lx, 0.04, lz);
    root.add(hoof);
  });

  const neckPivot = new THREE.Group();
  neckPivot.position.set(0, 1.06, 0.46);
  root.add(neckPivot);

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.2, 0.62, 12), stripeMat);
  neck.position.set(0, 0.28, 0.12);
  neck.rotation.x = 0.46;
  neck.castShadow = castShadow;
  neckPivot.add(neck);

  const mane = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.56, 0.09), darkMat);
  mane.position.set(0, 0.32, 0.04);
  mane.rotation.x = 0.46;
  neckPivot.add(mane);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.15, 12, 10), stripeMat);
  head.scale.set(0.82, 0.88, 1.42);
  head.position.set(0, 0.52, 0.35);
  head.rotation.x = 0.42;
  head.castShadow = castShadow;
  neckPivot.add(head);

  const muzzle = new THREE.Mesh(new THREE.SphereGeometry(0.092, 10, 8), darkMat);
  muzzle.position.set(0, 0.45, 0.52);
  neckPivot.add(muzzle);

  [-0.08, 0.08].forEach((ex) => {
    const ear = new THREE.Mesh(new THREE.ConeGeometry(0.042, 0.14, 6), darkMat);
    ear.position.set(ex, 0.65, 0.25);
    neckPivot.add(ear);
  });

  const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.032, 0.46, 8), darkMat);
  tail.position.set(0, 0.78, -0.64);
  tail.rotation.x = -0.3;
  root.add(tail);

  return {
    root,
    neckPivot,
    tail,
    phaseOffset,
    dispose: () => {
      disposeObjectGeometries(root);
      stripeTex.dispose();
      [stripeMat, darkMat].forEach((m) => m.dispose());
    },
  };
}

export function createSoaringBird(
  centerX: number,
  centerZ: number,
  radius: number,
  altitude: number,
  speed: number,
  phase: number,
): SoaringBirdRig {
  const root = new THREE.Group();
  const birdMat = new THREE.MeshStandardMaterial({ color: '#394358', roughness: 0.75 });

  const body = new THREE.Mesh(new THREE.ConeGeometry(0.065, 0.36, 6), birdMat);
  body.rotation.x = Math.PI / 2;
  root.add(body);

  const leftWing = new THREE.Group();
  const lBlade = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.02, 0.14), birdMat);
  lBlade.position.set(-0.21, 0, 0);
  leftWing.add(lBlade);
  root.add(leftWing);

  const rightWing = new THREE.Group();
  const rBlade = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.02, 0.14), birdMat);
  rBlade.position.set(0.21, 0, 0);
  rightWing.add(rBlade);
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
      birdMat.dispose();
    },
  };
}

/**
 * NPC 1: Emma (Curious Tourist)
 * Warm coral-terracotta vest over cream explorer tee, slate-teal trousers,
 * chestnut ponytail + headband, and hanging metallic field binoculars.
 */
export function createEmmaTouristRig(castShadow: boolean): TouristNpcRig {
  const root = new THREE.Group();

  const skinMat = new THREE.MeshStandardMaterial({ color: '#F0C0A0', roughness: 0.6, metalness: 0.02 });
  const hairMat = new THREE.MeshStandardMaterial({ color: '#6E3B23', roughness: 0.62, metalness: 0.04 });
  const headbandMat = new THREE.MeshStandardMaterial({ color: '#24B8B0', roughness: 0.55, metalness: 0.04 });
  const teeMat = new THREE.MeshStandardMaterial({ color: '#FFF6E6', roughness: 0.8, metalness: 0.01 });
  const vestMat = new THREE.MeshStandardMaterial({ color: '#E07A5F', roughness: 0.72, metalness: 0.03 });
  const pantMat = new THREE.MeshStandardMaterial({ color: '#395C6B', roughness: 0.82, metalness: 0.02 });
  const bootMat = new THREE.MeshStandardMaterial({ color: '#8A5633', roughness: 0.68, metalness: 0.04 });
  const packMat = new THREE.MeshStandardMaterial({ color: '#D49A45', roughness: 0.76, metalness: 0.03 });
  const binocBodyMat = new THREE.MeshStandardMaterial({ color: '#242A36', roughness: 0.35, metalness: 0.65 });
  const binocBrassMat = new THREE.MeshStandardMaterial({ color: '#F2C66D', roughness: 0.25, metalness: 0.8 });
  const lensGlassMat = new THREE.MeshStandardMaterial({ color: '#6FD3E8', roughness: 0.14, metalness: 0.35 });
  const scleraMat = new THREE.MeshStandardMaterial({ color: '#FFFFFF', roughness: 0.2, metalness: 0 });
  const irisMat = new THREE.MeshStandardMaterial({ color: '#28527A', roughness: 0.2, metalness: 0.05 });
  const mouthMat = new THREE.MeshStandardMaterial({ color: '#B2524D', roughness: 0.52, metalness: 0 });

  const hips = new THREE.Group();
  hips.position.set(0, 0.62, 0);
  root.add(hips);

  [-1, 1].forEach((side) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.074, 0.06, 0.5, 12), pantMat);
    leg.position.set(side * 0.09, -0.29, 0);
    leg.castShadow = castShadow;
    hips.add(leg);

    const boot = new THREE.Mesh(new THREE.SphereGeometry(0.078, 12, 9), bootMat);
    boot.scale.set(0.95, 0.64, 1.32);
    boot.position.set(side * 0.09, -0.57, 0.035);
    boot.castShadow = castShadow;
    hips.add(boot);
  });

  const torso = new THREE.Group();
  torso.position.set(0, 0.03, 0);
  hips.add(torso);

  const tee = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.165, 0.5, 18), teeMat);
  tee.scale.set(0.98, 1, 0.78);
  tee.position.set(0, 0.25, 0);
  tee.castShadow = castShadow;
  torso.add(tee);

  // Coral explorer vest panels + collar
  const vestBack = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.44, 0.15), vestMat);
  vestBack.position.set(0, 0.24, -0.055);
  vestBack.castShadow = castShadow;
  torso.add(vestBack);
  [-0.1, 0.1].forEach((vx) => {
    const flap = new THREE.Mesh(new THREE.BoxGeometry(0.125, 0.43, 0.09), vestMat);
    flap.position.set(vx, 0.24, 0.095);
    flap.castShadow = castShadow;
    torso.add(flap);
  });

  // Compact tan daypack on back
  const daypack = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.3, 0.13), packMat);
  daypack.position.set(0, 0.27, -0.18);
  daypack.castShadow = castShadow;
  torso.add(daypack);

  // Hanging Safari Binoculars on front strap
  const propPivot = new THREE.Group();
  propPivot.position.set(0, 0.29, 0.175);
  torso.add(propPivot);

  const strap = new THREE.Mesh(new THREE.TorusGeometry(0.145, 0.011, 6, 16, Math.PI), binocBodyMat);
  strap.position.set(0, 0.16, -0.03);
  strap.rotation.z = Math.PI;
  strap.rotation.x = 0.28;
  propPivot.add(strap);

  [-0.042, 0.042].forEach((bx) => {
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.034, 0.11, 10), binocBodyMat);
    barrel.rotation.x = Math.PI / 2 - 0.18;
    barrel.position.set(bx, 0, 0.03);
    propPivot.add(barrel);

    const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.016, 10), binocBrassMat);
    rim.rotation.x = Math.PI / 2 - 0.18;
    rim.position.set(bx, -0.01, 0.082);
    propPivot.add(rim);

    const lens = new THREE.Mesh(new THREE.CircleGeometry(0.026, 10), lensGlassMat);
    lens.position.set(bx, -0.012, 0.091);
    lens.rotation.x = -0.18;
    propPivot.add(lens);
  });
  const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.022, 0.035), binocBrassMat);
  bridge.position.set(0, 0, 0.03);
  propPivot.add(bridge);

  const buildArm = (side: -1 | 1) => {
    const pivot = new THREE.Group();
    pivot.position.set(side * 0.225, 0.44, 0);
    pivot.rotation.z = side * -0.16;
    torso.add(pivot);

    const sleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.056, 0.048, 0.16, 12), teeMat);
    sleeve.position.set(0, -0.08, 0);
    sleeve.castShadow = castShadow;
    pivot.add(sleeve);

    const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.043, 0.036, 0.21, 10), skinMat);
    forearm.position.set(0, -0.245, 0);
    forearm.castShadow = castShadow;
    pivot.add(forearm);

    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 8), skinMat);
    hand.position.set(0, -0.365, 0);
    pivot.add(hand);
    return pivot;
  };
  const leftArm = buildArm(-1);
  const rightArm = buildArm(1);

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.068, 0.1, 12), skinMat);
  neck.position.set(0, 0.54, 0);
  torso.add(neck);

  const head = new THREE.Group();
  head.position.set(0, 0.6, 0);
  torso.add(head);

  const cranium = new THREE.Mesh(new THREE.SphereGeometry(0.23, 22, 16), skinMat);
  cranium.scale.set(0.96, 1.04, 0.96);
  cranium.position.set(0, 0.21, 0);
  cranium.castShadow = castShadow;
  head.add(cranium);

  // Chestnut hair cap + sweeping ponytail + turquoise safari headband
  const hairCap = new THREE.Mesh(
    new THREE.SphereGeometry(0.242, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.6),
    hairMat,
  );
  hairCap.position.set(0, 0.225, -0.02);
  hairCap.rotation.x = -0.24;
  hairCap.castShadow = castShadow;
  head.add(hairCap);

  const ponyTailUpper = new THREE.Mesh(new THREE.SphereGeometry(0.092, 12, 10), hairMat);
  ponyTailUpper.scale.set(0.9, 1.35, 1.0);
  ponyTailUpper.position.set(0, 0.23, -0.255);
  ponyTailUpper.rotation.x = 0.35;
  head.add(ponyTailUpper);

  const ponyTailTip = new THREE.Mesh(new THREE.ConeGeometry(0.068, 0.17, 10), hairMat);
  ponyTailTip.position.set(0, 0.11, -0.295);
  ponyTailTip.rotation.x = Math.PI - 0.24;
  head.add(ponyTailTip);

  const headband = new THREE.Mesh(new THREE.TorusGeometry(0.236, 0.022, 8, 22), headbandMat);
  headband.position.set(0, 0.32, 0.01);
  headband.rotation.x = Math.PI / 2 - 0.28;
  head.add(headband);

  [-1, 1].forEach((side) => {
    const ear = new THREE.Mesh(new THREE.SphereGeometry(0.044, 10, 8), skinMat);
    ear.position.set(side * 0.218, 0.2, 0);
    ear.scale.set(0.65, 1, 0.75);
    head.add(ear);
  });
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.024, 8, 8), skinMat);
  nose.position.set(0, 0.188, 0.226);
  head.add(nose);

  const buildEye = (side: -1 | 1) => {
    const ex = side * 0.08;
    const ey = 0.222;
    const ez = 0.196;
    const sclera = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 10), scleraMat);
    sclera.scale.set(0.95, 1.08, 0.65);
    sclera.position.set(ex, ey, ez);
    head.add(sclera);

    const iris = new THREE.Mesh(new THREE.SphereGeometry(0.021, 10, 8), irisMat);
    iris.scale.set(1, 1.08, 0.55);
    iris.position.set(ex, ey, ez + 0.015);
    head.add(iris);

    const eyelid = new THREE.Mesh(
      new THREE.SphereGeometry(0.038, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.54),
      skinMat,
    );
    eyelid.scale.set(1, 1.1, 0.72);
    eyelid.position.set(ex, ey, ez + 0.002);
    eyelid.rotation.x = -Math.PI * 0.42;
    head.add(eyelid);

    const brow = new THREE.Mesh(new THREE.CapsuleGeometry(0.009, 0.044, 6, 8), hairMat);
    brow.position.set(ex, ey + 0.062, ez + 0.014);
    brow.rotation.z = Math.PI / 2 + side * 0.08;
    head.add(brow);
    return eyelid;
  };

  const leftEyelid = buildEye(-1);
  const rightEyelid = buildEye(1);

  const smile = new THREE.Mesh(
    new THREE.TorusGeometry(0.042, 0.009, 8, 16, Math.PI * 0.8),
    mouthMat,
  );
  smile.position.set(0, 0.138, 0.212);
  smile.rotation.z = -Math.PI * 0.9;
  head.add(smile);

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
      [
        skinMat,
        hairMat,
        headbandMat,
        teeMat,
        vestMat,
        pantMat,
        bootMat,
        packMat,
        binocBodyMat,
        binocBrassMat,
        lensGlassMat,
        scleraMat,
        irisMat,
        mouthMat,
      ].forEach((m) => m.dispose());
    },
  };
}

/**
 * NPC 2: Daniel (Conservation Visitor)
 * Taller visitor frame in forest-teal outdoor field jacket & tan cargo trousers,
 * wavy dark hair, round conservation glasses, and a DSLR safari camera on chest strap.
 */
export function createDanielTouristRig(castShadow: boolean): TouristNpcRig {
  const root = new THREE.Group();
  root.scale.setScalar(1.06);

  const skinMat = new THREE.MeshStandardMaterial({ color: '#C68C64', roughness: 0.62, metalness: 0.02 });
  const hairMat = new THREE.MeshStandardMaterial({ color: '#2B211A', roughness: 0.68, metalness: 0.04 });
  const jacketMat = new THREE.MeshStandardMaterial({ color: '#386853', roughness: 0.78, metalness: 0.02 });
  const shirtInnerMat = new THREE.MeshStandardMaterial({ color: '#ECE5D4', roughness: 0.82, metalness: 0.01 });
  const pantMat = new THREE.MeshStandardMaterial({ color: '#B09872', roughness: 0.84, metalness: 0.01 });
  const bootMat = new THREE.MeshStandardMaterial({ color: '#4A3222', roughness: 0.65, metalness: 0.05 });
  const camBodyMat = new THREE.MeshStandardMaterial({ color: '#20242E', roughness: 0.36, metalness: 0.55 });
  const camTrimMat = new THREE.MeshStandardMaterial({ color: '#CBD5E1', roughness: 0.26, metalness: 0.78 });
  const camLensMat = new THREE.MeshStandardMaterial({ color: '#38B2CE', roughness: 0.14, metalness: 0.4 });
  const glassFrameMat = new THREE.MeshStandardMaterial({ color: '#2D3442', roughness: 0.32, metalness: 0.65 });
  const scleraMat = new THREE.MeshStandardMaterial({ color: '#FFFFFF', roughness: 0.2, metalness: 0 });
  const irisMat = new THREE.MeshStandardMaterial({ color: '#2C1F1A', roughness: 0.2, metalness: 0.04 });
  const mouthMat = new THREE.MeshStandardMaterial({ color: '#783B32', roughness: 0.54, metalness: 0 });

  const hips = new THREE.Group();
  hips.position.set(0, 0.65, 0);
  root.add(hips);

  [-1, 1].forEach((side) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.082, 0.068, 0.54, 12), pantMat);
    leg.position.set(side * 0.098, -0.31, 0);
    leg.castShadow = castShadow;
    hips.add(leg);

    const boot = new THREE.Mesh(new THREE.SphereGeometry(0.084, 12, 9), bootMat);
    boot.scale.set(0.95, 0.64, 1.34);
    boot.position.set(side * 0.098, -0.6, 0.036);
    boot.castShadow = castShadow;
    hips.add(boot);
  });

  const torso = new THREE.Group();
  torso.position.set(0, 0.03, 0);
  hips.add(torso);

  const jacket = new THREE.Mesh(new THREE.CylinderGeometry(0.205, 0.184, 0.54, 18), jacketMat);
  jacket.scale.set(1.04, 1, 0.84);
  jacket.position.set(0, 0.27, 0);
  jacket.castShadow = castShadow;
  torso.add(jacket);

  const innerCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.12, 0.075, 16), shirtInnerMat);
  innerCollar.position.set(0, 0.54, 0.01);
  torso.add(innerCollar);

  // DSLR Camera on neck strap
  const propPivot = new THREE.Group();
  propPivot.position.set(0, 0.28, 0.185);
  torso.add(propPivot);

  const strap = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.011, 6, 16, Math.PI), camBodyMat);
  strap.position.set(0, 0.18, -0.035);
  strap.rotation.z = Math.PI;
  strap.rotation.x = 0.28;
  propPivot.add(strap);

  const camBody = new THREE.Mesh(new THREE.BoxGeometry(0.145, 0.096, 0.065), camBodyMat);
  camBody.castShadow = castShadow;
  propPivot.add(camBody);

  const camTop = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.028, 0.056), camTrimMat);
  camTop.position.set(0, 0.058, 0);
  propPivot.add(camTop);

  const shutterBtn = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.014, 8), camTrimMat);
  shutterBtn.position.set(-0.048, 0.054, 0.01);
  propPivot.add(shutterBtn);

  const camLensBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.034, 0.038, 0.078, 12), camBodyMat);
  camLensBarrel.rotation.x = Math.PI / 2;
  camLensBarrel.position.set(0, -0.005, 0.062);
  propPivot.add(camLensBarrel);

  const camLensRing = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.036, 0.016, 12), camTrimMat);
  camLensRing.rotation.x = Math.PI / 2;
  camLensRing.position.set(0, -0.005, 0.09);
  propPivot.add(camLensRing);

  const camGlass = new THREE.Mesh(new THREE.CircleGeometry(0.028, 12), camLensMat);
  camGlass.position.set(0, -0.005, 0.102);
  propPivot.add(camGlass);

  const buildArm = (side: -1 | 1) => {
    const pivot = new THREE.Group();
    pivot.position.set(side * 0.245, 0.47, 0);
    pivot.rotation.z = side * -0.14;
    torso.add(pivot);

    const sleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.064, 0.054, 0.23, 12), jacketMat);
    sleeve.position.set(0, -0.115, 0);
    sleeve.castShadow = castShadow;
    pivot.add(sleeve);

    const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.04, 0.18, 10), skinMat);
    forearm.position.set(0, -0.295, 0);
    forearm.castShadow = castShadow;
    pivot.add(forearm);

    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.054, 10, 8), skinMat);
    hand.position.set(0, -0.4, 0);
    pivot.add(hand);
    return pivot;
  };
  const leftArm = buildArm(-1);
  const rightArm = buildArm(1);

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.076, 0.1, 12), skinMat);
  neck.position.set(0, 0.57, 0);
  torso.add(neck);

  const head = new THREE.Group();
  head.position.set(0, 0.63, 0);
  torso.add(head);

  const cranium = new THREE.Mesh(new THREE.SphereGeometry(0.24, 22, 16), skinMat);
  cranium.scale.set(0.98, 1.04, 0.96);
  cranium.position.set(0, 0.22, 0);
  cranium.castShadow = castShadow;
  head.add(cranium);

  // Short wavy swept hair crown
  const hairTop = new THREE.Mesh(
    new THREE.SphereGeometry(0.248, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.55),
    hairMat,
  );
  hairTop.position.set(0, 0.235, -0.02);
  hairTop.rotation.x = -0.22;
  hairTop.castShadow = castShadow;
  head.add(hairTop);

  [
    [-0.08, 0.44, 0.06, 0.085],
    [0.04, 0.45, 0.08, 0.095],
    [0.14, 0.42, 0.02, 0.075],
    [0, 0.17, -0.22, 0.11],
  ].forEach(([hx, hy, hz, hr]) => {
    const wave = new THREE.Mesh(new THREE.SphereGeometry(hr, 10, 8), hairMat);
    wave.position.set(hx, hy, hz);
    wave.scale.set(1.2, 0.72, 1.05);
    head.add(wave);
  });

  [-1, 1].forEach((side) => {
    const ear = new THREE.Mesh(new THREE.SphereGeometry(0.048, 10, 8), skinMat);
    ear.position.set(side * 0.228, 0.21, 0);
    ear.scale.set(0.65, 1, 0.75);
    head.add(ear);
  });
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.027, 8, 8), skinMat);
  nose.position.set(0, 0.195, 0.235);
  head.add(nose);

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

    const brow = new THREE.Mesh(new THREE.CapsuleGeometry(0.01, 0.046, 6, 8), hairMat);
    brow.position.set(ex, ey + 0.064, ez + 0.015);
    brow.rotation.z = Math.PI / 2 + side * 0.04;
    head.add(brow);

    // Classic visitor eyeglasses rim
    const glassRim = new THREE.Mesh(new THREE.TorusGeometry(0.047, 0.006, 6, 16), glassFrameMat);
    glassRim.position.set(ex, ey, ez + 0.032);
    head.add(glassRim);

    return eyelid;
  };

  const leftEyelid = buildEye(-1);
  const rightEyelid = buildEye(1);

  const glassBridge = new THREE.Mesh(new THREE.BoxGeometry(0.072, 0.01, 0.01), glassFrameMat);
  glassBridge.position.set(0, 0.236, 0.237);
  head.add(glassBridge);

  const smile = new THREE.Mesh(
    new THREE.TorusGeometry(0.044, 0.009, 8, 16, Math.PI * 0.78),
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
    propPivot,
    dispose: () => {
      disposeObjectGeometries(root);
      [
        skinMat,
        hairMat,
        jacketMat,
        shirtInnerMat,
        pantMat,
        bootMat,
        camBodyMat,
        camTrimMat,
        camLensMat,
        glassFrameMat,
        scleraMat,
        irisMat,
        mouthMat,
      ].forEach((m) => m.dispose());
    },
  };
}

