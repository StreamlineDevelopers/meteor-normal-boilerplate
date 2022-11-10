import Watcher from "./Watcher";

class Session extends Watcher {
    constructor() {
        super();
        this.secureTransaction();
    }
    /**
     * Hide sensitive functions
     */
    secureTransaction() {
        this.login = Meteor.loginWithPassword;
        this.logout = Meteor.logout;
        this.callFunction = Meteor.call;
        this.callSubscribe = Meteor.subscribe;
        Meteor.loginWithPassword = () => console.warn('unauthorized!');
        Meteor.loginWithToken = () => console.warn('unauthorized!');
        Meteor.logout = () => console.warn('unauthorized!');
        Meteor.call = () => console.warn('unauthorized!');
        Meteor.subscribe = () => console.warn('unauthorized!');
    }
}

export default new Session();