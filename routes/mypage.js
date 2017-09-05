import mongoose from 'mongoose'
import Router from 'koa-router'
import passport from 'koa-passport'
import Post from '../models/post'
import User from '../models/user'
import rp from 'request-promise'
import m from 'moment'
import jwt from 'jsonwebtoken'
import timeago from 'timeago.js'

const router = new Router({ prefix: '/u' })

mongoose.Promise = global.Promise;
mongoose.connection.on('error', (err) => {
    console.error('MongoDB error: %s', err);
});

router.get('/:userName', async (ctx, next) => {
    let jwtToken = ctx.header.authorization

    let userName = ctx.params.userName
    let itemReqOpt = optGenerator(`http://localhost:3000/post/count/${userName}`)
    let userReqOpt = optGenerator(`http://localhost:3000/u/get/${userName}`)

    let itemCount = await rp(itemReqOpt)
    let userData = await rp(userReqOpt)
    let posts = await Post.find({seller: userName}).sort({$natural:-1})
    let dateString = userData.data.joinedDate

    let renderData = {
        userName: userName,
        profilePic: userData.data.profilePic,
        coverPic: userData.data.coverPic,
        itemCount: itemCount.data,
        contentCount: itemCount.data, // forum content
        joinedDate: m(dateString).format('LL'),
        lastVisited: m(dateString).format('LL'), // gotta add
        posts: addTimeAgo(posts)
    }

    await ctx.render('form/form4', renderData)
})


router.get('/get/:id', async (ctx, next) => {
    let renderData = await User.findOne({username: ctx.params.id})
    ctx.body = { data: renderData }
})

function addTimeAgo(posts) {
    for(let post of posts) {
        let uploadDate = post.uploadDate
        console.log(typeof uploadDate, uploadDate)
        post.timeAgo = timeago().format(uploadDate.getTime())
    }

    return posts
}

function optGenerator(uri) {
    return {
        uri: uri,
        method: "GET",
        json: true
    }
}

export default router