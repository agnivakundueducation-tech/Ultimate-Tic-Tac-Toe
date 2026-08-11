function ScoreBoard({

    playerX,

    playerO,

    scoreX,

    scoreO,

    reset

}) {

    return (

        <div id="scoreboard">

            <div className="player x">

                <h2>{playerX}</h2>

                <div className="score">

                    {scoreX}

                </div>

            </div>

            

            <div className="player o">

                <h2>{playerO}</h2>

                <div className="score">

                    {scoreO}

                </div>

            </div>

        </div>

    );

}

export default ScoreBoard;