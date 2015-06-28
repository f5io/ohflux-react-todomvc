import Immutable from 'immutable';
import Kefir from 'kefir';
import { isFunction, toSentenceCase, inherit, flatten } from './utilities';

function actionsToStreams(actions = {}) {
	return Object.keys(actions).map(key => actions[key]);
}

function mutateOrPassthrough([context, key, content, ...rest]) {
	let handler = context[key];
	return isFunction(handler) && [content, handler(content, ...rest)] || [content, content];
}

function filterOrPassthrough([context, key, content, ...rest]) {
	let handler = context[key];
	return isFunction(handler) && [content, [handler(content, ...rest), ...rest]] || [content, [content, ...rest]];
}

function diff([currentState, nextState]) {
	return !Immutable.is(currentState, nextState);
}

export default function createStore(obj) {
	let Store = Object.create(obj);
	let Content = Store.type && Store.type() || Immutable.OrderedMap();
	Store.getInitialState = () => Kefir.constant([Content, [ Content, undefined ]]);

	let ContentPool = Kefir.pool();
	ContentPool.plug(Kefir.constant(Content));

	let Actions = actionsToStreams(Store.actions)
		.map(action => Kefir.combine([
			Kefir.constant(Store),
			Kefir.constant(`on${toSentenceCase(action._name)}`),
			action
		], [ContentPool.sampledBy(action)], (a, b, c, d) => [a, b, d, c]));

	let Mutate = Kefir.merge(Actions).map(mutateOrPassthrough)
		.filter(diff)
		.onValue(([currentState, nextState]) =>
			ContentPool.plug(Kefir.constant(nextState))
		);

	let Modifier = ContentPool;
	if (Store.filterAction) {
		let Prop = Store.filterAction.toProperty(() => void 0);
		Modifier = Kefir.combine([
			Kefir.constant(Store),
			Kefir.constant(Store.filterAction._name),
			ContentPool,
			Prop
		]).map(filterOrPassthrough);
	}
	
	let Stream = Modifier.concat(Mutate)
	Store = inherit(Stream, Store);
	return Store;
};
