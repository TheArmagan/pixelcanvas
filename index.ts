import SocketIO from "socket.io";
import Express from "express";
import MongoDB from "mongodb";
import http from "http";

class PixelCanvas {
  httpServer: http.Server;
  app: Express.Application;
  io: SocketIO.Server;
  db: MongoDB.MongoClient;
  constructor() {
    this.app = Express();
    this.httpServer = http.createServer(this.app);
    this.io = new SocketIO.Server();
    this.io.listen(this.httpServer);
    this.app.listen(process.env.PORT || 80);
    this.init();
  }
  
  async init() {
    this.db = await MongoDB.connect(process.env.MONGO_URI, {
      compression: "snappy",
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  }

};

(new PixelCanvas());