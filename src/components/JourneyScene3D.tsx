import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

type CameraShotName =
  | "Majestic departure"
  | "Follow cam"
  | "Street tracking"
  | "Route overview"
  | "Over the shoulder"
  | "V6 arrival";

/**
 * V6 3D journey experiment.
 *
 * This scene follows the solid-geometry, real-camera and interactive Three.js
 * principles from lhlGitHub/threejs-architecture-effects (MIT), adapted into
 * a cinematic Majestic-to-V6 miniature rather than copying its pagoda model.
 */
export default function JourneyScene3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const restartAtRef = useRef(0);
  const cinematicRef = useRef(true);
  const currentShotRef = useRef<CameraShotName>("Majestic departure");
  const [webglFailed, setWebglFailed] = useState(false);
  const [cinematic, setCinematic] = useState(true);
  const [shotLabel, setShotLabel] = useState<CameraShotName>("Majestic departure");

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xd9c49b, 0.018);

    const camera = new THREE.PerspectiveCamera(39, 1, 0.1, 120);
    camera.position.set(-14, 10, 18);

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
    renderer.toneMappingExposure = 1.02;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    const room = new RoomEnvironment();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const environment = pmrem.fromScene(room, 0.04);
    scene.environment = environment.texture;
    scene.environmentIntensity = 0.34;
    room.dispose();
    pmrem.dispose();

    const materials = {
      ground: new THREE.MeshStandardMaterial({ color: 0xd8c39b, roughness: 0.92 }),
      road: new THREE.MeshStandardMaterial({ color: 0x4b3a30, roughness: 0.96 }),
      pavement: new THREE.MeshStandardMaterial({ color: 0xb89b70, roughness: 0.94 }),
      routeBase: new THREE.MeshStandardMaterial({ color: 0xf0e5cf, roughness: 0.82 }),
      route: new THREE.MeshStandardMaterial({
        color: 0xa65f2c,
        roughness: 0.58,
        metalness: 0.04,
        emissive: 0x4a1907,
        emissiveIntensity: 0.05,
      }),
      charcoal: new THREE.MeshStandardMaterial({ color: 0x17191a, roughness: 0.74 }),
      brown: new THREE.MeshStandardMaterial({ color: 0x3a251d, roughness: 0.78 }),
      timber: new THREE.MeshStandardMaterial({ color: 0x6d4528, roughness: 0.72 }),
      timberLight: new THREE.MeshStandardMaterial({ color: 0x9a6b3d, roughness: 0.7 }),
      cream: new THREE.MeshStandardMaterial({ color: 0xf0e5cf, roughness: 0.88 }),
      yellow: new THREE.MeshStandardMaterial({
        color: 0xe6b92c,
        roughness: 0.52,
        emissive: 0x6d4c05,
        emissiveIntensity: 0.1,
      }),
      green: new THREE.MeshStandardMaterial({ color: 0x31543a, roughness: 0.78 }),
      coral: new THREE.MeshStandardMaterial({ color: 0xe4574f, roughness: 0.68 }),
      glass: new THREE.MeshPhysicalMaterial({
        color: 0x8ba2a5,
        roughness: 0.15,
        metalness: 0.02,
        transparent: true,
        opacity: 0.67,
      }),
      warmGlass: new THREE.MeshPhysicalMaterial({
        color: 0xe2a95c,
        emissive: 0x9b5318,
        emissiveIntensity: 0.68,
        roughness: 0.28,
        metalness: 0.02,
        transparent: true,
        opacity: 0.82,
      }),
      steel: new THREE.MeshStandardMaterial({ color: 0x747878, roughness: 0.34, metalness: 0.72 }),
      steelDark: new THREE.MeshStandardMaterial({ color: 0x464949, roughness: 0.4, metalness: 0.64 }),
      skin: new THREE.MeshStandardMaterial({ color: 0xb9785d, roughness: 0.76 }),
      skinLight: new THREE.MeshStandardMaterial({ color: 0xd18c6f, roughness: 0.78 }),
      hair: new THREE.MeshStandardMaterial({ color: 0x2a201c, roughness: 0.9 }),
      white: new THREE.MeshStandardMaterial({ color: 0xf7f1e5, roughness: 0.85 }),
      denim: new THREE.MeshStandardMaterial({ color: 0x263846, roughness: 0.84 }),
      rubber: new THREE.MeshStandardMaterial({ color: 0x222526, roughness: 0.9 }),
      lens: new THREE.MeshPhysicalMaterial({
        color: 0xdde6e8,
        roughness: 0.08,
        transmission: 0.14,
        transparent: true,
        opacity: 0.42,
      }),
      leaf: new THREE.MeshStandardMaterial({ color: 0x4c6240, roughness: 0.9 }),
      leafDark: new THREE.MeshStandardMaterial({ color: 0x304830, roughness: 0.92 }),
      grid: new THREE.LineBasicMaterial({ color: 0x75583c, transparent: true, opacity: 0.07 }),
    };

    const hemi = new THREE.HemisphereLight(0xfff6e7, 0x645044, 1.28);
    scene.add(hemi);

    const key = new THREE.DirectionalLight(0xffedca, 2.5);
    key.position.set(-15, 25, 18);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.left = -22;
    key.shadow.camera.right = 22;
    key.shadow.camera.top = 20;
    key.shadow.camera.bottom = -20;
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 75;
    key.shadow.bias = -0.00018;
    key.shadow.normalBias = 0.02;
    key.shadow.radius = 2.2;
    key.target.position.set(0, 0, 0);
    scene.add(key, key.target);

    const fill = new THREE.DirectionalLight(0xdce8e7, 0.58);
    fill.position.set(18, 10, -14);
    scene.add(fill);

    const rim = new THREE.DirectionalLight(0xf3c867, 0.82);
    rim.position.set(14, 17, -18);
    scene.add(rim);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 1.2, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.075;
    controls.enablePan = false;
    controls.minDistance = 6;
    controls.maxDistance = 45;
    controls.minPolarAngle = 0.34;
    controls.maxPolarAngle = Math.PI * 0.49;
    controls.enabled = false;

    const base = new THREE.Mesh(new THREE.BoxGeometry(31, 0.65, 20), materials.ground);
    base.position.y = -0.42;
    base.receiveShadow = true;
    scene.add(base);

    const gridPositions: number[] = [];
    for (let x = -14; x <= 14; x += 2) {
      gridPositions.push(x, -0.08, -9, x, -0.08, 9);
    }
    for (let z = -9; z <= 9; z += 2) {
      gridPositions.push(-14, -0.08, z, 14, -0.08, z);
    }
    const gridGeometry = new THREE.BufferGeometry();
    gridGeometry.setAttribute("position", new THREE.Float32BufferAttribute(gridPositions, 3));
    scene.add(new THREE.LineSegments(gridGeometry, materials.grid));

    const assembled: Array<{ object: THREE.Object3D; finalY: number; delay: number; travel: number }> = [];
    const addAssembly = (object: THREE.Object3D, delay: number, travel = 3.4) => {
      assembled.push({ object, finalY: object.position.y, delay, travel });
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
      canvas.width = 768;
      canvas.height = 196;
      const ctx = canvas.getContext("2d");
      if (!ctx) return new THREE.Sprite();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(23,25,26,.94)";
      ctx.fillRect(8, 8, 752, 180);
      ctx.fillStyle = accent;
      ctx.fillRect(8, 8, 12, 180);
      ctx.fillStyle = "#f0e5cf";
      ctx.font = "700 48px Arial";
      ctx.fillText(title, 50, 82);
      ctx.fillStyle = "rgba(240,229,207,.72)";
      ctx.font = "600 25px Arial";
      ctx.fillText(subtitle, 50, 132);
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearFilter;
      const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false }),
      );
      sprite.scale.set(6.2, 1.58, 1);
      sprite.renderOrder = 20;
      return sprite;
    };

    const makeRibbon = (
      curve: THREE.CatmullRomCurve3,
      width: number,
      material: THREE.Material,
      y: number,
      segments = 100,
    ) => {
      const positions: number[] = [];
      const indices: number[] = [];
      const half = width / 2;
      for (let index = 0; index <= segments; index += 1) {
        const t = index / segments;
        const point = curve.getPointAt(t);
        const tangent = curve.getTangentAt(Math.min(0.9999, t)).normalize();
        const side = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
        const left = point.clone().addScaledVector(side, half);
        const right = point.clone().addScaledVector(side, -half);
        positions.push(left.x, y, left.z, right.x, y, right.z);
        if (index < segments) {
          const a = index * 2;
          const b = a + 1;
          const c = a + 2;
          const d = a + 3;
          indices.push(a, c, b, c, d, b);
        }
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
      geometry.setIndex(indices);
      geometry.computeVertexNormals();
      const ribbon = new THREE.Mesh(geometry, material);
      ribbon.receiveShadow = true;
      return ribbon;
    };

    const routePoints = [
      new THREE.Vector3(-9.6, 0, 3.25),
      new THREE.Vector3(-7.2, 0, 1.7),
      new THREE.Vector3(-3.4, 0, 1.9),
      new THREE.Vector3(0.2, 0, 0.8),
      new THREE.Vector3(3.7, 0, -1.5),
      new THREE.Vector3(6.2, 0, -2.45),
      new THREE.Vector3(8.6, 0, -3.05),
    ];
    const routeCurve = new THREE.CatmullRomCurve3(routePoints, false, "catmullrom", 0.32);

    const road = makeRibbon(routeCurve, 5.6, materials.road, -0.055, 120);
    const pavement = makeRibbon(routeCurve, 2.55, materials.pavement, 0.015, 120);
    const pathBase = makeRibbon(routeCurve, 0.42, materials.routeBase, 0.05, 120);
    const pathLine = makeRibbon(routeCurve, 0.12, materials.route, 0.068, 120);
    scene.add(road, pavement, pathBase, pathLine);

    for (let index = 1; index < 15; index += 1) {
      const point = routeCurve.getPointAt(index / 15);
      const dot = mesh(new THREE.SphereGeometry(0.095, 14, 10), materials.yellow, [point.x, 0.2, point.z], false);
      scene.add(dot);
    }

    const makeStation = () => {
      const group = new THREE.Group();
      group.position.set(-10.3, 0, 4.45);

      const platform = mesh(new THREE.BoxGeometry(7.2, 0.35, 5.1), materials.cream, [0, 0.12, 0]);
      const hall = mesh(new THREE.BoxGeometry(5.5, 2.45, 3.5), materials.charcoal, [0, 1.48, 0]);
      const roof = mesh(new THREE.BoxGeometry(6.4, 0.3, 4.3), materials.steelDark, [0, 2.94, 0]);
      group.add(platform, hall, roof);

      for (const x of [-2.0, -0.66, 0.66, 2.0]) {
        const windowPanel = mesh(new THREE.BoxGeometry(0.9, 1.15, 0.08), materials.glass, [x, 1.5, 1.78], false);
        group.add(windowPanel);
      }

      for (const x of [-2.55, -0.85, 0.85, 2.55]) {
        const column = mesh(new THREE.CylinderGeometry(0.08, 0.1, 2.7, 12), materials.steel, [x, 1.55, 2.2]);
        group.add(column);
      }

      const canopy = mesh(new THREE.BoxGeometry(6.2, 0.16, 1.65), materials.yellow, [0, 2.86, 2.25]);
      group.add(canopy);

      const clock = mesh(new THREE.CylinderGeometry(0.43, 0.43, 0.1, 32), materials.white, [2.18, 2.28, 1.83], false);
      clock.rotation.x = Math.PI / 2;
      group.add(clock);

      const sign = makeLabel("MAJESTIC", "STATION · DEPARTURE", "#E6B92C");
      sign.position.set(0, 4.68, 0);
      group.add(sign);
      return group;
    };

    const makeBrewery = () => {
      const group = new THREE.Group();
      group.position.set(9.0, 0, -3.9);

      const terrace = mesh(new THREE.BoxGeometry(7.3, 0.4, 5.3), materials.brown, [0, 0.14, 0]);
      const lower = mesh(new THREE.BoxGeometry(6.15, 1.35, 4.15), materials.charcoal, [0, 1.02, 0]);
      const upper = mesh(new THREE.BoxGeometry(5.75, 1.45, 3.72), materials.timber, [0, 2.42, 0]);
      const roof = mesh(new THREE.BoxGeometry(6.65, 0.4, 4.62), materials.yellow, [0, 3.48, 0]);
      group.add(terrace, lower, upper, roof);

      for (const x of [-2.15, -1.08, 0, 1.08, 2.15]) {
        const glass = mesh(new THREE.BoxGeometry(0.76, 1.0, 0.08), materials.warmGlass, [x, 2.39, 1.9], false);
        group.add(glass);
      }

      for (const x of [-2.25, -1.35, 1.35, 2.25]) {
        const fin = mesh(new THREE.BoxGeometry(0.13, 1.55, 0.2), materials.timberLight, [x, 2.38, 2.02]);
        group.add(fin);
      }

      const entranceFrame = mesh(new THREE.BoxGeometry(1.45, 2.2, 0.14), materials.yellow, [0, 1.26, 2.13], false);
      const entrance = mesh(new THREE.BoxGeometry(1.05, 1.78, 0.16), materials.warmGlass, [0, 1.17, 2.2], false);
      group.add(entranceFrame, entrance);

      for (const x of [-1.18, 1.18]) {
        const tank = mesh(new THREE.CylinderGeometry(0.66, 0.66, 2.2, 30), materials.steel, [x, 1.35, -2.7]);
        const dome = mesh(new THREE.SphereGeometry(0.66, 24, 14, 0, Math.PI * 2, 0, Math.PI / 2), materials.steel, [x, 2.45, -2.7]);
        group.add(tank, dome);
      }

      const chimney = mesh(new THREE.CylinderGeometry(0.2, 0.24, 2.35, 14), materials.steelDark, [2.25, 4.3, -1.15]);
      const chimneyCap = mesh(new THREE.CylinderGeometry(0.34, 0.28, 0.18, 14), materials.charcoal, [2.25, 5.47, -1.15]);
      group.add(chimney, chimneyCap);

      const sign = makeLabel("V6 BREVVSKI", "THE EXCHANGE · ARRIVAL", "#A65F2C");
      sign.position.set(0, 5.4, 0);
      group.add(sign);
      return group;
    };

    const station = makeStation();
    const brewery = makeBrewery();
    addAssembly(station, 0.03, 4.0);
    addAssembly(brewery, 0.28, 4.7);

    const cityBlocks: Array<[number, number, number, number, number, number, "cream" | "brown"]> = [
      [-5.4, 0.85, -6.1, 3.6, 1.7, 2.3, "brown"],
      [-1.5, 0.64, -6.5, 2.7, 1.28, 1.8, "cream"],
      [2.2, 0.92, 5.9, 3.5, 1.84, 2.15, "brown"],
      [6.0, 0.68, 5.7, 2.5, 1.36, 1.85, "cream"],
      [-4.6, 0.57, 6.55, 2.2, 1.14, 1.55, "cream"],
      [0.4, 0.5, 6.65, 1.9, 1.0, 1.25, "brown"],
    ];
    cityBlocks.forEach(([x, y, z, w, h, d, tone], index) => {
      const baseMaterial = tone === "cream" ? materials.cream : materials.brown;
      const cloned = baseMaterial.clone();
      cloned.transparent = true;
      cloned.opacity = 0.46;
      const block = mesh(new THREE.BoxGeometry(w, h, d), cloned, [x, y, z]);
      addAssembly(block, 0.08 + index * 0.04, 3.0 + index * 0.16);
    });

    const startMarker = mesh(new THREE.CylinderGeometry(0.52, 0.52, 0.11, 32), materials.coral, [-9.6, 0.15, 3.25]);
    const endMarker = mesh(new THREE.CylinderGeometry(0.68, 0.68, 0.12, 32), materials.yellow, [8.6, 0.16, -3.05]);
    scene.add(startMarker, endMarker);

    const crossingPoint = routeCurve.getPointAt(0.11);
    const crossingTangent = routeCurve.getTangentAt(0.11).normalize();
    const crossingSide = new THREE.Vector3(-crossingTangent.z, 0, crossingTangent.x).normalize();
    for (let index = -3; index <= 3; index += 1) {
      const stripePosition = crossingPoint
        .clone()
        .addScaledVector(crossingTangent, index * 0.38);
      const stripe = mesh(new THREE.BoxGeometry(0.24, 0.04, 2.45), materials.white, [stripePosition.x, 0.045, stripePosition.z], false);
      stripe.rotation.y = Math.atan2(crossingSide.x, crossingSide.z);
      scene.add(stripe);
    }

    const lampPositions: Array<[number, number]> = [
      [-7.1, 4.7],
      [-5.5, -0.1],
      [-2.0, 2.9],
      [1.5, -0.4],
      [4.5, 0.5],
      [6.5, -4.8],
    ];
    lampPositions.forEach(([x, z], index) => {
      const pole = mesh(new THREE.CylinderGeometry(0.045, 0.065, 2.55, 10), materials.charcoal, [x, 1.27, z]);
      const arm = mesh(new THREE.BoxGeometry(0.5, 0.05, 0.05), materials.charcoal, [x + 0.22, 2.46, z], false);
      const lamp = mesh(new THREE.SphereGeometry(0.15, 14, 10), materials.yellow, [x + 0.46, 2.42, z], false);
      scene.add(pole, arm, lamp);
      if (index % 2 === 0) {
        const glow = new THREE.PointLight(0xe6b92c, 0.22, 5.5, 2);
        glow.position.set(x + 0.46, 2.35, z);
        scene.add(glow);
      }
    });

    const treePositions: Array<[number, number, number]> = [
      [-6.0, -5.7, 0.95],
      [-2.6, -4.7, 0.8],
      [2.8, 5.0, 0.95],
      [5.3, 4.2, 0.85],
      [6.9, 1.9, 0.72],
    ];
    treePositions.forEach(([x, z, scale], index) => {
      const tree = new THREE.Group();
      tree.position.set(x, 0, z);
      tree.scale.setScalar(scale);
      const trunk = mesh(new THREE.CylinderGeometry(0.13, 0.18, 1.7, 10), materials.timber, [0, 0.85, 0]);
      const crown1 = mesh(new THREE.IcosahedronGeometry(0.78, 1), index % 2 ? materials.leaf : materials.leafDark, [0, 1.9, 0]);
      const crown2 = mesh(new THREE.IcosahedronGeometry(0.56, 1), materials.leaf, [0.48, 1.86, 0.12]);
      const crown3 = mesh(new THREE.IcosahedronGeometry(0.52, 1), materials.leafDark, [-0.42, 1.72, -0.18]);
      tree.add(trunk, crown1, crown2, crown3);
      scene.add(tree);
    });

    const bus = new THREE.Group();
    bus.position.set(-6.9, 0.12, 6.4);
    const busBody = mesh(new THREE.BoxGeometry(3.25, 1.4, 1.25), materials.coral, [0, 1.0, 0]);
    const busGlass = mesh(new THREE.BoxGeometry(2.65, 0.52, 0.07), materials.glass, [0, 1.25, 0.66], false);
    const busRoof = mesh(new THREE.BoxGeometry(3.0, 0.15, 1.08), materials.cream, [0, 1.8, 0]);
    const wheelA = mesh(new THREE.CylinderGeometry(0.29, 0.29, 0.22, 20), materials.rubber, [-1.05, 0.42, 0.62]);
    const wheelB = mesh(new THREE.CylinderGeometry(0.29, 0.29, 0.22, 20), materials.rubber, [1.05, 0.42, 0.62]);
    wheelA.rotation.x = Math.PI / 2;
    wheelB.rotation.x = Math.PI / 2;
    bus.add(busBody, busGlass, busRoof, wheelA, wheelB);
    scene.add(bus);

    const signPost = new THREE.Group();
    signPost.position.set(2.8, 0, -3.55);
    const signPole = mesh(new THREE.CylinderGeometry(0.045, 0.055, 2.2, 10), materials.charcoal, [0, 1.1, 0]);
    const signPlate = mesh(new THREE.BoxGeometry(1.55, 0.58, 0.08), materials.green, [0, 2.05, 0]);
    signPost.add(signPole, signPlate);
    const routeLabel = makeLabel("V6", "THIS WAY", "#E6B92C");
    routeLabel.position.set(0, 2.62, 0);
    routeLabel.scale.set(2.35, 0.6, 1);
    signPost.add(routeLabel);
    scene.add(signPost);

    const benchPositions: Array<[number, number, number]> = [
      [-3.8, -1.2, 0.15],
      [4.6, -4.2, -0.4],
    ];
    benchPositions.forEach(([x, z, rotation]) => {
      const bench = new THREE.Group();
      bench.position.set(x, 0, z);
      bench.rotation.y = rotation;
      const seat = mesh(new THREE.BoxGeometry(1.8, 0.14, 0.48), materials.timber, [0, 0.55, 0]);
      const back = mesh(new THREE.BoxGeometry(1.8, 0.14, 0.72), materials.timberLight, [0, 0.95, -0.24]);
      back.rotation.x = -0.18;
      const legA = mesh(new THREE.BoxGeometry(0.1, 0.5, 0.1), materials.steelDark, [-0.65, 0.27, 0]);
      const legB = mesh(new THREE.BoxGeometry(0.1, 0.5, 0.1), materials.steelDark, [0.65, 0.27, 0]);
      bench.add(seat, back, legA, legB);
      scene.add(bench);
    });

    // Character: a more human-proportioned stylised traveller with articulated limbs.
    const boy = new THREE.Group();
    const character = new THREE.Group();
    boy.add(character);

    const pelvis = mesh(new THREE.CapsuleGeometry(0.42, 0.45, 6, 14), materials.denim, [0, 1.82, 0]);
    pelvis.scale.set(1.08, 0.88, 0.78);
    character.add(pelvis);

    const torso = mesh(new THREE.CapsuleGeometry(0.62, 1.18, 7, 18), materials.green, [0, 2.86, 0]);
    torso.scale.set(1.0, 1.0, 0.72);
    character.add(torso);

    const jacketPanel = mesh(new THREE.BoxGeometry(0.92, 0.44, 0.06), materials.yellow, [0, 2.9, 0.55], false);
    jacketPanel.rotation.x = -0.02;
    character.add(jacketPanel);

    const backpack = mesh(new THREE.CapsuleGeometry(0.47, 0.65, 6, 14), materials.brown, [0, 2.78, -0.56]);
    backpack.scale.set(1.0, 1.0, 0.55);
    character.add(backpack);

    const neck = mesh(new THREE.CylinderGeometry(0.23, 0.27, 0.42, 18), materials.skin, [0, 3.79, 0]);
    character.add(neck);

    const head = mesh(new THREE.SphereGeometry(0.7, 30, 22), materials.skinLight, [0, 4.36, 0], true, false);
    head.scale.set(0.88, 1.0, 0.84);
    character.add(head);

    const earLeft = mesh(new THREE.SphereGeometry(0.14, 16, 12), materials.skin, [-0.61, 4.35, 0], true, false);
    const earRight = mesh(new THREE.SphereGeometry(0.14, 16, 12), materials.skin, [0.61, 4.35, 0], true, false);
    character.add(earLeft, earRight);

    const hairCap = mesh(new THREE.SphereGeometry(0.69, 26, 18, 0, Math.PI * 2, 0, Math.PI * 0.62), materials.hair, [0, 4.54, -0.08]);
    hairCap.scale.set(0.92, 0.9, 0.88);
    character.add(hairCap);

    const fringeLeft = mesh(new THREE.CapsuleGeometry(0.09, 0.36, 4, 8), materials.hair, [-0.28, 4.71, 0.5], false);
    fringeLeft.rotation.z = 0.72;
    fringeLeft.rotation.x = 0.22;
    const fringeRight = mesh(new THREE.CapsuleGeometry(0.09, 0.36, 4, 8), materials.hair, [0.25, 4.72, 0.5], false);
    fringeRight.rotation.z = -0.64;
    fringeRight.rotation.x = 0.18;
    character.add(fringeLeft, fringeRight);

    const beanie = mesh(new THREE.CylinderGeometry(0.69, 0.74, 0.6, 32), materials.yellow, [0, 4.95, -0.02]);
    beanie.scale.set(1.0, 1.0, 0.93);
    character.add(beanie);
    const beanieBand = mesh(new THREE.CylinderGeometry(0.745, 0.745, 0.18, 32), materials.green, [0, 4.76, 0.02]);
    beanieBand.scale.z = 0.93;
    character.add(beanieBand);
    const pom = mesh(new THREE.SphereGeometry(0.27, 20, 16), materials.steel, [0, 5.35, -0.03]);
    character.add(pom);

    const lensGeometry = new THREE.TorusGeometry(0.31, 0.045, 10, 30);
    const leftFrame = mesh(lensGeometry, materials.charcoal, [-0.34, 4.39, 0.57], false);
    const rightFrame = mesh(lensGeometry, materials.charcoal, [0.34, 4.39, 0.57], false);
    const bridge = mesh(new THREE.BoxGeometry(0.15, 0.04, 0.045), materials.charcoal, [0, 4.39, 0.58], false);
    character.add(leftFrame, rightFrame, bridge);

    const leftGlass = mesh(new THREE.CircleGeometry(0.275, 28), materials.lens, [-0.34, 4.39, 0.555], false, false);
    const rightGlass = mesh(new THREE.CircleGeometry(0.275, 28), materials.lens, [0.34, 4.39, 0.555], false, false);
    character.add(leftGlass, rightGlass);

    const leftEyeWhite = mesh(new THREE.SphereGeometry(0.11, 18, 12), materials.white, [-0.34, 4.39, 0.615], false);
    const rightEyeWhite = mesh(new THREE.SphereGeometry(0.11, 18, 12), materials.white, [0.34, 4.39, 0.615], false);
    const leftEye = mesh(new THREE.SphereGeometry(0.052, 14, 10), materials.hair, [-0.34, 4.39, 0.71], false);
    const rightEye = mesh(new THREE.SphereGeometry(0.052, 14, 10), materials.hair, [0.34, 4.39, 0.71], false);
    character.add(leftEyeWhite, rightEyeWhite, leftEye, rightEye);

    const nose = mesh(new THREE.SphereGeometry(0.085, 14, 10), materials.skin, [0, 4.19, 0.68], false);
    nose.scale.set(0.9, 0.82, 1.18);
    character.add(nose);

    const smile = mesh(new THREE.TorusGeometry(0.16, 0.026, 8, 20, Math.PI), materials.hair, [0, 4.02, 0.64], false);
    smile.rotation.z = Math.PI;
    character.add(smile);

    const shoulderLeft = new THREE.Group();
    shoulderLeft.position.set(-0.7, 3.35, 0);
    const upperArmLeft = mesh(new THREE.CapsuleGeometry(0.17, 0.65, 5, 10), materials.green, [0, -0.42, 0]);
    const elbowLeft = new THREE.Group();
    elbowLeft.position.set(0, -0.84, 0);
    const forearmLeft = mesh(new THREE.CapsuleGeometry(0.145, 0.55, 5, 10), materials.skin, [0, -0.34, 0]);
    const handLeft = mesh(new THREE.SphereGeometry(0.16, 14, 10), materials.skinLight, [0, -0.69, 0]);
    elbowLeft.add(forearmLeft, handLeft);
    shoulderLeft.add(upperArmLeft, elbowLeft);
    character.add(shoulderLeft);

    const shoulderRight = new THREE.Group();
    shoulderRight.position.set(0.7, 3.35, 0);
    const upperArmRight = mesh(new THREE.CapsuleGeometry(0.17, 0.65, 5, 10), materials.green, [0, -0.42, 0]);
    const elbowRight = new THREE.Group();
    elbowRight.position.set(0, -0.84, 0);
    const forearmRight = mesh(new THREE.CapsuleGeometry(0.145, 0.55, 5, 10), materials.skin, [0, -0.34, 0]);
    const handRight = mesh(new THREE.SphereGeometry(0.16, 14, 10), materials.skinLight, [0, -0.69, 0]);
    elbowRight.add(forearmRight, handRight);
    shoulderRight.add(upperArmRight, elbowRight);
    character.add(shoulderRight);

    const hipLeft = new THREE.Group();
    hipLeft.position.set(-0.3, 1.65, 0);
    const thighLeft = mesh(new THREE.CapsuleGeometry(0.2, 0.74, 5, 10), materials.denim, [0, -0.48, 0]);
    const kneeLeft = new THREE.Group();
    kneeLeft.position.set(0, -0.94, 0);
    const shinLeft = mesh(new THREE.CapsuleGeometry(0.18, 0.66, 5, 10), materials.charcoal, [0, -0.43, 0]);
    const shoeLeft = mesh(new THREE.BoxGeometry(0.45, 0.22, 0.7), materials.white, [0, -0.84, 0.15]);
    shoeLeft.rotation.x = 0.02;
    kneeLeft.add(shinLeft, shoeLeft);
    hipLeft.add(thighLeft, kneeLeft);
    character.add(hipLeft);

    const hipRight = new THREE.Group();
    hipRight.position.set(0.3, 1.65, 0);
    const thighRight = mesh(new THREE.CapsuleGeometry(0.2, 0.74, 5, 10), materials.denim, [0, -0.48, 0]);
    const kneeRight = new THREE.Group();
    kneeRight.position.set(0, -0.94, 0);
    const shinRight = mesh(new THREE.CapsuleGeometry(0.18, 0.66, 5, 10), materials.charcoal, [0, -0.43, 0]);
    const shoeRight = mesh(new THREE.BoxGeometry(0.45, 0.22, 0.7), materials.white, [0, -0.84, 0.15]);
    shoeRight.rotation.x = 0.02;
    kneeRight.add(shinRight, shoeRight);
    hipRight.add(thighRight, kneeRight);
    character.add(hipRight);

    character.scale.setScalar(0.62);
    scene.add(boy);

    const arrivalGlow = new THREE.PointLight(0xe6b92c, 0, 12, 2);
    arrivalGlow.position.set(8.7, 3.0, -2.8);
    scene.add(arrivalGlow);

    const arrivalPool = new THREE.Mesh(
      new THREE.CircleGeometry(2.2, 48),
      new THREE.MeshBasicMaterial({
        color: 0xe6b92c,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    arrivalPool.rotation.x = -Math.PI / 2;
    arrivalPool.position.set(8.65, 0.08, -3.0);
    scene.add(arrivalPool);

    const resize = () => {
      const width = Math.max(1, mount.clientWidth);
      const height = Math.max(1, mount.clientHeight);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    resize();

    const interruptCinematic = () => {
      if (!cinematicRef.current) return;
      cinematicRef.current = false;
      setCinematic(false);
      controls.enabled = true;
      controls.target.copy(boy.position).add(new THREE.Vector3(0, 1.5, 0));
    };
    renderer.domElement.addEventListener("pointerdown", interruptCinematic, { passive: true });
    renderer.domElement.addEventListener("wheel", interruptCinematic, { passive: true });

    const sceneStartedAt = performance.now();
    restartAtRef.current = sceneStartedAt;
    let raf = 0;
    let lastNow = sceneStartedAt;

    const easeOutCubic = (value: number) => 1 - Math.pow(1 - value, 3);
    const smoothstep = (value: number) => value * value * (3 - 2 * value);

    const getCameraShot = (
      progress: number,
      point: THREE.Vector3,
      tangent: THREE.Vector3,
    ): { name: CameraShotName; position: THREE.Vector3; target: THREE.Vector3; fov: number } => {
      const side = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();

      if (progress < 0.14) {
        return {
          name: "Majestic departure",
          position: new THREE.Vector3(-15.5, 9.4, 18.5),
          target: new THREE.Vector3(-8.4, 1.9, 3.1),
          fov: 40,
        };
      }

      if (progress < 0.34) {
        const position = point
          .clone()
          .addScaledVector(tangent, -4.2)
          .addScaledVector(side, 1.5)
          .add(new THREE.Vector3(0, 2.7, 0));
        const target = point.clone().addScaledVector(tangent, 1.6).add(new THREE.Vector3(0, 1.35, 0));
        return { name: "Follow cam", position, target, fov: 33 };
      }

      if (progress < 0.52) {
        const position = point
          .clone()
          .addScaledVector(side, 5.2)
          .addScaledVector(tangent, -0.7)
          .add(new THREE.Vector3(0, 2.45, 0));
        const target = point.clone().add(new THREE.Vector3(0, 1.45, 0));
        return { name: "Street tracking", position, target, fov: 31 };
      }

      if (progress < 0.68) {
        const position = point
          .clone()
          .addScaledVector(side, 2.0)
          .add(new THREE.Vector3(0, 12.8, 6.6));
        const target = point.clone().addScaledVector(tangent, 1.7).add(new THREE.Vector3(0, 0.5, 0));
        return { name: "Route overview", position, target, fov: 38 };
      }

      if (progress < 0.88) {
        const position = point
          .clone()
          .addScaledVector(tangent, -3.15)
          .addScaledVector(side, -1.0)
          .add(new THREE.Vector3(0, 2.35, 0));
        const target = point.clone().addScaledVector(tangent, 2.7).add(new THREE.Vector3(0, 1.3, 0));
        return { name: "Over the shoulder", position, target, fov: 29 };
      }

      const arrivalBlend = THREE.MathUtils.clamp((progress - 0.88) / 0.12, 0, 1);
      const orbitAngle = arrivalBlend * 0.48;
      const target = new THREE.Vector3(8.5, 1.75, -3.35);
      const position = new THREE.Vector3(
        14.2 + Math.sin(orbitAngle) * 2.2,
        5.4 + arrivalBlend * 1.1,
        7.6 - Math.cos(orbitAngle) * 2.5,
      );
      return { name: "V6 arrival", position, target, fov: 31 };
    };

    const render = (now: number) => {
      const dt = Math.min((now - lastNow) / 1000, 0.1);
      lastNow = now;
      const sceneSeconds = (now - sceneStartedAt) / 1000;
      const walkSeconds = Math.max(0, (now - restartAtRef.current) / 1000);

      assembled.forEach(({ object, finalY, delay, travel }) => {
        const local = THREE.MathUtils.clamp((sceneSeconds - delay) / 1.15, 0, 1);
        const lift = reducedMotion ? 1 : easeOutCubic(local);
        object.position.y = finalY + (1 - lift) * travel;
      });

      const rawProgress = reducedMotion ? 1 : THREE.MathUtils.clamp(walkSeconds / 11.4, 0, 1);
      const walkProgress = smoothstep(rawProgress);
      const point = routeCurve.getPointAt(walkProgress);
      const tangent = routeCurve.getTangentAt(Math.min(0.999, walkProgress + 0.002)).normalize();
      boy.position.set(point.x, 0.13, point.z);
      boy.rotation.y = Math.atan2(tangent.x, tangent.z);

      const isWalking = rawProgress < 0.992 && !reducedMotion;
      const cycle = walkSeconds * 7.2;
      const stride = isWalking ? Math.sin(cycle) : 0;
      const opposite = isWalking ? Math.sin(cycle + Math.PI) : 0;

      shoulderLeft.rotation.x = stride * 0.56;
      shoulderRight.rotation.x = opposite * 0.56;
      elbowLeft.rotation.x = -0.2 - Math.max(0, -stride) * 0.26;
      elbowRight.rotation.x = -0.2 - Math.max(0, -opposite) * 0.26;

      hipLeft.rotation.x = opposite * 0.6;
      hipRight.rotation.x = stride * 0.6;
      kneeLeft.rotation.x = Math.max(0, stride) * 0.72;
      kneeRight.rotation.x = Math.max(0, opposite) * 0.72;

      character.position.y = isWalking ? Math.abs(Math.sin(cycle)) * 0.045 : 0;
      character.rotation.z = isWalking ? Math.sin(cycle * 0.5) * 0.018 : 0;
      character.rotation.x = isWalking ? -0.035 : 0;

      if (rawProgress >= 0.93) {
        const arrivalAmount = THREE.MathUtils.clamp((rawProgress - 0.93) / 0.07, 0, 1);
        arrivalGlow.intensity = 0.3 + arrivalAmount * 2.4 + Math.sin(walkSeconds * 3.4) * 0.18;
        (arrivalPool.material as THREE.MeshBasicMaterial).opacity = 0.05 + arrivalAmount * 0.15;
        materials.yellow.emissiveIntensity = 0.12 + arrivalAmount * 0.16;
      } else {
        arrivalGlow.intensity = 0;
        (arrivalPool.material as THREE.MeshBasicMaterial).opacity = 0;
        materials.yellow.emissiveIntensity = 0.1;
      }

      if (cinematicRef.current) {
        controls.enabled = false;
        const shot = getCameraShot(rawProgress, point, tangent);
        if (currentShotRef.current !== shot.name) {
          currentShotRef.current = shot.name;
          setShotLabel(shot.name);
        }
        const blend = reducedMotion ? 1 : 1 - Math.exp(-dt * 2.45);
        camera.position.lerp(shot.position, blend);
        controls.target.lerp(shot.target, blend);
        camera.fov += (shot.fov - camera.fov) * Math.min(1, blend * 1.4);
        camera.updateProjectionMatrix();
        camera.lookAt(controls.target);
      } else {
        controls.enabled = true;
        controls.update();
      }

      if (!document.hidden) renderer.render(scene, camera);
      raf = requestAnimationFrame(render);
    };

    renderer.compile(scene, camera);
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener("pointerdown", interruptCinematic);
      renderer.domElement.removeEventListener("wheel", interruptCinematic);
      controls.dispose();

      const geometries = new Set<THREE.BufferGeometry>();
      const disposableMaterials = new Set<THREE.Material>();
      const textures = new Set<THREE.Texture>();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          geometries.add(object.geometry);
          const objectMaterials = Array.isArray(object.material) ? object.material : [object.material];
          objectMaterials.forEach((material) => {
            disposableMaterials.add(material);
            const mapped = material as THREE.Material & { map?: THREE.Texture | null };
            if (mapped.map) textures.add(mapped.map);
          });
        }
        if (object instanceof THREE.Sprite) {
          disposableMaterials.add(object.material);
          const spriteMaterial = object.material as THREE.SpriteMaterial;
          if (spriteMaterial.map) textures.add(spriteMaterial.map);
        }
      });

      geometries.forEach((geometry) => geometry.dispose());
      textures.forEach((texture) => texture.dispose());
      disposableMaterials.forEach((material) => material.dispose());
      environment.dispose();
      key.shadow.map?.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  const replay = () => {
    restartAtRef.current = performance.now();
    cinematicRef.current = true;
    currentShotRef.current = "Majestic departure";
    setShotLabel("Majestic departure");
    setCinematic(true);
  };

  const toggleCameraMode = () => {
    const next = !cinematicRef.current;
    cinematicRef.current = next;
    setCinematic(next);
  };

  return (
    <div className="journey-3d" role="group" aria-label="Interactive 3D walk from Majestic station to V6 Brevvski">
      <div ref={mountRef} className="journey-3d__mount" />

      <div className="journey-3d__chrome">
        <div>
          <span className="journey-3d__eyebrow">3D route / Majestic</span>
          <strong>Walk this way</strong>
        </div>
        <div className="journey-3d__controls">
          <button type="button" onClick={toggleCameraMode}>
            {cinematic ? "Free explore" : "Cinematic view"}
          </button>
          <button type="button" onClick={replay}>Replay journey</button>
        </div>
      </div>

      <div className="journey-3d__shot" aria-live="polite">
        <span>Camera</span>
        <strong>{cinematic ? shotLabel : "Free explore"}</strong>
      </div>

      <div className="journey-3d__hint">
        <span>{cinematic ? "Cinematic camera active" : "Drag to orbit"}</span>
        <span>{cinematic ? "Tap scene to explore" : "Scroll to zoom"}</span>
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
