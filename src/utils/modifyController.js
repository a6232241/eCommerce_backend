class ModifyPayment {
  async paymentResult(ctx, next) {
    let rtnCode = ctx.ctx.requestuest.body.RtnCode
    let simulatePaid = ctx.ctx.requestuest.body.SimulatePaid
    let merchantID = ctx.ctx.requestuest.body.MerchantID
    let merchantTradeNo = ctx.ctx.requestuest.body.MerchantTradeNo
    let storeID = ctx.ctx.requestuest.body.StoreID
    let rtnMsg = ctx.ctx.requestuest.body.RtnMsg
    // let tradeNo = ctx.ctx.requestuest.body.TradeNo;
    let tradeAmt = ctx.ctx.requestuest.body.TradeAmt
    // let payAmt = ctx.ctx.requestuest.body.PayAmt;
    let paymentDate = ctx.ctx.requestuest.body.PaymentDate
    let paymentType = ctx.ctx.requestuest.body.PaymentType
    // let paymentTypeChargeFee = ctx.ctx.requestuest.body.PaymentTypeChargeFee;

    let paymentInfo = {
      merchantID: merchantID,
      merchantTradeNo: merchantTradeNo,
      storeID: storeID,
      rtnMsg: rtnMsg,
      paymentDate: paymentDate,
      paymentType: paymentType,
      tradeAmt: tradeAmt,
    }

    //(添加simulatePaid模擬付款的判斷 1為模擬付款 0 為正式付款)
    //測試環境
    if (rtnCode === '1' && simulatePaid === '1') {
      // 這部分可與資料庫做互動
      res.write('1|OK')
      res.end()
    }
    //正式環境
    //  else if (rtnCode === "1" && simulatePaid === "0") {
    // 這部分可與資料庫做互動
    // }
    else {
      res.write('0|err')
      res.end()
    }
  }

  async paymentActionResult(ctx, next) {
    let merchantID = ctx.request.body.MerchantID //會員編號
    let merchantTradeNo = ctx.request.body.MerchantTradeNo //交易編號
    let storeID = ctx.request.body.StoreID //商店編號
    let rtnMsg = ctx.request.body.RtnMsg //交易訊息
    let paymentDate = ctx.request.body.PaymentDate //付款時間
    let paymentType = ctx.request.body.PaymentType //付款方式
    let tradeAmt = ctx.request.body.TradeAmt //交易金額

    let result = {
      member: {
        merchantID: merchantID,
        merchantTradeNo: merchantTradeNo,
        storeID: storeID,
        rtnMsg: rtnMsg,
        paymentDate: paymentDate,
        paymentType: paymentType,
        tradeAmt: tradeAmt,
      },
    }
    // console.log("result: " + JSON.stringify(result));
    ctx.body = result
  }
}

module.exports = ModifyPayment
