import { inherit, isObject, isFunction, toSentenceCase } from './utilities';
import { isAction, actionName } from './utilities/symbols';
import { curry } from 'fnutil/core';
import { observable } from 'fnutil';
import {
  compose, map,
  filter, filterSplit,
  combine, uniq
} from 'fnutil/utils';

const defaults = {
	reduce: x => x,
	asyncResult: false
};
const defaultAsyncHandlers = [ 'completed', 'failed' ];

const id = x => x;

let head = x => x[0];

let toArray = x => Array.isArray(x) ? x : [ x ];

let concat = curry((value, onto) => onto.concat(value));

let updateState = curry((current, next) => ({ ...current, ...next }));

let logThrough = val => x => {
  console.group(val);
  console.log(x);
  console.groupEnd(val);
  return x;
}

// getOptions :: String -> Function -> [Object | Function] -> Object
let getOptions = (name) => compose(
  (opts) => ({ ...opts, [actionName]: name }),
  updateState(defaults),
  head,
  combine,
  filterSplit(
    compose(map(reduce => ({ reduce })), filter(isFunction)),
    filter(isObject)
  ),
  toArray
);

// reducePoolToStream :: Array(2) -> Array(3)
let reducePoolToStream = ([ options, pool ]) => [ options.reduce(pool), pool, options ];

// createActionHandler :: Array(3) -> Array(3)
let createActionHandler = ([ stream, pool, options ]) => [ v => pool.plug(v), stream, options ];

// inheritStreamProto :: Array(3) -> Array(2)
let inheritStreamProto = ([ action, stream, options ]) => [ inherit(stream, action), options ];

// decorateAction :: Array(2) -> Array(2)
let decorateAction = ([ action, options ]) =>
  [ Object.assign(action, {
    [isAction]: true,
    [actionName]: options[actionName],
    listen: f => action.onValue(f),
    listenAndPromise: f => {
      if (!options.asyncResult)
        throw new Error('Cannot `listenAndPromise` on a synchronous action!');
      action.mapPromise(f)
        .onValue(action.completed)
        .onError(action.failed);
    }
  }), options ];

// handleAsyncAction :: Array(2) -> Object
let handleAsyncAction = ([ action, options ]) =>
  !options.asyncResult ? action : Object.assign(action, {
    ...getChildActions(options[actionName])(options.children || [])
  });

// getChildActions :: String -> Array -> Object
let getChildActions = (name) => compose(
  reduceChildrenIntoActionsObject(name),
  uniq,
  concat(defaultAsyncHandlers)
);

// reduceChildrenIntoActionsObject :: String -> Array -> Object
let reduceChildrenIntoActionsObject = name => children => {
  let output = { children };
  let childActions = children.reduce((acc, child) => {
    acc[child] = createAction(`${name}${toSentenceCase(child)}`);
    return acc;
  }, {});
  return { ...output, ...childActions };
}

// createStream :: Object -> Object
let createStream = compose(
  handleAsyncAction,
  decorateAction,
  inheritStreamProto,
  createActionHandler,
  reducePoolToStream,
  filterSplit(id, () => observable.of())
)

// createAction :: (String, Object | Function) => Object
let createAction = (name, opts = defaults) => compose(
  logThrough(`createAction :: ${name} :: ${opts.asyncResult}`),
  createStream,
  getOptions(name)
)(opts);

export default createAction;

// export default function createAction(actionName, opts = defaults) {
// 	opts = isFunction(opts) ? { reduce: opts } : opts;
// 	opts = Object.assign({}, defaults, opts);

// 	let actionPool = observable.of();
// 	let functor = value => actionPool.plug(value);
// 	let Stream = opts.reduce(actionPool);

// 	functor = inherit(Stream, functor);
// 	functor._name = actionName;
// 	functor._isAction = true;
// 	functor._isAsync = opts.asyncResult;

// 	if (functor._isAsync) {
// 		functor.children = [...(opts.children || [])
// 			.reduce((set, val) => set.add(val), new Set(defaultAsyncHandlers))];
// 		functor.children.forEach(child =>
// 			functor[child] = createAction(`${actionName}${toSentenceCase(child)}`));
// 	}

// 	functor.listen = fn => functor.onValue(fn);
// 	functor.listenAndPromise = fn => {
// 		if (!functor._isAsync)
// 			throw new Error('Cannot `listenAndPromise` on a synchronous action!');
// 		functor.mapPromise(fn)
// 			// .flatMap(val => Kefir.fromPromise(fn(val)))
// 			.onValue(functor.completed)
// 			.onError(functor.failed);
// 	}

// 	return functor;
// }
