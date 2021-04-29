import { Collection } from "mongodb";
import { PixelCanvas } from "../PixelCanvas";
import { Chunk } from "./Chunk";

export class World {
  pc: PixelCanvas;
  name: string;
  chunkColl: Collection;
  infoColl: Collection;
  chunksCache = new Map<string, Chunk & {lastUpdate:number}>();
  constructor(pc: PixelCanvas, name: string) {
    this.pc = pc;
    this.name = name.toLowerCase().replace(/[^A-Za-z0-9_-]/gm,"").slice(0, 128);
    this.chunkColl = this.pc.db.collection(`worldChunks_${this.name}`);
    this.infoColl = this.pc.db.collection(`worldInfo_${this.name}`);

    setInterval(() => {
      this.chunksCache.forEach((chunk, xy) => {
        if (Date.now() - chunk.lastUpdate > 5 * 1000 * 60) {
          return this.chunksCache.delete(xy);
        }
      })
    }, 5*1000*60)
  }

  async getChunk(x:number, y:number): Promise<Chunk> {
    let xy = `${x}:${y}`;
    let cached = this.chunksCache.get(xy);
    if (cached) {
      cached.lastUpdate = Date.now();
      return cached;
    }
    let chunkData = await this.chunkColl.findOne({ xy });

    if (!chunkData) {
      chunkData = { xy, pixels: {}, owners: [] };
      await this.chunkColl.insertOne(chunkData)
    }
    
    let chunk = new Chunk(this, chunkData);
    this.chunksCache.set(xy, {lastUpdate: Date.now(), ...chunk} as any)
    return chunk;
  }

  async setPixel(x: number, y: number, color: number) {
    return (await this.getChunk(Math.floor(x / 16), Math.floor(y / 16))).setPixel(x % 16, y % 16, color);
  }

}