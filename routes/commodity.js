const router = require('koa-router')()
const { query } = require('../dbConfig')
const shortid = require('shortid')
const multer = require('@koa/multer')()

router.get('/setCommodity', async (ctx, next) => {
  let commodityData = [
    {
      aid: shortid.generate(),
      title: '街頭彎曲字母印花圓領上衣',
      price: 999,
      imgPath: '/assets/image/coat.png',
      style: 'coat',
      color: ['white', 'black'].join(),
      size: ['M', 'L', 'XL'].join(),
    },
    {
      aid: shortid.generate(),
      title: '韓版嘻哈十字架印花寬鬆上衣',
      price: 799,
      imgPath: '/assets/image/coat.png',
      style: 'coat',
      color: ['white', 'black'].join(),
      size: ['M', 'L', 'XL'].join(),
    },
    {
      aid: shortid.generate(),
      title: '歐美重磅無袖純色連帽背心',
      price: 599,
      imgPath: '/assets/image/coat.png',
      style: 'coat',
      color: ['gray', 'black'].join(),
      size: ['M', 'L', 'XL'].join(),
    },
    {
      aid: shortid.generate(),
      title: '雙釦造型款高腰顯瘦牛仔長褲',
      price: 399,
      imgPath: '/assets/image/pants.png',
      style: 'pants',
      color: ['blue'].join(),
      size: ['S', 'M', 'L', 'XL', '3L'].join(),
    },
    {
      aid: shortid.generate(),
      title: '顯瘦反褶單扣直筒九分牛仔褲',
      price: 599,
      imgPath: '/assets/image/pants.png',
      style: 'pants',
      color: ['blue'].join(),
      size: ['S', 'M', 'L', 'XL'].join(),
    },
    {
      aid: shortid.generate(),
      title: '時尚大容量單肩斜背包',
      price: 499,
      imgPath: '/assets/image/accessories.png',
      style: 'accessories',
      color: ['silver', 'gold'].join(),
      size: ['null'].join(),
    },
  ]
  let sql =
    'INSERT INTO commodity(aid, title, price, imgPath, style, color, size) VALUES(?, ?, ?, ?, ?, ?, ?)'

  // commodityData.forEach( async (element) => {
  //   await query(sql, Object.values(element))
  // })

  ctx.body = 'upload success'
})

router.get('/getCommodityList', async (ctx, next) => {
  let sql = 'SELECT aid, title, price, imgPath, style FROM commodity LIMIT 3'
  let resSql = await query(sql)
  let resData = {}
  if (resSql[0] === undefined) {
    resData = {
      message: '沒有商品',
    }
  } else {
    resSql = JSON.parse(JSON.stringify(resSql))
    resData = {
      message: '有存貨',
      data: resSql,
    }
  }
  ctx.body = resData
})

router.post('/getCommodityItem', multer.array(), async (ctx, next) => {
  let req = {
    style: ctx.request.body.style,
    aid: ctx.request.body.aid,
  }
  console.log(req)
  let resSql
  if (req.aid === undefined) {
    // 搜尋商品類型
    let sql = 'SELECT aid, title, price, imgPath, style FROM commodity WHERE style = ?'
    resSql = await query(sql, req.style)
  } else {
    // 搜尋商品明細
    let sql =
      'SELECT title, price, imgPath, color, size FROM commodity WHERE style = ? AND aid = ?'
    resSql = await query(sql, Object.values(req))
  }

  let resData = {}
  if (resSql[0] === undefined) {
    resData = {
      message: '沒有商品',
    }
  } else {
    resSql = JSON.parse(JSON.stringify(resSql))
    resData = {
      message: '有存貨',
      data: resSql,
    }
  }
  ctx.body = resData
})

module.exports = router
