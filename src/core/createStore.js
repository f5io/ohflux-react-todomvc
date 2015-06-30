import Kefir from 'kefir';
import { isFunction, isObject, toSentenceCase, inherit, flatten } from './utilities';

let noop = () => void 0;

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

	let initialState = (Store.getInitialState || noop)();
	if (initialState === void 0) {
		throw new Error('Please supply a `getInitialState` method');
	}

	let statePool = Kefir.pool();
	statePool.plug(Kefir.constant(initialState));

	let stateProp = statePool.toProperty();

	let actions = Array.isArray(Store.actions) ? flatten(Store.actions) : [Store.actions];

	let actionObjects = actions
		.filter(a => !a._isAction)
		.filter(o => isObject(o))
		.map(o => Object.keys(o).map(key => o[key]));

	let actualActions = actions.filter(a => a._isAction);

	actions = flatten(actionObjects)
		.concat(actualActions);

	// // let mergedActions = Kefir.merge(actions);
	let storeActions = actions
		.filter(action => isFunction(Store[`on${toSentenceCase(action._name)}`]));

	let reduceActions = actions
		.filter(action => isFunction(Store[action._name]));





	let Content = Store.type && Store.type() || {};
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
