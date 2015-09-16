import { isFunction, isObject, toSentenceCase, inherit, flatten } from './utilities';

import { of, merge, combine } from 'fnutil/observable';

let noop = () => void 0;
let updateState = ([state, nextState]) => Object.assign({}, state, nextState);

export default function createStore(obj) {
	let Store = Object.create(obj);

	let initialState = (Store.getInitialState || noop)();
	if (initialState === void 0) {
		throw new Error('Please supply a `getInitialState` method');
	}

  let statePool = of(initialState);
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
		.map(action => combine([
			of(`on${toSentenceCase(action._name)}`).sampledBy(action),
			action,
      statePool.sampledBy(action)
		], ([handler, values, state]) => {
      return Store[handler](state, values)
    }));

	let mergedStoreActions = merge(...storeActions);

	let combinedStream = combine([
		statePool.sampledBy(mergedStoreActions),
		mergedStoreActions
	], updateState);

	let reducers = Store.reducers || (x => x);
	reducers = isObject(reducers) ? Object.keys(reducers).map(k => reducers[k]) : reducers;
	reducers = Array.isArray(reducers) ? reducers : [reducers];
	reducers = reducers.filter(fn => isFunction(fn));

	let combinedStreamWithReducers = reducers
		.reduce((stream, reducer) => stream.map(reducer), combinedStream);

	let reducedStream = combine([
		combinedStream,
		combinedStreamWithReducers
	], updateState)
		.onValue(state => statePool.plug(state));

	Store = inherit(statePool, Store);
	return Store;
};
