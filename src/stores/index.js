import Actions from '../actions';
import Immutable from 'Immutable';
import { createStore } from '../core';
import { uuid } from '../utilities';

let create = text => Immutable.Map({
	id: uuid(),
	completed: false,
	text: text
})

let TodoStore = createStore({
	listenables: Actions,
	onCreate(todos, text) { 
		console.log(this);
		let todo = create(text);
		return todos.set(todo.id, todo);
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
	onSetFilter(todos) {
		console.log('onSetFilter', arguments);
	},
	getAll() {
		console.log(this);
	}
});

export default TodoStore;