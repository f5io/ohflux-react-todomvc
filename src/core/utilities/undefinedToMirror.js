import { isDefined } from './';

export default function undefinedToMirror([k, v]) {
	if (!isDefined(v)) v = k;
	return [k, v];
}
