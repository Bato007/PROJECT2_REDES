
class Rooms(object):
  def __init__(self, database) -> None:
    self.collection = 'users'
    self.roomsDB = database[self.collection]

  def addUser(self, username, roomID):
    pass
  
  def removeUser(self, username, roomID):
    pass
  
  def getAllUsers(self, roomID):
    pass

  def updatePublicStatus(self, username, status):
    pass

  def updatePublicStatus(self, username, status):
    pass
