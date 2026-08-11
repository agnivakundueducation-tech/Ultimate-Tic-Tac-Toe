function GuidePopup({ onClose }) {

    return (
        <>
            <div id="overlay"></div>

            <div id="guidepop" className="popup">

                <h1>How to Play</h1>

                <h3>🎯 Objective</h3>

                <p>
                    Win three small Tic-Tac-Toe boards in a row
                    to win the Ultimate Tic-Tac-Toe game.
                </p>

                <hr />

                <h3>🎮 Rules</h3>

                <ol>

                    <li>
                        Players take turns placing X and O.
                    </li>

                    <li>
                        Win a small board by making three in a row.
                    </li>

                    <li>
                        The cell you choose determines which
                        board your opponent must play in next.
                    </li>

                    <li>
                        If that board is already won or full,
                        your opponent may play in any unfinished board.
                    </li>

                    <li>
                        Win three small boards in a row to
                        win the match.
                    </li>

                </ol>

                <hr />

                <h3>💡 Tips</h3>

                <ul>

                    <li>
                        Don't just think about your current move.
                    </li>

                    <li>
                        Try to force your opponent into difficult boards.
                    </li>

                    <li>
                        Controlling the center boards gives more options.
                    </li>

                </ul>

                <button
                    id="guideBtn"
                    className="click"
                    onClick={onClose}
                >
                    Start Playing
                </button>

            </div>
        </>
    );

}

export default GuidePopup;