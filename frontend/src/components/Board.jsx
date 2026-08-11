import Block from "./Block";

function Board({
    bigBoard,
    mainBoard,
    activeBoard,
    winningPattern,
    gameActive,
    cellClick
}) {

    return (

        <div id="game">

            <div id="board">

                {bigBoard.map((board, index) => (

                    <Block
                        key={index}
                        board={board}
                        blockIndex={index}
                        winner={
                            gameActive
                                ? mainBoard[index]
                                : winningPattern.includes(index)
                                    ? mainBoard[index]
                                    : ""
                        }
                        active={
                            activeBoard === null
                                ? mainBoard[index] === ""
                                : activeBoard === index
                        }
                        gameActive={gameActive}
                        cellClick={cellClick}
                    />

                ))}

            </div>

        </div>

    );

}

export default Board;