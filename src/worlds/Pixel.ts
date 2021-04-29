import { Chunk } from "./Chunk";

export class Pixel {
  chunk: Chunk;
  x: number;
  y: number;
  color: number = 0xffffff;
  constructor(chunk: Chunk, data) {
    this.chunk = chunk;
    let [x, y] = data.xy.split(";");
    this.x = x;
    this.y = y;
    this.color = data.color;
  }
}