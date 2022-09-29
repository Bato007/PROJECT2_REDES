/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import Card from './Card'
import './deck.scss'
import stackedDeck from '../../../assets/stacked-deck.png'

import Button from '../button/Button'
import SortableCard from './SortableCard'

const Deck = ({
  isStacked,
  isSorting,
  addCardToPlayer,
  closeIsSorting,
  removeCardToPlayer,
}) => {
  const [deck, setDeck] = useState([])
  const [lastCard, setLastCard] = useState()
  const [tempDeck, setTempDeck] = useState([])

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
  closeIsSorting: PropTypes.func,
  removeCardToPlayer: PropTypes.func,
}

Deck.defaultProps = {
  isStacked: false,
  isSorting: false,
  addCardToPlayer: () => {},
  closeIsSorting: () => {},
  removeCardToPlayer: () => {},
}

export default Deck
