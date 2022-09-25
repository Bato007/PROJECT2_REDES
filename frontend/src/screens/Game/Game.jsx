import React, { useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import Deck from '../../components/card/Deck'
import Player from '../../components/player/Player'
import './game.scss'

const Game = () => {
  const [playerCards, setPlayerCards] = useState([])

  const addCardToPlayer = (card) => {
    playerCards.push(card)
    setPlayerCards([...playerCards])
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="game-screen">
        <Deck isStacked addCardToPlayer={addCardToPlayer} />
        <Player cards={playerCards} />
      </div>
    </DndProvider>
  )
}

export default Game
