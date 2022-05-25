const { Router } = require('express')
const router = Router()
const db = require('../database')

// 取得所有會員
router.get('/', async (req, res) => {
  try {
    let users = await db.promise().query(`SELECT id, name, age, email FROM USERS WHERE deleted_at IS NULL`)
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

// 新增會員
router.post('/', (req, res) => {
  const { name, age, email } = req.body
  if (!name || !age || !email) {
    res.status(401).send(JSON.stringify({
      success: false,
      message: '會員資料不齊全'
    }))
  } else {
    try {
      // 轉換成本地時間
      const tzoffset = (new Date()).getTimezoneOffset() * 60000
      const localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, 19).replace('T', ' ')

      db.promise().query(`INSERT INTO USERS(name, age, email, created_at, updated_at) VALUES('${name}', '${age}', '${email}', '${localISOTime}', '${localISOTime}')`)
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
  }
})

// 編輯會員資料
router.put('/:id', async (req, res) => {
  try {
    const tzoffset = (new Date()).getTimezoneOffset() * 60000
    const localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, 19).replace('T', ' ')
    const { id } = req.params
    const {name, age, email} = req.body
    await db.promise().query(`UPDATE users SET name='${name}', age='${age}', email='${email}', updated_at='${localISOTime}' WHERE id=${id}`)
    res.status(201).send(JSON.stringify({
      success: true,
      message: '更新會員成功'
    }))
  } catch (error) {
    res.status(401).send(JSON.stringify({
      success: false,
      message: '更新會員失敗'
    }))
  }
})

// 刪除會員資料
router.delete('/:id', async (req, res) => {
  const target = await db.promise().query(`SELECT * FROM users WHERE id=${req.params.id}`)
  if (target[0][0]?.name) {
    try {
      const { id } = req.params
      const tzoffset = (new Date()).getTimezoneOffset() * 60000
      const localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, 19).replace('T', ' ')
      await db.promise().query(`UPDATE users SET deleted_at='${localISOTime}' WHERE id=${id}`)
      res.status(201).send(JSON.stringify({
        success: true,
        message: '刪除會員成功'
      }))
    } catch (error) {
      res.status(401).send(JSON.stringify({
        success: false,
        message: '刪除會員失敗'
      }))
    }
  } else {
    res.status(401).send(JSON.stringify({
      success: false,
      message: '刪除會員失敗'
    }))
  }
})

// 取得單一會員資料
router.get('/detail/:id', async (req, res) => {
  const { id } = req.params
  const target = await db.promise().query(`SELECT id, name, age, email FROM USERS WHERE id = '${id}' AND deleted_at IS NULL`)
  if (target[0][0]?.name) {
    try {
      res.status(200).send(JSON.stringify({
        success: true,
        user: target.shift()[0]
      }))
    } catch (error) {
      res.status(400).send(JSON.stringify({
        success: false,
        message: '取得會員資料錯誤'
      }))
    }
  } else {
    res.status(400).send(JSON.stringify({
      success: false,
      message: '取得會員資料錯誤'
    }))
  }
})

module.exports = router