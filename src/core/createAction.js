import Kefir from 'kefir';
import { inherit } from './utilities';

export default function createAction(actionName, transducer) {
	transducer = transducer || (x => x);
	let Pool = Kefir.pool();
	let functor = (value) => {
		console.log(value);
		Pool.plug(Kefir.constant(value))
	};
	let Stream = transducer(Pool);
	functor = inherit(Stream, functor);
	functor._name = name;
	return functor;
}