
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const globalAlertSchema = new Schema({
    location: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: []
    },
    createdAt:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true
    }


});


globalAlertSchema.index({date:1},{expireAfterSeconds:70});
globalAlertSchema.index({"location":"2dsphere"});

module.exports = mongoose.model('GlobalAlert',globalAlertSchema);