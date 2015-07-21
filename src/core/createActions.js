import { createAction } from './';
import {
	argsToKV, kvToObjectWithModifier, nullToUndefined
} from './utilities';

export default function createActions(...args) {
	return argsToKV(args)
		.reduce(kvToObjectWithModifier(createAction));
}
