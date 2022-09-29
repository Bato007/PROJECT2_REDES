import React from 'react'
import PropTypes from 'prop-types'
import Button from '../button/Button'
import cardBack from '../../../assets/back-card.jpeg'
import './deck.scss'

const CardsPlaceholder = ({
  cardsLength,
  isRow,
  isInTurn,
  userName,
}) => (
  <div className={`card-placeholder-container ${isRow ? 'row' : 'column'} ${isInTurn ? 'isInTurn' : ''}`}>
    <h3>{userName}</h3>
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
      !cardsLength
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
  userName: PropTypes.string,
}

CardsPlaceholder.defaultProps = {
  isInTurn: false,
  isRow: false,
  userName: '',
}

export default CardsPlaceholder
