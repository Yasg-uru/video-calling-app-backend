import express from "express";
import serverconfig from "./config/serverconfig";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { Roomhandler } from "./handler/Roomhandler";

const app = express();
app.use(cors({
  origin:"http://localhost:5173",

}));
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods:["GET","POST"],
    credentials:true
  },
});
io.on("connection", (socket) => {
  console.log("new user is connected ");
  Roomhandler(socket);

  socket.on("disconnect", () => {
    console.log("user is disconnected");
  });
});

server.listen(serverconfig.PORT, () => {
  console.log(` server is running on PORT :${serverconfig.PORT}`);
});
