import Immutable from 'immutable';
import Kefir from 'kefir';

export default function createStore(proto) {
	var store = Object.create(proto);
	var contentSymbol = Symbol('contents');
	store[contentSymbol] = Immutable.OrderedMap();
	if (store.listenables) {
		Object.keys(store.listenables).forEach(function(key) {
			let action = store.listenables[key];
			let content = action.map(function() {
				return store[contentSymbol];
			});
			let changes = Kefir.zip([content, action]);
			changes.onValue(([content, [...args]]) => console.log(args, content));
		}, store);
	}
	return store;
};