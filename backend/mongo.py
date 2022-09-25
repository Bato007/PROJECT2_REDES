from pymongo import MongoClient

def connect():
  client = MongoClient("mongodb+srv://root:root@redes.da5gpu9.mongodb.net/?retryWrites=true&w=majority")
  return client['redes']
