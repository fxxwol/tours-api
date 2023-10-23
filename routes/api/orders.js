const express = require('express')
const { authenticate: { authAccess, adminAccess }, validateBody, isValidId } = require('../../middlewares')
const { orderCtrl } = require('../../controllers')
const {schemas:{updateStatusSchema, updateTourSchema}} = require('../../models/order')
const router = express.Router()

router.get('/', authAccess, adminAccess, orderCtrl.getAll)
router.get('/waiting', authAccess, orderCtrl.getWaiting)
router.post('/:tourId', authAccess, orderCtrl.add)
router.delete('/:id', authAccess, isValidId, orderCtrl.deleteById)
router.patch('/:id/status', authAccess, adminAccess, isValidId, validateBody(updateStatusSchema), orderCtrl.updateStatus)
router.patch('/', authAccess, isValidId, validateBody(updateTourSchema), orderCtrl.increaseTourAmount)
router.patch('/:id/submit', authAccess, isValidId, validateBody(updateStatusSchema), orderCtrl.submit)

module.exports = router