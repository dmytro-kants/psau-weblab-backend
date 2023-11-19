const ArticleModel = require("../models/article-model")
const ArticleDto = require('../dtos/article-dto');

class ArticleController {

    async addArticle(req, res, next) {
        try {
            const { title, content, originalJSON } = req.body
            const user = req.user
            console.log(user);
            const date = new Date()
            const article = await ArticleModel.create({ title, content, originalJSON, author: user._id, date, viewCounter: 1 })
            console.log(article);
            const articleDTO = new ArticleDto(article)
            return res.json(articleDTO);

        } catch (e) {
            next(e)
        }
    }
    async getSingleArticle(req, res, next) {
        try {
            const { id } = req.query; // дізнайємося id статті
            const article = await ArticleModel.findById(id).populate('author', '_id, email'); // шукаємо статтю в БД
            if (article) {
                if (article.viewCounter) {
                    article.viewCounter++; // додаємо перегляд
                }
                await article.save()
                return res.json(article); // повертаємо статтю
            }

            return res.json({ message: 'Статті не існує' })
        } catch (e) {
            next(e) // обробка помилок
        }
    }
    async getAllArticles(req, res, next) {
        const perPage = 8;
        const page = req.query.page || 1;
        const searchValue = req.query.searchValue;
        try {
            if (searchValue !== "") {
                const query = { title: { $regex: new RegExp(searchValue, 'i') } };
                const articles = await ArticleModel.find(query)
                    .skip((perPage * page) - perPage)
                    .limit(perPage);
                const totalItems = await ArticleModel.countDocuments(query);
                const totalPages = Math.ceil(totalItems / perPage);

                return res.json({
                    articles,
                    currentPage: page,
                    totalPages,
                });
            }
            const articles = await ArticleModel.find({})
                .skip((perPage * page) - perPage)
                .limit(perPage);
            const totalItems = await ArticleModel.countDocuments();
            const totalPages = Math.ceil(totalItems / perPage);

            return res.json({
                articles,
                currentPage: page,
                totalPages,
            });
        }
        catch (e) {
            next(e)
        }
    }
    async updateArticle(req, res, next) {
        try {
            const { id, content, originalJSON, title } = req.body;
            const article = await ArticleModel.findOneAndUpdate(
                { _id: id },
                { $set: { content, originalJSON, title } },
                { new: true }
            );
            return res.json(article);
        } catch (e) {
            next(e)
        }
    }
    async deleteArticle(req, res, next) {
        try {
            const { id } = req.query;
            await ArticleModel.findOneAndDelete({ _id: id })
            return res.json({ isDeleted: true });
        } catch (e) {
            next(e)
        }
    }


}


module.exports = new ArticleController();
