// The MIT License (MIT)
//
// Copyright (c) 2012-2013 Mikola Lysenko
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.


export const GreedyMesh = (function () {
  //Cache buffer internally
  var mask = new Int32Array(4096);

  return function (volume, dims) {
    function f(i, j, k) {
      return volume[i + dims[0] * (j + dims[1] * k)];
    }
    //Sweep over 3-axes
    var vertices = [], faces = [];
    for (var d = 0; d < 3; ++d) {
      var i, j, k, l, w, h
        , u = (d + 1) % 3
        , v = (d + 2) % 3
        , x = [0, 0, 0]
        , q = [0, 0, 0];
      if (mask.length < dims[u] * dims[v]) {
        mask = new Int32Array(dims[u] * dims[v]);
      }
      q[d] = 1;
      for (x[d] = -1; x[d] < dims[d];) {
        //Compute mask
        var n = 0;
        for (x[v] = 0; x[v] < dims[v]; ++x[v])
          for (x[u] = 0; x[u] < dims[u]; ++x[u], ++n) {
            var a = (0 <= x[d] ? f(x[0], x[1], x[2]) : 0)
              , b = (x[d] < dims[d] - 1 ? f(x[0] + q[0], x[1] + q[1], x[2] + q[2]) : 0);
            if ((!!a) === (!!b)) {
              mask[n] = 0;
            } else if (!!a) {
              mask[n] = a;
            } else {
              mask[n] = -b;
            }
          }
        //Increment x[d]
        ++x[d];
        //Generate mesh for mask using lexicographic ordering
        n = 0;
        for (j = 0; j < dims[v]; ++j)
          for (i = 0; i < dims[u];) {
            var c = mask[n];
            if (!!c) {
              //Compute width
              for (w = 1; c === mask[n + w] && i + w < dims[u]; ++w) {
              }
              //Compute height (this is slightly awkward
              var done = false;
              for (h = 1; j + h < dims[v]; ++h) {
                for (k = 0; k < w; ++k) {
                  if (c !== mask[n + k + h * dims[u]]) {
                    done = true;
                    break;
                  }
                }
                if (done) {
                  break;
                }
              }
              //Add quad
              x[u] = i; x[v] = j;
              var du = [0, 0, 0]
                , dv = [0, 0, 0];
              if (c > 0) {
                dv[v] = h;
                du[u] = w;
              } else {
                c = -c;
                du[v] = h;
                dv[u] = w;
              }
              var vertex_count = vertices.length;
              vertices.push([x[0], x[1], x[2]]);
              vertices.push([x[0] + du[0], x[1] + du[1], x[2] + du[2]]);
              vertices.push([x[0] + du[0] + dv[0], x[1] + du[1] + dv[1], x[2] + du[2] + dv[2]]);
              vertices.push([x[0] + dv[0], x[1] + dv[1], x[2] + dv[2]]);
              faces.push([vertex_count, vertex_count + 1, vertex_count + 2, vertex_count + 3, c]);

              //Zero-out mask
              for (l = 0; l < h; ++l)
                for (k = 0; k < w; ++k) {
                  mask[n + k + l * dims[u]] = 0;
                }
              //Increment counters and continue
              i += w; n += w;
            } else {
              ++i; ++n;
            }
          }
      }
    }
    return { vertices: vertices, faces: faces };
  }
})();
