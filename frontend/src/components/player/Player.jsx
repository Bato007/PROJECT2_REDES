import React from 'react'
import PropTypes from 'prop-types'
import Card from '../card/Card'

const Player = ({ cards }) => (
  cards.map((item, index) => (
    <Card
        // eslint-disable-next-line react/no-array-index-key
      key={`${item.name}${index}`}
      card={item}
    />
  ))
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
