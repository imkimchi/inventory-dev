import Router from 'koa-router'
import User from '../models/user'
// import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'

const router = new Router()

const isProfilePic = ctx => ctx.request.body.profilepic
const getVal = ctx => isProfilePic(ctx) ? 'profilePic' : 'coverPic'

router.post('/user/image', async (ctx, next) => {
  let jwtToken = ctx.request.headers.authorization
  let decoded = await jwt.verify(jwtToken, 'RESTFULAPIs')
  let imageURL = ctx.request.files[0].path.split('views')[1]
  let updateVar = getVal(ctx)
  let dynamicSet = {}
  dynamicSet[updateVar] = imageURL

  let param = {
    search: {username: decoded.username},
    update: {$set: dynamicSet}
  }

  /* let res = */ await User.update(param.search, param.update)
  let URLpath = await ctx.request.files[0].path
  ctx.body = { url: URLpath }
})

export default router
