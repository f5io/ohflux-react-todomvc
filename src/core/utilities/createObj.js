export default function createObj(proto) {
	var F = new Function();
	F.prototype = proto;
	return new F();
}