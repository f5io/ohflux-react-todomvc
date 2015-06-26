import Kefir from 'kefir';
import { inherit } from '../utilities';

export default function actionFactory(eventStream) {
	return function(actionName) {
		let Pool = Kefir.pool();
		let functor = (value) => Pool.plug(Kefir.constant(value));
		functor = inherit(Pool, functor);
		functor._name = actionName;
		return functor;
	}
}
