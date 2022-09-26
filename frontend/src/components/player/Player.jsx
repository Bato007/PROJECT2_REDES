import React from 'react'
import PropTypes from 'prop-types'
import Card from '../card/Card'
import './player.scss'

const Player = ({ cards, isInTurn }) => (
  <div className="player-cards">
    <div className={`player-cards-container ${isInTurn ? 'isInTurn' : ''}`}>
      {cards.map((item) => (
        <Card
          key={`${item.name}-${item.index}`}
          card={item}
        />
      ))}
    </div>
  </div>
)

Player.propTypes = {
  isInTurn: PropTypes.bool,
  cards: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      src: PropTypes.string,
    }),
  ),
}

Player.defaultProps = {
  cards: [],
  isInTurn: false,
}

export default Player
