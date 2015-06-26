export default function classSet(obj) {
	return Object.keys(obj).filter(key => obj[key]).join(' ');
}
