const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
    firstName:{
        type: String,
        required: true
    },
    secondName:{
        type: String,
        required: true
    },
    thirdName:{
        type: String,
        required: true
    },
    country:{
        type: Types.ObjectId,
        ref: 'Country',
        required: true
    },
    image:{
        type: String,
        required: false
    },
    pin:{
        type: String,
        minlength: 4,
        maxlength: 4
    },
    role:{
        type: Types.ObjectId,
        ref: 'Role',
        required: true
    },
    about:{
        type: String,
        required: false
    }
});

module.exports = model('UserData', schema);