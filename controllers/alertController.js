const activeAlerts = require('../models/activeAlerts');
const mandals = require('../models/mandal');

exports.alert = (req,res,next)=>{

    activeAlerts.find({}).then(activeAlert=>{
        console.log("sucess");
    }).catch(err=>{
        console.log(err);
    })

};

exports.serviceAlert=(req,res,next)=>{

    // console.log(req.session.active);

    mandals.findOne({_id:req.session.active}).then(mandal=>{
        if(mandal){
            res.render('alerts/service', {
                alert:mandal
            });
        }
    }).catch(err=>{
        console.log(err);
    })




};



