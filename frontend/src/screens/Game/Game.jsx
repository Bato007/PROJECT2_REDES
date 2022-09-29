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
import List from '../../components/list/List'

const Game = () => {
  const [playerCards, setPlayerCards] = useState([])
  const [isDead, setIsDead] = useState(false)

  const [pileSize, setPileSize] = useState(0)
  const [discardPile, setDiscardPile] = useState([])

  const [playerInTurn, setPlayerInTurn] = useState('')
  const [chatMessage, setChatMessage] = useState('')
  const [newChat, setNewChat] = useState(false)
  const [chatBuffer, setChatBuffer] = useState([])
  const [canSteal, setCanSteal] = useState(false)

  const [roundTableDecks, setRoundDecks] = useState([])
  const [roundTable, setRoundTable] = useState(0)
  const [future, setFuture] = useState([])
  const [needsDefuse, setNeedsDefuse] = useState(false)
  const [exploding, setExploding] = useState({})
  const [defusedUsed, setDefusedUsed] = useState(false)
  const [deckSize, setDeckSize] = useState(0)

  const {
    socket, user, room,
  } = useContext(SocketContext)
  const [socketVal] = socket
  const [userVal] = user
  const [roomVal] = room

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
          setPlayerInTurn(res.turn)
          res.decks[userVal].forEach((card) => {
            playerCards.push(card)
          })
          setPlayerCards([...playerCards])
          setPileSize(res.pileSize)
        }
        if (res.users) {
          const users = [...res.users]
          const nextOfMe = users.splice(users.indexOf(userVal))
          const beforeMe = users

          const newOrder = nextOfMe.concat(beforeMe)
          setRoundTable(newOrder)

          const obj = newOrder.reduce((accumulator, value) => ({ ...accumulator, [value]: 8 }), {})
          setRoundDecks(obj)
        }
      } else if (res.type === 'game') {
        setPlayerInTurn(res.turn)
        setPileSize(res.pileSize)
        setCanSteal(res.steal)

        if (res.steal) {
          return []
        }

        if (res.turn === userVal) {
          if (res.lost) {
            setIsDead(true)
          } else if ('futureCards' in res) {
            setFuture([...res.futureCards])
            setTimeout(() => setFuture([]), 10000)
          } else if (res.card.id === 19) {
            setDefusedUsed(true)
            setDeckSize(res.pileSize)
          } else if (res.card.id !== 18) {
            playerCards.push(res.card)
            setPlayerCards([...playerCards])
          }
        }

        if (res.card.id === 18 && res.action !== 'put') {
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
    return []
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
      socketVal.send(JSON.stringify({
        username: userVal,
        roomID: roomVal,
        type: 'game',
        action: 'put',
        card: item,
      }))
      discardPile.push(item)

      setDiscardPile([...discardPile])
      setNeedsDefuse(false)
    },
  })

  const addCardToPlayer = () => {
    if (playerInTurn !== userVal) {
      return
    }
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

  const sendTarget = (target) => {
    socketVal.send(JSON.stringify({
      username: userVal,
      roomID: roomVal,
      type: 'game',
      action: 'steal',
      target,
    }))
  }

  return (
    <div className="game-screen">
      {
      roundTable.length === 4
        ? (
          <div className="decks-container">
            <CardsPlaceholder
              isRow
              cardsLength={roundTableDecks[roundTable[2]]}
              isInTurn={playerInTurn === roundTable[2]}
              userName={roundTable[2]}
            />
            <div className="center-container">
              <CardsPlaceholder
                cardsLength={roundTableDecks[roundTable[1]]}
                isInTurn={playerInTurn === roundTable[1]}
                userName={roundTable[1]}
              />
              <div className="centered-deck">
                {
                  pileSize > 0
                    ? (
                      <Deck
                        isStacked
                        addCardToPlayer={addCardToPlayer}
                      />
                    )
                    : <div className="empty-pile" />
                }
                <div className="discard-pile" ref={dropRef}>
                  {
                  discardPile.length > 0 > 0
                    ? (
                      <Card
                        card={discardPile.at(-1)}
                      />
                    )
                    : <div className="empty-pile" />
                      }
                </div>
              </div>
              <CardsPlaceholder
                cardsLength={roundTableDecks[roundTable[3]]}
                isInTurn={playerInTurn === roundTable[3]}
                userName={roundTable[3]}
              />
            </div>
          </div>
        )
        : <LoaderScreen />
        }
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
      <div className="chat">
        <input
          type="text"
          value={chatMessage}
          onChange={(e) => setChatMessage(e.target.value)}
        />
        <button
          type="button"
          disabled={chatMessage === ''}
          onClick={handleMessage}
        >
          Send
        </button>
      </div>
      <div
        className="full-chat"
        style={{
          display: newChat ? 'block' : 'none',
        }}
      >
        {chatBuffer.slice(0).reverse().map((chat, index) => (
          <p
            // eslint-disable-next-line react/no-array-index-key
            key={index + chat.sender}
          >
            {chat.sender}
            :
            {' '}
            {chat.message}
          </p>
        ))}
      </div>
      {
        defusedUsed
          ? <Deck deckLength={deckSize} closeIsSorting={stopIsSorting} />
          : ''
      }
      {
        canSteal
          ? (
            <List
              items={roundTable.length === 4
                ? [...roundTable].splice(1)
                : []}
              saveSelection={sendTarget}
            />
          )
          : ''
      }
    </div>
  )
}

export default Game
