import React, { useState } from 'react'
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
    <div className="game-screen">
      <Deck isStacked addCardToPlayer={addCardToPlayer} />
      <Player cards={playerCards} />
    </div>
  )
}

export default Game
