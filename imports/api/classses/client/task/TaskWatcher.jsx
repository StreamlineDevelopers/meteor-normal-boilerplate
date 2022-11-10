import Watcher from "../Watcher";
import Session from "../Session";
import { TaskAdd, TaskRemove, TaskUpdate, TasksPub } from "../../../common";
import { TasksDB } from "../../../dbs";

/**
 * @description
 * Default type definition for config object.
 * 
 * @typedef {Object} Config
 * @property {String} title
 * @property {String} selectedId
 */

class TaskWatcher extends Watcher {
    // define private properties
    #config;

    constructor(parent) {
        super(parent);

        // initialize properties
        this.#config = { title: "", selectedId: null }
    }

    /**
     * @description
     * Returns all the data of tasks collection.
     */
    get Tasks () {
        // TaskDB returns a cursor so to convert it to a normal array
        // we use the "map" method.
        return TasksDB.find({}, { fields: { title: 1 } }).map(data => data);
    }
    /**
     * @description
     * Returns a config
     * @returns {Config} object
     */
    get Config() {
        return this.#config;
    }

    /**
     * @description
     * Sets a new config
     * @param {Config} newConfig 
     */
    setConfig(newConfig = {}) {
        this.#config = { ...this.#config, ...newConfig };
        this.activateWatcher();
    }
    
    /**
     * @description
     * Perform meteor call to "task.add" and add a new task.
     * @param {import("../../../types").Task} data
     */
    addTask(data) {
        this.callFunc(TaskAdd, data ,(err)=>err && console.error(err));
    }

    /**
     * @description
     * Perform meteor call to "task.remove" and remove a specific task.
     * @param {String} id 
     */
    removeTask(id) {
        this.callFunc(TaskRemove, id,(err)=>err && console.error(err));
    }

     /**
     * @description
     * Perform meteor call to "task.update" and update a specific task.
     * @param {String} id 
     * @param {import("../../../types").Task} data 
     */
    updateTask(id, data) {
        this.callFunc(TaskUpdate, id, data, (err)=>err && console.error(err));
    }

    /**
     * @description
     * We created a method wrapper for subscription and it will
     * return a boolean if subscription is ready or not.
     */
    initiateSubscription() {
        return this.subscribe({ [TasksPub]: [] });
    }

    /**
     * @description
     * Reset all values
     * @param {{ forceRender: Boolean }} data
     */
    reset({ forceRender = true }) {
        this.#config = { title: "", selectedId: null };
        forceRender && this.activateWatcher();
    }
}

export default new TaskWatcher(Session);