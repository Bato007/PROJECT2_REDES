import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Button from '../button/Button'

import cat from '../../../assets/cat.png'
import './list.scss'

const List = ({ items, saveSelection }) => {
  const [selectedTarget, setSelectedItem] = useState(0)
  const handleChange = (e) => {
    const { value } = e
    setSelectedItem(value)
  }

  return (
    <div className="popup-container">
      <h1>Choose your target:</h1>
      <div className="cat-container">
        <img src={cat} alt="cat" />
        <div className="list-container">
          {
        items.map((item) => (
          <div className="item-container">
            <input
              type="radio"
              id={item}
              value={item}
              onChange={handleChange}
              name="target"
            />
            <label htmlFor={item}>
              {item}
            </label>
          </div>
        ))
          }
        </div>
      </div>
      <Button
        onClick={() => saveSelection(selectedTarget)}
        text="Save"
        classButton="secondary-button"
      />
    </div>
  )
}

List.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
  saveSelection: PropTypes.func.isRequired,
}

export default List
