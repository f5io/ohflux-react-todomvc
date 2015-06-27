import { createActions } from '../core';

let Actions = createActions({
	create: (x => x.map(() => 3)),
	updateText: null,
	toggleComplete: null,
	toggleCompleteAll: null,
	destroy: null,
	destroyCompleted: null,
	setFilter: null
});

export default Actions;