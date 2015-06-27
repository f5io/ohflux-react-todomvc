import Immutable from 'immutable';
import { createActions } from '../core';
import { uuid } from '../utilities';

let notEmpty = str => str.trim().length;
let create = text => Immutable.Map({
	id: uuid(),
	completed: false,
	text: text
});

let Actions = createActions({
	create: action => action.filter(notEmpty).map(create),
	updateText: null,
	toggleComplete: null,
	toggleCompleteAll: null,
	destroy: null,
	destroyCompleted: null,
	setFilter: null
});

export default Actions;