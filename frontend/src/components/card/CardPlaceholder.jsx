import React from 'react'
import PropTypes from 'prop-types'
import Button from '../button/Button'
import cardBack from '../../../assets/back-card.jpeg'
import './deck.scss'

const CardsPlaceholder = ({ cardsLength, isRow }) => (
  <div className={`card-placeholder-container ${isRow ? 'row' : 'column'}`}>
    {
        Array(cardsLength).fill(null).map(() => (
          <Button
            icon={[cardBack]}
            classButton="card"
          />
        ))
    }
  </div>
)

CardsPlaceholder.propTypes = {
  cardsLength: PropTypes.number.isRequired,
  isRow: PropTypes.bool,
}

CardsPlaceholder.defaultProps = {
  isRow: false,
}

export default CardsPlaceholder
