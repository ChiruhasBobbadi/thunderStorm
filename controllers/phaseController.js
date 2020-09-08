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
    let c=0;
    if(req.body.checkMro|| req.body.checkDro||req.body.checkSuper)
        c=1;


    if (c===1) {
const teles={
    'mro': req.body.checkMro?'verified':' ',
    'dro': req.body.checkDro?'verified':' ',
    'super': req.body.checkSuper?'verified':' ',
    'comments': req.body.comments
}

        id = req.params.id;

        tele.findById(id).then(result=>{


            if(result){
               return serviced.findById(id)
            }
            else
                res.redirect('/error:tele');
        }).then(result => {

            if (result) {

                result.tele = teles;
                result.temp='no';

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
                        tele: teles,
                        temp:'yes',
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
        req.flash('error', 'Please check atleast one check box');
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



    id = req.params.id;

    const messages = {
        'mro': req.body.checkMro ? 'veriried' : ' ',
        'super': req.body.checkSuper ? 'verified' : ' ',
        'rdo': req.body.checkRdo ? 'verified' : ' ',
        'alerts': req.body.checkAlert ? 'verified' : ' ',
        'dro': req.body.checkDro ? 'verified' : ' ',
        'comments': req.body.comments
    };
   const message2 = {
        'mro':req.body.checkMroTel?'verified':' '
    };


   message.findById(id).then(result=>{
       if(result)
           return serviced.findById(id);
       else
           res.redirect('/error/:message')
   })
    .then(result => {
            if (result) {
                result.message = messages;
                result.message2 =message2;
                result.temp='no';


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
                        temp:'yes',
                        message: messages,
                        message2: message2,

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