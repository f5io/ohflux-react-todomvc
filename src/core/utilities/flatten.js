export default function flatten(arr) {
	return arr.reduce((acc, item) => Array.isArray(item) ?
		acc.concat(flatten(item)) :
		acc.concat(item), []);
};