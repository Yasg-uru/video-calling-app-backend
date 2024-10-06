"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Roomhandler = void 0;
const uuid_1 = require("uuid");
const rooms = {};
// {{1,[u1,u2,u3]},{2,{u1,u2,u3}}}
const Roomhandler = (socket) => {
    // create room function
    function createroom() {
        const roomid = (0, uuid_1.v4)();
        rooms[roomid] = []; // create a new entry for the room
        socket.join(roomid); // we will make socket connection enter a new room
        // we will emit an event when room is created
        socket.emit("room-created", { roomid });
        console.log("room is created with id :", roomid);
    }
    // join room function
    const joinroom = ({ roomId, peerId }) => {
        if (rooms[roomId]) {
            // If the given roomId exist in the in memory db
            console.log("New user has joined room", roomId, "with peer id as", peerId);
            // the moment new user joins, add the peerId to the key of roomId
            rooms[roomId].push(peerId);
            console.log("added peer to room", rooms);
            socket.join(roomId); // make the user join the socket room
            // if someone joins the room then ready event is emited from the frontend then emiting the joining room information to all the other users
            socket.on("ready", () => {
                console.log("ready event is called ");
                // from the frontend once someone joins the room we will emit a ready event
                // then from our server we will emit an event to all the clients conn that a new peer has added
                socket.to(roomId).emit("user-joined", { peerId });
            });
            // below event is for logging purpose
            socket.emit("get-users", {
                roomId,
                participants: rooms[roomId],
            });
        }
    };
    // when we call functions when the client
    socket.on("create-room", createroom);
    socket.on("joined-room", joinroom);
};
exports.Roomhandler = Roomhandler;
