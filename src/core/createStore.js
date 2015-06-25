import Immutable from 'immutable';
import Kefir from 'kefir';
import { isFunction, toSentenceCase, inherit, flatten } from './utilities';

let contentKey = Symbol('contents');

function runHandler(key, ...args) {
	let flatArgs = flatten(args);
	flatArgs.unshift(this[contentKey]);
	return isFunction(this[key]) && this[key](...flatArgs) || flatArgs[0];
};

function diffAndStore(content) {
	if (!Immutable.is(this[contentKey], content)) {
		this[contentKey] = content;
	}
	return this[contentKey];
};

function getActionByKey(key) {
	let action = this.actions[key];
	let listenerKey = `on${toSentenceCase(key)}`;
	return { action, listenerKey };
};

function runHandlerAndStore({ action, listenerKey }) {
	return action
		.map(runHandler.bind(this, listenerKey))
		.map(diffAndStore.bind(this));
};

export default function createStore(obj) {
	let Store = Object.create(obj);
	Store[contentKey] = Store.type && Store.type() || Immutable.OrderedMap();

	let Actions = Object.keys(Store.actions || {})
		.map(getActionByKey.bind(Store))
		.map(runHandlerAndStore.bind(Store));

	let Stream = Kefir.merge(Actions);

	if (Store.modifier) {
		let Modifier = Store.modifier.toProperty(() => 0);
		Modifier.onValue(() => void 0);

		Stream = Kefir.combine([Stream, Modifier], (a, b) => b)
			.sampledBy(Stream)
			.map(runHandler.bind(Store, Store.modifier._name))
			.skipDuplicates();
	}

	Store = inherit(Stream, Store);
	return Store;
};
