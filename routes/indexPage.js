import mongoose from 'mongoose'
import Router from 'koa-router'
import Post from '../models/post'
import timeago from 'timeago.js'
import jwt from 'jsonwebtoken'

const router = new Router()
const isInclude = (arr, obj) => (arr.indexOf(obj) != -1)

//gotta add a check if user's logged in, for head-login
router.get('/', async (ctx, next) => {
    let cookies = ctx.headers.cookie
    let jwtToken = cookies.split('; ')[2].split('=')[1]
    let decoded = await jwt.verify(jwtToken, 'RESTFULAPIs')

    let renderData = await Post.find({}).sort({$natural:-1})
    let final = await fixedData(renderData, decoded)
    await ctx.render('index', {data: final})
})

async function fixedData(posts, decoded) {
    for(let post of posts) {
        let uploadDate = post.uploadDate
        post.timeAgo = timeago().format(uploadDate.getTime())
        post.classes.push(post.gender, post.market)

        if(isInclude(post.like.likedUsers, decoded.username)) {
            post.liked = true
        } else {
            post.liked = false
        }
    }

    return posts
}

export default router