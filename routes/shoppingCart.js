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
  let sql =
    'SELECT users.data AS user, commodity.title AS title, commodity.price AS price ' +
    'FROM users JOIN commodity ON users.aid=commodity.aid WHERE uuid=?'
  let resSql = await query(sql, req.uuid)

  let resData = {}
  if (resSql[0] === undefined) {
    resData = {
      message: 'notData',
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
    aid: ctx.request.body.aid,
  }
  let sql = 'SELECT data FROM users WHERE uuid=?'
  let resSql = await query(sql, req.uuid)
  let resData = {}
  if (resSql[0] === undefined) {
    resData = {
      message: 'faild',
    }
  } else {
    sql = 'INSERT INTO users(uuid, data, aid) VALUES(?, ?, ?)'
    await query(sql, Object.values(req))
    resData = {
      message: 'add',
    }
  }
  ctx.body = resData
})

module.exports = router
