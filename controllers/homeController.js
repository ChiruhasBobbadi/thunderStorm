const activeAlerts = require('../models/activeAlerts');

const savedAlerts = require('../models/savedAlerts');

exports.getHome = (req,res,next)=>{
    /**
     * fetching active alerts and displaying the view..
     */
activeAlerts.find({}).populate('mandal').exec().then(activeAlerts => {

    // loop on the array and extract the mandals and store it in array pass that array to rendering

    req.session.active =activeAlerts;

    const mandals = activeAlerts.map(a => {
            a.mandal.time = a.time;
            return a.mandal;
        }
    );

    //todo
    res.render('alerts/home', {
        alerts: mandals
    });
}).catch(err => {
    console.log(err);
})

};

exports.postHome = (req,res,next)=>{


    const _id = req.query.id;

    console.log(_id);
    activeAlerts.findOne({mandal:_id}).populate('mandal').then(activeAlerts=>{

        if(activeAlerts){
            req.session.active=activeAlerts.mandal;
            const saved = new savedAlerts({
                time:activeAlerts.time,
                mandal:activeAlerts.mandal
            });

            return saved.save()
        }

    }).then(res=>{
        if(res)
        return activeAlerts.deleteOne({mandal:_id})
    }).then(result=>{

        if(result){
            res.redirect('/service')
        }


    }).catch(err=>{
        console.log(err);
    })




};


/**
 * for deleting active alert and writing alert to savedAlerts.
 */

// const _id = req.query.id;
// activeAlerts.findOne({mandal:_id}).then(activeAlerts=>{
//     const saved = new savedAlerts({
//         time:activeAlerts.time,
//         mandal:activeAlerts.mandal
//     });
//     return saved.save()
// }).then(res=>{
//     return activeAlerts.deleteOne({mandal:_id})
// }).then(res=>{
//     if(res)
//         console.log("sucess");
//     // redirect to the data verification page..
//
// }).catch(err=>{
//     console.log(err);
// })