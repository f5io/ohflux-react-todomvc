import Immutable from 'immutable';
import Kefir from 'kefir';
import { isFunction, toSentenceCase, inherit } from './utilities';

export default function createStore(obj) {
	var store = Object.create(obj);
	var contentSymbol = Symbol('contents');
	store[contentSymbol] = Immutable.OrderedMap();
	let listenables = [];
	if (store.listenables) {
		Object.keys(store.listenables).forEach(function(key) {
			let listenerKey = `on${toSentenceCase(key)}`;
			let action = store.listenables[key];
			let content = action.flatMap(() => Kefir.constant(store[contentSymbol]));
			let changes = Kefir.zip([content, action])
				.map(([content, [...args]]) => isFunction(store[listenerKey]) && store[listenerKey](content, ...args) || content)
				.map(content => (store[contentSymbol] = content) && store[contentSymbol]);
			listenables.push(changes);
		});
	}
	let stream = Kefir.merge(listenables);
	store = inherit(stream, store);
	return store;
};
