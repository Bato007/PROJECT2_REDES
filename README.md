# PROJECT2_REDES
This is a small project that replicates the game [Exploding Kittens](https://www.explodingkittens.com/products/exploding-kittens-original-edition), but
this version doesn't support the *Nope* card. This supports multiple users and multiple tables. 

## Protocol


### **1. Create Room**

#### Client request
```
{
  type: "room",
  action: "create",
  username: "test-user"
}
```

#### Server response
```
{
  code: 200,
  roomID: "JK32I"
}
```

### **2. Join Room**

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
  code: 200
}
```

### **3. Exit Room**

#### Client request
```
{
  type: "room",
  action: "leave",
  roomID: "JK32I"
}
```

#### Server response
```
{
  code: 200
}
```

### **4. Start Game**

#### Client request
```
{
  type: "room",
  action: "start"
}
```

#### Server response *To all users in room*
```
{
  code: 200,
  pending...
}
```

