const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const telephase = new Schema({
    mandal: {
        type: Schema.Types.ObjectId,
        ref: 'Mandal',
        required: true
    },
    time: {
        type: String,
        required: true
    }


});


module.exports = mongoose.model('telephase', telephase);