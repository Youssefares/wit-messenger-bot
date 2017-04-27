//dependencies
const request = require('request')
const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const {WitMessengerBot, BotSessionsDelegate} = require('../WitMessengerBot')


//custom actions to be called by wit instance per the stories
const actions = {
  get_random_fact: ({sessionId, context}) =>{
    return new Promise(function(resolve, reject){
      request('http://numbersapi.com/random/trivia', function(error, response, body){
        context.random_fact = body
        return resolve(context)
      })
    })
  }
}

//consts
const PAGE_ACCESS_TOKEN = "PAGE_ACCESS_TOKEN"
const WIT_ACCESS_TOKEN = "WIT_ACCESS_TOKEN"
const VERIFY_TOKEN = "VERIFY_TOKEN"

//WitMessengerBot instance
let bot = new WitMessengerBot({
  token: PAGE_ACCESS_TOKEN,
  verify: VERIFY_TOKEN
},{
  accessToken: WIT_ACCESS_TOKEN,
  actions: actions
}, new BotSessionsDelegate())


bot.on('error', (err) => {
    console.log("botError: "+err.message)
})

bot.on('message', (payload, reply) => {
    let text = payload.message.text
    let senderId = payload.sender.id
    let {sessionId, sessionData} = bot.findOrCreateSession(senderId)
    let context = JSON.parse(sessionData)


    //some interaction..
    //let user know the bot has seen the message
    bot.sendSenderAction(senderId, 'mark_seen', function(err, reply) {
        if (err) throw err
    })

    //let user know the bot is typing..
    bot.sendSenderAction(senderId, 'typing_on', function(err, reply) {
        if (err) throw err
    })

    bot.runActions(sessionId, text, context, (context) => {
      //conversation context logic
      context = {}

      //delete if(empty object), else update.
      if (Object.keys(context).length === 0 && context.constructor === Object){
        bot.deleteSession(sessionId)
      }
      else bot.writeSession(sessionId, JSON.stringify(context))

    }).catch(function(error){
			console.log(error)
		})
})

let app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

//Configing the way the server handles requests
app.get('/', (req, res) => {
    //when facebook hits this webhook with a GET, return verify token specified in bot instance.
    return bot._verify(req, res)
})

app.post('/', (req, res) => {
    bot._handleMessage(req.body)
    res.end(JSON.stringify({
        status: 'ok'
    }))
})

//creating server
http.createServer(app).listen(3000)
