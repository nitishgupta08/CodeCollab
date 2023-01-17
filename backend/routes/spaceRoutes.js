const express = require('express')
const router = express.Router()
const { getSpaces, createSpaces, updateSpaces, deleteSpaces, getSpaceData, updateActive } = require('../controllers/spaceController')

const { protect } = require('../middleware/authMiddleware')

router.get('/', protect, getSpaces)
router.post('/', protect, createSpaces)
router.get('/:id', getSpaceData)
router.put('/:id', protect, updateSpaces)
router.delete('/:id', protect, deleteSpaces)
router.put('/updateActive/:id', updateActive)


module.exports = router