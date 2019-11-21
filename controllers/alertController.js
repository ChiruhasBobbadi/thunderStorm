const activeAlerts = require('../models/activeAlerts');
const mandals = require('../models/mandal');
const servicedAlerts = require('../models/servicedAlerts');

exports.alert = (req, res, next) => {

    activeAlerts.find({}).then(activeAlert => {
        console.log("sucess");
    }).catch(err => {
        console.log(err);
    })

};

exports.serviceAlert = (req, res, next) => {

    // console.log(req.session.active);

    mandals.findOne({_id: req.session.active}).then(mandal => {
        if (mandal) {
            res.render('alerts/service', {
                alert: mandal,
                errorMessage: req.flash('InvalidTime')
            });
        }
    }).catch(err => {
        console.log(err);
    })


};

exports.postService = (req, res, next) => {

    if (req.body.time) {
        req.session.initTime = req.body.time;
        console.log(req.body.time);
        res.redirect('/message');
    } else {
        req.flash('InvalidTime', "Invalid Time");
        res.redirect('/service');
    }


};

exports.getMessage = (req, res, next) => {

    mandals.findOne({_id: req.session.active}).then(mandal => {
        if (mandal) {
            //TODO
            mandal.message = "This is a dummy message";
            res.render('alerts/message', {
                obj: mandal,
                errorMessage: req.flash('messageError') || req.flash('saveError')
            });
        }
    }).catch(err => {
        console.log(err);
    })


};


exports.postMessage = (req, res, next) => {


    const messaged = (req.body.messaged);
    const called = (req.body.called);

    const messageTime = req.body.messageTime;
    const callTime = req.body.callTime;

    if (messageTime === '' || callTime === '') {

        req.flash('messageError', "Fill all the fields.");
        return res.redirect('/message');

    }


    // saving
    new servicedAlerts({
        "date": new Date().toISOString(),
        "time": req.session.initTime,
        "mandal":req.session.active,
        "messaged": messaged,
        "messagedTime": messageTime,
        "called": called,
        "calledTime": callTime

    }).save().then(result => {
        if (result) {
           res.render('alerts/confirmation',{
               obj:result
           })
        }
    }).catch(err => {
        req.flash("saveError", "Error saving Transaction try again..");
        console.log(err);
    })

};






