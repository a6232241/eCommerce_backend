const { query } = require('../../dbConfig')
const ecpay_payment = require('ECPAY_Payment_node_js')
const url = require('./url')
// const short = require('short-uuid')
// const translator = short(short.constants.cookieBase90, {
//   consistentLength: false,
// })
const nowTime = () => {
  let d = new Date()
  let year = d.getFullYear()
  let month = ('0' + (d.getMonth() + 1)).substr(-2)
  let date = ('0' + d.getDate()).substr(-2)
  let hours = ('0' + d.getHours()).substr(-2)
  let minutes = ('0' + d.getMinutes()).substr(-2)
  let seconds = ('0' + d.getSeconds()).substr(-2)

  return `${year}/${month}/${date} ${hours}:${minutes}:${seconds}`
}

class GetPayment {
  async payAction(ctx, next) {
    let req = {
      userId: ctx.query.uuid,
    }
    let sql = 'SELECT * FROM shoppingcart WHERE userId=?'
    let resSql = await query(sql, req.userId)
    let resData = {}
    if (resSql[0] === undefined) {
      resData = {
        message: '沒有購物車資料',
      }
    } else {
      resSql = await JSON.parse(JSON.stringify(resSql))
      let totalAmount = 0
      let itemName = ''
      let resSqlList = resSql.length
      await resSql.forEach((e, i) => {
        totalAmount += e.totalAmount
        resSqlList - 1 > i
          ? (itemName += `${e.title} ${e.color} ${e.size} ${e.amount}件#`)
          : (itemName += `${e.title} ${e.color} ${e.size} ${e.amount}件`)
      })

      let base_param = {
        MerchantTradeNo: 'f0a0d7e9fae1bb72bc93', //請帶20碼uid, ex: f0a0d7e9fae1bb72bc93
        MerchantTradeDate: nowTime(), //ex: 2017/02/13 15:45:30
        TotalAmount: 30,
        TradeDesc: '測試交易描述',
        ItemName: itemName,
        ReturnURL: 'https://e-commerce-plat-cms.herokuapp.com/',
        // ReturnURL: `${ctx.request.origin}/payment`,
        // EncryptType: '1',
        // ChooseSubPayment: '',
        // OrderResultURL: url,
        // NeedExtraPaidInfo: '1',
        // ClientBackURL: 'https://www.google.com',
        ItemURL: url,
        Remark: '該服務繳費成立時，恕不接受退款',
      }

      return new Promise((resolve, reject) => {
        let create = new ecpay_payment()
        let parameters = {}
        let invoice = {}
        let htm = create.payment_client.aio_check_out_all(
          (parameters = base_param)
          // (invoice = inv_params)
        )
        resData = {
          message: '進入結帳',
          data: htm,
        }
        ctx.body = htm
        resolve()
      }).catch((err) => {
        resData = {
          message: err,
        }
        ctx.body = resData
      })
    }
  }
}

module.exports = GetPayment
