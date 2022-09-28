import React, { useContext, useRef, useState } from 'react'
import title from '../../../assets/title.png'
import Button from '../../components/button/Button'
import { SocketContext } from '../../App'
import './home.scss'

const Home = () => {
  const ref = useRef()
  const [joinRoomData, setJoinRoomData] = useState({
    type: 'room',
    action: 'join',
    username: '',
    roomID: '',
  })

  const socket = useContext(SocketContext)

  // Connection opened
  socket.onopen = async (e) => {
    console.log('Socket opened', e)
  }

  socket.onmessage = (event) => {
    console.log(event.data)
  }

  const checkData = (e, name) => {
    if (e.key === 'Enter' && ref.current.value !== '') {
      joinRoomData[name] = ref.current.value
      ref.current.value = ''
      setJoinRoomData({ ...joinRoomData })
      if (joinRoomData.username !== '') {
        socket.send(JSON.stringify(joinRoomData))
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
