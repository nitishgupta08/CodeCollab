const express = require('express')
const router = express.Router()
const {getSpaces, createSpaces, updateSpaces, deleteSpaces} = require('../controllers/spaceController')

const {protect} = require('../middleware/authMiddleware')

router.get('/',protect, getSpaces)
router.post('/',protect, createSpaces)
router.put('/:id', protect, updateSpaces)
router.delete('/:id', protect,  deleteSpaces)


module.exports = router