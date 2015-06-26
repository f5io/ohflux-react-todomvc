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
	return action.map(runHandler.bind(this, listenerKey));
};

export default function createStore(obj) {
	let Store = Object.create(obj);
	Store[contentKey] = Store.type && Store.type() || Immutable.OrderedMap();

	let Actions = Object.keys(Store.actions || {})
		.map(getActionByKey, Store)
		.map(runHandlerAndStore, Store);

	let Stream = Kefir.merge(Actions)
		.skipDuplicates()
		.map(diffAndStore.bind(Store))
		.map(contents => [contents]);

	let Modifier;
	// if (Store.modifier) {
	// 	Modifier = Store.modifier.toProperty(() => 0)
	// 		.sampledBy(Stream)
	// 		.map(runHandler.bind(Store, Store.modifier._name));

	// 	// Stream = Kefir.combine([Stream, Modifier], (a, b) => b)
	// 	// 	.sampledBy(Stream)
	// 	// 	.map(runHandler.bind(Store, Store.modifier._name))
	// 	// 	.skipDuplicates();
	// }

	// Stream = Kefir.combine([Stream, (Modifier || Stream)])
		//.map(([ contents, modified ]) => ({ contents, modified }));

	Store = inherit(Stream, Store);
	return Store;
};
