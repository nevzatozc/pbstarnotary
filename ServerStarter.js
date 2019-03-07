const Hapi = require('hapi');

/**
 * Class Definition for the REST API
 */
class StarAPI {

    /**
     * Constructor that allows initialize the class 
     */
    constructor() {
		this.server = Hapi.Server({
            port: 8000,
            host: 'localhost'
        });
        this.initControllers();
        this.start();
    }

    /**
     * Initilization of all the controllers
     */
	initControllers() {
        //require("./Blockchain.js");
		this.contoller = require("./WebAPI.js")(this.server);
	}
    
    async start() {
        await this.server.start();
        console.log(`Server running at: ${this.server.info.uri}`);
    }

}

var ana = new StarAPI();
//ana.contoller.initializeMockData(); //done