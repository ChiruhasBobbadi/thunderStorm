const excelToJson = require('convert-excel-to-json');
const mandal  = require('./models/mandal');
const fs = require('fs');
const res= excelToJson({
    sourceFile: './files/madals.xlsx',
    header: {
        rows: 2 // 2, 3, 4, etc.
    },
    columnToKey: {

        B: 'dist',
        C: 'mandal',
        D: 'mroPhone',
        E: 'mroName',
        F: 'hasTelegram',
        G: 'hasWhatsApp',
        H: 'superName',
        I: 'superPhone',
        J: 'super_hasWhatsApp', K: 'super_hasTelegram',
        L: 'droName', M: 'droPhone', N: 'dro_hasWhatsApp', O: 'dro_hasTelegram', P: 'rdo_hasWhatsApp',
        Q: 'rdo_hasTelegram', R: 'alerts_hasWhatsApp',


    }, sheets: ['mandals']
});


let tst=[];
for (let i = 0; i < 670; i++) {
    tst.push(res.mandals[i]);
}

/*mandal.insertMany(JSON.stringify(tst)).then(res=>{
    console.log("success");
}).catch(err=>{
    console.log("error");
    console.log(err);
});*/

mandal.insertMany(tst).then(result=>{
    console.log("success");
}).catch(err=>{
    console.log(err);
});
