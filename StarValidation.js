//
// /*****/
// // STAR REGISTRATION
//
// async function createStarRegistryDataWithInput(address, data) {
//     // Add data to star registry level db
//     await StarRegistration.addUserWithStar(address, JSON.stringify(data));
//     return data;
// }
//
// // Get Star
//
// async function getStarRegistryData(address) {
//     let value;
//     try {
//         // Get data from star registry level db
//         value = await StarRegistration.getStarWithUser(address);
//     } catch (err) {
//         return new Promise(function(resolve, reject) {
//             console.log('getStarWithUser Error: ' + err);
//             reject(err);
//         });
//     }
//     return new Promise(function(resolve, reject) {
//         try {
//             try {
//
//                 const data = JSON.parse(value);
//
//                 // Calculate time passed from the original request
//                 const timePassed = Date.now() - data.requestTimestamp;
//
//                 // Expired validation window
//                 if (timePassed > VALIDATION_WINDOW_MILLISECONDS) {
//                     resolve(createStarRegistryData(address));
//                 } else {
//                     // Generate star registry data from the level db data
//                     const starRegistryData = {
//                         address: data.address,
//                         message: data.message,
//                         requestTimestamp: data.requestTimestamp,
//                         validationWindow: timePassed
//                     };
//
//                     resolve(starRegistryData);
//                 }
//             } catch (error) {
//                 reject(error);
//             }
//         } catch (err) {
//             // Some error
//             reject(err);
//         }
//     });
// }
//
//
// async function validateMessageSignature(address, signature) {
//     let value;
//     try {
//         // Get data from star registry level db
//         value = await StarRegistration.getStarWithUser(address);
//     } catch (err) {
//         return new Promise(function(resolve, reject) {
//             reject(err);
//         });
//     }
//     return new Promise(function(resolve, reject) {
//         try {
//             const data = JSON.parse(value);
//
//             // Check if message signature is valid; if yes, return the data
//             if (data.messageSignature == 'valid') {
//                 const response = {
//                     registerStar: true,
//                     status: data
//                 };
//                 resolve(response);
//             } else {
//                 // Calculate time passed from the original request
//                 const timePassed = Date.now() - data.requestTimestamp;
//                 let isSignatureValid = false;
//                 // Expired validation window
//                 if (timePassed > VALIDATION_WINDOW_MILLISECONDS) {
//                     data.validationWindow = 0;
//                     data.messageSignature = 'Expired validation window!';
//
//                     // Create star registry data
//                     createStarRegistryDataWithInput(address, data);
//                 } else {
//                     // Verify if signature is valid using bitcoin-message library
//                     try {
//                         isSignatureValid = bitcoinMessage.verify(data.message, address, signature);
//                     } catch (err) {
//                         isSignatureValid = false;
//                     }
//
//                     // Add message signature validation
//                     if (isSignatureValid) {
//                         data.messageSignature = 'valid';
//                     } else {
//                         data.messageSignature = 'invalid';
//                     }
//
//                     // Calculate validation window timeframe
//                     data.validationWindow = Math.floor((VALIDATION_WINDOW_MILLISECONDS - timePassed) / 1000);
//                     // Create star registry data
//                     createStarRegistryDataWithInput(address, data);
//                 }
//                 // Create response
//                 const response = {
//                     registerStar: isSignatureValid,
//                     status: data
//                 };
//                 // Return response
//                 resolve(response);
//             }
//         } catch (err) {
//             console.log('Error while validating message signature: ' + err);
//             reject(err);
//         }
//     });
// }
//
// async function isValidMessageSignature(address) {
//     let value;
//     try {
//         // Get data from star registry level db
//         value = await StarRegistration.getStarWithUser(address);
//     } catch (err) {
//         return new Promise(function(resolve, reject) {
//             reject(err);
//         });
//     }
//     return new Promise(function(resolve, reject) {
//         try {
//             const data = JSON.parse(value);
//
//             // Check if message signature is valid
//             if (data.messageSignature == 'valid') {
//                 resolve(true);
//             } else {
//                 resolve(false);
//             }
//         } catch (err) {
//             console.log(err);
//             reject(err);
//         }
//     });
// }
//
// module.exports.createStarRegistryData = createStarRegistryData;
// module.exports.createStarRegistryDataWithInput = createStarRegistryDataWithInput;
// module.exports.getStarRegistryData = getStarRegistryData;
// module.exports.validateMessageSignature = validateMessageSignature;
// module.exports.isValidMessageSignature = isValidMessageSignature;