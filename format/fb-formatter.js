//methods to polish the NLP data to conform to the message api & the templates therein
'use strict'

exports.formatQuickReplies = (quickreplies) => {
	let quick_replies
		if(quickreplies){

			quick_replies = []

			for(var reply of quickreplies){
				quick_replies.push({
					"content_type":"text",
					"title":reply,
					"payload": reply
				})
			}
	 }
	 return quick_replies
}
