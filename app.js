const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const cors = require('koa2-cors')
const session = require('koa-session')

app.keys = ['secret'] // 這行是要生成 cookie 時使用的，也就是下方其中一個選項 signed 所需要
const sessionConfig = {
  key: 'koa:sess' /** cookie 金鑰 (string) (預設: koa:sess) */,
  /** (number || 'session') maxAge 是以毫秒為單位(1000 = 1 秒) (預設: 1 天) */
  /** 'session' 的相關設置將會影響到關閉瀏覽器清除 cookie or session */
  /** 注意: session cookie 若被竊取, 將會導致永不過期的問題 */
  maxAge: 86400000,
  autoCommit: true /** (boolean) 自動提交 header 資訊 (預設: true) */,
  overwrite: true /** (boolean) 可覆蓋若不覆蓋 (看不懂意思) (預設: true) */,
  httpOnly: true /** (boolean) 是否開啟 httpOnly，也就是要不要給 JavaScript 讀取  (預設: true) */,
  signed: true /** (boolean) 是否附上簽名 (看不懂意思) (預設: true) */,
  rolling: false /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (看不懂意思) (預設: is false) */,
  renew: true /** (boolean) 是否 session 即將到期時自動更新，也就是瀏覽器重新整理後會自動給予新的 session (建議給 true) (預設: is false)*/,
}

app.use(session(sessionConfig, app))

// error handler
onerror(app)

app.use(
  cors({
    origin: (ctx) => {
      if (ctx.url === '/') {
        return '*'
      }
      // return 'https://e-commerce-plat.herokuapp.com'
      return 'http://localhost:3000'
    }, // 允许这个域名的 跨域请求
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
  })
)

// middlewares
app.use(
  bodyparser({
    enableTypes: ['json', 'form', 'text'],
  })
)
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/src'))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

app.use(
  views(__dirname + '/views', {
    extension: 'pug',
  })
)

const index = require('./routes/index')
const commodity = require('./routes/commodity')
const shoppingCart = require('./routes/shoppingCart')
const shopCheckout = require('./routes/shopCheckout')

// routes
app.use(index.routes(), index.allowedMethods())
app.use(commodity.routes(), commodity.allowedMethods())
app.use(shoppingCart.routes(), shoppingCart.allowedMethods())
app.use(shopCheckout.routes(), shopCheckout.allowedMethods())

const PORT = process.env.PORT || '8081'
app.listen(PORT)
