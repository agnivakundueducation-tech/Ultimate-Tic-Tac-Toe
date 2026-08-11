const WIN_PATTERNS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

export function createEmptyGame() {
    return {
        bigBoard: Array(9)
            .fill(null)
            .map(() => Array(9).fill("")),

        mainBoard: Array(9).fill(""),

        current: "x",

        activeBoard: null,

        winner: null,

        winningPattern: [],

        gameActive: false
    };
}


export function checkWin(board) {

    for (const pattern of WIN_PATTERNS) {

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


export function isFull(board) {

    return board.every(
        cell => cell !== ""
    );

}


export function makeMove(game, blockIndex, cellIndex, player) {

    if (!game.gameActive) {

        return {
            success: false,
            message: "Game is not active"
        };

    }


    if (game.current !== player) {

        return {
            success: false,
            message: "Not your turn"
        };

    }


    if (
        game.activeBoard !== null &&
        game.activeBoard !== blockIndex
    ) {

        return {
            success: false,
            message: "You must play in the active board"
        };

    }


    if (
        blockIndex < 0 ||
        blockIndex > 8 ||
        cellIndex < 0 ||
        cellIndex > 8
    ) {

        return {
            success: false,
            message: "Invalid move"
        };

    }


    if (
        game.bigBoard[blockIndex][cellIndex] !== ""
    ) {

        return {
            success: false,
            message: "Cell already occupied"
        };

    }


    // --------------------------------
    // PLACE MOVE
    // --------------------------------

    game.bigBoard[blockIndex][cellIndex] = player;


    // --------------------------------
    // CHECK SMALL BOARD
    // --------------------------------

    const smallWinner =
        checkWin(game.bigBoard[blockIndex]);


    if (
        smallWinner &&
        game.mainBoard[blockIndex] === ""
    ) {

        game.mainBoard[blockIndex] =
            smallWinner.winner;

    }
    else if (
        isFull(game.bigBoard[blockIndex]) &&
        game.mainBoard[blockIndex] === ""
    ) {

        game.mainBoard[blockIndex] = "draw";

    }


    // --------------------------------
    // CHECK BIG BOARD
    // --------------------------------

    const bigWinner =
        checkWin(game.mainBoard);


    if (bigWinner) {

        game.winner =
            bigWinner.winner;

        game.winningPattern =
            bigWinner.pattern;

        game.gameActive = false;

        return {
            success: true,
            finished: true
        };

    }


    // --------------------------------
    // CHECK DRAW
    // --------------------------------

    if (isFull(game.mainBoard)) {

        game.winner = null;

        game.winningPattern = [];

        game.gameActive = false;

        return {
            success: true,
            finished: true
        };

    }


    // --------------------------------
    // NEXT BOARD
    // --------------------------------

    let nextBoard = cellIndex;


    if (
        game.mainBoard[nextBoard] !== "" ||
        isFull(game.bigBoard[nextBoard])
    ) {

        nextBoard = null;

    }


    game.activeBoard = nextBoard;


    // --------------------------------
    // NEXT PLAYER
    // --------------------------------

    game.current =
        player === "x"
            ? "o"
            : "x";


    return {
        success: true,
        finished: false
    };

}