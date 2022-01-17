const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const checkAuth = require('../middlewares/checkAuth');

const {
    getAllArticles,
    createArticle,
    getArticle,
    updateArticle,
    deleteArticle
} = require('../controllers/articles'); //   {} = import object
// public - also available to non logined users
router.get('/', getAllArticles);
router.get('/:articleId', getArticle);

//private - only for logined users, we verify it with check auth func (miidleware)
router.post('/', checkAuth, upload.single('image'), createArticle);
router.patch('/:articleId', checkAuth, updateArticle); //update the articles
router.delete('/:articleId', checkAuth, deleteArticle);

module.exports = router;