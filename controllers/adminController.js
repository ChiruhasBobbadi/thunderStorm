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

        try {
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

                }, sheets: ['mroSheet']
            });

            if (result.mroSheet.length === 0) {
                throw "error";
                console.log("error throwed");

            }

            req.session.mroUpdate = result.mroSheet;
            console.log("file uploaded");
            res.render('admin/update', {

                mros: result.mroSheet,
                error: req.flash('upload_err'),
                success: req.flash('success'),
                failure: req.flash('failure'),
            })
        } catch (e) {
            console.log("upload error");
            req.flash('upload_err', "Invalid file type");
            res.redirect('/admin/update')
        }


    }


};

exports.update = (req, res, next) => {




    res.render('admin/update', {

        mros: [],
        error: req.flash('upload_err'),
        success: req.flash('success'),
        failure: req.flash('failure'),
    })


};
exports.postUpdate = (req, res, next) => {


    updateHelper(req,res).then(data=>{

        console.log(data);
        let arr=[];
        if(data.length>0){

            arr=data;
            req.flash('failure', 'Updating details for following mandals failed please check and try again..')
        }
        else{
            req.flash('success', 'Updating details is Successful..')
        }

        res.render('admin/update', {
            mros:arr,
            error: req.flash('upload_err'),
            success:req.flash('success'),
            failure:req.flash('failure'),
        })

    }).catch(err=>{
        console.log(err);
    });


};

async function updateHelper(req,res){

    const result = req.session.mroUpdate;
    req.session.errorMro = [];
    let data = [];

    for (let i = 0; i < result.length; i++) {

        let telegram = (result[i].hasTelegram.toLowerCase() === 'true');
        let whatsapp = (result[i].hasWhatsApp.toLowerCase() === 'true');

        await mandal.findOneAndUpdate({mandal: result[i].mandal}, {
            $set: {
                mroName: result[i].mroName,
                mroPhone: result[i].mroPhone,
                mandal: result[i].mandal,
                hasTelegram: telegram,
                hasWhatsApp: whatsapp
            }
        }).then(res => {
            if (!res) {
                throw "error"
            }
        }).catch(error => {
            console.log(error);
            data.push(result[i]);

        });

    }

    return  data;

}

exports.downloadRef = (req, res, next) => {
    let p = path.join('files', 'reference_for_updating.xlsx');

    fs.readFile(p, (err, data) => {
        if (err)
            return next(err);

        res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'inline; filename="reference_for_updating.xlsx"');
        res.send(data);

    })
};


exports.getUpdateMro = (req, res, next) => {


    if (req.session.isAdmin) {
        console.log(req.flash('error'));
        return res.render('admin/updateMro', {
            mro: req.session.active,
            error: req.flash('update_error')
        });
    }
    return res.redirect('/admin/login?mro=true');

};

exports.postUpdateMro = (req, res, next) => {

    const mandalId = req.session.active._id;
    const telegram = (req.body.group2 === 'yes');
    const whatsapp = (req.body.group1 === 'yes');
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
            req.flash('update_error', `Fields can't be empty try again with initial values..`);
            res.redirect('/admin/update-mro')
        })
    }


};


exports.adminLogin = (req, res, next) => {
    console.log(req.query.mro);
    if (req.query.mro) {
        console.log("mro set");
        res.render('admin/login', {
            errorMessage: req.flash('admin_login'),
            method: '/admin/login?mro=true'
        });
    } else {
        res.render('admin/login', {
            errorMessage: req.flash('admin_login'),
            method: '/admin/login'
        });
    }

};

exports.postLogin = (req, res, next) => {

    const mro = req.query.mro;

    const email = "admin@gmail.com";

    if (req.body.email === email) {
        user.findOne({email: email}).then(result => {
            if (result) {
                if (result.password === req.body.password) {
                    req.session.isAdmin = true;
                    if (mro)
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
