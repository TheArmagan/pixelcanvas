import SocketIO from "socket.io";
import Express from "express";
import MongoDB from "mongodb";
import http from "http";
import { WorldManager } from "./worlds/WorldManager";

export class PixelCanvas {
  httpServer: http.Server;
  app: Express.Application;
  io: SocketIO.Server;
  mongo: MongoDB.MongoClient;
  db: MongoDB.Db;
  worldManager: WorldManager;
  constructor() {
    this.init();
  }
  
  async init() {
    this.mongo = await MongoDB.connect(process.env.MONGO_URI, {
      compression: ["snappy"] as any,
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    this.app = Express();
    this.httpServer = http.createServer(this.app);
    this.io = new SocketIO.Server();
    this.app.listen(process.env.PORT || 80);
    this.io.listen(this.httpServer);
    this.db = this.mongo.db();
    this.worldManager = new WorldManager(this);
  }

};