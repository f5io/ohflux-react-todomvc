import { createAction } from './';
import {
	argsToKV, kvToObjectWithModifier
} from './utilities';
import { compose, reduce } from 'fnutil/utils';

let createActions = (...args) => compose(
  reduce(kvToObjectWithModifier(createAction), {}),
  argsToKV
)(args);

export default createActions;
