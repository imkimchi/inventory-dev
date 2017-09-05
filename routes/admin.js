import Router from 'koa-router'

const router = new Router()

router.get('/admin', async (ctx, next) => {
    await ctx.render('admin/index')
})

export default router