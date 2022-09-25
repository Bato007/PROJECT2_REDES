import React from 'react'
import PropTypes from 'prop-types'
import { useDrag } from 'react-dnd'
import Button from '../button/Button'
import './deck.scss'

const Card = ({ card, onClick }) => {
  const [, dragRef] = useDrag({
    type: 'CARD',
    item: () => (card),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  return (
    <div className="card-container" ref={dragRef}>
      <Button
        icon={[card.src]}
        classButton="card"
        onClick={onClick}
      />
    </div>
  )
}

Card.propTypes = {
  card: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    src: PropTypes.string,
    index: PropTypes.number,
  }).isRequired,
  onClick: PropTypes.func,
}

Card.defaultProps = {
  onClick: () => {},
}

export default Card
