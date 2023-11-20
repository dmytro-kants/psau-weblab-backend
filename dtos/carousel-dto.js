module.exports = class StudentWorkDto {
    id;
    url;
    title;
    image;
    description;

    constructor(model) {
        this.id = model._id;
        this.url = model.url;
        this.title = model.title;
        this.image = model.image;
        this.description = model.description;
    }
}
