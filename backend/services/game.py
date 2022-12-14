import itertools, random

class Game(object):
  def __init__(self, roomID):
    self.roomID = roomID
    self.deck = None
    self.users = []
    self.usersDeck = None

    # Put
    self.lastUserPut = None
    self.lastCardPut = { 'id': -1 }

  def getUserLenDeck(self):
    sizeDecks = {}
    for deck in list(self.usersDeck.keys()):
      sizeDecks[deck] = len(self.usersDeck[deck])
    return sizeDecks

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
    self.users = list(deck_users.keys())[:]
    self.turns = itertools.cycle(self.users)
    self.deck = deck
    self.usersDeck = deck_users.copy()
    self.currentTurn = next(self.turns)
    return self.currentTurn

  def steal(self, username, target):
    if (len(self.usersDeck[target]) == 0):
      return {
        'turn': self.currentTurn,
        'username': username,
        'target': target,
        'pileSize': len(self.deck),
        'decksSize': self.getUserLenDeck(),
      }

    index = random.randint(0, len(self.usersDeck[target]) - 1)
    stealed = self.usersDeck[target].pop(index)
    self.usersDeck[username].append(stealed)

    return {
      'turn': self.currentTurn,
      'username': username,
      'card': stealed,
      'target': target,
      'pileSize': len(self.deck),
      'decksSize': self.getUserLenDeck(),
    }

  def putCard(self, username, card, target):
    # Check the type of the card
    stealCards = [1, 2, 3, 4]
    if (card['id'] in stealCards):

      # Check if can steal
      if (
        (self.lastCardPut['id'] in stealCards) and (self.lastUserPut == username)
      ):
        # Steal to target
        self.removeCard(username, card['id'])
        self.lastCardPut = { 'id': -1 }
        return {
          'turn': self.currentTurn,
          'username': username,
          'pileSize': len(self.deck),
          'decksSize': self.getUserLenDeck(),
          'steal': True,
        }

      self.removeCard(username, card['id'])
      return {
        'turn': self.currentTurn,
        'username': username,
        'pileSize': len(self.deck),
        'decksSize': self.getUserLenDeck(),
      }

    # Shuffle Card
    elif (card['id'] == 6):
      random.shuffle(self.deck)
      self.removeCard(username, card['id'])

      return {
        'turn': self.currentTurn,
        'pileSize': len(self.deck),
        'decksSize': self.getUserLenDeck(),
      }

    # Target Attack
    elif (card['id'] == 10):
      self.removeCard(username, card['id'])

      # Generates two moves
      self.currentTurn = next(self.turns)

      if (self.currentTurn != username):
        for _ in range(len(self.users) - 1):
          next(self.turns)
          
      return {
        'card': card,
        'username': username,
        'target': self.currentTurn,
        'turn': self.currentTurn,
        'pileSize': len(self.deck),
        'decksSize': self.getUserLenDeck(),
      }

    # Skip card
    elif (card['id'] == 13):
      self.currentTurn = next(self.turns)
      self.removeCard(username, card['id'])

      return {
        'pileSize': len(self.deck),
        'turn': self.currentTurn,
        'decksSize': self.getUserLenDeck(),
      }

    # Bomb card
    elif (card['id'] == 18):
      self.currentTurn = next(self.turns)

      # Insert the bomb
      self.deck.insert(target, card)

      return {
          'pileSize': len(self.deck),
          'turn': self.currentTurn,
          'decksSize': self.getUserLenDeck(),
        }

    # Defuse card
    elif (card['id'] == 19):
      self.removeCard(username, card['id'])

      return {
        'pileSize': len(self.deck),
        'turn': self.currentTurn,
        'decksSize': self.getUserLenDeck(),
      }

    # See the future
    elif (card['id'] == 22):
      see_futer = self.deck[:3]

      # Removes card from deck
      self.removeCard(username, card['id'])
      
      return {
        'pileSize': len(self.deck),
        'see_futer': see_futer,
        'turn': self.currentTurn,
        'decksSize': self.getUserLenDeck(),
      }

    else: raise Exception('No\'t valid card') 

  # Gets a new card of the deck
  def drawCard(self, username):
    drawedCard = self.deck.pop(0)

    # It's not a bomb
    if (drawedCard['id'] != 18):
      self.currentTurn = next(self.turns)
      self.usersDeck[username].append(drawedCard)
      return {
        'card': drawedCard,
        'username': username,
        'turn': self.currentTurn,
        'lost': False,
        'mustDefuse': False,
        'pileSize': len(self.deck),
        'decksSize': self.getUserLenDeck(),
      }
    
    # It's a bomb
    userDeck = self.usersDeck[username]

    # Check for defuse
    index = self.getCardIndex(userDeck, 19)

    # User lost the game
    if (index == -1):
      self.currentTurn = next(self.turns)
      
      # Removes this user
      del self.usersDeck[username]
      self.users.remove(username)

      self.getNewTurns(self.currentTurn)  # Generates new turn

      response = {
        'card': drawedCard,
        'username': username,
        'turn': self.currentTurn,
        'lost': True,
        'mustDefuse': False,
        'pileSize': len(self.deck),
        'decksSize': self.getUserLenDeck(),
      }

      # Check if this user won
      if (len(self.users) == 1):
        response['winner'] = self.users[0]

      return response

    return {
        'card': drawedCard,
        'username': username,
        'turn': self.currentTurn,
        'lost': False,
        'mustDefuse': True,
        'pileSize': len(self.deck),
        'decksSize': self.getUserLenDeck(),
      }