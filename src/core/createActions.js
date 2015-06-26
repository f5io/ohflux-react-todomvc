import { flatten } from './utilities';
import { createAction } from './';

export default function createActions(...args) {
	return flatten(args)
		.reduce((acc, action) => (acc[action] = createAction(action)) && acc, {});
}