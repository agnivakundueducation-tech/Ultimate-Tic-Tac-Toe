import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

import {
    registerRoomHandlers,
    removePlayer
} from "./socket/roomHandlers.js";

import {
    registerGameHandlers
} from "./socket/gameHandlers.js";


const app = express();

const FRONTEND_URL =
    process.env.FRONTEND_URL ||
    "http://localhost:5173";


app.use(cors({
    origin: FRONTEND_URL
}));


app.get("/", (req, res) => {
    res.json({
        message:
            "Ultimate Tic Tac Toe server is running"
    });
});


const server =
    http.createServer(app);


const io =
    new Server(server, {
        cors: {
            origin: FRONTEND_URL,
            methods: [
                "GET",
                "POST"
            ]
        }
    });


const rooms =
    new Map();


io.on("connection", socket => {

    console.log(
        "Connected:",
        socket.id
    );

    registerRoomHandlers(
        io,
        socket,
        rooms
    );

    registerGameHandlers(
        io,
        socket,
        rooms
    );

    socket.on("disconnect", () => {

        console.log(
            "Disconnected:",
            socket.id
        );

        removePlayer(
            io,
            socket,
            rooms
        );

    });

});


const PORT =
    process.env.PORT || 5020;

server.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );

});