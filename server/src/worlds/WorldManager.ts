import { PixelCanvas } from "../PixelCanvas";
import { World } from "./World";

export class WorldManager {
  pc: PixelCanvas;

  worldCache = new Map<string, World & {lastUpdate:number}>()

  constructor(pc: PixelCanvas) {
    this.pc = pc;

    setInterval(() => {
      this.worldCache.forEach((world, name) => {
        if (Date.now() - world.lastUpdate > 5 * 1000 * 60) {
          return this.worldCache.delete(name);
        }
      })
    }, 5*1000*60)
  }

  getWorld(name: string): World {
    name = clearName(name);
    let cached = this.worldCache.get(name);
    if (cached) {
      cached.lastUpdate = Date.now();
      return cached;
    }

    let world = new World(this, name);
    this.worldCache.set(name, { ...world, lastUpdate: Date.now() } as any);
    return world;
  }
}

export function clearName(name: string): string {
  return name.toLowerCase().replace(/[^A-Za-z0-9_-]/gm, "").slice(0, 128);
}