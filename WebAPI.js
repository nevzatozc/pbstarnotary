//const SHA256 = require('crypto-js/sha256');
const BlockClass = require('./StarBlock.js');

const BCClass = require("./Blockchain.js")
const MempoolClass = require('./Mempool.js');
const hex2ascii = require('hex2ascii');
//const StarRegistration = require('./StarRegistration.js');
//const StarValidation = require('./StarValidation.js');


/**
 * Controller Definition to encapsulate routes to work with blocks
 */
class WebAPI {

    /**
     * Constructor to create a new BlockController, you need to initialize here all your endpoints
     * @param {*} server 
     */
    constructor(server) {
        this.server = server;
        this.blocks = [];
//        this.bc= require("./Blockchain.js")("BCLab"+ new Date().getTime());
        this.bc= new BCClass.Blockchain("BCLab"+ new Date().getTime());
        this.pool = new MempoolClass.Mempool();

        //this.initializeMockData();
        this.initExpressMiddleWare();
        this.getBlockByIndex();
        this.getBlockByHash();
        this.getBlockByWalletAddress();
        this.postNewBlock();
        this.requestValidation();
        this.validate();
    }

    /**
     * Implement a GET Endpoint to retrieve a block by index, url: "/api/block/:index"
     */

    // getBlockByIndex() {
    //     console.log("getIndex giriş")
    //     this.server.route({
    //         method: 'GET',
    //         path: '/blok/{index}',
    //         handler: async (request, reply) =>{
    //             console.log("getIndex")
    //
    //             var blok = await this.bc.getBlock(req.params.index);
    //
    //             reply(blok);
    //
    //         }
    //     });
    // }
/****nevzat*/////
getBlockByHash() {
    this.server.route({
        method: 'GET',
        path: '/stars/hash:{hash}',
        handler: async (req, reply) => {
            var desired_hash = req.params.hash;
            console.log("get by hash of " + desired_hash);
            var starBlock = await this.bc.bringBlockbyHash(desired_hash);
            if (starBlock.hash === desired_hash)
                    return starBlock;
            else
                return "Desired Hash:" + desired_hash + "Not Found";

        }//
    });
}

    getBlockByWalletAddress() {
        this.server.route({
            method: 'GET',
            path: '/stars/address:{address}',
            handler: async (req, reply) => {
                var desired_address = req.params.address;
                console.log("get by address of " + desired_address);
                var starBlock = [];
                var starBlock = await this.bc.bringBlockbyWalletAddress(desired_address);
                if (starBlock.length !== 0) {

                    return starBlock;
                }
                else
                    return "Desired Adress:" + desired_address + "Not Found";

            }//
        });
    }
/****nevzat*/////
    getBlockByIndex() {
        this.server.route({
            method: 'GET',
            path: '/block/{index}',
            handler: async (req, reply) => {

            console.log("get by index");
            let bcSize = await this.bc.getBlockHeight();
            console.log("İstenen indeks " + req.params.index + " in blockchain of " + bcSize)

            //res.json({ message: 'hooray! welcome to our api!' });
            //isNaN(req.params.index)
            if (req.params.index >= 0 && req.params.index < bcSize ){
                var starBlock = await this.bc.getBlock(req.params.index);
                //var blok = this.blocks[req.params.index]; //calisiyor
                //var blok = myBlockAPI.myController.blocks[req.params.index]; //calisiyor
                //var blok = this.blokApi.myController.blocks[req.params.index]; //calismiyor
                //console.log("selected block is " + starBlock.body)

                let bodyRead = {
                    address: starBlock.address,
                    star: {
                        ra: starBlock.body.ra,
                        dec: starBlock.body.dec,
                        //mag: MAG,
                        //cen: CEN,
                        story:starBlock.body.story ,
                        storyDecoded: hex2ascii(starBlock.body.story),
                    }
                };


                let starResponse = {
                    hash:starBlock.hash,
                    height: starBlock.height,
                    bodyz:  bodyRead,
                    timez: starBlock.time,
                    previousBlockHash: starBlock.previousBlockHash
                };

                return starResponse;
            }else{
                console.log("invalid indeks detected")
                return "Please give a valid indeks between 0 - " +(bcSize-1)

            }
            //return this.blocks[request.params.index].body

            }
        });
    }

    /**
     * Implement a POST Endpoint to add a new Block, url: "/api/block"
     */
    postNewBlock() {
        this.server.route({
            method: 'POST',
            path: '/block',
            handler: async (request, h) => {

                console.log('POST block: ' + JSON.stringify(request.payload));
                if (!request.payload.hasOwnProperty('address')) {
                    return 'Please Pass address In The Payload';
                }
                if (!request.payload.hasOwnProperty('star')) {
                    return 'Please Pass star In The Payload';
                }
                try {

                    //check there is only one start within request

                    //verify address is valid
                    const address = request.payload.address; // Get address
                    // Check if the address has validate message signature

                    const verifyAddressRequest = this.pool.hasAlreadyValidatedStatus(address);
                    if (!verifyAddressRequest) {
                        //donecek cevap formati?
                        return 'verifyAddressRequest FAILED\nSend a validation request';
                    }

                    /*Ikinci bir star var mı yok mu onun kontrolu yapılacak!*/
                    // Get star
                    let star = request.payload.star;
                    // Validate star
                    if ((!star.hasOwnProperty('ra')) || star.ra == "") {
                        return 'Ra is required in Star';
                    }
                    if (!star.hasOwnProperty('dec') || star.dec == "") {
                        return 'Dec is required in Star';
                    }

                    // Encode story for the star
                    //if exist skip non-ascii symbol
                    //star.story.replace(/[^\x00-\x7F]/g, "");
                    //star.story = Buffer.from(star.story).toString('hex');

                    // another way  if exist do not add block
                    var ascii = /^[ -~]+$/;
                    if ( !ascii.test( star.story ) ) {
                        return 'You send a non ascii character in your story please check it.';                    }

                    if (!star.hasOwnProperty('story') || star.story == "") {
                        return 'Story is required in Star';
                    }
                    if (star.story.length > 500) {
                        return 'Story can have maximum size of 500 bytes';
                    }

                    // Create block

                    let body = {
                        address: request.payload.address,
                        star: {
                            ra: request.payload.star.ra,
                            dec: request.payload.star.dec,
                            //mag: MAG,
                            //cen: CEN,
                            story: star.story,
                        }
                    };

                    // Add block to the chain
                    const blockHeight = await this.bc.addBlock(new BlockClass.StarBlock(body)); // use await since it is async
                    const starBlock = await this.bc.getBlock(blockHeight);
                    console.log("addBlock is OK in WebAPI");

                    let bodyRead = {
                        address: starBlock.address,
                        star: {
                            ra: starBlock.body.ra,
                            dec: starBlock.body.dec,
                            //mag: MAG,
                            //cen: CEN,
                            story: starBlock.body.story,
                            //storyDecoded: hex2ascii(starBlock.body.story)
                        }
                    };


                    let starResponse = {
                        hash:starBlock.hash,
                        height: blockHeight,
                        bodyz:  bodyRead,
                        timez: starBlock.time,
                        previousBlockHash: starBlock.previousBlockHash
                    };


                    // Return block
                    this.pool.removeValidationRequest(address);// add a star per request.
                    return h.response(starResponse).code(201);
                }catch (err) {
                    console.log(err);
                    // Error
                    return 'Error Occurred';
                }
            }
        });
    }

    //STEP1
    requestValidation() {
        this.server.route({
            method: 'POST',
            path: '/requestValidation',
            handler: async (request, h) => {
            console.log('POST request validation: ' + JSON.stringify(request.payload));
            if (!request.payload.hasOwnProperty('address')) {
            // Bad Request
                console.log("Please Pass address In The Payload");
                return 'Please Pass address In The Payload';
            }

            //mempool'a ekle

            let cevap = this.pool.addARequestValidation(request.payload.address);
            return cevap;
    }
    });
    }


    //STEP2
    validate() {
        this.server.route({
            method: 'POST',
            path: '/message-signature/validate',
            handler: async (request, h) => {
                // assert(payload.address in UserTable AND user.state=REGISTERING)
                // mesajın imzasını kontrol et
                //valid ise
                //mesaj response don ve User.State = REGSITERED
                //valid değil ise hata dön
                console.log('POST validate message signature: ' + JSON.stringify(request.payload));
                // Bad Requests
                if (!request.payload.hasOwnProperty('address')) {
                    return 'Please Pass address In The Payload';
                }
                if (!request.payload.hasOwnProperty('signature')) {
                    return 'Please Pass signature In The Payload';
                }

                try {
                    // Get address
                    const address = request.payload.address;
                    // Get signature
                    const signature = request.payload.signature;
                    // Validate message signature

                    const mesaj = this.pool.getSavedMessage(address);

                    if(this.pool.validateRequestByWallet(mesaj,address, signature)){
                        var record = this.pool.getMempoolRecord(address);
                        //const data = Mempooldan data alınacak...
                        let validRequestData = {
                            registerStar:false,
                            status: {
                                address: address,
                                requestTimeStamp: record.timestamp,
                                mesaj: mesaj,
                                validationWindow: record.window,
                                messageSignature: true
                            }
                        };
                        //stop timer by how?  removing from array is enough?
                        clearTimeout(this.pool.timeoutRequests[address]);

                        // Return validation response
                        return validRequestData;//reply.response(data).code(200);
                    }else{
                        return "Signature is not verified";
                    }
                } catch (err) {
                    console.log(err);
                    // Error
                    return 'Error Occurred';
                }

    }
    });
    }



    async initializeMockData() {
        //if(this.blocks.length === 0){
        //if(this.bc.getBlockHeight()<=1){
            for (let index = 0; index < 10; index++) {

               await this.bc.addBlock(new BlockClass.StarBlock("Data"+(index+1)));

                //let blockAux = new BlockClass.Block(`Test Data #${index}`);
                //blockAux.height = index;
                //blockAux.hash = SHA256(JSON.stringify(blockAux)).toString();
                //this.blocks.push(blockAux);
            }
        //}
    }

    initExpressMiddleWare() {
        //his.app.use(bodyParser.urlencoded({extended:true}));
        //this.app.use(bodyParser.json());
        //this.app.use(bodyParser.json({ type: 'application/json' }));
    }

}

/**
 * Exporting the BlockController class
 * @param {*} server 
 */
module.exports = (server) => { return new WebAPI(server);}