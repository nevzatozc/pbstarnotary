//Istek bilgilerini bir arrayda tutabilir
const bitcoinMessage = require('bitcoinjs-message');
const StarRegistration = require('./arsiv/StarRegistration.js');
const UserStatusClass = require('./UserStatus.js');



class Mempool {

    /**
     * Constructor that allows initialize the class
     */
    constructor() {
        this.mempool = [];  //UserStatus
        this.timeoutRequests = [];

    }

    /**
     * Verify that User is in the list and state is VALID
     * @param address
     * @returns {boolean}
     */
    hasAlreadyValidatedStatus(address){
        for (let i = 0; i < this.mempool.length; i++) {
            if (this.mempool[i].status.address === address) { //varsa olanı döndür
                if(this.mempool[i].status.state === "valid"){
                    return true;
                }else{
                    return false;
                }
            }
        }
        return false;

    }
    isInverifyList(address){
        for (let i = 0; i < this.mempool.length; i++) {
            if (this.mempool[i].status.address === address) { //varsa olanı döndür
                return true;
            }
        }
        return false;
    }

    validateRequestByWallet(message, address, signature) {
        //adres kontrolu yap
        //poolda var mı
        if(!this.isInverifyList(address)){
            //not found in the list
            return false;
        }else{ // in List. So check whether status is already VALID
            //timeot kontrolu yapilacak. Suresi bitmis ise listeden cikarilmistir = Listede var mi kontrolu ayni anlama gelir.
            if(this.hasAlreadyValidatedStatus(address)){
                //VALID. So return error. Not assumed to submit this request to us
                return false;
            }

            //Not valid but in list
            //check signature of message
            try {
                let isValid = bitcoinMessage.verify(message, address, signature);
                //let isValid = true;
                //return isValid
                if(isValid){
                    //valid yap
                    this.setUserStatus2Valid(address);
                    console.log("Signature is OK");
                    return true;
                }else{
                    console.log("Signature is WRONG");
                    return false;
                }
            } catch (err) {
                console.log('Error in validation of signature ', err);
                //errorLog.push(i);
                return false;
            }


        }

    }


    removeValidationRequest(walletAddress){
        //remove from mempool

        //this.mempool.delete(address);

        for (let i = 0; i < this.mempool.length; i++) {
            if (this.mempool[i].status.address === walletAddress) { //varsa olanı döndür
                this.mempool.splice(i,1); //remove(i) mot working
                return;
            }
        }

    }


    getSavedMessage(address){
        for (let i = 0; i < this.mempool.length; i++) {
            if (this.mempool[i].status.address === address) { //varsa olanı döndür
                return this.mempool[i].status.mesaj;
            }
        }
        return "Message Not Found for " + address;

    }

    getMempoolRecord(address){
        for (let i = 0; i < this.mempool.length; i++) {
            if (this.mempool[i].status.address === address) { //varsa olanı döndür
                return this.mempool[i];
            }
        }
        return "Record Not Found for " + address;

    }


    setUserStatus2Valid(address){
        for (let i = 0; i < this.mempool.length; i++) {
            if (this.mempool[i].status.address === address) { //varsa olanı döndür
                this.mempool[i].status.state ="valid";
                return "User status changed as VALID for " + address;

            }
        }
        return "Message Not Found for " + address;

    }

    addARequestValidation(walletAddress) {

        //check whether user is already has validated request
        if(this.hasAlreadyValidatedStatus(walletAddress)){
            return walletAddress + " is in Verified List and already enabled to add starBlock";
        }
        for (let i = 0; i < this.mempool.length; i++) {
            if (this.mempool[i].status.address === walletAddress) { //varsa olanı döndür
                let timeElapse = (new Date().getTime().toString().slice(0,-3)) - this.mempool[i].status.timestamp;
                let timeLeft = (UserStatusClass.VALIDATION_WINDOW_MILLISECONDS/1000) - timeElapse;

                const responseObject = {
                    address : walletAddress,
                    tstamp: this.mempool[i].status.timestamp,
                    mesaj: this.mempool[i].status.mesaj,
                    left: timeLeft
                };

                return responseObject;
            }
        }

        const data = {
         message : createMessage(walletAddress),
         address : walletAddress
        };
        let us = new UserStatusClass.UserStatus(data)

        //yoksa ekleyecegimiz ve döndüreceğiz
        this.mempool.push(us);
        var self = this;
        self.timeoutRequests[walletAddress] = setTimeout(function(){
            //console.log(this)
            self.removeValidationRequest(walletAddress);
            console.log("Removed " + walletAddress)},
            UserStatusClass.VALIDATION_WINDOW_MILLISECONDS);

        const responseObject = {
                address : walletAddress,
                tstamp: us.status.timestamp,
                mesaj: us.status.mesaj,
                left: UserStatusClass.VALIDATION_WINDOW_SECONDS
        };

        return responseObject;
    }



}//MemPool


function getCurrentTimestamp() {
    return new Date().getTime();
}

function createMessage(address) {
    return `${address}:${getCurrentTimestamp()}:starRegistry`;
}

/*
async function createStarRegistryData(address) {
    // Create message using address
    const message = createMessage(address);

    // Create data using address and message
    const data = {
        address: address,
        message: message,
        requestTimestamp: getCurrentTimestamp(),
        validationWindow: VALIDATION_WINDOW_SECONDS
    }

    // Add data to star registry level db
    await StarRegistration.addStarWithUser(address, JSON.stringify(data));
    return data;
}
*/



//validateRequestByWallet


//verifyAddressRequest
module.exports.Mempool = Mempool;