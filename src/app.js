import Actions from './actions';
import TodoStore from './stores';
import Constants from './constants';

import Kefir from 'kefir';
import Immutable from 'immutable';

let isWorking = false;

<<<<<<< HEAD
TodoStore.log('todoStore');

TodoStore.onValue(function([ contents, modified ]) {
	let todos = contents.toList().toJS();
	//let filtered = modified.toList().toJS();
	console.log(todos.length);
	if (contents.size === 10 && !isWorking) {
		isWorking = true;
		let temp = contents.takeLast(4).toList().toJS();
		temp.forEach(function(todo) {
			Actions.toggleComplete(todo);
		});
		Actions.setFilter(Constants.FILTER_COMPLETE);
		Actions.setFilter(Constants.FILTER_ALL);
	}
});
=======
// TodoStore.map(store => store.toList().toJS()).log('todoStore');

// TodoStore.onValue(function(todos) {
// 	if (todos.size === 10 && !isWorking) {
// 		isWorking = true;
// 		let temp = todos.takeLast(4).toList().toJS();
// 		temp.forEach(function(todo) {
// 			Actions.toggleComplete(todo);
// 		});
// 		Actions.setFilter(Constants.FILTER_COMPLETE);
// 		Actions.setFilter(Constants.FILTER_ALL);
// 	}
// });
>>>>>>> emitter

for (var i = 0; i < 10; i++) {
	Actions.create(`hello${i+1}`);
}

window.Actions = Actions;
window.TodoStore = TodoStore;

window.Kefir = Kefir;
window.Immutable = Immutable;

// import React from 'react';
// import { App } from './components';

// React.render(<App/>, document.querySelector('div[app]'));
