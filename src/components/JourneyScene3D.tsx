import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * Experimental V6 route miniature.
 * The scene follows the real-solid, orbitable Three.js approach from
 * lhlGitHub/threejs-architecture-effects (MIT), adapted for the Majestic walk.
 */
export default function JourneyScene3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const restartAtRef = useRef(0);
  const [webglFailed, setWebglFailed] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xd9c49b, 28, 55);

    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    camera.position.set(21, 18, 25);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      setWebglFailed(true);
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 700 ? 1.35 : 1.8));
    renderer.setClearColor(0xd9c49b, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    const materials = {
      ground: new THREE.MeshStandardMaterial({ color: 0xd8c39b, roughness: 0.9 }),
      grid: new THREE.LineBasicMaterial({ color: 0x7b5a37, transparent: true, opacity: 0.11 }),
      routeBase: new THREE.MeshStandardMaterial({ color: 0xf0e5cf, roughness: 0.8 }),
      route: new THREE.MeshStandardMaterial({ color: 0xa65f2c, roughness: 0.62, metalness: 0.04 }),
      charcoal: new THREE.MeshStandardMaterial({ color: 0x17191a, roughness: 0.72 }),
      brown: new THREE.MeshStandardMaterial({ color: 0x3a251d, roughness: 0.72 }),
      timber: new THREE.MeshStandardMaterial({ color: 0x6d4528, roughness: 0.74 }),
      cream: new THREE.MeshStandardMaterial({ color: 0xf0e5cf, roughness: 0.88 }),
      yellow: new THREE.MeshStandardMaterial({
        color: 0xe6b92c,
        roughness: 0.58,
        emissive: 0x6d4c05,
        emissiveIntensity: 0.12,
      }),
      green: new THREE.MeshStandardMaterial({ color: 0x31543a, roughness: 0.78 }),
      coral: new THREE.MeshStandardMaterial({ color: 0xe4574f, roughness: 0.68 }),
      glass: new THREE.MeshPhysicalMaterial({
        color: 0x8faeb5,
        roughness: 0.22,
        metalness: 0.02,
        transparent: true,
        opacity: 0.7,
      }),
      steel: new THREE.MeshStandardMaterial({ color: 0x777b7b, roughness: 0.38, metalness: 0.68 }),
      skin: new THREE.MeshStandardMaterial({ color: 0xc47f63, roughness: 0.82 }),
      hair: new THREE.MeshStandardMaterial({ color: 0x2b201b, roughness: 0.92 }),
      white: new THREE.MeshStandardMaterial({ color: 0xf7f1e5, roughness: 0.85 }),
      lens: new THREE.MeshPhysicalMaterial({
        color: 0xdde6e8,
        roughness: 0.12,
        transmission: 0.08,
        transparent: true,
        opacity: 0.45,
      }),
    };

    const hemi = new THREE.HemisphereLight(0xfff7e8, 0x6c5642, 1.35);
    scene.add(hemi);

    const key = new THREE.DirectionalLight(0xffedca, 2.35);
    key.position.set(-14, 24, 18);
    key.castShadow = true;
    key.shadow.mapSize.set(1536, 1536);
    key.shadow.camera.left = -20;
    key.shadow.camera.right = 20;
    key.shadow.camera.top = 18;
    key.shadow.camera.bottom = -18;
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 70;
    key.shadow.bias = -0.0002;
    scene.add(key, key.target);

    const rim = new THREE.DirectionalLight(0xf2c75b, 0.8);
    rim.position.set(18, 11, -17);
    scene.add(rim);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0.7, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.075;
    controls.enablePan = false;
    controls.minDistance = 18;
    controls.maxDistance = 42;
    controls.minPolarAngle = 0.46;
    controls.maxPolarAngle = Math.PI * 0.47;
    controls.autoRotate = false;

    const base = new THREE.Mesh(new THREE.BoxGeometry(29, 0.55, 18.5), materials.ground);
    base.position.y = -0.34;
    base.receiveShadow = true;
    scene.add(base);

    const gridPositions: number[] = [];
    for (let x = -13; x <= 13; x += 2) {
      gridPositions.push(x, -0.04, -8.2, x, -0.04, 8.2);
    }
    for (let z = -8; z <= 8; z += 2) {
      gridPositions.push(-13.4, -0.04, z, 13.4, -0.04, z);
    }
    const gridGeometry = new THREE.BufferGeometry();
    gridGeometry.setAttribute("position", new THREE.Float32BufferAttribute(gridPositions, 3));
    scene.add(new THREE.LineSegments(gridGeometry, materials.grid));

    const assembled: Array<{ object: THREE.Object3D; finalY: number; delay: number }> = [];
    const addAssembly = (object: THREE.Object3D, delay: number) => {
      assembled.push({ object, finalY: object.position.y, delay });
      scene.add(object);
    };

    const mesh = (
      geometry: THREE.BufferGeometry,
      material: THREE.Material,
      position: [number, number, number],
      cast = true,
      receive = true,
    ) => {
      const item = new THREE.Mesh(geometry, material);
      item.position.set(...position);
      item.castShadow = cast;
      item.receiveShadow = receive;
      return item;
    };

    const makeLabel = (title: string, subtitle: string, accent: string) => {
      const canvas = document.createElement("canvas");
      canvas.width = 640;
      canvas.height = 160;
      const ctx = canvas.getContext("2d");
      if (!ctx) return new THREE.Sprite();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(23,25,26,.92)";
      ctx.fillRect(8, 8, 624, 144);
      ctx.fillStyle = accent;
      ctx.fillRect(8, 8, 12, 144);
      ctx.fillStyle = "#f0e5cf";
      ctx.font = "700 42px Arial";
      ctx.fillText(title, 46, 68);
      ctx.fillStyle = "rgba(240,229,207,.72)";
      ctx.font = "600 23px Arial";
      ctx.fillText(subtitle, 46, 113);
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearFilter;
      const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false }),
      );
      sprite.scale.set(5.7, 1.42, 1);
      sprite.renderOrder = 20;
      return sprite;
    };

    const makeStation = () => {
      const group = new THREE.Group();
      group.position.set(-9.2, 0, 4.4);

      const platform = mesh(new THREE.BoxGeometry(6.2, 0.38, 4.5), materials.cream, [0, 0.1, 0]);
      const hall = mesh(new THREE.BoxGeometry(4.8, 2.05, 3.1), materials.charcoal, [0, 1.25, 0]);
      const roof = mesh(new THREE.BoxGeometry(5.5, 0.34, 3.7), materials.steel, [0, 2.48, 0]);
      group.add(platform, hall, roof);

      for (const x of [-1.75, -0.58, 0.58, 1.75]) {
        const windowPanel = mesh(new THREE.BoxGeometry(0.72, 0.9, 0.08), materials.glass, [x, 1.26, 1.59], false);
        group.add(windowPanel);
      }

      const sign = makeLabel("MAJESTIC", "STATION · START", "#E6B92C");
      sign.position.set(0, 4.15, 0);
      group.add(sign);
      return group;
    };

    const makeBrewery = () => {
      const group = new THREE.Group();
      group.position.set(8.4, 0, -3.55);

      const terrace = mesh(new THREE.BoxGeometry(6.7, 0.38, 4.8), materials.brown, [0, 0.12, 0]);
      const lower = mesh(new THREE.BoxGeometry(5.7, 1.25, 3.7), materials.charcoal, [0, 0.93, 0]);
      const upper = mesh(new THREE.BoxGeometry(5.35, 1.2, 3.35), materials.timber, [0, 2.15, 0]);
      const roof = mesh(new THREE.BoxGeometry(6.15, 0.36, 4.15), materials.yellow, [0, 2.98, 0]);
      group.add(terrace, lower, upper, roof);

      for (const x of [-1.8, -0.6, 0.6, 1.8]) {
        const glass = mesh(new THREE.BoxGeometry(0.78, 0.78, 0.07), materials.glass, [x, 2.13, 1.72], false);
        group.add(glass);
      }

      for (const x of [-1.05, 1.05]) {
        const tank = mesh(new THREE.CylinderGeometry(0.62, 0.62, 2.0, 28), materials.steel, [x, 1.3, -2.35]);
        group.add(tank);
      }

      const door = mesh(new THREE.BoxGeometry(1.0, 1.75, 0.09), materials.yellow, [0, 0.98, 1.91], false);
      group.add(door);

      const sign = makeLabel("V6 BREVVSKI", "DESTINATION · FIVE MIN", "#A65F2C");
      sign.position.set(0, 4.28, 0);
      group.add(sign);
      return group;
    };

    const station = makeStation();
    const brewery = makeBrewery();
    addAssembly(station, 0.05);
    addAssembly(brewery, 0.34);

    const cityBlocks: Array<[number, number, number, number, number, number]> = [
      [-4.8, 0.62, -5.4, 3.0, 1.25, 2.2],
      [-1.1, 0.5, -5.9, 2.2, 1.0, 1.75],
      [3.0, 0.72, 5.6, 3.2, 1.45, 2.0],
      [6.0, 0.48, 5.3, 2.25, 0.95, 1.8],
      [-4.2, 0.42, 6.15, 1.85, 0.84, 1.35],
      [1.5, 0.43, 6.2, 1.7, 0.86, 1.2],
    ];
    cityBlocks.forEach(([x, y, z, w, h, d], index) => {
      const block = mesh(
        new THREE.BoxGeometry(w, h, d),
        index % 2 ? materials.cream : materials.brown,
        [x, y, z],
        true,
        true,
      );
      block.material = (block.material as THREE.MeshStandardMaterial).clone();
      const blockMaterial = block.material as THREE.MeshStandardMaterial;
      blockMaterial.transparent = true;
      blockMaterial.opacity = 0.26;
      addAssembly(block, 0.1 + index * 0.045);
    });

    const routePoints = [
      new THREE.Vector3(-9.0, 0.12, 2.7),
      new THREE.Vector3(-6.0, 0.16, 1.45),
      new THREE.Vector3(-2.8, 0.16, 1.75),
      new THREE.Vector3(0.5, 0.17, 0.5),
      new THREE.Vector3(4.1, 0.17, -1.95),
      new THREE.Vector3(8.0, 0.16, -2.75),
    ];
    const routeCurve = new THREE.CatmullRomCurve3(routePoints, false, "catmullrom", 0.35);
    const routeUnderlay = new THREE.Mesh(
      new THREE.TubeGeometry(routeCurve, 96, 0.25, 10, false),
      materials.routeBase,
    );
    routeUnderlay.receiveShadow = true;
    scene.add(routeUnderlay);

    const route = new THREE.Mesh(
      new THREE.TubeGeometry(routeCurve, 96, 0.09, 8, false),
      materials.route,
    );
    route.position.y = 0.03;
    route.castShadow = true;
    scene.add(route);

    for (let index = 1; index < 12; index += 1) {
      const point = routeCurve.getPointAt(index / 12);
      const dot = mesh(new THREE.SphereGeometry(0.12, 14, 10), materials.yellow, [point.x, 0.38, point.z], false);
      scene.add(dot);
    }

    const startMarker = mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.12, 32), materials.coral, [-9.0, 0.18, 2.7]);
    const endMarker = mesh(new THREE.CylinderGeometry(0.64, 0.64, 0.13, 32), materials.yellow, [8.0, 0.19, -2.75]);
    scene.add(startMarker, endMarker);

    const lampPositions: Array<[number, number]> = [
      [-5.7, 0.15],
      [-1.8, 1.1],
      [2.0, -0.55],
      [5.4, -2.45],
    ];
    lampPositions.forEach(([x, z]) => {
      const pole = mesh(new THREE.CylinderGeometry(0.045, 0.06, 2.2, 10), materials.charcoal, [x, 1.1, z]);
      const lamp = mesh(new THREE.SphereGeometry(0.16, 14, 10), materials.yellow, [x, 2.22, z], false);
      scene.add(pole, lamp);
    });

    const boy = new THREE.Group();
    const character = new THREE.Group();
    boy.add(character);

    const torso = mesh(new THREE.BoxGeometry(1.28, 1.55, 0.78), materials.green, [0, 2.08, 0]);
    torso.rotation.z = -0.04;
    character.add(torso);

    const jacketFront = mesh(new THREE.BoxGeometry(1.05, 0.5, 0.09), materials.yellow, [0, 2.25, 0.435], false);
    character.add(jacketFront);

    const neck = mesh(new THREE.CylinderGeometry(0.27, 0.3, 0.42, 18), materials.skin, [0, 3.02, 0]);
    character.add(neck);

    const head = mesh(new THREE.SphereGeometry(0.88, 28, 20), materials.skin, [0, 3.72, 0], true, false);
    head.scale.set(0.95, 1.0, 0.9);
    character.add(head);

    const hairBack = mesh(new THREE.SphereGeometry(0.9, 24, 18), materials.hair, [0, 3.78, -0.34]);
    hairBack.scale.set(1.02, 0.88, 0.72);
    character.add(hairBack);

    const cap = mesh(new THREE.CylinderGeometry(0.98, 1.02, 0.72, 30), materials.yellow, [0, 4.45, -0.02]);
    character.add(cap);
    const capBand = mesh(new THREE.CylinderGeometry(1.025, 1.025, 0.24, 30), materials.green, [0, 4.22, 0.02]);
    character.add(capBand);
    const pom = mesh(new THREE.SphereGeometry(0.34, 18, 14), materials.steel, [0, 4.93, -0.02]);
    character.add(pom);

    const leftLens = mesh(new THREE.TorusGeometry(0.4, 0.055, 10, 28), materials.charcoal, [-0.43, 3.82, 0.76], false);
    const rightLens = mesh(new THREE.TorusGeometry(0.4, 0.055, 10, 28), materials.charcoal, [0.43, 3.82, 0.76], false);
    const bridge = mesh(new THREE.BoxGeometry(0.22, 0.055, 0.055), materials.charcoal, [0, 3.82, 0.76], false);
    character.add(leftLens, rightLens, bridge);

    const leftGlass = mesh(new THREE.CircleGeometry(0.35, 24), materials.lens, [-0.43, 3.82, 0.74], false, false);
    const rightGlass = mesh(new THREE.CircleGeometry(0.35, 24), materials.lens, [0.43, 3.82, 0.74], false, false);
    character.add(leftGlass, rightGlass);

    const leftEye = mesh(new THREE.SphereGeometry(0.09, 14, 10), materials.hair, [-0.43, 3.82, 0.8], false);
    const rightEye = mesh(new THREE.SphereGeometry(0.09, 14, 10), materials.hair, [0.43, 3.82, 0.8], false);
    character.add(leftEye, rightEye);

    const smile = mesh(new THREE.TorusGeometry(0.2, 0.035, 8, 18, Math.PI), materials.hair, [0, 3.42, 0.78], false);
    smile.rotation.z = Math.PI;
    character.add(smile);

    const armLeftPivot = new THREE.Group();
    armLeftPivot.position.set(-0.78, 2.66, 0);
    const armLeft = mesh(new THREE.CapsuleGeometry(0.18, 1.0, 5, 10), materials.coral, [0, -0.58, 0]);
    armLeftPivot.add(armLeft);
    character.add(armLeftPivot);

    const armRightPivot = new THREE.Group();
    armRightPivot.position.set(0.78, 2.66, 0);
    const armRight = mesh(new THREE.CapsuleGeometry(0.18, 1.0, 5, 10), materials.coral, [0, -0.58, 0]);
    armRightPivot.add(armRight);
    character.add(armRightPivot);

    const legLeftPivot = new THREE.Group();
    legLeftPivot.position.set(-0.34, 1.35, 0);
    const legLeft = mesh(new THREE.CapsuleGeometry(0.22, 1.05, 5, 10), materials.charcoal, [0, -0.68, 0]);
    const shoeLeft = mesh(new THREE.BoxGeometry(0.48, 0.22, 0.72), materials.white, [0, -1.3, 0.16]);
    legLeftPivot.add(legLeft, shoeLeft);
    character.add(legLeftPivot);

    const legRightPivot = new THREE.Group();
    legRightPivot.position.set(0.34, 1.35, 0);
    const legRight = mesh(new THREE.CapsuleGeometry(0.22, 1.05, 5, 10), materials.charcoal, [0, -0.68, 0]);
    const shoeRight = mesh(new THREE.BoxGeometry(0.48, 0.22, 0.72), materials.white, [0, -1.3, 0.16]);
    legRightPivot.add(legRight, shoeRight);
    character.add(legRightPivot);

    character.scale.setScalar(0.68);
    scene.add(boy);

    const arrivalGlow = new THREE.PointLight(0xe6b92c, 0, 10, 2);
    arrivalGlow.position.set(8.1, 3.0, -2.55);
    scene.add(arrivalGlow);

    const resize = () => {
      const width = Math.max(1, mount.clientWidth);
      const height = Math.max(1, mount.clientHeight);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.fov = camera.aspect < 0.75 ? 43 : 36;
      camera.updateProjectionMatrix();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    resize();

    const sceneStartedAt = performance.now();
    restartAtRef.current = sceneStartedAt;
    let raf = 0;

    const easeOutCubic = (value: number) => 1 - Math.pow(1 - value, 3);
    const smoothstep = (value: number) => value * value * (3 - 2 * value);

    const render = (now: number) => {
      const sceneSeconds = (now - sceneStartedAt) / 1000;
      const walkSeconds = Math.max(0, (now - restartAtRef.current) / 1000);

      assembled.forEach(({ object, finalY, delay }) => {
        const local = THREE.MathUtils.clamp((sceneSeconds - delay) / 1.15, 0, 1);
        const lift = reducedMotion ? 1 : easeOutCubic(local);
        object.position.y = finalY + (1 - lift) * 4.5;
      });

      const rawProgress = reducedMotion ? 1 : THREE.MathUtils.clamp(walkSeconds / 7.2, 0, 1);
      const walkProgress = smoothstep(rawProgress);
      const point = routeCurve.getPointAt(walkProgress);
      const tangent = routeCurve.getTangentAt(Math.min(0.999, walkProgress + 0.002)).normalize();
      boy.position.set(point.x, 0.23, point.z);
      boy.rotation.y = Math.atan2(tangent.x, tangent.z);

      const isWalking = rawProgress < 0.995 && !reducedMotion;
      const stride = isWalking ? Math.sin(walkSeconds * 8.8) * 0.58 : 0;
      armLeftPivot.rotation.x = stride;
      armRightPivot.rotation.x = -stride;
      legLeftPivot.rotation.x = -stride * 0.78;
      legRightPivot.rotation.x = stride * 0.78;
      character.position.y = isWalking ? Math.abs(Math.sin(walkSeconds * 8.8)) * 0.07 : 0;
      character.rotation.z = isWalking ? Math.sin(walkSeconds * 4.4) * 0.025 : 0;

      if (rawProgress >= 0.995) {
        arrivalGlow.intensity = reducedMotion ? 2.2 : 2.0 + Math.sin(walkSeconds * 4.5) * 0.45;
        (materials.yellow as THREE.MeshStandardMaterial).emissiveIntensity = 0.2 + Math.abs(Math.sin(walkSeconds * 3.1)) * 0.16;
      } else {
        arrivalGlow.intensity = 0;
        (materials.yellow as THREE.MeshStandardMaterial).emissiveIntensity = 0.12;
      }

      controls.update();
      if (!document.hidden) renderer.render(scene, camera);
      raf = requestAnimationFrame(render);
    };

    renderer.compile(scene, camera);
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      controls.dispose();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          const objectMaterials = Array.isArray(object.material) ? object.material : [object.material];
          objectMaterials.forEach((material) => {
            const mappedMaterial = material as THREE.Material & { map?: THREE.Texture | null };
            mappedMaterial.map?.dispose();
            material.dispose();
          });
        }
        if (object instanceof THREE.Sprite) {
          const spriteMaterial = object.material as THREE.SpriteMaterial;
          spriteMaterial.map?.dispose();
          spriteMaterial.dispose();
        }
      });
      gridGeometry.dispose();
      Object.values(materials).forEach((material) => material.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div className="journey-3d" role="group" aria-label="Interactive 3D walk from Majestic station to V6 Brevvski">
      <div ref={mountRef} className="journey-3d__mount" />
      <div className="journey-3d__chrome">
        <div>
          <span className="journey-3d__eyebrow">3D route / Majestic</span>
          <strong>Walk this way</strong>
        </div>
        <button
          type="button"
          onClick={() => {
            restartAtRef.current = performance.now();
          }}
        >
          Replay walk
        </button>
      </div>
      <div className="journey-3d__hint">
        <span>Drag to orbit</span>
        <span>Scroll to zoom</span>
        <span>05 min / on foot</span>
      </div>
      {webglFailed && (
        <div className="journey-3d__fallback">
          <strong>3D preview unavailable</strong>
          <span>Your browser could not start WebGL.</span>
        </div>
      )}
    </div>
  );
}
