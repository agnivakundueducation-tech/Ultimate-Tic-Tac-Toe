import { generateRoomCode } from "../utils/roomCode.js";
import {
    createRoom,
    getPublicRoom
} from "../game/gameState.js";

export function registerRoomHandlers(
    io,
    socket,
    rooms
) {


    // ====================================
    // CREATE ROOM
    // ====================================

    socket.on(
        "room:create",
        ({ playerName }) => {

            let roomCode;

            do {

                roomCode =
                    generateRoomCode();

            } while (rooms.has(roomCode));


            const room =
                createRoom(
                    roomCode,
                    socket.id,
                    playerName
                );


            rooms.set(
                roomCode,
                room
            );


            socket.join(roomCode);


            socket.data.roomCode =
                roomCode;

            socket.data.symbol =
                "x";


            socket.emit(
                "room:created",
                {
                    roomCode,
                    symbol: "x",
                    room: getPublicRoom(room)
                }
            );


            console.log(
                `Room created: ${roomCode}`
            );

        }
    );


    // ====================================
    // JOIN ROOM
    // ====================================

    socket.on(
        "room:join",
        ({ roomCode, playerName }) => {

            const code =
                roomCode
                    ?.trim()
                    .toUpperCase();


            const room =
                rooms.get(code);


            if (!room) {

                socket.emit(
                    "room:error",
                    {
                        message:
                            "Room not found"
                    }
                );

                return;

            }


            if (room.players.o) {

                socket.emit(
                    "room:error",
                    {
                        message:
                            "Room is full"
                    }
                );

                return;

            }


            room.players.o = {

                id: socket.id,

                name:
                    playerName ||
                    "Player O"

            };


            room.game.gameActive =
                true;


            socket.join(code);


            socket.data.roomCode =
                code;

            socket.data.symbol =
                "o";


            socket.emit(
                "room:joined",
                {
                    roomCode: code,
                    symbol: "o"
                }
            );


            io.to(code).emit(
                "room:ready",
                {
                    room:
                        getPublicRoom(room)
                }
            );


            console.log(
                `Player joined ${code}`
            );

        }
    );


    // ====================================
    // LEAVE ROOM
    // ====================================

    socket.on(
        "room:leave",
        () => {

            removePlayer(
                io,
                socket,
                rooms
            );

        }
    );

}


// ========================================
// REMOVE PLAYER
// ========================================

export function removePlayer(
    io,
    socket,
    rooms
) {

    const roomCode =
        socket.data.roomCode;


    if (!roomCode) {
        return;
    }


    const room =
        rooms.get(roomCode);


    if (!room) {
        return;
    }


    socket.to(roomCode).emit(
        "room:player-left"
    );


    if (
        room.players.x?.id ===
        socket.id
    ) {

        room.players.x = null;

    }


    if (
        room.players.o?.id ===
        socket.id
    ) {

        room.players.o = null;

    }


    if (
        !room.players.x &&
        !room.players.o
    ) {

        rooms.delete(roomCode);

    }


    socket.leave(roomCode);

    delete socket.data.roomCode;
    delete socket.data.symbol;

}