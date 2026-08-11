import { useState, useEffect } from "react";
import Board from "./Board";
import GameInfo from "./GameInfo";
import Console from "./Console";

//import { getBotMove } from "../utils/Bot_1";
import { getBotMove } from "../utils/Bot_2";

import { socket } from "../socket";

function Game({
    playerX,
    playerO,
    numGames,
    gameMode,
    botDifficulty,
    playerSymbol
}) {

    const [bigBoard, setBigBoard] = useState([]);
    const [mainBoard, setMainBoard] = useState([]);

    const [scoreX, setScoreX] = useState(0);
    const [scoreO, setScoreO] = useState(0);

    const [startingPlayer, setStartingPlayer] = useState("x");
    const [current, setCurrent] = useState("x");

    const [gameActive, setGameActive] = useState(true);
    const [activeBoard, setActiveBoard] = useState(null);

    const [winner, setWinner] = useState(null);

    const [winningPattern, setWinningPattern] = useState([]);

    const winPattern = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    ];


    const botSymbol =
    playerSymbol === "x"
        ? "o"
        : "x";


    // Show "You" instead of the local
    // player's own name in online games
    const displayPlayerX =
        gameMode === "online" &&
        playerSymbol === "x"
            ? "You"
            : playerX;

    const displayPlayerO =
        gameMode === "online" &&
        playerSymbol === "o"
            ? "You"
            : playerO;


    // Begin The board — (re)initialize whenever a fresh
    // match actually starts (gameMode changes), so the
    // freshly-chosen playerSymbol is respected, not the
    // stale value from the very first mount.
    useEffect(() => {
        initGame();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gameMode]);


    // Bot reacting to the game
    useEffect(() => {
        if (
            gameMode === "bot" &&
            current === botSymbol  &&
            gameActive
        ) {

            // Setting Bot delay
            let minDelay = 500;
            let maxDelay = 2000;

            if (botDifficulty === "easy") {
                minDelay = 500;
                maxDelay = 1000;
            }
            else if (botDifficulty === "medium") {
                minDelay = 900;
                maxDelay = 1600;
            }
            else {
                minDelay = 1200;
                maxDelay = 2200;
            }

            const delay =
                Math.floor(
                    Math.random() * (maxDelay - minDelay + 1)
                ) + minDelay;
                
            
            const timer = setTimeout(() => {

                const move = getBotMove(
                    bigBoard,
                    mainBoard,
                    activeBoard,
                    botDifficulty,
                    botSymbol 
                );

                if (move) {

                    cellClick(
                        move.blockIndex,
                        move.cellIndex, 
                        true
                    );

                }

            }, delay);

            return () => clearTimeout(timer);

        }

    }, [
        current,
        gameActive,
        bigBoard,
        mainBoard,
        activeBoard,
        gameMode,
        botDifficulty,
        playerSymbol
    ]);

    // Online acces
    useEffect(() => {

        if (gameMode !== "online") {
            return;
        }


        function handleGameState(data) {

            const game =
                data.room.game;


            setBigBoard(
                game.bigBoard
            );

            setMainBoard(
                game.mainBoard
            );

            setCurrent(
                game.current
            );

            setActiveBoard(
                game.activeBoard
            );

            setWinner(
                game.winner
            );

            setWinningPattern(
                game.winningPattern
            );

            setGameActive(
                game.gameActive
            );

        }


        socket.on(
            "game:state",
            handleGameState
        );


        return () => {

            socket.off(
                "game:state",
                handleGameState
            );

        };

    }, [gameMode]);


    function initGame() {

        setBigBoard(
            Array(9)
                .fill(null)
                .map(() => Array(9).fill(""))
        );

        setMainBoard(Array(9).fill(""));

        setGameActive(true);

        // X always starts the game
        setCurrent("x");

        setActiveBoard(null);

        setWinner(null);

        setWinningPattern([]);
    }

    function checkWin(board){

        for(let pattern of winPattern){

            const [a,b,c] = pattern;

            if(
                board[a] &&
                board[a]===board[b] &&
                board[a]===board[c]
            ){

                return {
                    winner: board[a],
                    pattern
                };

            }

        }

        return null;

    }

    function checkDraw(board){

        return board.every(cell=>cell!=='');

    }

    function cellClick(blockIndex, cellIndex, isBotMove = false){

        if (!gameActive) return;

        if (
            gameMode === "bot" &&
            current === botSymbol  &&
            !isBotMove
        ) {
            return;
        }

        if (gameMode === "online") {

            if (current !== playerSymbol) {
                return;
            }

            socket.emit("game:move", {
                blockIndex,
                cellIndex
            });

            return;
        }

        if (
            activeBoard !== null &&
            activeBoard !== blockIndex
        ) {
            return;
        }

        if(activeBoard !== null && activeBoard !== blockIndex) return;

        if(bigBoard[blockIndex][cellIndex] !== "") return;

        const newBigBoard = bigBoard.map(board => [...board]);
        const newMainBoard = [...mainBoard];

        newBigBoard[blockIndex][cellIndex] = current;

        const smallWinner = checkWin(newBigBoard[blockIndex]);

        if(smallWinner && newMainBoard[blockIndex] === ""){

            newMainBoard[blockIndex] = smallWinner.winner;

        }
        else if(checkDraw(newBigBoard[blockIndex])){

            newMainBoard[blockIndex] = "draw";

        }

        const bigWinner = checkWin(newMainBoard);

        if(bigWinner){

            setBigBoard(newBigBoard);
            setMainBoard(newMainBoard);

            setWinner(bigWinner.winner);
            setWinningPattern(bigWinner.pattern);

            setGameActive(false);

            if(bigWinner.winner === "x"){

                setScoreX(prev => prev + 1);

            }
            else{

                setScoreO(prev => prev + 1);

            }

            return;

        }

        if(checkDraw(newMainBoard)){

            setBigBoard(newBigBoard);
            setMainBoard(newMainBoard);

            setWinner(null);

            setGameActive(false);

            return;

        }

        let nextBoard = cellIndex;

        if(
            newMainBoard[nextBoard] !== "" ||
            checkDraw(newBigBoard[nextBoard])
        ){

            nextBoard = null;

        }

        setBigBoard(newBigBoard);

        setMainBoard(newMainBoard);

        setActiveBoard(nextBoard);

        setCurrent(current === "x" ? "o" : "x");

    }

    function reset() {

        if (gameMode === "online") {

            socket.emit("game:reset");

            return;
        }

        const nextPlayer =
            gameMode === "bot"
                ? "x"
                : startingPlayer === "x"
                    ? "o"
                    : "x";

        if (gameMode === "pvp") {
            setStartingPlayer(nextPlayer);
        }

        setCurrent(nextPlayer);

        setBigBoard(
            Array(9)
                .fill(null)
                .map(() => Array(9).fill(""))
        );

        setMainBoard(Array(9).fill(""));

        setGameActive(true);

        setActiveBoard(null);

        setWinner(null);

        setWinningPattern([]);
    }

    return(
        <>
        <div
            id="gamearea"
            style={{
                background:
                    current === "x"
                    ? "#ff8080"
                    : "#b3ffb3"
            }}
        >

            <GameInfo
                current={current}
                winner={winner}
                gameActive={gameActive}
                playerX={displayPlayerX}
                playerO={displayPlayerO}
                gameMode={gameMode}
                playerSymbol={playerSymbol}
            />

            <Board
                bigBoard={bigBoard}
                mainBoard={mainBoard}
                activeBoard={activeBoard}
                winningPattern={winningPattern}
                gameActive={gameActive}
                cellClick={cellClick}
            />

        </div>

        <Console
            playerX={displayPlayerX}
            playerO={displayPlayerO}
            scoreX={scoreX}
            scoreO={scoreO}
            reset={reset}
        />
        </>
    );

}

export default Game;