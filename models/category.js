const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId, // mongo auto id unique
    title: { type: String, required: true },
    // title: {type: String, default: 'Default Title'}
    description: { type: String, required: true },

});

module.exports = mongoose.model('Category', categorySchema);