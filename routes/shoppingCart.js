const router = require('koa-router')()
const { query } = require('../dbConfig')
const multer = require('@koa/multer')()

router.get('/generateUUID', async (ctx, next) => {
  const uuidv4 = require('uuid').v4()
  let sql = 'INSERT INTO users(uuid) VALUES(?)'
  await query(sql, uuidv4)

  let resData = {
    message: 'ok',
    data: uuidv4,
  }
  ctx.body = resData
})

router.post('/getUUIDdata', multer.array(), async (ctx, next) => {
  let req = {
    uuid: ctx.request.body.uuid,
  }
  let sql = 'SELECT data FROM users WHERE uuid=?'
  let resSql = await query(sql, req.uuid)

  let resData = {}
  if (resSql[0] === undefined) {
    resData = {
      message: 'faild',
    }
  } else {
    resData = {
      message: 'good',
      data: resSql,
    }
  }
  ctx.body = resData
})

router.post('/addUUIDdata', multer.array(), async (ctx, next) => {
  let req = {
    uuid: ctx.request.body.uuid,
    shopping: ctx.request.body.shopping,
  }
  let sql = 'SELECT data FROM users WHERE uuid=?'
  let resSql = await query(sql, req.uuid)

  let resData = {}
  if (resSql[0] === undefined) {
    resData = {
      message: 'faild',
    }
  } else {
    resSql = JSON.parse(JSON.stringify(resSql[0]))
    let reqSqlData = resSql.data + req.shopping
    // sql = 'UPDATE users set data=? WHERE uuid=?'
    resData = {
      message: 'add',
    }
  }
  ctx.body = resData
})

module.exports = router
