import { Meteor } from "meteor/meteor";

// import TasksDB so that we can use it
import { TasksDB } from "../../dbs";
import { TasksPub } from "../../common";

/**
 * @description
 * Simple publication for our tasks database.
 */
Meteor.publish(TasksPub, function () {
    try {
        // We will listen to our tasks collection for changes and only 
        // return the field "title".
        return TasksDB.find({}, { fields: { title: 1 } });
    } catch (err) {
        console.error('task.js publish[%s]: %s.', TasksPub, err.message);
    }

    // we need this so that we can know if our publication 
    // is already initialized.
    this.ready();
});

