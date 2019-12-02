
const servicedAlerts = require('../models/servicedAlerts');

const messagePhase = require('../models/savedAlerts');
const tele = require('../models/telePhase');


exports.serviceAlert = (req, res, next) => {

    // console.log(req.session.active);



   let d = new Date();


    res.render('alerts/service', {
        alert: {...req.session.active,'date': d.getDate()+'-'+(d.getMonth()+1)+'-'+d.getFullYear()},
        errorMessage: req.flash('InvalidTime'),
        success:req.flash('edit_success')
    });


};

exports.postService = (req, res, next) => {
    let d = new Date();
    let date = d.getDate()+'-'+(d.getMonth()+1)+'-'+d.getFullYear();
    console.log(req.body.time);
    if (req.body.time) {
        let time = req.body.time;
        console.log(req.session.active);
        if (req.session.active) {
            const saved = new tele({

                time: time,
                mandal: req.session.active._id,
                date:date
            });
            saved.save().then(result => {
                if (result) {
                    const saved = new messagePhase({
                        _id:result._id,
                        time: time,
                        mandal: req.session.active._id,
                        date:date
                    });
                    saved.save().then(result => {
                        if(result)
                             res.redirect('/home')
                    }).catch(err => {

                        console.log(err);
                    })

                } else {
                    return res.redirect('/error');
                }
            });
        }


    } else {
        req.flash('InvalidTime', "Invalid Time");
        res.redirect('/service');
    }
};

exports.getMessage = (req, res, next) => {

    const mandal = req.session.active;
    mandal.message = "This is a dummy message";
    res.render('alerts/message', {
        obj: mandal,
        errorMessage: req.flash('messageError') || req.flash('saveError')
    });


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
        "mandal": req.session.active,
        "messaged": messaged,
        "messagedTime": messageTime,
        "called": called,
        "calledTime": callTime

    }).save().then(result => {
        if (result) {
            res.render('alerts/confirmation', {
                obj: result
            })
        }
    }).catch(err => {
        req.flash("saveError", "Error saving Transaction try again..");
        console.log(err);
    })

};






