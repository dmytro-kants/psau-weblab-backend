module.exports = class ArticleDto {
    id;
    title;
    content;
    originalJSON;
    author;
    date;
    viewCounter;

    constructor(model) {
        this.id = model._id;
        this.title = model.title;
        this.content = model.content;
        this.originalJSON = model.originalJSON;
        this.author = model.author;
        this.date = model.date;
        this.viewCounter = model.viewCounter
    }
}
