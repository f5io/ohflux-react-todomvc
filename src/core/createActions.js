import Kefir from 'kefir';
import { flatten, isObject } from './utilities';
import { createAction } from './';

// *** So this one is interesting because it would its more of a transducer

let objectToKV = (obj) => {
	return Object.keys(obj).map(key => [key, obj[key]]);
};

let kVToAction = (obj, [k, v]) => {
	obj[k] = createAction(k, v);
	return obj;
}

export default function createActions(...args) {
	let flatArgs = flatten(args);
	let [ objKevValues ] = flatArgs.filter(a => isObject(a)).map(objectToKV);
	let stringKeyValues = flatArgs.filter(a => !isObject(a)).map(key => [key, undefined]);
	let keyValues = stringKeyValues.concat(objKevValues);
	let reduceStream = keyValues.reduce(kVToAction, {});
	return reduceStream;
}