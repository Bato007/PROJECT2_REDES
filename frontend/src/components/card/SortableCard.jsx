import React from 'react'
import PropTypes from 'prop-types'
import { useDrop } from 'react-dnd'
import Button from '../button/Button'
import cardBack from '../../../assets/back-card.jpeg'
import './deck.scss'
import Card from './Card'

const SortableCard = ({ card, onClick, moveCard }) => {
  const [, dropRef] = useDrop({
    accept: 'CARD',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    drop: (item) => {
      moveCard(item, card)
    },
  })

  return (
    <div className="card-container" ref={dropRef}>
      {
        card.showFront
          ? <Card card={card} />
          : (
            <Button
              icon={[cardBack]}
              classButton="card"
              onClick={onClick}
            />
          )
      }
    </div>
  )
}

SortableCard.propTypes = {
  card: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    src: PropTypes.string,
    index: PropTypes.number,
    showFront: PropTypes.bool,
  }).isRequired,
  onClick: PropTypes.func,
  moveCard: PropTypes.func,
}

SortableCard.defaultProps = {
  onClick: () => {},
  moveCard: () => {},
}

export default SortableCard
