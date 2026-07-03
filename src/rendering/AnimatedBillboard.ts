import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import type { Scene } from "@babylonjs/core/scene";

export type BillboardAnimation = {
  frames: number[];
  fps: number;
  loop: boolean;
};

type ActiveAnimation = BillboardAnimation & {
  elapsed: number;
  frameIndex: number;
  playing: boolean;
};

type AnimatedBillboardOptions = {
  textureUrl: string;
  width: number;
  height: number;
  columns?: number;
  rows?: number;
  animations?: Record<string, BillboardAnimation>;
  initialAnimation?: string;
  emissiveTint?: Color3;
  yAxisBillboard?: boolean;
};

export class AnimatedBillboard {
  readonly mesh: Mesh;
  readonly texture: Texture;
  readonly material: StandardMaterial;

  private readonly columns: number;
  private readonly rows: number;
  private readonly animations: Record<string, BillboardAnimation>;
  private activeAnimation: ActiveAnimation | null = null;
  private activeAnimationName = "";

  constructor(name: string, scene: Scene, options: AnimatedBillboardOptions) {
    this.columns = options.columns ?? 1;
    this.rows = options.rows ?? 1;
    this.animations = options.animations ?? {
      idle: { frames: [0], fps: 1, loop: true }
    };

    this.texture = new Texture(options.textureUrl, scene, true, false, Texture.NEAREST_SAMPLINGMODE);
    this.texture.hasAlpha = true;
    this.texture.uScale = 1 / this.columns;
    this.texture.vScale = 1 / this.rows;

    this.material = new StandardMaterial(`${name}-material`, scene);
    this.material.diffuseTexture = this.texture;
    this.material.emissiveTexture = this.texture;
    this.material.opacityTexture = this.texture;
    this.material.useAlphaFromDiffuseTexture = true;
    this.material.diffuseColor = Color3.White();
    this.material.emissiveColor = Color3.White().add(options.emissiveTint ?? Color3.Black()).scale(0.5);
    this.material.specularColor = Color3.Black();
    this.material.backFaceCulling = false;
    this.material.disableLighting = true;

    this.mesh = MeshBuilder.CreatePlane(name, { width: options.width, height: options.height }, scene);
    this.mesh.material = this.material;
    if (options.yAxisBillboard ?? true) {
      this.mesh.billboardMode = Mesh.BILLBOARDMODE_Y;
    }

    this.play(options.initialAnimation ?? Object.keys(this.animations)[0] ?? "idle");
  }

  play(animationName: string, restart = false) {
    const animation = this.animations[animationName];
    if (!animation) {
      return;
    }
    if (!restart && this.activeAnimationName === animationName && this.activeAnimation?.playing) {
      return;
    }
    this.activeAnimationName = animationName;
    this.activeAnimation = {
      ...animation,
      elapsed: 0,
      frameIndex: 0,
      playing: true
    };
    this.applyFrame(animation.frames[0] ?? 0);
  }

  update(deltaSeconds: number) {
    const animation = this.activeAnimation;
    if (!animation || !animation.playing || animation.frames.length <= 1) {
      return;
    }

    animation.elapsed += deltaSeconds;
    const frameDuration = 1 / animation.fps;
    while (animation.elapsed >= frameDuration) {
      animation.elapsed -= frameDuration;
      animation.frameIndex += 1;
      if (animation.frameIndex >= animation.frames.length) {
        if (animation.loop) {
          animation.frameIndex = 0;
        } else {
          animation.frameIndex = animation.frames.length - 1;
          animation.playing = false;
        }
      }
      this.applyFrame(animation.frames[animation.frameIndex]);
    }
  }

  setPosition(position: Vector3) {
    this.mesh.position.copyFrom(position);
  }

  setScale(scale: number) {
    this.mesh.scaling.set(scale, scale, scale);
  }

  setEnabled(enabled: boolean) {
    this.mesh.setEnabled(enabled);
  }

  dispose() {
    this.mesh.dispose(false, false);
    this.material.dispose(false, true);
    this.texture.dispose();
  }

  private applyFrame(frame: number) {
    const column = frame % this.columns;
    const row = Math.floor(frame / this.columns);
    this.texture.uOffset = column / this.columns;
    // Babylon texture vOffset behaviour can feel inverted compared with top-left spritesheet tools.
    // If a future sheet animates upside down, swap this for `row / this.rows`.
    this.texture.vOffset = 1 - (row + 1) / this.rows;
  }
}
