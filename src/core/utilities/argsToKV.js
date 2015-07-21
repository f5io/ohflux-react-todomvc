import {
	flatten, flattenShallow,
	isObject, objectToKV,
	notObject, keyToKV,
	nullToUndefined
} from './';

export default function argsToKV(args) {
	let flatArgs = flatten(args);

	let objKeyValues = flatArgs
		.filter(isObject)
		.map(objectToKV);

	if (objKeyValues.length) {
		objKeyValues = objKeyValues
			.reduce(flattenShallow);
	}

	let stringKeyValues = flatArgs
		.filter(notObject)
		.map(keyToKV);

	return stringKeyValues
		.concat(objKeyValues)
		.map(nullToUndefined);
}
