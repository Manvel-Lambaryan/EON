export type PlanetDefinition = {
  name: string;
  radius: number;
  distance: number;
  rotationSpeed: number;
  orbitSpeed: number;
  tilt: number;
  eccentricity: number;
  textureUrl: string;
  normalMapUrl?: string;
  bumpMapUrl?: string;
  bumpScale?: number;
  roughness?: number;
  metalness?: number;
  atmosphere?: string;
  ring?: {
    innerRadius: number;
    outerRadius: number;
    textureUrl: string;
  };
};

export type NebulaSpec = {
  color: string;
  position: [number, number, number];
  scale: [number, number];
};

const AU_SCALE = 7.2;
const PLANET_TEXTURE_BASE = 'https://cdn.jsdelivr.net/gh/jeromeetienne/threex.planets@master/images';

export const PLANET_DEFINITIONS: PlanetDefinition[] = [
  {
    name: 'Mercury',
    radius: 0.38 * AU_SCALE,
    distance: 15,
    rotationSpeed: 0.012,
    orbitSpeed: 0.035,
    tilt: 0.02,
    eccentricity: 0.96,
    textureUrl: `${PLANET_TEXTURE_BASE}/mercurymap.jpg`,
    bumpMapUrl: `${PLANET_TEXTURE_BASE}/mercurybump.jpg`,
    bumpScale: 0.2,
    roughness: 0.9,
    metalness: 0.03,
  },
  {
    name: 'Venus',
    radius: 0.95 * AU_SCALE,
    distance: 23,
    rotationSpeed: 0.008,
    orbitSpeed: 0.025,
    tilt: 3.1,
    eccentricity: 0.98,
    textureUrl: `${PLANET_TEXTURE_BASE}/venusmap.jpg`,
    atmosphere: '#f7d8a8',
    roughness: 0.86,
    metalness: 0.02,
  },
  {
    name: 'Earth',
    radius: 1.0 * AU_SCALE,
    distance: 32,
    rotationSpeed: 0.03,
    orbitSpeed: 0.02,
    tilt: 23.5,
    eccentricity: 0.985,
    textureUrl: `${PLANET_TEXTURE_BASE}/earthmap1k.jpg`,
    normalMapUrl: `${PLANET_TEXTURE_BASE}/earthbump1k.jpg`,
    roughness: 0.62,
    metalness: 0.04,
    atmosphere: '#70c8ff',
  },
  {
    name: 'Mars',
    radius: 0.53 * AU_SCALE,
    distance: 42,
    rotationSpeed: 0.026,
    orbitSpeed: 0.016,
    tilt: 25.2,
    eccentricity: 0.975,
    textureUrl: `${PLANET_TEXTURE_BASE}/marsmap1k.jpg`,
    normalMapUrl: `${PLANET_TEXTURE_BASE}/marsbump1k.jpg`,
    roughness: 0.84,
    metalness: 0.02,
  },
  {
    name: 'Jupiter',
    radius: 11.2 * (AU_SCALE * 0.26),
    distance: 62,
    rotationSpeed: 0.06,
    orbitSpeed: 0.009,
    tilt: 3.1,
    eccentricity: 0.965,
    textureUrl: `${PLANET_TEXTURE_BASE}/jupitermap.jpg`,
    roughness: 0.82,
    metalness: 0.01,
  },
  {
    name: 'Saturn',
    radius: 9.4 * (AU_SCALE * 0.25),
    distance: 84,
    rotationSpeed: 0.052,
    orbitSpeed: 0.006,
    tilt: 26.7,
    eccentricity: 0.955,
    textureUrl: `${PLANET_TEXTURE_BASE}/saturnmap.jpg`,
    roughness: 0.78,
    metalness: 0.01,
    ring: {
      innerRadius: 12,
      outerRadius: 20,
      textureUrl: `${PLANET_TEXTURE_BASE}/saturnringcolor.jpg`,
    },
  },
  {
    name: 'Uranus',
    radius: 4.0 * (AU_SCALE * 0.25),
    distance: 106,
    rotationSpeed: 0.044,
    orbitSpeed: 0.004,
    tilt: 97.8,
    eccentricity: 0.95,
    textureUrl: `${PLANET_TEXTURE_BASE}/uranusmap.jpg`,
    roughness: 0.83,
    metalness: 0.01,
  },
  {
    name: 'Neptune',
    radius: 3.9 * (AU_SCALE * 0.25),
    distance: 126,
    rotationSpeed: 0.04,
    orbitSpeed: 0.003,
    tilt: 28.3,
    eccentricity: 0.95,
    textureUrl: `${PLANET_TEXTURE_BASE}/neptunemap.jpg`,
    roughness: 0.8,
    metalness: 0.02,
  },
];

export const NEBULA_SPECS: NebulaSpec[] = [
  { color: '#6655ff', position: [-160, 40, -220], scale: [220, 140] },
  { color: '#1a7fff', position: [160, -20, -180], scale: [200, 120] },
  { color: '#ff7cc6', position: [0, 90, -300], scale: [260, 170] },
];
