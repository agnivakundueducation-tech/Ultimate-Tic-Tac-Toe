import React from 'react'
import ScoreBoard from "./ScoreBoard";

const Console = ({

    playerX,

    playerO,

    scoreX,

    scoreO,

    reset

}) => {
  return (
    <div id="consol">
        <div id="head"><img src="/Title.png" height="200px"/></div>
        <ScoreBoard
            playerX={playerX}
            playerO={playerO}
            scoreX={scoreX}
            scoreO={scoreO}
        />

        <button className="click" onClick={reset}> New Game </button>
    </div>
  )
}

export default Console