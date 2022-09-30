# PROJECT2_REDES
This is a small project that replicates the game [Exploding Kittens](https://www.explodingkittens.com/products/exploding-kittens-original-edition), but
this version doesn't support the *Nope* card, *Favor* card,  *Cumulative attacks* or *Special Combos*.

## Live
https://xptngkittens.xyz/

## Frontend
Rules are displayed once user enters the website
![image](https://user-images.githubusercontent.com/28350445/193164361-6a03e716-126c-46ad-92d5-2767b1ca473b.png)

Available rooms are displayed and username is asked
![image](https://user-images.githubusercontent.com/28350445/193164383-127e0467-eae5-4a08-bf7e-dbd508310165.png)

Players shouuld wait until table is complete (4 players are joined)
![image](https://user-images.githubusercontent.com/28350445/193164437-cf242fa7-17e7-43b0-82fc-d4d5980944d3.png)

The game is played by turns, each player has 8 initial cards and a public active status
![image](https://user-images.githubusercontent.com/28350445/193164595-2c577531-bdbd-45fe-8b28-ad4ec9216b0c.png)

Players can chat between them
![image](https://user-images.githubusercontent.com/28350445/193164640-1620fa57-f44e-40e0-8a8a-5877a0b5f09c.png)

You can steal a card from a selected player!
![image](https://user-images.githubusercontent.com/28350445/193164703-fe29d52b-9361-4581-bbcc-6e3aa526b934.png)

See future cards
![image](https://user-images.githubusercontent.com/28350445/193164717-58b2cc73-17cd-4e36-b01d-db13928aa412.png)

Once an exploding kitten is draw, you should use a diffuse card *if you have one*
![image](https://user-images.githubusercontent.com/28350445/193164783-5d63913b-bdeb-40aa-9053-6e205ab07354.png)

or loose!
![image](https://user-images.githubusercontent.com/28350445/193164794-15fe36ff-3924-4ebc-8b32-0950ff131e0f.png)


The table is updated on real time based on user current status and current cards
![image](https://user-images.githubusercontent.com/28350445/193164854-7f42d607-7b60-4f7d-95f4-64ba56798907.png)


What are you waiting for? Start playing exploding kittens online now: https://xptngkittens.xyz/



## Models

### Card model
```
{
  "id": 1,
  "ID": "dksafj32t32klj23jk",
  "name": "Zombie Cat",
  "amount": 6,
  "src": "https://storage.googleapis.com/assets_xkittens/1.jpeg"
}
```

## Protocol

### **1. Join Room**

#### Client request
```
{
  type: "room",
  action: "join",
  roomID: "JK32I",
  username: "test-user"
}
```

#### Server response
```
{
  code: 200,
  'type': 'room',
  users: ['user1', 'user2', 'user3']
}
```

### **2. Exit Room**

#### Client request
```
{
  type: "room",
  action: "leave",
  roomID: "JK32I",
  username: "test-user"
}
```

#### Server response
```
{
  code: 200,
  type: "room"
}
```

### **3. Start Game**

#### Client request
```
{
  type: "room",
  action: "start",
  roomID: "ID"
}
```

#### Server response
```
{
  code: 200,
  type: "room",
  turn: "test-user",
  decks: { "test-user": [{Card model}]
}
```

### **4. Chat**

#### Client request
```
{
  type: "chat",
  roomID: "ID",
  sender: "test-user",
  message: "Test message"
}
```

#### Server response
```
{
  code: 200,
  type: "chat",
  roomID: "ID",
  sender: "test-user",
  message: "Test message"
}
```

### **5. Draw Card**

#### Client request
```
{
  type: "game",
  action: "draw",
  roomID: "ID",
  username: "test-user"
}
```

#### Server response
```
{
  code: 200,
  type: "game",
  card: Card Model,
  username: "test-user",
  turn: "test-user2",
  lost: False
}
```

### **6. Put Card**

#### Client request
```
{
  type: "game",
  action: "put",
  roomID: "ID",
  username: "test-user",
  card: Card Model,
  target: "test-user"   # Required when attack, steal or put a bomb (this is an index, the other two are the usernames)
}
```

#### Server response
```
{
  code: 200,
  type: "game",
  card: Card Model,
  username: "test-user",
  turn: "test-user",
  futureCards: [Card Model]   # If future card was sent
  target: "test-user2"        # If steal this is the victim 
  stealed: [Card Model]       # The stealed cards from the victim/target
  deckSize: 10                # Length of the deck
  targetCards: [Card Model]   # Attack cards
}
```

### **ERROR MESSAGE**

#### Server response
```
{
  code: 404,
  type: "error",
  message: "Error text"
}
```



## Installation
Python and NodeJS are neeeded for this project to run. Clone this repository and install the following dependencies:

```
cd backend
pip install websockets==10.3
pip install pymongo==4.2.0
python ./main.py
```

```
cd frontend
npm install
npm start
```

*** Note: Backend should be started before frontend for socket to work correctly

