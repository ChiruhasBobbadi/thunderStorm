const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const servicedAlertSchema = new Schema({

    time: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    mandal: {
        type: Object,
        required: true
    },
    messaged: {
        type: Boolean,
        required: true
    },
    messagedTime: {
        type: String,
        required: true
    },
    called: {
        type: Boolean,
        required: true
    },
    calledTime: {
        type: String,
        required: true
    },

});


servicedAlertSchema.index({date:1});

module.exports = mongoose.model('serviced-alerts', servicedAlertSchema);