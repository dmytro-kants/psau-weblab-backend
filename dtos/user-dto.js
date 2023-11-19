module.exports = class UserDto {
    email;
    id;
    refreshToken;

    constructor(model) {
        this.email = model.email;
        this.id = model._id;
        this.refreshToken = model.refreshToken;
    }
}
