import itertools, random

class Game(object):
  def __init__(self, roomID, deck = None, users = [], deck_user = None) -> None:
    self.roomID = roomID
    self.deck = deck
    self.users = users
    self.usersDeck = deck_user

    # Game state
    self.turn = None

    # Draw
    self.lastUserDrawed = None
    self.lastCardDrawed = { 'id': -1 }

    # Put
    self.lastUserPut = None
    self.lastCardPut = { 'id': -1 }

  def removeCard(self, username, cardID):
    # update put card
    self.lastUserPut = username

    index = self.getCardIndex(self.usersDeck[username], cardID)
    self.lastCardPut = self.usersDeck[username].pop(index)

  def getCardIndex(self, deck, cardID):
    for i in range(len(deck)):
      if (deck[i]['id'] == cardID):
        return i
    return -1

  def getNewTurns(self, turn):
    i = self.users.index(turn) + 1
    self.users = self.users[i:] + self.users[:i]
    self.turns = itertools.cycle(self.users)

  def addNewUser(self, user):
    self.users.append(user)
  
  def removeUser(self, user):
    self.users.remove(user)

  def setGame(self, deck, deck_users):
    self.turns = itertools.cycle(self.users)
    self.deck = deck
    self.usersDeck = deck_users
    self.currentTurn = next(self.turns)
    return self.currentTurn

  def putCard(self, username, card, target):

    # Check the type of the card
    stealCards = [1, 2, 3, 4]
    if (card['id'] in stealCards):

      # Check if can steal
      if (
        (self.lastCardPut['id'] == card['id']) and (self.lastUserPut == username)
      ):
        # Steal to target
        victim_deck = self.usersDeck[target]

        # Check if the user has at least 2 cards
        stealed_cards = []
        if (len(victim_deck) >= 2):
          index = random.sample(range(1, len(victim_deck)), 2)
          for i in index:
            stealed_cards.append(victim_deck.pop(i))
        else:
          for _ in victim_deck:
            stealed_cards.append(victim_deck.pop())

        # Add stealed cards
        userDeck = self.usersDeck[username]
        for card in stealed_cards:
          userDeck.append(card)

        return {
          'turn': self.currentTurn,
          'stealed': stealed_cards,
          'username': username,
          'target': target,
        }

      self.removeCard(username, card['id'])
      return {
        'turn': self.currentTurn,
        'username': username,
      }

    # Shuffle Card
    elif (card['id'] == 6):
      random.shuffle(self.deck)
      self.removeCard(username, card['id'])

      return {
        'turn': self.currentTurn,
      }

    # Target Attack
    elif (card['id'] == 10):
      card1 = self.drawCard(username)
      card2 = self.drawCard(username)

      if (card1['lost'] or card2['lost']):
        return {

        }

    # Skip card
    elif (card['id'] == 13):
      print(self.currentTurn)
      self.currentTurn = next(self.turns)
      print(self.currentTurn)
      self.removeCard(username, card['id'])

      return {
        'turn': self.currentTurn,
      }

    elif (card['id'] == 18):
      pass

    elif (card['id'] == 19):
      self.removeCard(username, card['id'])

      return {
        'deckSize': len(self.deck),
        'turn': self.currentTurn,
      }

    # See the future
    elif (card['id'] == 22):
      see_futer = self.deck[:3]

      # Removes card from deck
      self.removeCard(username, card['id'])
      
      return {
        'see_futer': see_futer,
        'turn': self.currentTurn,
      }

    else:
      raise Exception('No\'t valid card') 

  # Gets a new card of the deck
  def drawCard(self, username):
    drawedCard = self.deck.pop(0)
    self.lastCardDrawed = drawedCard
    self.lastUserDrawed = username

    # It's not a bomb
    if (drawedCard != 18):
      self.lastCardDrawed = drawedCard
      self.currentTurn = next(self.turns)
      return {
        'card': drawedCard,
        'username': username,
        'turn': self.currentTurn,
        'lost': False,
      }
    
    # It's a bomb
    userDeck = self.usersDeck[username]

    # Check for defuse
    index = -1
    for i in range(len(userDeck)):
      if (userDeck[i]['id'] == 19):
        index = i
        break
    
    # User lost the game
    if (index == -1):
      # Removes this user
      del self.usersDeck[username]
      self.users.remove(username)

      self.currentTurn = next(self.turns)
      self.getNewTurns(self.currentTurn)  # Generates new turn

      return {
        'card': drawedCard,
        'username': username,
        'turn': self.currentTurn,
        'lost': True,
      }

    return {
        'card': drawedCard,
        'username': username,
        'turn': username,
        'lost': False,
      }