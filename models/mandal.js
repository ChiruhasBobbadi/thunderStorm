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
   mro:{
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
       }
   },super:{
        superName: {
            type: String,
            required: true
        },
        superPhone: {
            type: String,
            required: true
        },
        hasWhatsApp: {
            type: Boolean,
            required: true
        }
    },
    dro:{
        droName: {
            type: String,
            required: true
        },
        droPhone: {
            type: String,
            required: true
        },
        hasWhatsApp: {
            type: Boolean,
            required: true
        }
    },
    rdo:{
        rdoName: {
            type: String,
            required: true
        },
        rdoPhone: {
            type: String,
            required: true
        },
        hasWhatsApp: {
            type: Boolean,
            required: true
        }
    },
    alerts:{
        hasWhatsApp: {
            type: Boolean,
            required: true
        }
    }


});
mandalSchema.index({mandal:1});
module.exports = mongoose.model('Mandal', mandalSchema);