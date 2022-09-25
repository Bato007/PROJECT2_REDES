import React from 'react'
import Deck from '../../components/card/Deck'
import './game.scss'

const Game = () => (
  <div className="game-screen">
    <Deck isStacked />
  </div>
)

export default Game
