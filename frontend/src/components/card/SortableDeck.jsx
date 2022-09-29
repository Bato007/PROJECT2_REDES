import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import Card from './Card'
import SortableCard from './SortableCard'
import Button from '../button/Button'

const explodingCard = {
  id: 0,
  name: 'Exploding Kitten',
  src: 'https://storage.googleapis.com/assets_xkittens/18.jpeg',
}

const SortableDeck = ({ deckLength, sendNewPosition }) => {
  const [pos, setPos] = useState(0)
  const [deck, setDeck] = useState([])

  useEffect(() => {
    const array = Array(deckLength).fill(null).map((_, i) => i)
    setDeck(array.concat('exploding'))
  }, [deckLength])

  // eslint-disable-next-line no-console
  console.log('deck', deck, 'deckLength', deckLength)

  const moveCard = (dropCardIndex) => {
    const tempDeck = [...deck]
    const dragCardIndex = tempDeck.indexOf('exploding')

    const b = tempDeck[dragCardIndex]
    tempDeck[dragCardIndex] = tempDeck[dropCardIndex]
    tempDeck[dropCardIndex] = b

    // eslint-disable-next-line no-console
    console.log('dropCardIndex', dropCardIndex)

    setPos(dropCardIndex)
    setDeck([...tempDeck])
  }

  return (
    <>
      <h2 className="sorting-mark">On bottom</h2>
      {
        deck.map((item, index) => (
          item === 'exploding'
            ? <Card card={explodingCard} />
            : (
              <SortableCard
                moveCard={moveCard}
                index={index}
              />
            )
        ))
      }
      <h2 className="sorting-mark">On top</h2>
      <Button
        text="Save deck"
        classButton="secondary-button"
        onClick={() => sendNewPosition(pos)}
      />
    </>
  )
}

SortableDeck.propTypes = {
  deckLength: PropTypes.number.isRequired,
  sendNewPosition: PropTypes.func.isRequired,
}

export default SortableDeck
