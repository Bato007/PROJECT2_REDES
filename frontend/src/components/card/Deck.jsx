import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Card from './Card'
import './deck.scss'

import card1 from '../../../assets/cards/1.jpeg'
import card2 from '../../../assets/cards/2.JPG'
import card3 from '../../../assets/cards/3.JPG'
import card4 from '../../../assets/cards/4.JPG'
import card5 from '../../../assets/cards/5.jpeg'
import card6 from '../../../assets/cards/6.jpeg'
import card7 from '../../../assets/cards/7.jpeg'
import card8 from '../../../assets/cards/8.jpeg'
import card9 from '../../../assets/cards/9.jpeg'
import card10 from '../../../assets/cards/10.jpeg'
import card11 from '../../../assets/cards/11.jpeg'
import card12 from '../../../assets/cards/12.jpeg'
import card13 from '../../../assets/cards/13.jpeg'
import card14 from '../../../assets/cards/14.jpeg'
import card15 from '../../../assets/cards/15.jpeg'
import card16 from '../../../assets/cards/16.jpeg'
import card17 from '../../../assets/cards/17.jpeg'
import card18 from '../../../assets/cards/18.jpeg'
import card19 from '../../../assets/cards/19.jpeg'
import card20 from '../../../assets/cards/20.jpeg'
import card21 from '../../../assets/cards/21.jpeg'
import card22 from '../../../assets/cards/22.jpeg'
import card23 from '../../../assets/cards/23.jpeg'
import card24 from '../../../assets/cards/24.jpeg'
import card25 from '../../../assets/cards/25.jpeg'
import card26 from '../../../assets/cards/26.jpeg'

import shuffle from '../../Utils/shuffle'

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
    id: 5,
    name: 'Feral Cat',
    src: card5,
    quant: 6,
  },
  {
    id: 6,
    name: 'Shuffle',
    src: card6,
    quant: 5,
  },
  {
    id: 7,
    name: 'Garbage Collection',
    src: card7,
    quant: 2,
  },
  {
    id: 8,
    name: 'Swap Top and Bottom',
    src: card8,
    quant: 3,
  },
  {
    id: 9,
    name: 'Draw from the bottom',
    src: card9,
    quant: 3,
  },
  {
    id: 10,
    name: 'Attack (x2)',
    src: card10,
    quant: 6,
  },
  {
    id: 11,
    name: 'Personal Attack (x3)',
    src: card11,
    quant: 4,
  },
  {
    id: 12,
    name: 'Targeted Attack (x2)',
    src: card12,
    quant: 4,
  },
  {
    id: 13,
    name: 'Skip',
    src: card13,
    quant: 5,
  },
  {
    id: 14,
    name: 'Super skip',
    src: card14,
    quant: 2,
  },
  {
    id: 15,
    name: 'Reverse',
    src: card15,
    quant: 5,
  },
  {
    id: 16,
    name: 'Catomic Bomb',
    src: card16,
    quant: 1,
  },
  {
    id: 17,
    name: 'Bury',
    src: card17,
    quant: 4,
  },
  {
    id: 18,
    name: 'Exploding Kitten',
    src: card18,
    quant: 6,
  },
  {
    id: 19,
    name: 'Defuse',
    src: card19,
    quant: 8,
  },
  {
    id: 20,
    name: 'Imploding Kitten',
    src: card20,
    quant: 4,
  },
  {
    id: 21,
    name: 'Streaking Kitten',
    src: card21,
    quant: 1,
  },
  {
    id: 22,
    name: 'See the future (3x)',
    src: card22,
    quant: 6,
  },
  {
    id: 23,
    name: 'See the future (5x)',
    src: card23,
    quant: 3,
  },
  {
    id: 24,
    name: 'Alter the future (3x)',
    src: card24,
    quant: 3,
  },
  {
    id: 25,
    name: 'Alter the future (3x) NOW',
    src: card25,
    quant: 2,
  },
  {
    id: 26,
    name: 'Mark',
    src: card26,
    quant: 4,
  },
]

const Deck = ({ isStacked }) => {
  const [deck, setDeck] = useState([])

  useEffect(() => {
    const tempDeck = []
    CARDS.map((card) => {
      for (let i = 0; i < card.quant; i += 1) {
        tempDeck.push(card)
      }
      return tempDeck
    })
    // eslint-disable-next-line no-console
    console.log(tempDeck.length)
    // Double shuffle since cards are ordered
    setDeck(shuffle(shuffle(tempDeck)))
  }, [])

  return (
    <div className={`${isStacked ? 'deck-stacked' : 'deck-show-all'}`}>
      {
        isStacked
          ? (
            <Card
              card={deck[deck.length - 1]}
            />
          )
          : deck.map((item, index) => (
            <Card
            // eslint-disable-next-line react/no-array-index-key
              key={`${item.name}${index}`}
              cardSrc={item.src}
              card={item}
            />
          ))
      }
    </div>
  )
}

Deck.propTypes = {
  isStacked: PropTypes.bool,
}

Deck.defaultProps = {
  isStacked: false,
}

export default Deck
