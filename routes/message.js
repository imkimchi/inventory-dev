import Router from 'koa-router'
import Message from '../models/message'
import User from '../models/user'
import Post from '../models/post'
import Convo from '../models/convo'
import m from 'moment'
import jwt from 'jsonwebtoken'
import timeago from 'timeago.js'

let router = new Router()
const findConvo = async (convoId, choice) => await Convo.findOne({_id: convoId}).select({"messages": {"$slice": choice}})
const findMessage = async convo => await Message.findOne({_id: convo.messages[0]})

router.get('/convo/get/:id', async (ctx, next) =>
    (ctx.body = await Convo.findOne({_id: ctx.params.id})))

router.get('/message/latest/:id', async (ctx, next) => {
    let convoId = ctx.params.id
    let convo = await findConvo(convoId, -1)
    let starter = await findConvo(convoId, 1)

    let oldestMessage = await findMessage(starter)
    let latestMessage = await findMessage(convo)

    let timeAgo = timeago().format(latestMessage.createdDate.getTime())

    ctx.body = {"msg": latestMessage, "timeAgo": timeAgo, "convoStarter": oldestMessage.sender}
})

router.get('/message/get/:username', async (ctx, next) => {
    let username = ctx.params.username
    let findQuery = {$or: [ {'seller': username}, {'buyer': username}]}
    let AllConvos = await Convo.find(findQuery)

    ctx.body = AllConvos
})

router.get('/message/list/:id', async (ctx, next) => {
    let convoId = ctx.params.id
    let convo = await Convo.findOne({_id: convoId})
    let messages = []

    for(let id of convo.messages) {
        let foundMessage = await Message.findOne({_id: id})
        foundMessage.timeAgo = await m(foundMessage.createdDate.getTime()).format('LT')
        messages.push(foundMessage)
    }
    
    ctx.body = messages
})

router.get('/message/offer/:seller/:productURL', async (ctx, next) => 
    (await ctx.render('mypage/offer')))

router.get('/message/question/:seller/:productURL', async (ctx, next) =>
    (await ctx.render('mypage/question')))

router.post('/message/offer', messageHandler)
router.post('/message/question', messageHandler)

async function messageHandler (ctx, next) {
    let data = ctx.request.body
    let jwtToken = ctx.request.headers.authorization

    let decoded = await jwt.verify(jwtToken, 'RESTFULAPIs')
    const msgParam = await makeMsgParam(data, decoded)
    const convoParam = await makeconvoParam(data, decoded)
    const post = await Post.findOne({productURL: data.productURL})
 
	try {
        const convo = new Convo(convoParam)
        const message = new Message(msgParam)
        
        let res = await message.save()
        
        convo.messages.push(res._id)
        convo.product.push(post._id)

        await convo.save()
        ctx.body = {"success": true}
    } catch (e) {
        console.log("failed to send an offer", e)
        ctx.body = {"success": false}
    }
}

async function makeconvoParam (data, decoded) {
    return {
        seller: data.recipient,
        buyer: decoded.username
    }
}

async function makeMsgParam (data, decoded) {
    let user = await User.findOne({username: decoded.username})

    return {
        profilePic: user.profilePic,
        productURL: data.productURL,
        sender: decoded.username,
        recipient: data.recipient,
        description: data.description,
        offerPrice: data.offerPrice
    }
}

export default router