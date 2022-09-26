import React, { useState } from 'react'
import { useDrop } from 'react-dnd'
import Card from '../../components/card/Card'
import CardsPlaceholder from '../../components/card/CardPlaceholder'

import Deck from '../../components/card/Deck'
import Player from '../../components/player/Player'
import './game.scss'

const Game = () => {
  const [playerCards, setPlayerCards] = useState([])
  const [discardPile, setDiscardPile] = useState([])

  const [, dropRef] = useDrop({
    accept: 'CARD',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    drop: (item) => {
      const removeCard = playerCards.findIndex((card) => card.index === item.index)
      playerCards.splice(removeCard, 1)

      discardPile.push(item)
      setDiscardPile([...discardPile])
      setPlayerCards([...playerCards])
    },
  })

  const addCardToPlayer = (card) => {
    playerCards.push(card)
    setPlayerCards([...playerCards])
  }

  const setInitialDeck = (initialDeck) => {
    setPlayerCards(initialDeck)
  }

  return (
    <div className="game-screen">
      <div className="decks-container">
        <CardsPlaceholder cardsLength={7} isRow />
        <div className="center-container">
          <CardsPlaceholder cardsLength={7} />
          <div className="centered-deck">
            <Deck
              isStacked
              addCardToPlayer={addCardToPlayer}
              setInitialDeck={setInitialDeck}
            />
            <div className="discard-pile" ref={dropRef}>
              {
          discardPile.length > 0
            ? (
              <Card
                card={discardPile.at(-1)}
              />
            )
            : <div className="empty-pile" />
              }
            </div>
          </div>
          <CardsPlaceholder cardsLength={7} />
        </div>
      </div>
      <Player cards={playerCards} />
    </div>
  )
}

export default Game
