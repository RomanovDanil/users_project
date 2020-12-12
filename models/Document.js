const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
    title: {
        type     : String, 
        required : true
    },
    day: {
        type: String,
        required: true,

    },
    content: {
        type: String,
        required: true
    },
    role: {
        type: Types.ObjectId,
        ref: "Role",
        required: true
    },
    event: {
        type: Types.ObjectId,
        ref: "Event",
        required: true
    },
    deleted: {
        type: Boolean,
        default: false
    }
});

module.exports = model('Document', schema);