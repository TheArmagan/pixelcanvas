import mongodb from "mongodb";
import { Pixel } from "./Pixel";
import { World } from "./World";

export class Chunk {
  _id: mongodb.ObjectId;
  world: World;
  x: number;
  y: number;
  pixels: { [xy: string]: Pixel };
  owners: string[];
  constructor(world: World, data) {
    this.world = world;
    let [x, y] = data.xy.split(";");
    this.x = x;
    this.y = y;
    this.owners = data.owners;
    this._id = new mongodb.ObjectId(data._id);

    this.pixels = Object.fromEntries(Object.entries(data.pixels as [string, any]).map(i => {
      return [i[0], new Pixel(this, i[1])];
    }));
  }

  async setPixel(x:number, y:number, color:number) {
    if (color < 0 || color > 0xffffff || x < 0 || y < 0 || x > 16 || y > 16) return false;
    this.pixels[`${x}:${y}`] = new Pixel(this, { x, y, color });
    await this.save();
  }

  async save() {
    await this.world.chunkColl.findOneAndUpdate({ _id: this._id }, {
      xy: `${this.x}:${this.y}`,
      owners: this.owners || [],
      pixels: Object.fromEntries(Object.entries(this.pixels).map(i=>[i[0],i[1].color]))
    },{upsert: true});
  }
}