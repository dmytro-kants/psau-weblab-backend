require('dotenv').config()
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose');
const router = require('./router/index')
const errorMiddleware = require('./middlewares/error-middleware');
const PORT = process.env.PORT || 5000;
const app = express()

app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use('/api', router);
app.use(errorMiddleware); // підключаємо middleware для обробки помилок

const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL) // намагаємось підключитись до MongoDB
        app.listen(PORT, () => console.log(`Server started on PORT = ${PORT}`)) // запуск серверу
    } catch (e) {
        console.log(e); // перехвачуємо помилки запуску
    }
}

start()
