// import Actions from './actions';
// import TodoStore from './stores';
// import Constants from './constants';

// // console.log(Actions);
// // console.log(TodoStore);
// // console.log(Constants);

// import Kefir from 'kefir';
// import Immutable from 'immutable';

// let isWorking = false;

// TodoStore.log('todoStore');

// TodoStore.onValue(function([ contents, modified ]) {
// 	let todos = contents.toList().toJS();
// 	let filtered = modified.toList().toJS();
// 	console.log(todos.length, filtered.length);
// 	if (contents.size === 10 && !isWorking) {
// 		isWorking = true;
// 		let temp = contents.takeLast(4).toList().toJS();
// 		temp.forEach(function(todo) {
// 			Actions.toggleComplete(todo);
// 		});
// 		Actions.setFilter(Constants.FILTER_COMPLETE);
// 		Actions.setFilter(Constants.FILTER_ALL);
// 	}
// });

// for (var i = 0; i < 10; i++) {
// 	Actions.create(`hello${i+1}`);
// }

import React from 'react';
import { App } from './components';

React.render(<App/>, document.querySelector('div[app]'));
