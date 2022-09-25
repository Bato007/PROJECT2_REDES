import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import { useDrag, useDrop } from 'react-dnd'
import Button from '../button/Button'
import './deck.scss'

const Card = ({ card, onClick, moveCard }) => {
  const ref = useRef()

  const [, drop] = useDrop({
    accept: 'CARD',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    drop: (item) => {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const dropIndex = card.index
      // Don't replace items with themselves
      if (dragIndex === dropIndex) {
        return
      }
      moveCard(item, card)
    },
  })

  const [, drag] = useDrag({
    type: 'CARD',
    item: () => (card),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  drag(drop(ref))

  return (
    <div className="card-container" ref={ref}>
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
  moveCard: PropTypes.func,
}

Card.defaultProps = {
  onClick: () => {},
  moveCard: () => {},
}

export default Card
