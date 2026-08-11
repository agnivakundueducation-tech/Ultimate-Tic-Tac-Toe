import { createEmptyGame } from "./gameLogic.js";

export function createRoom(roomCode, socketId, playerName) {

    return {

        roomCode,

        players: {

            x: {
                id: socketId,
                name: playerName || "Player X"
            },

            o: null

        },

        game: createEmptyGame()

    };

}


export function getPublicRoom(room) {

    return {

        roomCode: room.roomCode,

        players: room.players,

        game: room.game

    };

}