import * as THREE from 'three';
import type { EgyptNpcId } from '../../data/egyptWorld';
import { disposeObjectGeometries } from '../avatar/proceduralAvatarRig';

export interface EgyptNpcRig {
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

export interface DatePalmRig {
  root: THREE.Group;
  crownGroup: THREE.Group;
  dispose: () => void;
}

export function createDesertSandTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#EBC58C';
    ctx.fillRect(0, 0, 512, 512);

    const bands = ['#EED09D', '#E4BC80', '#F1D7AB', '#DFB475'];
    for (let y = 0; y < 512; y += 16) {
      ctx.fillStyle = bands[(y / 16) % bands.length];
      ctx.globalAlpha = 0.28;
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x <= 512; x += 64) {
        ctx.quadraticCurveTo(x + 32, y + ((x + y) % 32 === 0 ? 5 : -5), x + 64, y);
      }
      ctx.lineTo(512, y + 16);
      ctx.lineTo(0, y + 16);
      ctx.closePath();
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    ctx.fillStyle = 'rgba(155, 108, 52, 0.1)';
    for (let i = 0; i < 480; i++) {
      ctx.fillRect((i * 89) % 512, (i * 151) % 512, 3, 2);
    }
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

export function createStonePathTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#D1A96E';
    ctx.fillRect(0, 0, 512, 512);
    const slabs = ['#DEC08E', '#D5B079', '#E4C89B', '#CAA36B'];
    let idx = 0;
    for (let row = 0; row < 8; row++) {
      const y = row * 64;
      const offset = (row % 2) * 32;
      for (let col = -1; col < 9; col++) {
        const x = col * 64 + offset;
        ctx.fillStyle = slabs[idx % slabs.length];
        ctx.fillRect(x + 3, y + 3, 58, 58);
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

export function createLimestoneCourseTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#D6A460';
    ctx.fillRect(0, 0, 512, 512);

    const blocks = ['#DFB371', '#D5A25D', '#E4BC7E', '#CCA05F'];
    const rowH = 32;
    const colW = 64;
    let idx = 0;
    for (let r = 0; r < 16; r++) {
      const y = r * rowH;
      const stagger = (r % 2) * (colW / 2);
      for (let c = -1; c < 9; c++) {
        const x = c * colW + stagger;
        ctx.fillStyle = blocks[idx % blocks.length];
        ctx.fillRect(x + 2, y + 2, colW - 4, rowH - 4);
        ctx.fillStyle = 'rgba(255, 245, 220, 0.18)';
        ctx.fillRect(x + 2, y + 2, colW - 4, 3);
        ctx.fillStyle = 'rgba(110, 74, 32, 0.16)';
        ctx.fillRect(x + 2, y + rowH - 5, colW - 4, 3);
        idx++;
      }
    }
    ctx.fillStyle = 'rgba(130, 88, 38, 0.08)';
    for (let i = 0; i < 320; i++) {
      ctx.fillRect((i * 113) % 512, (i * 179) % 512, 4, 2);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 3);
  tex.anisotropy = Math.min(8, maxAnisotropy);
  tex.needsUpdate = true;
  return tex;
}

export function createHieroglyphReliefTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#D8AE70';
    ctx.fillRect(0, 0, 512, 256);

    // Top & bottom lapis-turquoise inlaid architectural bands
    ctx.fillStyle = '#254EAC';
    ctx.fillRect(0, 10, 512, 16);
    ctx.fillRect(0, 230, 512, 16);
    ctx.fillStyle = '#12B8B0';
    ctx.fillRect(0, 30, 512, 8);
    ctx.fillRect(0, 218, 512, 8);

    // Carved fictional expedition register dividers
    ctx.strokeStyle = '#9A6D35';
    ctx.lineWidth = 4;
    for (let x = 16; x < 512; x += 120) {
      ctx.strokeRect(x, 50, 104, 156);
    }

    // Stylized decorative fictional motifs (sun disc, lotus, wave, reed compass)
    for (let i = 0; i < 4; i++) {
      const cx = 68 + i * 120;
      const cy = 128;

      // Sun medallion
      ctx.fillStyle = '#E7B43C';
      ctx.beginPath();
      ctx.arc(cx, cy - 36, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#8F6228';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Stylized lotus / chevron glyph
      ctx.fillStyle = i % 2 === 0 ? '#12B8B0' : '#254EAC';
      ctx.beginPath();
      ctx.moveTo(cx, cy - 8);
      ctx.lineTo(cx - 18, cy + 20);
      ctx.lineTo(cx + 18, cy + 20);
      ctx.closePath();
      ctx.fill();

      // Ripple line below
      ctx.strokeStyle = '#7C5324';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx - 26, cy + 44);
      ctx.lineTo(cx - 12, cy + 36);
      ctx.lineTo(cx, cy + 44);
      ctx.lineTo(cx + 12, cy + 36);
      ctx.lineTo(cx + 26, cy + 44);
      ctx.stroke();
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = Math.min(8, maxAnisotropy);
  tex.needsUpdate = true;
  return tex;
}

export function createNileWaterTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, '#14A3B8');
    grad.addColorStop(0.5, '#0F8DA7');
    grad.addColorStop(1, '#129BB4');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    for (let y = 16; y < 512; y += 28) {
      ctx.strokeStyle = y % 56 === 16 ? 'rgba(186, 246, 255, 0.28)' : 'rgba(8, 76, 97, 0.22)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x <= 512; x += 64) {
        ctx.quadraticCurveTo(x + 32, y + (x % 128 === 0 ? 7 : -7), x + 64, y);
      }
      ctx.stroke();
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(10, 4);
  tex.anisotropy = Math.min(8, maxAnisotropy);
  tex.needsUpdate = true;
  return tex;
}

export function createScrollArtworkTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#F8ECD0';
    ctx.fillRect(0, 0, 256, 256);
    ctx.strokeStyle = '#9C6B30';
    ctx.lineWidth = 6;
    ctx.strokeRect(10, 10, 236, 236);

    ctx.fillStyle = '#E7B43C';
    ctx.beginPath();
    ctx.arc(128, 66, 22, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#254EAC';
    ctx.fillRect(36, 106, 184, 10);
    ctx.fillStyle = '#12B8B0';
    ctx.fillRect(36, 132, 148, 10);
    ctx.fillStyle = '#B45309';
    ctx.fillRect(36, 158, 168, 10);
    ctx.fillStyle = '#254EAC';
    ctx.fillRect(36, 184, 122, 10);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = Math.min(8, maxAnisotropy);
  tex.needsUpdate = true;
  return tex;
}

export function createEgyptSignTexture(
  title: string,
  subtitle: string,
  bgHex: string,
  accentHex: string,
  maxAnisotropy: number,
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = bgHex;
    ctx.fillRect(0, 0, 512, 256);

    ctx.strokeStyle = accentHex;
    ctx.lineWidth = 10;
    ctx.strokeRect(12, 12, 488, 232);

    ctx.fillStyle = accentHex;
    ctx.fillRect(28, 30, 456, 16);

    ctx.fillStyle = '#FFFDF5';
    ctx.font = 'bold 38px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(title, 256, 124);

    ctx.fillStyle = '#E2E8F0';
    ctx.font = '600 22px system-ui, sans-serif';
    ctx.fillText(subtitle, 256, 182);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = Math.min(8, maxAnisotropy);
  tex.needsUpdate = true;
  return tex;
}

export function createExpeditionMapTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#F3E3BD';
    ctx.fillRect(0, 0, 256, 256);
    ctx.strokeStyle = '#9C7338';
    ctx.lineWidth = 5;
    ctx.strokeRect(10, 10, 236, 236);

    // River Nile ribbon
    ctx.fillStyle = '#12B8B0';
    ctx.fillRect(16, 204, 224, 28);

    // Paths
    ctx.strokeStyle = '#B87A3D';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(128, 198);
    ctx.lineTo(128, 48);
    ctx.moveTo(48, 124);
    ctx.lineTo(208, 124);
    ctx.stroke();

    // 5 landmarks dots
    const pts: [number, number, string][] = [
      [128, 178, '#12B8B0'],
      [128, 124, '#E7B43C'],
      [204, 124, '#12B8B0'],
      [52, 124, '#254EAC'],
      [128, 48, '#D97706'],
    ];
    pts.forEach(([x, y, col]) => {
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#131E31';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = Math.min(8, maxAnisotropy);
  tex.needsUpdate = true;
  return tex;
}

export function createSphinxMonumentGroup(
  sandstoneCourseMat: THREE.Material,
  sandstoneDarkMat: THREE.Material,
  lapisMat: THREE.Material,
  goldMat: THREE.Material,
): THREE.Group {
  const sphinx = new THREE.Group();

  // Tiered sandstone plinth (strictly inside 3.6 x 2.5 collision footprint)
  const plinthBottom = new THREE.Mesh(new THREE.BoxGeometry(3.55, 0.34, 2.45), sandstoneDarkMat);
  plinthBottom.position.y = 0.17;
  plinthBottom.castShadow = true;
  plinthBottom.receiveShadow = true;
  sphinx.add(plinthBottom);

  const plinthStep = new THREE.Mesh(new THREE.BoxGeometry(3.22, 0.22, 2.08), sandstoneCourseMat);
  plinthStep.position.y = 0.45;
  plinthStep.castShadow = true;
  plinthStep.receiveShadow = true;
  sphinx.add(plinthStep);

  // Carved reclining lion torso + haunches + rib shoulders
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.95, 0.92, 1.18), sandstoneCourseMat);
  body.position.set(-0.28, 0.96, 0);
  body.castShadow = true;
  body.receiveShadow = true;
  sphinx.add(body);

  const haunch = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.88, 1.34), sandstoneDarkMat);
  haunch.position.set(-0.88, 0.94, 0);
  haunch.castShadow = true;
  sphinx.add(haunch);

  const chest = new THREE.Mesh(new THREE.CylinderGeometry(0.56, 0.64, 1.12, 10), sandstoneCourseMat);
  chest.position.set(0.62, 1.06, 0);
  chest.castShadow = true;
  sphinx.add(chest);

  // Curled tail wrapping along right haunch
  const tail = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.08, 6, 12, Math.PI * 1.1), sandstoneDarkMat);
  tail.rotation.x = Math.PI / 2;
  tail.position.set(-1.18, 0.64, 0.56);
  sphinx.add(tail);

  // Extended front legs & carved stone paws
  for (const side of [-1, 1]) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(1.06, 0.32, 0.34), sandstoneCourseMat);
    leg.position.set(1.06, 0.72, side * 0.42);
    leg.castShadow = true;
    sphinx.add(leg);

    const paw = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.26, 0.4), sandstoneDarkMat);
    paw.position.set(1.42, 0.68, side * 0.42);
    paw.castShadow = true;
    sphinx.add(paw);
  }

  // Stylized Pharaoh head facing east (+X)
  const headPivot = new THREE.Group();
  headPivot.position.set(0.76, 1.88, 0);
  sphinx.add(headPivot);

  const face = new THREE.Mesh(new THREE.SphereGeometry(0.46, 16, 14), sandstoneCourseMat);
  face.scale.set(1.04, 1.08, 0.94);
  face.castShadow = true;
  headPivot.add(face);

  // Stylized brow ridge, nose & chin beard
  const nose = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.18, 0.11), sandstoneDarkMat);
  nose.position.set(0.45, -0.02, 0);
  headPivot.add(nose);

  const chinBeard = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.06, 0.28, 8), sandstoneDarkMat);
  chinBeard.position.set(0.35, -0.34, 0);
  chinBeard.rotation.z = 0.2;
  headPivot.add(chinBeard);

  // Layered Lapis & Gold Striped Nemes Headdress + Lappets
  const nemesCrown = new THREE.Mesh(
    new THREE.CylinderGeometry(0.58, 0.68, 0.78, 6),
    lapisMat,
  );
  nemesCrown.position.set(-0.08, 0.04, 0);
  nemesCrown.castShadow = true;
  headPivot.add(nemesCrown);

  const nemesGoldBand = new THREE.Mesh(
    new THREE.CylinderGeometry(0.6, 0.62, 0.11, 6),
    goldMat,
  );
  nemesGoldBand.position.set(-0.08, 0.22, 0);
  headPivot.add(nemesGoldBand);

  const uraeus = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.24, 6), goldMat);
  uraeus.position.set(0.42, 0.34, 0);
  uraeus.rotation.z = -0.35;
  headPivot.add(uraeus);

  for (const side of [-1, 1]) {
    const lappet = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.72, 0.2), lapisMat);
    lappet.position.set(0.16, -0.34, side * 0.42);
    lappet.rotation.z = -0.18;
    headPivot.add(lappet);

    const trim = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.14, 0.22), goldMat);
    trim.position.set(0.2, -0.62, side * 0.42);
    headPivot.add(trim);
  }

  return sphinx;
}

export function createPotteryAmphoraGroup(): THREE.Group {
  const cluster = new THREE.Group();
  const clayMat = new THREE.MeshStandardMaterial({ color: 0xb95f38, roughness: 0.72 });
  const glazeMat = new THREE.MeshStandardMaterial({ color: 0xe6d3b3, roughness: 0.56 });
  const reedBasketMat = new THREE.MeshStandardMaterial({ color: 0xc89b54, roughness: 0.85 });
  const stalkMat = new THREE.MeshStandardMaterial({ color: 0x3b8a5a, roughness: 0.75 });

  // Lathe-turned Egyptian clay amphorae
  const amphoraProfile = [
    new THREE.Vector2(0.01, 0),
    new THREE.Vector2(0.14, 0.04),
    new THREE.Vector2(0.26, 0.32),
    new THREE.Vector2(0.23, 0.56),
    new THREE.Vector2(0.09, 0.74),
    new THREE.Vector2(0.14, 0.88),
    new THREE.Vector2(0.11, 0.88),
  ];
  const tallJarGeo = new THREE.LatheGeometry(amphoraProfile, 14);
  const tallJar = new THREE.Mesh(tallJarGeo, clayMat);
  tallJar.position.set(-0.18, 0, -0.12);
  tallJar.castShadow = true;
  cluster.add(tallJar);

  const collarStripe = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.025, 6, 14), glazeMat);
  collarStripe.rotation.x = Math.PI / 2;
  collarStripe.position.set(-0.18, 0.62, -0.12);
  cluster.add(collarStripe);

  const medJar = new THREE.Mesh(tallJarGeo, glazeMat);
  medJar.scale.set(0.76, 0.72, 0.76);
  medJar.position.set(0.24, 0, -0.14);
  medJar.castShadow = true;
  cluster.add(medJar);

  // Woven reed basket holding upright Nile papyrus stalks
  const basket = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.19, 0.44, 12), reedBasketMat);
  basket.position.set(0.06, 0.22, 0.24);
  basket.castShadow = true;
  cluster.add(basket);

  const basketRim = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.03, 6, 14), reedBasketMat);
  basketRim.rotation.x = Math.PI / 2;
  basketRim.position.set(0.06, 0.44, 0.24);
  cluster.add(basketRim);

  const stalkGeo = new THREE.CylinderGeometry(0.018, 0.022, 0.82, 6);
  for (let i = 0; i < 4; i++) {
    const stalk = new THREE.Mesh(stalkGeo, stalkMat);
    const angle = (i / 4) * Math.PI * 2;
    stalk.position.set(0.06 + Math.cos(angle) * 0.07, 0.62, 0.24 + Math.sin(angle) * 0.07);
    stalk.rotation.z = (i % 2 === 0 ? 1 : -1) * 0.08;
    cluster.add(stalk);
  }

  return cluster;
}

export function createShorelineReedsGroup(): THREE.Group {
  const grp = new THREE.Group();
  const stalkMat = new THREE.MeshStandardMaterial({ color: 0x2f7d4d, roughness: 0.78 });
  const tuftMat = new THREE.MeshStandardMaterial({ color: 0x4ca862, roughness: 0.72, side: THREE.DoubleSide });
  const stalkGeo = new THREE.CylinderGeometry(0.022, 0.034, 1.35, 6);
  const tuftGeo = new THREE.ConeGeometry(0.16, 0.28, 6);

  const offsets: [number, number, number, number][] = [
    [0, 0, 0.08, 1.0],
    [-0.18, 0.1, -0.1, 0.88],
    [0.16, -0.08, 0.12, 0.94],
    [0.05, 0.18, -0.06, 0.8],
  ];
  offsets.forEach(([ox, oz, tilt, sc]) => {
    const stalk = new THREE.Mesh(stalkGeo, stalkMat);
    stalk.scale.setScalar(sc);
    stalk.position.set(ox, 0.62 * sc, oz);
    stalk.rotation.z = tilt;
    grp.add(stalk);

    const tuft = new THREE.Mesh(tuftGeo, tuftMat);
    tuft.scale.setScalar(sc);
    tuft.position.set(ox - tilt * 0.6, 1.28 * sc, oz);
    tuft.rotation.x = Math.PI;
    grp.add(tuft);
  });

  return grp;
}

export function createEgyptNpcRig(npcId: EgyptNpcId): EgyptNpcRig {
  const root = new THREE.Group();

  const palettes: Record<
    EgyptNpcId,
    {
      skin: number;
      shirt: number;
      vest: number;
      pants: number;
      hair: number;
      hat: number;
      hatBand: number;
      hasSunHat: boolean;
      hasHeadscarf: boolean;
      hasCap: boolean;
      hasCurlyHair: boolean;
      hasGlasses: boolean;
      glassesColor: number;
      hasSafetyStripes: boolean;
      hasScarfTrim: boolean;
      scarfTrimColor: number;
      hasBackHair: boolean;
      propColor: number;
    }
  > = {
    npc_layla: {
      // SVG portrait: Sun hat with turquoise band, dark shoulder hair, blue-rimmed glasses, khaki vest, white shirt, turquoise neck scarf
      skin: 0xd89e76,
      shirt: 0xfffdf7,
      vest: 0xd4ac72,
      pants: 0x544434,
      hair: 0x231917,
      hat: 0xead7b1,
      hatBand: 0x12b8b0,
      hasSunHat: true,
      hasHeadscarf: false,
      hasCap: false,
      hasCurlyHair: false,
      hasGlasses: true,
      glassesColor: 0x254eac,
      hasSafetyStripes: false,
      hasScarfTrim: true,
      scarfTrimColor: 0x12b8b0,
      hasBackHair: true,
      propColor: 0xe7b43c,
    },
    npc_omar: {
      // SVG portrait: Royal-blue cap with gold visor trim, bright orange safety vest with yellow stripes, khaki/cream shirt
      skin: 0xce936a,
      shirt: 0xf2ede1,
      vest: 0xea580c,
      pants: 0x3b352e,
      hair: 0x1f1918,
      hat: 0x254eac,
      hatBand: 0xe7b43c,
      hasSunHat: false,
      hasHeadscarf: false,
      hasCap: true,
      hasCurlyHair: false,
      hasGlasses: false,
      glassesColor: 0x1e293b,
      hasSafetyStripes: true,
      hasScarfTrim: false,
      scarfTrimColor: 0xfde68a,
      hasBackHair: false,
      propColor: 0x12b8b0,
    },
    npc_mariam: {
      // SVG portrait: Deep teal hijab headscarf (#0F766E) with turquoise front wrap, cream tunic, gold collar trim, no glasses
      skin: 0xdfaa82,
      shirt: 0xf8f1e3,
      vest: 0x14b8a6,
      pants: 0x2c3e50,
      hair: 0x1f1916,
      hat: 0x0f766e,
      hatBand: 0x14b8a6,
      hasSunHat: false,
      hasHeadscarf: true,
      hasCap: false,
      hasCurlyHair: false,
      hasGlasses: false,
      glassesColor: 0x1e293b,
      hasSafetyStripes: false,
      hasScarfTrim: true,
      scarfTrimColor: 0xe7b43c,
      hasBackHair: false,
      propColor: 0xe3c78d,
    },
    npc_karim: {
      // SVG portrait: Curly dark hair (no cap), indigo jacket (#1E3A8A), cream undershirt, gold tie/emblem accent
      skin: 0xc78a62,
      shirt: 0xf5e7c8,
      vest: 0x1e3a8a,
      pants: 0x3d3a37,
      hair: 0x1e1715,
      hat: 0x1e3a8a,
      hatBand: 0xe7b43c,
      hasSunHat: false,
      hasHeadscarf: false,
      hasCap: false,
      hasCurlyHair: true,
      hasGlasses: false,
      glassesColor: 0x1e293b,
      hasSafetyStripes: false,
      hasScarfTrim: true,
      scarfTrimColor: 0xe7b43c,
      hasBackHair: false,
      propColor: 0xe7b43c,
    },
  };

  const p = palettes[npcId];

  const skinMat = new THREE.MeshStandardMaterial({ color: p.skin, roughness: 0.62 });
  const shirtMat = new THREE.MeshStandardMaterial({ color: p.shirt, roughness: 0.72 });
  const vestMat = new THREE.MeshStandardMaterial({ color: p.vest, roughness: 0.58 });
  const pantsMat = new THREE.MeshStandardMaterial({ color: p.pants, roughness: 0.78 });
  const hairMat = new THREE.MeshStandardMaterial({ color: p.hair, roughness: 0.68 });
  const hatMat = new THREE.MeshStandardMaterial({ color: p.hat, roughness: 0.55 });
  const hatBandMat = new THREE.MeshStandardMaterial({ color: p.hatBand, roughness: 0.45 });
  const eyeMat = new THREE.MeshStandardMaterial({ color: 0x182235, roughness: 0.35 });
  const shoeMat = new THREE.MeshStandardMaterial({ color: 0x423022, roughness: 0.72 });
  const propMat = new THREE.MeshStandardMaterial({ color: p.propColor, roughness: 0.45 });

  // Legs + desert boots grounded at y = 0
  const legGeo = new THREE.CylinderGeometry(0.088, 0.075, 0.62, 10);
  const shoeGeo = new THREE.BoxGeometry(0.16, 0.11, 0.24);
  for (const side of [-1, 1]) {
    const leg = new THREE.Mesh(legGeo, pantsMat);
    leg.position.set(side * 0.125, 0.35, 0);
    leg.castShadow = true;
    root.add(leg);

    const shoe = new THREE.Mesh(shoeGeo, shoeMat);
    shoe.position.set(side * 0.125, 0.055, 0.03);
    shoe.castShadow = true;
    root.add(shoe);
  }

  // Torso
  const torso = new THREE.Group();
  torso.position.set(0, 0.96, 0);
  root.add(torso);

  const torsoMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.2, 0.58, 14),
    shirtMat,
  );
  torsoMesh.castShadow = true;
  torso.add(torsoMesh);

  // Utility vest / jacket / tunic overlay
  const vestMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.23, 0.215, 0.44, 14, 1, false, -Math.PI * 0.62, Math.PI * 1.24),
    vestMat,
  );
  vestMesh.position.y = -0.02;
  vestMesh.castShadow = true;
  torso.add(vestMesh);

  if (p.hasSafetyStripes) {
    const stripeMat = new THREE.MeshStandardMaterial({ color: 0xfde68a, roughness: 0.42 });
    const safetyBand = new THREE.Mesh(
      new THREE.CylinderGeometry(0.236, 0.232, 0.07, 14, 1, false, -Math.PI * 0.62, Math.PI * 1.24),
      stripeMat,
    );
    safetyBand.position.y = -0.06;
    torso.add(safetyBand);
  }

  if (p.hasScarfTrim) {
    const trimMat = new THREE.MeshStandardMaterial({ color: p.scarfTrimColor, roughness: 0.48 });
    const collarAccent = new THREE.Mesh(new THREE.TorusGeometry(0.145, 0.034, 8, 14), trimMat);
    collarAccent.rotation.x = Math.PI / 2;
    collarAccent.position.set(0, 0.24, 0.03);
    torso.add(collarAccent);

    if (npcId === 'npc_karim') {
      const goldEmblem = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.16, 0.04), trimMat);
      goldEmblem.position.set(0, 0.1, 0.215);
      torso.add(goldEmblem);
    }
  }

  // Arms (Karim wears full indigo jacket sleeves, others wear shirt sleeves)
  const armMat = npcId === 'npc_karim' ? vestMat : shirtMat;
  const upperArmGeo = new THREE.CylinderGeometry(0.068, 0.058, 0.42, 10);
  const handGeo = new THREE.SphereGeometry(0.068, 10, 8);

  const leftArm = new THREE.Group();
  leftArm.position.set(-0.29, 0.22, 0);
  torso.add(leftArm);
  const leftUpper = new THREE.Mesh(upperArmGeo, armMat);
  leftUpper.position.y = -0.18;
  leftUpper.castShadow = true;
  leftArm.add(leftUpper);
  const leftHand = new THREE.Mesh(handGeo, skinMat);
  leftHand.position.y = -0.4;
  leftArm.add(leftHand);

  const rightArm = new THREE.Group();
  rightArm.position.set(0.29, 0.22, 0);
  torso.add(rightArm);
  const rightUpper = new THREE.Mesh(upperArmGeo, armMat);
  rightUpper.position.y = -0.18;
  rightUpper.castShadow = true;
  rightArm.add(rightUpper);
  const rightHand = new THREE.Mesh(handGeo, skinMat);
  rightHand.position.y = -0.4;
  rightArm.add(rightHand);

  // Right-hand expedition prop
  const propPivot = new THREE.Group();
  propPivot.position.set(0, -0.4, 0.08);
  rightArm.add(propPivot);
  if (npcId === 'npc_mariam') {
    const scroll = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.28, 10), propMat);
    scroll.rotation.x = Math.PI * 0.38;
    propPivot.add(scroll);
  } else {
    const tablet = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.28, 0.03), propMat);
    tablet.rotation.x = -0.35;
    propPivot.add(tablet);
  }

  // Head
  const head = new THREE.Group();
  head.position.set(0, 0.45, 0);
  torso.add(head);

  const skull = new THREE.Mesh(new THREE.SphereGeometry(0.23, 18, 16), skinMat);
  skull.castShadow = true;
  head.add(skull);

  if (p.hasHeadscarf) {
    const drape = new THREE.Mesh(
      new THREE.SphereGeometry(0.252, 16, 14, 0, Math.PI * 2, 0, Math.PI * 0.68),
      hatMat,
    );
    drape.position.y = 0.02;
    drape.rotation.x = -0.22;
    head.add(drape);
    const browTrim = new THREE.Mesh(
      new THREE.TorusGeometry(0.22, 0.028, 8, 18, Math.PI * 1.15),
      hatBandMat,
    );
    browTrim.position.set(0, 0.06, 0.05);
    browTrim.rotation.z = -0.12;
    head.add(browTrim);
    const neckWrap = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.24, 0.16, 14), hatMat);
    neckWrap.position.y = -0.18;
    head.add(neckWrap);
  } else {
    const hairDome = new THREE.Mesh(
      new THREE.SphereGeometry(0.242, 16, 14, 0, Math.PI * 2, 0, Math.PI * 0.58),
      hairMat,
    );
    hairDome.position.y = 0.02;
    hairDome.rotation.x = -0.18;
    head.add(hairDome);

    if (p.hasBackHair) {
      const backHair = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.28, 0.14), hairMat);
      backHair.position.set(0, -0.09, -0.16);
      head.add(backHair);
    }

    if (p.hasCurlyHair) {
      const curlGeo = new THREE.SphereGeometry(0.085, 8, 8);
      [
        [0, 0.22, 0.08],
        [-0.13, 0.19, 0.09],
        [0.13, 0.19, 0.09],
        [-0.18, 0.11, 0.02],
        [0.18, 0.11, 0.02],
      ].forEach(([cx, cy, cz]) => {
        const curl = new THREE.Mesh(curlGeo, hairMat);
        curl.position.set(cx, cy, cz);
        head.add(curl);
      });
    }
  }

  if (p.hasSunHat) {
    const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.41, 0.41, 0.028, 20), hatMat);
    brim.position.set(0, 0.15, 0);
    head.add(brim);
    const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.23, 0.14, 16), hatMat);
    crown.position.set(0, 0.22, 0);
    head.add(crown);
    const band = new THREE.Mesh(new THREE.CylinderGeometry(0.233, 0.233, 0.04, 16), hatBandMat);
    band.position.set(0, 0.17, 0);
    head.add(band);
  } else if (p.hasCap) {
    const capCrown = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.24, 0.12, 14), hatMat);
    capCrown.position.set(0, 0.19, 0);
    head.add(capCrown);
    const visor = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.28, 0.025, 16, 1, false, -0.9, 1.8),
      hatBandMat,
    );
    visor.position.set(0, 0.14, 0.12);
    head.add(visor);
  }

  if (p.hasGlasses) {
    const frameMat = new THREE.MeshStandardMaterial({ color: p.glassesColor, roughness: 0.35 });
    const ringGeo = new THREE.TorusGeometry(0.048, 0.0085, 8, 14);
    for (const side of [-1, 1]) {
      const ring = new THREE.Mesh(ringGeo, frameMat);
      ring.position.set(side * 0.08, 0.02, 0.215);
      head.add(ring);
    }
    const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.012, 0.012), frameMat);
    bridge.position.set(0, 0.022, 0.22);
    head.add(bridge);
  }

  const eyeGeo = new THREE.SphereGeometry(0.028, 10, 8);
  const lidGeo = new THREE.BoxGeometry(0.072, 0.012, 0.04);
  const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
  leftEye.position.set(-0.08, 0.02, 0.205);
  head.add(leftEye);

  const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
  rightEye.position.set(0.08, 0.02, 0.205);
  head.add(rightEye);

  const leftEyelid = new THREE.Mesh(lidGeo, skinMat);
  leftEyelid.position.set(-0.08, 0.045, 0.215);
  leftEyelid.scale.y = 0.08;
  head.add(leftEyelid);

  const rightEyelid = new THREE.Mesh(lidGeo, skinMat);
  rightEyelid.position.set(0.08, 0.045, 0.215);
  rightEyelid.scale.y = 0.08;
  head.add(rightEyelid);

  return {
    root,
    torso,
    head,
    rightArm,
    leftArm,
    leftEyelid,
    rightEyelid,
    propPivot,
    dispose: () => disposeObjectGeometries(root),
  };
}

export function createDatePalmRig(scale = 1): DatePalmRig {
  const root = new THREE.Group();

  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x7c5334, roughness: 0.92 });
  const frondMat = new THREE.MeshStandardMaterial({
    color: 0x2e8b57,
    roughness: 0.72,
    side: THREE.DoubleSide,
  });

  const segGeo = new THREE.CylinderGeometry(0.14 * scale, 0.19 * scale, 0.95 * scale, 8);
  let curY = 0.46 * scale;
  let curX = 0;
  for (let i = 0; i < 4; i++) {
    const seg = new THREE.Mesh(segGeo, trunkMat);
    seg.position.set(curX, curY, 0);
    seg.rotation.z = -0.055 * i;
    seg.castShadow = true;
    root.add(seg);
    curY += 0.85 * scale;
    curX += 0.08 * scale;
  }

  const crownGroup = new THREE.Group();
  crownGroup.position.set(curX, curY - 0.14 * scale, 0);
  root.add(crownGroup);

  const dateMat = new THREE.MeshStandardMaterial({ color: 0x8b4513, roughness: 0.8 });
  const dateGeo = new THREE.SphereGeometry(0.14 * scale, 8, 8);
  for (let i = 0; i < 3; i++) {
    const ang = (i / 3) * Math.PI * 2;
    const dates = new THREE.Mesh(dateGeo, dateMat);
    dates.position.set(Math.cos(ang) * 0.15 * scale, -0.1 * scale, Math.sin(ang) * 0.15 * scale);
    crownGroup.add(dates);
  }

  const frondGeo = new THREE.ConeGeometry(0.45 * scale, 2.0 * scale, 4);
  for (let i = 0; i < 8; i++) {
    const yaw = (i / 8) * Math.PI * 2;
    const pivot = new THREE.Group();
    pivot.rotation.y = yaw;
    const blade = new THREE.Mesh(frondGeo, frondMat);
    blade.rotation.z = -Math.PI * 0.37;
    blade.position.set(0.88 * scale, 0.1 * scale, 0);
    blade.scale.set(0.34, 1, 0.92);
    blade.castShadow = true;
    pivot.add(blade);
    crownGroup.add(pivot);
  }

  return {
    root,
    crownGroup,
    dispose: () => disposeObjectGeometries(root),
  };
}

export function createFeluccaBoatGroup(): THREE.Group {
  const boat = new THREE.Group();
  const woodMat = new THREE.MeshStandardMaterial({ color: 0x7a502c, roughness: 0.7 });
  const deckMat = new THREE.MeshStandardMaterial({ color: 0xa67444, roughness: 0.78 });
  const trimMat = new THREE.MeshStandardMaterial({ color: 0x12b8b0, roughness: 0.55 });
  const coralTrimMat = new THREE.MeshStandardMaterial({ color: 0xed7852, roughness: 0.65 });
  const mastMat = new THREE.MeshStandardMaterial({ color: 0x5c3d22, roughness: 0.72 });
  const sailMat = new THREE.MeshStandardMaterial({
    color: 0xfdf7e6,
    roughness: 0.75,
    side: THREE.DoubleSide,
  });

  // Sculpted wooden Felucca hull with pointed bow & stern
  const hullShape = new THREE.Shape();
  hullShape.moveTo(0, 1.85);
  hullShape.quadraticCurveTo(0.7, 0.85, 0.65, -0.7);
  hullShape.quadraticCurveTo(0.55, -1.55, 0, -1.75);
  hullShape.quadraticCurveTo(-0.55, -1.55, -0.65, -0.7);
  hullShape.quadraticCurveTo(-0.7, 0.85, 0, 1.85);

  const hullGeo = new THREE.ExtrudeGeometry(hullShape, {
    depth: 0.42,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.04,
    bevelSegments: 2,
  });
  hullGeo.rotateX(Math.PI / 2);
  const hull = new THREE.Mesh(hullGeo, woodMat);
  hull.position.y = 0.44;
  hull.castShadow = true;
  boat.add(hull);

  // Wooden deck benches & turquoise waterline gunwale trim
  const deck = new THREE.Mesh(new THREE.BoxGeometry(0.96, 0.06, 2.35), deckMat);
  deck.position.set(0, 0.46, 0.05);
  boat.add(deck);

  for (const bz of [-0.65, 0.45]) {
    const bench = new THREE.Mesh(new THREE.BoxGeometry(0.84, 0.08, 0.24), trimMat);
    bench.position.set(0, 0.54, bz);
    boat.add(bench);
  }

  const hullStripe = new THREE.Mesh(new THREE.BoxGeometry(1.32, 0.09, 1.85), trimMat);
  hullStripe.position.set(0, 0.34, -0.05);
  boat.add(hullStripe);

  // Main mast + angled lateen yard spar
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.06, 3.55, 8), mastMat);
  mast.position.set(0, 2.05, 0.18);
  mast.castShadow = true;
  boat.add(mast);

  const yard = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.035, 3.35, 8), mastMat);
  yard.position.set(0, 2.55, -0.15);
  yard.rotation.x = Math.PI * 0.34;
  boat.add(yard);

  // Swept triangular Lateen sail with warm coral woven band
  const sail = new THREE.Mesh(new THREE.ConeGeometry(1.52, 2.9, 3), sailMat);
  sail.scale.set(0.065, 1, 1.28);
  sail.rotation.x = 0.22;
  sail.position.set(0, 2.22, -0.34);
  sail.castShadow = true;
  boat.add(sail);

  const sailStripe = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.16, 1.55), coralTrimMat);
  sailStripe.position.set(0, 1.48, -0.25);
  boat.add(sailStripe);

  return boat;
}

