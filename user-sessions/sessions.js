//importing realm
const Realm = require('realm');

//defining model
const UserSchema = {
  name: 'User',
  primaryKey: 'id',
  properties: {
    id: 'string',
    sessionId: 'string',
    sessionData: 'string'
  }
}



class BotSessionsDelegate {
  constructor() {
    //realm instance
    this.realm = new Realm({schema: [UserSchema]})
    this.users = this.realm.objects('User')
  }

  findOrCreateSession(fbid){
    let filtered_users = this.users.filtered('id = $0', fbid)
    let realm = this.realm
    //if nothing found
    if(filtered_users.length == 0){

      //create new id & user
      let newSessionId = new Date().toISOString()
      realm.write(() => {
        realm.create('User', {
          id: fbid,
          sessionId: newSessionId,
          sessionData: JSON.stringify({})
        })
      })
      return {sessionId: newSessionId, sessionData: JSON.stringify({})}
    }

    //return found sessionId
    else return {sessionId: filtered_users[0].sessionId, sessionData: filtered_users[0].sessionData}
  }

  fbIdForSession(sessionId){
    return this.users.filtered('sessionId = $0', sessionId)[0].id
  }

  //modify existing session
  write(sessionId, sessionData){
    let user = this.users.filtered('sessionId = $0', sessionId)[0]
    let realm = this.realm

    //overriding
    realm.write(() =>{
      realm.create('User', {
        id: user.id,
        sessionId: user.sessionId,
        sessionData: sessionData
      }, true)
    })

  }

  //delete session
  delete(sessionId){
    let user = this.users.filtered('sessionId = $0', sessionId)[0]
    let realm = this.realm

    realm.write(() =>{
      realm.delete(user)
    })

  }
}

module.exports = BotSessionsDelegate
