import mongoose from 'mongoose'
import Router from 'koa-router'
// import Post from '../models/post'
// import User from '../models/user'
// import rp from 'request-promise'
// import jwt from 'jsonwebtoken'
// import timeago from 'timeago.js'

const router = new Router()

mongoose.Promise = global.Promise
mongoose.connection.on('error', (err) => {
  console.error('MongoDB error: %s', err)
})

router.get('/myaccount/messages', async (ctx, next) => {
  await ctx.render('myaccount/message')
})

router.get('/myaccount/myitems', async (ctx, next) => {
  await ctx.render('myaccount/myitems')
})

router.get('/myaccount/history', async (ctx, next) => {
  await ctx.render('myaccount/history')
})

router.get('/myaccount/settings', async (ctx, next) => {
  await ctx.render('myaccount/settings')
})

export default router
