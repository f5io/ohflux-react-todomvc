import Actions from './actions';
import TodoStore from './stores';

let todo;

TodoStore.onValue(function(todos) {
	todo = todos.toList().toJS()[0];
	console.log(todos.toList().toJS(), todo);
	if (todo.text === 'hello') {
		todo.text = 'hello2';
		Actions.updateText(todo);
	}
});

Actions.create('hello');

window.Actions = Actions;
window.TodoStore = TodoStore;

console.log(Actions, TodoStore);