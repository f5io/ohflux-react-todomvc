import React from 'react';
import Actions from '../actions';
import { classSet } from '../utilities';
import { TodoTextInput } from './';

let TodoItem = React.createClass({
	propTypes: {
		todo: React.PropTypes.object.isRequired
	},
	getInitialState() {
		return { editing: false };
	},
	render() {
		let { todo } = this.props;
		let { editing } = this.state;
		let input = editing ? <TodoTextInput className='edit' onSave={this._onSave} value={todo.text} /> : null;
		let classes = classSet({ completed: todo.completed, editing });

		return (
			<li className={classes} key={todo.id}>
				<div className="view">
                    <input className="toggle" type="checkbox" checked={todo.completed} onChange={this._onToggleComplete} />
                    <label onDoubleClick={this._onDoubleClick}>
                        {todo.text}
                    </label>
                    <button className="destroy" onClick={this._onDestroy} />
                </div>
                {input}
            </li>
		);
	},
	_onDoubleClick() {
		this.setState({ editing: true });
	},
	_onDestroy() {
		Actions.destroy(this.props.todo);
	},
	_onToggleComplete() {
		Actions.toggleComplete(this.props.todo);
	},
	_onSave(text) {
		let { id } = this.props.todo;
		Actions.updateText({ id, text });
		this.setState({ editing: false });
	}
});

export default TodoItem;
