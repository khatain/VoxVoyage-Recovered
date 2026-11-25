import * as THREE from 'three';

/**
 * Geographically recognizable equirectangular coastline polygons ([lng, lat])
 * and terrain biome overlays for procedural high-resolution Earth textures.
 */

export interface GeoPolygon {
  id: string;
  baseColor: string;
  points: [number, number][];
}

export const EARTH_CONTINENTS: GeoPolygon[] = [
  // North & Central America
  {
    id: 'north_america',
    baseColor: '#56A95C',
    points: [
      [-168, 66], [-161, 59], [-152, 60], [-140, 59], [-131, 54], [-124, 48],
      [-124, 40], [-118, 33], [-112, 24], [-105, 20], [-95, 16], [-85, 10],
      [-79, 9], [-83, 14], [-88, 17], [-87, 21], [-90, 21], [-97, 22],
      [-97, 27], [-90, 29], [-83, 29], [-81, 25], [-80, 31], [-75, 36],
      [-74, 41], [-69, 44], [-60, 46], [-54, 47], [-56, 52], [-64, 59],
      [-74, 62], [-78, 53], [-82, 52], [-88, 56], [-94, 59], [-92, 64],
      [-83, 68], [-98, 69], [-116, 69], [-134, 70], [-156, 71], [-165, 68],
    ],
  },
  // Greenland
  {
    id: 'greenland',
    baseColor: '#DFECF5',
    points: [
      [-44, 60], [-36, 66], [-22, 72], [-18, 79], [-34, 83], [-54, 81],
      [-68, 77], [-55, 71], [-52, 65],
    ],
  },
  // Cuba & Caribbean Islands
  {
    id: 'cuba',
    baseColor: '#4BA45A',
    points: [[-84, 22], [-79, 23], [-74, 20], [-78, 20]],
  },
  // South America
  {
    id: 'south_america',
    baseColor: '#449C53',
    points: [
      [-79, 9], [-74, 11], [-68, 11], [-61, 10], [-52, 4], [-48, -1],
      [-40, -3], [-35, -6], [-35, -10], [-39, -18], [-41, -22], [-48, -26],
      [-52, -33], [-58, -38], [-64, -42], [-66, -48], [-69, -54], [-74, -52],
      [-75, -45], [-72, -37], [-71, -28], [-71, -18], [-77, -12], [-81, -5],
      [-80, 1], [-78, 6],
    ],
  },
  // Continental Europe + Scandinavia
  {
    id: 'europe',
    baseColor: '#66AE63',
    points: [
      [-9, 37], [-9, 43], [-2, 43], [-4, 48], [2, 51], [8, 54],
      [9, 57], [11, 55], [13, 55], [11, 59], [5, 61], [11, 65],
      [18, 69], [28, 71], [31, 69], [28, 65], [22, 60], [28, 60],
      [38, 67], [48, 67], [60, 68], [58, 52], [46, 44], [38, 45],
      [31, 46], [28, 41], [24, 38], [22, 37], [20, 40], [18, 45],
      [14, 44], [16, 40], [15, 38], [12, 42], [9, 44], [5, 43],
      [3, 41], [-2, 37], [-6, 36],
    ],
  },
  // Great Britain & Scotland
  {
    id: 'great_britain',
    baseColor: '#54A65B',
    points: [
      [-5, 50], [-3, 51], [-5, 53], [-3, 54], [-5, 56], [-6, 58],
      [-3, 59], [-2, 57], [-3, 56], [-1, 55], [1, 53], [2, 52], [1, 51],
    ],
  },
  // Ireland
  {
    id: 'ireland',
    baseColor: '#57AB5D',
    points: [[-10, 52], [-10, 54], [-7, 55], [-6, 53], [-8, 52]],
  },
  // Iceland
  {
    id: 'iceland',
    baseColor: '#8FB98D',
    points: [[-24, 65], [-19, 66], [-14, 65], [-18, 63]],
  },
  // Africa
  {
    id: 'africa',
    baseColor: '#89B058',
    points: [
      [-6, 36], [4, 37], [11, 37], [12, 33], [20, 32], [25, 31],
      [32, 31], [35, 26], [38, 20], [43, 12], [51, 12], [49, 4],
      [41, -2], [40, -10], [35, -18], [35, -24], [31, -30], [26, -34],
      [18, -35], [15, -26], [12, -16], [13, -6], [9, 2], [4, 5],
      [-6, 5], [-13, 8], [-17, 15], [-16, 22], [-12, 28], [-9, 33],
    ],
  },
  // Madagascar
  {
    id: 'madagascar',
    baseColor: '#5CA558',
    points: [[44, -25], [47, -25], [50, -15], [49, -12], [44, -18]],
  },
  // Asia & Middle East & Indian Subcontinent & SE Asia
  {
    id: 'asia',
    baseColor: '#67AD62',
    points: [
      [27, 41], [36, 41], [41, 42], [46, 44], [54, 45], [58, 52],
      [60, 68], [72, 72], [95, 76], [115, 74], [142, 71], [172, 66],
      [164, 59], [157, 52], [141, 53], [135, 44], [129, 39], [128, 35],
      [126, 37], [123, 39], [120, 35], [122, 31], [118, 24], [112, 21],
      [108, 17], [109, 12], [105, 9], [101, 13], [103, 6], [104, 1],
      [100, 6], [98, 14], [95, 16], [91, 22], [86, 20], [80, 14],
      [78, 8], [74, 14], [72, 20], [68, 23], [62, 25], [56, 26],
      [51, 26], [56, 23], [59, 21], [54, 17], [44, 13], [39, 21],
      [35, 29], [36, 35], [29, 36],
    ],
  },
  // Sri Lanka
  {
    id: 'sri_lanka',
    baseColor: '#4BA457',
    points: [[80, 9], [82, 8], [81, 6], [79, 7]],
  },
  // Japan Archipelago
  {
    id: 'japan_honshu',
    baseColor: '#58AA5E',
    points: [[131, 33], [136, 34], [140, 36], [141, 41], [139, 39], [134, 35]],
  },
  {
    id: 'japan_hokkaido',
    baseColor: '#66AF6D',
    points: [[140, 42], [144, 44], [145, 43], [141, 41]],
  },
  // Maritime SE Asia (Sumatra, Java, Borneo, Philippines)
  {
    id: 'sumatra',
    baseColor: '#419A53',
    points: [[95, 5], [99, 2], [105, -5], [102, -4], [97, 2]],
  },
  {
    id: 'java',
    baseColor: '#449E56',
    points: [[105, -6], [114, -8], [114, -7], [106, -7]],
  },
  {
    id: 'borneo',
    baseColor: '#3E964F',
    points: [[109, 1], [115, 6], [118, 4], [116, -3], [110, -3]],
  },
  {
    id: 'sulawesi',
    baseColor: '#47A058',
    points: [[119, 1], [124, 1], [123, -4], [119, -5]],
  },
  {
    id: 'philippines',
    baseColor: '#4EA55D',
    points: [[120, 18], [123, 14], [126, 7], [123, 7], [120, 14]],
  },
  // New Guinea
  {
    id: 'new_guinea',
    baseColor: '#449A54',
    points: [[132, -2], [141, -3], [150, -10], [144, -8], [135, -5]],
  },
  // Australia & Tasmania
  {
    id: 'australia',
    baseColor: '#D4A55B',
    points: [
      [114, -22], [122, -17], [130, -12], [136, -12], [136, -15], [141, -16],
      [143, -11], [146, -17], [151, -23], [153.6, -28], [152.4, -33.5], [151.4, -35], [149, -37.5],
      [144, -38], [138, -36], [135, -34], [129, -32], [121, -34], [115, -34],
      [114, -28],
    ],
  },
  {
    id: 'tasmania',
    baseColor: '#5DA65F',
    points: [[145, -41], [148, -41], [147, -43], [145, -42]],
  },
  // New Zealand
  {
    id: 'nz_north',
    baseColor: '#50A55B',
    points: [[173, -35], [178, -38], [176, -41], [174, -38]],
  },
  {
    id: 'nz_south',
    baseColor: '#54A85E',
    points: [[172, -41], [174, -43], [169, -46], [167, -45]],
  },
  // Antarctica
  {
    id: 'antarctica',
    baseColor: '#ECF4FA',
    points: [
      [-180, -73], [-145, -75], [-100, -73], [-60, -64], [-45, -75],
      [0, -70], [45, -68], [90, -67], [135, -67], [170, -72], [180, -73],
      [180, -90], [-180, -90],
    ],
  },
];

interface BiomePatch {
  lng: number;
  lat: number;
  rx: number;
  ry: number;
  color: string;
  alpha: number;
}

// Rich terrain variation patches (deserts, tropical rainforests, snowy mountain chains, savannas)
const TERRAIN_PATCHES: BiomePatch[] = [
  // Sahara & Arabian Deserts (Golden-ochre sand)
  { lng: 12, lat: 23, rx: 24, ry: 9, color: '#E3BF73', alpha: 0.92 },
  { lng: 45, lat: 23, rx: 10, ry: 7, color: '#DFB86B', alpha: 0.9 },
  // Kalahari / Namib
  { lng: 20, lat: -24, rx: 7, ry: 7, color: '#D7B365', alpha: 0.78 },
  // East African Savanna (Kenya Maasai Mara lush golden-green)
  { lng: 35, lat: -1, rx: 8, ry: 8, color: '#7BB556', alpha: 0.85 },
  // Congo Basin Rainforest
  { lng: 21, lat: 1, rx: 10, ry: 7, color: '#318445', alpha: 0.88 },
  // Amazon Rainforest
  { lng: -61, lat: -6, rx: 14, ry: 10, color: '#2F8745', alpha: 0.92 },
  // Andes Mountains
  { lng: -70, lat: -20, rx: 3.5, ry: 22, color: '#A99C8A', alpha: 0.78 },
  // Rockies & Western US Desert
  { lng: -110, lat: 42, rx: 8, ry: 14, color: '#9D9E7A', alpha: 0.72 },
  // Canadian Boreal & Arctic Tundra
  { lng: -102, lat: 60, rx: 24, ry: 8, color: '#78A86C', alpha: 0.65 },
  // Indian Subcontinent fertile plains & Deccan warmth
  { lng: 78, lat: 22, rx: 7, ry: 8, color: '#74B257', alpha: 0.82 },
  { lng: 73, lat: 26, rx: 5, ry: 4, color: '#D8B36A', alpha: 0.65 }, // Thar Desert west of Jaipur
  // Himalayas & Tibetan Plateau (dramatic mountain ridge)
  { lng: 86, lat: 32, rx: 14, ry: 5, color: '#D2D9DF', alpha: 0.86 },
  // Gobi / Central Asian Steppe
  { lng: 96, lat: 43, rx: 14, ry: 5, color: '#C9B173', alpha: 0.75 },
  // SE Asia & Thailand Lush Tropics
  { lng: 102, lat: 14, rx: 6, ry: 7, color: '#38914B', alpha: 0.88 },
  // Australian Outback vs East Coast Green
  { lng: 132, lat: -24, rx: 13, ry: 8, color: '#D88B4E', alpha: 0.88 },
  { lng: 149, lat: -30, rx: 4, ry: 9, color: '#4EA057', alpha: 0.9 },
  // Scottish Highlands Emerald Moorland
  { lng: -4, lat: 57, rx: 3, ry: 3, color: '#3E8F50', alpha: 0.92 },
];

// Mountain height ridges for the Earth bumpMap
const MOUNTAIN_RIDGES: { lng: number; lat: number; rx: number; ry: number; intensity: number }[] = [
  { lng: 85, lat: 31, rx: 15, ry: 4.5, intensity: 1.0 }, // Himalayas
  { lng: -70, lat: -18, rx: 3.5, ry: 22, intensity: 0.9 }, // Andes
  { lng: -112, lat: 45, rx: 6, ry: 15, intensity: 0.8 }, // Rockies
  { lng: 10, lat: 46, rx: 5, ry: 2.5, intensity: 0.7 }, // Alps
  { lng: 38, lat: 8, rx: 4, ry: 6, intensity: 0.65 }, // Ethiopian Highlands
  { lng: -4, lat: 57, rx: 2.5, ry: 2.5, intensity: 0.55 }, // Scottish Highlands
  { lng: 148, lat: -33, rx: 2, ry: 7, intensity: 0.5 }, // Great Dividing Range
];

function lngToX(lng: number, w: number): number {
  return ((lng + 180) / 360) * w;
}

function latToY(lat: number, h: number): number {
  return ((90 - lat) / 180) * h;
}

function tracePoly(ctx: CanvasRenderingContext2D, pts: [number, number][], w: number, h: number) {
  ctx.beginPath();
  pts.forEach(([lng, lat], i) => {
    const x = lngToX(lng, w);
    const y = latToY(lat, h);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
}

export interface EarthTextureBundle {
  albedoMap: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
  roughnessMap: THREE.CanvasTexture;
  cloudsMap: THREE.CanvasTexture;
  nightLightsMap: THREE.CanvasTexture;
}

export function createEarthTextureBundle(maxAnisotropy: number): EarthTextureBundle {
  const W = 2048;
  const H = 1024;
  const aniso = Math.min(8, maxAnisotropy);

  // 1. Albedo Color Map (Ocean gradient + Turquoise coastal reefs + Detailed land & biomes)
  const albedoCanvas = document.createElement('canvas');
  albedoCanvas.width = W;
  albedoCanvas.height = H;
  const aCtx = albedoCanvas.getContext('2d');

  // 2. Roughness Map (Oceans glossy ~0.28 = dark gray, Land matte ~0.85 = light gray)
  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = 1024;
  roughCanvas.height = 512;
  const rCtx = roughCanvas.getContext('2d');

  // 3. Bump Map (Land base elevation + glowing mountain ridges)
  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = 1024;
  bumpCanvas.height = 512;
  const bCtx = bumpCanvas.getContext('2d');

  if (aCtx) {
    const oceanGrad = aCtx.createLinearGradient(0, 0, 0, H);
    oceanGrad.addColorStop(0, '#1B6DA8');
    oceanGrad.addColorStop(0.22, '#1366A4');
    oceanGrad.addColorStop(0.5, '#1986BD');
    oceanGrad.addColorStop(0.78, '#1366A4');
    oceanGrad.addColorStop(1, '#1A5E96');
    aCtx.fillStyle = oceanGrad;
    aCtx.fillRect(0, 0, W, H);

    // Subtle ocean bathymetry currents
    aCtx.fillStyle = 'rgba(46, 186, 204, 0.14)';
    for (let i = 0; i < 18; i++) {
      const y = ((i * 59 + 40) % H);
      aCtx.fillRect(0, y, W, 12);
    }

    // Shallow turquoise continental shelf glow around landmasses (wider halo then crisp shore)
    aCtx.lineJoin = 'round';
    aCtx.lineCap = 'round';
    for (const poly of EARTH_CONTINENTS) {
      if (poly.id === 'antarctica') continue;
      tracePoly(aCtx, poly.points, W, H);
      aCtx.strokeStyle = 'rgba(38, 198, 210, 0.34)';
      aCtx.lineWidth = 30;
      aCtx.stroke();
      aCtx.strokeStyle = 'rgba(84, 224, 228, 0.45)';
      aCtx.lineWidth = 12;
      aCtx.stroke();
    }

    // Fill continents
    for (const poly of EARTH_CONTINENTS) {
      tracePoly(aCtx, poly.points, W, H);
      aCtx.fillStyle = poly.baseColor;
      aCtx.fill();
    }

    // Clip terrain biome patches cleanly inside land silhouettes
    aCtx.save();
    aCtx.beginPath();
    for (const poly of EARTH_CONTINENTS) {
      if (poly.id === 'antarctica' || poly.id === 'greenland') continue;
      poly.points.forEach(([lng, lat], i) => {
        const x = lngToX(lng, W);
        const y = latToY(lat, H);
        if (i === 0) aCtx.moveTo(x, y);
        else aCtx.lineTo(x, y);
      });
      aCtx.closePath();
    }
    aCtx.clip();

    for (const patch of TERRAIN_PATCHES) {
      const cx = lngToX(patch.lng, W);
      const cy = latToY(patch.lat, H);
      const rx = (patch.rx / 360) * W;
      const ry = (patch.ry / 180) * H;
      aCtx.save();
      aCtx.translate(cx, cy);
      aCtx.scale(rx, ry);
      const grad = aCtx.createRadialGradient(0, 0, 0.1, 0, 0, 1);
      grad.addColorStop(0, patch.color);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      aCtx.globalAlpha = patch.alpha;
      aCtx.fillStyle = grad;
      aCtx.beginPath();
      aCtx.arc(0, 0, 1, 0, Math.PI * 2);
      aCtx.fill();
      aCtx.restore();
    }
    aCtx.restore();

    // Subtle crisp coastline rim & latitude/longitude lines
    for (const poly of EARTH_CONTINENTS) {
      tracePoly(aCtx, poly.points, W, H);
      aCtx.strokeStyle = poly.id === 'antarctica' ? 'rgba(255,255,255,0.6)' : 'rgba(247, 232, 184, 0.52)';
      aCtx.lineWidth = 2.2;
      aCtx.stroke();
    }

    // Very faint cartography grid in ocean/global feel
    aCtx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    aCtx.lineWidth = 1;
    for (let x = 0; x <= W; x += W / 12) {
      aCtx.beginPath();
      aCtx.moveTo(x, 0);
      aCtx.lineTo(x, H);
      aCtx.stroke();
    }
    for (let y = 0; y <= H; y += H / 6) {
      aCtx.beginPath();
      aCtx.moveTo(0, y);
      aCtx.lineTo(W, y);
      aCtx.stroke();
    }
  }

  if (rCtx) {
    // Ocean specular sheen (value ~78/255 = ~0.30 roughness)
    rCtx.fillStyle = '#4E4E4E';
    rCtx.fillRect(0, 0, 1024, 512);
    // Land matte (~215/255 = ~0.84 roughness)
    for (const poly of EARTH_CONTINENTS) {
      tracePoly(rCtx, poly.points, 1024, 512);
      rCtx.fillStyle = poly.id === 'antarctica' ? '#B8B8B8' : '#D8D8D8';
      rCtx.fill();
    }
  }

  if (bCtx) {
    // Ocean flat 0 elevation
    bCtx.fillStyle = '#101010';
    bCtx.fillRect(0, 0, 1024, 512);
    // Raised landmass shelf
    for (const poly of EARTH_CONTINENTS) {
      tracePoly(bCtx, poly.points, 1024, 512);
      bCtx.fillStyle = '#585858';
      bCtx.fill();
    }
    // Mountain relief peaks
    for (const m of MOUNTAIN_RIDGES) {
      const cx = lngToX(m.lng, 1024);
      const cy = latToY(m.lat, 512);
      const rx = (m.rx / 360) * 1024;
      const ry = (m.ry / 180) * 512;
      bCtx.save();
      bCtx.translate(cx, cy);
      bCtx.scale(rx, ry);
      const grad = bCtx.createRadialGradient(0, 0, 0.05, 0, 0, 1);
      grad.addColorStop(0, `rgba(255, 255, 255, ${m.intensity})`);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      bCtx.fillStyle = grad;
      bCtx.beginPath();
      bCtx.arc(0, 0, 1, 0, Math.PI * 2);
      bCtx.fill();
      bCtx.restore();
    }
  }

  // 4. Soft Earth Cloud Layer (1024x512 alpha wisps)
  const cloudCanvas = document.createElement('canvas');
  cloudCanvas.width = 1024;
  cloudCanvas.height = 512;
  const cCtx = cloudCanvas.getContext('2d');
  if (cCtx) {
    cCtx.clearRect(0, 0, 1024, 512);
    // Deterministic atmospheric cloud bands & trade-wind swirls
    for (let i = 0; i < 65; i++) {
      const cx = ((i * 157 + 73) % 980) + 22;
      const cy = ((i * 89 + 45) % 410) + 50;
      const rx = 28 + (i % 5) * 14;
      const ry = 8 + (i % 3) * 5;
      cCtx.save();
      cCtx.translate(cx, cy);
      cCtx.rotate(((i % 7) - 3) * 0.08);
      cCtx.scale(rx, ry);
      const grad = cCtx.createRadialGradient(0, 0, 0.1, 0, 0, 1);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.55)');
      grad.addColorStop(0.6, 'rgba(255, 255, 255, 0.22)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      cCtx.fillStyle = grad;
      cCtx.beginPath();
      cCtx.arc(0, 0, 1, 0, Math.PI * 2);
      cCtx.fill();
      cCtx.restore();
    }
  }

  // 5. Night City Lights Map (1024x512)
  const nightCanvas = document.createElement('canvas');
  nightCanvas.width = 1024;
  nightCanvas.height = 512;
  const nCtx = nightCanvas.getContext('2d');
  if (nCtx) {
    nCtx.fillStyle = '#000000';
    nCtx.fillRect(0, 0, 1024, 512);
    const hubs: [number, number, number][] = [
      [75.8, 26.9, 10], [77.2, 28.6, 13], [72.8, 19.0, 11], [77.6, 12.9, 9], [88.3, 22.6, 9],
      [100.5, 13.7, 12], [103.8, 1.3, 9], [106.7, 10.8, 8], [116.4, 39.9, 12], [121.5, 31.2, 13],
      [114.1, 22.3, 11], [127.0, 37.5, 10], [139.7, 35.7, 12], [135.5, 34.7, 9],
      [-3.2, 55.9, 9], [-4.2, 57.1, 7], [-0.1, 51.5, 12], [2.3, 48.8, 11], [13.4, 52.5, 10],
      [12.5, 41.9, 9], [-3.7, 40.4, 9], [37.6, 55.7, 11], [29.0, 41.0, 10],
      [31.2, 30.0, 13], [32.5, 29.0, 7], [55.3, 25.2, 10],
      [36.8, -1.3, 10], [35.1, -1.4, 7], [3.4, 6.5, 9], [28.0, -26.2, 9],
      [151.2, -33.8, 12], [144.9, -37.8, 10], [153.0, -27.5, 8],
      [-74.0, 40.7, 13], [-87.6, 41.8, 10], [-118.2, 34.0, 11], [-99.1, 19.4, 10], [-46.6, -23.5, 11],
    ];
    for (const [lng, lat, r] of hubs) {
      const cx = lngToX(lng, 1024);
      const cy = latToY(lat, 512);
      const grad = nCtx.createRadialGradient(cx, cy, 0.5, cx, cy, r * 1.4);
      grad.addColorStop(0, 'rgba(255, 228, 152, 0.96)');
      grad.addColorStop(0.45, 'rgba(255, 176, 98, 0.48)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      nCtx.fillStyle = grad;
      nCtx.beginPath();
      nCtx.arc(cx, cy, r * 1.4, 0, Math.PI * 2);
      nCtx.fill();
    }
  }

  const albedoMap = new THREE.CanvasTexture(albedoCanvas);
  albedoMap.colorSpace = THREE.SRGBColorSpace;
  albedoMap.anisotropy = aniso;

  const roughnessMap = new THREE.CanvasTexture(roughCanvas);
  roughnessMap.anisotropy = aniso;

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.anisotropy = aniso;

  const cloudsMap = new THREE.CanvasTexture(cloudCanvas);
  cloudsMap.colorSpace = THREE.SRGBColorSpace;
  cloudsMap.anisotropy = aniso;

  const nightLightsMap = new THREE.CanvasTexture(nightCanvas);
  nightLightsMap.colorSpace = THREE.SRGBColorSpace;
  nightLightsMap.anisotropy = aniso;

  return { albedoMap, bumpMap, roughnessMap, cloudsMap, nightLightsMap };
}
