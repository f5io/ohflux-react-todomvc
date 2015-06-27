import Immutable from 'immutable';
import Kefir from 'kefir';
import { isFunction, toSentenceCase, inherit, flatten } from './utilities';

let contentKey = Symbol('contents');

function actionsToStreams(actions = {}) {
	return Object.keys(actions).map(key => actions[key]);
}

function mutateOrPassthrough([context, key, content, ...rest]) {
	let handler = context[key];
	return isFunction(handler) && [content, handler(content, ...rest)] || [content, content];
}

function diff([currentState, nextState]) {
	return !Immutable.is(currentState, nextState);
}

export default function createStore(obj) {
	let Store = Object.create(obj);
	let Content = Store.type && Store.type() || Immutable.OrderedMap();

	let ContentPool = Kefir.pool();
	
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
	if (Store.modifier) {
		let Prop = Store.modifier.toProperty(() => void 0);
		Modifier = Kefir.combine([
			Kefir.constant(Store),
			Kefir.constant(Store.modifier._name),
			ContentPool,
			Prop
		]).map(mutateOrPassthrough);
	}

	ContentPool.plug(Kefir.constant(Content));
	
	let Stream = Modifier.concat(Mutate);

	Store = inherit(Stream, Store);
	return Store;
};
