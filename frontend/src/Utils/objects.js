/**
 * 
 * Ending turn actions
 * 
 */
/**
 * Draw action.
 * if card == explodingKitten and defuse not in hand:
 *    lose()
 * else if card == explodingKitten and defuse in hand:
 *    playDefuse()
 * else if card != explodingKitten:
 *    endTurn()
 * @param {string} user 
 * @returns 
 */
const draw = (user, roomId) => {
  return (
    {
      type: 'action',
      action: 'draw',
      username: user,
      roomid: roomId
    }
  )
}

/**
 * User avoids losing by using a defuse card
 * @param {string} user 
 * @returns 
 */
const defuse = (user, roomId) => {
  return (
    {
      type: 'action',
      action: 'defuse',
      username: user,
      roomid: roomId
    }
  )
}

/**
 * 
 * CARD ACTION OBJECTS
 * 
 */

/**
 * Shuffle the Draw pile thoroughly. (Useful when you know there's an Exploding Kitten coming.)
 * @returns 
 */
const shuffle = (roomId) => {
  return (
    {
      type: 'action',
      action: 'shuffle',
      roomid: roomId
    }
  )
}

/**
 * Do not draw any cards.
 * Next player plays two turns in a row
 * Can be stacked (the user that received the attack, can play an attack and the next one
 * plays the sum of turns. e.g. 4 then 6, and so on)
 * @param {string} user Who used the card (against the next in line)
 * @returns 
 */
const attack = (user, roomId) => {
  return (
    {
      type: 'action',
      action: 'attack',
      username: user,
      roomid: roomId
    }
  )
}

/**
 * Skip turn without drawing card
 * Can skip 1 turn as a defense of an attack card
 * @returns 
 */
const skip = (user, roomId) => {
  return (
    {
      type: 'action',
      action: 'skip',
      username: user,
      roomid: roomId
    }
  )
}

/**
 * The top 3 cards are revealed.
 * @param {string} user Who used the card, to reveal the 3 cards on top
 * @returns 
 */
const future = (user, roomId) => {
  return (
    {
      type: 'action',
      action: 'future',
      username: user,
      roomid: roomId
    }
  )
}

/**
 * If a user has 2 of these cards. He can choose another player to steal 2 random cards
 * @param {string} user 
 * @param {string} target 
 * @returns 
 */
const cat = (user, target, roomId) => {
  return (
    {
      type: 'action',
      action: 'steal',
      username: user,
      target: target,
      roomid: roomId
    }
  )
}

export { draw, defuse, shuffle, attack, skip, future, cat }