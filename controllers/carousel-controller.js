const CarouselModel = require('../models/carousel-model')

class CarouselController {

    async addCarouselItem(req, res, next) {
        try {
            const currentSize = await CarouselModel.countDocuments()
            if (currentSize >= 5) {
                return res.json({ message: "Ліміт перевищено!" });
            }
            const { title, url, image, description } = req.body
            const carouselItem = await CarouselModel.create({ title, url, image, description })
            return res.json(carouselItem);
        } catch (e) {
            next(e)
        }
    }

    async getAllCarouselItems(req, res, next) {
        try {
            const carouselItems = await CarouselModel.find({})
            return res.json({
                carouselItems
            })
        } catch (e) {
            next(e)
        }
    }

    async getSingleCarouselItem(req, res, next) {
        try {
            const { id } = req.query;
            const carouselItem = await CarouselModel.findById(id);
            if (carouselItem) {
                return res.json(carouselItem);
            }

            return res.json({ message: 'Помилка' })
        } catch (e) {
            next(e)
        }
    }

    async updateCarouselItem(req, res, next) {
        try {
            const { title, url, image, description, _id } = req.body
            const carouselItem = await CarouselModel.findOneAndUpdate(
                { _id: _id },
                { $set: { title, url, image, description } },
                { new: true }
            );
            return res.json(carouselItem);
        } catch (e) {
            next(e)
        }
    }

    async deleteCarouselItem(req, res, next) {
        try {
            const { id } = req.query;
            await CarouselModel.findOneAndDelete({ _id: id })
            return res.json({ isDeleted: true });
        } catch (e) {
            next(e)
        }
    }
}


module.exports = new CarouselController();
