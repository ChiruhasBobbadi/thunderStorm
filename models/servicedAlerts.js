const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const servicedAlertSchema = new Schema({

    time: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    mandal: {
        type: Object,
        required: true
    },
    isoDate:{
        type:Date,
        required:true
    },
    tele:{
        type: Object,
        required: true
    },
    message:{
        type: Object,
        required: true
    },
    message2:{
        type: Object,
        required: true
    }

});


servicedAlertSchema.index({date:1});

module.exports = mongoose.model('serviced-alerts', servicedAlertSchema);