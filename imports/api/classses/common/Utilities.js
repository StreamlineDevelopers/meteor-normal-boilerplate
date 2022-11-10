import crc32 from "crc32";
import bigInt from "big-integer";
import { Mongo } from "meteor/mongo";
import { Meteor } from "meteor/meteor";
import PhoneNumber from "awesome-phonenumber";

import "./PhoneNumberParser";

export default {
    /**
     * 
     * @param {Buffer} buf 
     * @returns {ArrayBuffer}
     */
    toArrayBuffer: (buf) => {
        const ab = new ArrayBuffer(buf.length);
        const view = new Uint8Array(ab);
        for (let i = 0; i < buf.length; ++i) {
            view[i] = buf[i];
        }
        return ab;
    },
    getSetup: () => {
        if (Meteor.isDevelopment) return 'Development';
        if (Meteor.isProduction) return 'Production';
        if (Meteor.isTest) return 'Test';
        if (Meteor.isAppTest) return 'App Test';
        return 'N/A';
    },
    /**
     * 
     * @param {Array <{ hash: boolean, value: string }>} arr 
     * @returns {string}
     */
    toIndexField: (arr) => {
        return arr.map((item) => {
            if (item != null) {
                if (item.hash)
                    if (item.value instanceof Mongo.ObjectID)
                        return crc32(item.value._str);
                    else if (item.value instanceof MongoInternals.NpmModule.ObjectID)
                        return crc32(item.value.toString());
                    else if (typeof item.value == "string")
                        return crc32(item.value);
                if (typeof item == "boolean")
                    return item ? 1 : 0;
            }
            return item;
        }).filter((i) => i != null).join("");
    },
    toObjectId(obj, isRaw = false) {
        if (obj && obj instanceof Array) {
            for (let key in obj)
                obj[key] = this.toObjectId(obj[key], isRaw);
        } else if (obj && typeof obj == "object") {
            if (obj._str)
                obj = isRaw ? new MongoInternals.NpmModule.ObjectID(obj._str) : new Mongo.ObjectID(obj._str);
            else if (obj.str)
                obj = isRaw ? new MongoInternals.NpmModule.ObjectID(obj.str) : new Mongo.ObjectID(obj.str);
            else {
                for (let key in obj)
                    obj[key] = this.toObjectId(obj[key], isRaw);
            }
        }
        return obj;
    },
    decodeBase64(ciphertxt) {
        if (Meteor.isClient)
            return atob(ciphertxt);
        if (Meteor.isServer)
            return Buffer.from(ciphertxt, "base64").toString("ascii");
        return ciphertxt;
    },
    encodeBase64(plaintxt) {
        if (Meteor.isClient)
            return btoa(plaintxt);
        if (Meteor.isServer)
            return Buffer.from(plaintxt).toString("base64");
        return plaintxt;
    },
    isUnicode(txt) {
        let check = txt.replace(/[a-z0-9`~!@#$%^&*()_|+\-=?;:'", .<>{}[\]\\/\n]/gi, "");
        return check.length != txt.length;
    },
    isUrl(str) {
        const regexp = "^(?:(?:https?|ftp)://)?(?:(?!(?:10|127)(?:.d{1,3}){3})(?!(?:169.254|192.168)" +
            "(?:.d{1,3}){2})(?!172.(?:1[6-9]|2d|3[0-1])(?:.d{1,3}){2})(?:[1-9]d?|1dd|2[01]d|22[0-3])" +
            "(?:.(?:1?d{1,2}|2[0-4]d|25[0-5])){2}(?:.(?:[1-9]d?|1dd|2[0-4]d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)" +
            "*[a-z\u00a1-\uffff0-9]+)(?:.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)" +
            "*(?:.(?:[a-z\u00a1-\uffff]{2,})))(?::d{2,5})?(?:/S*)?$";
        if (new RegExp(regexp).test(str))
            return true;
        return false;
    },
    bytesIsEqual(bytes1, bytes2) {
        if (bytes1.length !== bytes2.length) {
            return false;
        }

        for (let i = 0; i < bytes1.length; i++) {
            if (bytes1[i] !== bytes2[i]) {
                return false;
            }
        }

        return true;
    },
    getRandomBytes(length) {
        if (Meteor.isClient) {
            const bytes = new Uint8Array(length);
            crypto.getRandomValues(bytes);
            return bytes;
        } else if (Meteor.isServer) {
            const crypto = require("crypto");
            return new Uint8Array(crypto.randomBytes(length));
        }
        return new Uint8Array();
    },
    bigIntToBytes(bigInt_, length) {
        return this.hexToBytes(bigInt_.toString(16), length);
    },
    hexToBytesRaw(value, length) {
        if (!length) {
            length = Math.ceil(value.length / 2);
        }

        while (value.length < length * 2) {
            value = "0" + value;
        }

        const bytes = [];
        for (let i = 0; i < length; i++) {
            bytes.push(parseInt(value.slice(i * 2, i * 2 + 2), 16));
        }
        return bytes;
    },
    hexToBytes(value, length) {
        return new Uint8Array(this.hexToBytesRaw(value, length));
    },
    bytesToBigInt(bytes) {
        return bigInt(this.bytesToHex(bytes), 16);
    },
    bytesToHex(bytes) {
        const result = [];
        for (let i = 0; i < bytes.length; i++) {
            result.push((bytes[i] < 16 ? "0" : "") + bytes[i].toString(16));
        }
        return result.join("");
    },
    getRandomInt(maxValue) {
        return Math.floor(Math.random() * maxValue);
    },
    concatBytes(...arrays) {
        let length = 0;

        for (let bytes of arrays) {
            length += bytes.length;
        }

        let result = new Uint8Array(length);
        let offset = 0;

        for (let bytes of arrays) {
            result.set(bytes, offset);
            offset += bytes.length;
        }

        return result;
    },
    generateGA(dhPrime) {
        while (dhPrime) {
            const a = this.bytesToBigInt(this.getRandomBytes(256));
            const g = bigInt(3);
            const gA = g.modPow(a, dhPrime);

            if (gA.lesserOrEquals(bigInt.one))
                continue;
            if (gA.greaterOrEquals(dhPrime.minus(bigInt.one)))
                continue;

            const twoPow = bigInt(2).pow(2048 - 64);

            if (gA.lesser(twoPow))
                continue;
            if (gA.greaterOrEquals(dhPrime.minus(twoPow)))
                continue;

            return { gA: gA, a };
        }
        return null;
    },
    xor(b, c) {
        let d = [];
        for (let a = 0; a < b.length; a++)
            b[a] != c[a % c.length] ? d[a] = String.fromCharCode(b.charCodeAt(a) ^ c.charCodeAt(a % c.length)) : d[a] = b[a];
        return d.join("");
    },
    xorBytes(bytes1, bytes2) {
        let bytes = new Uint8Array(bytes1.length);
        for (let i = 0; i < bytes1.length; i++) {
            bytes[i] = bytes1[i] ^ bytes2[i];
        }
        return bytes;
    },
    bytesToBytesRaw(bytes) {
        const result = [];

        for (let i = 0; i < bytes.length; i++) {
            result.push(bytes[i]);
        }

        return result;
    },
    isEmail(str) {
        const regx = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>().,;\s@"]+\.{0,1})+[^<>().,;:\s@"]{2,})$/;
        if (str) return regx.test(str);
        return false;
    },
    numberValidator(input) {
        if (!input) return { isValid: false };
        let check = parsePhoneNumber(input);
        if (check && check.o) {
            const phone = PhoneNumber(check.u);
            if (phone.isValid()) {
                let isUS = false;
                switch (phone.getRegionCode()) {
                    case "US": case "CA":
                    case "AG": case "AI": case "AS": case "BB": case "BM": case "BS":
                    case "DM": case "DO": case "GD": case "GU": case "JM": case "KN":
                    case "KY": case "LC": case "MP": case "MS": case "PR": case "SX":
                    case "TC": case "TT": case "VC": case "VG": case "VI": case "UM":
                        isUS = true;
                        break;
                }
                return {
                    isValid: phone.isValid(),
                    fromUS: isUS,
                    region: phone.getRegionCode(),
                    internationalFormat: phone.getNumber("international"),
                    nationalFormat: phone.getNumber("national"),
                    e164Format: phone.getNumber("e164"),
                    rfc3966Format: phone.getNumber("rfc3966"),
                    significant: phone.getNumber("significant"),
                    number: input,
                };
            }
        }
        return { isValid: false };
    },
    getSetup() {
        if (Meteor.isDevelopment)
            return "Development";
        if (Meteor.isProduction)
            return "Production";
        if (Meteor.isTest)
            return "Test";
        if (Meteor.isAppTest)
            return "App Test";
        return "N/A";
    },
    isValidString(str) {
        return (str && typeof str == "string" && str.trim());
    },
    decodeUTF8(string) {
        if (!string) return "";
        try {
            return decodeURIComponent(escape(string));
        } catch (err) {
            return string;
        }
    },
    /**
     * Get parts of a string equal to maxBytes size
     * @param {String} str 
     * @param {Number} maxBytes 
     * @returns {String}
     */
    strChuck(str, maxBytes) {
        let buf = Buffer.from(str);
        const result = [];
        while (buf.length) {
            let i = buf.lastIndexOf(32, maxBytes + 1);
            // If no space found, try forward search
            if (i < 0) i = buf.indexOf(32, maxBytes);
            // If there's no space at all, take the whole string
            if (i < 0) i = buf.length;
            // This is a safe cut-off point; never half-way a multi-byte
            result.push(buf.slice(0, i).toString());
            buf = buf.slice(i + 1); // Skip space (if any)
        }
        return result;
    },
    hasElemBottomReached(event) {
        if (event && event.target)
            return event.target.scrollHeight - event.target.scrollTop === event.target.clientHeight;
        return false;
    },
    formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return "0 Bytes";

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    },
    isHexLight(color) {
        const hex = color.replace("#", "");
        const cr = parseInt(hex.substr(0, 2), 16);
        const cg = parseInt(hex.substr(2, 2), 16);
        const cb = parseInt(hex.substr(4, 2), 16);
        const brightness = ((cr * 299) + (cg * 587) + (cb * 114)) / 1000;
        return brightness > 155;
    }
};