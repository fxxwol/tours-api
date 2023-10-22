const express = require('express')
const { userCtrl } = require('../../controllers')
const { schemas: { registerSchema, loginSchema } } = require('../../models/user')
const { authenticate: { authAccess }, validateBody } = require('../../middlewares')
const router = express.Router()

router.post('/register', validateBody(registerSchema), userCtrl.register)
router.post('/login', validateBody(loginSchema), userCtrl.login)
router.post('/logout', authAccess, userCtrl.logout)
router.get('/current', authAccess, userCtrl.current)

module.exports = router