import Kefir from 'kefir';
import { isFunction, isObject, toSentenceCase, inherit, flatten } from './utilities';

let noop = () => void 0;

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

	let combinedActions = flatten(actionObjects)
		.concat(actualActions);

	actions = flatten(combinedActions.map(action => {
		let childActions = action.children || [];
		return [ action ].concat(childActions.map(child => action[child]));
	}));

	let storeActions = actions
		.filter(action => isFunction(Store[`on${toSentenceCase(action._name)}`]))
		.map(action => Kefir.combine([
			Kefir.constant(Store[`on${toSentenceCase(action._name)}`]),
			action
		], [
			stateProp.sampledBy(action)
		], (handler, values, state) => handler(state, values)));

	let mergedStoreActions = Kefir.merge(storeActions);

	let combinedStream = Kefir.combine([
		stateProp.sampledBy(mergedStoreActions),
		mergedStoreActions
	], (state, nextState) => Object.assign({}, state, nextState));

	let reducers = Store.reducers || (x => x);
	reducers = isObject(reducers) ? Object.keys(reducers).map(k => reducers[k]) : reducers;
	reducers = Array.isArray(reducers) ? reducers : [reducers];
	reducers = reducers.filter(fn => isFunction(fn));

	let combinedStreamWithReducers = reducers
		.reduce((stream, reducer) => stream.map(reducer), combinedStream);

	let reducedStream = Kefir.combine([
		combinedStream,
		combinedStreamWithReducers
	], (state, reducedState) => Object.assign({}, state, reducedState))
		.skipDuplicates()
		.onValue(state => statePool.plug(Kefir.constant(state)));

	Store = inherit(stateProp, Store);
	return Store;
};
