const StudentWorkModel = require("../models/studentWork-model")

class StudentWorkController {

    async addWork(req, res, next) {
        try {
            const { title, url, backgroundImage, author } = req.body
            const date = new Date()
            const work = await StudentWorkModel.create({ title, url, backgroundImage, author, date })
            return res.json(work);
        } catch (e) {
            next(e)
        }
    }
    async getAllWorks(req, res, next) {
        const perPage = 8;
        const page = req.query.page || 1;
        const searchValue = req.query.searchValue;
        try {
            if (searchValue != '') {
                console.log(searchValue);
                const query = { title: { $regex: new RegExp(searchValue, 'i') } };
                const works = await StudentWorkModel.find(query)
                    .skip((perPage * page) - perPage)
                    .limit(perPage);
                const totalItems = await StudentWorkModel.countDocuments(query);
                const totalPages = Math.ceil(totalItems / perPage);

                return res.json({
                    works,
                    currentPage: page,
                    totalPages,
                })
            }
            console.log('b');
            const works = await StudentWorkModel.find({})
                .skip((perPage * page) - perPage)
                .limit(perPage);
            const totalItems = await StudentWorkModel.countDocuments();
            const totalPages = Math.ceil(totalItems / perPage);

            return res.json({
                works,
                currentPage: page,
                totalPages,
            })


        } catch (e) {
            next(e)
        }
    }

    async getSingleWork(req, res, next) {
        try {
            const { id } = req.query;
            const work = await StudentWorkModel.findById(id).populate('author', '_id, email');
            if (work) {
                return res.json(work);
            }

            return res.json({ message: 'Роботи не існує' })
        } catch (e) {
            next(e)
        }
    }

    async updateWork(req, res, next) {
        try {
            const { url, backgroundImage, author, title, _id } = req.body
            const work = await StudentWorkModel.findOneAndUpdate(
                { _id: _id },
                { $set: { url, backgroundImage, author, title } },
                { new: true }
            );
            return res.json(work);
        } catch (e) {
            next(e)
        }
    }
    async deleteWork(req, res, next) {
        try {
            const { id } = req.query;
            await StudentWorkModel.findOneAndDelete({ _id: id })
            return res.json({ isDeleted: true });
        } catch (e) {
            next(e)
        }
    }


}


module.exports = new StudentWorkController();
