'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import {
  ACESFilmicToneMapping,
  AmbientLight,
  Timer,
  Color,
  Group,
  HemisphereLight,
  Line,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PointLight,
  Points,
  SRGBColorSpace,
  Scene,
  SphereGeometry,
  TextureLoader,
  WebGLRenderer,
} from 'three';
import type { ReactElement } from 'react';
import {
  configureNebula,
  createOrbitLine,
  createPlanetMesh,
  createStarfield,
  disposeMaterial,
} from './solarSystemFactories';
import { PLANET_DEFINITIONS } from './solarSystemDefinitions';

const NAV_ITEMS = ['Home', 'About', 'Gallery', 'Books', 'Contact', 'Journal'];

type PlanetRuntime = {
  orbitGroup: Group;
  mesh: Mesh;
  rotationSpeed: number;
  orbitSpeed: number;
};

function createPlanet(
  planet: (typeof PLANET_DEFINITIONS)[number],
  textureLoader: TextureLoader,
  scene: Scene,
  runtimePlanets: PlanetRuntime[],
): void {
  const orbitGroup = new Group();
  orbitGroup.rotation.x = Math.PI * 0.06;
  scene.add(orbitGroup);
  scene.add(createOrbitLine(planet.distance, planet.eccentricity));
  const mesh = createPlanetMesh(planet, textureLoader);
  orbitGroup.add(mesh);
  runtimePlanets.push({
    orbitGroup,
    mesh,
    rotationSpeed: planet.rotationSpeed,
    orbitSpeed: planet.orbitSpeed,
  });
}

export function SolarSystemScene(): ReactElement {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) {
      return undefined;
    }

    let initFrameId = 0;
    let frameId = 0;
    let disposed = false;
    let cleanupScene: (() => void) | null = null;

    const initializeScene = () => {
      if (disposed || !mount) {
        return;
      }

      const width = mount.clientWidth;
      const height = mount.clientHeight;
      if (width < 2 || height < 2) {
        initFrameId = window.requestAnimationFrame(initializeScene);
        return;
      }

    const scene = new Scene();
    scene.background = new Color('#02040b');

    const camera = new PerspectiveCamera(55, width / height, 0.1, 2500);
    camera.position.set(-40, 50, 185);

    const renderer = new WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.outputColorSpace = SRGBColorSpace;
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.38;
    mount.appendChild(renderer.domElement);

    const ambient = new AmbientLight('#5a78a8', 0.72);
    scene.add(ambient);
    const hemiFill = new HemisphereLight('#7090c0', '#182030', 0.52);
    scene.add(hemiFill);

    const sunLight = new PointLight('#ffd27e', 58, 2200, 1.05);
    sunLight.position.set(0, 0, 0);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    scene.add(sunLight);

    const sunMesh = new Mesh(
      new SphereGeometry(10.8, 96, 96),
      new MeshBasicMaterial({ color: '#ffd76c' }),
    );
    scene.add(sunMesh);

    const textureLoader = new TextureLoader();
    textureLoader.setCrossOrigin('anonymous');
    const runtimePlanets: PlanetRuntime[] = [];
    PLANET_DEFINITIONS.forEach((planet) => createPlanet(planet, textureLoader, scene, runtimePlanets));

    const farStars = createStarfield(3800, 1450, 0.68, '#f4f8ff');
    const midStars = createStarfield(2200, 980, 1.05, '#e9f1ff');
    const dustStars = createStarfield(1200, 560, 1.4, '#9ec5ff');
    scene.add(farStars, midStars, dustStars);

    const nebulaTextures = configureNebula(scene);
    const timer = new Timer();
    timer.connect(document);

    const animate = () => {
      frameId = window.requestAnimationFrame(animate);
      if (document.hidden) {
        return;
      }
      timer.update();
      const delta = Math.min(timer.getDelta(), 0.05);
      const elapsed = timer.getElapsed();

      sunMesh.rotation.y += delta * 0.07;
      farStars.rotation.y = elapsed * 0.004;
      midStars.rotation.y = -elapsed * 0.0025;
      dustStars.rotation.y = elapsed * 0.009;

      runtimePlanets.forEach((planetRuntime) => {
        planetRuntime.mesh.rotation.y += planetRuntime.rotationSpeed * delta * 10;
        planetRuntime.orbitGroup.rotation.y += planetRuntime.orbitSpeed * delta * 2;
      });

      camera.position.x = Math.sin(elapsed * 0.08) * 8 - 42;
      camera.position.y = 45 + Math.cos(elapsed * 0.07) * 4;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };

    const handleResize = () => {
      if (!mount || disposed) {
        return;
      }
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };

    window.addEventListener('resize', handleResize);
    animate();

      cleanupScene = () => {
      window.removeEventListener('resize', handleResize);
      window.cancelAnimationFrame(frameId);
      nebulaTextures.forEach((texture) => texture.dispose());
      scene.traverse((node) => {
        if (node instanceof Mesh || node instanceof Line || node instanceof Points) {
          node.geometry.dispose();
          disposeMaterial(node.material);
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
    };

    initializeScene();

    return () => {
      disposed = true;
      window.cancelAnimationFrame(initFrameId);
      if (cleanupScene) {
        cleanupScene();
      }
    };
  }, []);

  return (
    <section
      className="solar-page"
      aria-label="Realistic solar system scene"
      style={{ position: 'relative', width: '100%', height: '100dvh', overflow: 'hidden' }}
    >
      <header className="solar-header" aria-label="Main header">
        <a href="/" className="solar-logo-link">
          <Image src="/eon-logo.png" alt="EON logo" width={240} height={96} priority className="solar-logo" />
        </a>
        <nav aria-label="Primary navigation">
          <ul className="solar-nav-list">
            {NAV_ITEMS.map((item) => (
              <li key={item}>
                <a href={`#${item.toLowerCase()}`} className="solar-nav-link">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <div className="solar-canvas" ref={mountRef} style={{ width: '100%', height: '100%' }} />
      <div className="solar-overlay" style={{ position: 'absolute', left: '2rem', bottom: '2rem' }}>
        <h1>Solar System</h1>
        <p>Real-time 3D visualization with textured planets, orbit simulation, and cinematic space lighting.</p>
      </div>
    </section>
  );
}
