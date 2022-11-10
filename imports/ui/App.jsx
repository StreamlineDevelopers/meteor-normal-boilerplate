import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import TaskWatcher from '../api/classses/client/task/TaskWatcher';
import './stylesheets/main.scss';
const TaskWatcherName = 'task-watcher';

class Main extends Component {
	static propTypes = {};
	static defaultProps = {};

	constructor(props) {
		super(props);

		// setting up the watcher and naming it as 'task-watcher'
		TaskWatcher.setWatcher(this, TaskWatcherName);

        this.handleAddAndUpdate = this.handleAddAndUpdate.bind(this);
	}

	handleAddAndUpdate(e) {
        e.preventDefault();

        const { selectedId, title } = TaskWatcher.Config;
		const isTaskSelected = !!selectedId;

        // if no title show alert error
        if(!title) return alert("Title cannot be empty");

        // If no selection perform add task
        if(isTaskSelected) TaskWatcher.updateTask(selectedId, { title });
        else TaskWatcher.addTask({ title });

        TaskWatcher.reset({ forceRender: false });
	}

    renderTaskSection() {
        const { isLoading, Tasks } = this.props;

        return (
            <section className='tasks'>
                {isLoading ? 'Please Wait task is loading...'
                : (
                    <ol className='tasks__lists'>
                        {Tasks.map((task) => (
                            <li key={task._id._str} className='tasks__item'>
                                <span className='tasks__item__title'>
                                    <b>Title: </b> {task.title}
                                </span>
                                <div className='tasks__item__actions'>
                                    <button
                                        onClick={() =>
                                            TaskWatcher.setConfig({
                                                selectedId: task._id, title: task.title
                                            })
                                        }
                                    >
                                        Select Task
                                    </button>
                                    <button onClick={() => TaskWatcher.removeTask(task._id)}>
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ol>
                )}
            </section>
        )
    }

    renderActions() {
        return (
            <section className='actions'>
                <form onSubmit={this.handleAddAndUpdate}>
                    <div className='input-group'>
                        <label htmlFor='title'>Title</label>
                        <textarea
                            name='title'
                            cols='30'
                            rows='5'
                            onChange={(e) => TaskWatcher.setConfig({ title: e.target.value })}
                            placeholder='What is your task?'
                            value={TaskWatcher.Config.title}
                        ></textarea>
                    </div>
                    <button type='submit'>
                        {TaskWatcher.Config.selectedId ? 'Update' : 'Add'} Task
                    </button>
                    <button type='button' onClick={() => TaskWatcher.reset({ forceRender: true })}>
                        Clear All
                    </button>
                </form>
            </section>
        )
    }

	render() {
		return (
			<div className='app'>
				<header><h1>My Task List</h1></header>
				<main>
                    {this.renderTaskSection()}
					<hr />
                    {this.renderActions()}
				</main>
			</div>
		);
	}
}

    export default withTracker(() => {
	// make watcher start watching for changes on this component
	TaskWatcher.initiateWatch(TaskWatcherName);

	// subscribe watcher method returns a boolean if subscription is ready or not
	// we will use that as an identifier if we will show loading on our UI or not.
	const isReady = TaskWatcher.initiateSubscription();

	// we passed the modified isLoading and Tasks data as props
	// and use it on our component inside.
	return { isLoading: !isReady, Tasks: TaskWatcher.Tasks };
})(Main);
