const mongoose = require('mongoose');
const Article = require('../models/article');
const Category = require('../models/category')

module.exports = {
    getAllArticles: (req, res) => {
        // populate('categoryId', 'title') = add category title only in article/category,  and not category description
        Article.find().populate('categoryId', 'title').then((articles) => { // find func return all articles
            res.status(200).json({
                articles // return all the founded articles in the json file

            })
        }).catch(error => {
            res.status(500).json({
                error
            })
        });

    },
    createArticle: (req, res) => {
        // console.log(req.file); // print photo upload details
        const { path: image } = req.file;
        const { title, description, content, categoryId } = req.body;

        Category.findById(categoryId).then((category) => {
            if (!category) {
                return res.status(404).json({
                    message: 'Category NOT found '
                })
            }

            const article = new Article({
                _id: new mongoose.Types.ObjectId(),
                title,
                description,
                content,
                categoryId,
                image: image.replace('\\', '/') // fix windows double \ in image path on postman
            });
            return article.save();

        }).then(() => { // then is like a promise
            // save article function takes time and can fail!, and we catch it with catch function

            res.status(200).json({
                message: 'Article created'
            })
        }).catch(error => {
            res.status(500).json({
                error
            })
        });

    },

    getArticle: (req, res) => {
        const articleId = req.params.articleId;

        Article.findById(articleId).then((article) => {
            res.status(200).json({
                article
            })
        }).catch(error => {
            res.status(500).json({
                error
            })
        })
    },

    updateArticle: (req, res) => {
        const articleId = req.params.articleId; // for update article
        const { categoryId } = req.body; // for update category

        Article.findById(articleId).then((article) => {
            if (!article) {
                return res.status(404).json({
                    message: 'Article NOT found '
                })
            }

        }).then(() => {
            if (categoryId) { // if we recived categoryId from user

                // return if we dont have categoryId, and dont get in - Article.updateOne (of article)
                return Category.findById(categoryId).then((category) => {
                    if (!category) { // verify if categoryId exist in our DataBase
                        return res.status(404).json({
                            message: 'Category NOT found '
                        })
                    }

                    // if sucsses - the return will send to then func, and if fail, will send to catch func
                    return Article.updateOne({ _id: articleId }, req.body);
                }).then(() => { // then is like a promise
                    // save article function takes time and can fail!, and we catch it with catch function

                    res.status(200).json({
                        message: 'Article category updated!'
                    })
                }).catch(error => {
                    res.status(500).json({
                        error
                    })
                });
            }

            Article.updateOne({ _id: articleId }, req.body).then(() => {
                res.status(200).json({
                    message: `Article updated!`
                        // message: `Article -  ${articleId}, updated!`
                })
            }).catch(error => {
                res.status(500).json({
                    error
                })
            });
        })


    },
    deleteArticle: (req, res) => {
        const articleId = req.params.articleId


        Article.findById(articleId).then((article) => {
            if (!article) {
                return res.status(404).json({
                    message: 'Article NOT found '
                })
            }

        }).then(() => {
            Article.deleteOne({ _id: articleId }).then(() => {
                res.status(200).json({
                    message: `Article _id: ${articleId} Deleted`
                })
            }).catch(error => {
                res.status(500).json({
                    error
                })
            });
        })
    }
}