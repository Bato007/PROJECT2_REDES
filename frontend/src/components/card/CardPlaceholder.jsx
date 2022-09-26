import React from 'react'
import PropTypes from 'prop-types'
import Button from '../button/Button'
import cardBack from '../../../assets/back-card.jpeg'
import './deck.scss'

const CardsPlaceholder = ({
  cardsLength,
  isRow,
  isInTurn,
  isDead,
}) => (
  <div className={`card-placeholder-container ${isRow ? 'row' : 'column'} ${isInTurn ? 'isInTurn' : ''}`}>
    {
        Array(cardsLength).fill(null).map((item, index) => (
          <Button
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            icon={[cardBack]}
            classButton="card"
          />
        ))
    }
    {
      cardsLength === 0
        ? <div className="empty-pile" /> : ''
    }
    {
      isDead
        ? (
          <div className="dead-popup">
            <h1>Lost</h1>
          </div>
        )
        : ''
    }
  </div>
)

CardsPlaceholder.propTypes = {
  isInTurn: PropTypes.bool,
  cardsLength: PropTypes.number.isRequired,
  isRow: PropTypes.bool,
  isDead: PropTypes.bool,
}

CardsPlaceholder.defaultProps = {
  isInTurn: false,
  isRow: false,
  isDead: false,
}

export default CardsPlaceholder
