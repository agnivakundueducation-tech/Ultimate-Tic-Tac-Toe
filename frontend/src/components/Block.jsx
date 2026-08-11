import Cell from "./Cell";
import Cross from "../assets/Cross.png";
import Circle from "../assets/Circle.png";

function Block({
    board,
    blockIndex,
    winner,
    active,
    gameActive,
    cellClick
}) {

    let className = "block";

    if (active && gameActive) {
        className += " active";
    }

    if (winner === "x") {
        className += " won-x";
    }

    if (winner === "o") {
        className += " won-o";
    }

    return (
        <div
            className={className}
            data-index={blockIndex}
            style={{
                backgroundImage:
                    winner === "x"
                        ? `url(${Cross})`
                        : winner === "o"
                        ? `url(${Circle})`
                        : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat"
            }}

        >

            {board.map((value, cellIndex) => (

                <Cell
                    key={cellIndex}
                    value={value}
                    cellIndex={cellIndex}
                    blockIndex={blockIndex}
                    gameActive={gameActive}
                    cellClick={cellClick}
                />

            ))}

        </div>
    );
}

export default Block;