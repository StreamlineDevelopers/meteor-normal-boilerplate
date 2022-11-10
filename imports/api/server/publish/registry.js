import { Meteor } from "meteor/meteor";

export default Meteor.isServer ? {
    TaskPubish: require("./TaskPublish"),
} : {};