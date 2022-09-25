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
const draw = (user) => {
  return (
    {
      type: 'action',
      action: 'draw',
      username: user
    }
  )
}

/**
 * Ends the current turn of the player
 * @param {string} user 
 * @returns 
 */
const endTurn = (user) => {
  return (
    {
      type: 'action',
      action: 'end turn',
      username: user
    }
  )
}

/**
 * User loses.
 * Doesn't have more turns
 * @param {string} user 
 * @returns 
 */
const lose = (user) => {
  return(
    {
      type: 'action',
      action: 'lose',
      username: user
    }
  )
}

/**
 * User avoids losing by using a defuse card
 * @param {string} user 
 * @returns 
 */
const defuse = (user) => {
  return (
    {
      type: 'action',
      action: 'defuse',
      username: user
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
const shuffle = () => {
  return (
    {
      type: 'action',
      action: 'shuffle'
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
const attack = (user) => {
  return (
    {
      type: 'action',
      action: 'attack',
      username: user
    }
  )
}

/**
 * Skip turn without drawing card
 * Can skip 1 turn as a defense of an attack card
 * @returns 
 */
const skip = () => {
  return (
    {
      type: 'action',
      action: 'skip'
    }
  )
}

/**
 * The top 3 cards are revealed.
 * @param {string} user Who used the card, to reveal the 3 cards on top
 * @returns 
 */
const future = (user) => {
  return (
    {
      type: 'action',
      action: 'future',
      username: user
    }
  )
}

/**
 * If a user has 2 of these cards. He can choose another player to steal 2 random cards
 * @param {string} user 
 * @param {string} target 
 * @returns 
 */
const cat = (user, target) => {
  return (
    {
      type: 'action',
      action: 'steal',
      username: user,
      target: target
    }
  )
}