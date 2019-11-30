const tele = require('../models/telePhase');
const message = require('../models/savedAlerts');
const serviced = require('../models/servicedAlerts');
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

        serviced.findById(id).then(result => {

            if (result) {

                result.tele = {
                    'mro': 'verified',
                    'dro': 'verified',
                    'super': 'verified',
                    'comments': req.body.comments
                };
                console.log(result);

                return result.save()

            } else {

                return tele.findById(id).populate('mandal').then(result => {

                    console.log(result.mandal);
                    const t = new serviced({
                        _id: result._id,
                        date: result.date,
                        time: result.time,
                        isoDate: new Date().toISOString(),
                        mandal: {...result.mandal},
                        tele: {
                            'mro': 'verified',
                            'dro': 'verified',
                            'super': 'verified',
                            'comments': req.body.comments
                        },
                        message: {},
                        message2: {},

                    });

                    return t.save()

                }).catch(err => {
                    console.log(err);
                })


            }
        }).then(result => {
            console.log("inserted");
            console.log(result);
            return tele.findByIdAndDelete(id)

        }).then(result => {
            res.redirect('/tele');
        }).catch(err => {
            console.log(err);
        });


    } else {
        req.flash('error', 'Please check all check boxes');
        res.redirect('/tele');
    }


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

        serviced.findById(id).then(result => {
                if (result) {
                    result.message = {
                        'mro': 'verified',
                        'super': 'verified',
                        'rdo': 'verified',
                        'alerts': 'verified',
                        'mro': 'verified',
                        'dro': 'verified',
                        'comments': req.body.comments
                    };
                    result.message2 = {
                        'mro': 'verified'
                    };


                    return result.save()

                } else {

                    return message.findById(id).populate('mandal').then(result => {


                        const t = new serviced({
                            _id: result._id,
                            date: result.date,
                            time: result.time,
                            isoDate: new Date().toISOString(),
                            mandal: {...result.mandal},
                            tele: {},
                            message: {
                                'mro': 'verified',
                                'super': 'verified',
                                'rdo': 'verified',
                                'alerts': 'verified',
                                'mro': 'verified',
                                'comments': req.body.comments
                            },
                            message2: {
                                'mro': 'verified'
                            },

                        });

                        return t.save()

                    }).catch(err => {
                        console.log(err);
                    });

                }
            }
        ).then(result => {
            console.log("inserted");
            return message.findByIdAndDelete(id)
        }).then(result => {
            res.redirect('/message')
        }).catch(err => {
            console.log(err);
        });

    } else {
        req.flash('message_error', 'Please check all check boxes');
        res.redirect('/message');
    }


    /*
        const check = req.body.check;

        if (check && check.length === 3) {


            id = req.params.id;

            serviced.findById(id).then(result => {

                if (result) {

                    result.tele={
                        'mro': 'verified',
                        'dro': 'verified',
                        'super': 'verified',
                        'comments': req.body.comments
                    };
                    console.log(result);

                    return tele.save()

                } else {

                    return  tele.findById(id).populate('mandal').then(result => {

                        console.log(result.mandal);
                        const t = new serviced({
                            _id: result._id,
                            date: result.date,
                            time: result.time,
                            isoDate: new Date().toISOString(),
                            mandal: {...result.mandal},
                            tele: {
                                'mro': 'verified',
                                'dro': 'verified',
                                'super': 'verified',
                                'comments': req.body.comments
                            },
                            message: {},
                            message2: {},

                        });

                        return t.save()

                    }).catch(err=>{
                        console.log(err);
                    })


                }
            }).then(result => {
                console.log("inserted");
                console.log(result);
                return tele.findByIdAndDelete(id)

            }).then(result => {
                res.redirect('/tele');
            }).catch(err => {
                console.log(err);
            });


        } else {
            req.flash('error', 'Please check all check boxes');
            res.redirect('/tele');
        }*/
};