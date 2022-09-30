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

  const [winner, setWinner] = useState()
  const [pileSize, setPileSize] = useState(0)
  const [discardPile, setDiscardPile] = useState([])

  const [playerInTurn, setPlayerInTurn] = useState('')
  const [chatMessage, setChatMessage] = useState('')
  const [newChat, setNewChat] = useState(false)
  const [chatBuffer, setChatBuffer] = useState([])
  const [canSteal, setCanSteal] = useState(false)

  const [roundTableDecks, setRoundDecks] = useState([])
  const [roundTable, setRoundTable] = useState(0)
  const [roundTableStatus, setRoundTableStatus] = useState()

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
          setRoundTableStatus(res.usersStatus)
        }
      } else if (res.type === 'game') {
        setPlayerInTurn(res.turn)
        setPileSize(res.pileSize)

        if (res.decksSize) setRoundDecks(res.decksSize)

        if (res.steal && res.turn === userVal) {
          setCanSteal(res.steal)
          return []
        }
        if (res.winner) {
          setWinner(res.winner)
          return []
        }

        if (res.action === 'steal' && res.card) {
          if (userVal === res.target) {
            const removeCard = playerCards.findIndex((card) => card.ID === res.card.ID)
            playerCards.splice(removeCard, 1)
            setPlayerCards([...playerCards])
          }
          if (userVal === res.turn) {
            playerCards.push(res.card)
            setPlayerCards([...playerCards])
          }
          return []
        }

        if (res.turn === userVal) {
          if ('futureCards' in res) {
            setFuture([...res.futureCards])
            setTimeout(() => setFuture([]), 10000)
          } else if (res.card.id === 19) {
            setDeckSize(res.pileSize)
          }
        }

        if (res.action === 'put' && res.card.id !== 18) {
          discardPile.push(res.card)
          setDiscardPile([...discardPile])
        }

        if (res.username === userVal && res.card.id !== 18 && res.action !== 'put') {
          playerCards.push(res.card)
          setPlayerCards([...playerCards])
        }

        if (res.card.id === 18 && res.action !== 'put') {
          if (res.username === userVal) {
            // eslint-disable-next-line no-alert
            alert('EXPLODING KITTEN!! USE YOUR DIFFUSE')
            setNeedsDefuse(true)
            setExploding(res.card)
          } else {
            // eslint-disable-next-line no-alert
            alert(`${res.username} got an exploding kitty`)
          }
        }
      } else if (res.type === 'status') {
        setRoundTableStatus(res.users)
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
      if (item.ID === discardPile.at(discardPile.length - 1)?.ID) {
        return
      }
      if ((item.id === 19 && needsDefuse)) {
        setDefusedUsed(true)
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

      const removeCard = playerCards.findIndex((card) => card.ID === item.ID)
      playerCards.splice(removeCard, 1)
      setPlayerCards([...playerCards])

      setNeedsDefuse(false)
    },
  })

  const addCardToPlayer = () => {
    if (playerInTurn !== userVal || roundTableDecks[userVal] === undefined) {
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

  const sendTarget = (name) => {
    socketVal.send(JSON.stringify({
      username: userVal,
      roomID: roomVal,
      type: 'game',
      action: 'steal',
      target: name,
    }))
    setCanSteal(false)
  }

  const handleChange = (e) => {
    const { checked } = e.target
    socketVal.send(JSON.stringify({
      username: userVal,
      roomID: roomVal,
      type: 'status',
      action: checked ? 'private' : 'public',
      status: roundTableStatus[roundTable[0]].status,
    }))
  }

  const handleStatusChange = () => {
    socketVal.send(JSON.stringify({
      username: userVal,
      roomID: roomVal,
      type: 'status',
      action: roundTableStatus[roundTable[0]].isPrivate ? 'private' : 'public',
      status: roundTableStatus[roundTable[0]].status === 0 ? 1 : 0,
    }))
  }

  return (
    <div className="game-screen">
      <div className="toggle-privacy">
        <label className="switch">
          <input onChange={handleChange} type="checkbox" />
          <span className="slider round" />
        </label>
        Private status
      </div>

      {
      roundTable.length === 4 && roundTableStatus
        ? (
          <>
            <div className="decks-container">
              <CardsPlaceholder
                isRow
                status={roundTableStatus[roundTable[2]].status}
                isPrivate={roundTableStatus[roundTable[2]].isPrivate}
                cardsLength={roundTableDecks[roundTable[2]]}
                isInTurn={playerInTurn === roundTable[2]}
                userName={roundTable[2]}
              />
              <div className="center-container">
                <CardsPlaceholder
                  status={roundTableStatus[roundTable[1]].status}
                  isPrivate={roundTableStatus[roundTable[1]].isPrivate}
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
                <CardsPlaceholder
                  status={roundTableStatus[roundTable[3]].status}
                  isPrivate={roundTableStatus[roundTable[3]].isPrivate}
                  cardsLength={roundTableDecks[roundTable[3]]}
                  isInTurn={playerInTurn === roundTable[3]}
                  userName={roundTable[3]}
                />
              </div>
            </div>
            <Player
              handleStatusChange={() => handleStatusChange()}
              status={roundTableStatus[roundTable[0]].status}
              userName={roundTable[0]}
              cards={playerCards}
              cardsLength={roundTableDecks[roundTable[0]]}
              isInTurn={playerInTurn === userVal}
            />
          </>
        )
        : <LoaderScreen />
        }
      <div
        style={{
          width: 'fit-content',
          position: 'absolute',
          padding: '90px',
          background: 'rgba(0, 0, 0, 0.7)',
          display: future.length > 0 ? 'flex' : 'none',
          columnGap: '16px',
          borderRadius: '25px',
        }}
        onMouseDown={() => setFuture([])}
      >
        <h2 className="sorting-mark">On top</h2>
        {future.map((item) => (
          <Card
            key={`${item.ID}`}
            card={item}
          />
        ))}
        <h2 className="sorting-mark">On bottom</h2>
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
                ? [Object.keys(roundTableDecks)].splice(1)
                : []}
              saveSelection={sendTarget}
            />
          )
          : ''
      }
      {
        winner
          ? (
            <div className="winner-screen">
              <h1>
                {winner}
                {' '}
                won!
              </h1>
            </div>
          )
          : ''
      }
    </div>
  )
}

export default Game
