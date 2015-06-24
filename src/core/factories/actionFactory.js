import Kefir from 'kefir';
import { createObj, isFunction } from '../utilities';

export default function actionFactory(eventStream) {
	return function(actionName) {
		let functor = (...args) => eventStream.emit(actionName, args);
		let stream = Kefir.fromEvents(eventStream, actionName);
		let proto = createObj(stream.constructor.prototype);
		for (let key in proto) {
			functor[key] = isFunction(proto[key]) ? proto[key].bind(stream) : proto[key];
		}
		return functor;
	}
}