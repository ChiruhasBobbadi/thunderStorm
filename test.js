const net = require('net');
const fs = require('fs');
const client = new net.Socket();
const globalAlerts = require('./models/globalAlerts');
const opencage = require('opencage-api-client');
const path = require('path');
const rp = require('request-promise');
const mandal = require('./models/mandal');
const activeAlert = require('./models/activeAlerts');
const mongoose = require('mongoose');
const cron = require('node-cron');

const request = require('request');
let activeAlerts = [];
let locationSet = new Set([]);


const OCD_API_KEY = "943b5710b24b40a69e77d54f33bb7550";
//  PARTNER ID (PROVIDED BY EARTH NETWORKS)
const a_partner_id = '5B62696F-0DBD-4DEC-9128-A0AFD05F164D';
// # VERSION
const a_version = '3';
// # FORMAT
// # 1 - ASCII format (UTF-8 format)
// # 2 - Binary format
const a_format = '1';
let f = [];
let data = [];

// # TYPE
// # 1 - Flash
// # 2 - Pulse
// # 3 - Combination Flash and Pulse
const a_type = '2';
// AUTHENTICATION PAYLOAD
const msg_authenticate = {
    "p": a_partner_id,
    "v": a_version,
    "f": a_format,
    "t": a_type
};
// lat lng bounds
let p1 = [84.86216, 19.25476];
let p2 = [83.58775, 19.22364];
let p3 = [80.90456, 17.66606];
let p4 = [80.19869, 17.03951];
let p5 = [76.93263, 15.9246];
let p6 = [76.93263, 13.65157];
let p7 = [80.27247, 13.299];
// mongodb uri
const MONGODB_URI =
    'mongodb://localhost:27017/ThunderStorm';
// opencage.geocode({q: '16.9037611,82.0019743',language: 'en',key:OCD_API_KEY}).then(data => {
//
//     if (data.status.code == 200) {
//         if (data.results.length > 0) {
//             var place = data.results[0];
//             console.log(place);
//             fs.writeFile(path.join(__dirname,"temp.json"),JSON.parse(place),(res)=>{
//                 if(res)
//                     console.log("sucess");
//
//             })
//         }
//     } else if (data.status.code == 402) {
//         console.log('hit free-trial daily limit');
//         console.log('become a customer: https://opencagedata.com/pricing');
//     } else {
//         // other possible response codes:
//         // https://opencagedata.com/api#codes
//         console.log('error', data.status.message);
//     }
// }).catch(error => {
//     console.log('error', error.message);
// });
client.connect(2324, '107.23.152.248', function () {
    console.log('Connected');
    client.write(JSON.stringify(msg_authenticate));
});
client.on('error', (error) => {
    console.log("Error");
    console.log(error);

});

client.on('data', function (data) {

    const str = (data.toString('utf-8').trim());


    // converting all the data to json data
    const jsonList = toJson(str);

    // inserting all the fetched results into global Alerts collection
    globalAlerts.insertMany(jsonList).then(res => {

    }).catch(err => {
        console.log(err);
        console.log("error");
    });

    //client.destroy(); // kill client after server's response
});

client.on('close', function () {
    console.log('Connection closed');
});


/**
 *this function converts str to json and returns it,
 *
 * */
function toJson(str) {

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
                f[i - 1].createdAt = new Date().toISOString();
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
        console.log(f);
    }


}

//api
//AIzaSyCnUYgxzVG_Yb9ZjVAuYBj1iLcE8Fp-QmQ


mongoose.connect(MONGODB_URI)
    .then(result => {
        console.log(" dbconnected");

    })
    .catch(err => {
        console.log(err);
    });


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
                return doTask(res);
            }
        }).then(locations => {

        console.log(locations);
        for (let i = 0; i < locations.length; i++) {

            mandal.findOne({mandal: locations[i].locality})
                .then(result => {

                        const alerts = new activeAlert({mandal: result, address: locations[i], time: new Date().toISOString()});
                        return alerts.save()



                }).then(res => {
                if (res)
                    console.log("written to active alerts");
            }).catch(error => {
                console.log("error while writing active alerts");
                console.log(error);
            })

        }

    }).catch(err => {
        console.log(err);
    });
});
cron.schedule('0 */45 * * * *', () => {
    console.log("set cleared at " + new Date());
    locationSet = null;
});


function make_api_call(lat, lng) {
    return rp({
        url: `http://dev.virtualearth.net/REST/v1/Locations/${lat},${lng}?o=&key=As_wLgBGd9x-kbekvkeOHKxqnSfp9CiNcPHP2uR3Mkviy306NMQsDE94mVNOsg3D`,
        method: 'GET',
        json: true
    })
}

async function processUsers(res) {
    let result;
    data = [];
    for (let i = 0; i < res.length; i++) {

        result = (await make_api_call(res[i].location.coordinates[1], res[i].location.coordinates[0]));

        if (result.resourceSets[0].resources.length > 0) {

            if (result.resourceSets[0].resources[0].address.adminDistrict === 'Ap' && !locationSet.has(result.resourceSets[0].resources[0].address.locality)) {
                data.push(result.resourceSets[0].resources[0].address);

                locationSet.add(result.resourceSets[0].resources[0].address.locality);
            }
        }

    }

    console.log(locationSet);
    console.log(locationSet.size);
    return data;
}

async function doTask(res) {
    return await processUsers(res);
}

