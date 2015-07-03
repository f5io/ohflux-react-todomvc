import Immutable from 'immutable';
import { createActions } from '../core';
import { uuid } from '../utilities';
import Kefir from 'kefir';

let notEmpty = str => str.trim().length;
let create = text => Immutable.Map({
	id: uuid(),
	completed: false,
	text: text
});

let Actions = createActions({
	create: action =>
		action.filter(notEmpty)
			.map(create)
			.flatMap(val =>
				Kefir.fromPromise(new Promise(resolve =>
					setTimeout(resolve, 5000, val)
				)
			)
		),
	updateText: null,
	toggleComplete: null,
	toggleCompleteAll: null,
	destroy: null,
	destroyCompleted: null,
	setFilter: null
});

export default Actions;
