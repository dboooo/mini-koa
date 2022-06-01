const Koa = require('./lib/application')

const app = new Koa()

app.use(async (ctx,next)=>{
    ctx.body = 'hello'
    console.log(1)
    await next()
    console.log(4)
})

app.use(async (ctx,next)=>{
    console.log(2);
    await next()
    console.log(3);
})

app.listen(8080)