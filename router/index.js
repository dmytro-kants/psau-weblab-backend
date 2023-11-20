const Router = require('express').Router;
const userController = require('../controllers/user-controller');
const router = new Router();
const authMiddleware = require('../middlewares/auth-middleware');
const cloudinary = require("../utils/cloudinary")
const upload = require("../middlewares/multer");
const articleController = require('../controllers/article-controller');
const studentWorkController = require('../controllers/studentWork-controller');
const carouselController = require('../controllers/carousel-controller');

router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/refresh', userController.refresh);
router.get('/getAllUsers', authMiddleware, userController.getUsers);
router.get('/getStatistics', authMiddleware, userController.getStatistics);

router.post('/addArticle', authMiddleware, articleController.addArticle)
router.get('/getSingleArticle', articleController.getSingleArticle)
router.get('/getAllArticles', articleController.getAllArticles)
router.put('/updateArticle', authMiddleware, articleController.updateArticle)
router.delete('/deleteArticle', authMiddleware, articleController.deleteArticle)

router.post('/addWork', authMiddleware, studentWorkController.addWork)
router.get('/getAllWorks', studentWorkController.getAllWorks)
router.get('/getSingleWork', studentWorkController.getSingleWork)
router.put('/updateWork', authMiddleware, studentWorkController.updateWork)
router.delete('/deleteWork', authMiddleware, studentWorkController.deleteWork)

router.post('/addCarouselItem', authMiddleware, carouselController.addCarouselItem)
router.get('/getAllCarouselItems', carouselController.getAllCarouselItems)
router.get('/getSingleCarouselItem', carouselController.getSingleCarouselItem)
router.put('/updateCarouselItem', authMiddleware, carouselController.updateCarouselItem)
router.delete('/deleteCarouselItem', authMiddleware, carouselController.deleteCarouselItem)

router.post('/uploadFile', upload.single('image'), function (req, res) {
  cloudinary.uploader.upload(req.file.path, function (err, result) {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Error"
      })
    }

    res.status(200).json({
      success: 1,
      message: "Uploaded!",
      file: {
        url: result.url
      }
    })
  })
});

module.exports = router
