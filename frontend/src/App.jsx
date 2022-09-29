/* eslint-disable react/jsx-no-constructed-context-values */
import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import {
  Routes, Route, Navigate,
  BrowserRouter as Router,
} from 'react-router-dom'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
// eslint-disable-next-line import/no-cycle
import Home from './screens/Home/Home'
// eslint-disable-next-line import/no-cycle
import Game from './screens/Game/Game'
import './theme.scss'
import Rules from './screens/Rules/Rules'

// eslint-disable-next-line import/prefer-default-export
export const SocketContext = React.createContext(null)

const App = () => {
  // Create WebSocket connection.
  const [socket, setSocket] = useState(new WebSocket('ws://localhost:8081'))
  const [user, setUser] = useState()
  const [room, setRoom] = useState()
  const [userAmount, setUserAmount] = useState(0)
  const [showRules, setRules] = useState(true)

  // Connection opened
  socket.onopen = async (e) => {
    // eslint-disable-next-line no-console
    console.log('Socket opened', e)
  }

  return (
    <Router>
      { showRules ? <Rules closeRules={() => setRules(false)} /> : ''}
      <SocketContext.Provider value={
        {
          socket: [socket, setSocket],
          user: [user, setUser],
          room: [room, setRoom],
          userA: [userAmount, setUserAmount],
        }
         }
      >
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
