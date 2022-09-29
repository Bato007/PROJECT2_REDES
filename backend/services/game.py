import itertools

class Game(object):
  def __init__(self, roomID, deck = None, users = [], deck_user = None) -> None:
    self.roomID = roomID
    self.deck = deck
    self.users = users
    self.usersDeck = deck_user

    # Draw
    self.lastUserDrawed = None
    self.lastCardDrawed = None
  
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
    return next(self.turns)

  def putCard(self):
    pass

  # Gets a new card of the deck
  def drawCard(self, username):
    drawedCard = self.deck.pop(0)
    self.lastCardDrawed = drawedCard
    self.lastUserDrawed = username

    # It's not a bomb
    if (drawedCard != 18):
      self.lastCardDrawed = drawedCard
      return {
        'card': drawedCard,
        'username': username,
        'turn': next(self.turns),
        'lost': False,
      }
    
    # It's a bomb
    userDeck = self.usersDeck[username]

    # Check for defuse
    index = -1
    for i in range(len(userDeck)):
      if (userDeck[i].id == 19):
        index = i
        break
    
    # User lost the game
    if (index == -1):
      # Removes this user
      del self.usersDeck[username]
      self.users.remove(username)

      turn = next(self.turns)
      self.getNewTurns(turn)  # Generates new turn

      return {
        'card': drawedCard,
        'username': username,
        'turn': turn,
        'lost': True,
      }

    return {
        'card': drawedCard,
        'username': username,
        'turn': username,
        'lost': False,
      }