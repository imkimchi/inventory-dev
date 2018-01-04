import Router from 'koa-router'
import Post from '../models/post'
import User from '../models/user'
// import Convo from '../models/convo'
import Admin from '../models/admin'
import jwt from 'jsonwebtoken'
import config from '../util/config'

const router = new Router()
// const redirectToLogin = ctx => ctx.redirect('/admin/login')

router.get('/admin', async (ctx, next) => {
  if (!ctx.header.cookie) await ctx.redirect('/admin/login')
  let token = ctx.header.cookie.split(';')[0].split('=')[1]
  let decoded = await jwt.verify(token, config.token)
  let admin = await Admin.findOne({username: decoded.username})

  if (!admin || !admin.master) {
    await ctx.redirect('/admin/login')
  } else {
    let adminList = await Admin.find({})
    console.log('adminList', adminList)
    await ctx.render('admin/manage_list', {adminList: adminList})
  }
})

router.get('/admin/login', async (ctx, next) => {
  await ctx.render('admin/login')
})

router.post('/admin/signin', async (ctx, next) => {
  let userName = ctx.request.body.email
  let password = ctx.request.body.password

  try {
    let user = await Admin.findOne({'username': userName})
    if (user == null) ctx.body = {message: "Couldn't find your account"}
    if (!user.validatePassword(password)) {
      ctx.body = {message: 'Wrong password.'}
    } else {
      // let fullName = user.firstName + user.lastName
      ctx.body = {token: jwt.sign({ username: user.username, _id: user._id }, config.token)}
    }
  } catch (e) {
    console.error(e)
    ctx.body = { message: 'Authentication failed.' }
  }
})

router.post('/admin/signup', async (ctx, next) => {
  let data = ctx.request.body
  const param = await makeParam(data)

  try {
    const admin = new Admin(param)
    await admin.save()
    ctx.body = { success: true }
  } catch (e) {
    ctx.body = { success: false }
    console.error('Failed to signup', e, param)
  }
})

router.post('/admin/delete', async (ctx, next) => {
  let jwtToken = ctx.headers.authorization
  let data = ctx.request.body
  let decoded = await jwt.verify(jwtToken, config.token)
  let requester = await Admin.findOne({username: decoded.username})

  if (requester.master) {
    try {
      console.log('username', data.username)
      /* let admin = */ await Admin.remove({username: data.username})
      ctx.body = {success: true}
    } catch (e) {
      ctx.body = {success: false}
      console.error(e)
    }
  } else {
    ctx.body = {error: 'You are not admin master'}
  }
})

router.post('/admin/post/delete', async (ctx, next) => {
  let jwtToken = ctx.headers.authorization
  let data = ctx.request.body
  let decoded = await jwt.verify(jwtToken, config.token)
  let requester = await Admin.findOne({username: decoded.username})

  if (requester.master) {
    try {
      console.log('data', data.productTitle)
      let res = await Post.remove({productTitle: data.productTitle})
      console.log('res', res)
      ctx.body = {success: true}
    } catch (e) {
      ctx.body = {success: false}
      console.error(e)
    }
  } else {
    ctx.body = {error: 'You are not admin master'}
  }
})

router.get('/admin/board', async (ctx, next) => {
  let posts = []
  await ctx.render('admin/board_list', posts)
})

router.get('/admin/brand_edit', async (ctx, next) => {
  await ctx.render('admin/brand_edit')
})

router.get('/admin/board/regi', async (ctx, next) => {
  await ctx.render('admin/board_register')
})

router.get('/admin/board/theme', async (ctx, next) => {
  await ctx.render('admin/board_theme')
})

router.get('/admin/goods', async (ctx, next) => {
  let posts = await Post.find({})
  await ctx.render('admin/goods_list', {posts: posts})
})

router.get('/admin/goods/reg', async (ctx, next) => {
  await ctx.render('admin/goods_register')
})

router.get('/admin/cate/config', async (ctx, next) => {
  await ctx.render('admin/category_tree')
})

router.get('/admin/cate/config/brand', async (ctx, next) => {
  await ctx.render('admin/category_tree_brand')
})

router.delete('/admin/board/:name', async (ctx, next) => {
  let posts = await Post.remove({'productTitle': /ctx.body/})
  if (posts) { ctx.body = {'su': true} } else { ctx.body = {'su': false} }
})

router.get('/admin/board/config', async (ctx, next) => {
  let post = await Post.find()
  let posts = {'posts': post, 'length': post.length}
  await ctx.render('admin/article_list', posts)
})

router.get('/admin/member', async (ctx, next) => {
  let user = await User.find({})
  await ctx.render('admin/member_list', {users: user, memberLength: user.length})
})

router.get('/admin/order', async (ctx, next) => {
  await ctx.render('admin/order_list_all')
})

router.get('/admin/order_cancel', async (ctx, next) => {
  await ctx.render('admin/order_list_cancel')
})

router.get('/admin/member/daily', async (ctx, next) => {
  await ctx.render('admin/member_day')
})

router.get('/admin/oder/daily', async (ctx, next) => {
  await ctx.render('admin/order_day')
})

router.delete('/admin/member/:name', async (ctx, next) => {
  let query = {'': ''}
  /* let user = */ await User.remove(query)
  await ctx.render('admin/hackout_list')
})

function makeParam (data) {
  return {
    username: data.username,
    password: data.password,
    email: data.email,
    name: data.name
  }
}

export default router
