const servicedAlerts = require('../models/servicedAlerts');

const json2xls = require('json2xls');
const fs = require('fs');

exports.getReports = (req, res, next) => {

    // const fromDate = req.body.from;
    // const toDate = req.body.to;
    //
    // servicedAlerts.find({date:{$gte:fromDate,$lte:toDate}}).then(servicedAlerts=>{
    //    req.report = servicedAlerts;
    //     console.log(servicedAlerts);
    // }).catch(err=>{
    //     console.log(err);
    // })
    res.render('reports/report', {
        reports: {}
    })

};
exports.postReports = (req, res, next) => {

    // const fromDate = req.body.from;
    // const toDate = req.body.to;
    //

    var from = new Date(req.body.date1).toISOString();
    var to = new Date(req.body.date2).toISOString();


    // console.log(iso1);
    // servicedAlerts.find({date:{$gte:from,$lte:to}}).then(servicedAlerts=>{
    //    req.report = servicedAlerts;
    //     console.log(servicedAlerts);
    // }).catch(err=>{
    //     console.log(err);
    // })

    // const serviced = new servicedAlerts({
    //     time: new Date(),
    //     date: new Date().toISOString(),
    //     mandal: {
    //         "dist": "Krishna",
    //         "mandal": "vij",
    //         "mroName": "Chiruhas",
    //         "mroPhone": "7386732234",
    //         "hasWhatsApp": "false",
    //         "hasTelegram": "true"
    //     },
    //     messaged: true,
    //     messagedTime: new Date(),
    //     called: true,
    //     calledTime: new Date()
    // });
    // serviced.save().then(res => {
    //     if (res) {
    //         return
    //     }
    // })

    servicedAlerts.find({date : {$lte: to, $gte: from}}).then(servicedAlerts => {
            req.report = servicedAlerts;
            servicedAlerts.from = req.body.date1;
            servicedAlerts.to = req.body.date2;
            res.render('reports/report', {
                reports:servicedAlerts
            });

    }).catch(err => {
        console.log(err);
    })


    // console.log(d1);

};

exports.download = (req, res, next) => {
    // const data = [
    //     {
    //         "userId": 1,
    //         "userPhoneNumber": 1888888888,
    //         "userAddress": 'xxxx',
    //         "date": '2013/09/10 09:10'  // string
    //     },
    //     {
    //         "userId": 2,
    //         "userPhoneNumber": 1888888888,
    //         "userAddress": 'xxxx',
    //         "date": new Date()
    //     },
    //     {
    //         "userId": 3,
    //         "userPhoneNumber": 1888888888,
    //         "userAddress": 'xxxx',
    //         "date": new Date()
    //     }
    // ];

    const json = {
        foo: 'bar',
        qux: 'moo',
        poo: 123,
        stux: new Date()
    }

    var xls = json2xls(json);
    fs.writeFileSync('data.xlsx', xls, 'binary');

};


