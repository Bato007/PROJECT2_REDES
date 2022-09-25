import random, string

class Room(object):
  def __init__(self, database) -> None:
    self.collection = 'rooms'
    self.roomsDB = database[self.collection]

  # Creates a new room and auto-join the user who made the request
  def createRoom(self, username):
    roomID = ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(5))
    room = {
      'roomID': roomID,
      'users': [username],
    }

    self.roomsDB.insert_one(room)
    return roomID

  # Joins the user to a room
  def joinRoom(self, roomID, username):
    room = list(self.roomsDB.find({ 'roomID': roomID }))

    if (len(room) == 0): raise Exception('Room doesn\'t exist') 
    room = room[0]
    users = room['users'][:]

    # Controll checks
    if (username in users): raise Exception('User already registered') 
    if (len(users) >= 5): raise Exception('Room is full')

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

  def startRoom(self, roomID):
    pass
