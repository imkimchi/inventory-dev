import Router from 'koa-router'
import Post from '../models/post'
import User from '../models/user'
import jwt from 'jsonwebtoken'

const router = new Router()

router.post('/auth/decode', async (ctx, next) => {
  let data = ctx.request.body
  let decoded = await jwt.verify(data.jwt, 'RESTFULAPIs')
  let user = await User.findOne({username: decoded.username})
  decoded.itemCount = user.itemCount
  decoded.profilePic = user.profilePic

  ctx.body = decoded
})

router.post('/auth/jwt', async (ctx, next) => {
  let data = ctx.request.body

  let decoded = await jwt.verify(data.jwt, 'RESTFULAPIs')
  let post = await Post.findOne({productURL: data.url})

  if (post.seller === decoded.username) ctx.body = { data: 'approved' }
  else ctx.body = { data: 'Auth failed' }
})

export default router
