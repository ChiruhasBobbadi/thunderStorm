

const net = require('net');

const client = new net.Socket();
const NodeGeocoder = require('node-geocoder');

let options = {
    provider: 'google',

    // Optional depending on the providers
    httpAdapter: 'https', // Default
    apiKey: 'AIzaSyDrH3kc94krpR6FSori7uRI774jMNn79RE', // for Mapquest, OpenCage, Google Premier
    formatter: null         // 'gpx', 'string', ...
};
let geocoder = NodeGeocoder(options);

//  PARTNER ID (PROVIDED BY EARTH NETWORKS)
const a_partner_id = '5B62696F-0DBD-4DEC-9128-A0AFD05F164D';

// # VERSION
const a_version = '3';

// # FORMAT
// # 1 - ASCII format (UTF-8 format)
// # 2 - Binary format
const a_format = '1';

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

client.connect(2324, '107.23.152.248', function() {
    console.log('Connected');
    client.write(JSON.stringify(msg_authenticate));

});

client.on('error',(error)=>{
    console.log(error);

});

client.on('data', function(data) {

    const str = (data.toString('utf-8').trim());

   let f = JSON.parse(str.slice(4,str.length));
    console.log(f);

    geocoder.reverse({lat:f.latitude,lon:f.longitude})
        .then(function(res) {
            console.log(res);
        })
        .catch(function(err) {
            console.log(err);
        });

    client.destroy(); // kill client after server's response
});

client.on('close', function() {
    console.log('Connection closed');
});

//api
//AIzaSyCnUYgxzVG_Yb9ZjVAuYBj1iLcE8Fp-QmQ