import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Engine } from "@babylonjs/core/Engines/engine";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { PointLight } from "@babylonjs/core/Lights/pointLight";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Color3, Color4 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import { CreateCapsule } from "@babylonjs/core/Meshes/Builders/capsuleBuilder";
import { Scene } from "@babylonjs/core/scene";
import "@babylonjs/core/Meshes/Builders/boxBuilder";
import "@babylonjs/core/Meshes/Builders/cylinderBuilder";
import "@babylonjs/core/Meshes/Builders/sphereBuilder";
import "./style.css";

type GameState = "ready" | "running" | "gameover" | "paused";
type RunnerItem = {
  proxy: Mesh;
  visual: Mesh;
  lane: number;
  z: number;
  type: "crystal" | "obstacle";
  active: boolean;
  wobbleSeed: number;
};
type RunwayLight = {
  marker: Mesh;
  light: PointLight | null;
  z: number;
  phase: number;
};

const pathSegmentDepth = 4;
const pathSegmentCount = 24;
const pathNearZ = 10;
const pathRecycleZ = pathNearZ + pathSegmentDepth;
const pathLoopLength = pathSegmentCount * pathSegmentDepth;

const canvas = document.querySelector<HTMLCanvasElement>("#game-canvas");
const scoreEl = document.querySelector<HTMLElement>("#score");
const crystalsEl = document.querySelector<HTMLElement>("#crystals");
const bestEl = document.querySelector<HTMLElement>("#best");
const debugEl = document.querySelector<HTMLElement>("#debug");
const overlayEl = document.querySelector<HTMLElement>("#overlay");
const overlayTitle = document.querySelector<HTMLElement>("#overlay-title");
const overlayText = document.querySelector<HTMLElement>("#overlay-text");
const primaryAction = document.querySelector<HTMLButtonElement>("#primary-action");
const laneLeft = document.querySelector<HTMLButtonElement>("#lane-left");
const laneRight = document.querySelector<HTMLButtonElement>("#lane-right");

if (!canvas || !scoreEl || !crystalsEl || !bestEl || !debugEl || !overlayEl || !overlayTitle || !overlayText || !primaryAction || !laneLeft || !laneRight) {
  throw new Error("Crystal Runner UI failed to initialise.");
}

const engine = new Engine(canvas, true, {
  adaptToDeviceRatio: true,
  preserveDrawingBuffer: false,
  stencil: false
});
engine.setHardwareScalingLevel(Math.max(1, window.devicePixelRatio / 1.5));

const scene = new Scene(engine);
scene.clearColor = new Color4(0.02, 0.05, 0.09, 1);

const camera = new ArcRotateCamera("camera", Math.PI / 2, 1.05, 16, new Vector3(0, 1.8, 5), scene);
camera.attachControl(canvas, true);
camera.inputs.clear();

new HemisphericLight("ambient", new Vector3(0, 1, 0), scene).intensity = 0.68;
const keyLight = new DirectionalLight("key", new Vector3(-0.4, -0.9, 0.55), scene);
keyLight.position = new Vector3(5, 9, -8);
keyLight.intensity = 1.1;

const materials = createMaterials(scene);
const world = new TransformNode("world", scene);

const lanePositions = [-2.45, 0, 2.45];
let lane = 1;
let targetLane = 1;
let state: GameState = "ready";
let score = 0;
let crystals = 0;
let best = Number(localStorage.getItem("crystal-runner-best") ?? "0");
let speed = 9;
let spawnTimer = 0;
let nextPattern = 0;
let pulse = 0;
let feedbackTextTimer = 0;
let explosionTimer = 0;

bestEl.textContent = String(best);

const player = MeshBuilder.CreateBox("runner-collision", { width: 1, height: 0.95, depth: 0.95 }, scene);
player.position = new Vector3(0, 0.48, 1.8);
player.isVisible = false;
player.parent = world;

const playerVisual = CreateCapsule("runner-visual", { height: 1.45, radius: 0.35, tessellation: 16, subdivisions: 3 }, scene);
playerVisual.position = new Vector3(0, 0.68, 0);
playerVisual.material = materials.player;
playerVisual.parent = player;

const playerCoreGlow = MeshBuilder.CreateSphere("runner-core-glow", { diameter: 0.72, segments: 16 }, scene);
playerCoreGlow.position = new Vector3(0, 0.65, 0);
playerCoreGlow.material = materials.playerGlow;
playerCoreGlow.parent = playerVisual;

const explosion = MeshBuilder.CreateSphere("collision-explosion", { diameter: 1.4, segments: 16 }, scene);
explosion.position = new Vector3(0, 1.05, 1.8);
explosion.material = materials.explosion;
explosion.setEnabled(false);
explosion.parent = world;

const pathSegments: Mesh[] = [];
for (let i = 0; i < pathSegmentCount; i += 1) {
  const segment = MeshBuilder.CreateBox(`path-${i}`, { width: 7.2, height: 0.18, depth: pathSegmentDepth }, scene);
  segment.position = new Vector3(0, -0.12, pathNearZ - i * pathSegmentDepth);
  segment.material = materials.path;
  segment.parent = world;
  pathSegments.push(segment);
}

const rails: Mesh[] = [];
for (const x of [-3.72, 3.72]) {
  const rail = MeshBuilder.CreateBox(`rail-${x}`, { width: 0.1, height: 0.18, depth: pathLoopLength }, scene);
  rail.position = new Vector3(x, 0.12, pathNearZ - pathLoopLength / 2);
  rail.material = materials.rail;
  rail.parent = world;
  rails.push(rail);
}

const items: RunnerItem[] = [];
const runwayLights = createRunwayLights(scene, world, materials);

function createMaterials(activeScene: Scene) {
  const pathMat = new StandardMaterial("path-mat", activeScene);
  pathMat.diffuseColor = new Color3(0.07, 0.13, 0.22);
  pathMat.emissiveColor = new Color3(0.02, 0.05, 0.1);

  const railMat = new StandardMaterial("rail-mat", activeScene);
  railMat.diffuseColor = new Color3(0.16, 0.34, 0.42);
  railMat.emissiveColor = new Color3(0.04, 0.22, 0.28);

  const playerMat = new StandardMaterial("runner-mesh-mat", activeScene);
  playerMat.diffuseColor = new Color3(0.11, 0.78, 0.88);
  playerMat.emissiveColor = new Color3(0.02, 0.32, 0.42);
  playerMat.specularColor = new Color3(0.35, 0.72, 0.8);

  const playerGlowMat = new StandardMaterial("runner-glow-mat", activeScene);
  playerGlowMat.diffuseColor = new Color3(0.08, 0.95, 1);
  playerGlowMat.emissiveColor = new Color3(0.04, 0.72, 0.95);
  playerGlowMat.specularColor = Color3.Black();

  const crystalMat = new StandardMaterial("crystal-mesh-mat", activeScene);
  crystalMat.diffuseColor = new Color3(0.94, 0.82, 0.24);
  crystalMat.emissiveColor = new Color3(0.62, 0.42, 0.05);
  crystalMat.specularColor = new Color3(0.9, 0.82, 0.45);

  const obstacleMat = new StandardMaterial("obstacle-mesh-mat", activeScene);
  obstacleMat.diffuseColor = new Color3(0.55, 0.08, 0.08);
  obstacleMat.emissiveColor = new Color3(0.18, 0.02, 0.015);
  obstacleMat.specularColor = new Color3(0.32, 0.08, 0.06);

  const runwayLightMat = new StandardMaterial("runway-light-mat", activeScene);
  runwayLightMat.diffuseColor = new Color3(0.2, 0.95, 1);
  runwayLightMat.emissiveColor = new Color3(0.04, 0.72, 0.95);
  runwayLightMat.specularColor = Color3.Black();

  const explosionMat = new StandardMaterial("explosion-mesh-mat", activeScene);
  explosionMat.diffuseColor = new Color3(1, 0.42, 0.08);
  explosionMat.emissiveColor = new Color3(1, 0.18, 0.03);
  explosionMat.specularColor = Color3.Black();

  return {
    path: pathMat,
    rail: railMat,
    player: playerMat,
    playerGlow: playerGlowMat,
    crystal: crystalMat,
    obstacle: obstacleMat,
    runwayLight: runwayLightMat,
    explosion: explosionMat
  };
}

function createRunwayLights(activeScene: Scene, parent: TransformNode, gameMaterials: ReturnType<typeof createMaterials>) {
  const lights: RunwayLight[] = [];
  for (let i = 0; i < pathSegmentCount; i += 1) {
    for (const side of [-1, 1]) {
      const marker = MeshBuilder.CreateSphere(`runway-light-${i}-${side}`, { diameter: 0.22, segments: 8 }, activeScene);
      marker.position = new Vector3(side * 3.48, 0.15, pathNearZ - i * pathSegmentDepth - 1.5);
      marker.material = gameMaterials.runwayLight;
      marker.parent = parent;

      let light: PointLight | null = null;
      if (i % 4 === 0) {
        light = new PointLight(`runway-point-${i}-${side}`, marker.position.clone(), activeScene);
        light.diffuse = new Color3(0.14, 0.86, 1);
        light.specular = new Color3(0.03, 0.18, 0.22);
        light.range = 5.5;
        light.intensity = 0.45;
        light.parent = parent;
      }
      lights.push({ marker, light, z: marker.position.z, phase: i * 0.45 + side * 0.2 });
    }
  }
  return lights;
}

function startRun() {
  state = "running";
  score = 0;
  crystals = 0;
  speed = 9;
  lane = 1;
  targetLane = 1;
  spawnTimer = 0.3;
  nextPattern = 0;
  player.position.x = lanePositions[lane];
  player.position.y = 0.48;
  playerVisual.position.y = 0.68;
  playerVisual.rotation.z = 0;
  playerCoreGlow.scaling.set(1, 1, 1);
  explosionTimer = 0;
  explosion.setEnabled(false);
  items.forEach((item) => {
    item.visual.dispose(false, false);
    item.proxy.dispose(false, false);
  });
  items.length = 0;
  updateHud();
  overlayEl.classList.add("hidden");
  canvas.focus();
  beep(440, 0.04, "sine", 0.04);
}

function endRun(reason: string) {
  state = "gameover";
  triggerExplosion();
  best = Math.max(best, Math.floor(score));
  localStorage.setItem("crystal-runner-best", String(best));
  updateHud();
  overlayTitle.textContent = "Run Over";
  overlayText.textContent = `${reason} Score ${Math.floor(score)}. Crystals ${crystals}. Try again for a cleaner run.`;
  primaryAction.textContent = "Restart";
  window.setTimeout(() => {
    if (state === "gameover") {
      overlayEl.classList.remove("hidden");
    }
  }, 360);
  pulse = 0.5;
  beep(120, 0.18, "sawtooth", 0.05);
}

function updateHud() {
  scoreEl.textContent = String(Math.floor(score));
  crystalsEl.textContent = String(crystals);
  bestEl.textContent = String(best);
}

function moveLane(worldDirection: -1 | 1) {
  if (state !== "running") {
    return;
  }
  targetLane = Math.max(0, Math.min(2, targetLane + worldDirection));
  beep(260 + targetLane * 60, 0.025, "triangle", 0.02);
}

function moveScreenLeft() {
  moveLane(1);
}

function moveScreenRight() {
  moveLane(-1);
}

function spawnItem(type: RunnerItem["type"], itemLane: number, z: number) {
  const proxy = MeshBuilder.CreateBox(`${type}-collision-${items.length}`, {
    width: type === "crystal" ? 1.05 : 1.2,
    height: type === "crystal" ? 1.1 : 0.85,
    depth: type === "crystal" ? 0.8 : 0.9
  }, scene);
  proxy.isVisible = false;
  proxy.parent = world;
  proxy.position = new Vector3(lanePositions[itemLane], type === "crystal" ? 0.58 : 0.46, z);

  const visual = type === "crystal"
    ? MeshBuilder.CreateCylinder(`${type}-visual-${items.length}`, { height: 0.92, diameterTop: 0.18, diameterBottom: 0.64, tessellation: 4 }, scene)
    : MeshBuilder.CreateBox(`${type}-visual-${items.length}`, { width: 1.1, height: 0.8, depth: 0.82 }, scene);
  visual.parent = proxy;
  visual.position = new Vector3(0, type === "crystal" ? 0.1 : 0.04, 0);
  visual.rotation.z = type === "crystal" ? Math.PI / 4 : -0.12 + (nextPattern % 3) * 0.12;
  visual.rotation.y = type === "crystal" ? Math.PI / 4 : 0.15;
  visual.material = type === "crystal" ? materials.crystal : materials.obstacle;

  items.push({ proxy, visual, lane: itemLane, z, type, active: true, wobbleSeed: performance.now() * 0.01 + itemLane });
}

function spawnPattern() {
  const safeLane = nextPattern % 3;
  const obstacleLanes = [0, 1, 2].filter((candidate) => candidate !== safeLane);
  spawnItem("obstacle", obstacleLanes[0], -48);
  if (nextPattern % 2 === 0) {
    spawnItem("obstacle", obstacleLanes[1], -54);
  }
  spawnItem("crystal", safeLane, -50);
  if (nextPattern % 3 === 0) {
    spawnItem("crystal", (safeLane + 1) % 3, -58);
  }
  nextPattern += 1;
}

function updateGame(dt: number) {
  if (state !== "running") {
    return;
  }

  speed = Math.min(18, speed + dt * 0.13);
  score += dt * speed;
  spawnTimer -= dt;
  if (spawnTimer <= 0) {
    spawnPattern();
    spawnTimer = Math.max(0.72, 1.28 - speed * 0.025);
  }

  const targetX = lanePositions[targetLane];
  player.position.x += (targetX - player.position.x) * Math.min(1, dt * 12);
  lane = targetLane;
  const now = performance.now();
  playerVisual.position.y = 0.68 + Math.sin(now * 0.008) * 0.055;
  playerVisual.rotation.z = (targetX - player.position.x) * -0.08 + Math.sin(now * 0.006) * 0.018;
  playerVisual.rotation.y += dt * 1.1;
  const corePulse = 1 + Math.sin(now * 0.014) * 0.08;
  playerCoreGlow.scaling.set(corePulse, corePulse, corePulse);

  for (const segment of pathSegments) {
    segment.position.z += speed * dt;
    if (segment.position.z > pathRecycleZ) {
      segment.position.z -= pathLoopLength;
    }
  }

  for (const item of items) {
    if (!item.active) {
      continue;
    }
    item.z += speed * dt;
    item.proxy.position.z = item.z;
    item.visual.position.y = (item.type === "crystal" ? 0.12 : 0.04) + Math.sin(now * 0.006 + item.wobbleSeed) * 0.08;
    if (item.type === "crystal") {
      const pulseScale = 1 + Math.sin(now * 0.012 + item.wobbleSeed) * 0.12;
      item.visual.scaling.set(pulseScale, pulseScale, pulseScale);
      item.visual.rotation.y += dt * 4.4;
      item.visual.rotation.z += dt * 1.5;
    } else {
      item.visual.rotation.z += Math.sin(now * 0.005 + item.wobbleSeed) * dt * 0.22;
    }

    const dx = Math.abs(item.proxy.position.x - player.position.x);
    const dz = Math.abs(item.proxy.position.z - player.position.z);
    if (dx < 0.9 && dz < 0.88) {
      if (item.type === "crystal") {
        collectCrystal(item);
      } else {
        endRun("You hit an obstacle.");
      }
    }

    if (item.proxy.position.z > 7) {
      item.active = false;
      item.visual.dispose(false, false);
      item.proxy.dispose(false, false);
    }
  }

  for (let i = items.length - 1; i >= 0; i -= 1) {
    if (!items[i].active) {
      items.splice(i, 1);
    }
  }

  updateHud();
}

function collectCrystal(item: RunnerItem) {
  item.active = false;
  item.visual.dispose(false, false);
  item.proxy.dispose(false, false);
  crystals += 1;
  score += 35;
  feedbackTextTimer = 0.35;
  beep(720 + crystals * 12, 0.045, "sine", 0.05);
}

function triggerExplosion() {
  explosionTimer = 0.42;
  explosion.position.x = player.position.x;
  explosion.position.y = 1.05;
  explosion.position.z = player.position.z;
  explosion.scaling.set(0.7, 0.7, 0.7);
  explosion.setEnabled(true);
}

function updateExplosion(dt: number) {
  if (explosionTimer <= 0) {
    explosion.setEnabled(false);
    return;
  }
  explosionTimer = Math.max(0, explosionTimer - dt);
  const progress = 1 - explosionTimer / 0.42;
  const scale = 0.9 + progress * 0.9;
  explosion.scaling.set(scale, scale, scale);
  explosion.rotation.y += dt * 8;
  if (explosionTimer === 0) {
    explosion.setEnabled(false);
  }
}

function updateRunwayLights(dt: number) {
  const now = performance.now();
  for (const runwayLight of runwayLights) {
    if (state === "running") {
      runwayLight.z += speed * dt;
      if (runwayLight.z > pathRecycleZ) {
        runwayLight.z -= pathLoopLength;
      }
      runwayLight.marker.position.z = runwayLight.z;
    }
    const pulseAmount = 0.55 + Math.max(0, Math.sin(now * 0.006 + runwayLight.phase)) * 0.75;
    runwayLight.marker.scaling.set(pulseAmount, pulseAmount, pulseAmount);
    if (runwayLight.light) {
      runwayLight.light.position.copyFrom(runwayLight.marker.position);
      runwayLight.light.intensity = 0.18 + pulseAmount * 0.32;
    }
  }
}

function updateCamera(dt: number) {
  const shake = pulse > 0 ? Math.sin(performance.now() * 0.04) * pulse * 0.04 : 0;
  pulse = Math.max(0, pulse - dt);
  camera.target = new Vector3(player.position.x * 0.18, 1.35 + shake, 0.5);
  camera.radius = 15.5;
}

function beep(frequency: number, duration: number, type: OscillatorType, gainValue: number) {
  const AudioContextClass = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) {
    return;
  }
  const context = new AudioContextClass();
  const osc = context.createOscillator();
  const gain = context.createGain();
  osc.frequency.value = frequency;
  osc.type = type;
  gain.gain.value = gainValue;
  osc.connect(gain);
  gain.connect(context.destination);
  osc.start();
  osc.stop(context.currentTime + duration);
  window.setTimeout(() => context.close(), (duration + 0.05) * 1000);
}

function updateDebug() {
  if (feedbackTextTimer > 0) {
    debugEl.textContent = `Crystal +35 | FPS ${Math.round(engine.getFps())} | Speed ${speed.toFixed(1)} | State ${state}`;
    return;
  }
  debugEl.textContent = `FPS ${Math.round(engine.getFps())} | Speed ${speed.toFixed(1)} | State ${state}`;
}

function handleVisibility() {
  if (document.hidden && state === "running") {
    state = "paused";
    overlayTitle.textContent = "Paused";
    overlayText.textContent = "Tap resume when you are ready.";
    primaryAction.textContent = "Resume";
    overlayEl.classList.remove("hidden");
  }
}

function resumeRun() {
  if (state === "paused") {
    state = "running";
    overlayEl.classList.add("hidden");
  }
}

primaryAction.addEventListener("click", () => {
  if (state === "paused") {
    resumeRun();
  } else {
    startRun();
  }
});

laneLeft.addEventListener("click", moveScreenLeft);
laneRight.addEventListener("click", moveScreenRight);

window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
    moveScreenLeft();
  }
  if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
    moveScreenRight();
  }
  if (event.key === " " || event.key === "Enter") {
    if (state === "ready" || state === "gameover") {
      startRun();
    } else if (state === "paused") {
      resumeRun();
    }
  }
});

let touchStartX = 0;
window.addEventListener("pointerdown", (event) => {
  touchStartX = event.clientX;
});
window.addEventListener("pointerup", (event) => {
  const dx = event.clientX - touchStartX;
  if (Math.abs(dx) > 32) {
    if (dx > 0) {
      moveScreenRight();
    } else {
      moveScreenLeft();
    }
  }
});

window.addEventListener("resize", () => engine.resize());
document.addEventListener("visibilitychange", handleVisibility);

engine.runRenderLoop(() => {
  const dt = Math.min(0.033, engine.getDeltaTime() / 1000);
  feedbackTextTimer = Math.max(0, feedbackTextTimer - dt);
  updateGame(dt);
  updateExplosion(dt);
  updateRunwayLights(dt);
  updateCamera(dt);
  updateDebug();
  scene.render();
});

overlayTitle.textContent = "Crystal Runner";
overlayText.textContent = "Dodge glowing hazards, collect crystals, and survive as speed climbs.";
primaryAction.textContent = "Start Run";
