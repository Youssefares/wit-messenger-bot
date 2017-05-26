# wit-messenger-bot
A class for using wit.ai with messenger platform + a conversation session setup with realm.

## Installation
```bash
npm install wit-messenger-bot
```
## What it does
This module makes use of the wrapper class at https://github.com/remixz/messenger-bot and integrates additional NLP functionality and actions from wit.ai. It comes with a default built-in "send" action for wit.ai you can use at your will.

It also has a simple persistent sessions setup to store & query conversation context by facebook id using the Realm SDK for Node, but you need not touch on this layer. You can use the code provided to jump straight to the logic for your facebook messenger chatbot.


## Functions
#### ```let bot = new WitMessengerBot(fbOptions, witOptions, botSessionsDelegate)```
Returns an instance of the WitMessengerBot class. This creates a wit instance & initializes your sessions setup.

`fbOptions` - Object
* `token` - String: Your Page Access Token, found in your App settings. Required.
* `verify` - String: A verification token for the first-time setup of your webhook. Optional, but will be required by Facebook when you first set up your webhook.
* `app_secret` - String: Your App Secret token used for message integrity check. If specified, every POST request  will be tested for spoofing. Optional.
_____

`witOptions` - Object

The Wit constructor takes the following parameters:
* `accessToken` - the access token of your Wit instance
* `actions` - the object with your actions
* `logger` - (optional) the object handling the logging.
* `apiVersion` - (optional) the API version to use instead of the recommended one

The `actions` object has action names as properties, and action functions as values.
Action implementations must return Promises (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
An implementation for the special action `send` is provided by default, if you don't provide your own in the actions object.
______

`botSessionsDelegate` - Object

A delegate to handle conversation context. To be an optional argument in the next versions, all you need is a `BotSessionsDelegate` instance, to compose the additional functionality.


This module class is a subclass of ["Bot"](https://github.com/remixz/messenger-bot), so head over there to see all extended functionality that you may call on the WitMessengerBot class as well.

<br><br>


#### ````runActions(sessionId, text, context, cb)````
A higher-level method to the Wit converse API. `runActions` resets the last turn on new messages and errors.

Takes the following parameters:
* `sessionId` - a unique identifier describing the user session
* `message` - the text received from the user
* `context` - the object representing the session state
* `cb` - call back on completion

Returns a promise. You may handle promise rejections from your defined actions or chain other functionalty here by `.then`ing your runActions call.



## Example

#TODO
