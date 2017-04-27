'use strict'
const {Wit, log} = require('node-wit')
const Bot = require('messenger-bot')
const {formatQuickReplies} = require('./format/fb-formatter')

//extends Bot from https://github.com/remixz/messenger-bot
//has wit.ai NLP functionality + messenger's SEND api.
class WitMessengerBot extends Bot{
	constructor(fbOptions, witOptions, botSessionsDelegate){
		super(fbOptions)

		//add the default send function as a function that calls the method: this.send
		witOptions.actions['send'] = (request, response) =>{
			return this.send(request, response)
		}

		//getting wit app instance with the actions defined
		this.witInstance = new Wit({
	    	accessToken: witOptions.accessToken,
				actions: witOptions.actions,
	    	logger: new log.Logger(log.DEBUG)
    })

		//to handle sessions
		this.botSessionsDelegate = botSessionsDelegate
	}

	//run actions of the wit.ai instance
	runActions(sessionId, text, context, completionHandler){
		var witMessengerBot = this
		return this.witInstance.runActions(sessionId,text,context).then(completionHandler)
	}


	//implementation of the wit.ai required send function with messenger platform sendMessage
	send(request,response){
		const{sessionId,context,entities} = request
		const recipientId = this.botSessionsDelegate.fbIdForSession(sessionId)
		const{text,quickreplies,confidence} = response
		let quick_replies = formatQuickReplies(quickreplies)

		var witMessengerBot = this
		return new Promise(function(resolve, reject){
			witMessengerBot.sendMessage(recipientId,{text,quick_replies},(err,info)=> {
				if(err) console.log(err)
			})
			return resolve()
		})
	}

	findOrCreateSession(fbid){
    return this.botSessionsDelegate.findOrCreateSession(fbid)
  }

  fbIdForSession(sessionId){
    return this.botSessionsDelegate.fbIdForSession(sessionId)
  }

  //modify existing session
  writeSession(sessionId, sessionData){
    this.botSessionsDelegate.write(sessionId, sessionData)
  }

  //delete session
  deleteSession(sessionId){
    this.botSessionsDelegate.delete(sessionId)
  }


}

module.exports = {
	WitMessengerBot: WitMessengerBot,
  BotSessionsDelegate: require('./user-sessions/sessions.js')
}
