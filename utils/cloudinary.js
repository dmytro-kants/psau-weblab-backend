const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: "dlbsa9dgi",
    api_key: "336667683867752",
    api_secret: "mlYhi7Ei3mB-KtFtLASoJPYpioM"
})

module.exports = cloudinary;