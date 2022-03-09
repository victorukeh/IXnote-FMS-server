const express = require('express')
const router = express.Router()
const {protect, authorize} = require('../middleware/auth')
const {createUser, updateUser, deleteUser, getAllUsers} = require('../controllers/users')

router.get('/', protect, authorize('admin'),getAllUsers)
router.post('/new', createUser)
router.put('/edit/:id', protect, authorize('admin'), updateUser)
router.delete('/:id', deleteUser)

module.exports = router
