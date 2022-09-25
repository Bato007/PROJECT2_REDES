import React from 'react'
import PropTypes from 'prop-types'
import Card from '../card/Card'
import './player.scss'

const Player = ({ cards }) => (
  <div className="player-cards">
    <h1>Player deck</h1>
    <div className="player-cards-container">
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
}

export default Player
