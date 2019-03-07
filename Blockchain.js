const SHA256 = require('crypto-js/sha256');
const BlockClass = require('./StarBlock.js');
const hex2ascii = require('hex2ascii');
const level = require('level');
const chainDB = './chaindata';
const db = level(chainDB, { createIfMissing: true }, function (err, db) {
    if (err instanceof level.errors.OpenError) {
        console.log('failed to open database')
    }
})
//Nevzat

// Add data to levelDB with key/value pair
function addDataToLevelDB(key,value){

    return db.put(key, value);
}


// Get data from levelDB with key
function getDataFromLevelDB(key){
    var result = db.get(key);
    return result;
}
function getDataFromLevelDBByHash(hash) {
    let starResponse = null;
    return new Promise(function(resolve, reject){
        db.createReadStream()
            .on('data', function (data) {
                //parseJSON then compare
                let starBlock = JSON.parse(data.value);
                if(starBlock.hash === hash){
                    let bodyRead = {
                        address: starBlock.address,
                        star: {
                            ra: starBlock.body.ra,
                            dec: starBlock.body.dec,
                            //mag: MAG,
                            //cen: CEN,
                            story: hex2ascii(starBlock.body.story),
                            storyDecoded: starBlock.body.story,
                        }
                    };


                     starResponse = {
                        hash:starBlock.hash,
                        height: starBlock.height,
                        bodyz:  bodyRead,
                        timez: starBlock.time,
                        previousBlockHash: starBlock.previousBlockHash
                    };

                }
            })
            .on('error', function (err) {
                reject(err)
            })
            .on('close', function () {
                resolve(starResponse);
            });
    });
}

function getDataFromLevelDBByWalletAddress(address) {
    let starArray = [];
    return new Promise(function(resolve, reject){
        db.createReadStream()
            .on('data', function (data) {
                //parseJSON then compare
                let starBlock = JSON.parse(data.value);
                if(starBlock.address === address){
                    let bodyRead = {
                        address: starBlock.address,
                        star: {
                            ra: starBlock.body.ra,
                            dec: starBlock.body.dec,
                            //mag: MAG,
                            //cen: CEN,
                            story: hex2ascii(starBlock.body.story),
                            storyDecoded: starBlock.body.story,
                        }
                    };


                    let starResponse = {
                        hash:starBlock.hash,
                        height: starBlock.height,
                        bodyz:  bodyRead,
                        timez: starBlock.time,
                        previousBlockHash: starBlock.previousBlockHash
                    };
                    starArray.push(starResponse);
                }
            })
            .on('error', function (err) {
                reject(err)
            })
            .on('close', function () {
                resolve(starArray);
            });
    });
}

// Get Block Height
function getDBBlockHeight() {
    return new Promise((resolve, reject) => {
        let i = 0;
    db.createReadStream().on('data', (data) => {
        i++;
}).on('error', (err) => {
        reject(err);
}).on('close', () => {
        resolve(i);
});
});
}

/* ===== Block Class ==============================
 |  Class with a constructor for block              |
 |  ===============================================*/
let errorLog = [];


// /* ===== Blockchain Class ==========================
// |  Class with a constructor for new blockchain     |
// |  ================================================*/

//module.exports =
class Blockchain{
    constructor(isim){
            this.ad = isim;
            this.total_chain_height = -1;
            //if chain is empty
            this.addBlock(new BlockClass.StarBlock("GENESIS Block"));
    }
    // Update block
    async updateBlock(key, blok){
        addDataToLevelDB(key, JSON.stringify(blok));
        console.log("Block " + (key)+" updated to DB");
        return key;
    }


    // Get block height
    async getBlockHeight(){
        const chain_height = await getDBBlockHeight();
        return chain_height;
    }
    async bringBlockbyHash(blockHash){
        return await getDataFromLevelDBByHash(blockHash);
    }
    async bringBlockbyWalletAddress(address){
        return await getDataFromLevelDBByWalletAddress(address);
    }

    // get block
    async getBlock(blockHeight){
        const serializedBlock = await getDataFromLevelDB(blockHeight);
        return JSON.parse(serializedBlock)
    }
    // Add new block
    async addBlock(newBlock){
        console.log("[" +this.ad+ "] before addBlock chain height: " +this.total_chain_height );
        newBlock.height = this.total_chain_height + 1;
        if(newBlock.height>0){
            var prevBlock =  await this.getBlock(newBlock.height - 1);
            newBlock.previousBlockHash = prevBlock.hash;
        }
        newBlock.time = new Date().getTime();//.toString().slice(0,-3);
        var hashHesaplanacakBody = JSON.stringify(newBlock);

        newBlock.hash = SHA256(hashHesaplanacakBody).toString();

        this.total_chain_height++;

        await addDataToLevelDB(newBlock.height, JSON.stringify(newBlock));
        console.log("Block " + (newBlock.height)+" added to DB");
        return newBlock.height;
    }


    async validateBlock(blockHeight) {
        // get block object
        const block =  await this.getBlock(blockHeight);
        // get block hash
        let blockHash = block.hash;
        // remove block hash to test block integrity
        block.hash = "";
        var checkPoint= JSON .stringify(block);
        // generate block hash
        let currentBlockHash = SHA256(checkPoint).toString();
        //console.log('!!!blockHash= ' + blockHash +' & ' + 'validBlockHash= ' + validBlockHash);
        // Compare
        if (blockHash === currentBlockHash) {
            console.log('Block #' + blockHeight + ' validated'+ " Body : " + block.body);
            return true;
        } else {
            console.log('Block #' + blockHeight + ' has invalid hash '+ " Body : " + block.body);
            //console.log('blockHash= ' + blockHash +' & ' + 'validBlockHash= ' + validBlockHash);
            //console.log('???block '+ block.height + '  height: '+ block.height +'  Hash:'+ block.hash+ ' Time: ' +block.time + ' Body: '+checkPoint);
            throw "Block check error "+ blockHeight;
        }
    }
    /**validate chain functions****/

    async validateEachBlock(blockHeight) {

        for (let i = 0; i <= blockHeight; i++) {
            try {
                await this.validateBlock(i);
            } catch (err) {
                console.log('Error in validateBlockIntegrity ', err);
                errorLog.push(i);
                //errorLog.push("ajkbsjbkhasbjkd");

            }
        }
        return errorLog;
    }

    async validateChainIntegrity(blockHeight) {
        //let errorLog = [];
        let currentBlock;
        let prevBlock;
        for (let i = 1; i <= blockHeight; i++) {

            currentBlock =  await this.getBlock(i);
            prevBlock =  await this.getBlock(i-1);
            if (currentBlock.previousBlockHash !== prevBlock.hash) {
                console.log("Previous Hash ERROR in validatechainIntegrity for Block " + i);
                errorLog.push(i);
                //errorLog.("ajkbsjbkhasbjkd");
            }
            else
                console.log("Hash is correct for Block " + i + " Body : " + currentBlock.body);
        }
        return errorLog;
    }

    async validateChain() {
        const blockHeight =  await this.getBlockHeight();

        let errorLog_1=[];
        errorLog_1=  await this.validateChainIntegrity(blockHeight-1);

        errorLog.concat(errorLog_1);

        errorLog =  await this.validateEachBlock(blockHeight-1);
        errorLog.concat(errorLog_1);
        return errorLog;
    }

}



const kayitEkle = (name) => bc.addBlock(new StarBlock(name))

async function guncelle(key){
    var blok = await bc.getBlock(key);
    blok.body = "Nevza"+key;
    await bc.updateBlock(key, blok);
}
async function guncelle2(key){
    var blok = await bc.getBlock(key);
    blok.previousBlockHash = "05cd8ebfa7022a4bac220ae08a2f105bf582fc67613b4143f16cf0fb78c01723";
    await bc.updateBlock(key, blok);
}
/*
const main = async ()=> {
    bc = new StarBlockchain();

    //await guncelle(4);
    await guncelle2(8);
    for (var i = 0; i < 10; i++) {
        //const data1Result = await kayitEkle("Data"+(i+1));
    }

    const sonuc = await bc.getBlock(3);
    console.log(sonuc)
    let errlog = await bc.validateChain();
    if (errlog.length>0) {
        console.log('Block errors = ' + errorLog.length);
        console.log('Blocks: '+errlog);
    } else {
        console.log('No errors detected');
    }
    console.log("Chain analysis result " +errlog.toString())
}



main()*/
//module.exports = () => { return new Blockchain();}
module.exports.Blockchain = Blockchain;
