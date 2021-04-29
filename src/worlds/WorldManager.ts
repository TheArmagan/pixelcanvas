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

  async getWorld(name: string): Promise<World> {
    return null as any;
  }
}