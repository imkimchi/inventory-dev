import mongoose from 'mongoose'
import Router from 'koa-router'
import Post from '../models/post'
import User from '../models/user'
import Convo from '../models/convo'
import rp from 'request-promise'
import jwt from 'jsonwebtoken'
import timeago from 'timeago.js'

const router = new Router()
const postURL = ctx => ctx.request ? ctx.request.body.url : ctx.params.id

mongoose.Promise = global.Promise;
mongoose.connection.on('error', (err) => {
    console.error('MongoDB error: %s', err);
});

router.get('/post/get/id/:id', async (ctx, next) => {
    let id = ctx.params.id
    let convo = await Convo.findOne({_id: ctx.params.id})
    let post = await Post.findOne({_id: convo.product[0]})

    ctx.body = post
})

router.get('/post/get/url/:productURL', async (ctx, next) => 
    (ctx.body = await Post.findOne({productURL: ctx.params.productURL})))

router.get('/post/get/username/:username', async (ctx, next) => {
    let posts = await Post.find({seller: ctx.params.username})
    for(let i in posts) {
        posts[i].timeAgo = timeago().format(posts[i].uploadDate.getTime())
    }
    ctx.body = posts
})

router.get('/post/count/:id', async (ctx, next) => {
    let findQuery = {"seller": ctx.params.id}
    try {
        let itemCounts = await Post.find(findQuery).count()
        ctx.body = { data: itemCounts }
    } catch (e) {
        console.log("failed to get item account",  e)
    }
})

router.post('/post/image', async (ctx, next) => {
    let URLpath = await ctx.request.files[0].path
    ctx.body = { url: URLpath }
})

router.post('/post/upload', async (ctx, next) => {
    let data = ctx.request.body
    let jwtToken = ctx.request.headers.authorization

    let decoded = await jwt.verify(jwtToken, 'RESTFULAPIs')
    const param = await makeParam(data, decoded)

	try {
        const post = new Post(param)
        await post.save()
        await User.findOneAndUpdate({username: post.seller}, {$inc: {itemCount:1}}, {upsert: true})
        
        ctx.body = { url: param.productURL }
	} catch (e) {
		console.error("Failed to save post request", e, param)
	}
})

router.post('/post/delete', async (ctx, next) => { 
    try { 
        let post = await getPost(ctx)
        await User.findOneAndUpdate({username: post.seller}, {$inc: {itemCount: -1}}, {upsert: true})
        await post.remove() 
        ctx.body = {data: "success"} 
    } catch (e) {
        console.log("error is", e)
        ctx.body = {data: "Failed to remove the post", error: e} 
    } 
})

router.post('/post/edit', async (ctx, next) => {
    let data = ctx.request.body
    let jwtToken = ctx.request.headers.authorization

    let decoded = await jwt.verify(jwtToken, 'RESTFULAPIs')

    try {
        let originPost = await Post.findOne({productURL: data.url})
        console.log("originPost is", originPost)
        console.log("data.url is", data.url)

        const param = await makeParam(data, decoded, originPost)

        let res = await Post.update({_id: originPost._id}, param)
        console.log("update result:", res)
        ctx.body = { status: "success" }
    } catch(e) {
        console.log("error is:", e)
        ctx.body = { status: "failed", error: JSON.stringify(e) }
    }
})

router.get('/post/edit/:id', async (ctx, next) => {
    let data = ctx.params.id
    
    try {
        let post = await Post.findOne({productURL: data})
        await ctx.render('editPost', post)
    } catch (e) {
        console.log("failed to render", e)
        ctx.body = {data: "Failed to edit to post", error: e}
    }
})

router.get('/listings/:id', async (ctx, next) => {
    try {
        let postData = await Post.findOne({productURL: ctx.params.id})
        let sellerInfo = await User.findOne({username: postData.seller})
        let itemCounts = await rp(`http://localhost:3000/post/count/${postData.seller}`)

        let timeAgo = {
            uploadDate: timeago().format(postData.uploadDate.getTime()),
            editDate: (postData.editDate) ? timeago().format(postData.editDate.getTime()) : ""
        }

        await ctx.render('post', {"data": postData, "timeAgo": timeAgo, "itemCount": sellerInfo.itemCount})
    } catch (e) {
        console.error("failed to get post", e)
    }
})

async function getPost(ctx) {
    let data = postURL(ctx)
    let jwtToken = ctx.request.headers.authorization
    let decoded = await jwt.verify(jwtToken, 'RESTFULAPIs')
    let post = await Post.findOne({productURL: data})

    if(post.seller === decoded.username) return post
    else return false 
}

async function fixedImageObj(data, ismodify) {
    let newObj = {cover: "", subpics: []}
    let coverURL = data.cover
    let subURL = data.subpics

    let duplicated = await Post.findOne({"productImage.cover": data.cover}) 
    if(!duplicated) newObj.cover = coverURL.split('views')[1]
    else newObj.cover = coverURL

    for (let val of subURL) {
        let duplicated = await Post.findOne({"productImage.subpics": val})
        if(!duplicated) newObj.subpics.push(val.split('views')[1])
        else newObj.subpics.push(val)
    }

    console.log("newobj is", newObj)
    return newObj
}

async function makeParam(data, decodeJWT, originPost = false) {
	return {
        productTitle: data.productTitle,
        productSubTitle: data.productSubTitle,
		productSize: data.productSize,
		productImage: await fixedImageObj(data.productImage),
        productPrice: data.productPrice,
        productURL: makeURL(data.productTitle, originPost),
		productCategory: data.productCategory,
		shipping: data.shipping,
		seller: decodeJWT.username,
		description: data.description,
        market: data.market,
        gender: data.gender,
        paypalAccount: data.paypalAccount,
        buyItNow: data.buyItNow,
        acceptOffers: data.acceptOffers,
        sellerCountry: decodeJWT.username,
        editDate: editDate(originPost)
	}
}

const editDate = originPost => originPost ? new Date() : ""

function makeURL(title, originPost) {
    console.log("Original URL:", originPost.productURL)
    if(originPost) return originPost.productURL

    let fixedTitle = title.replace(/ /g, '-')
    let shortid = Math.random().toString(36).substr(2, 6)
    console.log(`${shortid}-${fixedTitle}`)
    return `${shortid}-${fixedTitle}`
}

export default router