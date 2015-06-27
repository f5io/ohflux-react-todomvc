import { isObject } from './';

export default function notObject(obj) {
	return !isObject(obj);
}