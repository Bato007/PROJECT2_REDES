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
  const [playerInTurn, setPlayerInTurn] = useState('')
  const [chatMessage, setChatMessage] = useState('')
  const [newChat, setNewChat] = useState(false)
  const [chatBuffer, setChatBuffer] = useState([])
  const [future, setFuture] = useState([])
  const [needsDefuse, setNeedsDefuse] = useState(false)
  const [exploding, setExploding] = useState({})
  const [defusedUsed, setDefusedUsed] = useState(false)
  const [deckSize, setDeckSize] = useState(0)
  const [deckPos, setDeckPos] = useState(0)

  const { socket, user, room, userA } = useContext(SocketContext)
  const [socketVal, setSocket] = socket
  const [userVal, setUser] = user
  const [roomVal, setRoom] = room
  const [userAmount, setUserAmount] = userA

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
      } else if (res.type === 'room') {
        if ('decks' in res) {
          Object.keys(res.decks).length // Amount of players
          setUserAmount(4)
          setPlayerInTurn(res.turn)
          res.decks[userVal].forEach((card) => {
            playerCards.push(card)
          })
          setPlayerCards([...playerCards])
        }
      } else if (res.type === 'game') {
        if (res.card['id'] !== 18) {
          discardPile.push(res.card)
          setDiscardPile([...discardPile])
        }
        if ('futureCards' in res && res.username === userVal) {
          setFuture([...res.futureCards])
          setTimeout(() => setFuture([]), 10000)
        }
        if (res.card['id'] === 13) {
          setPlayerInTurn(res.turn)
        }
        if (res.card['id'] === 19) {
          setDefusedUsed(true)
          setDeckSize(res.deckSize)
        }
        if (res.card['id'] === 18) {
          alert(res.username, 'got an exploding kitty')
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
      if (needsDefuse && item.id !== 19 || !needsDefuse && item.id === 19) {
        return
      }
      const removeCard = playerCards.findIndex((card) => card.index === item.index)
      playerCards.splice(removeCard, 1)

      socketVal.send(JSON.stringify({
        username: userVal,
        roomID: roomVal,
        type: 'game',
        action: 'put',
        card: item
      }))

      discardPile.push(item)

      setDiscardPile([...discardPile])
      setPlayerCards([...playerCards])
      setNeedsDefuse(false)
    },
  })

  const addCardToPlayer = (card) => {
    socketVal.send(JSON.stringify(draw(userVal, roomVal)))

    socketVal.onmessage = (event) => {
      const cardRes = JSON.parse(event.data);
      console.log(cardRes)
      if (cardRes.username === userVal) {
        setPlayerInTurn(cardRes.turn)
        if (cardRes.card['id'] !== 18) {
          playerCards.push(cardRes.card)
          setPlayerCards([...playerCards]) 
        } else {
          if (cardRes.lost) {
            setIsDead(true)
          } else {
            if (cardRes.turn === userVal) {
              alert('EXPLODING KITTEN!! USE YOUR DIFFUSE')
              setNeedsDefuse(true)
              setExploding(cardRes.card)
            }
          }
        }
      }
    }
  }

  const removeCardToPlayer = (card) => {
    const index = playerCards.findIndex((checkDiffuse) => checkDiffuse.id === card.id)
    playerCards.splice(index, 1)
    setPlayerCards([...playerCards])
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
          borderRadius: '25px'
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
            key={index+chat.sender}
            style={{
              fontSize: '24px'
            }}
          >
            {chat.sender}: {chat.message}
          </p>
        ))}
      </div>
      <div
        style={{
          width: '100%',
          height: '100%',
          background: 'rgba(255, 255, 255, 0.85)',
          position: 'absolute',
          display: userAmount === 4 ? 'none' : 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
      </div>
      <div
        style={{
          width: '100%',
          height: '100%',
          background: 'rgba(255, 255, 255, 0.85)',
          position: 'absolute',
          display: !defusedUsed ? 'none' : 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <p
          style={{
            fontSize: '24px',
            fontWeight: 'bold'
          }}
        >Inserte un numero entre 1 y {deckSize}</p>
        <input
          type='number'
          min={1}
          max={deckSize}
          onChange={(e) => setDeckPos(e.target.value)}
          style={{
            background: 'rgba(255, 165, 0, 0.6)',
            fontSize: '24px',
            borderRadius: '12px',
            padding: '16px',
            marginTop: '12px'
          }}
        ></input>
        <button
          style={{
            background: 'rgba(32, 178, 170, 0.7)',
            marginTop: '12px',
            fontSize: '24px',
            padding: '16px',
            borderRadius: '6px'
          }}
          onClick={() => {
            socketVal.send(JSON.stringify({
              username: userVal,
              roomID: roomVal,
              type: 'game',
              action: 'put',
              card: exploding,
              target: deckPos - 1
            }))
            setDeckPos(0)
            setExploding({})
            setDefusedUsed(false)
          }}
        >Enviar</button>
      </div>
    </div>
  )
}

export default Game
