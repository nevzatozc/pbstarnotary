// /************YENİ**************/
// /*START - User Table Registration*/
// const level = require('level');
// // Registry data DB location
// const starRegistryDB = './StarRegistration';
//
// // Level db object
// const db = level(starRegistryDB);
// // Add star registry data to levelDB with key/value pair
// async function addUserWithStar(key, value){
//     return new Promise(function(resolve, reject) {
//         db.put(key, value, function(err) {
//             if (err) {
//                 console.log('Address # ' + key + ' Submission failed', err);
//                 reject(err);
//             } else {
//                 resolve('Added Address # ' + key + ', value: ' + value);
//             }
//         });
//     });
// }
//
// // Get star registry data from levelDB with key
// async function getStarWithUser(key) {
//     return new Promise(function(resolve, reject) {
//         db.get(key, function(err, value) {
//             if (err) {
//                 console.log('Not found!', err);
//             } else if (value == undefined) {
//                 console.log('Undefined');
//             } else {
//                 console.log(value);
//                 resolve(value);
//             }
//         });
//     });
// }
// /*END - User Table Registration*/
// module.exports.addUserWithStar = addUserWithStar;
// module.exports.getStarWithUser = getStarWithUser;