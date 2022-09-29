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
  status,
  isPrivate,
}) => (
  <div className={`card-placeholder-container ${isRow ? 'row' : 'column'} ${isInTurn ? 'isInTurn' : ''}`}>
    <div className="user-info-container">
      <h3>{userName}</h3>
      <div className={`${isPrivate ? 'private' : 'public'} ${status === 0 ? 'inactive' : ''}  ${status === 1 ? 'active' : ''}`} />
    </div>
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
  status: PropTypes.number,
  isPrivate: PropTypes.bool,
}

CardsPlaceholder.defaultProps = {
  isInTurn: false,
  isRow: false,
  userName: '',
  status: 0,
  isPrivate: false,
}

export default CardsPlaceholder
