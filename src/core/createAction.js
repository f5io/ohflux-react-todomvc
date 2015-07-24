import Kefir from 'kefir';
import { inherit, isObject, isFunction, toSentenceCase } from './utilities';

const defaults = {
	reduce: x => x,
	asyncResult: false
};
const defaultAsyncHandlers = [ 'completed', 'failed' ];

export default function createAction(actionName, opts = defaults) {
	opts = isFunction(opts) ? { reduce: opts } : opts;
	opts = Object.assign({}, defaults, opts);

	let actionPool = Kefir.pool();
	let functor = value => actionPool.plug(Kefir.constant(value));
	let Stream = opts.reduce(actionPool);
	functor = inherit(Stream, functor);
	functor._name = actionName;
	functor._isAction = true;
	functor._isAsync = opts.asyncResult;

	if (functor._isAsync) {
		functor.children = [...(opts.children || [])
			.reduce((set, val) => set.add(val), new Set(defaultAsyncHandlers))];
		functor.children.forEach(child =>
			functor[child] = createAction(`${actionName}${toSentenceCase(child)}`));
	}

	functor.listen = fn => actionPool.toProperty().onValue(fn);
	functor.listenAndPromise = fn => {
		if (!functor._isAsync)
			throw new Error('Cannot `listenAndPromise` on a synchronous action!');
		actionPool.toProperty()
			.flatMap(val => Kefir.fromPromise(fn(val)))
			.onValue(functor.completed)
			.onError(functor.failed);
	}

	return functor;
}
