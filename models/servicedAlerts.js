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
        type: Schema.Types.ObjectId,
        ref: 'Mandal',
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
    mroName:{
        type: String,
        required: true
    },
    mroPhone:{
        type: String,
        required: true
    }
});


servicedAlertSchema.index({date:1});

module.exports = mongoose.model('Active-Alert', servicedAlertSchema);