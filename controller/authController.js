const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/AppError')
const jwt = require('jsonwebtoken')
const { promisify } = require('util')


function createSendToken(user,statusCode,res) {
    const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{
        expiresIn:process.env.EXPIRES_IN
    })

    user.password=undefined

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
          user
        }
    })
    
}



exports.register = catchAsync(async (req,res,next)=>{
    const {name,email,password} = req.body

    const newUser = await User.create(req.body)
    
    createSendToken(newUser,200,res)
})




exports.login =catchAsync(async(req,res,next)=>{

    const {email,password} =  req.body

    if(!email || !password){
        return next(new AppError("please fill the form",400))
    }
    const newuser= await User.findOne({email}).select('+password')

    if(!newuser || !(await newuser.correctPassword(password,newuser.password))){
        return next(new AppError("password or Email are Wrong",400))
    }

    createSendToken(newuser,200,res)

})


exports.protect = catchAsync(async(req,res,next)=>{
    let token

    if(  req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer'))
        {
            token = req.headers.authorization.split(' ')[1]
        }

        if(!token){
            return next(new AppError('you are not authorized!!',401))
        }

        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

        const freshUser = await User.findById(decoded.id)

        if(!freshUser){
            return next(new AppError('the user that does no longer exist',401))
          }

    req.user=freshUser
    next();
}) 

exports.restrictTo =(...roles)=>{
    return(req,res,next)=>{
        if(!roles.includes(req.user.roles)){
            return next(new AppError('You Are Not Authorized!!!',403))
        }
        next()
    }
}