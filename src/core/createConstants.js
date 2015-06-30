import {
	flatten, flattenShallow,
	isDefined, isObject, notObject,
	keyToKV, objectToKV, kvToObject
} from './utilities';

let undefinedToMirror = ([k, v]) => {
	if (!isDefined(v)) v = k;
	return [k, v];
}

export default function createConstants(...args) {
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

	let constantsObj = stringKeyValues
		.concat(objKeyValues)
		.map(undefinedToMirror)
		.reduce(kvToObject);

	return Object.freeze(constantsObj);
};