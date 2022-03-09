const express = require('express')
const router = express.Router()
const {login, logout, changePassword} = require('../controllers/users')
const {protect, authorize} = require('../middleware/auth')
router.post('/login', login)
router.put('/changePassword', protect, changePassword)
router.get('/logout', logout)
module.exports = router