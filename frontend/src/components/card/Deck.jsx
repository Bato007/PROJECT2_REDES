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
    id: 18,
    name: 'Exploding Kitten',
    src: card18,
    quant: 4,
  },
  {
    id: 19,
    name: 'Defuse',
    src: card19,
    quant: 6,
  },
  {
    id: 22,
    name: 'See the future (3x)',
    src: card22,
    quant: 5,
  },
]

const Deck = ({ isStacked, addCardToPlayer }) => {
  const [deck, setDeck] = useState([])

  useEffect(() => {
    const tempDeck = []
    CARDS.map((card) => {
      for (let i = 0; i < card.quant; i += 1) {
        tempDeck.push({
          ...card,
          index: tempDeck.length,
        })
      }
      return tempDeck
    })
    // eslint-disable-next-line no-console
    console.log(tempDeck.length)
    // Double shuffle since cards are ordered
    setDeck(shuffle(shuffle([...tempDeck])))
  }, [])

  const onCardReveal = () => {
    const lastCard = deck.pop()
    addCardToPlayer(lastCard)
  }

  const moveCard = (dragCard, dropCard) => {
    const dragCardIndex = deck.findIndex((card) => card.index === dragCard.index)
    const dropCardIndex = deck.findIndex((card) => card.index === dropCard.index)

    const tempCard = deck[dragCardIndex]
    deck[dragCardIndex] = deck[dropCardIndex]
    deck[dropCardIndex] = tempCard

    setDeck([...deck])
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
        : deck.map((item) => (
          <Card
            key={`${item.name}-${item.index}`}
            moveCard={moveCard}
            card={item}
          />
        ))
    }
    </div>
  )
}

Deck.propTypes = {
  isStacked: PropTypes.bool,
  addCardToPlayer: PropTypes.func,
}

Deck.defaultProps = {
  isStacked: false,
  addCardToPlayer: () => {},
}

export default Deck
