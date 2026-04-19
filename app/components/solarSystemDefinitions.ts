export type PlanetDefinition = {
  name: string;
  radius: number;
  distance: number;
  rotationSpeed: number;
  orbitSpeed: number;
  tilt: number;
  eccentricity: number;
  textureUrl: string;
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

export const PLANET_DEFINITIONS: PlanetDefinition[] = [
  {
    name: 'Mercury',
    radius: 0.38 * AU_SCALE,
    distance: 15,
    rotationSpeed: 0.012,
    orbitSpeed: 0.035,
    tilt: 0.02,
    eccentricity: 0.96,
    textureUrl: 'https://threejs.org/examples/textures/planets/mercury.jpg',
  },
  {
    name: 'Venus',
    radius: 0.95 * AU_SCALE,
    distance: 23,
    rotationSpeed: 0.008,
    orbitSpeed: 0.025,
    tilt: 3.1,
    eccentricity: 0.98,
    textureUrl: 'https://threejs.org/examples/textures/planets/venus.jpg',
    atmosphere: '#f7d8a8',
  },
  {
    name: 'Earth',
    radius: 1.0 * AU_SCALE,
    distance: 32,
    rotationSpeed: 0.03,
    orbitSpeed: 0.02,
    tilt: 23.5,
    eccentricity: 0.985,
    textureUrl: 'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg',
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
    textureUrl: 'https://threejs.org/examples/textures/planets/mars_1k_color.jpg',
  },
  {
    name: 'Jupiter',
    radius: 11.2 * (AU_SCALE * 0.26),
    distance: 62,
    rotationSpeed: 0.06,
    orbitSpeed: 0.009,
    tilt: 3.1,
    eccentricity: 0.965,
    textureUrl: 'https://threejs.org/examples/textures/planets/jupiter2_1k.jpg',
  },
  {
    name: 'Saturn',
    radius: 9.4 * (AU_SCALE * 0.25),
    distance: 84,
    rotationSpeed: 0.052,
    orbitSpeed: 0.006,
    tilt: 26.7,
    eccentricity: 0.955,
    textureUrl: 'https://threejs.org/examples/textures/planets/saturn.jpg',
    ring: {
      innerRadius: 12,
      outerRadius: 20,
      textureUrl: 'https://threejs.org/examples/textures/planets/saturnringcolor.jpg',
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
    textureUrl: 'https://threejs.org/examples/textures/planets/uranus.jpg',
  },
  {
    name: 'Neptune',
    radius: 3.9 * (AU_SCALE * 0.25),
    distance: 126,
    rotationSpeed: 0.04,
    orbitSpeed: 0.003,
    tilt: 28.3,
    eccentricity: 0.95,
    textureUrl: 'https://threejs.org/examples/textures/planets/neptune.jpg',
  },
];

export const NEBULA_SPECS: NebulaSpec[] = [
  { color: '#6655ff', position: [-160, 40, -220], scale: [220, 140] },
  { color: '#1a7fff', position: [160, -20, -180], scale: [200, 120] },
  { color: '#ff7cc6', position: [0, 90, -300], scale: [260, 170] },
];
