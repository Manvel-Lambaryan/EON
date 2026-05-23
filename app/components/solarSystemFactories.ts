import {
  AdditiveBlending,
  BackSide,
  BufferGeometry,
  CanvasTexture,
  Color,
  DoubleSide,
  EllipseCurve,
  Float32BufferAttribute,
  Line,
  LineBasicMaterial,
  Material,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PlaneGeometry,
  Points,
  PointsMaterial,
  RingGeometry,
  ShaderMaterial,
  Scene,
  SRGBColorSpace,
  SphereGeometry,
  Texture,
  TextureLoader,
  Vector2,
} from 'three';
import { NEBULA_SPECS } from './solarSystemDefinitions';
import type { PlanetDefinition } from './solarSystemDefinitions';

export function createStarfield(count: number, spread: number, size: number, tint: string): Points {
  const starGeometry = new BufferGeometry();
  const vertices: number[] = [];
  const colors: number[] = [];
  const tintColor = new Color(tint);

  for (let index = 0; index < count; index += 1) {
    const distance = Math.random() * spread;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const sparkle = 0.5 + Math.random() * 0.5;
    vertices.push(
      distance * Math.sin(phi) * Math.cos(theta),
      distance * Math.cos(phi),
      distance * Math.sin(phi) * Math.sin(theta),
    );
    colors.push(tintColor.r * sparkle, tintColor.g * sparkle, tintColor.b * sparkle);
  }

  starGeometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
  starGeometry.setAttribute('color', new Float32BufferAttribute(colors, 3));
  const starTexture = createSoftParticleTexture();
  starTexture.colorSpace = SRGBColorSpace;
  return new Points(
    starGeometry,
    new PointsMaterial({
      map: starTexture,
      alphaMap: starTexture,
      size,
      transparent: true,
      vertexColors: true,
      opacity: 0.9,
      blending: AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    }),
  );
}

export function createOrbitLine(distance: number, eccentricity: number): Line {
  const curve = new EllipseCurve(0, 0, distance, distance * eccentricity, 0, Math.PI * 2, false, 0);
  const orbitGeometry = new BufferGeometry().setFromPoints(curve.getPoints(180));
  const orbitMaterial = new LineBasicMaterial({
    color: '#40567e',
    transparent: true,
    opacity: 0.24,
  });
  const orbitLine = new Line(orbitGeometry, orbitMaterial);
  orbitLine.rotation.x = Math.PI / 2;
  return orbitLine;
}

export function createPlanetMesh(planet: PlanetDefinition, textureLoader: TextureLoader): Mesh {
  const baseMap = loadColorTexture(textureLoader, planet.textureUrl);
  const normalMap = planet.normalMapUrl ? loadLinearTexture(textureLoader, planet.normalMapUrl) : null;
  const bumpMap = planet.bumpMapUrl ? loadLinearTexture(textureLoader, planet.bumpMapUrl) : null;
  const material = new MeshStandardMaterial({
    map: baseMap,
    normalMap: normalMap ?? null,
    bumpMap: bumpMap ?? null,
    bumpScale: planet.bumpScale ?? 0.05,
    color: new Color(1.18, 1.18, 1.18),
    roughness: (planet.roughness ?? 0.8) * 0.58,
    metalness: planet.metalness ?? 0.02,
    emissive: '#ffffff',
    emissiveIntensity: 0.28,
    transparent: false,
    opacity: 1,
  });
  forceOpaqueTextureSampling(material);
  const mesh = new Mesh(new SphereGeometry(planet.radius, 64, 64), material);
  mesh.castShadow = false;
  mesh.receiveShadow = false;
  mesh.position.set(planet.distance, 0, 0);
  mesh.rotation.z = (planet.tilt * Math.PI) / 180;

  if (planet.atmosphere) {
    mesh.add(createAtmosphereGlow(planet.radius, planet.atmosphere));
  }

  if (planet.ring) {
    const ringMap = loadColorTexture(textureLoader, planet.ring.textureUrl);
    const ring = new Mesh(
      new RingGeometry(planet.ring.innerRadius, planet.ring.outerRadius, 128),
      new MeshStandardMaterial({
        map: ringMap,
        alphaMap: ringMap,
        color: new Color(1.25, 1.15, 0.95),
        transparent: true,
        opacity: 0.95,
        roughness: 0.72,
        metalness: 0.0,
        emissive: '#fff8e8',
        emissiveIntensity: 0.18,
        side: DoubleSide,
      }),
    );
    ring.rotation.x = Math.PI / 2.1;
    mesh.add(ring);
  }

  return mesh;
}

function forceOpaqueTextureSampling(material: MeshStandardMaterial): void {
  material.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      'diffuseColor *= sampledDiffuseColor;',
      'diffuseColor.rgb *= sampledDiffuseColor.rgb;',
    );
  };
  material.needsUpdate = true;
}

export function configureNebula(scene: Scene): Texture[] {
  const textures: Texture[] = [];

  NEBULA_SPECS.forEach((spec) => {
    const texture = createNebulaTexture(spec.color);
    textures.push(texture);
    const cloud = new Mesh(
      new PlaneGeometry(spec.scale[0], spec.scale[1]),
      new MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.5,
        depthWrite: false,
        blending: AdditiveBlending,
      }),
    );
    cloud.position.set(spec.position[0], spec.position[1], spec.position[2]);
    scene.add(cloud);
  });

  return textures;
}

export function disposeMaterial(material: Material | Material[]): void {
  const materials = Array.isArray(material) ? material : [material];
  materials.forEach((current) => {
    disposeMaterialMaps(current);
    current.dispose();
  });
}

function createNebulaTexture(color: string): CanvasTexture {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  const context = canvas.getContext('2d');
  if (!context) {
    return new CanvasTexture(canvas);
  }

  const center = new Vector2(size / 2, size / 2);
  const gradient = context.createRadialGradient(
    center.x,
    center.y,
    size * 0.05,
    center.x,
    center.y,
    size * 0.5,
  );
  gradient.addColorStop(0, `${color}dd`);
  gradient.addColorStop(0.4, `${color}66`);
  gradient.addColorStop(1, `${color}00`);
  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);

  return new CanvasTexture(canvas);
}

function createSoftParticleTexture(): CanvasTexture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d');
  if (!context) {
    return new CanvasTexture(canvas);
  }
  const center = size / 2;
  const gradient = context.createRadialGradient(center, center, 1, center, center, center);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.45, 'rgba(255,255,255,0.6)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);
  return new CanvasTexture(canvas);
}

function createAtmosphereGlow(radius: number, color: string): Mesh {
  const material = new ShaderMaterial({
    uniforms: {
      glowColor: { value: new Color(color) },
      intensityPower: { value: 2.4 },
    },
    vertexShader: `
      varying vec3 vWorldNormal;
      varying vec3 vWorldPosition;
      void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        vWorldNormal = normalize(mat3(modelMatrix) * normal);
        gl_Position = projectionMatrix * viewMatrix * worldPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 glowColor;
      uniform float intensityPower;
      varying vec3 vWorldNormal;
      varying vec3 vWorldPosition;
      void main() {
        vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
        float fresnel = pow(1.0 - max(dot(viewDirection, normalize(vWorldNormal)), 0.0), intensityPower);
        gl_FragColor = vec4(glowColor, fresnel * 0.62);
      }
    `,
    transparent: true,
    blending: AdditiveBlending,
    depthWrite: false,
    side: BackSide,
  });
  return new Mesh(new SphereGeometry(radius * 1.06, 48, 48), material);
}

function loadColorTexture(textureLoader: TextureLoader, url: string): Texture {
  const texture = textureLoader.load(url);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

function loadLinearTexture(textureLoader: TextureLoader, url: string): Texture {
  const texture = textureLoader.load(url);
  return texture;
}

function disposeMaterialMaps(material: Material): void {
  const mapMaterial = material as Material & {
    map?: Texture | null;
    alphaMap?: Texture | null;
    normalMap?: Texture | null;
    bumpMap?: Texture | null;
  };
  const maps = [mapMaterial.map, mapMaterial.alphaMap, mapMaterial.normalMap, mapMaterial.bumpMap];
  maps.forEach((map) => {
    if (map) {
      map.dispose();
    }
  });
}
