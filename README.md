# PROJECT2_REDES
This is a small project that replicates the game [Exploding Kittens](https://www.explodingkittens.com/products/exploding-kittens-original-edition), but
this version doesn't support the *Nope* card. This supports multiple users and multiple tables. 

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
