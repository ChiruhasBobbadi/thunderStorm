const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const activeAlertSchema = new Schema({
    mandal: {
        type: Schema.Types.ObjectId,
        ref: 'Mandal',

    },
    address:{
        type: Object,
        required: true
    },
    time: {
        type: String,
        required: true
    }


});


module.exports = mongoose.model('ActiveAlert', activeAlertSchema);