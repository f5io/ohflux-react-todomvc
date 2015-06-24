import { flatten } from './utilities';
import createAction from './createAction';

export default function createActions(...args) {
	return flatten(args)
		.reduce((acc, action) => (acc[action] = createAction(action)) && acc, {});
}