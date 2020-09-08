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

router.post('/getShoppingData', multer.array(), async (ctx, next) => {
  let req = {
    userId: ctx.request.body.uuid,
  }
  let sql =
    'SELECT * FROM shoppingcart WHERE userId=?'
  let resSql = await query(sql, req.userId)

  let resData = {}
  if (resSql[0] === undefined) {
    resData = {
      message: 'notData',
    }
  } else {
    resSql = JSON.parse(JSON.stringify(resSql))
    resData = {
      message: '取得購物車商品',
      data: resSql,
    }
  }
  ctx.body = resData
})

router.post('/addShoppingData', multer.array(), async (ctx, next) => {
  let req = {
    shopping: ctx.request.body.shopping,
    userId: ctx.request.body.uuid,
  }
  let shopping = JSON.parse(req.shopping)

  // 取得加入購物車的使用者、商品名稱、商品單一價格
  let sql =
    'SELECT users.uuid AS uuid, commodity.title AS title, commodity.price AS price ' +
    'FROM users JOIN commodity ON ?=commodity.aid WHERE uuid=?'
  let reqSql = {
    aid: shopping.aid,
    userId: req.userId,
  }
  let resSql = await query(sql, Object.values(reqSql))
  let resData = {}
  if (resSql[0] === undefined) {
    resData = {
      message: 'faild',
    }
  } else {
    // 確定有該使用者和商品
    resSql = JSON.parse(JSON.stringify(resSql))[0]
    let price = resSql.price
    let title = resSql.title

    // 找出是否有相同尺寸和顏色的商品
    reqSql = {
      userId: req.userId,
      aid: shopping.aid,
      color: shopping.colorVal,
      size: shopping.sizeVal,
    }
    sql =
      'SELECT * FROM shoppingcart WHERE userId=? AND aid=? AND color=? AND size=?'
    resSql = await query(sql, Object.values(reqSql))

    reqSql.title = title

    // 沒有資料則 INSERT，有則更新資料
    if (resSql[0] === undefined) {
      reqSql.amount = shopping.amount
      reqSql.totalAmount = shopping.amount * price
      sql =
        'INSERT INTO shoppingcart(userId, aid, color, size, title, amount, totalAmount) ' +
        'VALUES(?, ?, ?, ?, ?, ?, ?)'
    } else {
      reqSql = {
        amount: shopping.amount + resSql[0].amount,
        totalAmount: shopping.amount * price + resSql[0].totalAmount,
      }
      sql = 'UPDATE shoppingcart set amount=?, totalAmount=?'
    }

    await query(sql, Object.values(reqSql))

    // let shopAllData = resSql.data
    // let totalAmount = shopping.amount * resSql.price + resSql.totalAmount

    // 以 String 來判斷目前有無資料
    // if (shopAllData.length === 0) {
    //   sql = 'UPDATE users set data=?, totalAmount=? WHERE uuid=?'
    //   await query(sql, [JSON.stringify([shopping]), totalAmount, req.userId])
    // } else {
    //   // 有資料則轉換為 JSON 來尋找相同的資料
    //   shopAllData = JSON.parse(shopAllData)
    //   let same = false
    //   shopAllData.forEach((e) => {
    //     // 如果有相同的資料則增加數量
    //     if (
    //       e.aid === shopping.aid &&
    //       e.colorVal === shopping.colorVal &&
    //       e.sizeVal === shopping.sizeVal
    //     ) {
    //       e.amount += shopping.amount
    //       same = true
    //     }
    //   })

    //   // 沒有相同的資料，則新增
    //   if (!same) {
    //     shopAllData.push(shopping)
    //   }

    //   // 最後更新資料
    //   sql = 'UPDATE users set data=?, totalAmount=? WHERE uuid=?'
    //   await query(sql, [JSON.stringify(shopAllData), totalAmount, req.userId])
    // }

    resData = {
      message: 'add',
    }
  }
  ctx.body = resData
})

module.exports = router
