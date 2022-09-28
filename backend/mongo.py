from pymongo import MongoClient

def connect():
  client = MongoClient("mongodb+srv://root:root@redes.da5gpu9.mongodb.net/?retryWrites=true&w=majority")
  return client['redes']

if __name__ == '__main__':
  import json

  def createDeck():
    # database = mongo.connect()
    f = open('deck.json')
    deck = json.load(f)

    database = connect()
    collection = database['cards']

    collection.insert_many(deck)

  # createDeck()