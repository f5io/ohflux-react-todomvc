import { createActions } from '../core';

let Actions = createActions([
	'create',
	'updateText',
	'toggleComplete',
	'toggleCompleteAll',
	'destroy',
	'destroyCompleted',
	'setFilter'
]);

export default Actions;