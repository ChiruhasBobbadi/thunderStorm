const activeAlerts = require('../models/activeAlerts');
const mandals = require('../models/mandal');

exports.getHome = (req, res, next) => {
    /**
     * fetching active alerts and displaying the view..
     */
    activeAlerts.find({}).populate('mandal').exec().then(activeAlerts => {

        // loop on the array and extract the mandals and store it in array pass that array to rendering

        req.session.active = activeAlerts;

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

exports.postHome = (req, res, next) => {

    const _id = req.query.id;

    console.log(_id);
    activeAlerts.findOne({mandal: _id}).populate('mandal').then(activeAlerts => {

        if (activeAlerts) {
            temp = activeAlerts.mandal;
            req.session.active = temp;
            console.log(temp);
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

exports.error = (req, res, next) => {

    res.render('alerts/error');
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


    mandals.findOne({mandal: mandal}).then(result => {

        if (result) {
            const ac = new activeAlerts({
                mandal: result,
                time: new Date().toTimeString()
            });
            return ac.save();
        } else {
            req.flash('mandal_error', 'No mandal found try again or contact administrator.')
        }

    }).then(result => {
        if (result) {
            console.log("active alert saved");

             return result.populate('mandal').execPopulate()

        } else {
            console.log("alert save failed");
           return res.redirect('/manual')
        }

    }).then(result=>{
        if(result){
            console.log(result);
            req.session.active = result.mandal;
            res.redirect('/service')
        }

    }).catch(err => {
        console.log(err);
    })


};
