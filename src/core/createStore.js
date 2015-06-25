import Immutable from 'immutable';
import Kefir from 'kefir';
import { isFunction, toSentenceCase, inherit, flatten } from './utilities';

let contentKey = Symbol('contents');
let listenablesKey = Symbol('listenables');
let filtersKey = Symbol('filters');
let streamKey = Symbol('stream');

function storeListenerCombinator(key, ...args) {
	let flatArgs = flatten(args);
	if (key.startsWith('on')) {
		flatArgs.unshift(this[contentKey]);
	}
	console.log(key, flatArgs);
	return isFunction(this[key]) && this[key](...flatArgs) || flatArgs[0];
};

function diffAndStore(content) {
	if (!Immutable.is(this[contentKey], content)) {
		this[contentKey] = content;
	}
	return this[contentKey];
};

export default function createStore(obj) {
	let Store = Object.create(obj);
	Store[contentKey] = Store.type && Store.type() || Immutable.OrderedMap();
	Store[listenablesKey] = Object.keys(Store.actions || {})
		.map(key => {
			let action = Store.actions[key];
			let listenerKey = `on${toSentenceCase(key)}`;
			return { action, listenerKey };
		})
		.map(({ action, listenerKey }) => {
			return action
				.map(storeListenerCombinator.bind(Store, listenerKey))
				.map(diffAndStore.bind(Store));
		});
	let Stream = Kefir.merge(Store[listenablesKey]);
	let Modifiers = (Store.modifiers || []).reduce(function(stream, modifier) {
		console.log(modifier._name);
		return stream.map(storeListenerCombinator.bind(Store, modifier._name));
	}, Stream);
	console.log(Modifiers);
	Store = inherit(Modifiers, Store);
	return Store;
};
