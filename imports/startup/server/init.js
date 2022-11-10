import Server from '../../api/classses/server/Server';
import functions from '../../api/server';

Meteor.startup(async function () {
    // You can do whatever you want 
    // on this line
    Server.startUp();

    // This one is important, we need to so that our functions
    // that we created on services will be registered
    // on the meteor methods.
    Meteor.methods({...functions});
});
