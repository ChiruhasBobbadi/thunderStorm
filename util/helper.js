const values = require('./values');
const globalAlerts = require('../models/globalAlerts');
const rp = require('request-promise');
const mandal = require('../models/mandal');
const activeAlert = require('../models/activeAlerts');

const cron = require('node-cron');
let locationSet = new Set([]);

// data array handles the response data from REST api
let data = [];
let f = [];
/**
 *this function converts str to json and returns it,
 *
 * */
module.exports.toJson = function toJson(str) {

    f = [];
    try {
        const list = str.split('\u0000\u0000\u0000�');
        //console.log(list);
        if (list.length > 2) {
            for (let i = 1; i < list.length; i++) {
                f.push(JSON.parse(list[i].trim()));
                f[i - 1].location = {};
                f[i - 1].location.type = 'Point';
                f[i - 1].location.coordinates = [f[i - 1].longitude, f[i - 1].latitude];


                let d = new Date();
                f[i - 1].createdAt = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();


            }

        } else {
            // console.log(list);
            f.push(JSON.parse(list[1]));
            f[0].location = {};
            f[0].location.type = 'Point';
            f[0].location.coordinates = [f[0].longitude, f[0].latitude];
            f[0].createdAt = new Date().toISOString();
        }
        return f;
    } catch (e) {
        console.log("Exception occured");
        console.log(str);
    }
};


// lat lng bounds
let p1 = [84.86216, 19.25476];
let p2 = [83.58775, 19.22364];
let p3 = [80.90456, 17.66606];
let p4 = [80.19869, 17.03951];
let p5 = [76.93263, 15.9246];
let p6 = [76.93263, 13.65157];
let p7 = [80.27247, 13.299];


// node-cron call calls every 1 min for now
let len = 0;
cron.schedule('0 */1 * * * *', () => {
    console.log("called at " + new Date());
    globalAlerts.find({
        location: {
            $geoWithin: {
                $geometry: {
                    type: 'Polygon',
                    coordinates: [[p1, p2, p3, p4, p5, p6, p7, p1]]
                }
            }
        }
    })
        .then(res => {
            if (res.length > 0) {
                console.log("calling api");
                //len+=res.length;
                //console.log(res);
                console.log("number of record: " + res.length);
                return doTask(res);
            }

            console.log("no andhra alerts");

        }).then(locations => {

        if (locations) {
            console.log(locations);
            for (let i = 0; i < locations.length; i++) {


                mandal.findOne({mandal: locations[i].locality.trim()})
                    .then(result => {

                        if (result) {
                            const alerts = new activeAlert({
                                mandal: result,
                                address: locations[i],
                                time: new Date().toTimeString().split(" ")[0]
                            });
                            return alerts.save()
                        }


                    }).then(res => {
                    if (res)
                        console.log("written to active alerts");
                }).catch(error => {
                    console.log("error while writing active alerts");
                    console.log(error);
                })
            }
        }

    }).catch(err => {
        console.log(err);
    });
});
// node-cron call which clears the set every 45 min.
cron.schedule('0 */45 * * * *', () => {
    console.log("set cleared at " + new Date());
    locationSet.clear();
});


function make_api_call(lat, lng) {
    return rp({
        url: `http://dev.virtualearth.net/REST/v1/Locations/${lat},${lng}?o=&key=${values.bingKey}`,
        method: 'GET',
        json: true
    })
}

async function processUsers(res) {
    let result;
    data = [];
    for (let i = 0; i < res.length; i++) {

        try {
            result = (await make_api_call(res[i].location.coordinates[1], res[i].location.coordinates[0]));
            if (result.resourceSets[0].resources.length > 0) {
                if (result.resourceSets[0].resources[0].address.adminDistrict === 'Ap' && !locationSet.has(result.resourceSets[0].resources[0].address.locality)) {
                    data.push(result.resourceSets[0].resources[0].address);
                    locationSet.add(result.resourceSets[0].resources[0].address.locality);
                }
            }
        } catch (e) {
            console.log("Lat Lng to point conversion timed out");
            console.log("retrying..");
            console.log(e);
            i--;
        }


    }

    console.log(locationSet);
    console.log(locationSet.size);
    return data;
}

async function doTask(res) {
    return await processUsers(res);
}

module.exports.nullify = (db, collection) => {
    db.dropCollection(collection).then(res => {
        console.log(collection + " dropped");
    }).catch(err => {
        console.log("exception in deleting collection");
    })
};





