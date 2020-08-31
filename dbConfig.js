const mysql = require('mysql')
const pool = mysql.createPool({
  host: 'us-cdbr-east-02.cleardb.com',
  user: 'bed0b779717600',
  password: '666be48f',
  database: 'heroku_5f992841ba4bcb3',
  multipleStatements: true
})

let query = (sql, values) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      if (err) {
        reject(err)
      } else {
      // 執行 sql 腳本對資料庫進行讀寫
    conn.query(sql, values, (err, rows) => {
      if (err) {
        reject(err)
      } else {
        resolve(rows)
      }
      conn.release()  // 結束會話
    })
      }
    })
  }).then((val) => {
    return val
  }).catch((err) => {
    console.log(err)
  })
}

module.exports = { query }