const router = require('koa-router')()
const multer = require('@koa/multer')()
const GetPayment = require('../src/utils/getController')
const ModifyPayment = require('../src/utils/modifyController')

let getPayment = new GetPayment()
let modifyPayment = new ModifyPayment()

// 按下結帳 API
router.get('/paymentaction', multer.array(), getPayment.payAction)

// 銜接綠界的 Return_URL 回傳的資料
router.post('/payment', multer.array(), modifyPayment.paymentResult)

// 銜接綠界的 OrderResultURL
router.post(
  '/paymentactionresult',
  multer.array(),
  modifyPayment.paymentActionResult
)

module.exports = router
