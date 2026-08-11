function OnlineLobby({
    roomCode,
    playerSymbol,
    onCancel
}) {

    return (

        <>
            <div id="overlay"></div>

            <div
                className="popup"
                id="onlineLobby"
            >

                <h1>
                    Waiting for Player
                </h1>

                <p>
                    Share this room code:
                </p>

                <div className="room-code">
                    {roomCode}
                </div>

                <p>
                    You are:
                    <strong>
                        {" "}
                        {playerSymbol?.toUpperCase()}
                    </strong>
                </p>

                <p>
                    ⏳ Waiting for another
                    player...
                </p>

                <button
                    className="click"
                    onClick={onCancel}
                >
                    Cancel
                </button>

            </div>
        </>

    );

}

export default OnlineLobby;