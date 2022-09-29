import itertools

class Game(object):
  def __init__(self, roomID, deck = None, users = [], deck_user = None) -> None:
    self.roomID = roomID
    self.deck = deck
    self.users = users
    self.usersDeck = deck_user
  
  def addNewUser(self, user):
    self.users.append(user)
  
  def removeUser(self, user):
    self.users.remove(user)

  def setGame(self, deck, deck_users):
    self.turns = itertools.cycle(self.users)
    self.deck = deck
    self.usersDeck = deck_users
    return next(self.turns)

  # Gets a new card of the deck
  def drawCard(self, username):
    drawedCard = self.deck.pop(0)

    if (drawedCard != 18):
      self.usersDeck[username].append(drawedCard)
      return {
        'card': drawedCard,
        'username': username,
        'turn': next(self.turns),
      }

    print('holaaa')