import socket

HOST = socket.gethostname()   # The server's hostname or IP address
PORT = 8081                   # The port used by the server

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.connect((HOST, PORT))
    s.sendall(b'{ "type": "room", "action": "join", "roomID": "ZSFBY", "username": "test-user" }')
    data = s.recv(1024)
    s.sendall(b'{ "type": "room", "action": "start", "roomID": "ZSFBY" }')
    data = s.recv(1024)


print(f"Received {data!r}")

# import mongo
# from services.room import Rooms

# # Init services
# database = mongo.connect()
# roomService = Rooms(database)
# roomService.startRoom('dsf')