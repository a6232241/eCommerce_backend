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
    shopping: ctx.request.body.shopping,
    userId: ctx.request.body.uuid,
  }
  let shopping = JSON.parse(req.shopping)

  // 取得全部的購物車資料、當前加入的商品名稱和價格
  let sql =
    'SELECT users.data AS data, users.totalAmount AS totalAmount, commodity.title AS title, commodity.price AS price ' +
    'FROM users JOIN commodity ON ?=commodity.aid WHERE uuid=?'
  let resSql = await query(sql, [shopping.aid, req.userId])
  let resData = {}
  if (resSql[0] === undefined) {
    resData = {
      message: 'faild',
    }
  } else {
    resSql = JSON.parse(JSON.stringify(resSql))[0]
    let shopAllData = resSql.data
    let totalAmount = shopping.amount * resSql.price + resSql.totalAmount

    // 以 String 來判斷目前有無資料
    if (shopAllData.length === 0) {
      sql = 'UPDATE users set data=?, totalAmount=? WHERE uuid=?'
      await query(sql, [JSON.stringify([shopping]), totalAmount, req.userId])
    } else {
      // 有資料則轉換為 JSON 來尋找相同的資料
      shopAllData = JSON.parse(shopAllData)
      let same = false
      shopAllData.forEach((e) => {
        // 如果有相同的資料則增加數量
        if (
          e.aid === shopping.aid &&
          e.colorVal === shopping.colorVal &&
          e.sizeVal === shopping.sizeVal
        ) {
          e.amount += shopping.amount
          same = true
        }
      })

      // 沒有相同的資料，則新增
      if (!same) {
        shopAllData.push(shopping)
      }

      // 最後更新資料
      sql = 'UPDATE users set data=?, totalAmount=? WHERE uuid=?'
      await query(sql, [JSON.stringify(shopAllData), totalAmount, req.userId])
    }

    resData = {
      message: 'add',
    }
  }
  ctx.body = resData
})

module.exports = router
