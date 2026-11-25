import * as THREE from 'three';
import type { AustraliaNpcId } from '../../data/australiaWorld';
import { disposeObjectGeometries } from '../avatar/proceduralAvatarRig';

export interface SydneyNpcRig {
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

export interface CoastalPalmRig {
  root: THREE.Group;
  crownGroup: THREE.Group;
  dispose: () => void;
}

export interface HarbourGullRig {
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

export function createSandstonePlazaTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#E6D6BC';
    ctx.fillRect(0, 0, 512, 512);

    const shades = ['#EADBC4', '#DFCCA8', '#EFE2CE', '#D9C49E', '#E3D1B3'];
    let idx = 0;
    for (let row = 0; row < 16; row++) {
      const y = row * 32;
      const offset = (row % 2) * 32;
      for (let col = -1; col < 9; col++) {
        const x = col * 64 + offset;
        ctx.fillStyle = shades[idx % shades.length];
        ctx.fillRect(x + 2, y + 2, 60, 28);
        idx++;
      }
    }
    ctx.fillStyle = 'rgba(130, 108, 82, 0.08)';
    for (let i = 0; i < 320; i++) {
      ctx.fillRect((i * 73) % 512, (i * 139) % 512, 3, 3);
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

export function createBoardwalkPlankTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#8F6A44';
    ctx.fillRect(0, 0, 256, 256);

    const woodShades = ['#A67C52', '#9C724A', '#B0855B', '#926942'];
    for (let row = 0; row < 8; row++) {
      const y = row * 32 + 2;
      ctx.fillStyle = woodShades[row % woodShades.length];
      ctx.fillRect(0, y, 256, 28);
      ctx.fillStyle = '#6D4D2F';
      ctx.fillRect(((row * 71) % 220) + 12, y, 3, 28);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(14, 2);
  tex.anisotropy = Math.min(8, maxAnisotropy);
  tex.needsUpdate = true;
  return tex;
}

export function createParkLawnTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#4E9A57';
    ctx.fillRect(0, 0, 256, 256);
    const spots = ['#428C4A', '#5AA862', '#64B26C', '#48934F'];
    for (let i = 0; i < 240; i++) {
      ctx.fillStyle = spots[i % spots.length];
      ctx.globalAlpha = 0.25;
      ctx.beginPath();
      ctx.arc((i * 59) % 256, (i * 107) % 256, 5 + (i % 5) * 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 4);
  tex.anisotropy = Math.min(8, maxAnisotropy);
  tex.needsUpdate = true;
  return tex;
}

export function createAwningStripeTexture(
  colorA: string,
  colorB: string,
  maxAnisotropy: number,
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    for (let i = 0; i < 8; i++) {
      ctx.fillStyle = i % 2 === 0 ? colorA : colorB;
      ctx.fillRect(i * 32, 0, 32, 256);
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

export function createSydneySignTexture(
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
    ctx.fillRect(28, 30, 456, 18);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 42px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(title, 256, 122);

    ctx.fillStyle = '#E2E8F0';
    ctx.font = '600 24px system-ui, sans-serif';
    ctx.fillText(subtitle, 256, 184);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = Math.min(8, maxAnisotropy);
  tex.needsUpdate = true;
  return tex;
}

export function createTimetableBoardTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(0, 0, 512, 256);
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 8;
    ctx.strokeRect(10, 10, 492, 236);

    ctx.fillStyle = '#38BDF8';
    ctx.font = 'bold 28px system-ui, sans-serif';
    ctx.fillText('CITY TRANSIT · DEPARTURES', 32, 54);

    const rows = [
      ['T2 · Circular Quay', '2 min', '#34D399'],
      ['F4 · Darling Harbour', '5 min', '#FBBF24'],
      ['T8 · Harbour Gardens', '9 min', '#38BDF8'],
    ] as const;

    rows.forEach(([line, eta, col], i) => {
      const y = 104 + i * 48;
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(28, y - 28, 456, 36);
      ctx.fillStyle = '#F8FAFC';
      ctx.font = 'bold 22px system-ui, sans-serif';
      ctx.fillText(line, 44, y - 3);
      ctx.fillStyle = col;
      ctx.fillText(eta, 404, y - 3);
    });
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = Math.min(8, maxAnisotropy);
  tex.needsUpdate = true;
  return tex;
}

export function createSydneyNpcRig(npcId: AustraliaNpcId): SydneyNpcRig {
  const root = new THREE.Group();

  const palettes: Record<
    AustraliaNpcId,
    {
      skin: number;
      shirt: number;
      vest: number;
      pants: number;
      hair: number;
      hat: number;
      hasCap: boolean;
      hasGlasses: boolean;
      hasBun: boolean;
      propColor: number;
    }
  > = {
    npc_olivia: {
      skin: 0xf4c49c,
      shirt: 0xf8fafc,
      vest: 0x0ea5e9,
      pants: 0x2c4257,
      hair: 0xc9823a,
      hat: 0xf2c66d,
      hasCap: true,
      hasGlasses: false,
      hasBun: false,
      propColor: 0xf59e0b,
    },
    npc_noah: {
      skin: 0xe3a87e,
      shirt: 0x1e3a8a,
      vest: 0x38bdf8,
      pants: 0x1e293b,
      hair: 0x261d17,
      hat: 0x0f172a,
      hasCap: true,
      hasGlasses: false,
      hasBun: false,
      propColor: 0x38bdf8,
    },
    npc_mia: {
      skin: 0xf3c6a0,
      shirt: 0xfff7ed,
      vest: 0x0f766e,
      pants: 0x3b2f2f,
      hair: 0x1e1b18,
      hat: 0xea580c,
      hasCap: false,
      hasGlasses: false,
      hasBun: true,
      propColor: 0xea580c,
    },
    npc_jack: {
      skin: 0xefbb94,
      shirt: 0x0f766e,
      vest: 0xf2c66d,
      pants: 0x334155,
      hair: 0x7a502e,
      hat: 0x7c3aed,
      hasCap: false,
      hasGlasses: true,
      hasBun: false,
      propColor: 0x9333ea,
    },
  };

  const p = palettes[npcId];

  const skinMat = new THREE.MeshStandardMaterial({ color: p.skin, roughness: 0.6 });
  const shirtMat = new THREE.MeshStandardMaterial({ color: p.shirt, roughness: 0.72 });
  const vestMat = new THREE.MeshStandardMaterial({ color: p.vest, roughness: 0.58 });
  const pantsMat = new THREE.MeshStandardMaterial({ color: p.pants, roughness: 0.78 });
  const hairMat = new THREE.MeshStandardMaterial({ color: p.hair, roughness: 0.68 });
  const hatMat = new THREE.MeshStandardMaterial({ color: p.hat, roughness: 0.5 });
  const eyeMat = new THREE.MeshStandardMaterial({ color: 0x182235, roughness: 0.35 });
  const shoeMat = new THREE.MeshStandardMaterial({ color: 0x252d3b, roughness: 0.72 });
  const propMat = new THREE.MeshStandardMaterial({ color: p.propColor, roughness: 0.48 });

  // Legs + shoes grounded at y = 0
  const legGeo = new THREE.CylinderGeometry(0.088, 0.075, 0.62, 10);
  const shoeGeo = new THREE.BoxGeometry(0.16, 0.1, 0.24);
  for (const side of [-1, 1]) {
    const leg = new THREE.Mesh(legGeo, pantsMat);
    leg.position.set(side * 0.125, 0.35, 0);
    leg.castShadow = true;
    root.add(leg);

    const shoe = new THREE.Mesh(shoeGeo, shoeMat);
    shoe.position.set(side * 0.125, 0.05, 0.03);
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

  // Outer vest / apron
  const vestMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.23, 0.215, 0.44, 14, 1, false, -Math.PI * 0.62, Math.PI * 1.24),
    vestMat,
  );
  vestMesh.position.y = -0.02;
  vestMesh.castShadow = true;
  torso.add(vestMesh);

  // Arms
  const upperArmGeo = new THREE.CylinderGeometry(0.068, 0.058, 0.42, 10);
  const handGeo = new THREE.SphereGeometry(0.068, 10, 8);

  const leftArm = new THREE.Group();
  leftArm.position.set(-0.29, 0.22, 0);
  torso.add(leftArm);
  const leftUpper = new THREE.Mesh(upperArmGeo, shirtMat);
  leftUpper.position.y = -0.18;
  leftUpper.castShadow = true;
  leftArm.add(leftUpper);
  const leftHand = new THREE.Mesh(handGeo, skinMat);
  leftHand.position.y = -0.4;
  leftArm.add(leftHand);

  const rightArm = new THREE.Group();
  rightArm.position.set(0.29, 0.22, 0);
  torso.add(rightArm);
  const rightUpper = new THREE.Mesh(upperArmGeo, shirtMat);
  rightUpper.position.y = -0.18;
  rightUpper.castShadow = true;
  rightArm.add(rightUpper);
  const rightHand = new THREE.Mesh(handGeo, skinMat);
  rightHand.position.y = -0.4;
  rightArm.add(rightHand);

  // Prop in right hand (Explorer badge clipboard / coffee cup / guide map)
  const propPivot = new THREE.Group();
  propPivot.position.set(0, -0.4, 0.07);
  rightArm.add(propPivot);
  if (npcId === 'npc_mia') {
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.14, 10), propMat);
    cup.rotation.x = 0.2;
    propPivot.add(cup);
  } else {
    const clipboard = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.28, 0.03), propMat);
    clipboard.rotation.x = -0.35;
    propPivot.add(clipboard);
  }

  // Head
  const head = new THREE.Group();
  head.position.set(0, 0.45, 0);
  torso.add(head);

  const skull = new THREE.Mesh(new THREE.SphereGeometry(0.23, 18, 16), skinMat);
  skull.castShadow = true;
  head.add(skull);

  const hairDome = new THREE.Mesh(
    new THREE.SphereGeometry(0.242, 16, 14, 0, Math.PI * 2, 0, Math.PI * 0.58),
    hairMat,
  );
  hairDome.position.y = 0.02;
  hairDome.rotation.x = -0.18;
  head.add(hairDome);

  if (p.hasBun) {
    const bun = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 10), hairMat);
    bun.position.set(0, 0.25, -0.12);
    head.add(bun);
  }

  if (p.hasCap) {
    const capCrown = new THREE.Mesh(
      new THREE.CylinderGeometry(0.21, 0.24, 0.12, 14),
      hatMat,
    );
    capCrown.position.set(0, 0.19, 0);
    head.add(capCrown);

    const visor = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.025, 16, 1, false, -0.9, 1.8), hatMat);
    visor.position.set(0, 0.14, 0.12);
    head.add(visor);
  }

  if (p.hasGlasses) {
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.35 });
    const ringGeo = new THREE.TorusGeometry(0.048, 0.008, 8, 14);
    for (const side of [-1, 1]) {
      const ring = new THREE.Mesh(ringGeo, frameMat);
      ring.position.set(side * 0.08, 0.02, 0.215);
      head.add(ring);
    }
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

export function createCoastalPalmRig(scale = 1): CoastalPalmRig {
  const root = new THREE.Group();

  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x7c5a3c, roughness: 0.9 });
  const frondMat = new THREE.MeshStandardMaterial({
    color: 0x2e8b57,
    roughness: 0.72,
    side: THREE.DoubleSide,
  });

  // Curved multi-segment palm trunk grounded at y = 0
  const segGeo = new THREE.CylinderGeometry(0.14 * scale, 0.18 * scale, 0.95 * scale, 8);
  let curY = 0.46 * scale;
  let curX = 0;
  for (let i = 0; i < 4; i++) {
    const seg = new THREE.Mesh(segGeo, trunkMat);
    seg.position.set(curX, curY, 0);
    seg.rotation.z = -0.05 * i;
    seg.castShadow = true;
    root.add(seg);
    curY += 0.85 * scale;
    curX += 0.08 * scale;
  }

  const crownGroup = new THREE.Group();
  crownGroup.position.set(curX, curY - 0.15 * scale, 0);
  root.add(crownGroup);

  const coconutGeo = new THREE.SphereGeometry(0.16 * scale, 8, 8);
  const coconutMat = new THREE.MeshStandardMaterial({ color: 0x5c3d22, roughness: 0.85 });
  for (let i = 0; i < 3; i++) {
    const ang = (i / 3) * Math.PI * 2;
    const coco = new THREE.Mesh(coconutGeo, coconutMat);
    coco.position.set(Math.cos(ang) * 0.16 * scale, -0.1 * scale, Math.sin(ang) * 0.16 * scale);
    crownGroup.add(coco);
  }

  const frondGeo = new THREE.ConeGeometry(0.44 * scale, 1.9 * scale, 4);
  for (let i = 0; i < 7; i++) {
    const yaw = (i / 7) * Math.PI * 2;
    const frondPivot = new THREE.Group();
    frondPivot.rotation.y = yaw;
    const blade = new THREE.Mesh(frondGeo, frondMat);
    blade.rotation.z = -Math.PI * 0.36;
    blade.position.set(0.85 * scale, 0.12 * scale, 0);
    blade.scale.set(0.35, 1, 0.9);
    blade.castShadow = true;
    frondPivot.add(blade);
    crownGroup.add(frondPivot);
  }

  return {
    root,
    crownGroup,
    dispose: () => disposeObjectGeometries(root),
  };
}

export function createHarbourGullRig(params: {
  centerX: number;
  centerZ: number;
  radius: number;
  altitude: number;
  speed: number;
  phase: number;
}): HarbourGullRig {
  const root = new THREE.Group();
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5 });
  const tipMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.55 });

  const body = new THREE.Mesh(new THREE.SphereGeometry(0.11, 8, 6), bodyMat);
  body.scale.set(0.75, 0.7, 1.9);
  root.add(body);

  const wingGeo = new THREE.BoxGeometry(0.44, 0.025, 0.13);
  const leftWing = new THREE.Group();
  const lMesh = new THREE.Mesh(wingGeo, bodyMat);
  lMesh.position.x = -0.22;
  leftWing.add(lMesh);
  const lTip = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.025, 0.1), tipMat);
  lTip.position.x = -0.45;
  leftWing.add(lTip);
  root.add(leftWing);

  const rightWing = new THREE.Group();
  const rMesh = new THREE.Mesh(wingGeo, bodyMat);
  rMesh.position.x = 0.22;
  rightWing.add(rMesh);
  const rTip = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.025, 0.1), tipMat);
  rTip.position.x = 0.45;
  rightWing.add(rTip);
  root.add(rightWing);

  return {
    root,
    leftWing,
    rightWing,
    ...params,
    dispose: () => disposeObjectGeometries(root),
  };
}
