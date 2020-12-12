const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
    event_title: {
        type     : String, 
        required : true
    },
    start_date: {
        type     : Date,
        required : true
    },
    c_1_date:{
        type     : Date,
        required : true
    },
    c_plus_1_date:{
        type     : Date,
        required : true
    },
    finish_date:{
        type: Date,
        required: true
    },
    image:{
        type: String
    },
    deleted:{
        type: String,
        default: false
    }
});

module.exports = model('Event', schema);