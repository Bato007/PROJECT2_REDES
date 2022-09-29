import React from 'react'
import PropTypes from 'prop-types'
import { useDrop } from 'react-dnd'
import Button from '../button/Button'
import cardBack from '../../../assets/back-card.jpeg'
import './deck.scss'

const SortableCard = ({ index, onClick, moveCard }) => {
  const [, dropRef] = useDrop({
    accept: 'CARD',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    drop: () => {
      moveCard(index)
    },
  })

  return (
    <div className="card-container" ref={dropRef}>
      <Button
        icon={[cardBack]}
        classButton="card"
        onClick={onClick}
      />
    </div>
  )
}

SortableCard.propTypes = {
  index: PropTypes.number.isRequired,
  onClick: PropTypes.func,
  moveCard: PropTypes.func,
}

SortableCard.defaultProps = {
  onClick: () => {},
  moveCard: () => {},
}

export default SortableCard
