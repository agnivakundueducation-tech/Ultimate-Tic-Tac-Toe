const winPattern = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];


// --------------------------------------------------
// Get all empty cells inside a small board
// --------------------------------------------------

function getEmptyCells(board) {

    const cells = [];

    for (let i = 0; i < board.length; i++) {

        if (board[i] === "") {
            cells.push(i);
        }

    }

    return cells;
}


// --------------------------------------------------
// Check whether a board has a winner
// --------------------------------------------------

function checkWin(board) {

    for (const pattern of winPattern) {

        const [a, b, c] = pattern;

        if (
            board[a] &&
            board[a] === board[b] &&
            board[a] === board[c]
        ) {

            return {
                winner: board[a],
                pattern
            };

        }

    }

    return null;
}


// --------------------------------------------------
// Check whether a board is full
// --------------------------------------------------

function isFull(board) {

    return board.every(cell => cell !== "");

}


// --------------------------------------------------
// Get all boards that the bot is allowed to play in
// --------------------------------------------------

function getPlayableBoards(bigBoard, mainBoard, activeBoard) {

    // If a specific board is forced
    if (
        activeBoard !== null &&
        mainBoard[activeBoard] === "" &&
        !isFull(bigBoard[activeBoard])
    ) {

        return [activeBoard];

    }


    // Otherwise bot can choose any unfinished board

    const boards = [];

    for (let i = 0; i < 9; i++) {

        if (
            mainBoard[i] === "" &&
            !isFull(bigBoard[i])
        ) {

            boards.push(i);

        }

    }

    return boards;
}


// --------------------------------------------------
// Get all legal moves
// --------------------------------------------------

function getLegalMoves(bigBoard, mainBoard, activeBoard) {

    const boards = getPlayableBoards(
        bigBoard,
        mainBoard,
        activeBoard
    );

    const moves = [];

    for (const blockIndex of boards) {

        const cells = getEmptyCells(
            bigBoard[blockIndex]
        );

        for (const cellIndex of cells) {

            moves.push({
                blockIndex,
                cellIndex
            });

        }

    }

    return moves;
}


// --------------------------------------------------
// Find a winning move inside a small board
// --------------------------------------------------

function findWinningMove(board, player) {

    const emptyCells = getEmptyCells(board);

    for (const cell of emptyCells) {

        const testBoard = [...board];

        testBoard[cell] = player;

        const result = checkWin(testBoard);

        if (result && result.winner === player) {
            return cell;
        }

    }

    return null;
}


// --------------------------------------------------
// Find a blocking move
// --------------------------------------------------

function findBlockingMove(board, opponent) {

    return findWinningMove(board, opponent);

}


// --------------------------------------------------
// Random move
// --------------------------------------------------

function randomMove(moves) {

    if (moves.length === 0) {
        return null;
    }

    const randomIndex =
        Math.floor(Math.random() * moves.length);

    return moves[randomIndex];
}


// --------------------------------------------------
// EASY BOT
// --------------------------------------------------

function easyBot(
    bigBoard,
    mainBoard,
    activeBoard
) {

    const moves = getLegalMoves(
        bigBoard,
        mainBoard,
        activeBoard
    );

    return randomMove(moves);
}


// --------------------------------------------------
// MEDIUM BOT
// --------------------------------------------------

function mediumBot(
    bigBoard,
    mainBoard,
    activeBoard,
    botPlayer = "o"
) {

    const opponent =
        botPlayer === "x"
            ? "o"
            : "x";

    const moves = getLegalMoves(
        bigBoard,
        mainBoard,
        activeBoard
    );

    if (moves.length === 0) {
        return null;
    }


    // ----------------------------------------------
    // 1. Try to win a small board
    // ----------------------------------------------

    for (const move of moves) {

        const board =
            bigBoard[move.blockIndex];

        const testBoard = [...board];

        testBoard[move.cellIndex] = botPlayer;

        const result = checkWin(testBoard);

        if (
            result &&
            result.winner === botPlayer
        ) {

            return move;

        }

    }


    // ----------------------------------------------
    // 2. Block opponent from winning small board
    // ----------------------------------------------

    for (const move of moves) {

        const board =
            bigBoard[move.blockIndex];

        const testBoard = [...board];

        testBoard[move.cellIndex] = opponent;

        const result = checkWin(testBoard);

        if (
            result &&
            result.winner === opponent
        ) {

            return move;

        }

    }


    // ----------------------------------------------
    // 3. Prefer center
    // ----------------------------------------------

    const centerMove = moves.find(
        move => move.cellIndex === 4
    );

    if (centerMove) {
        return centerMove;
    }


    // ----------------------------------------------
    // 4. Random legal move
    // ----------------------------------------------

    return randomMove(moves);
}


// --------------------------------------------------
// HARD BOT
// --------------------------------------------------

function hardBot(
    bigBoard,
    mainBoard,
    activeBoard,
    botPlayer = "o"
) {

    const opponent =
        botPlayer === "x"
            ? "o"
            : "x";

    const moves = getLegalMoves(
        bigBoard,
        mainBoard,
        activeBoard
    );

    if (moves.length === 0) {
        return null;
    }


    // ----------------------------------------------
    // 1. Can bot immediately win a small board?
    // ----------------------------------------------

    for (const move of moves) {

        const board =
            bigBoard[move.blockIndex];

        const testBoard = [...board];

        testBoard[move.cellIndex] = botPlayer;

        if (checkWin(testBoard)) {
            return move;
        }

    }


    // ----------------------------------------------
    // 2. Can opponent win a small board?
    // ----------------------------------------------

    for (const move of moves) {

        const board =
            bigBoard[move.blockIndex];

        const testBoard = [...board];

        testBoard[move.cellIndex] = opponent;

        if (checkWin(testBoard)) {
            return move;
        }

    }


    // ----------------------------------------------
    // 3. Prefer center board + center cell
    // ----------------------------------------------

    const centerMove = moves.find(
        move =>
            move.blockIndex === 4 &&
            move.cellIndex === 4
    );

    if (centerMove) {
        return centerMove;
    }


    // ----------------------------------------------
    // 4. Prefer center cell
    // ----------------------------------------------

    const centerCell = moves.find(
        move => move.cellIndex === 4
    );

    if (centerCell) {
        return centerCell;
    }


    // ----------------------------------------------
    // 5. Prefer corners
    // ----------------------------------------------

    const corners = [0, 2, 6, 8];

    const cornerMove = moves.find(
        move => corners.includes(move.cellIndex)
    );

    if (cornerMove) {
        return cornerMove;
    }


    // ----------------------------------------------
    // 6. Random legal move
    // ----------------------------------------------

    return randomMove(moves);
}


// --------------------------------------------------
// Main BOT function
// --------------------------------------------------

export function getBotMove(
    bigBoard,
    mainBoard,
    activeBoard,
    difficulty,
    botPlayer = "o"
) {

    if (difficulty === "easy") {

        return easyBot(
            bigBoard,
            mainBoard,
            activeBoard
        );

    }


    if (difficulty === "medium") {

        return mediumBot(
            bigBoard,
            mainBoard,
            activeBoard,
            botPlayer
        );

    }


    return hardBot(
        bigBoard,
        mainBoard,
        activeBoard,
        botPlayer
    );

}