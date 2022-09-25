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

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={(<Home />)} />
      <Route
        path="/game"
        element={(
          <DndProvider backend={HTML5Backend}><Game /></DndProvider>)}
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  </Router>
)

ReactDOM.render(<App />, document.getElementById('root'))
