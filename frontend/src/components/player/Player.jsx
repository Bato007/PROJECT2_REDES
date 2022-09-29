import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import Card from '../card/Card'
import './player.scss'
import Button from '../button/Button'

const Player = ({ cards, isInTurn, isDead }) => {
  const ref = useRef()
  const navigate = useNavigate()

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollLeft = ref.current.scrollWidth
    }
  }, [cards])

  return (
    <div className="player-cards">
      <div className={`player-cards-container ${isInTurn ? 'isInTurn' : ''}`} ref={ref}>
        {cards.map((item) => (
          <Card
            key={`${item.ID}`}
            card={item}
          />
        ))}
        {
        isDead
          ? (
            <div className="dead-popup">
              <h1>Oops! You lost</h1>
              <Button
                classButton="primary-button"
                text="Play again"
                onClick={() => navigate('/')}
              />
            </div>
          )
          : ''
      }
      </div>
    </div>
  )
}

Player.propTypes = {
  isInTurn: PropTypes.bool,
  isDead: PropTypes.bool,
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
  isDead: false,
}

export default Player
