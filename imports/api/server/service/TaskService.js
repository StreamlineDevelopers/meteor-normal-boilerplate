import { Meteor } from "meteor/meteor";
import { check } from 'meteor/check';
import moment from 'moment/moment';

import { TaskAdd, TaskRemove, TaskUpdate } from '../../common';
import { TasksDB } from "../../dbs";

export default {
    /**
     * @description
     * Add a new task
     * @param {import('../../types').Task} data 
     */
    [TaskAdd]: function(data = {}) {
        try {
            check(data, Object);

            data.timestamp = moment().valueOf();
            // create log in the server just to notify if a new task is added.
            console.info('TaskService.js call[%s]: %s at %s', TaskAdd, 'New Task Added!', moment(data.timestamp));

            return TasksDB.insert(data);
        } catch (error) {
            console.error('TaskService.js call[%s]: %s.', TaskAdd, error);
        }
    },
    /**
     * @description
     * Remove a specific task
     * @param {{ _id: string }} id 
     */
    [TaskRemove]: function(id) {
        try {
            check(id, Meteor.Collection.ObjectID);
            // create log in the server just to notify if a task is removed.
            console.info('TaskService.js call[%s]: %s at %s', TaskRemove, `Task ${id} removed`, moment(moment().valueOf()));

            return TasksDB.remove(id)
        } catch (error) {
            console.error('TaskService.js call[%s]: %s.', TaskRemove, error);
        }
    },
    /**
     * @description
     * Updates a specific task
     * @param {{ _id: string }} id 
     * @param {import('../../types').Task} data 
     */
    [TaskUpdate]: function(id, data) {
        try {
            check(id, Meteor.Collection.ObjectID);
            check(data, Object);
            // create log in the server just to notify if a specific task is updated.
            console.info('TaskService.js call[%s]: %s at %s', TaskUpdate, `Task ${id} updated`, moment(moment().valueOf()));

            return TasksDB.update(id,{ $set: { ...data } }, { upsert: 1 });
        } catch (error) {
            console.error('TaskService.js call[%s]: %s.', TaskUpdate, error);
        }
    }
}