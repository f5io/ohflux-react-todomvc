import Kefir from 'kefir';
import { createAction } from './';
import {
	flatten, flattenShallow,
	isObject, notObject,
	keyToKV, objectToKV, kvToObjectWithModifier
} from './utilities';

export default function createActions(...args) {
	let flatArgs = flatten(args);

	let objKeyValues = flatArgs
		.filter(isObject)
		.map(objectToKV);

	if (objKeyValues.length) {
		objKeyValues = objKeyValues.reduce(flattenShallow);
	}

	let stringKeyValues = flatArgs
		.filter(notObject)
		.map(keyToKV);

	return stringKeyValues
		.concat(objKeyValues)
		.reduce(kvToObjectWithModifier(createAction));
}