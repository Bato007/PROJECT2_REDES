import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Button from '../button/Button'
import stackedDeck from '../../../assets/stacked-deck.png'

const Card = ({ cardSrc, card }) => {
  const [src, setSrc] = useState(cardSrc)

  const revealCard = () => {
    setSrc(card.src)
  }

  return (
    <Button
      icon={[src]}
      classButton="card"
      onClick={revealCard}
    />
  )
}

Card.propTypes = {
  cardSrc: PropTypes.string,
  card: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    src: PropTypes.string,
  }).isRequired,
}

Card.defaultProps = {
  cardSrc: stackedDeck,
}

export default Card
