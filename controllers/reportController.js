const servicedAlerts = require('../models/servicedAlerts');
const path = require('path');
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
        reports: [],
        error:req.flash('date_error')
    })

};
exports.postReports = (req, res, next) => {

    // const fromDate = req.body.from;
    // const toDate = req.body.to;
    //

    let from = new Date(req.body.date1).toISOString();
    let to = new Date(req.body.date2).toISOString();

    if(from && to){
        servicedAlerts.find({isoDate: {$lte: to, $gte: from}}).then(servicedAlerts => {




            servicedAlerts.from = req.body.date1;
            servicedAlerts.to = req.body.date2;
            res.render('reports/report', {
                reports: servicedAlerts,
                error:req.flash('date_error')
            });


        }).catch(err => {
            console.log(err);
        })
    }

   else{
       req.flash('date_error','Both to and from dates are required');
    }


    // console.log(d1);

};

exports.download = (req, res, next) => {


    // let from = new Date(req.session.fromDate).toISOString();
    // let to = new Date(req.session.toDate).toISOString();

    const reports = req.session.report;
    //
    let xls = json2xls(reports);
    let p = path.join('files', 'report.xlsx');
    fs.writeFileSync(p, xls, 'binary');


    fs.readFile(p, (err, data) => {
        if (err)
            return next(err);

        res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'inline; filename="report.xlsx"');
        res.send(data);

    })
};


