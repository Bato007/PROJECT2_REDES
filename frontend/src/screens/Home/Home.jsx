import React, { useRef } from 'react'
import title from '../../../assets/title.png'
import Button from '../../components/button/Button'
import './home.scss'

const Home = () => {
  const ref = useRef()

  const checkNickname = (e) => {
    if (e.key === 'Enter' && ref.current.value !== '') {
      // eslint-disable-next-line no-console
      console.log('Nickname: ', ref.current.value)
    }
  }

  return (
    <div className="home">
      <img src={title} alt="title" />
      <div className="nickname-container">
        <input ref={ref} type="text" onKeyDown={checkNickname} placeholder="Nickname" />
        <Button classButton="primary-button" onClick={() => checkNickname({ key: 'Enter' })} text="Enter" />
      </div>
    </div>
  )
}

export default Home
