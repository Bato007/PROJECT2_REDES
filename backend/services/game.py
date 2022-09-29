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
    self.lastCardDrawed = None

  def removeCard(self, username, cardID):
    index = self.getCardIndex(self.usersDeck[username], cardID)
    self.usersDeck[username].pop(index)

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

  def putCard(self, username, card):

    # Check the type of the card
    if (card['id'] == 1):
      pass
    elif (card['id'] == 2):
      pass
    elif (card['id'] == 3):
      pass
    elif (card['id'] == 4):
      pass

    # Shuffle Card
    elif (card['id'] == 6):
      random.shuffle(self.deck)
      self.removeCard(username, card['id'])

      return {
        'turn': self.currentTurn,
      }

    elif (card['id'] == 10):
      pass

    # Skip card
    elif (card['id'] == 13):
      self.currentTurn = next(self.turns)
      self.removeCard(username, card['id'])

      return {
        'turn': self.currentTurn,
      }

    elif (card['id'] == 18):
      pass
    elif (card['id'] == 19):
      
      index = self.getCardIndex(self.usersDeck[username], card['id'])
      pass


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