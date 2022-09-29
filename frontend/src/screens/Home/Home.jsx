import React, { useContext, useRef, useState } from 'react'
import title from '../../../assets/title.png'
import Button from '../../components/button/Button'
import { SocketContext } from '../../App'
import './home.scss'
import { useNavigate } from 'react-router'

const Home = () => {
  const ref = useRef()
  const [joinRoomData, setJoinRoomData] = useState({
    type: 'room',
    action: 'join',
    username: '',
    roomID: '',
  })

  const navigation = useNavigate()

  const { socket, user, room } = useContext(SocketContext)
  const [socketVal, setSocket] = socket
  const [userVal, setUser] = user
  const [roomVal, setRoom] = room

  socketVal.onmessage = (event) => {
    const message = JSON.parse(event.data);
    console.log(message)
    if (message.code === 404) {
      alert(message.message)
      navigation(0)
    } else {
      navigation('/game')
    }
  }

  const checkData = (e, name) => {
    if (e.key === 'Enter' && ref.current.value !== '') {
      joinRoomData[name] = ref.current.value
      ref.current.value = ''
      setJoinRoomData({ ...joinRoomData })
      if (joinRoomData.username !== '') {
        setUser(joinRoomData['username'])
        setRoom(joinRoomData['roomID'])
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
