const user = require('../models/user');
const mandal = require('../models/mandal');
const excelToJson = require('convert-excel-to-json');
const path = require('path');
const fs = require('fs');

exports.upload = (req, res, next) => {

    if (!req.file) {
        req.flash('upload_err', "Invalid file type");
        res.redirect('/admin/update');
    } else {
        console.log("file uploaded");
        const result = excelToJson({
            sourceFile: './uploads/modifiedMro.xlsx',
            header: {
                rows: 1 // 2, 3, 4, etc.
            },
            columnToKey: {
                A: 'mroName',
                B: 'mroPhone',
                C: 'mandal',
                D: 'hasWhatsApp',
                E: 'hasTelegram',

            }, sheets: ['Sheet1']
        });


        res.render('admin/update', {
            mros: result.Sheet1,
            error: req.flash('upload_err')
        });
    }


};

exports.update = (req, res, next) => {


    res.render('admin/update', {

        mros: [],
        error: req.flash('upload_err')
    })


};

exports.postUpdate = (req, res, next) => {


    const result = excelToJson({
        sourceFile: './uploads/modifiedMro.xlsx',
        header: {
            rows: 1 // 2, 3, 4, etc.
        },
        columnToKey: {
            A: 'mroName',
            B: 'mroPhone',
            C: 'mandal',
            D: 'hasWhatsApp',
            E: 'hasTelegram',

        }, sheets: ['Sheet1']
    });

    for (let i = 0; i < result.Sheet1.length; i++) {

        let telegram = (result.Sheet1[i].hasTelegram === 'True' || result.Sheet1[i].hasTelegram === 'true');
        let whatsapp = (result.Sheet1[i].hasWhatsApp === 'True' || result.Sheet1[i].hasWhatsApp === 'true');
        mandal.findOneAndUpdate({mandal: result.Sheet1[i].mandal}, {
            $set: {
                mroName: result.Sheet1[i].mroName,
                mroPhone: result.Sheet1[i].mroPhone,
                mandal: result.Sheet1[i].mandal,
                hasTelegram: telegram,
                hasWhatsApp: whatsapp
            }
        })
            .then(res => {
                // flashing message
            }).catch(error => {
            console.log(error);
        })

    }
    res.redirect('/admin/update');

};

exports.downloadRef = (req, res, next) => {
    let p = path.join('files','reference_for_updating.xlsx');

    fs.readFile(p,(err,data)=>{
        if(err)
            return next(err);

        res.setHeader('Content-type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition','inline; filename="reference_for_updating.xlsx"');
        res.send(data);

    })
};

exports.getUpdateMro = (req, res, next) => {


    if(req.session.isAdmin){
        res.render('admin/updateMro', {
            mro: req.session.active
        });
    }
    res.redirect('/admin/login?mro=true');

};

exports.postUpdateMro = (req, res, next) => {

    const mandalId = req.session.active._id;


    const telegram = (req.body.group2==='yes');
    const whatsapp = (req.body.group1==='yes');
    console.log("Whatsapp "+whatsapp);
    console.log("Telegram "+telegram);
    let m;
    if (mandalId) {
        mandal.findById(mandalId).then(mandal => {
            mandal.mroName = req.body.mroName;
            mandal.mroPhone = req.body.mroPhn;
            mandal.hasWhatsApp = whatsapp;
            mandal.hasTelegram = telegram;
            m = mandal;
            return mandal.save();
        }).then(result => {
            if (result) {

                req.session.active = m;
                res.redirect('/service');
            }

        }).catch(err => {
            console.log(err);
        })
    }


};

exports.adminLogin = (req, res, next) => {
   if( console.log()){
       res.render('admin/login', {
           errorMessage: req.flash('admin_login'),
           method:'/admin/login?mro=true'
       });
   }else{
       res.render('admin/login', {
           errorMessage: req.flash('admin_login'),
           method:'/admin/login'
       });
   }

};

exports.postLogin = (req, res, next) => {

    const mro= req.query.mro;

    //TODO
    const email = "admin@gmail.com";

    if (req.body.email === email) {
        user.findOne({email: email}).then(result => {
            if (result) {
                if (result.password === req.body.password) {
                    req.session.isAdmin = true;
                    if(mro)
                    res.redirect('/admin/update-mro');
                    else
                        res.redirect('/admin/update');
                } else {
                    req.flash('admin_login', "Invalid emailID or password");
                    res.redirect('/admin/login');
                }
            }
        }).catch(err => {
            console.log(err);
        })
    }

};
