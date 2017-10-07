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

        socket.on('offer', async data => {
            let identifier = data.offerPrice ? "counter" : "accept"

            console.log("data.offerPrice", data.offerPrice, "identifier", identifier)

            let decoded = await jwt.verify(data.jwt, 'RESTFULAPIs')
            let convo = await Convo.findOne({_id: data.id})
            let param = await makeMsgParam(data, convo, decoded, identifier)

            let message = new Message(param)
            let res = await message.save()

            if(identifier === 'accept') {
                await Convo.update({_id: convo._id}, {
                    $push : {"messages": res._id},
                    $set : { "offered" : false }
                })
            } else {
                await Convo.update({_id: convo._id}, {$push : {"messages": res._id}})
            }


            let msgInfo = {
                "convoId": data.id,
                "sender": decoded.username,
                "profilePic": param.profilePic,
                "description": data.desc ? data.desc : "",
                "sent_date": m(new Date()).format('LT'),
                "offerPrice": param.offerPrice ? param.offerPrice : "",
                "acceptOffer": param.acceptOffer ? param.acceptOffer : false,
                "counterOffer": param.counterOffer ? param.counterOffer : false
            }

            io.sockets.in(data.id).emit('offerHandle', msgInfo)
        })

        socket.on('chat', async data => {
            console.log("data", data)
            let decoded = await jwt.verify(data.jwt, 'RESTFULAPIs')
            let convo = await Convo.findOne({_id: data.id})
            let param = await makeMsgParam(data, convo, decoded)

            let message = new Message(param)
            let res = await message.save()

            await Convo.update({_id: convo._id}, {$push : {"messages": res._id}})

            let msgInfo = {
                "convoId": data.id,
                "sender": decoded.username,
                "profilePic": param.profilePic,
                "description": data.desc,
                "sent_date": m(new Date()).format('LT'),
                "offerPrice": param.offerPrice
            }

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

async function makeMsgParam (data, convo, decoded, acceptOrCounter) {
    const makeRecipient = (convo, sender) => convo.buyer === sender ? convo.seller : convo.buyer

    let user = await User.findOne({username: decoded.username})
    let post = await rp(`http://50.116.7.88/post/get/id/${convo._id}`)

    return {
        profilePic: user.profilePic,
        productURL: JSON.parse(post).productURL,
        sender: decoded.username,
        recipient: makeRecipient(convo, decoded.user),
        description: data.desc,
        offerPrice: data.offerPrice,
        acceptOffer: acceptOrCounter === "accept" && true,
        counterOffer: acceptOrCounter === "counter" && true
    }
}

export default chatFeature