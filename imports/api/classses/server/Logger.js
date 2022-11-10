export class Logger {
    static formatArgs(arg) {
        let keys = Object.keys(arg);
        keys.splice(0, 1);
        let retval = keys.map((index) => {
            if (typeof arg[index] === "number")
                return `${arg[index]}`.red;
            else if (typeof arg[index] != "string")
                return JSON.stringify(arg[index] || "").magenta;
            return `${arg[index]}`.grey;
        });
        if (!retval.length)
            return "";
        return retval;
    }
    static log() {
        if (console) {
            // eslint-disable-next-line no-console
            console.log.apply(console, arguments);
        }
    }
    static showNotice() {
        Logger.log.apply(this, [`${"[Notice]: ".white}${arguments[0]}`].concat(Logger.formatArgs(arguments)));
    }
    static showStatus() {
        Logger.log.apply(this, [`${"[Status]".green}${":".white} ${arguments[0]}`].concat(Logger.formatArgs(arguments)));
    }
    static showError() {
        Logger.log.apply(this, [`${"[Error]".red}${":".white} ${arguments[0]}`].concat(Logger.formatArgs(arguments)));
    }
    static showWarning() {
        Logger.log.apply(this, [`${"[Warning]".yellow}${":".white} ${arguments[0]}`].concat(Logger.formatArgs(arguments)));
    }
    static showDebug() {
        Logger.log.apply(this, [`${"[Debug]".magenta}${":".white} ${arguments[0]}`].concat(Logger.formatArgs(arguments)));
    }
    static showLog() {
        Logger.log.apply(this, arguments);
    }
}