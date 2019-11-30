const multer = require('multer');

// module.exports.bingKey = 'As_wLgBGd9x-kbekvkeOHKxqnSfp9CiNcPHP2uR3Mkviy306NMQsDE94mVNOsg3D';
module.exports.mongoDbUri = 'mongodb://localhost:27017/ThunderStorm';

//  PARTNER ID (PROVIDED BY EARTH NETWORKS)
module.exports.partner_key = '5B62696F-0DBD-4DEC-9128-A0AFD05F164D';
// # VERSION
module.exports.a_version = '3';
// # FORMAT
// # 1 - ASCII format (UTF-8 format)
// # 2 - Binary format
module.exports.a_format = '1';
// # TYPE
// # 1 - Flash
// # 2 - Pulse
// # 3 - Combination Flash and Pulse
module.exports.a_type = '2';
// AUTHENTICATION PAYLOAD
module.exports.msg_auth = {
    "p": module.exports.partner_key,
    "v": module.exports.a_version,
    "f": module.exports.a_format,
    "t": module.exports.a_type
};


module.exports.uploadConfig=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads')
    },
    filename:(req,file,cb)=>{

        cb(null,"modifiedMro.xlsx");

    }
});

module.exports.fileFilter=(req,file,cb)=>{

    if(file.mimetype==='application/vnd.ms-excel' || file.mimetype==='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        cb(null,true);
    else
        cb(null,false);
}
