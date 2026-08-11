function GameInfo({
    current,
    winner,
    gameActive,
    playerX,
    playerO
}) {

    let message = "";

    const currentPlayer =
        current === "x"
            ? playerX
            : playerO;

    const winnerPlayer =
        winner === "x"
            ? playerX
            : playerO;


    if (!gameActive) {

        if (winner) {

            message = winnerPlayer === "You"
                ? "You Win the Game!"
                : `${winnerPlayer} Wins the Game!`;

        }
        else {

            message = "It's a Draw!";

        }

    }
    else {

        message = currentPlayer === "You"
            ? "Your Turn"
            : `${currentPlayer}'s Turn`;

    }


    return (

        <div id="gameinfo">

            {message}

        </div>

    );

}

export default GameInfo;