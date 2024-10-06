"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const serverconfig_1 = __importDefault(require("./config/serverconfig"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const Roomhandler_1 = require("./handler/Roomhandler");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true
}));
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    },
});
io.on("connection", (socket) => {
    console.log("new user is connected ");
    (0, Roomhandler_1.Roomhandler)(socket);
    socket.on("disconnect", () => {
        console.log("user is disconnected");
    });
});
server.listen(serverconfig_1.default.PORT, () => {
    console.log(` server is running on PORT :${serverconfig_1.default.PORT}`);
});
