const {Router}    = require("express")
const Country     = require('../models/Country')

const router = Router()

// /api/country/create
router.post(
    '/create', async (req, res) => {
    try{
        const {name} = req.body
        const curCountry = await Country.findOne({name})
        if(curCountry){
            return res.status(400).json("Такая страна уже существует")
        }
        const country = new Country({name})
        await country.save()
        res.status(201).json({message:'Страна успешно добавлена'})
    }catch(e){
        res.status(500).json({message: e.message})
    }
})

// /api/country/createFromJSON
router.post('/createFromJSON', async(req, res) => {
    try{
        errMessage = []
        for(abbreviatedName in req.body) {
            name = req.body[abbreviatedName]
            const curCountry = await Country.findOne({name})
            if(curCountry){
                continue
            }
            const country = new Country({abbreviatedName, name})
            await country.save()
        }
        res.status(201).json({message:'Страны успешно добавлена', errors: errMessage})
    }catch(e){
        res.status(500).json({message: e.message})
    }
})

// /api/country/get
router.get('/get', async (req, res) => {
    try{
        const countries = await Country.find()
        if(countries){
            return res.json({countries})
        } else {
            return res.status(400).json({message:'Список стран пуст'})
        }
    } catch(e) {
        res.status(500).json({message:e.message})
    }
})

// /api/country/delete
router.delete('/delete', async (req, res) => {
    try{
        const {name} = req.body
        const country = await Country.findOneAndDelete({name})
        if(!country){
            return res.status(400).json("Страна не найдена")
        }
        res.status.json({message:"Страна успешно удалена"})
    } catch(e) {
        res.status(500).json({message:e.message})
    }
})

module.exports = router;