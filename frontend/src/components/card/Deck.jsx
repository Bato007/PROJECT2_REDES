/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import Card from './Card'
import './deck.scss'

import card1 from '../../../assets/cards/1.jpeg'
import card2 from '../../../assets/cards/2.JPG'
import card3 from '../../../assets/cards/3.JPG'
import card4 from '../../../assets/cards/4.JPG'
import card6 from '../../../assets/cards/6.jpeg'
import card10 from '../../../assets/cards/10.jpeg'
import card13 from '../../../assets/cards/13.jpeg'
import card18 from '../../../assets/cards/18.jpeg'
import card19 from '../../../assets/cards/19.jpeg'
import card22 from '../../../assets/cards/22.jpeg'
import stackedDeck from '../../../assets/stacked-deck.png'

import shuffle from '../../Utils/shuffle'
import Button from '../button/Button'
import SortableCard from './SortableCard'

const CARDS = [
  {
    id: 1,
    name: 'Zombie Cat',
    src: card1,
    quant: 4,
  },
  {
    id: 2,
    name: 'Raindow-Ralphin Cat',
    src: card2,
    quant: 4,
  },
  {
    id: 3,
    name: 'Tacocat',
    src: card3,
    quant: 4,
  },
  {
    id: 4,
    name: 'Beard Cat',
    src: card4,
    quant: 4,
  },
  {
    id: 6,
    name: 'Shuffle',
    src: card6,
    quant: 4,
  },
  {
    id: 10,
    name: 'Attack (x2)',
    src: card10,
    quant: 4,
  },
  {
    id: 13,
    name: 'Skip',
    src: card13,
    quant: 4,
  },
  {
    id: 22,
    name: 'See the future (3x)',
    src: card22,
    quant: 5,
  },
]

const defuse = {
  id: 19,
  name: 'Defuse',
  src: card19,
  quant: 6,
}

const explodingKitten = {
  id: 18,
  name: 'Exploding Kitten',
  src: card18,
  quant: 4,
}

const Deck = ({
  isStacked,
  isSorting,
  addCardToPlayer,
  setInitialDeck,
  closeIsSorting,
  removeCardToPlayer,
}) => {
  const [deck, setDeck] = useState([])
  const [lastCard, setLastCard] = useState()
  const [tempDeck, setTempDeck] = useState([])

  useEffect(() => {
    const tempCards = []

    CARDS.map((card) => {
      for (let i = 0; i < card.quant; i += 1) {
        tempCards.push(card)
      }
      return tempCards
    })

    // Double shuffle since cards are ordered
    const shuffledDeck = shuffle(shuffle([...tempCards]))

    // Pick 6 random cards for the player
    const playerCards = []
    for (let i = 0; i < 7; i += 1) {
      const [card] = shuffledDeck.splice(Math.floor(Math.random() * shuffledDeck.length), 1)
      playerCards.push({
        ...card,
        index: `initial-deck-${playerCards.length}`,
      })
    }
    playerCards.push({
      ...defuse,
      index: `initial-deck-${playerCards.length}`,
    })
    setInitialDeck(playerCards)

    for (let i = 0; i < 2; i += 1) {
      shuffledDeck.push(defuse)
    }
    for (let i = 0; i < 3; i += 1) {
      shuffledDeck.push(explodingKitten)
    }
    for (let i = 0; i < shuffledDeck.length; i += 1) {
      shuffledDeck[i] = {
        ...shuffledDeck[i],
        index: i,
      }
    }
    // Double shuffle since cards are ordered
    const finalShuffle = shuffle(shuffle(shuffledDeck))
    setDeck(finalShuffle)
  }, [])

  useEffect(() => {
    if (isSorting) {
      setTempDeck([...deck, {
        ...lastCard,
        showFront: true,
      }])
    }
  }, [isSorting])

  const onCardReveal = () => {
    const card = deck.pop()
    setLastCard(card)
    addCardToPlayer(card)
  }

  const moveCard = (dragCard, dropCard) => {
    const dropCardIndex = tempDeck.findIndex((card) => card.index === dropCard.index)
    const dragCardIndex = tempDeck.findIndex((card) => card.index === dragCard.index)
    tempDeck.splice(dragCardIndex, 1)
    tempDeck.splice(dropCardIndex, 0, dragCard)

    setTempDeck([...tempDeck])
  }

  const saveTempDeck = () => {
    removeCardToPlayer(lastCard)
    setDeck([...tempDeck])
    closeIsSorting()
  }

  return (
    <div className={`${isStacked ? 'deck-stacked' : 'deck-show-all'}`}>
      {
      isStacked
        ? (
          <Button
            icon={[stackedDeck]}
            classButton="card"
            onClick={onCardReveal}
          />
        )
        : isSorting
          ? (
            <>
              <h2 className="sorting-mark">On bottom</h2>
              {tempDeck.map((item) => (
                <SortableCard
                  key={`${item.ID}`}
                  moveCard={moveCard}
                  card={item}
                />
              ))}
              <h2 className="sorting-mark">On top</h2>
              <Button
                text="Save deck"
                classButton="secondary-button"
                onClick={saveTempDeck}
              />
            </>
          )
          : deck.map((item) => (
            <Card
              key={`${item.ID}`}
              card={item}
            />
          ))
    }
    </div>
  )
}

Deck.propTypes = {
  isStacked: PropTypes.bool,
  isSorting: PropTypes.bool,
  addCardToPlayer: PropTypes.func,
  setInitialDeck: PropTypes.func,
  closeIsSorting: PropTypes.func,
  removeCardToPlayer: PropTypes.func,
}

Deck.defaultProps = {
  isStacked: false,
  isSorting: false,
  addCardToPlayer: () => {},
  setInitialDeck: () => {},
  closeIsSorting: () => {},
  removeCardToPlayer: () => {},
}

export default Deck
