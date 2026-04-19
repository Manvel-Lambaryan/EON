import {
  AdditiveBlending,
  BufferGeometry,
  CanvasTexture,
  Color,
  EllipseCurve,
  Float32BufferAttribute,
  Line,
  LineBasicMaterial,
  Material,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  PlaneGeometry,
  Points,
  PointsMaterial,
  Scene,
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

  for (let index = 0; index < count; index += 1) {
    const distance = Math.random() * spread;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    vertices.push(
      distance * Math.sin(phi) * Math.cos(theta),
      distance * Math.cos(phi),
      distance * Math.sin(phi) * Math.sin(theta),
    );
  }

  starGeometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
  return new Points(
    starGeometry,
    new PointsMaterial({
      color: tint,
      size,
      transparent: true,
      opacity: 0.95,
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
    opacity: 0.38,
  });
  const orbitLine = new Line(orbitGeometry, orbitMaterial);
  orbitLine.rotation.x = Math.PI / 2;
  return orbitLine;
}

export function createPlanetMesh(planet: PlanetDefinition, textureLoader: TextureLoader): Mesh {
  const material = new MeshPhongMaterial({
    map: textureLoader.load(planet.textureUrl),
    shininess: planet.name === 'Earth' ? 22 : 12,
    specular: new Color(planet.name === 'Earth' ? '#9ecbff' : '#5d6775'),
  });
  const mesh = new Mesh(new SphereGeometry(planet.radius, 64, 64), material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.position.set(planet.distance, 0, 0);
  mesh.rotation.z = (planet.tilt * Math.PI) / 180;

  if (planet.atmosphere) {
    mesh.add(
      new Mesh(
        new SphereGeometry(planet.radius * 1.04, 48, 48),
        new MeshBasicMaterial({
          color: planet.atmosphere,
          transparent: true,
          opacity: 0.18,
          blending: AdditiveBlending,
        }),
      ),
    );
  }

  if (planet.ring) {
    const points = new EllipseCurve(
      0,
      0,
      planet.ring.outerRadius,
      planet.ring.innerRadius * 0.75,
      0,
      Math.PI * 2,
      false,
    ).getPoints(220);
    const ring = new Line(
      new BufferGeometry().setFromPoints(points),
      new LineBasicMaterial({
        map: textureLoader.load(planet.ring.textureUrl),
        color: '#dab87f',
        transparent: true,
        opacity: 0.85,
      }),
    );
    ring.rotation.x = Math.PI / 2.1;
    mesh.add(ring);
  }

  return mesh;
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
    const map = (current as MeshPhongMaterial | MeshBasicMaterial).map;
    if (map) {
      map.dispose();
    }
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
