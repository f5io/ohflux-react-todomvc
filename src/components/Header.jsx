import React from 'react';
import { TodoTextInput } from './';
import Actions from '../actions';

let Header = React.createClass({
	render() {
		return (
            <header id="header">
                <h1>todos</h1>
                <TodoTextInput
                	id="new-todo"
                	placeholder="What needs to be done?"
                	onSave={Actions.create} />
            </header>
        );
	}
});

export default Header;
