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
// Apply a move to (copies of) the board state and
// work out which board the *next* player must play in
// --------------------------------------------------

function applyMove(bigBoard, mainBoard, move, player) {

    const newBigBoard = bigBoard.map((board, i) =>
        i === move.blockIndex ? [...board] : board
    );

    newBigBoard[move.blockIndex][move.cellIndex] = player;

    let newMainBoard = mainBoard;

    const result = checkWin(newBigBoard[move.blockIndex]);

    if (result) {
        newMainBoard = [...mainBoard];
        newMainBoard[move.blockIndex] = result.winner;
    }

    const nextActiveBoard = getNextActiveBoard(
        newMainBoard,
        newBigBoard,
        move.cellIndex
    );

    return {
        bigBoard: newBigBoard,
        mainBoard: newMainBoard,
        nextActiveBoard
    };
}


function getNextActiveBoard(mainBoard, bigBoard, cellIndex) {

    if (
        mainBoard[cellIndex] === "" &&
        !isFull(bigBoard[cellIndex])
    ) {
        return cellIndex;
    }

    return null; // opponent gets a free choice of board

}


// --------------------------------------------------
// Does the given player have an immediate winning
// move available in any board they're allowed to play?
// --------------------------------------------------

function opponentHasImmediateWin(bigBoard, mainBoard, activeBoard, opponent) {

    const boards = getPlayableBoards(bigBoard, mainBoard, activeBoard);

    for (const blockIndex of boards) {

        if (findWinningMove(bigBoard[blockIndex], opponent) !== null) {
            return true;
        }

    }

    return false;
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
// Same fast heuristics as before, but now also avoids
// handing the opponent a free win on their next turn.
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
    // 3. Don't hand the opponent a free win next turn
    // ----------------------------------------------

    const safeMoves = moves.filter(move => {

        const { bigBoard: nb, mainBoard: nm, nextActiveBoard } =
            applyMove(bigBoard, mainBoard, move, botPlayer);

        return !opponentHasImmediateWin(nb, nm, nextActiveBoard, opponent);

    });

    const candidates = safeMoves.length > 0 ? safeMoves : moves;


    // ----------------------------------------------
    // 4. Prefer center among safe candidates
    // ----------------------------------------------

    const centerMove = candidates.find(
        move => move.cellIndex === 4
    );

    if (centerMove) {
        return centerMove;
    }


    // ----------------------------------------------
    // 5. Random among safe candidates
    // ----------------------------------------------

    return randomMove(candidates);
}


// --------------------------------------------------
// HARD BOT — minimax with alpha-beta pruning and
// iterative deepening over the whole ultimate board
// --------------------------------------------------

const BOARD_WEIGHT = [3, 2, 3, 2, 4, 2, 3, 2, 3]; // center > corners > edges
const LINE_SCORE = { 1: 1, 2: 12 };                // reward near-complete lines
const SEARCH_TIME_MS = 450;                        // time budget per move
const MAX_DEPTH = 8;                               // hard cap on search depth


function evaluateSmallBoard(board, botPlayer, opponent) {

    let score = 0;

    for (const [a, b, c] of winPattern) {

        const line = [board[a], board[b], board[c]];

        const botCount = line.filter(v => v === botPlayer).length;
        const oppCount = line.filter(v => v === opponent).length;

        if (botCount > 0 && oppCount > 0) continue; // line is dead

        if (botCount > 0) score += LINE_SCORE[botCount] || 0;
        else if (oppCount > 0) score -= LINE_SCORE[oppCount] || 0;

    }

    if (board[4] === botPlayer) score += 3;
    else if (board[4] === opponent) score -= 3;

    return score;
}


function evaluateMetaBoard(mainBoard, bigBoard, botPlayer, opponent) {

    const status = mainBoard.map((cell, i) => {
        if (cell === "x" || cell === "o") return cell;
        if (isFull(bigBoard[i])) return "draw";
        return "";
    });

    let score = 0;

    for (const [a, b, c] of winPattern) {

        const line = [status[a], status[b], status[c]];

        if (line.includes("draw")) continue; // line can never be completed

        const botCount = line.filter(v => v === botPlayer).length;
        const oppCount = line.filter(v => v === opponent).length;

        if (botCount > 0 && oppCount > 0) continue;

        if (botCount > 0) score += (LINE_SCORE[botCount] || 0) * 15;
        else if (oppCount > 0) score -= (LINE_SCORE[oppCount] || 0) * 15;

    }

    return score;
}


function evaluatePosition(bigBoard, mainBoard, botPlayer, opponent) {

    let score = evaluateMetaBoard(mainBoard, bigBoard, botPlayer, opponent);

    for (let i = 0; i < 9; i++) {

        if (mainBoard[i] === botPlayer) {
            score += BOARD_WEIGHT[i] * 25;
        } else if (mainBoard[i] === opponent) {
            score -= BOARD_WEIGHT[i] * 25;
        } else if (!isFull(bigBoard[i])) {
            score += BOARD_WEIGHT[i] * evaluateSmallBoard(bigBoard[i], botPlayer, opponent);
        }

    }

    return score;
}


function minimax(
    bigBoard,
    mainBoard,
    activeBoard,
    depth,
    alpha,
    beta,
    maximizing,
    botPlayer,
    opponent,
    deadline
) {

    const bigResult = checkWin(mainBoard);

    if (bigResult) {
        return bigResult.winner === botPlayer
            ? 1000000 + depth
            : -1000000 - depth;
    }

    const moves = getLegalMoves(bigBoard, mainBoard, activeBoard);

    if (moves.length === 0) {
        return 0; // overall draw, no boards left to play
    }

    if (depth === 0 || Date.now() > deadline) {
        return evaluatePosition(bigBoard, mainBoard, botPlayer, opponent);
    }

    if (maximizing) {

        let best = -Infinity;

        for (const move of moves) {

            const { bigBoard: nb, mainBoard: nm, nextActiveBoard } =
                applyMove(bigBoard, mainBoard, move, botPlayer);

            const score = minimax(
                nb, nm, nextActiveBoard,
                depth - 1, alpha, beta, false,
                botPlayer, opponent, deadline
            );

            if (score > best) best = score;
            if (score > alpha) alpha = score;
            if (beta <= alpha) break;
            if (Date.now() > deadline) break;

        }

        return best;

    }

    let best = Infinity;

    for (const move of moves) {

        const { bigBoard: nb, mainBoard: nm, nextActiveBoard } =
            applyMove(bigBoard, mainBoard, move, opponent);

        const score = minimax(
            nb, nm, nextActiveBoard,
            depth - 1, alpha, beta, true,
            botPlayer, opponent, deadline
        );

        if (score < best) best = score;
        if (score < beta) beta = score;
        if (beta <= alpha) break;
        if (Date.now() > deadline) break;

    }

    return best;
}


function findBestMove(bigBoard, mainBoard, activeBoard, botPlayer, opponent) {

    const moves = getLegalMoves(bigBoard, mainBoard, activeBoard);

    if (moves.length === 0) return null;
    if (moves.length === 1) return moves[0];

    const deadline = Date.now() + SEARCH_TIME_MS;

    let orderedMoves = moves;
    let bestMove = moves[0];

    for (let depth = 1; depth <= MAX_DEPTH; depth++) {

        if (Date.now() > deadline) break;

        let currentBest = null;
        let currentBestScore = -Infinity;
        let alpha = -Infinity;
        const beta = Infinity;

        const scored = [];

        for (const move of orderedMoves) {

            if (Date.now() > deadline) break;

            const { bigBoard: nb, mainBoard: nm, nextActiveBoard } =
                applyMove(bigBoard, mainBoard, move, botPlayer);

            const score = minimax(
                nb, nm, nextActiveBoard,
                depth - 1, alpha, beta, false,
                botPlayer, opponent, deadline
            );

            scored.push({ move, score });

            if (score > currentBestScore) {
                currentBestScore = score;
                currentBest = move;
            }

            if (score > alpha) alpha = score;

        }

        // Only trust this depth's result if we finished evaluating
        // every candidate move at that depth
        if (scored.length === orderedMoves.length) {

            scored.sort((a, b) => b.score - a.score);
            orderedMoves = scored.map(s => s.move);
            bestMove = currentBest;

            // Found a forced win — no need to search deeper
            if (currentBestScore >= 1000000) break;

        }

    }

    return bestMove;
}


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

    return findBestMove(
        bigBoard,
        mainBoard,
        activeBoard,
        botPlayer,
        opponent
    );

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