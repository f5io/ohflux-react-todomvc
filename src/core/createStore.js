import Immutable from 'immutable';
import Kefir from 'kefir';

export default function createStore(proto) {
	var store = Object.create(proto);
	var contentSymbol = Symbol('contents');
	store[contentSymbol] = Immutable.OrderedMap();
	if (store.listenables) {
		Object.keys(store.listenables).forEach(function(key) {
			let content = store.listenables[key].flatMap(function() {
				return store[contentSymbol];
			}).toProperty(function() {
				return store[contentSymbol];
			});
			let changes = Kefir.zip([store.listenables[key], content]);
			changes.onValue(([action, content]) => console.log(action, content));
		}, store);
	}
	return store;
};