import { createAction } from './';
import {
	argsToKV, kvToObjectWithModifier
} from './utilities';

export default function createActions(...args) {
	return argsToKV(args)
		.reduce(kvToObjectWithModifier(createAction));
}
