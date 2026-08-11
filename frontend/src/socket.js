import { io } from "socket.io-client";

const SOCKET_URL =
    "https://ultimate-tic-tac-toe-chi-lemon.vercel.app";

export const socket =
    io(SOCKET_URL, {

        autoConnect: false,

        transports: [
            "websocket"
        ]

    });