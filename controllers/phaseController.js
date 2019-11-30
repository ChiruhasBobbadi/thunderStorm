const tele = require('../models/telePhase');
const message = require('../models/savedAlerts');
const saved = require('../models/savedAlerts')
exports.tele = (req, res, next) => {


    tele.find({}).populate('mandal').exec().then(result => {


        res.render('phases/tele', {
            teles: result,
            error: req.flash('error')
        })


    }).catch(err => {
        console.log(err);
    })

};

exports.postTele = (req, res, next) => {

    const check = req.body.check;

    if (check && check.length === 3) {


        id = req.params.id;

        message.findById(id).then(result => {
            if (result) {
                tele.findByIdAndDelete(id);
            } else {
                // write to saved alerts.
                //TODO


            }
        }).catch(err => {
            console.log(err);
        });


    } else {
        req.flash('error', 'Please check all check boxes');

    }

    res.redirect('/tele');
};

exports.message = (req, res, next) => {
    message.find({}).populate('mandal').exec().then(result => {


        res.render('phases/message', {
            messages: result,
            error: req.flash('message_error')
        })


    }).catch(err => {
        console.log(err);
    })
};

exports.postMessage = (req, res, next) => {
    const check = req.body.check;

    if (check && check.length === 6) {

        id = req.params.id;

        tele.findById(id).then(result => {
            if (result) {
                message.findByIdAndDelete(id);
            } else {
                // write to saved alerts.
                //todo


            }
        }).catch(err => {
            console.log(err);
        });

    } else {
        req.flash('message_error', 'Please check all check boxes')
    }
    res.redirect('/message');
}