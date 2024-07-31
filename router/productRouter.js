const express =require('express')
const productController = require("../controller/product")
const authController = require("../controller/authController")
const cleanProductCache = require('../middlewares/cleanProductCache')

const router = express.Router()

router.route('/')
.post(productController.addProduct)
.get(productController.getProduct)


router.route('/:id')
.get(productController.getOneProduct)
.delete(cleanProductCache, productController.deleteProduct)
.put(cleanProductCache, productController.updateProduct)


module.exports=router