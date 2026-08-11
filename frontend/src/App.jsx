import { useEffect, useState } from "react";

import StartPopup from "./components/StartPopup";
import GuidePopup from "./components/GuidePopup";
import OnlineLobby from "./components/OnlineLobby";
import Game from "./components/Game";

import { socket } from "./socket";


function App() {

    const [gameConfig, setGameConfig] =
        useState(null);


    const [roomCode, setRoomCode] =
        useState(null);

    const [playerSymbol, setPlayerSymbol] =
        useState(null);


    const [showGuide, setShowGuide] =
        useState(true);

    const [showStart, setShowStart] =
        useState(false);

    const [showLobby, setShowLobby] =
        useState(false);


    const [onlineStarted, setOnlineStarted] =
        useState(false);


    useEffect(() => {

        function roomCreated(data) {

            console.log(
                "ROOM CREATED",
                data
            );


            setRoomCode(
                data.roomCode
            );

            setPlayerSymbol(
                data.symbol
            );


            setGameConfig(prev => ({
                ...prev,
                gameMode: "online",
                playerX:
                    data.room?.players?.x?.name ||
                    "Player X",
                playerO:
                    data.room?.players?.o?.name ||
                    "Player O",
                numGames:
                    prev?.numGames || 3
            }));


            setShowStart(false);

            setShowLobby(true);

        }


        function roomJoined(data) {

            console.log(
                "ROOM JOINED",
                data
            );


            setRoomCode(
                data.roomCode
            );

            setPlayerSymbol(
                data.symbol
            );


            setGameConfig(prev => ({
                ...prev,
                gameMode: "online",
                numGames:
                    prev?.numGames || 3
            }));


            setShowStart(false);

            setShowLobby(true);

        }


        function roomReady(data) {

            console.log(
                "ROOM READY",
                data
            );


            setGameConfig(prev => ({
                ...prev,
                gameMode: "online",
                playerX:
                    data.room?.players?.x?.name ||
                    "Player X",
                playerO:
                    data.room?.players?.o?.name ||
                    "Player O",
                numGames:
                    prev?.numGames || 3
            }));


            setShowLobby(false);

            setOnlineStarted(true);

        }


        function roomError(data) {

            alert(
                data.message
            );

        }


        socket.on(
            "room:created",
            roomCreated
        );

        socket.on(
            "room:joined",
            roomJoined
        );

        socket.on(
            "room:ready",
            roomReady
        );

        socket.on(
            "room:error",
            roomError
        );


        return () => {

            socket.off(
                "room:created",
                roomCreated
            );

            socket.off(
                "room:joined",
                roomJoined
            );

            socket.off(
                "room:ready",
                roomReady
            );

            socket.off(
                "room:error",
                roomError
            );

        };

    }, []);


    function handleStart(config) {

        setGameConfig(
            config
        );


        if (
            config.gameMode ===
            "online"
        ) {

            return;

        }


        setShowStart(false);

    }


    function beginMatch() {

        setShowGuide(false);

        setShowStart(true);

    }


    function cancelOnline() {

        socket.emit(
            "room:leave"
        );

        socket.disconnect();


        setShowLobby(false);

        setShowStart(true);

        setRoomCode(null);

        setPlayerSymbol(null);

        setOnlineStarted(false);

        setGameConfig(null);

    }


    return (

        <>

            {showGuide && (

                <GuidePopup
                    onClose={
                        beginMatch
                    }
                />

            )}


            {showStart && (

                <StartPopup
                    onStart={
                        handleStart
                    }
                />

            )}


            {showLobby && (

                <OnlineLobby
                    roomCode={
                        roomCode
                    }
                    playerSymbol={
                        playerSymbol
                    }
                    onCancel={
                        cancelOnline
                    }
                />

            )}


            <Game
                {...gameConfig}
                playerSymbol={
                    gameConfig?.gameMode === "online"
                        ? playerSymbol
                        : gameConfig?.playerSymbol
                }
                roomCode={
                    roomCode
                }
                onlineStarted={
                    onlineStarted
                }
            />

        </>

    );

}


export default App;