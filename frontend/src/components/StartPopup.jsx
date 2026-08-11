import { useState } from "react";
import { socket } from "../socket";

function StartPopup({ onStart }) {

    const [gameMode, setGameMode] =
        useState("pvp");

    const [playerX, setPlayerX] =
        useState("");

    const [playerO, setPlayerO] =
        useState("");

    const [playerSymbol, setPlayerSymbol] =
        useState("x");

    const [botDifficulty, setBotDifficulty] =
        useState("medium");

    const [numGames, setNumGames] =
        useState(3);

    const [onlineAction, setOnlineAction] =
        useState("create");

    const [onlineName, setOnlineName] =
        useState("");

    const [roomCode, setRoomCode] =
        useState("");


    function startLocalGame() {

        let xName;
        let oName;


        if (gameMode === "bot") {

            if (playerSymbol === "x") {

                xName = "You";
                oName = "Bot";

            }
            else {

                xName = "Bot";
                oName = "You";

            }

        }
        else {

            xName =
                playerX.trim() ||
                "Player X";

            oName =
                playerO.trim() ||
                "Player O";

        }


        onStart({
            playerX: xName,
            playerO: oName,
            numGames: Number(numGames),
            gameMode,
            botDifficulty,
            playerSymbol
        });

    }


    function createOnlineRoom() {

        const name =
            onlineName.trim() ||
            "Player X";


        if (!socket.connected) {
            socket.connect();
        }


        socket.emit(
            "room:create",
            {
                playerName: name
            }
        );

    }


    function joinOnlineRoom() {

        const name =
            onlineName.trim() ||
            "Player O";


        const code =
            roomCode
                .trim()
                .toUpperCase();


        if (!code) {

            alert(
                "Enter a room code."
            );

            return;

        }


        if (!socket.connected) {
            socket.connect();
        }


        socket.emit(
            "room:join",
            {
                roomCode: code,
                playerName: name
            }
        );

    }


    function handlePlay() {

        if (gameMode === "online") {

            if (
                onlineAction ===
                "create"
            ) {

                createOnlineRoom();

            }
            else {

                joinOnlineRoom();

            }

            return;

        }


        startLocalGame();

    }


    return (

        <>

            <div id="overlay"></div>

            <div
                id="startpop"
                className="popup"
            >

                <h1>
                    Welcome to The
                    <br />
                    ULTIMATE TIC TAC TOE
                </h1>


                <label>
                    Game Mode:
                </label>


                <div className="mode-options">

                    <button
                        type="button"
                        className={
                            gameMode === "pvp"
                                ? "mode-btn selected"
                                : "mode-btn"
                        }
                        onClick={() =>
                            setGameMode("pvp")
                        }
                    >
                        👥 Player vs Player
                    </button>


                    <button
                        type="button"
                        className={
                            gameMode === "bot"
                                ? "mode-btn selected"
                                : "mode-btn"
                        }
                        onClick={() =>
                            setGameMode("bot")
                        }
                    >
                        🤖 Player vs Bot
                    </button>


                    <button
                        type="button"
                        className={
                            gameMode === "online"
                                ? "mode-btn selected"
                                : "mode-btn"
                        }
                        onClick={() =>
                            setGameMode("online")
                        }
                    >
                        🌐 Online
                    </button>

                </div>


                {gameMode === "pvp" && (

                    <>

                        <label>
                            Player X Name:
                        </label>

                        <input
                            type="text"
                            id="playerXInput"
                            placeholder="Player X"
                            value={playerX}
                            onChange={e =>
                                setPlayerX(
                                    e.target.value
                                )
                            }
                        />


                        <label>
                            Player O Name:
                        </label>

                        <input
                            type="text"
                            id="playerOInput"
                            placeholder="Player O"
                            value={playerO}
                            onChange={e =>
                                setPlayerO(
                                    e.target.value
                                )
                            }
                        />

                    </>

                )}


                {gameMode === "online" && (

                    <>

                        <label>
                            Your Name:
                        </label>

                        <input
                            value={onlineName}
                            onChange={e =>
                                setOnlineName(
                                    e.target.value
                                )
                            }
                            placeholder="Your name"
                        />


                        <div className="mode-options">

                            <button
                                type="button"
                                className={
                                    onlineAction ===
                                    "create"
                                        ? "mode-btn selected"
                                        : "mode-btn"
                                }
                                onClick={() =>
                                    setOnlineAction(
                                        "create"
                                    )
                                }
                            >
                                Create Room
                            </button>


                            <button
                                type="button"
                                className={
                                    onlineAction ===
                                    "join"
                                        ? "mode-btn selected"
                                        : "mode-btn"
                                }
                                onClick={() =>
                                    setOnlineAction(
                                        "join"
                                    )
                                }
                            >
                                Join Room
                            </button>

                        </div>


                        {onlineAction ===
                            "join" && (

                            <>
                                <label>
                                    Room Code:
                                </label>

                                <input
                                    value={
                                        roomCode
                                    }
                                    onChange={e =>
                                        setRoomCode(
                                            e.target.value
                                        )
                                    }
                                    placeholder="ABC123"
                                    maxLength={6}
                                />
                            </>

                        )}

                    </>

                )}


                {gameMode === "bot" && (
                    <>
                        <label>Choose Your Player:</label>

                        <div className="mode-options">

                            <button
                                type="button"
                                className={
                                    playerSymbol === "x"
                                        ? "mode-btn selected"
                                        : "mode-btn"
                                }
                                onClick={() => setPlayerSymbol("x")}
                            >
                                Play as X
                            </button>

                            <button
                                type="button"
                                className={
                                    playerSymbol === "o"
                                        ? "mode-btn selected"
                                        : "mode-btn"
                                }
                                onClick={() => setPlayerSymbol("o")}
                            >
                                Play as O
                            </button>

                        </div>

                        <label>Bot Difficulty:</label>

                        <select
                            id="botDifficulty"
                            value={botDifficulty}
                            onChange={(e) =>
                                setBotDifficulty(e.target.value)
                            }
                        >
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>
                    </>
                )}


                {gameMode !== "online" && (

                    <>
                        <label>
                            Number of Games:
                        </label>

                        <input
                            type="number"
                            min="1"
                            max="5"
                            value={numGames}
                            onChange={e =>
                                setNumGames(
                                    e.target.value
                                )
                            }
                        />

                    </>

                )}


                <button
                    id="startBtn"
                    className="click"
                    onClick={handlePlay}
                >
                    {gameMode === "online"
                        ? onlineAction === "create"
                            ? "Create Room"
                            : "Join Room"
                        : "Play"}
                </button>

            </div>

        </>

    );

}

export default StartPopup;