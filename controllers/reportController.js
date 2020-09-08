const servicedAlerts = require('../models/servicedAlerts');
const path = require('path');

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
        error: req.flash('date_error')
    })

};
exports.postReports = (req, res, next) => {


    let from = new Date(req.body.date1).toISOString();
    let to = new Date(req.body.date2).toISOString();

    if (from && to) {
        servicedAlerts.find({isoDate: {$lte: to, $gte: from}, temp: 'no'}).then(servicedAlerts => {

            servicedAlerts.from = req.body.date1;
            servicedAlerts.to = req.body.date2;

            console.log(servicedAlerts);

            req.session.reports = flatten(servicedAlerts);

            res.render('reports/report', {
                reports: servicedAlerts,
                error: req.flash('date_error')
            });


        }).catch(err => {
            console.log(err);
        })
    } else {
        req.flash('date_error', 'Both to and from dates are required');
    }


};

exports.download = (req, res, next) => {


    // let from = new Date(req.session.fromDate).toISOString();
    // let to = new Date(req.session.toDate).toISOString();

    const styles = {
        headerDark: {

            font: {
                color: {
                    rgb: '000000'
                },
                sz: 14,


            }, alignment: {
                horizontal: 'center'
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

    const merges = [
        {start: {row: 1, column: 1}, end: {row: 1, column: 22}},
        {start: {row: 2, column: 1}, end: {row: 3, column: 1}},
        {start: {row: 2, column: 2}, end: {row: 3, column: 2}},
        {start: {row: 2, column: 3}, end: {row: 3, column: 3}},
        {start: {row: 2, column: 4}, end: {row: 3, column: 4}},
        {start: {row: 2, column: 5}, end: {row: 3, column: 5}},
        {start: {row: 2, column: 6}, end: {row: 2, column: 8}},
        {start: {row: 2, column: 9}, end: {row: 3, column: 9}},
        {start: {row: 2, column: 10}, end: {row: 2, column: 14}},
        {start: {row: 2, column: 16}, end: {row: 3, column: 16}},
    ]

    const heading = [[{
        value: 'SEOC-Lightning Tele-Communication Details',
        style: styles.headerDark
    }, {value: 'Alert-Id test'}]
        , [{value: 'Alert Id', style: styles.headerDark}, {value: 'Date', style: styles.headerDark}, {
            value: 'Time',
            style: styles.headerDark
        }, {value: 'District', style: styles.headerDark}, {
            value: 'Mandal',
            style: styles.headerDark
        }, {value: 'Tele Calls', style: styles.headerDark},
            [''],[''],
            { value: 'Call Comments',
            style: styles.headerDark},
       {value: 'WhatsApp', style: styles.headerDark},
            [''],[''], [''],[''],
            {value: 'Telegram ', style: styles.headerDark}, {
                value: 'Message Comments',
                style: styles.headerDark
            }]];



    //let xls = json2xls( req.session.reports);
    let p = path.join('files', 'report.xlsx');
    // fs.writeFileSync(p, xls, 'binary');

    //Here you specify the export structure
    const specification = {
        _id: { // <- the key should match the actual data key
            displayName: 'Alert Id', // <- Here you specify the column header
            headerStyle: styles.headerDark, // <- Header style
            width: 240 // <- width in pixels
        },
        date: {
            displayName: 'Date',
            headerStyle: styles.headerDark,
            width: '10' // <- width in chars (when the number is passed as string)
        },
        time: {
            displayName: 'Time',
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

        }
        , mroTele: {
            displayName: 'MRO',
            headerStyle: styles.headerDark,

            width: '10' // <- width in pixels,a

        }, droTele: {
            displayName: 'DRO',
            headerStyle: styles.headerDark,

            width: '10' // <- width in pixels,

        }, superTele: {
            displayName: 'D.Sec',
            headerStyle: styles.headerDark,

            width: '10' // <- width in pixels,

        }, commentsTele: {
            displayName: 'Call Comments',
            headerStyle: styles.headerDark,

            width: '15' // <- width in pixels,5
        }, mroWhatsApp: {
            displayName: 'MRO',
            headerStyle: styles.headerDark,

            width: '10' // <- width in pixels,

        },
        droWhatsApp: {
            displayName: 'DRO',
            headerStyle: styles.headerDark,

            width: '10' // <- width in pixels,

        }, superWhatsApp: {
            displayName: 'D.Sec',
            headerStyle: styles.headerDark,

            width: '10' // <- width in pixels,

        }, rdoWhatsApp: {
            displayName: 'RDO',
            headerStyle: styles.headerDark,

            width: '10' // <- width in pixels,

        }, alertsWhatsApp: {
            displayName: 'Alerts',
            headerStyle: styles.headerDark,

            width: '10' // <- width in pixels,

        }, mroTelegram: {
            displayName: 'Mro',
            headerStyle: styles.headerDark,

            width: '10' // <- width in pixels,

        }
        , commentsMessage: {
            displayName: 'Message Comments',
            headerStyle: styles.headerDark,

            width: '30' // <- width in pixels,

        },


    };


    const report = excel.buildExport(
        [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
            {
                name: 'reports', // <- Specify sheet name (optional)

                merges: merges,
                heading: heading,
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


function flatten(json) {
    let arr = [];
    json.forEach(j => {
        const t = {
            _id: j._id,
            date: j.date,
            time: j.time,
            district: j.mandal.dist,
            mandal: j.mandal.mandal,
            mroPhone: j.mandal.mroPhone,
            mroName: j.mandal.mroName,
            /* mroHasTelegram:j.mandal.hasTelegram,
             mroHasWhatsApp:j.mandal.hasWhatsApp,*/
            superName: j.mandal.superName,
            superPhone: j.mandal.superPhone,
            // super_hasWhatsApp: j.mandal.super_hasWhatsApp,
            droName: j.mandal.droName,
            droPhone: j.mandal.droPhone,
            /* dro_hasWhatsApp: j.mandal.dro_hasWhatsApp,
             rdo_hasWhatsApp: j.mandal.rdo_hasWhatsApp,
             alerts_hasWhatsApp: j.mandal.alerts_hasWhatsApp,*/
            mroTele: j.tele.mro,
            droTele: j.tele.dro,
            superTele: j.tele.super,
            commentsTele: j.tele.comments,
            mroWhatsApp: j.message.mro,
            superWhatsApp: j.message.super,
            rdoWhatsApp: j.message.rdo,
            alertsWhatsApp: j.message.alerts,
            droWhatsApp: j.message.dro,
            commentsMessage: j.message.comments,
            mroTelegram: j.message2.mro
        };

        arr.push(t);

    });

    return arr;
}