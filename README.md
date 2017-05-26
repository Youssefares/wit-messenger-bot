# wit-messenger-bot
A class for using wit.ai with messenger platform + a conversation session setup with realm.

## Installation
```bash
npm install wit-messenger-bot
```
## simple but fully functional
This module makes use of the wrapper class at https://github.com/remixz/messenger-bot and integrates additional NLP functionality and actions from wit.ai. 
It also has a simple persistent sessions setup to store & query conversation context by facebook id using the Realm SDK for Node, but you need not touch on this layer.

