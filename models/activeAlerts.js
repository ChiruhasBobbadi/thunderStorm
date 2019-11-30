const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const activeAlertSchema = new Schema({
    mandal: {
        type: Schema.Types.ObjectId,
        ref: 'Mandal',
        required:true
    },
    address:{
        type: Object,

    },
    time: {
        type: String,
        required: true
    }


});


module.exports = mongoose.model('ActiveAlert', activeAlertSchema);