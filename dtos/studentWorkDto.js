module.exports = class StudentWorkDto {
    id;
    url;
    title;
    backgroundImage;
    author;
    date;

    constructor(model) {
        this.id = model._id;
        this.url = model.url;
        this.title = model.title;
        this.backgroundImage = model.backgroundImage;
        this.author = model.author;
        this.date = model.date;
    }
}
