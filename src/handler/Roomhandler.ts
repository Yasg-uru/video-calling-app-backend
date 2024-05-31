import { Socket } from "socket.io";
import { v4 as UUIDv4 } from "uuid";
import IRoomsparams from "../interfaces/IRoomsparams";

const rooms: Record<string, string[]> = {};
// {{1,[u1,u2,u3]},{2,{u1,u2,u3}}}

export const Roomhandler = (socket: Socket) => {
  //create room function
  function createroom() {
    const roomid = UUIDv4();
    rooms[roomid] = []; //create a new entry for the room
    socket.join(roomid); //we will make socket connection enter a new room
    //we will emit an event when room is created
    socket.emit("room-created", { roomid });
    console.log("room is created with id :", roomid);
  }
  // join room function
  const joinroom = ({ roomId, peerId }: IRoomsparams) => {
    if (rooms[roomId]) {
      rooms[roomId].push(peerId);
      //inserting new user in a particular id it can able to detect how many user is asociated with particular room
      socket.join(roomId);

      console.log(`User joined room: ${roomId} and peer id is :${peerId}`);
      console.log(`array of peers:`,rooms[roomId]);
      //below event is for logging purpose
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
