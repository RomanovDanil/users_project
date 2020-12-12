const {Router}    = require("express")
const Document    = require('../models/Document')
const Role        = require('../models/Role')
const Event       = require('../models/Event')
const multer      = require('multer')
const path        = require('path')
const validator   = require('validator');
const {check, validationResult} = require('express-validator')

const router = Router()


// /api/document/create
router.post(
    '/create',
    [
        check('title', 'Title is empty').isEmpty(),
        check('day', 'Date is empty').isEmpty(),
        check('content', 'Content is empty!').isEmpty(),
        check('role', 'Role is empty!').isEmpty()    
    ], async (req, res) => {
    try{
        const errors = validationResult(req)
        if(!errors.isEmpty){
            return res.status(400).json({
                errors: errors.array(),
                message: 'Invalid data was entered when creating the document.'
            })
        }

        const {title, day, content, role, event} = req.body

        if(!Role.findOne({name: role})){
            return res.status(400).json({message:'Role is not exists'})
        }
        
        //проверить наличие события в базе
        const curEvent = await Event.findById({event})
        if(!curEvent){
            return res.status(400).json({message:'Event is not exists.'})
        }

        if(!/С[-+]?[1-9]+/.test(day)){
            return res.status(400).json({message:'Document day in not validated'})
        }

        const document = new Document({title, day, content, role, event})
        document.save()
        //ответ
        res.status(201).json({message:'Event is successfully created'})
    }catch(e){
        res.status(500).json({message: e.message})
    }
})

// /api/document/getById
router.get('/getById', async (req, res) => {
    try{
        const {_id} = req.body
        const curDocument = await Document.findById({_id})
        if(curDocument){
            return res.json({message:curDocument})
        } else {
            return res.status(400).json({message:'Document is not exists'})
        }
    } catch(e) {
        res.status(500).json({message:e.message})
    }
})

// /api/documents/get
router.get('/get', async (req, res) => {
    try{
        const {event} = req.body
        const documents = await Document.find({event: event})
        if(documents){
            return res.json({message:documents})
        } else {
            return res.status(400).json({message:'Documents are not exists'})
        }
    } catch(e) {
        res.status(500).json({message:e.message})
    }
})

// /api/document/update
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

        const document = await Document.findByIdAndUpdate({_id}, correctNewData)
        if(!document){
            return res.status(400).json({message:"Document is not exists"})
        } else {
            return res.status(200).json({message:"Documents's data is successfully updated"})
        }
    } catch(e) {
        res.status(500).json({message:e.message})
    } 
})


// /api/document/delete
router.delete('/delete', async (req, res) => {
    try{
        const {_id} = req.body
        const document = await Document.findByIdAndUpdate({_id}, {deleted: true})
        if(document){
            res.status.json({message:"Document is successfully deleted"})
        } else {
            res.status(400).json({message:"Document is not exists"})
        }
    } catch(e) {
        res.status(500).json({message:e.message})
    }
})

module.exports = router;

