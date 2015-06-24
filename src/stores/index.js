import Actions from '../actions';
import { createStore } from '../core';

let TodoStore = createStore({
	listenables: Actions,
	onCreate(todos) {
		console.log('onCreate', arguments);
	},
	onUpdateText(todos) {
		console.log('onUpdateText', arguments);
	},
	onToggleComplete(todos) {
		console.log('onToggleComplete', arguments);
	},
	onToggleCompleteAll(todos) {
		console.log('onToggleCompleteAll', arguments);
	},
	onDestroy(todos) {
		console.log('onDestroy', arguments);
	},
	onDestroyCompleted(todos) {
		console.log('onDestroyCompleted', arguments);
	},
	onSetFilter(todos) {
		console.log('onSetFilter', arguments);
	},
});

window.Actions = Actions;

export default TodoStore;