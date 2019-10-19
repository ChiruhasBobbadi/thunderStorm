const user = require('../models/user');
const mandal = require('../models/mandal');


exports.update = (req,res,next)=>{
res.render('admin/update',{
    mro:{}
})
};

exports.upload = (req,res,next)=>{

};

exports.downloadRef = (req,res,next)=>{

};

exports.getupdateMro=(req,res,next)=>{


    res.render('admin/updateMro',{
        mro:req.session.active
    });
};
exports.postUpdateMro = (req,res,next)=>{

    const mandalId = req.session.active._id;
    console.log(req.body.mroName);
    console.log(req.body.mroPhn);
let m;
    if(mandalId){
        mandal.findById(mandalId).then(mandal=>{
            mandal.mroName = req.body.mroName;
            mandal.mroPhone = req.body.mroPhn;
            m =mandal;
            return mandal.save();
        }).then(result=>{
            if(result){

                req.session.active = m;
                res.redirect('/service');
            }

        }).catch(err=>{
            console.log(err);
        })
    }



};

exports.adminLogin = (req,res,next)=>{
    res.render('admin/login',{
        errorMessage:req.flash('admin_login')
    });
};

exports.postLogin = (req,res,next)=>{

    const email = "admin@gmail.com";

    if(req.body.email===email){
        user.findOne({email:email}).then(result=>{
            if(result){
                if(result.password === req.body.password)
                {   req.session.isAdmin=true;
                    res.redirect('/admin/update-mro');
                }
                else{
                    req.flash('admin_login',"Invalid emailID or password");
                    res.redirect('/admin/login');
                }
            }
        }).catch(err=>{
            console.log(err);
        })
    }

};
