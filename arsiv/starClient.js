var request = require('request');
var http = require('http');
const crypto = require('crypto-js');

var myWallet ="Buraya bir public key yazilacak"

const bitcoin = require('bitcoinjs-lib');
const bitcoinMessage = require('bitcoinjs-message');

let address = '142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ'
let signature = 'IJtpSFiOJrw/xYeucFxsHvIRFJ85YSGP8S1AEZxM4/obS3xr9iz7H0ffD7aM2vugrRaCi/zxaPtkflNzt5ykbc0='
let message = '142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ:1532330740:starRegistry'

console.log(bitcoinMessage.verify(message, address, signature))

//1.yol random key pair generation
var keyPair2 = bitcoin.ECPair.makeRandom();
console.log("helloooo"+keyPair2)
//console.log("Adres  "+keyPair2.getAddress());

//console.log(keyPair.getAddress());
 //Test address by logging address to console. A valid bitcoin address should be returned.

//address = keyPair.getAddress();
//console.log(keyPair.toWif());

//Test private key by logging to console. A valid bitcoin private key should be returned.

//var pkey = keyPair.toWIF();

/*
//var privateKey = keyPair.d.toBuffer(32)
var privateKey = keyPair.privateKey;
message = 'Hey this is Ranchi Mall'

signature = bitcoinMessage.sign(message, privateKey, keyPair.compressed)
console.log(signature.toString('base64'))

*/
// Parameters required for FLO address generation
const FLOTESTNET = {
    messagePrefix: '\x19FLO testnet Signed Message:\n',
    bip32: {
        public: 0x013440e2,
        private: 0x01343c23
    },
    pubKeyHash: 0x73,
    scriptHash: 0xc6,
    wif: 0xef
}

//2.yol sabit stringden keyfactory
var keyPair = bitcoin.ECPair.fromWIF('cRgnQe9MUu1JznntrLaoQpB476M8PURvXVQB5R2eqms5tXnzNsrr', FLOTESTNET)
var privateKey = keyPair.privateKey;
 message = 'Hey this is Ranchi Mall'

 signature = bitcoinMessage.sign(message, privateKey, keyPair.compressed)
console.log(signature.toString('base64'))
// => 'ILqvGGBI89K8Tk9/BgrGPSMTB9ZY+Z88Z0GjVsx7uPTwOfQ+eNj/VZKZ40iSbUPgz6mSBvo6w1Dkzns9DqfYa2o='

// Verify a message
 address = 'oWwrvqa3QP5EHHBiUn9eAQf7d1ts5BnChG'
 signature = 'ILqvGGBI89K8Tk9/BgrGPSMTB9ZY+Z88Z0GjVsx7uPTwOfQ+eNj/VZKZ40iSbUPgz6mSBvo6w1Dkzns9DqfYa2o='
 message = 'Hey this is Ranchi Mall'

console.log(bitcoinMessage.verify(message, address, signature))
// => true



// 3. yol
function rng () {
    return Buffer.from('YT8dAtK4d16A3P1z+TpwB2jJ4aFH3g9M1EioIBkLEV4=', 'base64')
}
var keyPair = bitcoin.ECPair.makeRandom({ rng: rng })
console.log(keyPair)
//address = getAddress(keyPair)


/*

var options = {
    host: "localhost",
    port: 8000,
    path: '/block/3',
    method: 'GET'
};

http.request(options, function(res) {
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
        let parsedBlock = JSON.parse(chunk);
        console.log('BODY: ' + chunk);
        //gelen mesajı imzala
        //başka bir web servisi cağır

    });

}).end();

*/
