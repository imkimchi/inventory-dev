import compose from 'koa-compose'

import accountRouter from './account'
import mypageRouter from './mypage'
import imageRouter from './image'
import postRouter from './post'
import indexRouter from './indexPage'
import authRouter from './auth'
import myaccountRouter from './myaccount'
import messageRouter from './message'
import adminRouter from './admin'

const routes = [
  indexRouter,
  accountRouter,
  mypageRouter,
  imageRouter,
  postRouter,
  authRouter,
  myaccountRouter,
  messageRouter,
  adminRouter
]

export default () => compose([].concat(
  ...routes.map(r => [r.routes(), r.allowedMethods()])
))