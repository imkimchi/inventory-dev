import Message from '../models/message'
import Convo from '../models/convo'
import User from '../models/user'
import jwt from 'jsonwebtoken'
import rp from 'request-promise'
import m from 'moment'
import config from '../config'

async function chatFeature (io) {
  let onlineUsers = []

  io.on('connection', async socket => {
    let isIploggedIn = onlineUsers.find(x => x === socket.handshake.address)
    if (!isIploggedIn) onlineUsers.push(socket.handshake.address)

    let jwtToken = socket.handshake.query.jwt
    let decoded = jwtToken ? await jwt.verify(jwtToken, config.token) : ''

    io.emit('users', {
      onlineUsers: onlineUsers.length,
      jwt: decoded,
      action: 'enter'
    })

    socket.on('online', () => {
      io.emit('users', {
        onlineUsers: onlineUsers.length,
        jwt: decoded,
        action: 'enter'
      })
    })

    socket.on('channel', id => {
      socket.join(id)
    })

    socket.on('quit', async data => {
      try {
        let allMessages = await Convo.findOne({_id: data.convoId})
        let newArr = allMessages.messages

        /* let res = */ await Message.update(
          { _id: { $in: newArr }, isRead: { $nin: [data.username] } },
          { $push: { isRead: data.username } },
          { multi: true }
        )
      } catch (e) {
        console.error('failed to update all messages', e)
      }

      socket.leave(data.convoId)
    })

    socket.on('offer', async data => {
      let decoded = await jwt.verify(data.jwt, config.token)
      let convo = await Convo.findOne({_id: data.id})
      let param = await makeMsgParam(data, convo, decoded, data.identifier)

      let message = new Message(param)
      let res = await message.save()

      if (data.identifier) {
        await Convo.update(
          {_id: convo._id},
          { $set: { 'offered': false, 'sold': true }, $push: {'messages': res._id} },
          {strict: false}
        )
      } else {
        await Convo.update({_id: convo._id}, {$push: {'messages': res._id}})
      }

      let msgInfo = {
        'convoId': data.id,
        'messageId': message._id,
        'sender': decoded.username,
        'profilePic': param.profilePic,
        'description': data.desc ? data.desc : '',
        'sent_date': m(new Date()).format('LT'),
        'offerPrice': param.offerPrice ? param.offerPrice : '',
        'acceptOffer': param.acceptOffer ? param.acceptOffer : false,
        'counterOffer': param.counterOffer ? param.counterOffer : false
      }

      io.sockets.in(data.id).emit('offerHandle', msgInfo)
    })

    socket.on('chat', async data => {
      let decoded = await jwt.verify(data.jwt, config.token)
      let convo = await Convo.findOne({_id: data.id})
      let param = await makeMsgParam(data, convo, decoded)

      let message = new Message(param)

      message.isRead.set(0, decoded.username)
      message.markModified('propChanged')

      let res = await message.save()
      if (param.offerPrice) {
        await Convo.update(
          {_id: convo._id},
          { $set: { 'offered': true }, $push: {'messages': res._id} },
          {strict: false}
        )
      } else {
        await Convo.update({_id: convo._id}, {$push: {'messages': res._id}})
      }

      let msgInfo = {
        'convoId': data.id,
        'messageId': message._id,
        'sender': decoded.username,
        'profilePic': param.profilePic,
        'description': data.desc,
        'sent_date': m(new Date()).format('LT'),
        'offerPrice': param.offerPrice
      }

      io.sockets.in(data.id).emit('message', msgInfo)
    })

    socket.on('disconnect', () => {
      onlineUsers = onlineUsers.filter(item => item !== socket.handshake.address)

      io.emit('users', {
        onlineUsers: onlineUsers.length,
        jwt: decoded,
        action: 'leave'
      })
    })
  })
}

async function makeMsgParam (data, convo, decoded, acceptOrCounter) {
  const makeRecipient = (convo, sender) => convo.buyer === sender ? convo.seller : convo.buyer

  let user = await User.findOne({username: decoded.username})
  let post = await rp(`http://50.116.7.88/post/get/id/${convo._id}`)

  return {
    profilePic: user.profilePic,
    productURL: JSON.parse(post).productURL,
    sender: decoded.username,
    recipient: makeRecipient(convo, decoded.username),
    description: data.desc,
    offerPrice: data.offerPrice,
    acceptOffer: acceptOrCounter === 'accept' && true,
    counterOffer: acceptOrCounter === 'counter' && true,
    isRead: [decoded.username]
  }
}

export default chatFeature
