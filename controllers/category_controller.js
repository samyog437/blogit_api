const Category = require('../Model/Category')

const getAllCategories = (req, res, next) => {
    Category.find()
        .then((categories) => {
            res.json(categories)
        }).catch(next)
}

const createCategory = (req, res, next) => {
    Category.create(req.body)
        .then((category) => {
            res.status(201).json(category)
        }).catch(next)
}

module.exports = {
    getAllCategories,
    createCategory
}