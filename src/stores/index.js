import Actions from '../actions';
import { createStore } from '../core';

let TodoStore = createStore({
	listenables: Actions
});

window.Actions = Actions;

export default TodoStore;