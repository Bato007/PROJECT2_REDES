
class Users(object):
  def __init__(self, database) -> None:
    self.collection = 'users'
    self.userDB = database[self.collection]

  def addUser(self, username, roomID):
    self.userDB.insert_one({
      'username': username,
      'roomID': roomID,
      'status': 1,
      'isPrivate': 0,
    })
  
  def removeUser(self, username, roomID):
    self.userDB.delete_one({
      'username': username,
      'roomID': roomID,
    })

  def removeAll(self):
    self.userDB.delete_many({})
  
  def getAllUsers(self, roomID):
    return list(self.userDB.find({ 'roomID': roomID }))

  def updatePublicStatus(self, username, roomID, status):
    self.userDB.update_one(
        { 'username': username, 'roomID': roomID },
        { '$set': { 'status': status } }
      )
    return self.getAllUsers(roomID)

  def updatePrivateStatus(self, username, roomID, status):
    self.userDB.update_one(
        { 'username': username, 'roomID': roomID },
        { '$set': { 'isPrivate': status } }
      )
    return self.getAllUsers(roomID)
