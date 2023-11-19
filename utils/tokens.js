const jwt = require('jsonwebtoken');
const userModel = require('../models/user-model');


const generateTokens = (payload) => {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_TOKEN, { expiresIn: '15m' }) // встановлюємо токен доступу
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_TOKEN, { expiresIn: '30d' }) // встановлюємо токен оновлення
    return {
        accessToken,
        refreshToken
    }
}

const validateAccessToken = (token) => {
    try {
        const userData = jwt.verify(token, process.env.JWT_ACCESS_TOKEN); // перевіряємо валідність токену доступу
        return userData;
    } catch (e) {
        return null;
    }
}

const validateRefreshToken = (token) => {
    try {
        const userData = jwt.verify(token, process.env.JWT_REFRESH_TOKEN);
        return userData;
    } catch (e) {
        return null;
    }
}

const findToken = async (refreshToken) => {
    const tokenData = await userModel.findOne({ refreshToken: refreshToken })
    return tokenData;
}


module.exports = {generateTokens, validateAccessToken, validateRefreshToken, findToken};
