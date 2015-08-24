export { default as argsToKV } from './argsToKV';
export { default as createObj } from './createObj';
export { default as flatten } from './flatten';
export { default as flattenShallow } from './flattenShallow';
export { default as inherit } from './inherit';
export { default as isDefined } from './isDefined';
export { default as isFunction } from './isFunction';
export { default as isObject } from './isObject';
export { default as keyToKV } from './keyToKV';
export { default as kvToObjectWithModifier } from './kvToObjectWithModifier';
export { default as kvToObject } from './kvToObject';
export { default as notObject } from './notObject';
export { default as nullToUndefined } from './nullToUndefined';
export { default as objectToKV } from './objectToKV';
export { default as toSentenceCase } from './toSentenceCase';
export { default as undefinedToMirror } from './undefinedToMirror';

function compose(...args) {
	return x => args.reduceRight((acc, fn) => fn(acc), x);
}

function composeLeft(...args) {
	return x => args.reduce((acc, fn) => fn(acc), x);
}

let map = curry((fn, x) => x.map(fn));
let filter = curry((fn, x) => x.filter(fn));
let filterNot = curry((fn, x) => x.filter(y => !fn(y)));
let reduce = curry((fn, y, x) => x.reduce(fn, y));

let memoizeAndCurry = compose(curry, memoize);

function curry(fn, args = []) {
	return (...a) => {
		let x = args.concat(...a);
		return x.length >= fn.length ?
			fn(...x) :
			curry(fn, x);
	}
}

function curryRight(fn, args = []) {
	return (...a) => {
		let x = a.concat(...args);
		return x.length >= fn.length ?
			fn(...x) :
			curryRight(fn, x);
	}
}

function memoize(fn) {
	let cache = new Map();
	let memo = (...a) => {
		let key = a.reduce((hash, val) =>
			hash += val === Object(val) ?
				JSON.stringify(val) :
				val, '');
		if (!cache.has(key)) cache.set(key, fn(...a));
		return cache.get(key);
	}
	return Object.defineProperty(memo, 'length', { value: fn.length });
}
