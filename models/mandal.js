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
        type: String,
        required: true
    },
    hasTelegram: {
        type: String,
        required: true
    },

    superName: {
        type: String,
        required: true
    },
    superPhone: {
        type: String,
        required: true
    },
    super_hasWhatsApp: {
        type: String,
        required: true
    },


    droName: {
        type: String,
        required: true
    },
    droPhone: {
        type: String,
        required: true
    },
    dro_hasWhatsApp: {
        type: String,
        required: true
    },


    rdo_hasWhatsApp: {
        type: String,
        required: true
    },


    alerts_hasWhatsApp:{
        type: String,
        required: true
    }


});

module.exports = mongoose.model('Mandal', mandalSchema);