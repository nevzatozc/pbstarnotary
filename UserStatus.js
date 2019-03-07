/* ===== User Status Class ==============================
|  Class with a constructor for block 			   |
|  ===============================================*/
// Maximum number of bytes for story
const MAX_STORY_BYTES = 500;

// Validation window in seconds
const VALIDATION_WINDOW_SECONDS = 300;

// Validation window in milliseconds
const VALIDATION_WINDOW_MILLISECONDS = VALIDATION_WINDOW_SECONDS * 1000;


/*const status = {
    address : "",
    requestTimestamp: 0,
    message: "",
    validationWindow : VALIDATION_WINDOW_SECONDS,
    messageSignature : ""
};*/

class UserStatus{

    //let registerStar;
    constructor(data){
        this.registerStar = false;
        this.status = {
            address:data.address,
            timestamp: new Date().getTime().toString().slice(0,-3),
            mesaj: data.message,
            window: VALIDATION_WINDOW_SECONDS,
            state:"invalid"
        };
    }
}

module.exports.UserStatus = UserStatus;
exports.VALIDATION_WINDOW_MILLISECONDS = VALIDATION_WINDOW_MILLISECONDS;
exports.VALIDATION_WINDOW_SECONDS = VALIDATION_WINDOW_SECONDS