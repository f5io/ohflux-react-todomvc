export default function kvToObjectWithModifier(fn = (k, v) => v) {
	return (obj, [k, v]) => {
		obj = Array.isArray(obj) ? { [obj[0]]: fn(obj[0], obj[1]) } : obj;
		obj[k] = fn(k, v);
    return obj;
	}
}
