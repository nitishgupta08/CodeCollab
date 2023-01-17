const express = require('express')
const router = express.Router()
const { getSpaces, createSpaces, updateSpaces, deleteSpaces, getSpaceData, joinSpace } = require('../controllers/spaceController')

const { protect } = require('../middleware/authMiddleware')

router.get('/', protect, getSpaces)
router.post('/', protect, createSpaces)
router.get('/:id', protect, getSpaceData)
router.put('/:id', protect, updateSpaces)
router.delete('/:id', protect, deleteSpaces)
router.get('/join/:id', joinSpace)


module.exports = router