import { isFunction, isObject, toSentenceCase, inherit } from './utilities';
import { actionName, isAction } from './utilities/symbols';

import { compose, flatten, filter, filterNot, filterSplit, map, combine as combineArr, reduce } from 'fnutil/utils';
import { curry } from 'fnutil/core';
import { of, merge, combine } from 'fnutil/observable';

let noop = () => void 0;

let updateState = ([ current, next ]) => ({ ...current, ...next });

let createPrototype = ::Object.create;

let isActionObject = action => action[isAction];

let toArray = x => Array.isArray(x) ? x : [ x ];

let logThrough = val => x => {
  console.group(val);
  console.log(x);
  console.groupEnd(val);
  return x;
}

let getInitialState = store => {
  let initialState = (store.getInitialState || noop)();
  if (initialState === void 0) throw new Error('Please supply a `getInitialState` method');
  return [ store, initialState ];
}
let getStateStream = ([ store, state ]) => [ of(state), store ];
let getStoreActions = ([ pool, store ]) => [ pool, store, getActions(store.actions) ];

let actionsToStreams = ([ pool, store, actions ]) => {
  let streams = compose(
    logThrough('actionsToStreams :: streams'),
    map(action => combine([
      of(`on${toSentenceCase(action[actionName])}`).sampledBy(action),
      action,
      pool.sampledBy(action)
    ], ([handler, values, state]) => store[handler](state, values))),
    logThrough('actionsToStreams :: has handler on store'),
    filter(action => isFunction(store[`on${toSentenceCase(action[actionName])}`])),
    logThrough('actionsToStreams :: actions')
  )(actions);
  return [ pool, store, streams ];
};

let mergeStreams = ([ pool, store, streams ]) => [ pool, store, merge(streams) ];
let combineStreams = ([ pool, store, streams ]) => [ pool, store, combine([
  pool.sampledBy(streams),
  streams
], updateState) ];

let getStoreReducers = ([ pool, store, combined ]) => [ pool, store, combined, getReducers(store.reducers || (x => x)) ];
let combineWithReducers = ([ pool, store, combined, reducers ]) => {
  let reduced = reducers.reduce((stream, reducer) => stream.map(reducer), combined);
  return [ pool, store, combined, reduced ];
};

let plugOnValue = ([ pool, store, combined, reduced ]) => {
  combine([ combined, reduced ], updateState).map(state => pool.plug(state));
  return [ pool, store ];
};

let inheritStream = ([ pool, store ]) => inherit(pool, store);

let getReducers = compose(
  filter(isFunction),
  combineArr,
  filterSplit(
    compose(
      flatten,
      map(o => Object.keys(o).map(key => o[key])),
      filter(isObject)
    ),
    compose(
      filter(isFunction)
    )
  ),
  flatten,
  toArray,
);

let getChildActions = compose(
  combineArr,
  logThrough('getChildActions :: map children'),
  ([ action, children ]) => [ action, children.map(child => action[child]) ],
  logThrough('getChildActions :: with children'),
  action => [ action, (action.children || []) ],
  logThrough('getChildActions :: action')
);


let getActions = compose(
  logThrough('getActions :: actions with child actions'),
  combineArr,
  map(getChildActions),
  logThrough('getActions :: after filter split'),
  combineArr,
  filterSplit(
    filter(isActionObject),
    compose(
      flatten,
      logThrough('getActions :: map object keys to value'),
      map(o => Object.keys(o).map(key => o[key])),
      logThrough('getActions :: is not action object but is object'),
      filter(isObject),
      logThrough('getActions :: is not action object'),
      filterNot(isActionObject)
    )
  ),
  logThrough('getActions :: flatten'),
  flatten,
  logThrough('getActions :: toArray'),
  toArray,
);

let createStore = compose(
  logThrough('inheritStream'),
  inheritStream,
  logThrough('plugOnValue'),
  plugOnValue,
  logThrough('combineWithReducers'),
  combineWithReducers,
  logThrough('getStoreReducers'),
  getStoreReducers,
  logThrough('combineStreams'),
  combineStreams,
  logThrough('mergeStreams'),
  mergeStreams,
  logThrough('actionsToStreams'),
  actionsToStreams,
  logThrough('storeActions'),
  getStoreActions,
  logThrough('stateStream'),
  getStateStream,
  logThrough('state'),
  getInitialState,
  logThrough('prototype'),
  createPrototype
);

export default createStore;

// export default function createStore(obj) {
// 	let Store = Object.create(obj);

// 	let initialState = (Store.getInitialState || noop)();
// 	if (initialState === void 0) {
// 		throw new Error('Please supply a `getInitialState` method');
// 	}

//   let statePool = of(initialState);
// 	let actions = Array.isArray(Store.actions) ? flatten(Store.actions) : [Store.actions];

// 	let actionObjects = actions
// 		.filter(a => !a._isAction)
// 		.filter(o => isObject(o))
// 		.map(o => Object.keys(o).map(key => o[key]));

// 	let actualActions = actions.filter(a => a._isAction);

// 	let combinedActions = flatten(actionObjects)
// 		.concat(actualActions);

// 	actions = flatten(combinedActions.map(action => {
// 		let childActions = action.children || [];
// 		return [ action ].concat(childActions.map(child => action[child]));
// 	}));

// 	let storeActions = actions
// 		.filter(action => isFunction(Store[`on${toSentenceCase(action._name)}`]))
// 		.map(action => combine([
// 			of(`on${toSentenceCase(action._name)}`).sampledBy(action),
// 			action,
//       statePool.sampledBy(action)
// 		], ([handler, values, state]) => {
//       return Store[handler](state, values)
//     }));

// 	let mergedStoreActions = merge(...storeActions);

// 	let combinedStream = combine([
// 		statePool.sampledBy(mergedStoreActions),
// 		mergedStoreActions
// 	], updateState);

// 	let reducers = Store.reducers || (x => x);
// 	reducers = isObject(reducers) ? Object.keys(reducers).map(k => reducers[k]) : reducers;
// 	reducers = Array.isArray(reducers) ? reducers : [reducers];
// 	reducers = reducers.filter(fn => isFunction(fn));

// 	let combinedStreamWithReducers = reducers
// 		.reduce((stream, reducer) => stream.map(reducer), combinedStream);

// 	let reducedStream = combine([
// 		combinedStream,
// 		combinedStreamWithReducers
// 	], updateState)
// 		.onValue(state => statePool.plug(state));

// 	Store = inherit(statePool, Store);
// 	return Store;
// };
