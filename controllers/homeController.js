const activeAlerts = require('../models/activeAlerts');


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


};
