import Kefir from 'kefir';
import { inherit } from '../utilities';

export default function actionFactory(eventStream) {
	return function(actionName) {
		let functor = (...args) => eventStream.emit(actionName, args);
		let stream = Kefir.fromEvents(eventStream, actionName);
		functor = inherit(stream, functor);
		return functor;
	}
}