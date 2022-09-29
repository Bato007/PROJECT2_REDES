import React from 'react'
import ReactDOM from 'react-dom'
import {
  Routes, Route, Navigate,
  BrowserRouter as Router,
} from 'react-router-dom'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import Home from './screens/Home/Home'
import Game from './screens/Game/Game'
import './theme.scss'

export const SocketContext = React.createContext(null);

const App = () => {

  // Create WebSocket connection.
  const [socket, setSocket] = React.useState(new WebSocket('ws://localhost:8081'))
  const [user, setUser] = React.useState('Requete')
  const [room, setRoom] = React.useState('ZSFBY')
  const [userAmount, setUserAmount] = React.useState(0)

  
  // Connection opened
  socket.onopen = async (e) => {
    console.log('Socket opened', e)
    socket.send(JSON.stringify({
      type: "room",
      action: "leave",
      roomID: "ZSFBY",
      username: "Requete"
    }))
  }

  return (
    <Router>
      <SocketContext.Provider value={{ socket: [socket, setSocket], user: [user, setUser], room: [room, setRoom], userA: [userAmount, setUserAmount] }}>
        <Routes>
          <Route path="/" element={(<Home />)} />
          <Route
            path="/game"
            element={(
              <DndProvider backend={HTML5Backend}><Game /></DndProvider>)}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </SocketContext.Provider>
    </Router>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
