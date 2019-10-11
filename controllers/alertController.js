const activeAlerts = require('../models/activeAlerts');
const savedAlerts = require('../models/savedAlerts');

exports.alert = (req,res,next)=>{

    activeAlerts.find({}).then(activeAlert=>{
        console.log("sucess");
    }).catch(err=>{
        console.log(err);
    })

};

exports.serviceAlert=(req,res,next)=>{


    const _id = req.query.id;

    console.log(_id);
    activeAlerts.findOne({mandal:_id}).populate('mandal').then(activeAlerts=>{

        if(activeAlerts){
            req.active=activeAlerts;
            const saved = new savedAlerts({
                time:activeAlerts.time,
                mandal:activeAlerts.mandal
            });

            return saved.save()
        }

    }).then(res=>{
        return activeAlerts.deleteOne({mandal:_id})
    }).then(result=>{
        console.log(req.active);
        if(result){
            res.render('alerts/service', {
                alert:req.active.mandal
            });

        }

        // redirect to the data verification page..

    }).catch(err=>{
        console.log(err);
    })



};
