/*
const phantom = require('phantom');

const fs = require('fs');
const path = require('path');
const rp = require('request-promise');
const filePath = path.join(__dirname, 'files', 'mro.json');
const path2 = path.join(__dirname, 'files', 'mro2.json');




var json = [];
var arr;

fs.readFile(filePath, {encoding: 'utf-8'}, (err, data) => {

    if (!err) {
        json = JSON.parse(data);
        arr = json.Sheet1.map(el => {
            return el.mandal;
        });

        arr.forEach(el => {

            return doTask(el);

        });

    } else
        console.log(err);


});


function make_api_call(mandal) {
            return rp({
            url: `http://dev.virtualearth.net/REST/v1/Locations/?query=${mandal}?o=&key=As_wLgBGd9x-kbekvkeOHKxqnSfp9CiNcPHP2uR3Mkviy306NMQsDE94mVNOsg3D`,
            method: 'GET',
            json: true
        })



}

/!*function waitRetryPromise() {
    let promise = Promise.resolve();
    return function rp(options) {
        return promise = promise
            .then(() => new Promise(resolve => setTimeout(resolve, 200)))
            .then(() => request_promise(options));
    }
}
const rp = waitRetryPromise();*!/

var cnt = 0;

async function processUsers(res) {
    setTimeout(async()=>{
        let result;
        try {
            result = (await make_api_call(res));

            resultSet = result.resourceSets[0].resources;
            if (resultSet.length > 0) {

                ap = resultSet.filter(el => {
                    return el.address.adminDistrict === 'AP';
                });
                if (ap.length > 0) {
                    const el = ap[0];
                    var data;

                    if (el.address.locality !== res) {
                        data = ({'sno': ++cnt, 'old': res, 'new': el.address.locality});
                    } else
                        data = ({'sno': ++cnt, 'old': res, 'new': 'no change'});

                } else {
                    data = ({'sno': ++cnt, 'old': res, 'new': 'null'});
                }


            } else {
                data = ({'sno': ++cnt,'old': res, 'new': 'null'});
            }

            fs.appendFile(path2, "," + JSON.stringify(data), function (err) {
                if (err) throw err;
                console.log('Saved!');
            });

        } catch (e) {

            console.log(e);

        }


        return data;
    },1000)

}

async function doTask(res) {

    return await processUsers(res);
}


// locality ~ name and adminDistrict is AP.



*/


