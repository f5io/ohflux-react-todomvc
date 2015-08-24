import React from 'react';
import { App } from './components';

React.render(<App/>, document.querySelector('div[app]'));

function curry(target, key, descriptor) {
  return {
    ...descriptor,
    value: curryFn(descriptor.value)
  }
}

function curryRight(target, key, descriptor) {
  return {
    ...descriptor,
    value: curryRightFn(descriptor.value)
  }
}

function curryFn(fn, args = []) {
	return (...a) => {
		let x = args.concat(a);
		return x.length >= fn.length ?
			fn(...x) :
			curryFn(fn, x);
	}
}

function curryRightFn(fn, args = []) {
	return (...a) => {
		let x = a.concat(args);
		return x.length >= fn.length ?
			fn(...x.slice(-fn.length)) :
			curryRightFn(fn, x);
	}
}

let _ = {
  @curry
  map(fn, x) {
    return x.map(fn);
  },
  @curryRight
  filter(fn, x) {
    return x.filter(fn);
  }
}
