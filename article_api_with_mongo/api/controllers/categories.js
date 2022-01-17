const mongoose = require('mongoose');
const Category = require("../models/category");

module.exports = {
    getAllCategories: (req, res) => {
        Category.find().then((categories) => { // find func return all categories
            res.status(200).json({
                categories // return all the founded categories in the json file

            })
        }).catch(error => {
            res.status(500).json({
                error
            })
        });
    },
    createCategory: (req, res) => {
        const { title, description } = req.body;

        const category = new Category({
            _id: new mongoose.Types.ObjectId(),
            title,
            description
        });

        category.save().then(() => { // then is like a promise
            // save article function takes time and can fail!, and we catch it with catch function

            res.status(200).json({
                message: 'Created category'
            })
        }).catch(error => {
            res.status(500).json({
                error
            })
        });
    },
    getCategory: (req, res) => {
        const categoryId = req.params.categoryId;

        Category.findById(categoryId).then((category) => {
            res.status(200).json({
                category
            })
        }).catch(error => {
            res.status(500).json({
                error
            })
        })
    },
    updateCategory: (req, res) => {
        const categoryId = req.params.categoryId

        Category.findById(categoryId).then((category) => {
            if (!category) {
                return res.status(404).json({
                    message: 'Category NOT found '
                })
            }

        }).then(() => {
            Category.updateOne({ _id: categoryId }, req.body).then(() => {
                res.status(200).json({
                    message: `Category updated!`
                        // message: `Category -  ${categoryId}, updated!`
                })
            }).catch(error => {
                res.status(500).json({
                    error
                })
            });
        })
    },
    deleteCategory: (req, res) => {
        const categoryId = req.params.categoryId

        Category.findById(categoryId).then((category) => {
            if (!category) {
                return res.status(404).json({
                    message: 'Category NOT found '
                })
            }

        }).then(() => {
            Category.deleteOne({ _id: categoryId }).then(() => {
                res.status(200).json({
                    message: `Category _id: ${categoryId} Deleted`
                })
            }).catch(error => {
                res.status(500).json({
                    error
                })
            });
        })
    }
}