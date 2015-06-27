import Actions from '../actions';
import Immutable from 'Immutable';
import Constants from '../constants';
import { createStore } from '../core';

let isComplete = todo => todo.get('complete');

let TodoStore = createStore({
	actions: Actions,
	modifier: Actions.setFilter,
	onCreate(todos, todo) {
		return todos.set(todo.get('id'), todo);
	},
	onUpdateText(todos, todo) {
		return todos.setIn([todo.id, 'text'], todo.text);
	},
	onToggleComplete(todos, todo) {
		return todos.setIn([todo.id, 'complete'], !todo.complete);
	},
	onToggleCompleteAll(todos) {
		return todos.map(todo => todo.set('complete', true));
	},
	onDestroy(todos, todo) {
		return todos.delete(todo.id);
	},
	onDestroyCompleted(todos) {
		return todos.filterNot(todo => todo.get('complete'));
	},
	setFilter(todos, filter) {
		switch(filter) {
			case Constants.FILTER_ACTIVE: return todos.filterNot(isComplete);
			case Constants.FILTER_COMPLETE: return todos.filter(isComplete);
			default: return todos;
		}
	}
});

export default TodoStore;
