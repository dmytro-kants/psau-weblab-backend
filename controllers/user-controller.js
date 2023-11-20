const UserModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const { generateTokens, validateRefreshToken, findToken } = require('../utils/tokens')
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-error');
const StudentWorkModel = require('../models/studentWork-model');
const ArticleModel = require('../models/article-model');

class UserController {
    async registration(req, res, next) {
        try {
            const { email, password } = req.body;
            const user = await UserModel.findOne({ email })
            if (user) {
                throw ApiError.BadRequest('Користувач з таким email уже існує!')
            }
            const hashPassword = await bcrypt.hash(password, 3);
            const newUser = await UserModel.create({ email, password: hashPassword })
            const userDto = new UserDto(newUser);
            return res.json(userDto);
        } catch (e) {
            next(e)
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body; // отримуємо від користувача логін та пароль
            const user = await UserModel.findOne({ email })
            const checkPassword = await bcrypt.compare(password, user.password);
            if (!user || !checkPassword) {
                throw ApiError.BadRequest('Введено невірні дані') // перевіряємо їх на валідність
            }
            const tokens = generateTokens({ email: user.email, _id: user._id }); // створюємо нову пару
            if (user && tokens) {
                user.refreshToken = tokens.refreshToken
            }
            await user.save();
            const userDto = new UserDto(user);
            res.cookie('refreshToken', userDto.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000,  httpOnly: true, domain:'agrarian-backend.onrender.com', secure:true, sameSite:'none'})
            return res.json({ ...userDto, accessToken: tokens.accessToken });
        } catch (e) {
            next(e)
        }
    }

    async logout(req, res, next) {
        try {
            const { user } = req.body;
            const userData = await UserModel.findOne({ email: user.email })
            userData.refreshToken = "";
            userData.accessToken = ""
            await userData.save();
            res.clearCookie('refreshToken');
            return res.json(userData);
        } catch (e) {
            next(e)
        }
    }

    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            if (!refreshToken) {
                throw ApiError.UnauthorizedError();
            }
            const userData = validateRefreshToken(refreshToken);
            const existingToken = await findToken(refreshToken);

            if (!userData || !existingToken) {
                throw ApiError.UnauthorizedError();
            }
            const user = await UserModel.findOne({ email: userData.email });

            const tokens = generateTokens({ email: user.email, _id: user._id });
            if (user && tokens) {
                user.refreshToken = tokens.refreshToken
            }
            await user.save();
            const userDto = new UserDto(user);
            res.cookie('refreshToken', userDto.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true,domain:'agrarian-backend.onrender.com', secure:true, sameSite:'none'})
            return res.json({ ...userDto, accessToken: tokens.accessToken });
        } catch (e) {
            next(e)
        }
    }

    async getUsers(req, res, next) {
        try {
            const users = await UserModel.find();
            return res.json(users);
        } catch (e) {
            next(e)
        }
    }

    async getStatistics(req, res, next) {
        try {
            const worksCount = await StudentWorkModel.countDocuments();
            const newsCount = await ArticleModel.countDocuments()
            const viewsCount = await ArticleModel.aggregate([
                {
                    $group: {
                        _id: null,
                        totalViewCounter: { $sum: '$viewCounter' }
                    }
                }
            ])
            return res.json({ worksCount, newsCount, viewsCount });
        } catch (e) {
            next(e)
        }
    }

}


module.exports = new UserController();
