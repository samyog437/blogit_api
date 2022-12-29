const express = require('express')
const categoryController = require('../controllers/category_controller')

const router = express.Router()

router.route('/')
    .get(categoryController.getAllCategories)
    .post(categoryController.createCategory)

router.route('/:category_id')
    .get(categoryController.getAcategory)

module.exports = router