import Immutable from 'immutable';
import Kefir from 'kefir';
import { isFunction, toSentenceCase, inherit, flatten } from './utilities';

let contentKey = Symbol('contents');

function actionsToStreams(actions = {}) {
	return Object.keys(actions).map(key => actions[key]);
}

function mutateOrPassthrough([context, actionName, content, ...rest]) {
	let handler = context[`on${toSentenceCase(actionName)}`];
	return isFunction(handler) && [content, handler(content, ...rest)] || [content, content];
}

function diff([currentState, nextState]) {
	return !Immutable.is(currentState, nextState);
}

export default function createStore(obj) {
	let Store = Object.create(obj);
	let Content = Store.type && Store.type() || Immutable.OrderedMap();

	let ContentPool = Kefir.pool();
	ContentPool.plug(Kefir.constant(Content));

	let Actions = actionsToStreams(Store.actions)
		.map(action => Kefir.combine([
			Kefir.constant(Store),
			Kefir.constant(action._name),
			action
		], [ContentPool.sampledBy(action)], (a, b, c, d) => [a, b, d, c]));

	let Mutation = Kefir.merge(Actions)
		.map(mutateOrPassthrough)
		.filter(diff)
		.map(([ currentState, nextState ]) => {
			ContentPool.plug(Kefir.constant(nextState));
			return nextState;
		})
		.log('mutation');
		//.toProperty()
		//.log('stream')
		// .merge(ContentPool)
		// .log()
		// //.map(([ currentState, nextState ]) => ContentPool.plug(Kefir.constant(nextState)))

	ContentPool.onValue(val => console.log(val));

	// Stream = Stream.combine()
	// 	.log('stream');




// 	window.ContentStream = ContentStream;

// <<<<<<< HEAD
// 	let Stream = Kefir.merge(Actions)
// 		.skipDuplicates()
// 		.map(diffAndStore.bind(Store))
// 		.map(contents => [contents]);

// 	let Modifier;
// 	// if (Store.modifier) {
// 	// 	Modifier = Store.modifier.toProperty(() => 0)
// 	// 		.sampledBy(Stream)
// 	// 		.map(runHandler.bind(Store, Store.modifier._name));

// 	// 	// Stream = Kefir.combine([Stream, Modifier], (a, b) => b)
// 	// 	// 	.sampledBy(Stream)
// 	// 	// 	.map(runHandler.bind(Store, Store.modifier._name))
// 	// 	// 	.skipDuplicates();
// 	// }

// 	// Stream = Kefir.combine([Stream, (Modifier || Stream)])
// 		//.map(([ contents, modified ]) => ({ contents, modified }));
// =======
// 	let Actions = actionsToStreams(Store.actions)
// 		.map(action => Kefir.combine([
// 			Kefir.constant(Store),
// 			Kefir.constant(action._name),
// 			action.flatMap(() => ContentStream.sampledBy(action)),
// 			action
// 		]).log());

// 	let Stream = Kefir.merge(Actions).log('Actions')
// 		.map(mutateOrPassthrough)
// 		.filter(diff);

// 	Stream.map(([ currentState, nextState ]) => {
// 			return currentState.merge(nextState);
// 		})
// 		.log('merged')
// 		// .withHandler((emitter, { value }) => {
// 		// 	ContentStream._emit(value);
// 		// 	return value;
// 		// })
// 		// .skipDuplicates()
// 		.map(store => store.toJS())
// 		.log('store');
// >>>>>>> emitter

// 	Store = inherit(Stream, Store);
// 	return Store;

// 	// let Actions = Object.keys(Store.actions || {})
// 	// 	.map(getActionByKey, Store)
// 	// 	.map(runHandlerAndStore, Store);

// 	// let Stream = Kefir.merge(Actions)
// 	// 	.map(diffAndStore.bind(Store));

// 	// if (Store.modifier) {
// 	// 	let Modifier = Store.modifier.toProperty(() => 0);
// 	// 	Modifier.onValue(() => void 0);

// 	// 	Stream = Kefir.combine([Stream, Modifier], (a, b) => b)
// 	// 		.sampledBy(Stream)
// 	// 		.map(runHandler.bind(Store, Store.modifier._name))
// 	// 		.skipDuplicates();
// 	// }

// 	// Store = inherit(Stream, Store);
// 	// return Store;
};
