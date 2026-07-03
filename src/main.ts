import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Engine } from "@babylonjs/core/Engines/engine";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Color3, Color4 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import { Scene } from "@babylonjs/core/scene";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import "@babylonjs/core/Meshes/Builders/boxBuilder";
import "@babylonjs/core/Meshes/Builders/planeBuilder";
import "./style.css";

type GameState = "ready" | "running" | "gameover" | "paused";
type RunnerItem = {
  mesh: Mesh;
  lane: number;
  z: number;
  type: "crystal" | "obstacle";
  active: boolean;
  wobbleSeed: number;
};

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
const assetBaseUrl = `${import.meta.env.BASE_URL}assets/kenney-pirate/`;

const camera = new ArcRotateCamera("camera", Math.PI / 2, 1.05, 16, new Vector3(0, 1.8, 5), scene);
camera.attachControl(canvas, true);
camera.inputs.clear();

new HemisphericLight("ambient", new Vector3(0, 1, 0), scene).intensity = 0.68;
const keyLight = new DirectionalLight("key", new Vector3(-0.4, -0.9, 0.55), scene);
keyLight.position = new Vector3(5, 9, -8);
keyLight.intensity = 1.8;

const textures = createTextures(scene);
const materials = createMaterials(scene);
const spriteMaterials = createSpriteMaterials(scene, textures);
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

const player = MeshBuilder.CreatePlane("runner", { width: 1.55, height: 1.95 }, scene);
player.position = new Vector3(0, 0.2, 1.8);
player.rotation.x = Math.PI / 2;
player.rotation.z = 0;
player.material = spriteMaterials.player;
player.parent = world;

const explosion = MeshBuilder.CreatePlane("collision-explosion", { width: 2, height: 2 }, scene);
explosion.position = new Vector3(0, 0.26, 1.8);
explosion.rotation.x = Math.PI / 2;
explosion.setEnabled(false);
explosion.parent = world;

const pathSegments: Mesh[] = [];
for (let i = 0; i < 18; i += 1) {
  const segment = MeshBuilder.CreateBox(`path-${i}`, { width: 7.2, height: 0.18, depth: 4 }, scene);
  segment.position = new Vector3(0, -0.12, -i * 4);
  segment.material = materials.path;
  segment.parent = world;
  pathSegments.push(segment);
}

const rails: Mesh[] = [];
for (const x of [-3.72, 3.72]) {
  const rail = MeshBuilder.CreateBox(`rail-${x}`, { width: 0.1, height: 0.18, depth: 70 }, scene);
  rail.position = new Vector3(x, 0.12, -32);
  rail.material = materials.rail;
  rail.parent = world;
  rails.push(rail);
}

const items: RunnerItem[] = [];
const crystalTemplate = MeshBuilder.CreatePlane("crystal-template", { width: 1.7, height: 1.24 }, scene);
crystalTemplate.rotation.x = Math.PI / 2;
crystalTemplate.material = spriteMaterials.collectible;
crystalTemplate.setEnabled(false);
const obstacleTemplate = MeshBuilder.CreatePlane("obstacle-template", { width: 1.75, height: 0.78 }, scene);
obstacleTemplate.rotation.x = Math.PI / 2;
obstacleTemplate.material = spriteMaterials.obstacle;
obstacleTemplate.setEnabled(false);

function createTextures(activeScene: Scene) {
  const load = (fileName: string) => {
    const texture = new Texture(`${assetBaseUrl}${fileName}`, activeScene, true, false, Texture.NEAREST_SAMPLINGMODE);
    texture.hasAlpha = true;
    return texture;
  };

  return {
    player: load("player-ship.png"),
    collectible: load("collectible-gold-crest.png"),
    obstacle: load("obstacle-cannon.png"),
    explosion: [load("explosion-1.png"), load("explosion-2.png"), load("explosion-3.png")]
  };
}

function createMaterials(activeScene: Scene) {
  const pathMat = new StandardMaterial("path-mat", activeScene);
  pathMat.diffuseColor = new Color3(0.07, 0.13, 0.22);
  pathMat.emissiveColor = new Color3(0.02, 0.05, 0.1);

  const railMat = new StandardMaterial("rail-mat", activeScene);
  railMat.diffuseColor = new Color3(0.16, 0.34, 0.42);
  railMat.emissiveColor = new Color3(0.04, 0.22, 0.28);

  return { path: pathMat, rail: railMat };
}

function createSpriteMaterial(name: string, texture: Texture, activeScene: Scene, glow: Color3) {
  const material = new StandardMaterial(name, activeScene);
  material.diffuseTexture = texture;
  material.opacityTexture = texture;
  material.useAlphaFromDiffuseTexture = true;
  material.diffuseColor = Color3.White();
  material.emissiveColor = glow;
  material.specularColor = Color3.Black();
  material.backFaceCulling = false;
  return material;
}

function createSpriteMaterials(activeScene: Scene, loadedTextures: ReturnType<typeof createTextures>) {
  return {
    player: createSpriteMaterial("player-ship-mat", loadedTextures.player, activeScene, new Color3(0.03, 0.16, 0.2)),
    collectible: createSpriteMaterial("gold-crest-mat", loadedTextures.collectible, activeScene, new Color3(0.38, 0.28, 0.04)),
    obstacle: createSpriteMaterial("cannon-mat", loadedTextures.obstacle, activeScene, new Color3(0.12, 0.03, 0.02)),
    explosion: loadedTextures.explosion.map((texture, index) =>
      createSpriteMaterial(`explosion-${index + 1}-mat`, texture, activeScene, new Color3(0.55, 0.16, 0.02))
    )
  };
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
  player.rotation.z = 0;
  explosionTimer = 0;
  explosion.setEnabled(false);
  items.forEach((item) => item.mesh.dispose());
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
  overlayText.textContent = `${reason} Score ${Math.floor(score)}. Crests ${crystals}. Try again for a cleaner run.`;
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
  const source = type === "crystal" ? crystalTemplate : obstacleTemplate;
  const mesh = source.clone(`${type}-${items.length}`) as Mesh;
  mesh.setEnabled(true);
  mesh.parent = world;
  mesh.position = new Vector3(lanePositions[itemLane], type === "crystal" ? 0.28 : 0.24, z);
  mesh.rotation.x = Math.PI / 2;
  mesh.rotation.z = type === "crystal" ? 0 : -0.2 + (nextPattern % 3) * 0.2;
  items.push({ mesh, lane: itemLane, z, type, active: true, wobbleSeed: performance.now() * 0.01 + itemLane });
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
  player.position.y = 0.2 + Math.sin(performance.now() * 0.008) * 0.035;
  player.rotation.z = (targetX - player.position.x) * -0.08 + Math.sin(performance.now() * 0.006) * 0.018;

  for (const segment of pathSegments) {
    segment.position.z += speed * dt;
    if (segment.position.z > 4) {
      segment.position.z -= pathSegments.length * 4;
    }
  }

  for (const item of items) {
    if (!item.active) {
      continue;
    }
    item.z += speed * dt;
    item.mesh.position.z = item.z;
    item.mesh.position.y = (item.type === "crystal" ? 0.32 : 0.24) + Math.sin(performance.now() * 0.006 + item.wobbleSeed) * 0.05;
    if (item.type === "crystal") {
      const pulseScale = 1 + Math.sin(performance.now() * 0.012 + item.wobbleSeed) * 0.12;
      item.mesh.scaling.set(pulseScale, pulseScale, pulseScale);
      item.mesh.rotation.z += dt * 3.8;
    } else {
      item.mesh.rotation.z += Math.sin(performance.now() * 0.005 + item.wobbleSeed) * dt * 0.22;
    }

    const dx = Math.abs(item.mesh.position.x - player.position.x);
    const dz = Math.abs(item.mesh.position.z - player.position.z);
    if (dx < 0.9 && dz < 0.88) {
      if (item.type === "crystal") {
        collectCrystal(item);
      } else {
        endRun("You hit an obstacle.");
      }
    }

    if (item.mesh.position.z > 7) {
      item.active = false;
      item.mesh.dispose();
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
  item.mesh.dispose();
  crystals += 1;
  score += 35;
  feedbackTextTimer = 0.35;
  beep(720 + crystals * 12, 0.045, "sine", 0.05);
}

function triggerExplosion() {
  explosionTimer = 0.42;
  explosion.position.x = player.position.x;
  explosion.position.z = player.position.z;
  explosion.scaling.set(0.8, 0.8, 0.8);
  explosion.material = spriteMaterials.explosion[0];
  explosion.setEnabled(true);
}

function updateExplosion(dt: number) {
  if (explosionTimer <= 0) {
    explosion.setEnabled(false);
    return;
  }
  explosionTimer = Math.max(0, explosionTimer - dt);
  const progress = 1 - explosionTimer / 0.42;
  const frame = Math.min(spriteMaterials.explosion.length - 1, Math.floor(progress * spriteMaterials.explosion.length));
  explosion.material = spriteMaterials.explosion[frame];
  const scale = 0.9 + progress * 0.9;
  explosion.scaling.set(scale, scale, scale);
  if (explosionTimer === 0) {
    explosion.setEnabled(false);
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
    debugEl.textContent = `Crest +35 | FPS ${Math.round(engine.getFps())} | Speed ${speed.toFixed(1)} | State ${state}`;
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
  updateCamera(dt);
  updateDebug();
  scene.render();
});

overlayTitle.textContent = "Crystal Runner";
overlayText.textContent = "Dodge cannon hazards, collect gold crests, and survive as speed climbs.";
primaryAction.textContent = "Start Run";
