import path from "path";

class Path {
    constructor() {
        this.basepath = path.resolve(".");
        this.separator = "\\";
        this.isUnix = false;
        let isSlave = false;
        if (this.basepath.indexOf(".meteor\\slave\\build\\") > -1 || this.basepath.indexOf(".meteor/slave/build/") > -1)
            isSlave = true;
        if (process.env.OS && process.env.OS === "Windows_NT") {
            /* windows */
            if (!process.env.METEOR_LOCAL_DIR)
                this.basepath = this.basepath.replace(".meteor\\local\\build\\programs\\server", ""); // undeployed            
            else
                this.basepath = this.basepath.replace(process.env.METEOR_LOCAL_DIR + "\\build\\programs\\server", ""); // undeployed            
            this.basepath = this.basepath.replace("bundle\\programs\\server", ""); // deployed
            if (isSlave)
                this.basepath = this.basepath.replace(".meteor\\slave\\build\\programs\\server", ""); // undeployed
        } else {
            /* unix */
            this.basepath = this.basepath.replace("bundle/programs/server", ""); // deployed
            if (!process.env.METEOR_LOCAL_DIR)
                this.basepath = this.basepath.replace(".meteor/local/build/programs/server", ""); // undeployed
            else
                this.basepath = this.basepath.replace(process.env.METEOR_LOCAL_DIR + "/build/programs/server", ""); // undeployed
            if (isSlave)
                this.basepath = this.basepath.replace(".meteor/slave/build/programs/server", ""); // undeployed
            this.separator = "/";
            this.isUnix = true;
        }
    }
    get ISWINDOWS() {
        return !this.isUnix;
    }
    get BASE() {
        return this.basepath;
    }
    get PROTO() {
        return `${this.basepath}.proto${this.separator}`;
    }
    get REFERENCES() {
        return `${this.basepath}.references${this.separator}`;
    }
    get UPLOAD() {
        return `${this.basepath}.upload${this.separator}`;
    }
    get GIT() {
        return `${this.basepath}.git${this.separator}`;
    }
    get METEOR() {
        return `${this.basepath}.meteor${this.separator}`;
    }
    get CONFIG() {
        return `${this.basepath}.config${this.separator}`;
    }
}

export default new Path();