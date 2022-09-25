import socket as sk
import json
from time import sleep
from threading import Thread, Event

HOST = sk.gethostname()   # The server's hostname
PORT = 8081               # The port used by the server
BUFFER_SIZE = 1024

sessions = []

def getMessage(value):
  return str.encode(value)


def sessionHandler(connection, address, quitEvent):
  with connection:
    while True:
        # Parent told to exit
        if (quitEvent.is_set()): break

        data = connection.recv(BUFFER_SIZE)
        if (not data): break                # If there is no more information
        message = data.decode('utf-8')      # Parse string

        try:
          request = json.loads(message)
          connection.sendall(json.dumps(request))
        except:
          connection.sendall(getMessage('ERROR'))
          continue


# Conectando al 
with sk.socket(sk.AF_INET, sk.SOCK_STREAM) as s:
  s.bind((HOST, PORT))
  s.listen()
  quitEvent = Event()

  # Accepts all the requests of Socket connections
  while True:
    connection, address = s.accept()
    session = Thread(target=sessionHandler, args=[connection, address, quitEvent])
    session.start()
    sessions.append(session)

    sleep(10)
    quitEvent.set()
    break
