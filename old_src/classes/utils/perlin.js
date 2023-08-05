var mask = 0xff;
var size = mask + 1;
var values = new Uint8Array(size * 2);
for (var i = 0; i < size; i++) {
    values[i] = values[size + i] = 0 | (Math.random() * 0xff);
}

var lerp = function (t, a, b) {
    return a + t * (b - a);
};
var fade = function (t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
};

var grad2d = function (hash, x, y) {
    var u = (hash & 2) === 0 ? x : -x;
    var v = (hash & 1) === 0 ? y : -y;
    return u + v;
};

export const noise2d = function (x, y) {
    var intX = (0 | x) & mask;
    var intY = (0 | y) & mask;
    var fracX = x - (0 | x);
    var fracY = y - (0 | y);
    var r1 = values[intX] + intY;
    var r2 = values[intX + 1] + intY;
    var t1 = fade(fracX);
    var t2 = fade(fracY);

    var a1 = grad2d(values[r1], fracX, fracY);
    var b1 = grad2d(values[r2], fracX - 1, fracY);
    var a2 = grad2d(values[r1 + 1], fracX, fracY - 1);
    var b2 = grad2d(values[r2 + 1], fracX - 1, fracY - 1);
    return lerp(t2, lerp(t1, a1, b1), lerp(t1, a2, b2));
};
