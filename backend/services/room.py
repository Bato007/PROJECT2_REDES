import json, random

class Rooms(object):
  def __init__(self, database) -> None:
    self.collection = 'rooms'
    self.roomsDB = database[self.collection]

  # Joins the user to a room
  def joinRoom(self, roomID, username):
    room = list(self.roomsDB.find({ 'roomID': roomID }))

    if (len(room) == 0): raise Exception('Room doesn\'t exist') 
    room = room[0]
    users = room['users'][:]

    # Controll checks
    if (username in users): raise Exception('User already registered') 
    if (len(users) >= 4): raise Exception('Room is full')

    # Gets the users and adds the new one
    users.append(username)

    updated = self.roomsDB.update_one(
        { '_id': room['_id'] },
        { '$set': { 'users': users } }
      )

    if (updated == False): raise Exception('Couldn\'t join room')
    return users

  # Joins the user to a room
  def leaveRoom(self, roomID, username):
    room = list(self.roomsDB.find({ 'roomID': roomID }))

    if (len(room) == 0): raise Exception('Room doesn\'t exist') 
    room = room[0]
    users = room['users'][:]

    # Controll checks
    if (username not in users): raise Exception('User is not registered') 

    # Gets the users and adds the new one
    users.remove(username)

    updated = self.roomsDB.update_one(
        { '_id': room['_id'] },
        { '$set': { 'users': users } }
      )

    if (updated == False): raise Exception('Couldn\'t leave room')

  # Gets all the cards and then shuffles them
  def startRoom(self, roomID):
    room = list(self.roomsDB.find({ 'roomID': roomID }))

    if (len(room) == 0): raise Exception('Room doesn\'t exist') 
    room = room[0]
    users = room['users'][:]

    # Get the cards on the deck
    f = open('deck.json')
    cards = json.load(f)

    # Now creates the decks
    deck = [] 
    defuses = []

    for card in cards:
      array = deck if card['id'] != 19 else defuses
      for _ in range(card['amount']):
          array.append(card)

    random.shuffle(deck)

    # Makes the game deck
    play_decks = []

    NON_DEFUSE_CARDS = 5
    for _ in users:
      user_deck = []
      user_deck.append(defuses.pop(0))
      for _ in range(NON_DEFUSE_CARDS):
        user_deck.append(deck.pop(0))
      play_decks.append(user_deck)

    # Now adds in a random position the 
    index = random.sample(range(0, len(deck)), len(defuses))
    for i in index:
      deck.insert(i, defuses.pop(0))

    return play_decks

if __name__ == '__main__':
  print(__name__)
