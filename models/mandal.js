const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const mandalSchema = new Schema({
    dist: {
        type: String,
        required: true
    },
    mandal: {
        type: String,
        required: true
    },
    mroName: {
        type: String,
        required: true
    },
    mroPhone: {
        type: String,
        required: true
    },
    hasWhatsApp: {
        type: Boolean,
        required: true
    },
    hasTelegram: {
        type: Boolean,
        required: true
    },

});


module.exports = mongoose.model('Mandal', mandalSchema);