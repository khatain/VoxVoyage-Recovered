import * as THREE from 'three';
import type { AvatarConfig } from '../../types/game';

const _colorTemp = new THREE.Color();

export interface AvatarMaterials {
  skin: THREE.MeshStandardMaterial;
  hair: THREE.MeshStandardMaterial;
  outfitPrimary: THREE.MeshStandardMaterial;
  outfitSecondary: THREE.MeshStandardMaterial;
  shirtLight: THREE.MeshStandardMaterial;
  pants: THREE.MeshStandardMaterial;
  boot: THREE.MeshStandardMaterial;
  brass: THREE.MeshStandardMaterial;
  backpack: THREE.MeshStandardMaterial;
  packStrap: THREE.MeshStandardMaterial;
  sclera: THREE.MeshStandardMaterial;
  iris: THREE.MeshStandardMaterial;
  highlight: THREE.MeshBasicMaterial;
  blush: THREE.MeshBasicMaterial;
  mouth: THREE.MeshStandardMaterial;
}

export interface AvatarPartsRef {
  hips: THREE.Group;
  torso: THREE.Group;
  head: THREE.Group;
  leftLeg: THREE.Group;
  rightLeg: THREE.Group;
  leftArm: THREE.Group;
  rightArm: THREE.Group;
  rightForearm: THREE.Group;
  leftForearm: THREE.Group;
  leftEyelid: THREE.Mesh;
  rightEyelid: THREE.Mesh;
  leftBrow: THREE.Mesh;
  rightBrow: THREE.Mesh;
  mouthMesh: THREE.Mesh;
  hairContainer: THREE.Group;
  outfitContainer: THREE.Group;
}

export interface ProceduralAvatarRig {
  root: THREE.Group;
  parts: AvatarPartsRef;
  materials: AvatarMaterials;
  rebuild: (config: AvatarConfig) => void;
  updateColors: (config: AvatarConfig) => void;
  dispose: () => void;
}

export function disposeObjectGeometries(root: THREE.Object3D) {
  const disposed = new Set<THREE.BufferGeometry>();
  root.traverse((obj) => {
    if ((obj as THREE.Mesh).isMesh) {
      const mesh = obj as THREE.Mesh;
      if (mesh.geometry && !disposed.has(mesh.geometry)) {
        mesh.geometry.dispose();
        disposed.add(mesh.geometry);
      }
    }
  });
}

function deriveDarkerColor(hex: string, factor: number, out: THREE.Color): THREE.Color {
  out.set(hex);
  out.multiplyScalar(factor);
  return out;
}

function buildHairGeometry(
  style: AvatarConfig['hairStyle'],
  hairContainer: THREE.Group,
  mats: AvatarMaterials,
  castShadow: boolean,
) {
  disposeObjectGeometries(hairContainer);
  hairContainer.clear();

  const addMesh = (
    geo: THREE.BufferGeometry,
    mat: THREE.Material,
    pos: [number, number, number],
    rot: [number, number, number] = [0, 0, 0],
    scale: [number, number, number] = [1, 1, 1],
  ) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(pos[0], pos[1], pos[2]);
    m.rotation.set(rot[0], rot[1], rot[2]);
    m.scale.set(scale[0], scale[1], scale[2]);
    m.castShadow = castShadow;
    hairContainer.add(m);
    return m;
  };

  const capGeo = new THREE.SphereGeometry(0.258, 22, 16, 0, Math.PI * 2, 0, Math.PI * 0.56);
  addMesh(capGeo, mats.hair, [0, 0.015, -0.012], [-0.24, 0, 0], [1.0, 1.04, 1.0]);

  switch (style) {
    case 'short_tousled': {
      const tuftGeo = new THREE.ConeGeometry(0.085, 0.19, 12);
      addMesh(tuftGeo, mats.hair, [-0.07, 0.21, 0.16], [1.1, 0.2, 0.45], [1, 1, 0.7]);
      addMesh(tuftGeo, mats.hair, [0.05, 0.22, 0.17], [1.15, -0.15, -0.35], [1.05, 1.1, 0.72]);
      addMesh(tuftGeo, mats.hair, [0.15, 0.17, 0.11], [0.95, -0.45, -0.6], [0.85, 0.9, 0.7]);
      const sideGeo = new THREE.CapsuleGeometry(0.042, 0.11, 6, 10);
      addMesh(sideGeo, mats.hair, [-0.22, 0.03, 0.03], [0.1, 0, 0.08]);
      addMesh(sideGeo, mats.hair, [0.22, 0.03, 0.03], [0.1, 0, -0.08]);
      break;
    }

    case 'bob_wave': {
      const backBobGeo = new THREE.CylinderGeometry(
        0.255,
        0.27,
        0.26,
        20,
        1,
        false,
        Math.PI * 0.65,
        Math.PI * 0.7,
      );
      addMesh(backBobGeo, mats.hair, [0, -0.09, -0.02], [0.08, Math.PI, 0]);
      const sideLockGeo = new THREE.CapsuleGeometry(0.068, 0.22, 8, 10);
      addMesh(sideLockGeo, mats.hair, [-0.215, -0.06, 0.02], [0.08, 0, 0.14], [0.85, 1, 1.15]);
      addMesh(sideLockGeo, mats.hair, [0.215, -0.06, 0.02], [0.08, 0, -0.14], [0.85, 1, 1.15]);
      const bangGeo = new THREE.SphereGeometry(0.11, 14, 10);
      addMesh(bangGeo, mats.hair, [-0.09, 0.19, 0.155], [0, 0, 0.3], [1.25, 0.6, 0.75]);
      addMesh(bangGeo, mats.hair, [0.095, 0.19, 0.155], [0, 0, -0.35], [1.15, 0.56, 0.75]);
      break;
    }

    case 'high_ponytail': {
      const bandGeo = new THREE.TorusGeometry(0.062, 0.018, 10, 18);
      addMesh(bandGeo, mats.brass, [0, 0.18, -0.22], [0.7, 0, 0]);
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0.18, -0.22),
        new THREE.Vector3(0.02, 0.19, -0.34),
        new THREE.Vector3(0.04, 0.05, -0.38),
        new THREE.Vector3(0.02, -0.15, -0.34),
      ]);
      const tailGeo = new THREE.TubeGeometry(curve, 16, 0.062, 10, false);
      addMesh(tailGeo, mats.hair, [0, 0, 0]);
      const tipGeo = new THREE.ConeGeometry(0.06, 0.14, 10);
      addMesh(tipGeo, mats.hair, [0.02, -0.21, -0.33], [Math.PI, 0, 0.1]);
      const wispGeo = new THREE.SphereGeometry(0.09, 12, 10);
      addMesh(wispGeo, mats.hair, [-0.12, 0.18, 0.14], [0, 0, 0.35], [1.1, 0.55, 0.75]);
      addMesh(wispGeo, mats.hair, [0.12, 0.18, 0.14], [0, 0, -0.35], [1.1, 0.55, 0.75]);
      break;
    }

    case 'twin_buns': {
      const bunGeo = new THREE.SphereGeometry(0.115, 16, 12);
      const ringGeo = new THREE.TorusGeometry(0.088, 0.016, 8, 18);
      addMesh(bunGeo, mats.hair, [-0.21, 0.22, -0.02]);
      addMesh(bunGeo, mats.hair, [0.21, 0.22, -0.02]);
      addMesh(ringGeo, mats.brass, [-0.17, 0.18, -0.02], [0, Math.PI / 2, 0.5]);
      addMesh(ringGeo, mats.brass, [0.17, 0.18, -0.02], [0, Math.PI / 2, -0.5]);
      const bangGeo = new THREE.CapsuleGeometry(0.036, 0.09, 6, 8);
      addMesh(bangGeo, mats.hair, [-0.14, 0.14, 0.19], [0.45, 0.2, 0.35]);
      addMesh(bangGeo, mats.hair, [0.14, 0.14, 0.19], [0.45, -0.2, -0.35]);
      break;
    }

    case 'curly_crown': {
      const curlGeo = new THREE.SphereGeometry(0.092, 12, 10);
      const positions: [number, number, number, number][] = [
        [0, 0.26, 0.06, 1.15],
        [-0.12, 0.23, 0.11, 1.0],
        [0.12, 0.23, 0.11, 1.0],
        [-0.22, 0.14, 0.05, 0.95],
        [0.22, 0.14, 0.05, 0.95],
        [-0.23, 0.02, -0.03, 0.9],
        [0.23, 0.02, -0.03, 0.9],
        [-0.14, 0.21, -0.13, 1.05],
        [0.14, 0.21, -0.13, 1.05],
        [0, 0.23, -0.18, 1.05],
        [0, 0.10, -0.24, 1.0],
      ];
      positions.forEach(([x, y, z, s]) => {
        addMesh(curlGeo, mats.hair, [x, y, z], [0, 0, 0], [s, s, s]);
      });
      break;
    }

    case 'explorer_spiky': {
      const spikeGeo = new THREE.ConeGeometry(0.072, 0.22, 10);
      const spikes: [[number, number, number], [number, number, number]][] = [
        [[0, 0.29, 0.06], [0.35, 0, 0]],
        [[-0.09, 0.26, 0.11], [0.55, 0.2, 0.42]],
        [[0.09, 0.26, 0.11], [0.55, -0.2, -0.42]],
        [[-0.15, 0.22, -0.02], [0.1, 0, 0.65]],
        [[0.15, 0.22, -0.02], [0.1, 0, -0.65]],
        [[0, 0.27, -0.09], [-0.3, 0, 0]],
      ];
      spikes.forEach(([p, r]) => {
        addMesh(spikeGeo, mats.hair, p, r, [1, 1, 0.85]);
      });
      break;
    }
  }
}

function buildOutfitTorsoDetails(
  outfitId: AvatarConfig['outfitId'],
  outfitContainer: THREE.Group,
  mats: AvatarMaterials,
  torsoW: number,
  castShadow: boolean,
) {
  disposeObjectGeometries(outfitContainer);
  outfitContainer.clear();

  const addMesh = (
    geo: THREE.BufferGeometry,
    mat: THREE.Material,
    pos: [number, number, number],
    rot: [number, number, number] = [0, 0, 0],
    scale: [number, number, number] = [1, 1, 1],
  ) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(pos[0], pos[1], pos[2]);
    m.rotation.set(rot[0], rot[1], rot[2]);
    m.scale.set(scale[0], scale[1], scale[2]);
    m.castShadow = castShadow;
    m.receiveShadow = true;
    outfitContainer.add(m);
    return m;
  };

  const coreMat = outfitId === 'safari_vest' ? mats.shirtLight : mats.outfitPrimary;
  addMesh(
    new THREE.CylinderGeometry(0.195, 0.168, 0.49, 22),
    coreMat,
    [0, 0.265, 0],
    [0, 0, 0],
    [torsoW, 1, 0.82],
  );
  addMesh(
    new THREE.SphereGeometry(0.19, 18, 12),
    coreMat,
    [0, 0.46, 0],
    [0, 0, 0],
    [torsoW, 0.46, 0.8],
  );

  addMesh(
    new THREE.CylinderGeometry(0.175, 0.175, 0.055, 20),
    mats.outfitSecondary,
    [0, 0.07, 0],
    [0, 0, 0],
    [torsoW, 1, 0.84],
  );
  addMesh(new THREE.BoxGeometry(0.068, 0.068, 0.03), mats.brass, [0, 0.07, 0.145]);

  if (outfitId === 'field_jacket') {
    addMesh(
      new THREE.CylinderGeometry(0.115, 0.13, 0.085, 16, 1, true, Math.PI * 0.25, Math.PI * 1.5),
      mats.outfitSecondary,
      [0, 0.535, 0],
      [0, Math.PI, 0],
      [torsoW, 1, 0.9],
    );
    addMesh(new THREE.BoxGeometry(0.022, 0.38, 0.02), mats.brass, [0, 0.30, 0.155]);
    addMesh(
      new THREE.BoxGeometry(0.078, 0.082, 0.03),
      mats.outfitSecondary,
      [-0.085 * torsoW, 0.32, 0.15],
    );
    addMesh(
      new THREE.BoxGeometry(0.078, 0.082, 0.03),
      mats.outfitSecondary,
      [0.085 * torsoW, 0.32, 0.15],
    );
  } else if (outfitId === 'sky_hoodie') {
    addMesh(
      new THREE.TorusGeometry(0.125, 0.042, 10, 22),
      mats.outfitSecondary,
      [0, 0.51, -0.02],
      [Math.PI * 0.44, 0, 0],
      [torsoW, 1.08, 1],
    );
    addMesh(
      new THREE.BoxGeometry(0.20 * torsoW, 0.11, 0.03),
      mats.outfitSecondary,
      [0, 0.17, 0.145],
    );
    const cordGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.14, 8);
    addMesh(cordGeo, mats.shirtLight, [-0.045, 0.41, 0.155], [0.12, 0, 0.05]);
    addMesh(cordGeo, mats.shirtLight, [0.045, 0.41, 0.155], [0.12, 0, -0.05]);
  } else if (outfitId === 'safari_vest') {
    const panelGeo = new THREE.BoxGeometry(0.115 * torsoW, 0.42, 0.28);
    addMesh(panelGeo, mats.outfitPrimary, [-0.105 * torsoW, 0.29, 0.015]);
    addMesh(panelGeo, mats.outfitPrimary, [0.105 * torsoW, 0.29, 0.015]);
    addMesh(
      new THREE.BoxGeometry(0.32 * torsoW, 0.42, 0.12),
      mats.outfitPrimary,
      [0, 0.29, -0.09],
    );
    addMesh(
      new THREE.CylinderGeometry(0.034, 0.034, 0.02, 14),
      mats.brass,
      [0.095 * torsoW, 0.39, 0.16],
      [Math.PI / 2, 0, 0],
    );
  } else if (outfitId === 'coastal_poncho') {
    addMesh(
      new THREE.ConeGeometry(0.295 * torsoW, 0.32, 24, 1, true),
      mats.outfitSecondary,
      [0, 0.39, 0],
      [0, 0, 0],
      [1, 1, 0.82],
    );
    addMesh(
      new THREE.TorusGeometry(0.285 * torsoW, 0.015, 8, 28),
      mats.brass,
      [0, 0.235, 0],
      [Math.PI / 2, 0, 0],
      [1, 0.82, 1],
    );
  }

  const strapGeo = new THREE.BoxGeometry(0.036, 0.44, 0.03);
  addMesh(strapGeo, mats.packStrap, [-0.11 * torsoW, 0.30, 0.145], [-0.12, 0, 0.06]);
  addMesh(strapGeo, mats.packStrap, [0.11 * torsoW, 0.30, 0.145], [-0.12, 0, -0.06]);

  const packZ = -0.22;
  addMesh(new THREE.BoxGeometry(0.27, 0.34, 0.16), mats.backpack, [0, 0.30, packZ]);
  addMesh(
    new THREE.CylinderGeometry(0.08, 0.08, 0.27, 14),
    mats.backpack,
    [0, 0.46, packZ],
    [0, 0, Math.PI / 2],
  );
  addMesh(new THREE.BoxGeometry(0.28, 0.11, 0.17), mats.packStrap, [0, 0.41, packZ - 0.01]);
  addMesh(new THREE.BoxGeometry(0.032, 0.045, 0.02), mats.brass, [-0.075, 0.35, packZ - 0.09]);
  addMesh(new THREE.BoxGeometry(0.032, 0.045, 0.02), mats.brass, [0.075, 0.35, packZ - 0.09]);
  addMesh(
    new THREE.CylinderGeometry(0.052, 0.052, 0.29, 12),
    mats.shirtLight,
    [0, 0.12, packZ - 0.02],
    [0, 0, Math.PI / 2],
  );
  addMesh(new THREE.CylinderGeometry(0.036, 0.036, 0.13, 12), mats.brass, [0.16, 0.26, packZ]);
}

export function createProceduralAvatarRig(
  initialConfig: AvatarConfig,
  castShadow: boolean,
): ProceduralAvatarRig {
  const root = new THREE.Group();

  const materials: AvatarMaterials = {
    skin: new THREE.MeshStandardMaterial({ color: initialConfig.skinTone, roughness: 0.64, metalness: 0.02 }),
    hair: new THREE.MeshStandardMaterial({ color: initialConfig.hairColor, roughness: 0.52, metalness: 0.06 }),
    outfitPrimary: new THREE.MeshStandardMaterial({
      color: initialConfig.outfitColor,
      roughness: 0.74,
      metalness: 0.04,
    }),
    outfitSecondary: new THREE.MeshStandardMaterial({
      color: deriveDarkerColor(initialConfig.outfitColor, 0.76, _colorTemp),
      roughness: 0.80,
      metalness: 0.02,
    }),
    shirtLight: new THREE.MeshStandardMaterial({ color: '#EAE2D2', roughness: 0.82, metalness: 0.01 }),
    pants: new THREE.MeshStandardMaterial({ color: '#243147', roughness: 0.84, metalness: 0.02 }),
    boot: new THREE.MeshStandardMaterial({ color: '#4A3122', roughness: 0.56, metalness: 0.08 }),
    brass: new THREE.MeshStandardMaterial({ color: '#F2C66D', roughness: 0.24, metalness: 0.85 }),
    backpack: new THREE.MeshStandardMaterial({
      color: initialConfig.backpackColor,
      roughness: 0.70,
      metalness: 0.04,
    }),
    packStrap: new THREE.MeshStandardMaterial({
      color: deriveDarkerColor(initialConfig.backpackColor, 0.78, _colorTemp),
      roughness: 0.76,
      metalness: 0.03,
    }),
    sclera: new THREE.MeshStandardMaterial({ color: '#FFFFFF', roughness: 0.2, metalness: 0 }),
    iris: new THREE.MeshStandardMaterial({ color: '#1C2434', roughness: 0.18, metalness: 0.05 }),
    highlight: new THREE.MeshBasicMaterial({ color: '#FFFFFF' }),
    blush: new THREE.MeshBasicMaterial({ color: '#F09480', transparent: true, opacity: 0.45 }),
    mouth: new THREE.MeshStandardMaterial({ color: '#783B2E', roughness: 0.55, metalness: 0 }),
  };

  let parts!: AvatarPartsRef;

  const rebuild = (cfg: AvatarConfig) => {
    disposeObjectGeometries(root);
    root.clear();

    const heightScale =
      cfg.modelId === 'trailblazer_slim' ? 1.04 : cfg.modelId === 'pioneer_sturdy' ? 0.99 : 1.0;
    const torsoW =
      cfg.modelId === 'trailblazer_slim' ? 0.90 : cfg.modelId === 'pioneer_sturdy' ? 1.13 : 1.0;
    const shoulderW =
      cfg.modelId === 'trailblazer_slim' ? 0.91 : cfg.modelId === 'pioneer_sturdy' ? 1.14 : 1.0;

    root.scale.set(1, heightScale, 1);

    const hips = new THREE.Group();
    hips.position.set(0, 0.64, 0);
    root.add(hips);

    const buildLeg = (side: -1 | 1) => {
      const legPivot = new THREE.Group();
      legPivot.position.set(side * 0.095 * torsoW, 0, 0);
      hips.add(legPivot);

      const pant = new THREE.Mesh(
        new THREE.CylinderGeometry(0.082, 0.068, 0.43, 14),
        materials.pants,
      );
      pant.position.set(0, -0.22, 0);
      pant.castShadow = castShadow;
      legPivot.add(pant);

      const cuff = new THREE.Mesh(new THREE.TorusGeometry(0.072, 0.015, 8, 16), materials.boot);
      cuff.rotation.x = Math.PI / 2;
      cuff.position.set(0, -0.44, 0);
      legPivot.add(cuff);

      const bootUpper = new THREE.Mesh(
        new THREE.CylinderGeometry(0.074, 0.082, 0.14, 14),
        materials.boot,
      );
      bootUpper.position.set(0, -0.52, 0);
      bootUpper.castShadow = castShadow;
      legPivot.add(bootUpper);

      const bootToe = new THREE.Mesh(new THREE.SphereGeometry(0.08, 14, 10), materials.boot);
      bootToe.scale.set(0.95, 0.68, 1.32);
      bootToe.position.set(0, -0.575, 0.052);
      bootToe.castShadow = castShadow;
      legPivot.add(bootToe);

      const sole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.088, 0.094, 0.036, 14),
        materials.pants,
      );
      sole.scale.set(1, 1, 1.36);
      sole.position.set(0, -0.622, 0.024);
      legPivot.add(sole);

      return legPivot;
    };

    const leftLeg = buildLeg(-1);
    const rightLeg = buildLeg(1);

    const pelvis = new THREE.Mesh(new THREE.SphereGeometry(0.155, 16, 12), materials.pants);
    pelvis.scale.set(1.12 * torsoW, 0.62, 0.85);
    pelvis.position.set(0, -0.02, 0);
    hips.add(pelvis);

    const torso = new THREE.Group();
    torso.position.set(0, 0.03, 0);
    hips.add(torso);

    const outfitContainer = new THREE.Group();
    torso.add(outfitContainer);
    buildOutfitTorsoDetails(cfg.outfitId, outfitContainer, materials, torsoW, castShadow);

    const buildArm = (side: -1 | 1) => {
      const armPivot = new THREE.Group();
      armPivot.position.set(side * 0.24 * shoulderW, 0.46, 0);
      armPivot.rotation.z = side * -0.14;
      torso.add(armPivot);

      const sleeveMat = cfg.outfitId === 'safari_vest' ? materials.shirtLight : materials.outfitPrimary;
      const shoulderCap = new THREE.Mesh(new THREE.SphereGeometry(0.068, 12, 10), sleeveMat);
      shoulderCap.castShadow = castShadow;
      armPivot.add(shoulderCap);

      const upperArm = new THREE.Mesh(
        new THREE.CylinderGeometry(0.058, 0.052, 0.21, 12),
        sleeveMat,
      );
      upperArm.position.set(0, -0.105, 0);
      upperArm.castShadow = castShadow;
      armPivot.add(upperArm);

      const forearmPivot = new THREE.Group();
      forearmPivot.position.set(0, -0.20, 0);
      armPivot.add(forearmPivot);

      const elbowJoint = new THREE.Mesh(new THREE.SphereGeometry(0.052, 10, 8), sleeveMat);
      forearmPivot.add(elbowJoint);

      const forearm = new THREE.Mesh(
        new THREE.CylinderGeometry(0.048, 0.042, 0.17, 12),
        materials.skin,
      );
      forearm.position.set(0, -0.085, 0);
      forearm.castShadow = castShadow;
      forearmPivot.add(forearm);

      const hand = new THREE.Mesh(new THREE.SphereGeometry(0.056, 12, 10), materials.skin);
      hand.position.set(0, -0.185, 0);
      hand.castShadow = castShadow;
      forearmPivot.add(hand);

      return { armPivot, forearmPivot };
    };

    const leftArmBuilt = buildArm(-1);
    const rightArmBuilt = buildArm(1);

    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.066, 0.076, 0.11, 14), materials.skin);
    neck.position.set(0, 0.56, 0);
    torso.add(neck);

    const head = new THREE.Group();
    head.position.set(0, 0.62, 0);
    torso.add(head);

    const cranium = new THREE.Mesh(new THREE.SphereGeometry(0.242, 24, 18), materials.skin);
    cranium.scale.set(0.98, 1.04, 0.96);
    cranium.position.set(0, 0.22, 0);
    cranium.castShadow = castShadow;
    head.add(cranium);

    const earGeo = new THREE.SphereGeometry(0.05, 10, 8);
    const earL = new THREE.Mesh(earGeo, materials.skin);
    earL.position.set(-0.23, 0.21, 0);
    earL.scale.set(0.65, 1, 0.75);
    head.add(earL);
    const earR = new THREE.Mesh(earGeo, materials.skin);
    earR.position.set(0.23, 0.21, 0);
    earR.scale.set(0.65, 1, 0.75);
    head.add(earR);

    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.025, 10, 8), materials.skin);
    nose.position.set(0, 0.195, 0.235);
    head.add(nose);

    const blushGeo = new THREE.CircleGeometry(0.036, 14);
    const blushL = new THREE.Mesh(blushGeo, materials.blush);
    blushL.position.set(-0.125, 0.16, 0.212);
    blushL.rotation.y = -0.35;
    head.add(blushL);
    const blushR = new THREE.Mesh(blushGeo, materials.blush);
    blushR.position.set(0.125, 0.16, 0.212);
    blushR.rotation.y = 0.35;
    head.add(blushR);

    const buildEye = (side: -1 | 1) => {
      const ex = side * 0.086;
      const ey = 0.235;
      const ez = 0.205;

      const sclera = new THREE.Mesh(new THREE.SphereGeometry(0.038, 14, 10), materials.sclera);
      sclera.scale.set(0.95, 1.1, 0.65);
      sclera.position.set(ex, ey, ez);
      head.add(sclera);

      const iris = new THREE.Mesh(new THREE.SphereGeometry(0.024, 12, 10), materials.iris);
      iris.scale.set(1, 1.1, 0.55);
      iris.position.set(ex, ey, ez + 0.017);
      head.add(iris);

      const glint = new THREE.Mesh(new THREE.SphereGeometry(0.008, 8, 8), materials.highlight);
      glint.position.set(ex + 0.008, ey + 0.01, ez + 0.028);
      head.add(glint);

      const eyelid = new THREE.Mesh(
        new THREE.SphereGeometry(0.041, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.54),
        materials.skin,
      );
      eyelid.scale.set(1.0, 1.12, 0.72);
      eyelid.position.set(ex, ey, ez + 0.002);
      eyelid.rotation.x = -Math.PI * 0.42;
      head.add(eyelid);

      const brow = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.011, 0.048, 6, 8),
        materials.hair,
      );
      brow.position.set(ex, ey + 0.068, ez + 0.015);
      brow.rotation.z = Math.PI / 2 + side * (cfg.modelId === 'trailblazer_slim' ? 0.14 : 0.04);
      head.add(brow);

      return { eyelid, brow };
    };

    const eyeL = buildEye(-1);
    const eyeR = buildEye(1);

    const mouthMesh = new THREE.Mesh(
      new THREE.TorusGeometry(0.045, 0.009, 8, 16, Math.PI * 0.78),
      materials.mouth,
    );
    mouthMesh.position.set(0, 0.142, 0.222);
    mouthMesh.rotation.z = -Math.PI * 0.89;
    head.add(mouthMesh);

    const hairContainer = new THREE.Group();
    hairContainer.position.set(0, 0.22, 0);
    head.add(hairContainer);
    buildHairGeometry(cfg.hairStyle, hairContainer, materials, castShadow);

    parts = {
      hips,
      torso,
      head,
      leftLeg,
      rightLeg,
      leftArm: leftArmBuilt.armPivot,
      rightArm: rightArmBuilt.armPivot,
      leftForearm: leftArmBuilt.forearmPivot,
      rightForearm: rightArmBuilt.forearmPivot,
      leftEyelid: eyeL.eyelid,
      rightEyelid: eyeR.eyelid,
      leftBrow: eyeL.brow,
      rightBrow: eyeR.brow,
      mouthMesh,
      hairContainer,
      outfitContainer,
    };
  };

  const updateColors = (cfg: AvatarConfig) => {
    materials.skin.color.set(cfg.skinTone);
    materials.hair.color.set(cfg.hairColor);
    materials.outfitPrimary.color.set(cfg.outfitColor);
    materials.outfitSecondary.color.copy(deriveDarkerColor(cfg.outfitColor, 0.76, _colorTemp));
    materials.backpack.color.set(cfg.backpackColor);
    materials.packStrap.color.copy(deriveDarkerColor(cfg.backpackColor, 0.78, _colorTemp));
  };

  rebuild(initialConfig);

  return {
    root,
    get parts() {
      return parts;
    },
    materials,
    rebuild,
    updateColors,
    dispose: () => {
      disposeObjectGeometries(root);
      Object.values(materials).forEach((m) => m.dispose());
    },
  };
}
