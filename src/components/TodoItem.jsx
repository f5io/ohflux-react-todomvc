import React from 'react';
import Actions from '../actions';
import { classSet } from '../utilities';

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

		return (
			<li className={classSet({ complete: todo.complete, editing })} key={todo.id}>
				<div className="view">
                    <input className="toggle" type="checkbox" checked={todo.complete} onChange={Actions.toggleComplete.bind(todo)} />
                    <label onDoubleClick={this._onDoubleClick}>
                        {todo.text}
                    </label>
                    <button className="destroy" onClick={Actions.destroy.bind(todo)} />
                </div>
                {input}
            </li>
		);
	},
	_onDoubleClick() {
		this.setState({ editing: true });
	},
	_onSave(text) {
		let { id } = this.props.todo;
		Actions.updateText({ id, text });
		this.setState({ editing: false });
	}
});

export default TodoItem;
