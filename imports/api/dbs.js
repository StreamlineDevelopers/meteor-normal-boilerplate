import { Mongo } from 'meteor/mongo';

export const TasksDB = new Mongo.Collection('tasks', { idGeneration: 'MONGO' });

export default {
    TasksDB
}
