const User = require('../models/user');
const mandal = require('../models/mandal');
const activeAlerts = require('../models/activeAlerts');
const tempAlerts = require('../models/tempAlerts');

exports.Login = (req, res, next) => {

// render login page
    res.render('login/login')
};


exports.postLogin = (req, res, next) => {
    //check auth and if successful send to home else warn
    // if authenticated redirect to home
    User.findOne({email:req.body.email}).then(user=>{
        if(user && req.body.password===user.password){
            /**
             * session saving code
             * @type {boolean}
             */
            req.session.loggedIn = true;
           // return req.session.save(err=>{
           //     console.log("session stored");
           //     res.redirect('/home')
           // })
           return res.redirect('/home');

        }
         res.redirect('/login');
    })



};


/**
 * writing active alert..
 */
// mandal.findOne({mandal:"vij"}).then(mandal=>{
//     console.log(mandal);
//     const alerts = new activeAlerts({mandal:mandal,time:new Date()});
//     return alerts.save()
// }).then(res=>{
//     console.log("written to active alerts");
// }).catch(err=>{
//     console.log(err);
// });


/**
 * adding active alerts if they dont exits in tempalerts.
 */

//let m;
//     mandal.findOne({mandal: "vij"}).then(mandal => {
//     m=mandal;
//     return tempAlerts.count({mandal: mandal})
// })
//     .then(cnt => {
//         if (cnt === 0) {
//             const alerts = new activeAlerts({mandal: m, time: new Date().toISOString()});
//             return alerts.save()
//         } else
//             console.log("document already exits");
//
//     }).
// then(res => {
//     console.log("active alert added");
// }).catch(err => {
//     console.log(err);
// });


/**
 * for fetching active alerts from db and updating view
 */
// activeAlerts.find({}).populate('mandal').exec().then(activeAlerts => {
//
//     // loop on the array and extract the mandals and store it in array pass that array to rendering
//
//     const mandals = activeAlerts.map(a=>{
//             a.mandal.time = a.time;
//             return a.mandal;
//         }
//     );
//
//     console.log(mandals);
//     //todo
//     res.render('alerts/home', {
//         alerts: mandals
//     });
// }).catch(err => {
//     console.log(err);
// })


