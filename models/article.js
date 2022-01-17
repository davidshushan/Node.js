const mongoose = require('mongoose');

const articleSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: true },
    // title: {type: String, default: 'Default Title'}
    description: { type: String, required: true },
    content: { type: String, required: true },
    // ref define the type of ObjectId to specific object Category // use for -  populate func -  in controllers/articles
    categoryId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Category' },
    image: { type: String }
});

module.exports = mongoose.model('Article', articleSchema);