import React from 'react'
import PropTypes from 'prop-types'
import cat from '../../../assets/rulesCat.png'
import close from '../../../assets/close.png'
import Button from '../../components/button/Button'
import './rules.scss'

const Rules = ({ closeRules }) => (
  <div className="rules-container">
    <Button onClick={() => closeRules()} icon={[close]} />
    <div className="bottom-container">
      <img src={cat} alt="cat" />
      <div className="rules-text">
        <h1>REGLAS</h1>
        <p>😿Pierdes cuando explotes! Evita a toda costa sacar un Exploding Kitten😿</p>
        <p>
          🙀Puedes evitar perder si tienes un Defuse, el cual te
          permitirá reordenar la carta de Exploding Kitten,
          es decir, si quieres que el siguiente turno pierda, deja la carta hasta encima
        </p>
        <p>
          😺En cada turno puedes poner cuantas cartas de tu mazo quieras, pero tu turno acaba
          cuando jales una carta de la baraja del centro
        </p>
        <p>
          😼Si tienes una carta de ataque, no debes de agarrar ninguna carta y el
          siguiente jugador tendrá que jugar dos turnos obligatoriamente
        </p>
        <p>
          😺La carta Shuffle es útil cuando sabes que viene un Exploding Kitten! Revuelve
          toda la baraja
        </p>
        <p>
          😼La carta Skip terminará tu turno de forma inmediata sin jalar ninguna carta de
          la baraja del centro. Si lo juegas como defensa de un Attack, solo termina uno
          de los dos turnos. Si juegas 2 Skip, terminará ambos turnos.
        </p>
        <p>
          😼See the future te permitirá darle un vistazo a las primeras 3 cartas de la
          baraja del centro
        </p>
        <p>
          😺Los gatos por si solos no tienen poder, pero si colocas de forma seguida 2 gatos
          de cualquier tipo, te permitirá robarle una carta aleatoria a cualquier jugador
        </p>
      </div>
    </div>
  </div>
)

Rules.propTypes = {
  closeRules: PropTypes.func,
}

Rules.defaultProps = {
  closeRules: () => {},
}

export default Rules
