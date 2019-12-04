const activeAlerts = require('../models/activeAlerts');
const mandals = require('../models/mandal');


exports.getHome = (req, res, next) => {
    /**
     * fetching active alerts and displaying the view..
     */
    activeAlerts.find({}).populate('mandal').exec().then(activeAlerts => {

        // loop on the array and extract the mandals and store it in array pass that array to rendering

        req.session.active = activeAlerts;


        // const mandals = activeAlerts.map(a => {
        //         a.mandal.time = a.time;
        //         return a.mandal;
        //     }
        // );


        //todo
        res.render('alerts/home', {
            alerts: activeAlerts
        });
    }).catch(err => {
        console.log(err);
    })

};

exports.postHome = (req, res, next) => {

    const _id = req.query.id;


    activeAlerts.findOne({mandal: _id}).populate('mandal').then(activeAlerts => {

        if (activeAlerts) {
            temp = activeAlerts.mandal;
            req.session.active = temp;

            return activeAlerts.deleteOne({mandal: _id})
        } else {
            return res.redirect('/error');
        }
    }).then(result => {
        if (result) {
            res.redirect('/service')
        }
    }).catch(err => {

        console.log(err);
    })

};

exports.delete = (req,res,next)=>{
    const params = req.query.id;

   // var objectId = mongoose.Types.ObjectId(params);


   /*activeAlerts.deleteOne({_id:objectId}).then(result=>{
       console.log(result);
       if(result)
           res.redirect('/home')
   }).catch(err=>{
       console.log(err);
   })
*/

   activeAlerts.findByIdAndDelete(params).then(result=>{
       console.log(result);
       if(result)
           res.redirect('/home')
   }).catch(err=>{
       res.redirect('/error')
   })

};

exports.error = (req, res, next) => {

    let type=req.params.type;
    console.log(type);
    let t={};
    if(type===':message')
    {
        t.text='Go back to message phase',
            t.url ='/message'
    }
    else if(type===':tele')
    {
t.text='Go back to Tele phase',
    t.url = '/tele'
    }
    res.render('alerts/error',{
info:t
    });
};


exports.logout = (req, res, next) => {

    req.session.destroy();
    res.redirect('/login');

};

exports.manual = (req, res, next) => {


    res.render('alerts/manual', {
        error: req.flash('mandal_error')
    });
};

exports.postmanual = (req, res, next) => {

    const mandal = req.body.mandal;
    const district = req.body.district;

    mandals.findOne({mandal: mandal,dist:district}).then(result => {

        if (result) {
            const ac = new activeAlerts({
                mandal: result,
                time: new Date().toTimeString()
            });
            return  ac.populate('mandal').execPopulate()
        } else {
            req.flash('mandal_error', 'No mandal found try again or contact administrator.');
            res.redirect('/manual');
        }

    }).then(result=>{
        if(result){

            req.session.active = result.mandal;
            res.redirect('/service')
        }

    }).catch(err => {
        console.log(err);
    })


};
