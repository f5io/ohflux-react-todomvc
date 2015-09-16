import {
	argsToKV, kvToObject, undefinedToMirror
} from './utilities';
import { compose, map, reduce } from 'fnutil/utils';

let createConstants = (...args) => compose(
  Object.freeze,
  reduce(kvToObject, {}),
  map(undefinedToMirror),
  argsToKV
)(args);

export default createConstants;
