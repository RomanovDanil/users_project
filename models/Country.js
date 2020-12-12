const {Schema, model} = require('mongoose');

const schema = new Schema({
    name:{
        type: String,
        required: true
    },
    abbreviatedName:{
        type: String, 
        required: true
    }
});

module.exports = model('Country', schema);