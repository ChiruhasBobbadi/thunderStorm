const mongoose =require('mongoose');

const Schema = mongoose.Schema;

const tempAlertSchema = new Schema({

    mandal:{
        type: Schema.Types.ObjectId,
        ref: 'Mandal',
        required: true
    },
    createdAt:{
        type:Date,
        required:true
    }
});

tempAlertSchema.index({createdAt:1},{expireAfterSeconds:2700});

module.exports = mongoose.model('TempAlert', tempAlertSchema);