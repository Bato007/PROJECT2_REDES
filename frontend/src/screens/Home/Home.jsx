import React, { useContext, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
// eslint-disable-next-line import/no-cycle
import { SocketContext } from '../../App'
import title from '../../../assets/title.png'
import Button from '../../components/button/Button'
import './home.scss'

const Home = () => {
  const ref = useRef()
  const [joinRoomData, setJoinRoomData] = useState({
    type: 'room',
    action: 'join',
    username: '',
    roomID: '',
  })

  const navigation = useNavigate()

  const {
    socket,
    room,
    user,
    userA,
  } = useContext(SocketContext)
  const [socketVal] = socket
  const [roomVal, setRoom] = room
  const [, setUser] = user
  const [, setUserAmount] = userA

  socketVal.onmessage = (event) => {
    const message = JSON.parse(event.data)
    // eslint-disable-next-line no-console
    console.log(message)
    if (message.code === 404) {
      // eslint-disable-next-line no-alert
      alert(message.message)
      navigation(0)
    } else {
      if (message.type === 'room') {
        if ('users' in message) {
          setUserAmount(message.users.length)
          if (message.users.length === 4) {
            socketVal.send(JSON.stringify({
              type: 'room',
              action: 'start',
              roomID: roomVal,
            }))
          }
        }
      }
      navigation('/game')
    }
  }

  const checkData = (e, name) => {
    if (e.key === 'Enter' && ref.current.value !== '') {
      joinRoomData[name] = ref.current.value
      ref.current.value = ''
      setJoinRoomData({ ...joinRoomData })
      if (joinRoomData.username !== '') {
        setUser(joinRoomData.username)
        setRoom(joinRoomData.roomID)
        socketVal.send(JSON.stringify(joinRoomData))
      }
    }
  }

  return (
    <div className="home">
      <img src={title} alt="title" />
      <div className="nickname-container">
        {
          joinRoomData.roomID !== ''
            ? (
              <>
                <input ref={ref} type="text" onKeyDown={(e) => checkData(e, 'username')} placeholder="Nickname" />
                <Button classButton="primary-button" onClick={() => checkData({ key: 'Enter' }, 'username')} text="Enter" />
              </>
            )
            : (
              <>
                <input ref={ref} type="text" onKeyDown={(e) => checkData(e, 'roomID')} placeholder="Room ID" />
                <Button classButton="primary-button" onClick={() => checkData({ key: 'Enter' }, 'roomID')} text="Ok! GO" />
              </>
            )
        }
      </div>
    </div>
  )
}

export default Home
