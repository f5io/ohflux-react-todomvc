export default function nullToUndefined([k, v]) {
	if (!v) v = undefined;
	return [k, v];
}
