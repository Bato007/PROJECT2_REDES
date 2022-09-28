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

  return (
    <Router>
      <SocketContext.Provider value={socket}>
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
