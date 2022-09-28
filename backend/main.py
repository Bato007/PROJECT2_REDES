import socket as sk
import websockets
import json, asyncio

# Import services
import mongo
from services.room import Rooms

HOST = sk.gethostname()   # The server's hostname
PORT = 8081               # The port used by the server
BUFFER_SIZE = 1024

sessions = []

# Init services
database = mongo.connect()
roomService = Rooms(database)

def getMessage(value): return str.encode(value)

async def roomHandler(request):
  try:
    # Creates a new room
    if (request['action'] == 'join'):
      users = roomService.joinRoom(request['roomID'], request['username'])
      return {
        'code': 200,
        'users': users,
      }
    elif (request['action'] == 'leave'):
      roomService.leaveRoom(request['roomID'], request['username'])
      return {
        'code': 200,
      }
    elif (request['action'] == 'start'):
      decks = roomService.startRoom(request['roomID'])
      return {
        'code': 200,
        'deck': decks[0],
      }
    else: raise Exception('Not valid operation')
  
  # If there is an error
  except Exception as e:
    print('[ERROR] ON ROOM:', e)
    return {
        'code': 404,
        'message': e,
      }

async def roomHandler(request):
  try:
    # Creates a new room
    if (request['action'] == 'join'):
      users = roomService.joinRoom(request['roomID'], request['username'])
      return {
        'code': 200,
        'users': users,
      }
    elif (request['action'] == 'leave'):
      roomService.leaveRoom(request['roomID'], request['username'])
      return {
        'code': 200,
      }
    elif (request['action'] == 'start'):
      decks = roomService.startRoom(request['roomID'])
      return {
        'code': 200,
        'deck': decks[0],
      }
    else: raise Exception('Not valid operation')
  
  # If there is an error
  except Exception as e:
    print('[ERROR] ON ROOM:', e)
    return {
        'code': 404,
        'message': e,
      }

async def sessionHandler(websocket):
  print('WUUUUUUUUUUUU NEWWWWWWWWWWW')

  while True:
      # Parent told to exit

      message = await websocket.recv()

      try:
        request = json.loads(message)

        # Check the request type
        if (request['type'] == 'room'):
          response = await roomHandler(request)

        await websocket.send(getMessage(json.dumps(response)))

      except Exception as e:
        print('[ERROR] MAIN ERROR:', e)
        await websocket.send(getMessage('ERROR'))
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
