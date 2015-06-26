import Kefir from 'kefir';
import { inherit } from '../utilities';

export default function actionFactory(eventStream) {
	return function(actionName) {
		let Emitter;
		let Stream = Kefir.stream(emitter => Emitter = emitter);
		let functor = (value) => Emitter.emit(value);
		functor = inherit(Stream, functor);
		functor._name = actionName;
		return functor;
	}
}