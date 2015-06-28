import React from 'react';
import Actions from '../actions';
import Constants from '../constants';
import { Filter } from './';

let Footer = React.createClass({
	propTypes: {
		allTodos: React.PropTypes.array.isRequired,
		filter: React.PropTypes.string
	},
	render() {
		let { allTodos, filter } = this.props;
		filter = filter || Constants.FILTER_ALL;

		let total = allTodos.length;
		let completed = allTodos.filter(t => t.completed).length;
		let itemsLeft = total - completed;
        let itemsLeftPhrase = (itemsLeft === 1 ? 'item' : 'items') + ' left';
        let clearCompletedButton = completed ? <button id="clear-completed"
        	onClick={Actions.destroyCompleted}> Clear completed ({completed})</button> : null;

		return (
            total === 0 ? null : <footer id="footer">
                <span id="todo-count">
                    <strong>{itemsLeft}</strong> {itemsLeftPhrase}
                </span>
                <ul id="filters">
                    <Filter filter={Constants.FILTER_ALL} active={filter === Constants.FILTER_ALL}>All</Filter>
                    <Filter filter={Constants.FILTER_ACTIVE} active={filter === Constants.FILTER_ACTIVE}>Active</Filter>
                    <Filter filter={Constants.FILTER_COMPLETE} active={filter === Constants.FILTER_COMPLETE}>Complete</Filter>
                </ul>
                {clearCompletedButton}
            </footer>
        );
	}
});

export default Footer;