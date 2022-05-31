const http = require('http')
const fn = require('./koa-compose')([])

const server = http.createServer((req, res)=>{
    res.write('hello world')
    return (fn) => {
        console.log(req,res)
        ctx = req + res
        return fn(ctx)
    }
})

server.listen(8080)