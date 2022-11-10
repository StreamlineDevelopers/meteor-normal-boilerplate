import moment from 'moment';

/**
 * Watcher class
 * - make a class reactive
 */
export default class Watcher {
    constructor(parent) {
        this.watcher = {};
        this.callFunction = null;
        this.callSubscribe = null;
        this.parent = parent;
        this.callFunction = this.parent ? this.parent.callFunction : () => { console.warn('No active parent found!'); };
        this.callSubscribe = this.parent ? this.parent.callSubscribe : () => { console.warn('No active parent found!'); };
        this._subscriptions = {};
        this.mounted = {};
        this.isRendering_ = {};
        this.stack = {};
        this.x = 0xa246a1be3e.toString();
    }
    /**
     * Attach obj component to this class
     * @param {Component} obj 
     * @param {String} name 
     */
    setWatcher(obj, name) {
        if (!name)
            throw Error("Watcher name is required!");
        if (!obj)
            throw Error("Watcher component is required!");
        this.watcher[name] = obj;
        let func = obj.componentDidMount || (() => {});
        let func2 = obj.componentWillUnmount || (() => {});
        let func3 = obj.getSnapshotBeforeUpdate || (() => null);
        let func4 = obj.componentDidUpdate || (() => {});
        func = func.bind(obj);
        func2 = func2.bind(obj);
        obj.componentDidMount = () => {
            this.mounted[name] = true;
            func.call(obj);
        };
        obj.componentWillUnmount = () => {
            delete this.mounted[name];
            func2.call(obj);
        };
        obj.getSnapshotBeforeUpdate = (prevProps, prevState) => {
            this.isRendering_[name] = true;
            return func3.call(obj, prevProps, prevState) || null;
        };
        obj.componentDidUpdate = () => {
            delete this.isRendering_[name];
            func4.call(obj);
        };
    }
    /**
     * Initiate this class for reactivity
     * @param {String} name 
     */
    initiateWatch(name) {
        if (name)
            return this.watcher[name];
        else
            console.warn("Watcher initiated but no component specified!");
    }
    /**
     * Detach current component to this class
     * @param {String} name 
     */
    removeWatcher(name) {
        if (this.watcher[name])
            delete this.watcher[name];
        else
            console.warn("Removing watcher but no attached component!");
    }
    /**
     * Trigger reactivity variable
     */
    activateWatcher() {
        if (!Object.keys(this.watcher).length)
            console.warn('Trigerring watcher but no attached component!');
        for (let key in this.watcher) {
            if (this.mounted[key]) {
                if (this.isRendering_[key]) {
                    if (this.stack[key])
                        clearTimeout(this.stack[key]);
                    this.stack[key] = setTimeout(() => {
                        this.activateWatcher();
                    }, 100);
                } else
                    this.watcher[key].setState({ navigateWatch: moment().valueOf() });
            }
        }
    }
    /**
     * Call function to server
     */
    callFunc(...args) {
        let traverse = (obj) => {
            // if (typeof obj == 'string') {
            //     return btoa(Encryption.XoR(obj, this.x));
            // } else if (obj instanceof Array) {
            //     for (let idx = 0; idx < obj.length; idx++)
            //         obj[idx] = traverse(obj[idx]);
            // } else if (typeof obj == 'object' && !(obj instanceof Mongo.ObjectID)) {
            //     for (let key in obj) {
            //         obj[key] = traverse(obj[key]);
            //     }
            // }
            return obj;
        };
        if (this.callFunction) {
            // args[0] = Adler32.hash(args[0]);
            for (let x = 1; x < args.length; x++)
                args[x] = traverse(args[x]);
            this.callFunction.apply(this, args);
        }
    }
    /**
     * Subscribe data from server
     * @param {Object} data
     */
    subscribe(data) {
        let isReady = true;
        if (this.callSubscribe) {
            for (let key in data) {
                let params = [/*Adler32.hash(*/key/*)*/].concat(data[key]);
                let lastId = null;
                if (this._subscriptions[key]) {
                    lastId = this._subscriptions[key].subscriptionId;
                    if (Meteor.default_connection?._subscriptions[lastId])
                        Meteor.default_connection._subscriptions[lastId].inactive = true;
                }
                this._subscriptions[key] = this.callSubscribe.apply(this, params);
                isReady = this._subscriptions[key] && this._subscriptions[key].ready() && isReady;

                // temporarily disabled due to meteor updates
                // if (this._subscriptions[key].subscriptionId != lastId && Meteor.default_connection._subscriptions[lastId]
                //     && Meteor.default_connection._subscriptions[lastId].inactive) {
                //     Meteor.default_connection._subscriptions[lastId].stop();
                // }
            }
        }
        return isReady;
    }
}