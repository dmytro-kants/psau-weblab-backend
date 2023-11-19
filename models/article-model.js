const { Schema, model } = require('mongoose');

const ArticleSchema = new Schema({
    title: { type: String, required: true, unique:true },
    content: { type: String, required: true },
    originalJSON: { type: Schema.Types.Mixed },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date },
    viewCounter: {type: Number}
})

module.exports = model('Article', ArticleSchema);
