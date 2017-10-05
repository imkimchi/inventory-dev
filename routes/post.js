import mongoose from 'mongoose'
import Router from 'koa-router'
import Post from '../models/post'
import Comment from '../models/comment'
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
console.log("convo", convo)
    let post = await Post.findOne({_id: convo.product[0]})
console.log("post", post, convo.product[0])
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


router.post('/post/bump', async (ctx, next) => {
    let data = ctx.request.body
    let jwtToken = ctx.request.headers.authorization
    let decoded = await jwt.verify(jwtToken, 'RESTFULAPIs')
    let savedDoc

    let post = await Post.findOne({productURL: data.url})
    post.remove()

    try {
        savedDoc = post
        savedDoc._id = mongoose.Types.ObjectId()
        savedDoc.uploadDate = Date.now()
        savedDoc.isNew = true
        savedDoc.save()

        ctx.body = { data: "success"}
    } catch (e) {
        console.log("failed", e)
    }
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

    console.log("data", data)
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
        let itemCounts = await rp(`http://50.116.7.88/post/count/${postData.seller}`)
        let allPosts = await Post.find({productURL: { $ne: ctx.params.id }}).limit(2).sort({$natural:-1})

        console.log("ctx.params.id", ctx.params.id)

        let commentArr = []

        for(let comment of postData.comments) {
            let object = await Comment.findOne({_id: comment})
            commentArr.push(object)
        }

        for(let post of allPosts) {
            post.timeAgo = timeago().format(post.uploadDate.getTime())
        }

        let timeAgo = {
            uploadDate: timeago().format(postData.uploadDate.getTime()),
            editDate: (postData.editDate) ? timeago().format(postData.editDate.getTime()) : ""
        }

        let renderData = {
            "data": postData,
            "moreItems": allPosts,
            "comments": commentArr,
            "timeAgo": timeAgo,
            "itemCount": sellerInfo.itemCount
        }
        await ctx.render('post', renderData)
    } catch (e) {
        console.error("failed to get post", e)
    }
})

router.post('/post/comment', async (ctx, next) => {
    let data = ctx.request.body
    let jwtToken = ctx.request.headers.authorization
    let decoded = await jwt.verify(jwtToken, 'RESTFULAPIs')
    let userInfo = await User.findOne({username: decoded.username})

    console.log(jwtToken)
    let param = {
        authorProfilePic: userInfo.profilePic,
        author: userInfo.username,
        description: data.description,
        postURL: data.postURL
    }

    console.log("data", data)
    let comment = new Comment(param)
    let res = await comment.save()
    let post = await Post.findOne({productURL: data.postURL})

    try {
        console.log("res_id", res._id)
        await Post.update({_id: post._id}, {$push : {"comments": res._id}})
        ctx.body = {success: true}
    } catch (e) {
        console.error(e)
        ctx.body = {success: false}
    }
})

const isInclude = (arr, obj) => (arr.indexOf(obj) != -1)


router.post('/post/like/', async (ctx, next) => {
    let data = ctx.request.body
    let jwtToken = ctx.request.headers.authorization

    let decoded = await jwt.verify(jwtToken, 'RESTFULAPIs')

    let post = await Post.findOne({productURL: data.productURL})
    let usersArray = post.like.likedUsers

    if(!isInclude(usersArray, decoded.username)) {
        await Post.update({ _id: post._id }, {
            $push : { "like.likedUsers" : decoded.username },
            $inc: { "like.likedCounts" : 1 } },
            { upsert: true })

        ctx.body = { history: false }
    } else {
        await Post.update({ _id: post._id }, {
                $pull : { "like.likedUsers" : decoded.username },
                $inc: { "like.likedCounts" : -1 } },
            { upsert: true })
        
        ctx.body = { history: true}
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

    console.log("coverURL", coverURL)
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