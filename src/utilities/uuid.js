function s4() {
  return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
}

export default function uuid() {
    let p4 = '4' + s4().slice(-3);
    let p5 = ((parseInt(s4().slice(0, 1), 16) & 3) | 8).toString(16) + s4().slice(-3);
    return `${s4()}${s4()}-${s4()}-${p4}-${p5}-${s4()}${s4()}${s4()}`;
}