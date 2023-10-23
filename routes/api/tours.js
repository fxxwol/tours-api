const express = require('express')
const { authenticate: { authAccess, adminAccess }, validateBody, isValidId } = require('../../middlewares')
const { tourCtrl } = require('../../controllers')
const { tourJoiSchema, updateTourSchema } = require('../../models/tour')
const router = express.Router()

router.get('/', authAccess, tourCtrl.getAll)
router.get('/:id', authAccess, isValidId, tourCtrl.getById)
router.post('/', authAccess, adminAccess, validateBody(tourJoiSchema), tourCtrl.add)
router.patch('/:id', authAccess, adminAccess, isValidId, validateBody(updateTourSchema), tourCtrl.updateById)
router.delete('/:id', authAccess, adminAccess, isValidId, tourCtrl.deleteById)

module.exports = router
