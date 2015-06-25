import Actions from './actions';
import TodoStore from './stores';
import Constants from './constants';

import Kefir from 'kefir';
import Immutable from 'immutable';

let isWorking = false;

TodoStore.log('todoStore');

TodoStore.onValue(function(todos) {
	if (todos.size === 10 && !isWorking) {
		isWorking = true;
		let temp = todos.takeLast(4).toList().toJS();
		temp.forEach(function(todo) {
			Actions.toggleComplete(todo);
		});
		Actions.setFilter(Constants.FILTER_COMPLETE);
		Actions.setFilter(Constants.FILTER_ALL);
	}
});

for (var i = 0; i < 10; i++) {
	Actions.create(`hello${i+1}`);
}

window.Actions = Actions;
window.TodoStore = TodoStore;

window.Kefir = Kefir;
window.Immutable = Immutable;
