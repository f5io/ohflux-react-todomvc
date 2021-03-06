import Actions from '../actions';
import Immutable from 'Immutable';
import Constants from '../constants';
import { createStore } from 'ohflux';

let TodoStore = createStore({
	actions: Actions,
	getInitialState: () => ({
		allTodos: Immutable.OrderedMap(),
		filter: Constants.FILTER_ALL
	}),
	onCreate({ allTodos }, todo) {
		allTodos = allTodos.set(todo.get('id'), todo);
		return { allTodos };
	},
	onUpdateText({ allTodos }, todo) {
		allTodos = allTodos.setIn([todo.id, 'text'], todo.text);
		return { allTodos };
	},
	onToggleComplete({ allTodos }, todo) {
		allTodos = allTodos.setIn([todo.id, 'completed'], !todo.completed);
		return { allTodos };
	},
	onToggleCompleteAll({ allTodos }) {
		allTodos = allTodos.set('completed', true);
		return { allTodos };
	},
	onDestroy({ allTodos }, todo) {
		allTodos = allTodos.delete(todo.id);
		return { allTodos };
	},
	onDestroyCompleted({ allTodos }) {
		allTodos = allTodos.filterNot(todo => todo.get('completed'));
		return { allTodos };
	},
	onSetFilter({ allTodos }, filter) {
		return { filter };
	},
	onTestAsync(state, val) {
		console.log('onTestAsync', val);
		return state;
	},
	onTestAsyncCompleted(state, val) {
		console.log('onTestAsyncCompleted', val);
		return state;
	},
	onTestAsyncFailed(state, val) {
		console.log('onTestAsyncFailed', val);
		return state;
	}
});

export default TodoStore;
