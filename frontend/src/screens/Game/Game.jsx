import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { useDrop } from 'react-dnd'
import Card from '../../components/card/Card'
import CardsPlaceholder from '../../components/card/CardPlaceholder'
import { SocketContext } from '../../App'
import { draw, defuse, shuffle, attack, skip, future, cat } from '../../Utils/objects'

import Deck from '../../components/card/Deck'
import Player from '../../components/player/Player'
import './game.scss'

const Game = () => {
  const [playerCards, setPlayerCards] = useState([])
  const [isDead, setIsDead] = useState(false)
  const [discardPile, setDiscardPile] = useState([])
  const [isSorting, setIsSorting] = useState(false)
  // eslint-disable-next-line no-unused-vars
  const [playerInTurn, setPlayerInTurn] = useState(2)
  const [chatMessage, setChatMessage] = useState('')
  const [newChat, setNewChat] = useState(false)
  const [chatBuffer, setChatBuffer] = useState([])

  const { socket, user, room } = useContext(SocketContext)
  const [socketVal, setSocket] = socket
  const [userVal, setUser] = user
  const [roomVal, setRoom] = room

  let setChatFalse = setTimeout(() => setNewChat(false), 5000)
  clearTimeout(setChatFalse)
  socketVal.onmessage = (event) => {
    const res = JSON.parse(event.data)
    if (res.type !== 'ERROR') {

      if (res.type === 'chat') {
        setNewChat(true)
        const mess = {sender: res.sender, message: res.message}
        const newState = [...chatBuffer, mess]
        setChatBuffer(newState)
        clearTimeout(setChatFalse)
        setChatFalse = setTimeout(() => setNewChat(false), 5000)
      }
    }
  }

  const [, dropRef] = useDrop({
    accept: 'CARD',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    drop: (item) => {
      const removeCard = playerCards.findIndex((card) => card.index === item.index)
      playerCards.splice(removeCard, 1)

      discardPile.push(item)

      // Ussing defuse card
      if (item.id === 19
        && playerCards.findIndex((checkExploding) => checkExploding.id === 18)) {
        setIsSorting(true)
      }

      setDiscardPile([...discardPile])
      setPlayerCards([...playerCards])
    },
  })

  const addCardToPlayer = (card) => {
    socketVal.send(draw(userVal, roomVal))

    socketVal.onmessage = (event) => {
      const cardRes = JSON.parse(event.data);
      console.log(cardRes)
      playerCards.push(card)
      setPlayerCards([...playerCards])
      if (card.id === 18
        && playerCards.findIndex((checkDiffuse) => checkDiffuse.id === 19) === -1) {
        setIsDead(true)
      }
    }
  }

  const removeCardToPlayer = (card) => {
    const index = playerCards.findIndex((checkDiffuse) => checkDiffuse.id === card.id)
    playerCards.splice(index, 1)
    setPlayerCards([...playerCards])
  }

  const setInitialDeck = (initialDeck) => {
    setPlayerCards(initialDeck)
  }

  const handleMessage = () => {
    const req = {
      type: 'chat',
      username: userVal,
      roomID: roomVal,
      message: chatMessage
    }
    socketVal.send(JSON.stringify(req))
    setChatMessage('')
  }

  return (
    <div className="game-screen">
      <div className="decks-container">
        <CardsPlaceholder isDead cardsLength={15} isRow isInTurn={playerInTurn === 0} />
        <div className="center-container">
          <CardsPlaceholder cardsLength={0} isInTurn={playerInTurn === 3} />
          <div className="centered-deck">
            <Deck
              isStacked={!isSorting}
              isSorting={isSorting}
              addCardToPlayer={addCardToPlayer}
              setInitialDeck={setInitialDeck}
              closeIsSorting={() => setIsSorting(false)}
              removeCardToPlayer={removeCardToPlayer}
            />
            <div className="discard-pile" ref={dropRef}>
              {
          discardPile.length > 0
            ? (
              <Card
                card={discardPile.at(-1)}
              />
            )
            : <div className="empty-pile" />
              }
            </div>
          </div>
          <CardsPlaceholder cardsLength={7} isInTurn={playerInTurn === 1} />
        </div>
      </div>
      <Player
        cards={playerCards}
        isDead={isDead}
        isInTurn={playerInTurn === 2}
      />
      <div style={{
        display: 'flex',
        width: '100%',
        height: '55px',
        paddingLeft: '48px',
        paddingRight: '48px',
        fontSize: '24px'
      }}>
        <input
          type='text'
          value={chatMessage}
          onChange={(e) => setChatMessage(e.target.value)}
          style={{
            background: 'white',
            flexGrow: '1',
            fontSize: '24px',
            borderRadius: '25px',
            padding: '10px 14px'
          }}
        />
        <button
          style={{
            background: chatMessage === '' ? 'gray' : 'orange',
            fontSize: '24px',
            borderRadius: '10px',
            padding: '10px 14px'
          }}
          disabled={chatMessage === ''}
          onClick={handleMessage}
        >
          Send
        </button>
      </div>
      <div
        style={{
          position: 'absolute',
          background: 'rgba(255, 255, 255, 0.65)',
          width: 'calc(100% - 96px)',
          height: '250px',
          bottom: '55px',
          padding: '16px',
          borderRadius: '25px',
          pointerEvents: 'none',
          display: newChat ? 'block' : 'none'
        }}
      >
        {chatBuffer.slice(0).reverse().map((chat, index) => (
          <p
            key={index}
            style={{
              fontSize: '24px'
            }}
          >
            {chat.sender}: {chat.message}
          </p>
        ))}
      </div>
    </div>
  )
}

export default Game
