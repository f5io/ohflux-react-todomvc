import {
	argsToKV, kvToObject, undefinedToMirror
} from './utilities';

export default function createConstants(...args) {
	let constantsObj = argsToKV(args)
		.map(undefinedToMirror)
		.reduce(kvToObject);

	return Object.freeze(constantsObj);
};
