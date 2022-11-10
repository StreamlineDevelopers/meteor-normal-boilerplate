import { Meteor } from "meteor/meteor";
import { v4 as uuidv4 } from "uuid";
import { Logger } from "./Logger";

class Server {
    #settings;
    #isReady = false;
    #id = uuidv4();
    constructor(settings) {
        if (Object.keys(settings).length <= 1) throw new Error("No settings found! use meteor --settings ./settings.json");

        this.functions = {};
        this.#settings = settings;
    }
    get Config() {
        return this.#settings;
    }
    get ServerHost() {
        return this.Config.host || "http://127.0.0.1:3000/";
    }
    get ServerID() {
        return this.#id;
    }
    /**
     * @returns {boolean}
     */
    get IsReady() {
        while (!this.#isReady) Meteor._sleepForMs(1000);
        return true;
    }
    startAllService() {
        this.#isReady = false;
        Logger.showNotice("Server booting... (id: %s)", this.ServerID);
        Promise.all([
        ]).then(() => {
            this.#isReady = true;
            Logger.showStatus("Server is ready!");
        });
    }
  
    startUp() {
        Logger.showLog("Welcome to Meteor");
    }
}

export default new Server(Meteor.settings);