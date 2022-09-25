import React, { useRef, useState } from 'react'
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

  // Create WebSocket connection.
  const socket = new WebSocket('ws://localhost:8081')

  // Connection opened
  socket.addEventListener('open', (event) => {
    socket.send('Hello Server!', event)
  })

  const checkData = (e, name) => {
    if (e.key === 'Enter' && ref.current.value !== '') {
      joinRoomData[name] = ref.current.value
      ref.current.value = ''
      setJoinRoomData({ ...joinRoomData })
    }
  }

  return (
    <div className="home">
      <img src={title} alt="title" />
      <div className="nickname-container">
        {
          joinRoomData.nickname === ''
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
