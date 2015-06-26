import React from 'react';
import Actions from '../actions';
import { TodoItem } from './';

let MainSection = React.createClass({
	propTypes: {
		todos: React.PropTypes.array.isRequired,
		filteredTodos: React.PropTypes.array.isRequired,
		areAllComplete: React.PropTypes.bool.isRequired
	},
	render() {
		let todos = this.props.todos.map(todo => <TodoItem key={todo.id} todo={todo}/>);
		let allComplete = this.props.todo.every(todo => todo.complete);

		return (
			this.props.todos.length === 0 ? null : <section id="main">
                <input id="toggle-all" type="checkbox"
                    onChange={Actions.toggleCompleteAll}
                    checked={allComplete ? 'checked' : ''} />
                <label htmlFor="toggle-all">Mark all as complete</label>
                <ul id="todo-list">{todos}</ul>
            </section>
		);
	}
});
