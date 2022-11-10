import { Meteor } from "meteor/meteor";

export default Meteor.isServer ? {
    ...require("./TaskService").default,
} : {};