const { Router } = require('express')
const router = Router()
const db = require('../database')

router.get('/', async (req, res) => {
  try {
    let users = await db.promise().query(`SELECT * FROM USERS`)
    res.status(200).send(JSON.stringify({
      success: true,
      message: '取得會員資料成功',
      users: users.shift()
    }))
  } catch (error) {
    res.status(400).send(JSON.stringify({
      success: false,
      message: '取得會員錯誤'
    }))
  }
})

router.post('/', (req, res) => {
  try {
    const { name, age, email } = req.body
    db.promise().query(`INSERT INTO USERS(name,age,email) VALUES('${name}', '${age}', '${email}')`)
    res.status(201).send(JSON.stringify({
      success: true,
      message: '新增會員成功'
    }))
  } catch (error) {
    res.status(401).send(JSON.stringify({
      success: false,
      message: '創建會員失敗'
    }))
  }
})

module.exports = router