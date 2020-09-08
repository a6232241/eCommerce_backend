const router = require('koa-router')()
const { query } = require('../dbConfig')
const multer = require('@koa/multer')()
const ecpay_payment = require('ECPAY_Payment_node_js')

router.post('/shopCheckout', multer.array(), async (ctx, next) => {
  let req = {
    userId: ctx.request.body.uuid,
  }
  let sql = 'SELECT * FROM shoppingcart WHERE userId=?'
  let resSql = await query(sql, req.userId)
  let resData = {}
  if (resSql[0] === undefined) {
    resData = {
      message: '付款失敗',
    }
  } else {
    resSql = JSON.parse(JSON.stringify(resSql))
    let totalAmountAll = 0
    resSql.forEach((e) => {
      totalAmountAll += e.totalAmount
    })
    let d = new Date()
    let year = d.getFullYear()
    let month = ('0' + (d.getMonth() + 1)).substr(-2)
    let date = ('0' + d.getDate()).substr(-2)
    let hours = ('0' + d.getHours()).substr(-2)
    let minutes = ('0' + d.getMinutes()).substr(-2)
    let seconds = ('0' + d.getSeconds()).substr(-2)
    let nowTime = `${year}/${month}/${date} ${hours}:${minutes}:${seconds}`

    let base_param = {
      MerchantTradeNo: 'f0a0sa9fabkkuy111', //請帶20碼uid, ex: f0a0d7e9fae1bb72bc93
      MerchantTradeDate: nowTime, //ex: 2017/02/13 15:45:30
      TotalAmount: totalAmountAll,
      TradeDesc: '測試交易描述',
      ItemName: '測試商品等',
      ReturnURL:
        'https://us-central1-qraft-app.cloudfunctions.net/dev-createSampleOrder',
      EncryptType: '1',
      // ChooseSubPayment: '',
      // OrderResultURL: 'http://192.168.0.1/payment_result',
      // NeedExtraPaidInfo: '1',
      // ClientBackURL: 'https://www.google.com',
      // ItemURL: 'http://item.test.tw',
      // Remark: '交易備註',
      // StoreID: '',
      // CustomField1: '',
      // CustomField2: '',
      // CustomField3: '',
      // CustomField4: ''
    }
    console.log(base_param)

    // // 若要測試開立電子發票，請將inv_params內的"所有"參數取消註解 //
    // let inv_params = {
    //   RelateNumber: 'SJDFJas97Gj11VOMSfK', //請帶30碼uid ex: SJDFJGH24FJIL97G73653XM0VOMS4K
    //   CustomerID: '', //會員編號
    //   CustomerIdentifier: '', //統一編號
    //   CustomerName: '測試買家',
    //   CustomerAddr: '測試用地址',
    //   CustomerPhone: '0123456789',
    //   CustomerEmail: 'johndoe@test.com',
    //   ClearanceMark: '2',
    //   TaxType: '1',
    //   CarruerType: '',
    //   CarruerNum: '',
    //   Donation: '2',
    //   LoveCode: '',
    //   Print: '1',
    //   InvoiceItemName: '測試商品1|測試商品2',
    //   InvoiceItemCount: '2|3',
    //   InvoiceItemWord: '個|包',
    //   InvoiceItemPrice: '35|10',
    //   InvoiceItemTaxType: '1|1',
    //   InvoiceRemark: '測試商品1的說明|測試商品2的說明',
    //   DelayDay: '0',
    //   InvType: '07',
    // }
    // let create = new ecpay_payment()
    // let res = create.payment_client.aio_capture(
    //   (parameters = base_param),
    //   (invoice = inv_params)
    // )
    // res
    //   .then(function (result) {
    //     console.log(result)
    //   })
    //   .catch(function (err) {
    //     console.log(err)
    //   })
  }
  ctx.body = resData
})

module.exports = router
