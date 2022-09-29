/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import Card from '../card/Card'
import './player.scss'
import Button from '../button/Button'

const Player = ({
  cards,
  isInTurn,
  cardsLength,
  userName,
  status,
  handleStatusChange,
}) => {
  const ref = useRef()
  const navigate = useNavigate()

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollLeft = ref.current.scrollWidth
    }
  }, [cards])

  return (
    <div className="player-cards">
      <div className="user-info-container" onClick={() => handleStatusChange()}>
        <h3>{userName}</h3>
        <div className={`public ${status === 0 ? 'inactive' : ''}  ${status === 1 ? 'active' : ''}`} />
      </div>
      <div className={`player-cards-container ${isInTurn ? 'isInTurn' : ''}`} ref={ref}>
        {cards.map((item) => (
          <Card
            key={`${item.ID}`}
            card={item}
          />
        ))}
        {
          cards.length === 0
            ? <div className="empty-pile" />
            : ''
        }
        {
        cardsLength === undefined
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
  cardsLength: PropTypes.number,
  cards: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      src: PropTypes.string,
    }),
  ),
  userName: PropTypes.string,
  status: PropTypes.number,
  handleStatusChange: PropTypes.func,
}

Player.defaultProps = {
  cards: [],
  isInTurn: false,
  cardsLength: 0,
  userName: '',
  status: 0,
  handleStatusChange: () => {},
}

export default Player
