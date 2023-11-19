const { Schema, model } = require('mongoose');

const StudentWorkSchema = new Schema({
    url: { type: String, required: true },
    title: { type: String, required: true },
    backgroundImage: { type: String },
    author: { type: String, require: true },
    date: { type: Date },
})

module.exports = model('StudentWork', StudentWorkSchema);
