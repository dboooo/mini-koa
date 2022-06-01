const Emitter = require('events')
const compose = require('../koa-compose')
const context = require('./context')
const request = require('./request')
const response = require('./response')
const http = require('http')

module.exports = class Application extends Emitter {
    constructor (options = {}) {
        super()
        this.middleware = []
        this.context = context
        this.response = response
        this.request = request
    }

    listen (...args) {
        const server = http.createServer(this.callback())
        return server.listen(...args)
    }

    use (fn) {
        this.middleware.push(fn)
        return this
    }

    callback () {
        const fn = compose(this.middleware)

        const handleRequest = (req,res) => {
            const ctx = this.createContext(req, res)
            return  this.handleRequest(ctx, fn)
        }

        return handleRequest
    }

    handleRequest (ctx, fnMiddleware) {
        const handleResponse = () => respond(ctx)

        return fnMiddleware(ctx).then(handleResponse).catch((err)=>{console.log(err);})
    }

    createContext (req, res) {
      const context = Object.create(this.context)
      const request = context.request = Object.create(this.request)
      const response = context.response = Object.create(this.response)

      context.app = request.app = response.app = this
      context.req = request.req = response.req = req
      context.res = request.res = response.res = res
      request.response = response
      response.request = request
      return context
    }
}

function respond (ctx) {
    // allow bypassing koa
    if (ctx.respond === false) return
  
    const res = ctx.res
    let body = ctx.body
    // responses
    if (Buffer.isBuffer(body)) return res.end(body)
    if (typeof body === 'string') return res.end(body)
    if (body instanceof Stream) return body.pipe(res)
  
    // body: json
    body = JSON.stringify(body)
    if (!res.headersSent) {
      ctx.length = Buffer.byteLength(body)
    }
    res.end(body)
}