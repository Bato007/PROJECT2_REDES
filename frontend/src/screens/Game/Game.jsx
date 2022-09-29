/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable import/no-cycle */
import React, { useContext, useState } from 'react'
import { useDrop } from 'react-dnd'
import Card from '../../components/card/Card'
import CardsPlaceholder from '../../components/card/CardPlaceholder'
import { SocketContext } from '../../App'

import Deck from '../../components/card/Deck'
import Player from '../../components/player/Player'
import './game.scss'
import LoaderScreen from '../../components/loader/LoaderScreen'

const Game = () => {
  const [playerCards, setPlayerCards] = useState([])
  const [isDead, setIsDead] = useState(false)
  const [discardPile, setDiscardPile] = useState([])

  const [playerInTurn, setPlayerInTurn] = useState('')
  const [chatMessage, setChatMessage] = useState('')
  const [newChat, setNewChat] = useState(false)
  const [chatBuffer, setChatBuffer] = useState([])
  const [future, setFuture] = useState([])
  const [needsDefuse, setNeedsDefuse] = useState(false)
  const [exploding, setExploding] = useState({})
  const [defusedUsed, setDefusedUsed] = useState(false)
  const [deckSize, setDeckSize] = useState(0)

  const {
    socket, user, room, userA,
  } = useContext(SocketContext)
  const [socketVal] = socket
  const [userVal] = user
  const [roomVal] = room
  const [userAmount, setUserAmount] = userA

  let setChatFalse = setTimeout(() => setNewChat(false), 5000)
  clearTimeout(setChatFalse)
  socketVal.onmessage = (event) => {
    const res = JSON.parse(event.data)
    // eslint-disable-next-line no-console
    console.log('res in GAME', res)
    if (res.type !== 'ERROR') {
      if (res.type === 'chat') {
        setNewChat(true)
        const mess = { sender: res.sender, message: res.message }
        const newState = [...chatBuffer, mess]
        setChatBuffer(newState)
        clearTimeout(setChatFalse)
        setChatFalse = setTimeout(() => setNewChat(false), 5000)
      } else if (res.type === 'room') {
        if ('decks' in res) {
          setUserAmount(4)
          setPlayerInTurn(res.turn)
          res.decks[userVal].forEach((card) => {
            playerCards.push(card)
          })
          setPlayerCards([...playerCards])
        }
      } else if (res.type === 'game') {
        if (res.turn === userVal || res.card.id === 13) {
          setPlayerInTurn(res.turn)
        }

        if (res.turn === userVal) {
          if (res.lost) {
            setIsDead(true)
          } else if ('futureCards' in res) {
            setFuture([...res.futureCards])
            setTimeout(() => setFuture([]), 10000)
          } else if (res.card.id === 19) {
            setDefusedUsed(true)
            setDeckSize(res.deckSize)
          } else if (res.card.id !== 18) {
            playerCards.push(res.card)
            setPlayerCards([...playerCards])
          }
        }

        if (res.card.id === 18) {
          if (res.turn === userVal) {
            // eslint-disable-next-line no-alert
            alert('EXPLODING KITTEN!! USE YOUR DIFFUSE')
            setNeedsDefuse(true)
            setExploding(res.card)
          } else {
            // eslint-disable-next-line no-alert
            alert(res.turn, 'got an exploding kitty')
          }
        }
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
      if (playerInTurn !== userVal) {
        return
      }
      if ((needsDefuse && item.id !== 19) || (!needsDefuse && item.id === 19)) {
        return
      }
      const removeCard = playerCards.findIndex((card) => card.index === item.index)
      playerCards.splice(removeCard, 1)

      socketVal.send(JSON.stringify({
        username: userVal,
        roomID: roomVal,
        type: 'game',
        action: 'put',
        card: item,
      }))

      discardPile.push(item)

      setDiscardPile([...discardPile])
      setPlayerCards([...playerCards])
      setNeedsDefuse(false)
    },
  })

  const addCardToPlayer = () => {
    socketVal.send(JSON.stringify(
      {
        type: 'game',
        action: 'draw',
        username: userVal,
        roomID: roomVal,
      },
    ))
  }

  const handleMessage = () => {
    const req = {
      type: 'chat',
      username: userVal,
      roomID: roomVal,
      message: chatMessage,
    }
    socketVal.send(JSON.stringify(req))
    setChatMessage('')
  }

  const stopIsSorting = (deckPos) => {
    socketVal.send(JSON.stringify({
      username: userVal,
      roomID: roomVal,
      type: 'game',
      action: 'put',
      card: exploding,
      target: deckPos,
    }))
    setExploding({})
    setDefusedUsed(false)
  }

  return (
    <div className="game-screen">
      <div className="decks-container">
        <CardsPlaceholder isDead cardsLength={15} isRow isInTurn={playerInTurn === 0} />
        <div className="center-container">
          <CardsPlaceholder cardsLength={0} isInTurn={playerInTurn === 3} />
          <div className="centered-deck">
            <Deck
              isStacked
              addCardToPlayer={addCardToPlayer}
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
        isInTurn={playerInTurn === userVal}
      />
      <div
        style={{
          width: 'calc(30vw + 212px)',
          position: 'absolute',
          padding: '90px',
          background: 'rgba(0, 0, 0, 0.7)',
          display: future.length > 0 ? 'flex' : 'none',
          columnGap: '16px',
          borderRadius: '25px',
        }}
        onMouseDown={() => setFuture([])}
      >
        {future.map((item) => (
          <Card
            key={`${item.ID}`}
            card={item}
          />
        ))}
      </div>
      <div style={{
        display: 'flex',
        width: '100%',
        height: '55px',
        paddingLeft: '48px',
        paddingRight: '48px',
        fontSize: '24px',
      }}
      >
        <input
          type="text"
          value={chatMessage}
          onChange={(e) => setChatMessage(e.target.value)}
          style={{
            background: 'white',
            flexGrow: '1',
            fontSize: '24px',
            borderRadius: '25px',
            padding: '10px 14px',
          }}
        />
        <button
          type="button"
          style={{
            background: chatMessage === '' ? 'gray' : 'orange',
            fontSize: '24px',
            borderRadius: '10px',
            padding: '10px 14px',
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
          display: newChat ? 'block' : 'none',
        }}
      >
        {chatBuffer.slice(0).reverse().map((chat, index) => (
          <p
            // eslint-disable-next-line react/no-array-index-key
            key={index + chat.sender}
            style={{
              fontSize: '24px',
            }}
          >
            {chat.sender}
            :
            {' '}
            {chat.message}
          </p>
        ))}
      </div>
      {
        userAmount !== 4
          ? <LoaderScreen /> : ''
      }
      {
        defusedUsed
          ? <Deck deckLength={deckSize} closeIsSorting={stopIsSorting} />
          : ''
      }
    </div>
  )
}

export default Game
