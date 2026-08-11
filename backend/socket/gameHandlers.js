import {
    makeMove
} from "../game/gameLogic.js";

import {
    getPublicRoom
} from "../game/gameState.js";


export function registerGameHandlers(
    io,
    socket,
    rooms
) {


    // ====================================
    // MAKE MOVE
    // ====================================

    socket.on(
        "game:move",
        ({ blockIndex, cellIndex }) => {

            const roomCode =
                socket.data.roomCode;


            const player =
                socket.data.symbol;


            if (!roomCode || !player) {

                return;

            }


            const room =
                rooms.get(roomCode);


            if (!room) {

                return;

            }


            const result =
                makeMove(
                    room.game,
                    blockIndex,
                    cellIndex,
                    player
                );


            if (!result.success) {

                socket.emit(
                    "game:error",
                    {
                        message:
                            result.message
                    }
                );

                return;

            }


            io.to(roomCode).emit(
                "game:state",
                {
                    room:
                        getPublicRoom(room)
                }
            );

        }
    );


    // ====================================
    // RESET
    // ====================================

    socket.on(
        "game:reset",
        () => {

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


            room.game = {

                bigBoard: Array(9)
                    .fill(null)
                    .map(() =>
                        Array(9).fill("")
                    ),

                mainBoard:
                    Array(9).fill(""),

                current: "x",

                activeBoard: null,

                winner: null,

                winningPattern: [],

                gameActive:
                    Boolean(
                        room.players.x &&
                        room.players.o
                    )

            };


            io.to(roomCode).emit(
                "game:state",
                {
                    room:
                        getPublicRoom(room)
                }
            );

        }
    );

}