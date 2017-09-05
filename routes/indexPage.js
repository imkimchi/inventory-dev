import mongoose from 'mongoose'
import Router from 'koa-router'
import Post from '../models/post'
import timeago from 'timeago.js'

const router = new Router()

//gotta add a check if user's logged in, for head-login
router.get('/', async (ctx, next) => {
    let renderData = await Post.find({}).sort({$natural:-1})
    await ctx.render('index', {data: addTimeAgo(renderData)})
})

function addTimeAgo(posts) {
    for(let post of posts) {
        let uploadDate = post.uploadDate
        post.timeAgo = timeago().format(uploadDate.getTime())
        post.classes.push(post.gender, post.market)
    }

    return posts
}

export default router