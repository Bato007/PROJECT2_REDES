import React from 'react'
import PropTypes from 'prop-types'
import Button from '../button/Button'
import './deck.scss'

const Card = ({ card, onClick }) => (
  <Button
    icon={[card.src]}
    classButton="card"
    onClick={onClick}
  />
)

Card.propTypes = {
  card: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    src: PropTypes.string,
  }).isRequired,
  onClick: PropTypes.func,
}

Card.defaultProps = {
  onClick: () => {},
}

export default Card
