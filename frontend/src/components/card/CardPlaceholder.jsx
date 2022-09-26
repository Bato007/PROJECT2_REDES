import React from 'react'
import PropTypes from 'prop-types'
import Button from '../button/Button'
import cardBack from '../../../assets/back-card.jpeg'
import './deck.scss'

const CardsPlaceholder = ({ cardsLength, isRow, isInTurn }) => (
  <div className={`card-placeholder-container ${isRow ? 'row' : 'column'} ${isInTurn ? 'isInTurn' : ''}`}>
    {
        Array(cardsLength).fill(null).map(() => (
          <Button
            icon={[cardBack]}
            classButton="card"
          />
        ))
    }
    {
      cardsLength === 0
        ? <div className="empty-pile" /> : ''
    }
  </div>
)

CardsPlaceholder.propTypes = {
  isInTurn: PropTypes.bool,
  cardsLength: PropTypes.number.isRequired,
  isRow: PropTypes.bool,
}

CardsPlaceholder.defaultProps = {
  isInTurn: false,
  isRow: false,
}

export default CardsPlaceholder
