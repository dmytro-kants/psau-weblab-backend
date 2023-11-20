const { Schema, model } = require('mongoose');

const CarouselSchema = new Schema({
    url: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
})

module.exports = model('Carousel', CarouselSchema);
