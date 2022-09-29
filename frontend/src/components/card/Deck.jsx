import React from 'react'
import PropTypes from 'prop-types'

import './deck.scss'
import stackedDeck from '../../../assets/stacked-deck.png'

import Button from '../button/Button'
import SortableDeck from './SortableDeck'

const Deck = ({
  isStacked,
  addCardToPlayer,
  closeIsSorting,
  deckLength,
}) => (
  <div className={`${isStacked ? 'deck-stacked' : 'deck-show-all'}`}>
    {
      isStacked
        ? (
          <Button
            icon={[stackedDeck]}
            classButton="card"
            onClick={() => addCardToPlayer()}
          />
        )
        : (
          <SortableDeck deckLength={deckLength} sendNewPosition={closeIsSorting} />
        )
    }
  </div>
)

Deck.propTypes = {
  isStacked: PropTypes.bool,
  addCardToPlayer: PropTypes.func,
  closeIsSorting: PropTypes.func,
  deckLength: PropTypes.number,
}

Deck.defaultProps = {
  isStacked: false,
  addCardToPlayer: () => {},
  closeIsSorting: () => {},
  deckLength: 0,
}

export default Deck
