const express =require('express')
const productController = require("../controller/product")
const authController = require("../controller/authController")

const router = express.Router()

router.route('/')
.post(productController.addProduct)
.get(productController.getProduct)


router.route('/:id')
.get(productController.getOneProduct)
.delete(productController.deleteProduct)
.put(productController.updateProduct)


module.exports=router