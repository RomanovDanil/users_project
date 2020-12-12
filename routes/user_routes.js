const {Router}    = require("express")
const bcrypt      = require('bcrypt')
const User        = require('../models/User')
const UserData    = require('../models/UserData')
const Role        = require('../models/Role')
const multer      = require('multer')
const path        = require('path')
const validator   = require('validator');
const {check, validationResult} = require('express-validator')
const Country = require("../models/Country")

const router = Router()


//инициализация хранилища изображений
var storage = multer.diskStorage({
    destination:'./uploads/user_images/',
    filename:(req,file,cb)=>{
        cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname))
    }
})

const upload = multer({
    storage,
    limits: {fileSize: 4 * 1024 * 1024},
    fileFilter: (req, file, cb) =>  {
        const ext = path.extname(file.originalname)
        if(ext !== '.jpeg' && ext !== '.jpg' && ext !== '.png'){
            const err = new Error('Extention')
            err.code = 'EXTENTION'
            return cb(err)
        }
        cb(null, true)
    }
}).single('photo')


// /api/user/create
router.post(
    '/create',
    [
        check('email', 'Incorrect email address entered').isEmail(),
        check('password', 'The minimum password length is 6 characters').isLength({min: 6}),
        check('firstName', 'Name not filled in!').isEmpty(),
        check('secondName', 'Last name not filled in!').isEmpty(),
        check('thirdName', 'Middle name not filled in!').isEmpty(),
        check('country', 'Country not selected!').isEmpty()    
    ], async (req, res) => {
    try{
        const errors = validationResult(req)
        if(!errors.isEmpty){
            return res.status(400).json({
                errors: errors.array(),
                message: 'Incorrect data was entered during registration'
            })
        }
        const {email, password, repeatPassword, firstName, secondName, thirdName, country} = req.body
        
        //проверить наличие email в базе
        const curUser = await User.findOne({email})
        if(curUser){
            return res.status(400).json({message:'A user with this email already exists'})
        }

        if (password !== repeatPassword){
            return res.status(400).json({message:'Passwords dont match'})
        }

        //создание пользовательских данных
        const userData = new UserData({firstName, secondName, thirdName, country})
        
        //если было загружено изображение
        await upload(req, res, err => {
            errorMessage = ""
            if (err){
                if(err.code === 'LIMIT_FILE_SIZE'){
                    return res.status(400).json({message:"The image size is no more than 4 MB!"})
                } else if(err.code === 'EXTENTION'){
                    return res.status(400).json({message:"The image must be in .png, .jpg, or .jpeg format"})   
                } else {
                    return res.status(400).json({message:err.message})
                }
            }
            console.log({status: !!err, message:err.message})
        })
        
        if(req.file) {
            imageName = req.file.filename
            userData.image = imageName
        }

        //роль по умолчанию
        const role = Role.findOne({name:'No role'})
        if (!role){
            console.log({message:"Role 'No role' is not exists"})
            return res.status(400).json("Role 'No role' is not exists");
        }
        userData.role = role

        //сохранение пользовательских данных
        await userData.save()
        
        //хеширование пароля
        const hashPassword = await bcrypt.hash(password, 15)

        //создание пользователя
        const user = new User({email, password: hashPassword, userData})
        //сохранение пользователя в базе
        await user.save()
        //ответ
        res.status(201).json({message:'User was created successfully'})
    }catch(e){
        res.status(500).json({message: e.message})
    }
})

// /api/user/getById
router.get('/getById', async (req, res) => {
    try{
        const {_id} = req.body
        const curUser = await User.findById({_id}, {confirmed:true}).populate('userData')
        if(curUser){
            return res.json({message:curUser})
        } else {
            return res.status(400).json({message:'User is not exists'})
        }
    } catch(e) {
        res.status(500).json({message:e.message})
    }
})

// /api/user/changePassword
router.get('/changePassword', async(req, res) => {
    try{
        const {_id, password, newPassword, newPasswordRepeat} = req.body
        const curUser = await User.findById({_id})
        if(!curUser){
            return res.status(400).json({message:"User is not exists"})
        }

        if(curUser.password !== bcrypt.hash(password, 15)){
            return res.status(400).json({message:"Invalid password entered"})
        }

        if(newPassword !== newPasswordRepeat){
            return res.status(400).json({message:"New passwords don't match"})
        }

        newPasswordHash = bcrypt.hash(newPassword)
        curUser.password = newPasswordHash
        curUser.save()
        res.status.json({message:"The password change is successful"})
    } catch(e) {
        res.status(500).json({message:e.message})
    }
})

// /api/user/get
router.get('/get', async (req, res) => {
    try{
        const users = await User.find({confirmed: true}).populate('userData')
        if(users){
            return res.json({message:users})
        } else {
            return res.status(400).json({message:'Users are not exists'})
        }
    } catch(e) {
        res.status(500).json({message:e.message})
    }
})

// /api/user/update
router.put('/update', async (req, res) => {
    try{
        const {_id, newData} = req.body
        
        errors = array()
        correctNewData = {} 
        for(property in newData) {
            value = req.body[property]
            if(validator.isEmpty(value)){
                array.push({prop: property, val: value, message:"Value is empty"})
            } else {
                correctNewData[property] = value
            }
        }

        await upload(req, res, err => {
            errorMessage = ""
            if (err){
                if(err.code === 'LIMIT_FILE_SIZE'){
                    return res.status(400).json({message:"Изображение не более 4 мб!"})
                } else if(err.code === 'EXTENTION'){
                    return res.status(400).json({message:"Изображение должно быть в формате .png, .jpg или .jpeg"})   
                } else {
                    return res.status(400).json({message:err.message})
                }
            }
            console.log({status: !!err, message:err.message})
        })
            
        if(req.file) {
            imageName = req.file.filename
            correctUserData.image = imageName
        }

        const user = await User.findById({_id})
        if(!user){
            return res.status(400).json({message:"User is not exists"})
        }

        userData = UserData.findOneAndUpdate({_id: user.userData}, correctUserData)
        if(userData){
            return res.status.json({message:"Data was successfully updated", postUserData: userData})
        } else {
            return res.status(400).json({message:'Users data is not exists'})
        }
    } catch(e) {
        res.status(500).json({message:e.message})
    } 
})

router.delete('/delete', async (req, res) => {
    try{
        const {_id} = req.body
        const user = await User.findOneAndUpdate({_id}, {deleted: true})
        if(user){
            res.status.json({message:"User was successfully deleted"})
        } else {
            res.status(400).json({message: "User is not exists"})
        }
    } catch(e) {
        res.status(500).json({message:e.message})
    }
})

module.exports = router;

