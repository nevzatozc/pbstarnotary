/* ===== Block Class ==============================
|  Class with a constructor for block 			   |
|  ===============================================*/
class StarBlock{
    constructor(data){  // data {adres, star{....} }
        this.hash = "";
        this.height = 0;
        this.body = data.star;
        this.address = data.address;
        //this.body = data;
        this.time = 0;
        this.previousBlockHash = "hesaplaninca...";
    }
}

module.exports.StarBlock = StarBlock;