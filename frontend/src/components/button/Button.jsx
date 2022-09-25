import React from 'react'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import './button.scss'

const Button = ({
  iconAlt,
  icon,
  text,
  onClick,
  classButton,
  iconClass,
}) => {
  const navigate = useNavigate()
  const iconType = classButton.includes('selected') ? icon[1] : icon[0]

  const buttonBehaviour = () => {
    if (onClick) {
      onClick()
    } else {
      navigate(`/${text.toLowerCase().replace(/\s/g, '')}`)
    }
  }

  return (
    <button
      type="button"
      className={`${classButton}`}
      onClick={() => buttonBehaviour()}
    >
      { icon.length > 0
        ? (
          <img
            className={iconClass}
            alt={iconAlt}
            src={iconType}
          />
        ) : '' }

      { text ? <span>{text}</span> : ''}
    </button>
  )
}

Button.propTypes = {
  iconAlt: PropTypes.string,
  icon: PropTypes.arrayOf(PropTypes.string),
  text: PropTypes.string,
  onClick: PropTypes.func,
  classButton: PropTypes.string,
  iconClass: PropTypes.string,
}

Button.defaultProps = {
  iconAlt: undefined,
  icon: [],
  text: undefined,
  onClick: undefined,
  classButton: '',
  iconClass: '',
}

export default Button
