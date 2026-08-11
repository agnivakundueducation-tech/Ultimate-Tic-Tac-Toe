import Blank from "../assets/Blank.png";
import Cross from "../assets/Cross.png";
import Circle from "../assets/Circle.png";

function Cell({
    value,
    cellIndex,
    blockIndex,
    gameActive,
    cellClick
}) {

    let className = "cell";

    if (gameActive && value === "x") {
        className += " flipped-x";
    }

    if (gameActive && value === "o") {
        className += " flipped-o";
    }

    return (
        <div
            className={className}
            data-index={cellIndex}
            onClick={() => cellClick(blockIndex, cellIndex)}
        >

            <div className="card blank">

                <img
                    src={Blank}
                    height="40"
                    alt=""
                />

            </div>

            <div className="card cross">

                <img
                    src={Cross}
                    height="40"
                    alt=""
                />

            </div>

            <div className="card circle">

                <img
                    src={Circle}
                    height="40"
                    alt=""
                />

            </div>

        </div>
    );
}

export default Cell;