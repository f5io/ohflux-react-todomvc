import { createObj, isFunction } from './';

export default function inherit(stream, obj) {
	let proto = createObj(stream.constructor.prototype);
	for (let fn in proto) {
		obj[fn] = isFunction(proto[fn]) ? proto[fn].bind(stream) : proto[fn];
	}
	return obj;
}