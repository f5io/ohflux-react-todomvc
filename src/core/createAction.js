import Kefir from 'kefir';
import { inherit } from './utilities';

export default function createAction(actionName, reduce) {
	reduce = reduce || (x => x);
	let actionPool = Kefir.pool();
	let functor = (value) => actionPool.plug(Kefir.constant(value));
	let Stream = reduce(actionPool);
	functor = inherit(Stream, functor);
	functor.listen = fn => actionPool.toProperty().onValue(fn);
	functor._name = actionName;
	functor._isAction = true;
	return functor;
}
