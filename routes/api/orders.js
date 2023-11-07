const express = require('express')
const { authenticate: { authAccess, adminAccess }, validateBody, isValidId } = require('../../middlewares')
const { orderCtrl } = require('../../controllers')
const {schemas:{updateStatusSchema}} = require('../../models/order')
const router = express.Router()

router.get('/', authAccess, adminAccess, orderCtrl.getAll)
router.get('/waiting', authAccess, orderCtrl.getWaiting)
router.post('/', authAccess, orderCtrl.add)
router.delete('/tours/:tourId', authAccess, orderCtrl.deleteTourById)
router.patch('/:id/status', authAccess, adminAccess, isValidId, validateBody(updateStatusSchema), orderCtrl.updateStatus)
router.delete('/:id', authAccess, adminAccess, isValidId, orderCtrl.deleteById)
router.post('/submit', authAccess, orderCtrl.submit)

module.exports = router