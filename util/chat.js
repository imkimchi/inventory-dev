import Message from '../models/message'
import Convo from '../models/convo'
import User from '../models/user'
import jwt from 'jsonwebtoken'
import rp from 'request-promise'
import m from 'moment'

async function chatFeature (io) {
    let onlineUsers = []
    
    io.on('connection', async socket => {
        let isIploggedIn = onlineUsers.find(x => x == socket.handshake.address)
        if(!isIploggedIn) onlineUsers.push(socket.handshake.address)

        let jwtToken = socket.handshake.query.jwt
        let decoded = jwtToken ? await jwt.verify(jwtToken, 'RESTFULAPIs') : ""

        console.log("Decoded", decoded)
        io.emit('users', {
            onlineUsers: onlineUsers.length,
            jwt: decoded,
            action: "enter"
        })

        socket.on('online', () => {
            io.emit('users', {
                onlineUsers: onlineUsers.length,
                jwt: decoded,
                action: "enter"
            })
        })

        socket.on('channel', id => {
            console.log("channel joined", id)
            socket.join(id)
        })
        
        socket.on('quit', id => {
            console.log("channel quit", id)
            socket.leave('quit')
        })
        
        socket.on('chat', async data => {
            let decoded = await jwt.verify(data.jwt, 'RESTFULAPIs')
            let convo = await Convo.findOne({_id: data.id})
            let param = await makeMsgParam(data, convo, decoded)

            console.log("profilePic after param", param.profilePic)
            let message = new Message(param)
            let res = await message.save()

            await Convo.update({_id: convo._id}, {$push : {"messages": res._id}})

            let msgInfo = {
                "convoId": data.id,
                "sender": decoded.username,
                "profilePic": param.profilePic,
                "description": data.desc,
                "sent_date": m(new Date()).format('LT')
            }
            console.log(msgInfo, msgInfo.convoId, data.id)

            io.sockets.in(data.id).emit('message', msgInfo)
        })
        
        socket.on('disconnect', () => {
            onlineUsers = onlineUsers.filter(item => item !== socket.handshake.address)
            
            io.emit('users', {
                onlineUsers: onlineUsers.length,
                jwt: decoded,
                action: "leave"
            })
        })
    })


}

async function makeMsgParam (data, convo, decoded, recipient) {
    const makeRecipient = (convo, sender) => convo.buyer === sender ? convo.seller : convo.buyer

    let user = await User.findOne({username: decoded.username})
    let post = await rp(`http://50.116.7.88/post/get/id/${convo._id}`)

    console.log("profilePic in makemsgParam", user.profilePic)
    return {
        profilePic: user.profilePic,
        productURL: JSON.parse(post).productURL,
        sender: decoded.username,
        recipient: makeRecipient(convo, decoded.user),
        description: data.desc,
        offerPrice: data.offerPrice
    }
}

export default chatFeature