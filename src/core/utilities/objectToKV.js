export default function objectToKV(obj) {
	return Object.keys(obj).map(key => [key, obj[key]]);
}