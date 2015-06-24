import Actions from './actions';
import TodoStore from './stores';

let todo;

TodoStore.onValue(function(todos) {
	todo = todos.toList().toJS()[0];
	console.log(todos.toList().toJS());
	if (todo.text === 'hello') {
		Actions.updateText({ id: todo.id, text: 'hello2' });
	}
});

Actions.create('hello');

window.Actions = Actions;
window.TodoStore = TodoStore;
