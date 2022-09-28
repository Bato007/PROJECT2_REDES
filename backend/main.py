import socket as sk
import json, asyncio
from time import sleep
from threading import Thread, Event

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
    print('[SERVER] Error Room:', e)
    return {
        'code': 404,
        'message': e,
      }

def sessionHandler(connection, address, quitEvent):
  loop = asyncio.new_event_loop()
  asyncio.set_event_loop(loop)
  with connection:
    print('[SERVER]: Started session for user:', address)
    while True:
        # Parent told to exit
        if (quitEvent.is_set()): break

        data = connection.recv(BUFFER_SIZE)
        if (not data): break                # If there is no more information
        message = data.decode('utf-8')      # Parse string

        try:
          request = json.loads(message)

          # Check the request type
          if (request['type'] == 'room'):
            response = loop.run_until_complete(roomHandler(request))

          connection.sendall(getMessage(json.dumps(response)))

        except:
          connection.sendall(getMessage('ERROR'))
          continue


# Conectando el socket
with sk.socket(sk.AF_INET, sk.SOCK_STREAM) as s:
  print('[SERVER] Started')
  s.bind((HOST, PORT))
  print('[SERVER] Bindend to port')
  s.listen()
  print('[SERVER] Listening from port:', PORT)
  quitEvent = Event()

  # Accepts all the requests of Socket connections
  while True:
    connection, address = s.accept()
    print('[SERVER] Accepted:', address, connection)
    session = Thread(target=sessionHandler, args=[connection, address, quitEvent])
    session.start()
    sessions.append(session)

