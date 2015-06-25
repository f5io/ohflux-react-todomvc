import { flatten } from './utilities';

export default function createConstants(...args) {
	return flatten(args)
		.reduce((acc, key) => (acc[key] = key) && acc, {});
};