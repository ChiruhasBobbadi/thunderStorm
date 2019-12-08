/*

const excelToJson = require('convert-excel-to-json');
const mandal  = require('./models/mandal');
const fs = require('fs');
const res= excelToJson({
    sourceFile: './files/mandals.xlsx',
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
        J: 'super_hasWhatsApp',
        K: 'droName', L: 'droPhone', M: 'dro_hasWhatsApp', N: 'rdo_hasWhatsApp',
        O: 'alerts_hasWhatsApp',


    }, sheets: ['mandals']
});


//console.log(res);
let tst=[];
for (let i = 0; i < 670; i++) {
    tst.push(res.mandals[i]);
}


//console.log(tst);

mandal.insertMany(tst).then(res=>{
    console.log("success");
}).catch(err=>{
    console.log("error");
    console.log(err);
});

*/
