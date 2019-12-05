const servicedAlerts = require('../models/servicedAlerts');
const path = require('path');
const json2xls = require('json2xls');
const fs = require('fs');
const excel = require('node-excel-export');

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



    let from = new Date(req.body.date1).toISOString();
    let to = new Date(req.body.date2).toISOString();

    if(from && to){
        servicedAlerts.find({isoDate: {$lte: to, $gte: from},temp:'no'}).then(servicedAlerts => {

            servicedAlerts.from = req.body.date1;
            servicedAlerts.to = req.body.date2;

            console.log(servicedAlerts);

            req.session.reports =  flatten(servicedAlerts);

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




};

exports.download = (req, res, next) => {


    // let from = new Date(req.session.fromDate).toISOString();
    // let to = new Date(req.session.toDate).toISOString();


    const styles = {
        headerDark: {
            fill: {
                fgColor: {
                    rgb: 'FFFFCCFF'
                }
            },
            font: {
                color: {
                    rgb: '000000'
                },
                sz: 18,


            }
        },

        cellPink: {
            fill: {
                fgColor: {
                    rgb: 'FFFFCCFF'
                }
            }
        },

    };


    //let xls = json2xls( req.session.reports);
    let p = path.join('files', 'report.xlsx');
    // fs.writeFileSync(p, xls, 'binary');

    //Here you specify the export structure
    const specification = {
        _id: { // <- the key should match the actual data key
            displayName: 'Alert ID', // <- Here you specify the column header
            headerStyle: styles.headerDark, // <- Header style
            width: 240 // <- width in pixels
        },
        date: {
            displayName: 'Date',
            headerStyle: styles.headerDark,
            width: '10' // <- width in chars (when the number is passed as string)
        },
        time: {
            displayName: 'Description',
            headerStyle: styles.headerDark,

            width: '10' // <- width in pixels,

        },
        district: {
            displayName: 'District',
            headerStyle: styles.headerDark,

            width: '20' // <- width in pixels,

        },
        mandal: {
            displayName: 'Mandal',
            headerStyle: styles.headerDark,

            width: '20' // <- width in pixels,

        },
        mroPhone: {
            displayName: 'MRO Phone',
            headerStyle: styles.headerDark,

            width: '10' // <- width in pixels,

        },
        mroName: {
            displayName: 'MRO Name',
            headerStyle: styles.headerDark,

            width: '20' // <- width in pixels,

        },
        superName: {
            displayName: 'D.Sec Name',
            headerStyle: styles.headerDark,

            width: '20' // <- width in pixels,

        },
        superPhone: {
            displayName: 'D.Sec Phone',
            headerStyle: styles.headerDark,

            width: '10' // <- width in pixels,

        },
        droName: {
            displayName: 'DRO Name',
            headerStyle: styles.headerDark,

            width: '20' // <- width in pixels,

        }
        ,droPhone: {
            displayName: 'DRO Phone Number',
            headerStyle: styles.headerDark,

            width: '10' // <- width in pixels,

        },mroTele: {
            displayName: 'MRO TelePhase',
            headerStyle: styles.headerDark,

            width: '10' // <- width in pixels,

        },droTele: {
            displayName: 'DRO TelePhase',
            headerStyle: styles.headerDark,

            width: '10' // <- width in pixels,

        },superTele: {
            displayName: 'D.Sec TelePhase',
            headerStyle: styles.headerDark,

            width: '10' // <- width in pixels,

        },commentsTele: {
            displayName: 'TelePhase Comments',
            headerStyle: styles.headerDark,

            width: '10' // <- width in pixels,

        },mroWhatsApp : {
            displayName: 'MRO MessagePhase',
            headerStyle: styles.headerDark,

            width: '10' // <- width in pixels,

        },superWhatsApp : {
            displayName: 'D.Sec MessagePhase',
            headerStyle: styles.headerDark,

            width: '10' // <- width in pixels,

        },rdoWhatsApp : {
            displayName: 'RDO MessagePhase',
            headerStyle: styles.headerDark,

            width: '10' // <- width in pixels,

        },alertsWhatsApp : {
            displayName: 'Alerts MessagePhase',
            headerStyle: styles.headerDark,

            width: '10' // <- width in pixels,

        },droWhatsApp : {
            displayName: 'DRO MessagePhase',
            headerStyle: styles.headerDark,

            width: '10' // <- width in pixels,

        },mroTelegram : {
                displayName: 'Mro Telegram',
                headerStyle: styles.headerDark,

                width: '10' // <- width in pixels,

            }
        ,commentsMessage : {
            displayName: 'MessagePhase Comments',
            headerStyle: styles.headerDark,

            width: '30' // <- width in pixels,

        },


    }






    const report = excel.buildExport(
        [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
            {
                name: 'reports', // <- Specify sheet name (optional)


                specification: specification, // <- Report specification
                data: req.session.reports // <-- Report data
            }
        ]
    );

    fs.writeFileSync(p, report, 'binary');

    fs.readFile(p, (err, data) => {
        if (err)
            return next(err);

        res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'inline; filename="report.xlsx"');
        res.send(data);

    })
};


function flatten(json){
    let arr=[];
    json.forEach(j=>{
        const t = {
            _id:j._id,
            date:j.date,
            time:j.time,
            district:j.mandal.dist,
            mandal:j.mandal.mandal,
            mroPhone:j.mandal.mroPhone,
            mroName:j.mandal.mroName,
           /* mroHasTelegram:j.mandal.hasTelegram,
            mroHasWhatsApp:j.mandal.hasWhatsApp,*/
            superName:j.mandal.superName,
            superPhone:j.mandal.superPhone,
           // super_hasWhatsApp: j.mandal.super_hasWhatsApp,
            droName:j.mandal.droName,
            droPhone:j.mandal.droPhone,
           /* dro_hasWhatsApp: j.mandal.dro_hasWhatsApp,
            rdo_hasWhatsApp: j.mandal.rdo_hasWhatsApp,
            alerts_hasWhatsApp: j.mandal.alerts_hasWhatsApp,*/
            mroTele:j.tele.mro,
            droTele:j.tele.dro,
            superTele:j.tele.super,
            commentsTele:j.tele.comments,
            mroWhatsApp : j.message.mro,
            superWhatsApp:j.message.super,
            rdoWhatsApp:j.message.rdo,
            alertsWhatsApp:j.message.alerts,
            droWhatsApp:j.message.dro,
            commentsMessage : j.message.comments,
            mroTelegram:j.message2.mro
        };

        arr.push(t);

    });

return arr;
}