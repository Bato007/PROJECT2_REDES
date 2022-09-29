import websockets
import json, asyncio

# Import services
import mongo
from services.room import Rooms
from services.game import Game

PORT = 8081               # The port used by the server
BUFFER_SIZE = 1024

GAMES = {}

# Init services
database = mongo.connect()
roomService = Rooms(database)

def broadcast(roomID, response):
  try:
    _, connected = GAMES[roomID]
    print('[SERVER] Sending to', _.roomID, ':', response)
    websockets.broadcast(connected, json.dumps(response))
  except Exception as e:
    print('[ERROR] BROADCAST:', e)

async def roomHandler(request, websocket):
  try:
    # Creates a new room
    if (request['action'] == 'join'):
      users = roomService.joinRoom(request['roomID'], request['username'])

      # Add information of the user for the game
      if (request['roomID'] in GAMES):
        game, connected = GAMES[request['roomID']]
        game.addNewUser(request['username'])
        connected.add(websocket)
        GAMES[request['roomID']] =  game, connected

      else:
        game = Game(request['roomID'])
        game.addNewUser(request['username'])
        connected = {websocket}
        GAMES[request['roomID']] =  game, connected

      return {
        'code': 200,
        'type': 'room',
        'users': users,
      }

    elif (request['action'] == 'leave'):
      roomService.leaveRoom(request['roomID'], request['username'])

      # Leaves room
      game, connected = GAMES[request['roomID']]
      game.removeUser(request['username'])
      connected.remove(websocket)

      if (len(game.users) == 0):
        del GAMES[request['roomID']]
      else:
        GAMES[request['roomID']] =  game, connected

      return {
        'code': 200,
        'type': 'room',
      }

    elif (request['action'] == 'start'):
      decks = roomService.startRoom(request['roomID'])
      
      # Start new game
      game, connected = GAMES[request['roomID']]
      turn = game.setGame(decks['deck'], decks['player_deck'])
      GAMES[request['roomID']] = game, connected

      return {
        'code': 200,
        'decks': decks['player_deck'],
        'turn': turn,
        'type': 'room',
      }
    else: raise Exception('Not valid operation')
  
  # If there is an error
  except Exception as e:
    print('[ERROR] ON ROOM:', e)
    return {
        'code': 404,
        'message': str(e),
        'type': 'error',
      }

async def gameHandler(request):
  try:
    # Draws a card from the deck
    if (request['action'] == 'draw'):
      game, _ = GAMES[request['roomID']]
      action = game.drawCard(request['username'])
      return {
        'code': 200,
        'card': action['card'],
        'username': action['username'],
        'turn': action['turn'],
        'lost': action['lost'],
      }

    elif (request['action'] == 'put'):
      game, _ = GAMES[request['roomID']]
      action = game.putCard(request['username'])
      return {
        'code': 200,
        'card': action['card'],
        'username': action['username'],
        'turn': action['turn'],
        'lost': action['lost'],
      }

    else: raise Exception('Not valid operation')
  
  # If there is an error
  except Exception as e:
    print('[ERROR] ON ROOM:', e)
    return {
        'code': 404,
        'message': str(e),
        'type': 'error',
      }

async def chatHandler(request):
  try:
    # Creates a new message
    return {
      'code': 200,
      'type': 'chat',
      'roomID': request['roomID'],
      'sender': request['username'],
      'message': request['message'],
    }
  
  # If there is an error
  except Exception as e:
    print('[ERROR] ON CHAT:', e)
    return {
        'code': 404,
        'type': 'error',
        'message': str(e),
      }

async def sessionHandler(websocket):
  while True:
      # Parent told to exit
      message = await websocket.recv()

      try:
        request = json.loads(message)

        # Check the request type
        if (request['type'] == 'room'):
          response = await roomHandler(request, websocket)
          broadcast(request['roomID'], response)
        elif (request['type'] == 'game'):
          response = await gameHandler(request)
          broadcast(request['roomID'], response)
        elif (request['type'] == 'chat'):
          response = await chatHandler(request)
          broadcast(request['roomID'], response)

      except Exception as e:
        print('[ERROR] MAIN ERROR:', e)
        await websocket.send(json.dumps({
          'code': 404,
          'type': 'error',
          'message': 'Unexpected '
        }))
        continue

      except websockets.ConnectionClosedOK as e:
        print('[SERVER] Websocket closed', e)
        break

async def main():
  async with websockets.serve(sessionHandler, "", PORT):
    await asyncio.Future()  # run forever

if __name__ == "__main__":
  print('[SERVER] Started')
  print('[SERVER] Listening from port:', PORT)
  asyncio.run(main())
