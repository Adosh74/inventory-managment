const Product = require('../models/productmodel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/AppError')
const APIFeatures=require('../utils/Apifeatures')





exports.addProduct = catchAsync(async(req,res)=>{
    const{name,quantity,expirationDate} = req.body

    const newProduct = await Product.create(req.body)

    res.status(200).json({
        status:"success",
        newProduct
    })
})

exports.getProduct = catchAsync(async(req,res)=>{
    let filter ={}
    if(req.params.productId) filter={product:req.params.productId}

    const features =new APIFeatures(Product.find(filter),req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate()

    const products=await features.query;

    res.status(200).json({
        status:"success",
        products
    })
})


exports.getOneProduct = catchAsync(async(req,res,next)=>{

    const product = await Product.findById(req.params.id).cache({key:req.params.id})
    
    if(!product){
        return next(new AppError("No Product Found With This Id",400))
    }

    res.status(200).json({
        status:"success",
        product
    })
})

exports.updateProduct = catchAsync(async(req,res,next)=>{
     
    
    const product = await Product.findByIdAndUpdate(req.params.id,req.body,{    
        new: true,
        runValidators: true
    })
    
    if(!product){
        return next(new AppError("No Product Found With This Id",400))
    }

    res.status(200).json({
        status:"success",
        msg:"Product Updated Successfully!!"
    })
})

exports.deleteProduct = catchAsync(async(req,res,next)=>{
    const productId = req.params.id
    
    const product = await Product.findByIdAndDelete(productId)
    
    if(!product){
        return next(new AppError("No Product Found With This Id",400))
    }

    res.status(200).json({
        status:"success",
        msg:"Product Deleted Successfully!!"
    })
})
