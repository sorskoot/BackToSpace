(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __decorateClass = (decorators, target, key, kind) => {
    var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
    for (var i = decorators.length - 1, decorator; i >= 0; i--)
      if (decorator = decorators[i])
        result = (kind ? decorator(target, key, result) : decorator(result)) || result;
    if (kind && result)
      __defProp(target, key, result);
    return result;
  };
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };
  var __accessCheck = (obj, member, msg) => {
    if (!member.has(obj))
      throw TypeError("Cannot " + msg);
  };
  var __privateGet = (obj, member, getter) => {
    __accessCheck(obj, member, "read from private field");
    return getter ? getter.call(obj) : member.get(obj);
  };
  var __privateAdd = (obj, member, value) => {
    if (member.has(obj))
      throw TypeError("Cannot add the same private member more than once");
    member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
  };
  var __privateSet = (obj, member, value, setter) => {
    __accessCheck(obj, member, "write to private field");
    setter ? setter.call(obj, value) : member.set(obj, value);
    return value;
  };
  var __privateMethod = (obj, member, method) => {
    __accessCheck(obj, member, "access private method");
    return method;
  };

  // node_modules/earcut/src/earcut.js
  var require_earcut = __commonJS({
    "node_modules/earcut/src/earcut.js"(exports, module) {
      "use strict";
      module.exports = earcut2;
      module.exports.default = earcut2;
      function earcut2(data, holeIndices, dim) {
        dim = dim || 2;
        var hasHoles = holeIndices && holeIndices.length, outerLen = hasHoles ? holeIndices[0] * dim : data.length, outerNode = linkedList(data, 0, outerLen, dim, true), triangles = [];
        if (!outerNode || outerNode.next === outerNode.prev)
          return triangles;
        var minX, minY, maxX, maxY, x2, y2, invSize;
        if (hasHoles)
          outerNode = eliminateHoles(data, holeIndices, outerNode, dim);
        if (data.length > 80 * dim) {
          minX = maxX = data[0];
          minY = maxY = data[1];
          for (var i = dim; i < outerLen; i += dim) {
            x2 = data[i];
            y2 = data[i + 1];
            if (x2 < minX)
              minX = x2;
            if (y2 < minY)
              minY = y2;
            if (x2 > maxX)
              maxX = x2;
            if (y2 > maxY)
              maxY = y2;
          }
          invSize = Math.max(maxX - minX, maxY - minY);
          invSize = invSize !== 0 ? 32767 / invSize : 0;
        }
        earcutLinked(outerNode, triangles, dim, minX, minY, invSize, 0);
        return triangles;
      }
      function linkedList(data, start, end, dim, clockwise) {
        var i, last;
        if (clockwise === signedArea(data, start, end, dim) > 0) {
          for (i = start; i < end; i += dim)
            last = insertNode(i, data[i], data[i + 1], last);
        } else {
          for (i = end - dim; i >= start; i -= dim)
            last = insertNode(i, data[i], data[i + 1], last);
        }
        if (last && equals7(last, last.next)) {
          removeNode(last);
          last = last.next;
        }
        return last;
      }
      function filterPoints(start, end) {
        if (!start)
          return start;
        if (!end)
          end = start;
        var p2 = start, again;
        do {
          again = false;
          if (!p2.steiner && (equals7(p2, p2.next) || area(p2.prev, p2, p2.next) === 0)) {
            removeNode(p2);
            p2 = end = p2.prev;
            if (p2 === p2.next)
              break;
            again = true;
          } else {
            p2 = p2.next;
          }
        } while (again || p2 !== end);
        return end;
      }
      function earcutLinked(ear, triangles, dim, minX, minY, invSize, pass) {
        if (!ear)
          return;
        if (!pass && invSize)
          indexCurve(ear, minX, minY, invSize);
        var stop = ear, prev, next;
        while (ear.prev !== ear.next) {
          prev = ear.prev;
          next = ear.next;
          if (invSize ? isEarHashed(ear, minX, minY, invSize) : isEar(ear)) {
            triangles.push(prev.i / dim | 0);
            triangles.push(ear.i / dim | 0);
            triangles.push(next.i / dim | 0);
            removeNode(ear);
            ear = next.next;
            stop = next.next;
            continue;
          }
          ear = next;
          if (ear === stop) {
            if (!pass) {
              earcutLinked(filterPoints(ear), triangles, dim, minX, minY, invSize, 1);
            } else if (pass === 1) {
              ear = cureLocalIntersections(filterPoints(ear), triangles, dim);
              earcutLinked(ear, triangles, dim, minX, minY, invSize, 2);
            } else if (pass === 2) {
              splitEarcut(ear, triangles, dim, minX, minY, invSize);
            }
            break;
          }
        }
      }
      function isEar(ear) {
        var a = ear.prev, b2 = ear, c = ear.next;
        if (area(a, b2, c) >= 0)
          return false;
        var ax = a.x, bx = b2.x, cx = c.x, ay = a.y, by = b2.y, cy = c.y;
        var x0 = ax < bx ? ax < cx ? ax : cx : bx < cx ? bx : cx, y0 = ay < by ? ay < cy ? ay : cy : by < cy ? by : cy, x1 = ax > bx ? ax > cx ? ax : cx : bx > cx ? bx : cx, y1 = ay > by ? ay > cy ? ay : cy : by > cy ? by : cy;
        var p2 = c.next;
        while (p2 !== a) {
          if (p2.x >= x0 && p2.x <= x1 && p2.y >= y0 && p2.y <= y1 && pointInTriangle(ax, ay, bx, by, cx, cy, p2.x, p2.y) && area(p2.prev, p2, p2.next) >= 0)
            return false;
          p2 = p2.next;
        }
        return true;
      }
      function isEarHashed(ear, minX, minY, invSize) {
        var a = ear.prev, b2 = ear, c = ear.next;
        if (area(a, b2, c) >= 0)
          return false;
        var ax = a.x, bx = b2.x, cx = c.x, ay = a.y, by = b2.y, cy = c.y;
        var x0 = ax < bx ? ax < cx ? ax : cx : bx < cx ? bx : cx, y0 = ay < by ? ay < cy ? ay : cy : by < cy ? by : cy, x1 = ax > bx ? ax > cx ? ax : cx : bx > cx ? bx : cx, y1 = ay > by ? ay > cy ? ay : cy : by > cy ? by : cy;
        var minZ = zOrder(x0, y0, minX, minY, invSize), maxZ = zOrder(x1, y1, minX, minY, invSize);
        var p2 = ear.prevZ, n = ear.nextZ;
        while (p2 && p2.z >= minZ && n && n.z <= maxZ) {
          if (p2.x >= x0 && p2.x <= x1 && p2.y >= y0 && p2.y <= y1 && p2 !== a && p2 !== c && pointInTriangle(ax, ay, bx, by, cx, cy, p2.x, p2.y) && area(p2.prev, p2, p2.next) >= 0)
            return false;
          p2 = p2.prevZ;
          if (n.x >= x0 && n.x <= x1 && n.y >= y0 && n.y <= y1 && n !== a && n !== c && pointInTriangle(ax, ay, bx, by, cx, cy, n.x, n.y) && area(n.prev, n, n.next) >= 0)
            return false;
          n = n.nextZ;
        }
        while (p2 && p2.z >= minZ) {
          if (p2.x >= x0 && p2.x <= x1 && p2.y >= y0 && p2.y <= y1 && p2 !== a && p2 !== c && pointInTriangle(ax, ay, bx, by, cx, cy, p2.x, p2.y) && area(p2.prev, p2, p2.next) >= 0)
            return false;
          p2 = p2.prevZ;
        }
        while (n && n.z <= maxZ) {
          if (n.x >= x0 && n.x <= x1 && n.y >= y0 && n.y <= y1 && n !== a && n !== c && pointInTriangle(ax, ay, bx, by, cx, cy, n.x, n.y) && area(n.prev, n, n.next) >= 0)
            return false;
          n = n.nextZ;
        }
        return true;
      }
      function cureLocalIntersections(start, triangles, dim) {
        var p2 = start;
        do {
          var a = p2.prev, b2 = p2.next.next;
          if (!equals7(a, b2) && intersects(a, p2, p2.next, b2) && locallyInside(a, b2) && locallyInside(b2, a)) {
            triangles.push(a.i / dim | 0);
            triangles.push(p2.i / dim | 0);
            triangles.push(b2.i / dim | 0);
            removeNode(p2);
            removeNode(p2.next);
            p2 = start = b2;
          }
          p2 = p2.next;
        } while (p2 !== start);
        return filterPoints(p2);
      }
      function splitEarcut(start, triangles, dim, minX, minY, invSize) {
        var a = start;
        do {
          var b2 = a.next.next;
          while (b2 !== a.prev) {
            if (a.i !== b2.i && isValidDiagonal(a, b2)) {
              var c = splitPolygon(a, b2);
              a = filterPoints(a, a.next);
              c = filterPoints(c, c.next);
              earcutLinked(a, triangles, dim, minX, minY, invSize, 0);
              earcutLinked(c, triangles, dim, minX, minY, invSize, 0);
              return;
            }
            b2 = b2.next;
          }
          a = a.next;
        } while (a !== start);
      }
      function eliminateHoles(data, holeIndices, outerNode, dim) {
        var queue = [], i, len5, start, end, list;
        for (i = 0, len5 = holeIndices.length; i < len5; i++) {
          start = holeIndices[i] * dim;
          end = i < len5 - 1 ? holeIndices[i + 1] * dim : data.length;
          list = linkedList(data, start, end, dim, false);
          if (list === list.next)
            list.steiner = true;
          queue.push(getLeftmost(list));
        }
        queue.sort(compareX);
        for (i = 0; i < queue.length; i++) {
          outerNode = eliminateHole(queue[i], outerNode);
        }
        return outerNode;
      }
      function compareX(a, b2) {
        return a.x - b2.x;
      }
      function eliminateHole(hole, outerNode) {
        var bridge = findHoleBridge(hole, outerNode);
        if (!bridge) {
          return outerNode;
        }
        var bridgeReverse = splitPolygon(bridge, hole);
        filterPoints(bridgeReverse, bridgeReverse.next);
        return filterPoints(bridge, bridge.next);
      }
      function findHoleBridge(hole, outerNode) {
        var p2 = outerNode, hx = hole.x, hy = hole.y, qx = -Infinity, m2;
        do {
          if (hy <= p2.y && hy >= p2.next.y && p2.next.y !== p2.y) {
            var x2 = p2.x + (hy - p2.y) * (p2.next.x - p2.x) / (p2.next.y - p2.y);
            if (x2 <= hx && x2 > qx) {
              qx = x2;
              m2 = p2.x < p2.next.x ? p2 : p2.next;
              if (x2 === hx)
                return m2;
            }
          }
          p2 = p2.next;
        } while (p2 !== outerNode);
        if (!m2)
          return null;
        var stop = m2, mx = m2.x, my = m2.y, tanMin = Infinity, tan;
        p2 = m2;
        do {
          if (hx >= p2.x && p2.x >= mx && hx !== p2.x && pointInTriangle(hy < my ? hx : qx, hy, mx, my, hy < my ? qx : hx, hy, p2.x, p2.y)) {
            tan = Math.abs(hy - p2.y) / (hx - p2.x);
            if (locallyInside(p2, hole) && (tan < tanMin || tan === tanMin && (p2.x > m2.x || p2.x === m2.x && sectorContainsSector(m2, p2)))) {
              m2 = p2;
              tanMin = tan;
            }
          }
          p2 = p2.next;
        } while (p2 !== stop);
        return m2;
      }
      function sectorContainsSector(m2, p2) {
        return area(m2.prev, m2, p2.prev) < 0 && area(p2.next, m2, m2.next) < 0;
      }
      function indexCurve(start, minX, minY, invSize) {
        var p2 = start;
        do {
          if (p2.z === 0)
            p2.z = zOrder(p2.x, p2.y, minX, minY, invSize);
          p2.prevZ = p2.prev;
          p2.nextZ = p2.next;
          p2 = p2.next;
        } while (p2 !== start);
        p2.prevZ.nextZ = null;
        p2.prevZ = null;
        sortLinked(p2);
      }
      function sortLinked(list) {
        var i, p2, q2, e, tail, numMerges, pSize, qSize, inSize = 1;
        do {
          p2 = list;
          list = null;
          tail = null;
          numMerges = 0;
          while (p2) {
            numMerges++;
            q2 = p2;
            pSize = 0;
            for (i = 0; i < inSize; i++) {
              pSize++;
              q2 = q2.nextZ;
              if (!q2)
                break;
            }
            qSize = inSize;
            while (pSize > 0 || qSize > 0 && q2) {
              if (pSize !== 0 && (qSize === 0 || !q2 || p2.z <= q2.z)) {
                e = p2;
                p2 = p2.nextZ;
                pSize--;
              } else {
                e = q2;
                q2 = q2.nextZ;
                qSize--;
              }
              if (tail)
                tail.nextZ = e;
              else
                list = e;
              e.prevZ = tail;
              tail = e;
            }
            p2 = q2;
          }
          tail.nextZ = null;
          inSize *= 2;
        } while (numMerges > 1);
        return list;
      }
      function zOrder(x2, y2, minX, minY, invSize) {
        x2 = (x2 - minX) * invSize | 0;
        y2 = (y2 - minY) * invSize | 0;
        x2 = (x2 | x2 << 8) & 16711935;
        x2 = (x2 | x2 << 4) & 252645135;
        x2 = (x2 | x2 << 2) & 858993459;
        x2 = (x2 | x2 << 1) & 1431655765;
        y2 = (y2 | y2 << 8) & 16711935;
        y2 = (y2 | y2 << 4) & 252645135;
        y2 = (y2 | y2 << 2) & 858993459;
        y2 = (y2 | y2 << 1) & 1431655765;
        return x2 | y2 << 1;
      }
      function getLeftmost(start) {
        var p2 = start, leftmost = start;
        do {
          if (p2.x < leftmost.x || p2.x === leftmost.x && p2.y < leftmost.y)
            leftmost = p2;
          p2 = p2.next;
        } while (p2 !== start);
        return leftmost;
      }
      function pointInTriangle(ax, ay, bx, by, cx, cy, px, py) {
        return (cx - px) * (ay - py) >= (ax - px) * (cy - py) && (ax - px) * (by - py) >= (bx - px) * (ay - py) && (bx - px) * (cy - py) >= (cx - px) * (by - py);
      }
      function isValidDiagonal(a, b2) {
        return a.next.i !== b2.i && a.prev.i !== b2.i && !intersectsPolygon(a, b2) && // dones't intersect other edges
        (locallyInside(a, b2) && locallyInside(b2, a) && middleInside(a, b2) && // locally visible
        (area(a.prev, a, b2.prev) || area(a, b2.prev, b2)) || // does not create opposite-facing sectors
        equals7(a, b2) && area(a.prev, a, a.next) > 0 && area(b2.prev, b2, b2.next) > 0);
      }
      function area(p2, q2, r) {
        return (q2.y - p2.y) * (r.x - q2.x) - (q2.x - p2.x) * (r.y - q2.y);
      }
      function equals7(p1, p2) {
        return p1.x === p2.x && p1.y === p2.y;
      }
      function intersects(p1, q1, p2, q2) {
        var o1 = sign(area(p1, q1, p2));
        var o2 = sign(area(p1, q1, q2));
        var o3 = sign(area(p2, q2, p1));
        var o4 = sign(area(p2, q2, q1));
        if (o1 !== o2 && o3 !== o4)
          return true;
        if (o1 === 0 && onSegment(p1, p2, q1))
          return true;
        if (o2 === 0 && onSegment(p1, q2, q1))
          return true;
        if (o3 === 0 && onSegment(p2, p1, q2))
          return true;
        if (o4 === 0 && onSegment(p2, q1, q2))
          return true;
        return false;
      }
      function onSegment(p2, q2, r) {
        return q2.x <= Math.max(p2.x, r.x) && q2.x >= Math.min(p2.x, r.x) && q2.y <= Math.max(p2.y, r.y) && q2.y >= Math.min(p2.y, r.y);
      }
      function sign(num) {
        return num > 0 ? 1 : num < 0 ? -1 : 0;
      }
      function intersectsPolygon(a, b2) {
        var p2 = a;
        do {
          if (p2.i !== a.i && p2.next.i !== a.i && p2.i !== b2.i && p2.next.i !== b2.i && intersects(p2, p2.next, a, b2))
            return true;
          p2 = p2.next;
        } while (p2 !== a);
        return false;
      }
      function locallyInside(a, b2) {
        return area(a.prev, a, a.next) < 0 ? area(a, b2, a.next) >= 0 && area(a, a.prev, b2) >= 0 : area(a, b2, a.prev) < 0 || area(a, a.next, b2) < 0;
      }
      function middleInside(a, b2) {
        var p2 = a, inside = false, px = (a.x + b2.x) / 2, py = (a.y + b2.y) / 2;
        do {
          if (p2.y > py !== p2.next.y > py && p2.next.y !== p2.y && px < (p2.next.x - p2.x) * (py - p2.y) / (p2.next.y - p2.y) + p2.x)
            inside = !inside;
          p2 = p2.next;
        } while (p2 !== a);
        return inside;
      }
      function splitPolygon(a, b2) {
        var a2 = new Node(a.i, a.x, a.y), b22 = new Node(b2.i, b2.x, b2.y), an = a.next, bp = b2.prev;
        a.next = b2;
        b2.prev = a;
        a2.next = an;
        an.prev = a2;
        b22.next = a2;
        a2.prev = b22;
        bp.next = b22;
        b22.prev = bp;
        return b22;
      }
      function insertNode(i, x2, y2, last) {
        var p2 = new Node(i, x2, y2);
        if (!last) {
          p2.prev = p2;
          p2.next = p2;
        } else {
          p2.next = last.next;
          p2.prev = last;
          last.next.prev = p2;
          last.next = p2;
        }
        return p2;
      }
      function removeNode(p2) {
        p2.next.prev = p2.prev;
        p2.prev.next = p2.next;
        if (p2.prevZ)
          p2.prevZ.nextZ = p2.nextZ;
        if (p2.nextZ)
          p2.nextZ.prevZ = p2.prevZ;
      }
      function Node(i, x2, y2) {
        this.i = i;
        this.x = x2;
        this.y = y2;
        this.prev = null;
        this.next = null;
        this.z = 0;
        this.prevZ = null;
        this.nextZ = null;
        this.steiner = false;
      }
      earcut2.deviation = function(data, holeIndices, dim, triangles) {
        var hasHoles = holeIndices && holeIndices.length;
        var outerLen = hasHoles ? holeIndices[0] * dim : data.length;
        var polygonArea = Math.abs(signedArea(data, 0, outerLen, dim));
        if (hasHoles) {
          for (var i = 0, len5 = holeIndices.length; i < len5; i++) {
            var start = holeIndices[i] * dim;
            var end = i < len5 - 1 ? holeIndices[i + 1] * dim : data.length;
            polygonArea -= Math.abs(signedArea(data, start, end, dim));
          }
        }
        var trianglesArea = 0;
        for (i = 0; i < triangles.length; i += 3) {
          var a = triangles[i] * dim;
          var b2 = triangles[i + 1] * dim;
          var c = triangles[i + 2] * dim;
          trianglesArea += Math.abs(
            (data[a] - data[c]) * (data[b2 + 1] - data[a + 1]) - (data[a] - data[b2]) * (data[c + 1] - data[a + 1])
          );
        }
        return polygonArea === 0 && trianglesArea === 0 ? 0 : Math.abs((trianglesArea - polygonArea) / polygonArea);
      };
      function signedArea(data, start, end, dim) {
        var sum = 0;
        for (var i = start, j2 = end - dim; i < end; i += dim) {
          sum += (data[j2] - data[i]) * (data[i + 1] + data[j2 + 1]);
          j2 = i;
        }
        return sum;
      }
      earcut2.flatten = function(data) {
        var dim = data[0][0].length, result = { vertices: [], holes: [], dimensions: dim }, holeIndex = 0;
        for (var i = 0; i < data.length; i++) {
          for (var j2 = 0; j2 < data[i].length; j2++) {
            for (var d2 = 0; d2 < dim; d2++)
              result.vertices.push(data[i][j2][d2]);
          }
          if (i > 0) {
            holeIndex += data[i - 1].length;
            result.holes.push(holeIndex);
          }
        }
        return result;
      };
    }
  });

  // node_modules/@heyvr/sdk-ad-wonderland/build/sdk.min.js
  var sdk_min_exports = {};
  __export(sdk_min_exports, {
    HeyVRAd: () => M
  });

  // node_modules/@wonderlandengine/api/dist/index.js
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __decorateClass2 = (decorators, target, key, kind) => {
    for (var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc2(target, key) : target, i = decorators.length - 1, decorator; i >= 0; i--)
      (decorator = decorators[i]) && (result = (kind ? decorator(target, key, result) : decorator(result)) || result);
    return kind && result && __defProp2(target, key, result), result;
  };
  var Type = ((Type2) => (Type2[Type2.Native = 0] = "Native", Type2[Type2.Bool = 1] = "Bool", Type2[Type2.Int = 2] = "Int", Type2[Type2.Float = 3] = "Float", Type2[Type2.String = 4] = "String", Type2[Type2.Enum = 5] = "Enum", Type2[Type2.Object = 6] = "Object", Type2[Type2.Mesh = 7] = "Mesh", Type2[Type2.Texture = 8] = "Texture", Type2[Type2.Material = 9] = "Material", Type2[Type2.Animation = 10] = "Animation", Type2[Type2.Skin = 11] = "Skin", Type2[Type2.Color = 12] = "Color", Type2[Type2.Vector2 = 13] = "Vector2", Type2[Type2.Vector3 = 14] = "Vector3", Type2[Type2.Vector4 = 15] = "Vector4", Type2[Type2.Array = 16] = "Array", Type2[Type2.Record = 17] = "Record", Type2[Type2.ParticleEffect = 18] = "ParticleEffect", Type2[Type2.Count = 19] = "Count", Type2))(Type || {});
  var DefaultPropertyCloner = class {
    clone(type, value) {
      switch (type) {
        case 12:
        case 13:
        case 14:
        case 15:
        case 16:
          return value.slice();
        case 17: {
          if (!value || !value.constructor)
            return value;
          let RecordClass = value.constructor, result = new RecordClass();
          for (let key in RecordClass.Properties) {
            let prop = RecordClass.Properties[key];
            result[key] = this.clone(prop.type, value[key]);
          }
          return result;
        }
        default:
          return value;
      }
    }
  };
  var defaultPropertyCloner = new DefaultPropertyCloner();
  var Property = { bool(defaultValue = false) {
    return { type: 1, default: defaultValue };
  }, int(defaultValue = 0) {
    return { type: 2, default: defaultValue };
  }, float(defaultValue = 0) {
    return { type: 3, default: defaultValue };
  }, string(defaultValue = "") {
    return { type: 4, default: defaultValue };
  }, enum(values, defaultValue) {
    return { type: 5, values, default: defaultValue };
  }, object(opts) {
    return { type: 6, default: null, required: opts?.required ?? false };
  }, mesh(opts) {
    return { type: 7, default: null, required: opts?.required ?? false };
  }, texture(opts) {
    return { type: 8, default: null, required: opts?.required ?? false };
  }, material(opts) {
    return { type: 9, default: null, required: opts?.required ?? false };
  }, animation(opts) {
    return { type: 10, default: null, required: opts?.required ?? false };
  }, skin(opts) {
    return { type: 11, default: null, required: opts?.required ?? false };
  }, particleEffect(opts) {
    return { type: 18, default: null, required: opts?.required ?? false };
  }, color(r = 0, g = 0, b2 = 0, a = 1) {
    return { type: 12, default: [r, g, b2, a] };
  }, vector2(x2 = 0, y2 = 0) {
    return { type: 13, default: [x2, y2] };
  }, vector3(x2 = 0, y2 = 0, z2 = 0) {
    return { type: 14, default: [x2, y2, z2] };
  }, vector4(x2 = 0, y2 = 0, z2 = 0, w = 0) {
    return { type: 15, default: [x2, y2, z2, w] };
  }, record(definition) {
    return { type: 17, record: definition, default: new definition() };
  }, array(element) {
    return { type: 16, element, default: void 0 };
  } };
  function propertyDecorator(data) {
    return function(target, propertyKey) {
      let ctor = target.constructor;
      ctor.Properties = ctor.hasOwnProperty("Properties") ? ctor.Properties : {}, ctor.Properties[propertyKey] = data;
    };
  }
  function enumerable() {
    return function(_2, __, descriptor) {
      descriptor.enumerable = true;
    };
  }
  function nativeProperty() {
    return function(target, propertyKey, descriptor) {
      enumerable()(target, propertyKey, descriptor), propertyDecorator({ type: 0 })(target, propertyKey);
    };
  }
  var property = {};
  for (let name in Property)
    property[name] = (...args) => {
      let functor = Property[name];
      return propertyDecorator(functor(...args));
    };
  function isNumber(value) {
    return value == null ? false : typeof value == "number" || value.constructor === Number;
  }
  function isImageLike(value) {
    return value instanceof HTMLImageElement || value instanceof HTMLVideoElement || value instanceof HTMLCanvasElement;
  }
  var Emitter = class {
    _listeners = [];
    _notifying = false;
    _transactions = [];
    add(listener, opts = {}) {
      let { once = false, id = void 0 } = opts, data = { id, once, callback: listener };
      return this._notifying ? (this._transactions.push({ type: 1, data }), this) : (this._listeners.push(data), this);
    }
    push(...listeners) {
      for (let cb of listeners)
        this.add(cb);
      return this;
    }
    once(listener) {
      return this.add(listener, { once: true });
    }
    remove(listener) {
      if (this._notifying)
        return this._transactions.push({ type: 2, data: listener }), this;
      let listeners = this._listeners;
      for (let i = 0; i < listeners.length; ++i) {
        let target = listeners[i];
        (target.callback === listener || target.id === listener) && listeners.splice(i--, 1);
      }
      return this;
    }
    has(listener) {
      let listeners = this._listeners;
      for (let i = 0; i < listeners.length; ++i) {
        let target = listeners[i];
        if (target.callback === listener || target.id === listener)
          return true;
      }
      return false;
    }
    notify(...data) {
      let listeners = this._listeners;
      this._notifying = true;
      for (let i = 0; i < listeners.length; ++i) {
        let listener = listeners[i];
        listener.once && listeners.splice(i--, 1);
        try {
          listener.callback(...data);
        } catch (e) {
          console.error(e);
        }
      }
      this._notifying = false, this._flushTransactions();
    }
    notifyUnsafe(...data) {
      let listeners = this._listeners;
      for (let i = 0; i < listeners.length; ++i) {
        let listener = listeners[i];
        listener.once && listeners.splice(i--, 1), listener.callback(...data);
      }
      this._flushTransactions();
    }
    promise() {
      return new Promise((res, _2) => {
        this.once((...args) => {
          args.length > 1 ? res(args) : res(args[0]);
        });
      });
    }
    get listenerCount() {
      return this._listeners.length;
    }
    get isEmpty() {
      return this.listenerCount === 0;
    }
    _flushTransactions() {
      let listeners = this._listeners;
      for (let transaction of this._transactions)
        transaction.type === 1 ? listeners.push(transaction.data) : this.remove(transaction.data);
      this._transactions.length = 0;
    }
  };
  var RetainEmitterUndefined = {};
  var RetainEmitter = class extends Emitter {
    _event = RetainEmitterUndefined;
    _reset;
    add(listener, opts) {
      let immediate = opts?.immediate ?? true;
      return this._event !== RetainEmitterUndefined && immediate && listener(...this._event), super.add(listener, opts), this;
    }
    once(listener, immediate) {
      return this.add(listener, { once: true, immediate });
    }
    notify(...data) {
      this._event = data, super.notify(...data);
    }
    notifyUnsafe(...data) {
      this._event = data, super.notifyUnsafe(...data);
    }
    reset() {
      return this._event = RetainEmitterUndefined, this;
    }
    get data() {
      return this.isDataRetained ? this._event : void 0;
    }
    get isDataRetained() {
      return this._event !== RetainEmitterUndefined;
    }
  };
  function createDestroyedProxy(host, type) {
    return new Proxy({}, { get(_2, param) {
      if (param === "isDestroyed")
        return true;
      throw new Error(`Cannot read '${param}' of destroyed '${type.name}' resource from ${host}`);
    }, set(_2, param) {
      throw new Error(`Cannot write '${param}' of destroyed '${type.name}' resource from ${host}`);
    } });
  }
  var Resource = class {
    _index = -1;
    _id = -1;
    _engine;
    constructor(engine, index) {
      this._engine = engine, this._index = index, this._id = index;
    }
    get engine() {
      return this._engine;
    }
    get index() {
      return this._index;
    }
    equals(other) {
      return other ? this._index === other._index : false;
    }
    get isDestroyed() {
      return this._index <= 0;
    }
  };
  var ResourceManager = class {
    _host;
    _cache = [];
    _template;
    _destructor = null;
    _engine;
    constructor(host, Class) {
      this._host = host, this._template = Class, this._engine = host.engine ?? host;
    }
    wrap(index) {
      return index <= 0 ? null : this._cache[index] ?? (this._cache[index] = new this._template(this._host, index));
    }
    get(index) {
      return this._cache[index] ?? null;
    }
    get allocatedCount() {
      return this._cache.length;
    }
    get count() {
      let count = 0;
      for (let res of this._cache)
        res && res.index >= 0 && ++count;
      return count;
    }
    get engine() {
      return this._engine;
    }
    _destroy(instance) {
      let index = instance.index;
      instance._index = -1, instance._id = -1, this._cache[index] = null, this.engine.erasePrototypeOnDestroy && (this._destructor || (this._destructor = createDestroyedProxy(this._host, this._template)), Object.setPrototypeOf(instance, this._destructor));
    }
    _clear() {
      if (this.engine.erasePrototypeOnDestroy) {
        for (let i = 0; i < this._cache.length; ++i) {
          let instance = this._cache[i];
          instance && this._destroy(instance);
        }
        this._cache.length = 0;
      }
    }
  };
  var CBORType = ((CBORType2) => (CBORType2[CBORType2.Array = 0] = "Array", CBORType2[CBORType2.Record = 1] = "Record", CBORType2[CBORType2.Constant = 2] = "Constant", CBORType2[CBORType2.Native = 3] = "Native", CBORType2))(CBORType || {});
  function getType(typeInfo) {
    let majorType = typeInfo >> 5, additionalInformation = typeInfo & 31;
    switch (majorType) {
      case 4:
        return 0;
      case 5:
        return 1;
      case 7:
        return 2;
    }
    return 3;
  }
  function isUndefined(type, length6) {
    return type === 2 && length6 === 23;
  }
  var CBORReader = class {
    dataView;
    data;
    offset;
    tagger = (_2, value) => value;
    dictionary = "object";
    constructor(data) {
      this.dataView = new DataView(data.buffer, data.byteOffset, data.byteLength), this.data = data, this.offset = 0;
    }
    readTypeInfo() {
      return this.readUint8();
    }
    readArrayLength(typeInfo) {
      let majorType = typeInfo >> 5, additionalInformation = typeInfo & 31, length6 = this.readLength(additionalInformation);
      if (length6 < 0 && (majorType < 2 || 6 < majorType))
        throw new Error("CBORError: Invalid length");
      return length6;
    }
    readItem(typeInfo, inputLen = null) {
      let majorType = typeInfo >> 5, additionalInformation = typeInfo & 31, i;
      if (majorType === 7)
        switch (additionalInformation) {
          case 25:
            return this.readFloat16();
          case 26:
            return this.readFloat32();
          case 27:
            return this.readFloat64();
        }
      let length6 = inputLen === null ? this.readLength(additionalInformation) : inputLen;
      if (length6 < 0 && (majorType < 2 || 6 < majorType))
        throw new Error("CBORError: Invalid length");
      switch (majorType) {
        case 0:
          return length6;
        case 1:
          return typeof length6 == "number" ? -1 - length6 : -1n - length6;
        case 2: {
          if (length6 < 0) {
            let elements = [], fullArrayLength = 0;
            for (; (length6 = this.readIndefiniteStringLength(majorType)) >= 0; )
              fullArrayLength += length6, elements.push(this.readArrayBuffer(length6));
            let fullArray = new Uint8Array(fullArrayLength), fullArrayOffset = 0;
            for (i = 0; i < elements.length; ++i)
              fullArray.set(elements[i], fullArrayOffset), fullArrayOffset += elements[i].length;
            return fullArray;
          }
          return this.readArrayBuffer(length6).slice();
        }
        case 3: {
          let utf16data = [];
          if (length6 < 0)
            for (; (length6 = this.readIndefiniteStringLength(majorType)) >= 0; )
              this.appendUtf16Data(utf16data, length6);
          else
            this.appendUtf16Data(utf16data, length6);
          let string = "", DECODE_CHUNK_SIZE = 8192;
          for (i = 0; i < utf16data.length; i += DECODE_CHUNK_SIZE)
            string += String.fromCharCode.apply(null, utf16data.slice(i, i + DECODE_CHUNK_SIZE));
          return string;
        }
        case 4: {
          let retArray;
          if (length6 < 0)
            for (retArray = []; !this.readBreak(); )
              retArray.push(this.decodeItem());
          else
            for (retArray = new Array(length6), i = 0; i < length6; ++i)
              retArray[i] = this.decodeItem();
          return retArray;
        }
        case 5: {
          if (this.dictionary === "map") {
            let retMap = /* @__PURE__ */ new Map();
            for (i = 0; i < length6 || length6 < 0 && !this.readBreak(); ++i) {
              let key = this.decodeItem();
              if (retMap.has(key))
                throw new Error("CBORError: Duplicate key encountered");
              retMap.set(key, this.decodeItem());
            }
            return retMap;
          }
          let retObject = {};
          for (i = 0; i < length6 || length6 < 0 && !this.readBreak(); ++i) {
            let key = this.decodeItem();
            if (Object.prototype.hasOwnProperty.call(retObject, key))
              throw new Error("CBORError: Duplicate key encountered");
            retObject[key] = this.decodeItem();
          }
          return retObject;
        }
        case 6: {
          let value = this.decodeItem(), tag = length6;
          if (value instanceof Uint8Array)
            switch (tag) {
              case 2:
              case 3:
                let num = value.reduce((acc, n) => (acc << 8n) + BigInt(n), 0n);
                return tag == 3 && (num = -1n - num), num;
              case 64:
                return value;
              case 72:
                return new Int8Array(value.buffer);
              case 69:
                return new Uint16Array(value.buffer);
              case 77:
                return new Int16Array(value.buffer);
              case 70:
                return new Uint32Array(value.buffer);
              case 78:
                return new Int32Array(value.buffer);
              case 71:
                return new BigUint64Array(value.buffer);
              case 79:
                return new BigInt64Array(value.buffer);
              case 85:
                return new Float32Array(value.buffer);
              case 86:
                return new Float64Array(value.buffer);
            }
          return this.tagger(tag, value);
        }
        case 7:
          switch (length6) {
            case 20:
              return false;
            case 21:
              return true;
            case 22:
              return null;
            case 23:
              return;
            default:
              return length6;
          }
      }
    }
    decodeItem() {
      let initialByte = this.readUint8();
      return this.readItem(initialByte);
    }
    readArrayBuffer(length6) {
      return this.commitRead(length6, this.data.subarray(this.offset, this.offset + length6));
    }
    readFloat16() {
      let POW_2_24 = 5960464477539063e-23, tempArrayBuffer = new ArrayBuffer(4), tempDataView = new DataView(tempArrayBuffer), value = this.readUint16(), sign = value & 32768, exponent = value & 31744, fraction = value & 1023;
      if (exponent === 31744)
        exponent = 261120;
      else if (exponent !== 0)
        exponent += 114688;
      else if (fraction !== 0)
        return (sign ? -1 : 1) * fraction * POW_2_24;
      return tempDataView.setUint32(0, sign << 16 | exponent << 13 | fraction << 13), tempDataView.getFloat32(0);
    }
    readFloat32() {
      return this.commitRead(4, this.dataView.getFloat32(this.offset));
    }
    readFloat64() {
      return this.commitRead(8, this.dataView.getFloat64(this.offset));
    }
    readUint8() {
      return this.commitRead(1, this.data[this.offset]);
    }
    readUint16() {
      return this.commitRead(2, this.dataView.getUint16(this.offset));
    }
    readUint32() {
      return this.commitRead(4, this.dataView.getUint32(this.offset));
    }
    readUint64() {
      return this.commitRead(8, this.dataView.getBigUint64(this.offset));
    }
    readBreak() {
      return this.data[this.offset] !== 255 ? false : (this.offset += 1, true);
    }
    readLength(additionalInformation) {
      if (additionalInformation < 24)
        return additionalInformation;
      if (additionalInformation === 24)
        return this.readUint8();
      if (additionalInformation === 25)
        return this.readUint16();
      if (additionalInformation === 26)
        return this.readUint32();
      if (additionalInformation === 27) {
        let integer = this.readUint64();
        return integer <= Number.MAX_SAFE_INTEGER ? Number(integer) : integer;
      }
      if (additionalInformation === 31)
        return -1;
      throw new Error("CBORError: Invalid length encoding");
    }
    readIndefiniteStringLength(majorType) {
      let initialByte = this.readUint8();
      if (initialByte === 255)
        return -1;
      let length6 = this.readLength(initialByte & 31);
      if (length6 < 0 || initialByte >> 5 !== majorType)
        throw new Error("CBORError: Invalid indefinite length element");
      return Number(length6);
    }
    appendUtf16Data(utf16data, length6) {
      for (let i = 0; i < length6; ++i) {
        let value = this.readUint8();
        value & 128 && (value < 224 ? (value = (value & 31) << 6 | this.readUint8() & 63, length6 -= 1) : value < 240 ? (value = (value & 15) << 12 | (this.readUint8() & 63) << 6 | this.readUint8() & 63, length6 -= 2) : (value = (value & 7) << 18 | (this.readUint8() & 63) << 12 | (this.readUint8() & 63) << 6 | this.readUint8() & 63, length6 -= 3)), value < 65536 ? utf16data.push(value) : (value -= 65536, utf16data.push(55296 | value >> 10), utf16data.push(56320 | value & 1023));
      }
    }
    commitRead(length6, value) {
      return this.offset += length6, value;
    }
  };
  function resetComponentProperties(record) {
    let properties = record.constructor.Properties;
    if (properties)
      for (let name in properties) {
        let property2 = properties[name], cloner = property2.cloner ?? defaultPropertyCloner;
        record[name] = cloner.clone(property2.type, property2.default);
      }
  }
  function setupComponentClass(ctor) {
    inheritProperties(ctor);
    for (let name in ctor.Properties) {
      let prop = ctor.Properties[name], record = null;
      switch (prop.type) {
        case 17:
          record = prop.record;
          break;
        case 16:
          record = prop.element?.record;
          break;
        default:
          break;
      }
      record && !record._propertyOrder && setupComponentClass(record);
    }
    _setupDefaults(ctor), _setPropertyOrder(ctor);
  }
  var ComponentPropertyDecoder = class {
    scene;
    offsets;
    constructor(scene, offsets) {
      this.scene = scene, this.offsets = offsets;
    }
    decode(cbor, component) {
      let ctor = component.constructor;
      ctor._propertyOrder || setupComponentClass(ctor);
      let typeInfo = cbor.readTypeInfo();
      if (ctor === BrokenComponent)
        return cbor.readItem(typeInfo);
      if (getType(typeInfo) !== 0)
        return this._error(`${component} parameters not encoded as an array.`), cbor.readItem(typeInfo);
      let paramNames = ctor._propertyOrder, count = cbor.readArrayLength(typeInfo);
      if (count !== paramNames.length)
        return this._error(`${component} has ${count} parameters encoded, but expected ${paramNames.length}`), cbor.readItem(typeInfo, count);
      for (let j2 = 0; j2 < count; ++j2) {
        let name = paramNames[j2], property2 = ctor.Properties[name];
        component[name] = this.decodeProperty(cbor, name, property2);
      }
    }
    decodeProperty(cbor, name, property2) {
      let typeInfo = cbor.readTypeInfo();
      if (property2.type === 17)
        return this.decodeRecordProperty(cbor, name, property2, typeInfo);
      if (property2.type === 16)
        return this.decodeArrayProperty(cbor, name, property2, typeInfo);
      let value = cbor.readItem(typeInfo);
      if (value === void 0)
        return value = (property2.cloner ?? defaultPropertyCloner).clone(property2.type, property2.default), value;
      typeof value == "number" && (value += this.offsets[property2.type]);
      let engine = this.scene.engine;
      switch (property2.type) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 13:
        case 14:
        case 15:
          return value;
        case 6: {
          let wasm = engine.wasm;
          return value ? this.scene.wrap(wasm._wl_object_id(this.scene._index, value)) : null;
        }
        case 7:
          return engine.meshes.wrap(value);
        case 8:
          return engine.textures.wrap(value);
        case 9:
          return engine.materials.wrap(value);
        case 18:
          return engine.particleEffects.wrap(value);
        case 10:
          return this.scene.animations.wrap(value);
        case 11:
          return this.scene.skins.wrap(value);
        case 12: {
          let max3 = (1 << value.BYTES_PER_ELEMENT * 8) - 1;
          return Float32Array.from(value, (f2, _2) => f2 / max3);
        }
      }
    }
    decodeRecordProperty(cbor, name, property2, typeInfo) {
      let cborType = getType(typeInfo);
      if (cborType !== 0 && cborType !== 2)
        return this._error(`Record parameter '${name}' not serialized as an array`), cbor.readItem(typeInfo), null;
      let record = property2.record;
      if (!record)
        return this._error(`Record parameter '${name}' .record is undefined`), cbor.readItem(typeInfo), null;
      record._propertyOrder || setupComponentClass(record);
      let propertyOrder = record._propertyOrder, count = cbor.readArrayLength(typeInfo);
      if (isUndefined(cborType, count))
        return (property2.cloner ?? defaultPropertyCloner).clone(property2.type, property2.default);
      let result = new record();
      if (count !== propertyOrder.length) {
        let propsCount = propertyOrder.length;
        return this._error(`Record parameter ${name} has ${count} sub-parameters encoded, but expected ${propsCount}`), cbor.readItem(typeInfo, count), result;
      }
      let order = record._propertyOrder;
      for (let i = 0; i < order.length; ++i) {
        let key = order[i], prop = record.Properties[key];
        result[key] = this.decodeProperty(cbor, key, prop);
      }
      return result;
    }
    decodeArrayProperty(cbor, name, property2, typeInfo) {
      let log = this.scene.engine.log, cborType = getType(typeInfo);
      if (cborType !== 0 && cborType !== 2)
        return this._error(`Array parameter '${name}' not serialized as an array`), cbor.readItem(typeInfo), [];
      if (!property2.element)
        return this._error(`Array parameter '${name}' .element property is undefined`), cbor.readItem(typeInfo), [];
      let count = cbor.readArrayLength(typeInfo);
      if (isUndefined(cborType, count))
        return [];
      let result = new Array(count);
      for (let i = 0; i < count; ++i)
        result[i] = this.decodeProperty(cbor, name, property2.element);
      return result;
    }
    _error(msg) {
      this.scene.engine.log.error(0, msg);
    }
  };
  var _componentDefaults = /* @__PURE__ */ new Map([[1, false], [2, 0], [3, 0], [4, ""], [5, void 0], [6, null], [7, null], [8, null], [9, null], [10, null], [11, null], [18, null], [12, Float32Array.from([0, 0, 0, 1])], [13, Float32Array.from([0, 0])], [14, Float32Array.from([0, 0, 0])], [15, Float32Array.from([0, 0, 0, 0])], [17, void 0], [16, []]]);
  function _setupDefaults(ctor) {
    for (let name in ctor.Properties) {
      let p2 = ctor.Properties[name];
      if (p2.type === 5)
        p2.values?.length ? (typeof p2.default != "number" && (p2.default = p2.values.indexOf(p2.default)), (p2.default < 0 || p2.default >= p2.values.length) && (p2.default = 0)) : p2.default = void 0;
      else if ((p2.type === 12 || p2.type === 13 || p2.type === 14 || p2.type === 15) && Array.isArray(p2.default))
        p2.default = Float32Array.from(p2.default);
      else if (p2.type === 17 && p2.record)
        p2.default = new p2.record(), resetComponentProperties(p2.default);
      else if (p2.default === void 0) {
        let cloner = p2.cloner ?? defaultPropertyCloner;
        p2.default = cloner.clone(p2.type, _componentDefaults.get(p2.type));
      }
      ctor.prototype[name] = p2.default;
    }
  }
  function _setPropertyOrder(ctor) {
    ctor._propertyOrder = ctor.hasOwnProperty("Properties") ? Object.keys(ctor.Properties).sort() : [];
  }
  function createDestroyedProxy2(type) {
    return new Proxy({}, { get(_2, param) {
      if (param === "isDestroyed")
        return true;
      throw new Error(`Cannot read '${param}' of destroyed ${type}`);
    }, set(_2, param) {
      throw new Error(`Cannot write '${param}' of destroyed ${type}`);
    } });
  }
  var LogTag = ((LogTag2) => (LogTag2[LogTag2.Engine = 0] = "Engine", LogTag2[LogTag2.Scene = 1] = "Scene", LogTag2[LogTag2.Component = 2] = "Component", LogTag2))(LogTag || {});
  var Collider = ((Collider2) => (Collider2[Collider2.Sphere = 0] = "Sphere", Collider2[Collider2.AxisAlignedBox = 1] = "AxisAlignedBox", Collider2[Collider2.Box = 2] = "Box", Collider2))(Collider || {});
  var Alignment = ((Alignment2) => (Alignment2[Alignment2.Left = 0] = "Left", Alignment2[Alignment2.Center = 1] = "Center", Alignment2[Alignment2.Right = 2] = "Right", Alignment2))(Alignment || {});
  var VerticalAlignment = ((VerticalAlignment2) => (VerticalAlignment2[VerticalAlignment2.Line = 0] = "Line", VerticalAlignment2[VerticalAlignment2.Middle = 1] = "Middle", VerticalAlignment2[VerticalAlignment2.Top = 2] = "Top", VerticalAlignment2[VerticalAlignment2.Bottom = 3] = "Bottom", VerticalAlignment2))(VerticalAlignment || {});
  var TextEffect = ((TextEffect2) => (TextEffect2[TextEffect2.None = 0] = "None", TextEffect2[TextEffect2.Outline = 1] = "Outline", TextEffect2[TextEffect2.Shadow = 2] = "Shadow", TextEffect2))(TextEffect || {});
  var TextWrapMode = ((TextWrapMode2) => (TextWrapMode2[TextWrapMode2.None = 0] = "None", TextWrapMode2[TextWrapMode2.Soft = 1] = "Soft", TextWrapMode2[TextWrapMode2.Hard = 2] = "Hard", TextWrapMode2[TextWrapMode2.Clip = 3] = "Clip", TextWrapMode2))(TextWrapMode || {});
  var InputType = ((InputType3) => (InputType3[InputType3.Head = 0] = "Head", InputType3[InputType3.EyeLeft = 1] = "EyeLeft", InputType3[InputType3.EyeRight = 2] = "EyeRight", InputType3[InputType3.ControllerLeft = 3] = "ControllerLeft", InputType3[InputType3.ControllerRight = 4] = "ControllerRight", InputType3[InputType3.RayLeft = 5] = "RayLeft", InputType3[InputType3.RayRight = 6] = "RayRight", InputType3))(InputType || {});
  var ProjectionType = ((ProjectionType2) => (ProjectionType2[ProjectionType2.Perspective = 0] = "Perspective", ProjectionType2[ProjectionType2.Orthographic = 1] = "Orthographic", ProjectionType2))(ProjectionType || {});
  var LightType = ((LightType2) => (LightType2[LightType2.Point = 0] = "Point", LightType2[LightType2.Spot = 1] = "Spot", LightType2[LightType2.Sun = 2] = "Sun", LightType2))(LightType || {});
  var AnimationState = ((AnimationState2) => (AnimationState2[AnimationState2.Playing = 0] = "Playing", AnimationState2[AnimationState2.Paused = 1] = "Paused", AnimationState2[AnimationState2.Stopped = 2] = "Stopped", AnimationState2))(AnimationState || {});
  var RootMotionMode = ((RootMotionMode2) => (RootMotionMode2[RootMotionMode2.None = 0] = "None", RootMotionMode2[RootMotionMode2.ApplyToOwner = 1] = "ApplyToOwner", RootMotionMode2[RootMotionMode2.Script = 2] = "Script", RootMotionMode2))(RootMotionMode || {});
  var ForceMode = ((ForceMode2) => (ForceMode2[ForceMode2.Force = 0] = "Force", ForceMode2[ForceMode2.Impulse = 1] = "Impulse", ForceMode2[ForceMode2.VelocityChange = 2] = "VelocityChange", ForceMode2[ForceMode2.Acceleration = 3] = "Acceleration", ForceMode2))(ForceMode || {});
  var CollisionEventType = ((CollisionEventType2) => (CollisionEventType2[CollisionEventType2.Touch = 0] = "Touch", CollisionEventType2[CollisionEventType2.TouchLost = 1] = "TouchLost", CollisionEventType2[CollisionEventType2.TriggerTouch = 2] = "TriggerTouch", CollisionEventType2[CollisionEventType2.TriggerTouchLost = 3] = "TriggerTouchLost", CollisionEventType2))(CollisionEventType || {});
  var Shape = ((Shape2) => (Shape2[Shape2.None = 0] = "None", Shape2[Shape2.Sphere = 1] = "Sphere", Shape2[Shape2.Capsule = 2] = "Capsule", Shape2[Shape2.Box = 3] = "Box", Shape2[Shape2.Plane = 4] = "Plane", Shape2[Shape2.ConvexMesh = 5] = "ConvexMesh", Shape2[Shape2.TriangleMesh = 6] = "TriangleMesh", Shape2))(Shape || {});
  var MeshAttribute = ((MeshAttribute2) => (MeshAttribute2[MeshAttribute2.Position = 0] = "Position", MeshAttribute2[MeshAttribute2.Tangent = 1] = "Tangent", MeshAttribute2[MeshAttribute2.Normal = 2] = "Normal", MeshAttribute2[MeshAttribute2.TextureCoordinate = 3] = "TextureCoordinate", MeshAttribute2[MeshAttribute2.Color = 4] = "Color", MeshAttribute2[MeshAttribute2.JointId = 5] = "JointId", MeshAttribute2[MeshAttribute2.JointWeight = 6] = "JointWeight", MeshAttribute2[MeshAttribute2.SecondaryTextureCoordinate = 7] = "SecondaryTextureCoordinate", MeshAttribute2))(MeshAttribute || {});
  var DestroyedObjectInstance = createDestroyedProxy2("object");
  var DestroyedComponentInstance = createDestroyedProxy2("component");
  var DestroyedPrefabInstance = createDestroyedProxy2("prefab/scene");
  function isMeshShape(shape) {
    return shape === 5 || shape === 6;
  }
  function isBaseComponentClass(value) {
    return !!value && value.hasOwnProperty("_isBaseComponent") && value._isBaseComponent;
  }
  var SQRT_3 = Math.sqrt(3);
  var _a;
  var Component3 = (_a = class {
    static _pack(scene, id) {
      return scene << 22 | id;
    }
    static _inheritProperties() {
      inheritProperties(this);
    }
    _manager;
    _id;
    _localId;
    _object;
    _scene;
    constructor(scene, manager = -1, id = -1) {
      this._scene = scene, this._manager = manager, this._localId = id, this._id = _a._pack(scene._index, id), this._object = null;
    }
    get scene() {
      return this._scene;
    }
    get engine() {
      return this._scene.engine;
    }
    get type() {
      return this.constructor.TypeName;
    }
    get object() {
      if (!this._object) {
        let objectId = this.engine.wasm._wl_component_get_object(this._manager, this._id);
        this._object = this._scene.wrap(objectId);
      }
      return this._object;
    }
    set active(active) {
      this.engine.wasm._wl_component_setActive(this._manager, this._id, active);
    }
    get active() {
      return this.markedActive && this._scene.isActive;
    }
    get markedActive() {
      return this.engine.wasm._wl_component_isActive(this._manager, this._id) != 0;
    }
    copy(src) {
      let properties = this.constructor.Properties;
      if (!properties)
        return this;
      for (let name in properties) {
        let property2 = properties[name], value = src[name];
        if (value === void 0)
          continue;
        let cloner = property2.cloner ?? defaultPropertyCloner;
        this[name] = cloner.clone(property2.type, value);
      }
      return this;
    }
    destroy() {
      let manager = this._manager;
      manager < 0 || this._id < 0 || this.engine.wasm._wl_component_remove(manager, this._id);
    }
    equals(otherComponent) {
      return otherComponent ? this._manager === otherComponent._manager && this._id === otherComponent._id : false;
    }
    resetProperties() {
      return resetComponentProperties(this), this;
    }
    reset() {
      return this.resetProperties();
    }
    validateProperties() {
      let ctor = this.constructor;
      if (ctor.Properties) {
        for (let name in ctor.Properties)
          if (ctor.Properties[name].required && !this[name])
            throw new Error(`Property '${name}' is required but was not initialized`);
      }
    }
    toString() {
      return this.isDestroyed ? "Component(destroyed)" : `Component('${this.type}', ${this._localId})`;
    }
    get isDestroyed() {
      return this._id < 0;
    }
    _copy(src, offsetsPtr, copyInfoPtr) {
      let wasm = this.engine.wasm, offsets = wasm.HEAPU32, offsetsStart = offsetsPtr >>> 2, copyInfoStart = copyInfoPtr >>> 1, srcRootIndex = wasm.HEAPU16[copyInfoStart], srcRootSize = wasm.HEAPU16[copyInfoStart + 1], dstRootIndex = wasm.HEAPU16[copyInfoStart + 2], destScene = this._scene, ctor = this.constructor;
      for (let name in ctor.Properties) {
        let value = src[name];
        if (value === null) {
          this[name] = null;
          continue;
        }
        let prop = ctor.Properties[name], offset2 = offsets[offsetsStart + prop.type], retargeted = null;
        switch (prop.type) {
          case 6: {
            let index = wasm._wl_object_index(value._id) + offset2, dist3 = index - srcRootIndex;
            dist3 >= 0 && dist3 <= srcRootSize && (index = dstRootIndex + dist3);
            let id = wasm._wl_object_id(destScene._index, index);
            retargeted = destScene.wrap(id);
            break;
          }
          case 10:
            retargeted = destScene.animations.wrap(offset2 + value._index);
            break;
          case 11:
            retargeted = destScene.skins.wrap(offset2 + value._index);
            break;
          default:
            retargeted = (prop.cloner ?? defaultPropertyCloner).clone(prop.type, value);
            break;
        }
        this[name] = retargeted;
      }
      return this;
    }
    _triggerInit() {
      if (this.init)
        try {
          this.init();
        } catch (e) {
          this.engine.log.error(2, `Exception during ${this.type} init() on object ${this.object.name}`), this.engine.log.error(2, e);
        }
      let oldActivate = this.onActivate;
      this.onActivate = function() {
        this.onActivate = oldActivate;
        let failed = false;
        try {
          this.validateProperties();
        } catch (e) {
          this.engine.log.error(2, `Exception during ${this.type} validateProperties() on object ${this.object.name}`), this.engine.log.error(2, e), failed = true;
        }
        try {
          this.start?.();
        } catch (e) {
          this.engine.log.error(2, `Exception during ${this.type} start() on object ${this.object.name}`), this.engine.log.error(2, e), failed = true;
        }
        if (failed) {
          this.active = false;
          return;
        }
        if (this.onActivate)
          try {
            this.onActivate();
          } catch (e) {
            this.engine.log.error(2, `Exception during ${this.type} onActivate() on object ${this.object.name}`), this.engine.log.error(2, e);
          }
      };
    }
    _triggerUpdate(dt) {
      if (this.update)
        try {
          this.update(dt);
        } catch (e) {
          this.engine.log.error(2, `Exception during ${this.type} update() on object ${this.object.name}`), this.engine.log.error(2, e), this.engine.wasm._deactivate_component_on_error && (this.active = false);
        }
    }
    _triggerOnActivate() {
      if (this.onActivate)
        try {
          this.onActivate();
        } catch (e) {
          this.engine.log.error(2, `Exception during ${this.type} onActivate() on object ${this.object.name}`), this.engine.log.error(2, e);
        }
    }
    _triggerOnDeactivate() {
      if (this.onDeactivate)
        try {
          this.onDeactivate();
        } catch (e) {
          this.engine.log.error(2, `Exception during ${this.type} onDeactivate() on object ${this.object.name}`), this.engine.log.error(2, e);
        }
    }
    _triggerOnDestroy() {
      try {
        this.onDestroy && this.onDestroy();
      } catch (e) {
        this.engine.log.error(2, `Exception during ${this.type} onDestroy() on object ${this.object.name}`), this.engine.log.error(2, e);
      }
      this._scene._components.destroy(this);
    }
  }, __publicField(_a, "_isBaseComponent", true), __publicField(_a, "_propertyOrder", []), __publicField(_a, "TypeName"), __publicField(_a, "Properties"), __publicField(_a, "InheritProperties"), __publicField(_a, "onRegister"), _a);
  var _a2;
  var BrokenComponent = (_a2 = class extends Component3 {
  }, __publicField(_a2, "TypeName", "__broken-component__"), _a2);
  function inheritProperties(target) {
    let chain = [], curr = target;
    for (; curr && !isBaseComponentClass(curr); ) {
      let comp = curr;
      if (!(comp.hasOwnProperty("InheritProperties") ? comp.InheritProperties : true))
        break;
      comp.hasOwnProperty("Properties") && chain.push(comp), curr = Object.getPrototypeOf(curr);
    }
    if (!chain.length || chain.length === 1 && chain[0] === target)
      return;
    let merged = {};
    for (let i = chain.length - 1; i >= 0; --i)
      Object.assign(merged, chain[i].Properties);
    target.Properties = merged;
  }
  var _a3;
  var CollisionComponent = (_a3 = class extends Component3 {
    getExtents(out = new Float32Array(3)) {
      let wasm = this.engine.wasm, ptr = wasm._wl_collision_component_get_extents(this._id) / 4;
      return out[0] = wasm.HEAPF32[ptr], out[1] = wasm.HEAPF32[ptr + 1], out[2] = wasm.HEAPF32[ptr + 2], out;
    }
    get collider() {
      return this.engine.wasm._wl_collision_component_get_collider(this._id);
    }
    set collider(collider) {
      this.engine.wasm._wl_collision_component_set_collider(this._id, collider);
    }
    get extents() {
      let wasm = this.engine.wasm;
      return new Float32Array(wasm.HEAPF32.buffer, wasm._wl_collision_component_get_extents(this._id), 3);
    }
    set extents(extents) {
      let wasm = this.engine.wasm, ptr = wasm._wl_collision_component_get_extents(this._id) / 4;
      wasm.HEAPF32[ptr] = extents[0], wasm.HEAPF32[ptr + 1] = extents[1], wasm.HEAPF32[ptr + 2] = extents[2];
    }
    get radius() {
      let wasm = this.engine.wasm;
      if (this.collider === 0)
        return wasm.HEAPF32[wasm._wl_collision_component_get_extents(this._id) >> 2];
      let extents = new Float32Array(wasm.HEAPF32.buffer, wasm._wl_collision_component_get_extents(this._id), 3), x2 = extents[0] * extents[0], y2 = extents[1] * extents[1], z2 = extents[2] * extents[2];
      return Math.sqrt(x2 + y2 + z2) / 2;
    }
    set radius(radius) {
      let length6 = this.collider === 0 ? radius : 2 * radius / SQRT_3;
      this.extents.set([length6, length6, length6]);
    }
    get group() {
      return this.engine.wasm._wl_collision_component_get_group(this._id);
    }
    set group(group) {
      this.engine.wasm._wl_collision_component_set_group(this._id, group);
    }
    queryOverlaps() {
      let count = this.engine.wasm._wl_collision_component_query_overlaps(this._id, this.engine.wasm._tempMem, this.engine.wasm._tempMemSize >> 1), overlaps = new Array(count);
      for (let i = 0; i < count; ++i) {
        let id = this.engine.wasm._tempMemUint16[i];
        overlaps[i] = this._scene._components.wrapCollision(id);
      }
      return overlaps;
    }
  }, __publicField(_a3, "TypeName", "collision"), _a3);
  __decorateClass2([nativeProperty()], CollisionComponent.prototype, "collider", 1), __decorateClass2([nativeProperty()], CollisionComponent.prototype, "extents", 1), __decorateClass2([nativeProperty()], CollisionComponent.prototype, "group", 1);
  var _a4;
  var TextComponent = (_a4 = class extends Component3 {
    get alignment() {
      return this.engine.wasm._wl_text_component_get_horizontal_alignment(this._id);
    }
    set alignment(alignment) {
      this.engine.wasm._wl_text_component_set_horizontal_alignment(this._id, alignment);
    }
    get verticalAlignment() {
      return this.engine.wasm._wl_text_component_get_vertical_alignment(this._id);
    }
    set verticalAlignment(verticalAlignment) {
      this.engine.wasm._wl_text_component_set_vertical_alignment(this._id, verticalAlignment);
    }
    get justification() {
      return this.verticalAlignment;
    }
    set justification(justification) {
      this.verticalAlignment = justification;
    }
    get justified() {
      return !!this.engine.wasm._wl_text_component_get_justified(this._id);
    }
    set justified(justified) {
      this.engine.wasm._wl_text_component_set_justified(this._id, justified);
    }
    get characterSpacing() {
      return this.engine.wasm._wl_text_component_get_character_spacing(this._id);
    }
    set characterSpacing(spacing) {
      this.engine.wasm._wl_text_component_set_character_spacing(this._id, spacing);
    }
    get lineSpacing() {
      return this.engine.wasm._wl_text_component_get_line_spacing(this._id);
    }
    set lineSpacing(spacing) {
      this.engine.wasm._wl_text_component_set_line_spacing(this._id, spacing);
    }
    get effect() {
      return this.engine.wasm._wl_text_component_get_effect(this._id);
    }
    set effect(effect) {
      this.engine.wasm._wl_text_component_set_effect(this._id, effect);
    }
    get effectOffset() {
      return this.getEffectOffset();
    }
    set effectOffset(offset2) {
      this.setEffectOffset(offset2);
    }
    getEffectOffset(out = new Float32Array(2)) {
      let wasm = this.engine.wasm;
      return wasm._wl_text_component_get_effectOffset(this._id, wasm._tempMem), out[0] = wasm._tempMemFloat[0], out[1] = wasm._tempMemFloat[1], out;
    }
    setEffectOffset(offset2) {
      let wasm = this.engine.wasm;
      wasm._tempMemFloat.set(offset2), wasm._wl_text_component_set_effectOffset(this._id, wasm._tempMem);
    }
    get wrapMode() {
      return this.engine.wasm._wl_text_component_get_wrapMode(this._id);
    }
    set wrapMode(wrapMode) {
      this.engine.wasm._wl_text_component_set_wrapMode(this._id, wrapMode);
    }
    get wrapWidth() {
      return this.engine.wasm._wl_text_component_get_wrapWidth(this._id);
    }
    set wrapWidth(width) {
      this.engine.wasm._wl_text_component_set_wrapWidth(this._id, width);
    }
    get text() {
      let wasm = this.engine.wasm, ptr = wasm._wl_text_component_get_text(this._id);
      return wasm.UTF8ToString(ptr);
    }
    set text(text) {
      let wasm = this.engine.wasm;
      wasm._wl_text_component_set_text(this._id, wasm.tempUTF8(text.toString()));
    }
    set material(material) {
      let matIndex = material ? material._id : 0;
      this.engine.wasm._wl_text_component_set_material(this._id, matIndex);
    }
    get material() {
      let index = this.engine.wasm._wl_text_component_get_material(this._id);
      return this.engine.materials.wrap(index);
    }
    getBoundingBoxForText(text, out = new Float32Array(4)) {
      let wasm = this.engine.wasm, textPtr = wasm.tempUTF8(text, 4 * 4);
      return this.engine.wasm._wl_text_component_get_boundingBox(this._id, textPtr, wasm._tempMem), out[0] = wasm._tempMemFloat[0], out[1] = wasm._tempMemFloat[1], out[2] = wasm._tempMemFloat[2], out[3] = wasm._tempMemFloat[3], out;
    }
    getBoundingBox(out = new Float32Array(4)) {
      let wasm = this.engine.wasm;
      return this.engine.wasm._wl_text_component_get_boundingBox(this._id, 0, wasm._tempMem), out[0] = wasm._tempMemFloat[0], out[1] = wasm._tempMemFloat[1], out[2] = wasm._tempMemFloat[2], out[3] = wasm._tempMemFloat[3], out;
    }
  }, __publicField(_a4, "TypeName", "text"), _a4);
  __decorateClass2([nativeProperty()], TextComponent.prototype, "alignment", 1), __decorateClass2([nativeProperty()], TextComponent.prototype, "verticalAlignment", 1), __decorateClass2([nativeProperty()], TextComponent.prototype, "justification", 1), __decorateClass2([nativeProperty()], TextComponent.prototype, "justified", 1), __decorateClass2([nativeProperty()], TextComponent.prototype, "characterSpacing", 1), __decorateClass2([nativeProperty()], TextComponent.prototype, "lineSpacing", 1), __decorateClass2([nativeProperty()], TextComponent.prototype, "effect", 1), __decorateClass2([nativeProperty()], TextComponent.prototype, "effectOffset", 1), __decorateClass2([nativeProperty()], TextComponent.prototype, "wrapMode", 1), __decorateClass2([nativeProperty()], TextComponent.prototype, "wrapWidth", 1), __decorateClass2([nativeProperty()], TextComponent.prototype, "text", 1), __decorateClass2([nativeProperty()], TextComponent.prototype, "material", 1);
  var _a5;
  var ViewComponent = (_a5 = class extends Component3 {
    get projectionType() {
      return this.engine.wasm._wl_view_component_get_projectionType(this._id);
    }
    set projectionType(type) {
      this.engine.wasm._wl_view_component_set_projectionType(this._id, type);
    }
    getProjectionMatrix(out = new Float32Array(16)) {
      let wasm = this.engine.wasm;
      wasm.requireTempMem(16 * 4), wasm._wl_view_component_get_projectionMatrix(this._id, wasm._tempMem);
      for (let i = 0; i < 16; ++i)
        out[i] = wasm._tempMemFloat[i];
      return out;
    }
    get projectionMatrix() {
      return this.getProjectionMatrix();
    }
    _setProjectionMatrix(v2) {
      let wasm = this._scene.engine.wasm;
      wasm.requireTempMem(16 * 4), wasm._tempMemFloat.set(v2), wasm._wl_view_component_set_projectionMatrix(this._id, wasm._tempMem);
    }
    _generateProjectionMatrix() {
      this._scene.engine.wasm._wl_view_component_generate_projectionMatrix(this._id);
    }
    get near() {
      return this.engine.wasm._wl_view_component_get_near(this._id);
    }
    set near(near) {
      this.engine.wasm._wl_view_component_set_near(this._id, near), this.engine.xr && this.scene.isActive && this.active && this.engine.webxr.updateProjectionParams(near, this.far);
    }
    get far() {
      return this.engine.wasm._wl_view_component_get_far(this._id);
    }
    set far(far) {
      this.engine.wasm._wl_view_component_set_far(this._id, far), this.engine.xr && this.scene.isActive && this.active && this.engine.webxr.updateProjectionParams(this.near, far);
    }
    get fov() {
      return this.engine.wasm._wl_view_component_get_fov(this._id);
    }
    set fov(fov) {
      this.engine.wasm._wl_view_component_set_fov(this._id, fov);
    }
    getViewport(out = new Int32Array(4)) {
      let wasm = this.engine.wasm, ptr = wasm._wl_view_component_get_viewport(this._id);
      for (let i = 0; i < 4; ++i)
        out[i] = wasm.HEAPF32[ptr + i];
      return out;
    }
    get viewport() {
      return this.getViewport();
    }
    _setViewport(x2, y2, width, height) {
      this._scene.engine.wasm._wl_view_component_set_viewport(this._id, x2, y2, width, height);
    }
    get extent() {
      return this.engine.wasm._wl_view_component_get_extent(this._id);
    }
    set extent(extent) {
      this.engine.wasm._wl_view_component_set_extent(this._id, extent);
    }
  }, __publicField(_a5, "TypeName", "view"), _a5);
  __decorateClass2([nativeProperty()], ViewComponent.prototype, "projectionType", 1), __decorateClass2([enumerable()], ViewComponent.prototype, "projectionMatrix", 1), __decorateClass2([nativeProperty()], ViewComponent.prototype, "near", 1), __decorateClass2([nativeProperty()], ViewComponent.prototype, "far", 1), __decorateClass2([nativeProperty()], ViewComponent.prototype, "fov", 1), __decorateClass2([enumerable()], ViewComponent.prototype, "viewport", 1), __decorateClass2([nativeProperty()], ViewComponent.prototype, "extent", 1);
  var _a6;
  var InputComponent = (_a6 = class extends Component3 {
    get inputType() {
      return this.engine.wasm._wl_input_component_get_type(this._id);
    }
    set inputType(type) {
      this.engine.wasm._wl_input_component_set_type(this._id, type);
    }
    get xrInputSource() {
      let xr = this.engine.xr;
      if (!xr)
        return null;
      for (let inputSource of xr.session.inputSources)
        if (inputSource.handedness == this.handedness)
          return inputSource;
      return null;
    }
    get handedness() {
      let inputType = this.inputType;
      return inputType == 4 || inputType == 6 || inputType == 2 ? "right" : inputType == 3 || inputType == 5 || inputType == 1 ? "left" : null;
    }
  }, __publicField(_a6, "TypeName", "input"), _a6);
  __decorateClass2([nativeProperty()], InputComponent.prototype, "inputType", 1), __decorateClass2([enumerable()], InputComponent.prototype, "xrInputSource", 1), __decorateClass2([enumerable()], InputComponent.prototype, "handedness", 1);
  var _a7;
  var LightComponent = (_a7 = class extends Component3 {
    getColor(out = new Float32Array(3)) {
      let wasm = this.engine.wasm, ptr = wasm._wl_light_component_get_color(this._id) / 4;
      return out[0] = wasm.HEAPF32[ptr], out[1] = wasm.HEAPF32[ptr + 1], out[2] = wasm.HEAPF32[ptr + 2], out;
    }
    setColor(c) {
      let wasm = this.engine.wasm, ptr = wasm._wl_light_component_get_color(this._id) / 4;
      wasm.HEAPF32[ptr] = c[0], wasm.HEAPF32[ptr + 1] = c[1], wasm.HEAPF32[ptr + 2] = c[2];
    }
    get color() {
      let wasm = this.engine.wasm;
      return new Float32Array(wasm.HEAPF32.buffer, wasm._wl_light_component_get_color(this._id), 3);
    }
    set color(c) {
      this.color.set(c);
    }
    get lightType() {
      return this.engine.wasm._wl_light_component_get_type(this._id);
    }
    set lightType(t) {
      this.engine.wasm._wl_light_component_set_type(this._id, t);
    }
    get intensity() {
      return this.engine.wasm._wl_light_component_get_intensity(this._id);
    }
    set intensity(intensity) {
      this.engine.wasm._wl_light_component_set_intensity(this._id, intensity);
    }
    get outerAngle() {
      return this.engine.wasm._wl_light_component_get_outerAngle(this._id);
    }
    set outerAngle(angle3) {
      this.engine.wasm._wl_light_component_set_outerAngle(this._id, angle3);
    }
    get innerAngle() {
      return this.engine.wasm._wl_light_component_get_innerAngle(this._id);
    }
    set innerAngle(angle3) {
      this.engine.wasm._wl_light_component_set_innerAngle(this._id, angle3);
    }
    get shadows() {
      return !!this.engine.wasm._wl_light_component_get_shadows(this._id);
    }
    set shadows(b2) {
      this.engine.wasm._wl_light_component_set_shadows(this._id, b2);
    }
    get shadowRange() {
      return this.engine.wasm._wl_light_component_get_shadowRange(this._id);
    }
    set shadowRange(range) {
      this.engine.wasm._wl_light_component_set_shadowRange(this._id, range);
    }
    get shadowBias() {
      return this.engine.wasm._wl_light_component_get_shadowBias(this._id);
    }
    set shadowBias(bias) {
      this.engine.wasm._wl_light_component_set_shadowBias(this._id, bias);
    }
    get shadowNormalBias() {
      return this.engine.wasm._wl_light_component_get_shadowNormalBias(this._id);
    }
    set shadowNormalBias(bias) {
      this.engine.wasm._wl_light_component_set_shadowNormalBias(this._id, bias);
    }
    get shadowTexelSize() {
      return this.engine.wasm._wl_light_component_get_shadowTexelSize(this._id);
    }
    set shadowTexelSize(size) {
      this.engine.wasm._wl_light_component_set_shadowTexelSize(this._id, size);
    }
    get cascadeCount() {
      return this.engine.wasm._wl_light_component_get_cascadeCount(this._id);
    }
    set cascadeCount(count) {
      this.engine.wasm._wl_light_component_set_cascadeCount(this._id, count);
    }
  }, __publicField(_a7, "TypeName", "light"), _a7);
  __decorateClass2([nativeProperty()], LightComponent.prototype, "color", 1), __decorateClass2([nativeProperty()], LightComponent.prototype, "lightType", 1), __decorateClass2([nativeProperty()], LightComponent.prototype, "intensity", 1), __decorateClass2([nativeProperty()], LightComponent.prototype, "outerAngle", 1), __decorateClass2([nativeProperty()], LightComponent.prototype, "innerAngle", 1), __decorateClass2([nativeProperty()], LightComponent.prototype, "shadows", 1), __decorateClass2([nativeProperty()], LightComponent.prototype, "shadowRange", 1), __decorateClass2([nativeProperty()], LightComponent.prototype, "shadowBias", 1), __decorateClass2([nativeProperty()], LightComponent.prototype, "shadowNormalBias", 1), __decorateClass2([nativeProperty()], LightComponent.prototype, "shadowTexelSize", 1), __decorateClass2([nativeProperty()], LightComponent.prototype, "cascadeCount", 1);
  var _a8;
  var AnimationComponent = (_a8 = class extends Component3 {
    onEvent = new Emitter();
    set animation(anim) {
      this.scene.assertOrigin(anim), this.engine.wasm._wl_animation_component_set_animation(this._id, anim ? anim._id : 0);
    }
    get animation() {
      let index = this.engine.wasm._wl_animation_component_get_animation(this._id);
      return this._scene.animations.wrap(index);
    }
    set playCount(playCount) {
      this.engine.wasm._wl_animation_component_set_playCount(this._id, playCount);
    }
    get playCount() {
      return this.engine.wasm._wl_animation_component_get_playCount(this._id);
    }
    set speed(speed) {
      this.engine.wasm._wl_animation_component_set_speed(this._id, speed);
    }
    get speed() {
      return this.engine.wasm._wl_animation_component_get_speed(this._id);
    }
    get state() {
      return this.engine.wasm._wl_animation_component_state(this._id);
    }
    get rootMotionMode() {
      return this.engine.wasm._wl_animation_component_get_rootMotionMode(this._id);
    }
    set rootMotionMode(mode) {
      this.engine.wasm._wl_animation_component_set_rootMotionMode(this._id, mode);
    }
    get iteration() {
      return this.engine.wasm._wl_animation_component_get_iteration(this._id);
    }
    get position() {
      return this.engine.wasm._wl_animation_component_get_position(this._id);
    }
    get duration() {
      return this.engine.wasm._wl_animation_component_get_duration(this._id);
    }
    play() {
      this.engine.wasm._wl_animation_component_play(this._id);
    }
    stop() {
      this.engine.wasm._wl_animation_component_stop(this._id);
    }
    pause() {
      this.engine.wasm._wl_animation_component_pause(this._id);
    }
    getFloatParameter(name) {
      let wasm = this.engine.wasm, index = wasm._wl_animation_component_getGraphParamIndex(this._id, wasm.tempUTF8(name));
      if (index === -1)
        throw Error(`Missing parameter '${name}'`);
      return wasm._wl_animation_component_getGraphParamValue(this._id, index, wasm._tempMem), wasm._tempMemFloat[0];
    }
    setFloatParameter(name, value) {
      let wasm = this.engine.wasm, index = wasm._wl_animation_component_getGraphParamIndex(this._id, wasm.tempUTF8(name));
      if (index === -1)
        throw Error(`Missing parameter '${name}'`);
      wasm._tempMemFloat[0] = value, wasm._wl_animation_component_setGraphParamValue(this._id, index, wasm._tempMem);
    }
    getRootMotionTranslation(out = new Float32Array(3)) {
      let wasm = this.engine.wasm;
      return wasm._wl_animation_component_get_rootMotion_translation(this._id, wasm._tempMem), out[0] = wasm._tempMemFloat[0], out[1] = wasm._tempMemFloat[1], out[2] = wasm._tempMemFloat[2], out;
    }
    getRootMotionRotation(out = new Float32Array(3)) {
      let wasm = this.engine.wasm;
      return wasm._wl_animation_component_get_rootMotion_rotation(this._id, wasm._tempMem), out[0] = wasm._tempMemFloat[0], out[1] = wasm._tempMemFloat[1], out[2] = wasm._tempMemFloat[2], out;
    }
  }, __publicField(_a8, "TypeName", "animation"), _a8);
  __decorateClass2([nativeProperty()], AnimationComponent.prototype, "animation", 1), __decorateClass2([nativeProperty()], AnimationComponent.prototype, "playCount", 1), __decorateClass2([nativeProperty()], AnimationComponent.prototype, "speed", 1), __decorateClass2([enumerable()], AnimationComponent.prototype, "state", 1), __decorateClass2([nativeProperty(), enumerable()], AnimationComponent.prototype, "rootMotionMode", 1);
  var _a9;
  var MeshComponent = (_a9 = class extends Component3 {
    set material(material) {
      this.engine.wasm._wl_mesh_component_set_material(this._id, material ? material._id : 0);
    }
    get material() {
      let index = this.engine.wasm._wl_mesh_component_get_material(this._id);
      return this.engine.materials.wrap(index);
    }
    get mesh() {
      let index = this.engine.wasm._wl_mesh_component_get_mesh(this._id);
      return this.engine.meshes.wrap(index);
    }
    set mesh(mesh) {
      this.engine.wasm._wl_mesh_component_set_mesh(this._id, mesh?._id ?? 0);
    }
    get skin() {
      let index = this.engine.wasm._wl_mesh_component_get_skin(this._id);
      return this._scene.skins.wrap(index);
    }
    set skin(skin) {
      this.scene.assertOrigin(skin), this.engine.wasm._wl_mesh_component_set_skin(this._id, skin ? skin._id : 0);
    }
    get morphTargets() {
      let index = this.engine.wasm._wl_mesh_component_get_morph_targets(this._id);
      return this.engine.morphTargets.wrap(index);
    }
    set morphTargets(morphTargets) {
      this.engine.wasm._wl_mesh_component_set_morph_targets(this._id, morphTargets?._id ?? 0);
    }
    get morphTargetWeights() {
      return this.getMorphTargetWeights();
    }
    set morphTargetWeights(weights) {
      this.setMorphTargetWeights(weights);
    }
    getMorphTargetWeights(out) {
      let wasm = this.engine.wasm, count = wasm._wl_mesh_component_get_morph_target_weights(this._id, wasm._tempMem);
      out || (out = new Float32Array(count));
      for (let i = 0; i < count; ++i)
        out[i] = wasm._tempMemFloat[i];
      return out;
    }
    getMorphTargetWeight(target) {
      let count = this.morphTargets?.count ?? 0;
      if (target >= count)
        throw new Error(`Index ${target} is out of bounds for ${count} targets`);
      return this.engine.wasm._wl_mesh_component_get_morph_target_weight(this._id, target);
    }
    setMorphTargetWeights(weights) {
      let count = this.morphTargets?.count ?? 0;
      if (weights.length !== count)
        throw new Error(`Expected ${count} weights but got ${weights.length}`);
      let wasm = this.engine.wasm;
      wasm._tempMemFloat.set(weights), wasm._wl_mesh_component_set_morph_target_weights(this._id, wasm._tempMem, weights.length);
    }
    setMorphTargetWeight(target, weight) {
      let count = this.morphTargets?.count ?? 0;
      if (target >= count)
        throw new Error(`Index ${target} is out of bounds for ${count} targets`);
      this.engine.wasm._wl_mesh_component_set_morph_target_weight(this._id, target, weight);
    }
  }, __publicField(_a9, "TypeName", "mesh"), _a9);
  __decorateClass2([nativeProperty()], MeshComponent.prototype, "material", 1), __decorateClass2([nativeProperty()], MeshComponent.prototype, "mesh", 1), __decorateClass2([nativeProperty()], MeshComponent.prototype, "skin", 1), __decorateClass2([nativeProperty()], MeshComponent.prototype, "morphTargets", 1), __decorateClass2([nativeProperty()], MeshComponent.prototype, "morphTargetWeights", 1);
  var _a10;
  var ParticleEffectComponent = (_a10 = class extends Component3 {
    get particleEffect() {
      let index = this.engine.wasm._wl_particleEffect_component_get_particleEffect(this._id);
      return this.engine.particleEffects.wrap(index);
    }
    set particleEffect(particleEffect) {
      this.engine.wasm._wl_particleEffect_component_set_particleEffect(this._id, particleEffect?._id ?? 0);
    }
  }, __publicField(_a10, "TypeName", "particle-effect"), _a10);
  __decorateClass2([nativeProperty()], ParticleEffectComponent.prototype, "particleEffect", 1);
  var LockAxis = ((LockAxis2) => (LockAxis2[LockAxis2.None = 0] = "None", LockAxis2[LockAxis2.X = 1] = "X", LockAxis2[LockAxis2.Y = 2] = "Y", LockAxis2[LockAxis2.Z = 4] = "Z", LockAxis2))(LockAxis || {});
  var _a11;
  var PhysXComponent = (_a11 = class extends Component3 {
    getTranslationOffset(out = new Float32Array(3)) {
      let wasm = this.engine.wasm;
      return wasm._wl_physx_component_get_offsetTranslation(this._id, wasm._tempMem), out[0] = wasm._tempMemFloat[0], out[1] = wasm._tempMemFloat[1], out[2] = wasm._tempMemFloat[2], out;
    }
    getRotationOffset(out = new Float32Array(4)) {
      let wasm = this.engine.wasm, ptr = wasm._wl_physx_component_get_offsetTransform(this._id) >> 2;
      return out[0] = wasm.HEAPF32[ptr], out[1] = wasm.HEAPF32[ptr + 1], out[2] = wasm.HEAPF32[ptr + 2], out[3] = wasm.HEAPF32[ptr + 3], out;
    }
    getExtents(out = new Float32Array(3)) {
      let wasm = this.engine.wasm, ptr = wasm._wl_physx_component_get_extents(this._id) / 4;
      return out[0] = wasm.HEAPF32[ptr], out[1] = wasm.HEAPF32[ptr + 1], out[2] = wasm.HEAPF32[ptr + 2], out;
    }
    getLinearVelocity(out = new Float32Array(3)) {
      let wasm = this.engine.wasm, tempMemFloat = wasm._tempMemFloat;
      return wasm._wl_physx_component_get_linearVelocity(this._id, wasm._tempMem), out[0] = tempMemFloat[0], out[1] = tempMemFloat[1], out[2] = tempMemFloat[2], out;
    }
    getAngularVelocity(out = new Float32Array(3)) {
      let wasm = this.engine.wasm, tempMemFloat = wasm._tempMemFloat;
      return wasm._wl_physx_component_get_angularVelocity(this._id, wasm._tempMem), out[0] = tempMemFloat[0], out[1] = tempMemFloat[1], out[2] = tempMemFloat[2], out;
    }
    set static(b2) {
      this.engine.wasm._wl_physx_component_set_static(this._id, b2);
    }
    get static() {
      return !!this.engine.wasm._wl_physx_component_get_static(this._id);
    }
    get translationOffset() {
      return this.getTranslationOffset();
    }
    set translationOffset(offset2) {
      this.engine.wasm._wl_physx_component_set_offsetTranslation(this._id, offset2[0], offset2[1], offset2[2]);
    }
    get rotationOffset() {
      return this.getRotationOffset();
    }
    set rotationOffset(offset2) {
      this.engine.wasm._wl_physx_component_set_offsetRotation(this._id, offset2[0], offset2[1], offset2[2], offset2[3]);
    }
    set kinematic(b2) {
      this.engine.wasm._wl_physx_component_set_kinematic(this._id, b2);
    }
    get kinematic() {
      return !!this.engine.wasm._wl_physx_component_get_kinematic(this._id);
    }
    set gravity(b2) {
      this.engine.wasm._wl_physx_component_set_gravity(this._id, b2);
    }
    get gravity() {
      return !!this.engine.wasm._wl_physx_component_get_gravity(this._id);
    }
    set simulate(b2) {
      this.engine.wasm._wl_physx_component_set_simulate(this._id, b2);
    }
    get simulate() {
      return !!this.engine.wasm._wl_physx_component_get_simulate(this._id);
    }
    set allowSimulation(b2) {
      this.engine.wasm._wl_physx_component_set_allowSimulation(this._id, b2);
    }
    get allowSimulation() {
      return !!this.engine.wasm._wl_physx_component_get_allowSimulation(this._id);
    }
    set allowQuery(b2) {
      this.engine.wasm._wl_physx_component_set_allowQuery(this._id, b2);
    }
    get allowQuery() {
      return !!this.engine.wasm._wl_physx_component_get_allowQuery(this._id);
    }
    set trigger(b2) {
      this.engine.wasm._wl_physx_component_set_trigger(this._id, b2);
    }
    get trigger() {
      return !!this.engine.wasm._wl_physx_component_get_trigger(this._id);
    }
    set shape(s) {
      this.engine.wasm._wl_physx_component_set_shape(this._id, s);
    }
    get shape() {
      return this.engine.wasm._wl_physx_component_get_shape(this._id);
    }
    set shapeData(d2) {
      d2 == null || !isMeshShape(this.shape) || this.engine.wasm._wl_physx_component_set_shape_data(this._id, d2.index);
    }
    get shapeData() {
      return isMeshShape(this.shape) ? { index: this.engine.wasm._wl_physx_component_get_shape_data(this._id) } : null;
    }
    set extents(e) {
      this.extents.set(e);
    }
    get extents() {
      let wasm = this.engine.wasm, ptr = wasm._wl_physx_component_get_extents(this._id);
      return new Float32Array(wasm.HEAPF32.buffer, ptr, 3);
    }
    get staticFriction() {
      return this.engine.wasm._wl_physx_component_get_staticFriction(this._id);
    }
    set staticFriction(v2) {
      this.engine.wasm._wl_physx_component_set_staticFriction(this._id, v2);
    }
    get dynamicFriction() {
      return this.engine.wasm._wl_physx_component_get_dynamicFriction(this._id);
    }
    set dynamicFriction(v2) {
      this.engine.wasm._wl_physx_component_set_dynamicFriction(this._id, v2);
    }
    get bounciness() {
      return this.engine.wasm._wl_physx_component_get_bounciness(this._id);
    }
    set bounciness(v2) {
      this.engine.wasm._wl_physx_component_set_bounciness(this._id, v2);
    }
    get linearDamping() {
      return this.engine.wasm._wl_physx_component_get_linearDamping(this._id);
    }
    set linearDamping(v2) {
      this.engine.wasm._wl_physx_component_set_linearDamping(this._id, v2);
    }
    get angularDamping() {
      return this.engine.wasm._wl_physx_component_get_angularDamping(this._id);
    }
    set angularDamping(v2) {
      this.engine.wasm._wl_physx_component_set_angularDamping(this._id, v2);
    }
    set linearVelocity(v2) {
      this.engine.wasm._wl_physx_component_set_linearVelocity(this._id, v2[0], v2[1], v2[2]);
    }
    get linearVelocity() {
      let wasm = this.engine.wasm;
      return wasm._wl_physx_component_get_linearVelocity(this._id, wasm._tempMem), new Float32Array(wasm.HEAPF32.buffer, wasm._tempMem, 3);
    }
    set angularVelocity(v2) {
      this.engine.wasm._wl_physx_component_set_angularVelocity(this._id, v2[0], v2[1], v2[2]);
    }
    get angularVelocity() {
      let wasm = this.engine.wasm;
      return wasm._wl_physx_component_get_angularVelocity(this._id, wasm._tempMem), new Float32Array(wasm.HEAPF32.buffer, wasm._tempMem, 3);
    }
    set groupsMask(flags) {
      this.engine.wasm._wl_physx_component_set_groupsMask(this._id, flags);
    }
    get groupsMask() {
      return this.engine.wasm._wl_physx_component_get_groupsMask(this._id);
    }
    set blocksMask(flags) {
      this.engine.wasm._wl_physx_component_set_blocksMask(this._id, flags);
    }
    get blocksMask() {
      return this.engine.wasm._wl_physx_component_get_blocksMask(this._id);
    }
    set linearLockAxis(lock) {
      this.engine.wasm._wl_physx_component_set_linearLockAxis(this._id, lock);
    }
    get linearLockAxis() {
      return this.engine.wasm._wl_physx_component_get_linearLockAxis(this._id);
    }
    set angularLockAxis(lock) {
      this.engine.wasm._wl_physx_component_set_angularLockAxis(this._id, lock);
    }
    get angularLockAxis() {
      return this.engine.wasm._wl_physx_component_get_angularLockAxis(this._id);
    }
    set mass(m2) {
      this.engine.wasm._wl_physx_component_set_mass(this._id, m2);
    }
    get mass() {
      return this.engine.wasm._wl_physx_component_get_mass(this._id);
    }
    set massSpaceInteriaTensor(v2) {
      this.engine.wasm._wl_physx_component_set_massSpaceInertiaTensor(this._id, v2[0], v2[1], v2[2]);
    }
    set sleepOnActivate(flag) {
      this.engine.wasm._wl_physx_component_set_sleepOnActivate(this._id, flag);
    }
    get sleepOnActivate() {
      return !!this.engine.wasm._wl_physx_component_get_sleepOnActivate(this._id);
    }
    addForce(f2, m2 = 0, localForce = false, p2, local = false) {
      let wasm = this.engine.wasm;
      if (!p2) {
        wasm._wl_physx_component_addForce(this._id, f2[0], f2[1], f2[2], m2, localForce);
        return;
      }
      wasm._wl_physx_component_addForceAt(this._id, f2[0], f2[1], f2[2], m2, localForce, p2[0], p2[1], p2[2], local);
    }
    addTorque(f2, m2 = 0) {
      this.engine.wasm._wl_physx_component_addTorque(this._id, f2[0], f2[1], f2[2], m2);
    }
    onCollision(callback) {
      return this.onCollisionWith(this, callback);
    }
    onCollisionWith(otherComp, callback) {
      let callbacks = this.scene._pxCallbacks;
      return callbacks.has(this._id) || callbacks.set(this._id, []), callbacks.get(this._id).push(callback), this.engine.wasm._wl_physx_component_addCallback(this._id, otherComp._id);
    }
    removeCollisionCallback(callbackId) {
      let r = this.engine.wasm._wl_physx_component_removeCallback(this._id, callbackId), callbacks = this.scene._pxCallbacks;
      r && callbacks.get(this._id).splice(-r);
    }
  }, __publicField(_a11, "TypeName", "physx"), _a11);
  __decorateClass2([nativeProperty()], PhysXComponent.prototype, "static", 1), __decorateClass2([nativeProperty()], PhysXComponent.prototype, "translationOffset", 1), __decorateClass2([nativeProperty()], PhysXComponent.prototype, "rotationOffset", 1), __decorateClass2([nativeProperty()], PhysXComponent.prototype, "kinematic", 1), __decorateClass2([nativeProperty()], PhysXComponent.prototype, "gravity", 1), __decorateClass2([nativeProperty()], PhysXComponent.prototype, "simulate", 1), __decorateClass2([nativeProperty()], PhysXComponent.prototype, "allowSimulation", 1), __decorateClass2([nativeProperty()], PhysXComponent.prototype, "allowQuery", 1), __decorateClass2([nativeProperty()], PhysXComponent.prototype, "trigger", 1), __decorateClass2([nativeProperty()], PhysXComponent.prototype, "shape", 1), __decorateClass2([nativeProperty()], PhysXComponent.prototype, "shapeData", 1), __decorateClass2([nativeProperty()], PhysXComponent.prototype, "extents", 1), __decorateClass2([nativeProperty()], PhysXComponent.prototype, "staticFriction", 1), __decorateClass2([nativeProperty()], PhysXComponent.prototype, "dynamicFriction", 1), __decorateClass2([nativeProperty()], PhysXComponent.prototype, "bounciness", 1), __decorateClass2([nativeProperty()], PhysXComponent.prototype, "linearDamping", 1), __decorateClass2([nativeProperty()], PhysXComponent.prototype, "angularDamping", 1), __decorateClass2([nativeProperty()], PhysXComponent.prototype, "linearVelocity", 1), __decorateClass2([nativeProperty()], PhysXComponent.prototype, "angularVelocity", 1), __decorateClass2([nativeProperty()], PhysXComponent.prototype, "groupsMask", 1), __decorateClass2([nativeProperty()], PhysXComponent.prototype, "blocksMask", 1), __decorateClass2([nativeProperty()], PhysXComponent.prototype, "linearLockAxis", 1), __decorateClass2([nativeProperty()], PhysXComponent.prototype, "angularLockAxis", 1), __decorateClass2([nativeProperty()], PhysXComponent.prototype, "mass", 1), __decorateClass2([nativeProperty()], PhysXComponent.prototype, "sleepOnActivate", 1);
  var MeshIndexType = ((MeshIndexType2) => (MeshIndexType2[MeshIndexType2.UnsignedByte = 1] = "UnsignedByte", MeshIndexType2[MeshIndexType2.UnsignedShort = 2] = "UnsignedShort", MeshIndexType2[MeshIndexType2.UnsignedInt = 4] = "UnsignedInt", MeshIndexType2))(MeshIndexType || {});
  var MeshSkinningType = ((MeshSkinningType2) => (MeshSkinningType2[MeshSkinningType2.None = 0] = "None", MeshSkinningType2[MeshSkinningType2.FourJoints = 1] = "FourJoints", MeshSkinningType2[MeshSkinningType2.EightJoints = 2] = "EightJoints", MeshSkinningType2))(MeshSkinningType || {});
  var Mesh = class extends Resource {
    constructor(engine, params) {
      if (!isNumber(params)) {
        let mesh = engine.meshes.create(params);
        return super(engine, mesh._index), mesh;
      }
      super(engine, params);
    }
    get vertexCount() {
      return this.engine.wasm._wl_mesh_get_vertexCount(this._id);
    }
    get indexData() {
      let wasm = this.engine.wasm, tempMem = wasm._tempMem, ptr = wasm._wl_mesh_get_indexData(this._id, tempMem, tempMem + 4);
      if (ptr === null)
        return null;
      let indexCount = wasm.HEAPU32[tempMem / 4];
      switch (wasm.HEAPU32[tempMem / 4 + 1]) {
        case 1:
          return new Uint8Array(wasm.HEAPU8.buffer, ptr, indexCount);
        case 2:
          return new Uint16Array(wasm.HEAPU16.buffer, ptr, indexCount);
        case 4:
          return new Uint32Array(wasm.HEAPU32.buffer, ptr, indexCount);
      }
      return null;
    }
    update() {
      this.engine.wasm._wl_mesh_update(this._id);
    }
    getBoundingSphere(out = new Float32Array(4)) {
      let wasm = this.engine.wasm;
      return this.engine.wasm._wl_mesh_get_boundingSphere(this._id, wasm._tempMem), out[0] = wasm._tempMemFloat[0], out[1] = wasm._tempMemFloat[1], out[2] = wasm._tempMemFloat[2], out[3] = wasm._tempMemFloat[3], out;
    }
    attribute(attr) {
      if (typeof attr != "number")
        throw new TypeError("Expected number, but got " + typeof attr);
      let wasm = this.engine.wasm, tempMemUint32 = wasm._tempMemUint32;
      if (wasm._wl_mesh_get_attribute(this._id, attr, wasm._tempMem), tempMemUint32[0] == 255)
        return null;
      let arraySize = tempMemUint32[5];
      return new MeshAttributeAccessor(this.engine, { attribute: tempMemUint32[0], offset: tempMemUint32[1], stride: tempMemUint32[2], formatSize: tempMemUint32[3], componentCount: tempMemUint32[4], arraySize: arraySize || 1, length: this.vertexCount, bufferType: attr !== 5 ? Float32Array : Uint16Array });
    }
    destroy() {
      this.engine.wasm._wl_mesh_destroy(this._id), this.engine.meshes._destroy(this);
    }
    toString() {
      return this.isDestroyed ? "Mesh(destroyed)" : `Mesh(${this._index})`;
    }
  };
  var MeshAttributeAccessor = class {
    length = 0;
    _engine;
    _attribute = -1;
    _offset = 0;
    _stride = 0;
    _formatSize = 0;
    _componentCount = 0;
    _arraySize = 1;
    _bufferType;
    _tempBufferGetter;
    constructor(engine, options) {
      this._engine = engine, this._attribute = options.attribute, this._offset = options.offset, this._stride = options.stride, this._formatSize = options.formatSize, this._componentCount = options.componentCount, this._arraySize = options.arraySize, this._bufferType = options.bufferType, this.length = options.length;
      let wasm = this._engine.wasm;
      this._tempBufferGetter = this._bufferType === Float32Array ? wasm.getTempBufferF32.bind(wasm) : wasm.getTempBufferU16.bind(wasm);
    }
    createArray(count = 1) {
      return count = count > this.length ? this.length : count, new this._bufferType(count * this._componentCount * this._arraySize);
    }
    get(index, out = this.createArray()) {
      if (out.length % this._componentCount !== 0)
        throw new Error(`out.length, ${out.length} is not a multiple of the attribute vector components, ${this._componentCount}`);
      let componentCount = this._componentCount * this._arraySize, len5 = Math.min(out.length, componentCount * this.length), dest = this._tempBufferGetter(len5), elementSize = this._bufferType.BYTES_PER_ELEMENT, destSize = elementSize * len5, srcFormatSize = this._formatSize * this._arraySize, destFormatSize = this._componentCount * elementSize * this._arraySize;
      this.engine.wasm._wl_mesh_get_attribute_values(this._attribute, srcFormatSize, this._offset + index * this._stride, this._stride, destFormatSize, dest.byteOffset, destSize);
      for (let i = 0; i < len5; ++i)
        out[i] = dest[i];
      return out;
    }
    set(i, v2) {
      if (v2.length % this._componentCount !== 0)
        throw new Error(`out.length, ${v2.length} is not a multiple of the attribute vector components, ${this._componentCount}`);
      let componentCount = this._componentCount * this._arraySize, len5 = Math.min(v2.length, componentCount * this.length), elementSize = this._bufferType.BYTES_PER_ELEMENT, srcSize = elementSize * len5, srcFormatSize = componentCount * elementSize, destFormatSize = this._formatSize * this._arraySize, wasm = this.engine.wasm;
      if (v2.buffer != wasm.HEAPU8.buffer) {
        let dest = this._tempBufferGetter(len5);
        dest.set(v2), v2 = dest;
      }
      return wasm._wl_mesh_set_attribute_values(this._attribute, srcFormatSize, v2.byteOffset, srcSize, destFormatSize, this._offset + i * this._stride, this._stride), this;
    }
    get engine() {
      return this._engine;
    }
  };
  var temp2d = null;
  var Texture = class extends Resource {
    constructor(engine, param) {
      if (isImageLike(param)) {
        let texture = engine.textures.create(param);
        return super(engine, texture._index), texture;
      }
      super(engine, param);
    }
    get valid() {
      return !this.isDestroyed && this.width !== 0 && this.height !== 0;
    }
    get id() {
      return this.index;
    }
    update() {
      let image = this._imageIndex;
      !this.valid || !image || this.engine.wasm._wl_image_markDirty(image);
    }
    get width() {
      let element = this.htmlElement;
      if (element)
        return element.videoWidth ?? element.width;
      let wasm = this.engine.wasm;
      return wasm._wl_image_size(this._imageIndex, wasm._tempMem), wasm._tempMemUint32[0];
    }
    get height() {
      let element = this.htmlElement;
      if (element)
        return element.videoHeight ?? element.height;
      let wasm = this.engine.wasm;
      return wasm._wl_image_size(this._imageIndex, wasm._tempMem), wasm._tempMemUint32[1];
    }
    get htmlElement() {
      let image = this._imageIndex;
      if (!image)
        return null;
      let wasm = this.engine.wasm, jsImageIndex = wasm._wl_image_get_jsImage_index(image);
      return wasm._images[jsImageIndex];
    }
    updateSubImage(srcX, srcY, srcWidth, srcHeight, dstX = srcX, dstY = srcY, content) {
      if (this.isDestroyed)
        return false;
      let image = this._imageIndex;
      if (!image)
        return false;
      let img = content ?? this.htmlElement;
      if (!img)
        return false;
      let isImageBitmap = img instanceof ImageBitmap, flipY = !isImageBitmap;
      if (srcX || srcY) {
        if (!temp2d) {
          let canvas2 = document.createElement("canvas"), ctx = canvas2.getContext("2d");
          if (!ctx)
            throw new Error("Texture.updateSubImage(): Failed to obtain CanvasRenderingContext2D.");
          temp2d = { canvas: canvas2, ctx };
        }
        temp2d.canvas.width = srcWidth, temp2d.canvas.height = srcHeight, temp2d.ctx.drawImage(img, srcX, isImageBitmap ? img.height - srcY - srcHeight : srcY, srcWidth, srcHeight, 0, 0, srcWidth, srcHeight), img = temp2d.canvas;
      }
      let wasm = this.engine.wasm;
      wasm._images[0] = img;
      let width = srcWidth - Math.max(srcWidth + dstX - this.width, 0), height = srcHeight - Math.max(srcHeight + dstY - this.height, 0), dstReversedY = this.height - dstY - height, ret = wasm._wl_renderer_updateImage(image, 0, width, height, dstX, dstReversedY, flipY);
      return wasm._images[0] = null, !!ret;
    }
    destroy() {
      let wasm = this.engine.wasm, img = wasm._images[this._imageIndex];
      img instanceof ImageBitmap && img.close(), wasm._wl_texture_destroy(this._id), this.engine.textures._destroy(this);
    }
    toString() {
      return this.isDestroyed ? "Texture(destroyed)" : `Texture(${this._index})`;
    }
    get _imageIndex() {
      return this.engine.wasm._wl_texture_get_image_index(this._id);
    }
  };
  var MaterialParamType = ((MaterialParamType2) => (MaterialParamType2[MaterialParamType2.UnsignedInt = 0] = "UnsignedInt", MaterialParamType2[MaterialParamType2.Int = 1] = "Int", MaterialParamType2[MaterialParamType2.HalfFloat = 2] = "HalfFloat", MaterialParamType2[MaterialParamType2.Float = 3] = "Float", MaterialParamType2[MaterialParamType2.Sampler = 4] = "Sampler", MaterialParamType2[MaterialParamType2.Font = 5] = "Font", MaterialParamType2))(MaterialParamType || {});
  function needsFlipY(image) {
    return image instanceof ImageBitmap ? 0 : 1;
  }
  var TextureManager = class extends ResourceManager {
    constructor(engine) {
      super(engine, Texture);
    }
    create(image) {
      let wasm = this.engine.wasm, jsImageIndex = wasm._images.length;
      if (wasm._images.push(image), image instanceof HTMLImageElement && !image.complete)
        throw new Error("image must be ready to create a texture");
      let width = image.videoWidth ?? image.width, height = image.videoHeight ?? image.height, imageIndex = wasm._wl_image_create(jsImageIndex);
      wasm._wl_image_markReady(imageIndex, width, height, needsFlipY(image));
      let index = wasm._wl_texture_create(imageIndex), instance = new Texture(this.engine, index);
      return this._cache[instance.index] = instance, instance;
    }
    load(filename, crossOrigin) {
      let image = new Image();
      return image.crossOrigin = crossOrigin ?? image.crossOrigin, image.src = filename, new Promise((resolve, reject) => {
        image.onload = () => {
          resolve(this.create(image));
        }, image.onerror = function() {
          reject("Failed to load image. Not found or no read access");
        };
      });
    }
  };
  var SceneType = ((SceneType2) => (SceneType2[SceneType2.Prefab = 0] = "Prefab", SceneType2[SceneType2.Main = 1] = "Main", SceneType2[SceneType2.Dependency = 2] = "Dependency", SceneType2))(SceneType || {});
  function assert(bit) {
    if (bit >= 32)
      throw new Error(`BitSet.enable(): Value ${bit} is over 31`);
  }
  var BitSet = class {
    _bits = 0;
    enable(...bits) {
      for (let bit of bits)
        assert(bit), this._bits |= 1 << bit >>> 0;
      return this;
    }
    enableAll() {
      return this._bits = -1, this;
    }
    disable(...bits) {
      for (let bit of bits)
        assert(bit), this._bits &= ~(1 << bit >>> 0);
      return this;
    }
    disableAll() {
      return this._bits = 0, this;
    }
    enabled(bit) {
      return !!(this._bits & 1 << bit >>> 0);
    }
  };
  var LogLevel = ((LogLevel2) => (LogLevel2[LogLevel2.Info = 0] = "Info", LogLevel2[LogLevel2.Warn = 1] = "Warn", LogLevel2[LogLevel2.Error = 2] = "Error", LogLevel2))(LogLevel || {});
  var Logger = class {
    levels = new BitSet();
    tags = new BitSet().enableAll();
    onLog = new Emitter();
    constructor(...levels) {
      this.levels.enable(...levels);
    }
    info(tag, ...msg) {
      return this.levels.enabled(0) && this.tags.enabled(tag) && console.log(...msg), this.onLog.notify(0, msg, tag), this;
    }
    warn(tag, ...msg) {
      return this.levels.enabled(1) && this.tags.enabled(tag) && console.warn(...msg), this.onLog.notify(1, msg, tag), this;
    }
    error(tag, ...msg) {
      return this.levels.enabled(2) && this.tags.enabled(tag) && console.error(...msg), this.onLog.notify(2, msg, tag), this;
    }
  };
  var WASM = class {
    wasm = null;
    canvas = null;
    preinitializedWebGPUDevice = null;
    UTF8ViewToString;
    _log = new Logger();
    _deactivate_component_on_error = false;
    _tempMem = null;
    _tempMemSize = 0;
    _tempMemFloat = null;
    _tempMemInt = null;
    _tempMemUint8 = null;
    _tempMemUint32 = null;
    _tempMemUint16 = null;
    _loadingScreen = null;
    _sceneLoadedCallback = [];
    _images = [null];
    _components = null;
    _componentTypes = [];
    _componentTypeIndices = {};
    _engine = null;
    _withPhysX = false;
    _utf8Decoder = new TextDecoder("utf8");
    _brokenComponentIndex = 0;
    constructor(threads2) {
      threads2 ? this.UTF8ViewToString = (s, e) => s ? this._utf8Decoder.decode(this.HEAPU8.slice(s, e)) : "" : this.UTF8ViewToString = (s, e) => s ? this._utf8Decoder.decode(this.HEAPU8.subarray(s, e)) : "", this._brokenComponentIndex = this._registerComponent(BrokenComponent);
    }
    get runtimeVersion() {
      let tempBuf = this._malloc(8), tempVersion = new Uint16Array(this.HEAP8.buffer, tempBuf, 4);
      this._wl_runtime_version(tempBuf);
      let version = { major: tempVersion[0], minor: tempVersion[1], patch: tempVersion[2], rc: tempVersion[3] };
      return this._free(tempBuf), version;
    }
    reset() {
      this._wl_reset(), this._components = null, this._images.length = 1, this.allocateTempMemory(1024), this._componentTypes = [], this._componentTypeIndices = {}, this._brokenComponentIndex = this._registerComponent(BrokenComponent);
    }
    isRegistered(type) {
      return type in this._componentTypeIndices;
    }
    _registerComponentLegacy(typeName, params, object) {
      let ctor = class extends Component3 {
      };
      return ctor.TypeName = typeName, ctor.Properties = params, Object.assign(ctor.prototype, object), this._registerComponent(ctor);
    }
    _registerComponent(ctor) {
      if (!ctor.TypeName)
        throw new Error("no name provided for component.");
      if (!ctor.prototype._triggerInit)
        throw new Error(`registerComponent(): Component ${ctor.TypeName} must extend Component`);
      setupComponentClass(ctor);
      let typeIndex = ctor.TypeName in this._componentTypeIndices ? this._componentTypeIndices[ctor.TypeName] : this._componentTypes.length;
      return this._componentTypes[typeIndex] = ctor, this._componentTypeIndices[ctor.TypeName] = typeIndex, ctor === BrokenComponent || (this._log.info(0, "Registered component", ctor.TypeName, `(class ${ctor.name})`, "with index", typeIndex), ctor.onRegister && ctor.onRegister(this._engine)), typeIndex;
    }
    allocateTempMemory(size) {
      this._log.info(0, "Allocating temp mem:", size), this._tempMemSize = size, this._tempMem && this._free(this._tempMem), this._tempMem = this._malloc(this._tempMemSize), this.updateTempMemory();
    }
    requireTempMem(size) {
      this._tempMemSize >= size || this.allocateTempMemory(Math.ceil(size / 1024) * 1024);
    }
    updateTempMemory() {
      this._tempMemFloat = new Float32Array(this.HEAP8.buffer, this._tempMem, this._tempMemSize >> 2), this._tempMemInt = new Int32Array(this.HEAP8.buffer, this._tempMem, this._tempMemSize >> 2), this._tempMemUint32 = new Uint32Array(this.HEAP8.buffer, this._tempMem, this._tempMemSize >> 2), this._tempMemUint16 = new Uint16Array(this.HEAP8.buffer, this._tempMem, this._tempMemSize >> 1), this._tempMemUint8 = new Uint8Array(this.HEAP8.buffer, this._tempMem, this._tempMemSize);
    }
    getTempBufferU8(count) {
      return this.requireTempMem(count), this._tempMemUint8;
    }
    getTempBufferU16(count) {
      return this.requireTempMem(count * 2), this._tempMemUint16;
    }
    getTempBufferU32(count) {
      return this.requireTempMem(count * 4), this._tempMemUint32;
    }
    getTempBufferI32(count) {
      return this.requireTempMem(count * 4), this._tempMemInt;
    }
    getTempBufferF32(count) {
      return this.requireTempMem(count * 4), this._tempMemFloat;
    }
    tempUTF8(str6, byteOffset = 0) {
      let strLen = this.lengthBytesUTF8(str6) + 1;
      this.requireTempMem(strLen + byteOffset);
      let ptr = this._tempMem + byteOffset;
      return this.stringToUTF8(str6, ptr, strLen), ptr;
    }
    copyBufferToHeap(buffer) {
      let size = buffer.byteLength, ptr = this._malloc(size);
      return this.HEAPU8.set(new Uint8Array(buffer), ptr), ptr;
    }
    get withPhysX() {
      return this._withPhysX;
    }
    _setEngine(engine) {
      this._engine = engine;
    }
    _wljs_reload(filenamePtr) {
      let filename = filenamePtr ? this.UTF8ToString(filenamePtr) : null;
      this._engine._reloadRequest(filename);
    }
    _wljs_init(withPhysX) {
      this._withPhysX = withPhysX, this.allocateTempMemory(1024);
    }
    _wljs_scene_switch(index) {
      let scene = this._engine._scenes[index];
      this._components = scene?._jsComponents ?? null;
    }
    _wljs_destroy_image(index) {
      let img = this._images[index];
      img && (this._images[index] = null, img.src !== void 0 && (img.src = ""), img.onload !== void 0 && (img.onload = null), img.onerror !== void 0 && (img.onerror = null));
    }
    _wljs_objects_markDestroyed(sceneIndex, idsPtr, count) {
      let scene = this._engine._scenes[sceneIndex], start = idsPtr >>> 1;
      for (let i = 0; i < count; ++i) {
        let id = this.HEAPU16[start + i];
        scene._destroyObject(id);
      }
    }
    _wljs_scene_initialize(sceneIndex, idsPtr, idsEnd, paramDataPtr, paramDataEndPtr, offsetsPtr, offsetsEndPtr) {
      let cborEncoded = this.HEAPU8.subarray(paramDataPtr, paramDataEndPtr), offsets = this.HEAPU32.subarray(offsetsPtr >>> 2, offsetsEndPtr >>> 2), ids = this.HEAPU16.subarray(idsPtr >>> 1, idsEnd >>> 1), scene = this._engine._scenes[sceneIndex], components = scene._jsComponents, cbor = new CBORReader(cborEncoded), componentsCount = 0;
      {
        let typeInfo = cbor.readTypeInfo();
        if (getType(typeInfo) !== 0) {
          this._log.error(0, "Parameters data must be an array");
          return;
        }
        componentsCount = cbor.readArrayLength(typeInfo);
      }
      if (componentsCount !== ids.length) {
        this._log.error(0, `Parameters set for ${componentsCount} components, but expected ${ids.length}`);
        return;
      }
      let decoder = new ComponentPropertyDecoder(scene, offsets);
      for (let i = 0; i < componentsCount; ++i) {
        let id = Component3._pack(sceneIndex, ids[i]), index = this._wl_get_js_component_index_for_id(id), component = components[index];
        decoder.decode(cbor, component);
      }
    }
    _wljs_set_component_param_translation(scene, component, param, valuePtr, valueEndPtr) {
      let comp = this._engine._scenes[scene]._jsComponents[component], value = this.UTF8ViewToString(valuePtr, valueEndPtr), paramName = comp.constructor._propertyOrder[param];
      comp[paramName] = value;
    }
    _wljs_get_component_type_index(namePtr, nameEndPtr) {
      let typename = this.UTF8ViewToString(namePtr, nameEndPtr), index = this._componentTypeIndices[typename];
      return index === void 0 ? this._brokenComponentIndex : index;
    }
    _wljs_component_create(sceneIndex, index, id, type, object) {
      this._engine._scenes[sceneIndex]._components.createJs(index, id, type, object);
    }
    _wljs_component_init(scene, component) {
      this._engine._scenes[scene]._jsComponents[component]._triggerInit();
    }
    _wljs_component_update(component, dt) {
      this._components[component]._triggerUpdate(dt);
    }
    _wljs_component_onActivate(component) {
      this._components[component]._triggerOnActivate();
    }
    _wljs_component_onDeactivate(component) {
      this._components[component]._triggerOnDeactivate();
    }
    _wljs_component_markDestroyed(sceneIndex, manager, componentId) {
      this._engine._scenes[sceneIndex]._destroyComponent(manager, componentId);
    }
    _wljs_swap(scene, a, b2) {
      let components = this._engine._scenes[scene]._jsComponents, componentA = components[a];
      components[a] = components[b2], components[b2] = componentA;
    }
    _wljs_copy(srcSceneIndex, srcIndex, dstSceneIndex, dstIndex, offsetsPtr, copyInfoPtr) {
      let srcScene = this._engine._scenes[srcSceneIndex], destComp = this._engine._scenes[dstSceneIndex]._jsComponents[dstIndex], srcComp = srcScene._jsComponents[srcIndex];
      destComp._copy(srcComp, offsetsPtr, copyInfoPtr);
    }
    _wljs_trigger_animationEvent(componentId, namePtr, nameEndPtr) {
      let comp = this._engine.scene._components.wrapAnimation(componentId), nameStr = this.UTF8ViewToString(namePtr, nameEndPtr);
      comp.onEvent.notify(nameStr);
    }
  };
  function throwInvalidRuntime(version) {
    return function() {
      throw new Error(`Feature added in version ${version}.
	\u2192 Please use a Wonderland Engine editor version >= ${version}`);
    };
  }
  var requireRuntime1_4_3 = throwInvalidRuntime("1.4.3");
  WASM.prototype._wl_scene_set_mainView = requireRuntime1_4_3;

  // node_modules/@wonderlandengine/components/dist/index.js
  var dist_exports2 = {};
  __export(dist_exports2, {
    ARCamera8thwall: () => ARCamera8thwall,
    Anchor: () => Anchor,
    AudioChannel: () => AudioChannel,
    AudioListener: () => AudioListener,
    AudioManager: () => AudioManager,
    AudioSource: () => AudioSource,
    Cursor: () => Cursor,
    CursorTarget: () => CursorTarget,
    DEF_PLAYER_COUNT: () => DEF_PLAYER_COUNT,
    DebugObject: () => DebugObject,
    DeviceOrientationLook: () => DeviceOrientationLook,
    EmptyAudioManager: () => EmptyAudioManager,
    FingerCursor: () => FingerCursor,
    FixedFoveation: () => FixedFoveation,
    HandTracking: () => HandTracking,
    HitTestLocation: () => HitTestLocation,
    HowlerAudioListener: () => HowlerAudioListener,
    HowlerAudioSource: () => HowlerAudioSource,
    ImageTexture: () => ImageTexture,
    InputProfile: () => InputProfile,
    MouseLookComponent: () => MouseLookComponent,
    OrbitalCamera: () => OrbitalCamera,
    PlaneDetection: () => PlaneDetection,
    PlayState: () => PlayState,
    PlayerHeight: () => PlayerHeight,
    TargetFramerate: () => TargetFramerate,
    TeleportComponent: () => TeleportComponent,
    Trail: () => Trail,
    TwoJointIkSolver: () => TwoJointIkSolver,
    VideoTexture: () => VideoTexture,
    VrModeActiveSwitch: () => VrModeActiveSwitch,
    Vrm: () => Vrm,
    WasdControlsComponent: () => WasdControlsComponent,
    globalAudioManager: () => globalAudioManager,
    isPointLocalOnXRPlanePolygon: () => isPointLocalOnXRPlanePolygon,
    isPointWorldOnXRPlanePolygon: () => isPointWorldOnXRPlanePolygon,
    loadAudio: () => loadAudio
  });

  // node_modules/@wonderlandengine/components/dist/8thwall-camera.js
  var __decorate = function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d2;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if (d2 = decorators[i])
          r = (c < 3 ? d2(r) : c > 3 ? d2(target, key, r) : d2(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  var ARCamera8thwall = class extends Component3 {
    deprecated;
  };
  __publicField(ARCamera8thwall, "TypeName", "8thwall-camera");
  __decorate([
    property.bool(true)
  ], ARCamera8thwall.prototype, "deprecated", void 0);

  // node_modules/@wonderlandengine/components/dist/utils/webxr.js
  var tempVec = new Float32Array(3);
  var tempQuat = new Float32Array(4);
  function setXRRigidTransformLocal(o, transform) {
    const r = transform.orientation;
    tempQuat[0] = r.x;
    tempQuat[1] = r.y;
    tempQuat[2] = r.z;
    tempQuat[3] = r.w;
    const t = transform.position;
    tempVec[0] = t.x;
    tempVec[1] = t.y;
    tempVec[2] = t.z;
    o.resetPositionRotation();
    o.setRotationLocal(tempQuat);
    o.translateLocal(tempVec);
  }

  // node_modules/@wonderlandengine/components/dist/anchor.js
  var __decorate2 = function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d2;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if (d2 = decorators[i])
          r = (c < 3 ? d2(r) : c > 3 ? d2(target, key, r) : d2(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  var tempVec3 = new Float32Array(3);
  var tempQuat2 = new Float32Array(4);
  var _anchors, _addAnchor, addAnchor_fn, _removeAnchor, removeAnchor_fn, _getFrame, getFrame_fn, _createAnchor, createAnchor_fn, _onAddAnchor, onAddAnchor_fn, _onRestoreAnchor, onRestoreAnchor_fn, _onCreate, onCreate_fn;
  var _Anchor = class extends Component3 {
    constructor() {
      super(...arguments);
      __privateAdd(this, _getFrame);
      __privateAdd(this, _createAnchor);
      __privateAdd(this, _onAddAnchor);
      __privateAdd(this, _onRestoreAnchor);
      __privateAdd(this, _onCreate);
      __publicField(this, "persist", false);
      /** Unique identifier to load a persistent anchor from, or empty/null if unknown */
      __publicField(this, "uuid", null);
      /** The xrAnchor, if created */
      __publicField(this, "xrAnchor", null);
      /** Emits events when the anchor is created either by being restored or newly created */
      __publicField(this, "onCreate", new Emitter());
      /** Whether the anchor is currently being tracked */
      __publicField(this, "visible", false);
      /** Emits an event when this anchor starts tracking */
      __publicField(this, "onTrackingFound", new Emitter());
      /** Emits an event when this anchor stops tracking */
      __publicField(this, "onTrackingLost", new Emitter());
      /** XRFrame to use for creating the anchor */
      __publicField(this, "xrFrame", null);
      /** XRHitTestResult to use for creating the anchor */
      __publicField(this, "xrHitResult", null);
    }
    /** Retrieve all anchors of the current scene */
    static getAllAnchors() {
      return __privateGet(_Anchor, _anchors);
    }
    /**
     * Create a new anchor
     *
     * @param o Object to attach the component to
     * @param params Parameters for the anchor component
     * @param frame XRFrame to use for anchor cration, if null, will use the current frame if available
     * @param hitResult Optional hit-test result to create the anchor with
     * @returns Promise for the newly created anchor component
     */
    static create(o, params, frame, hitResult) {
      const a = o.addComponent(_Anchor, { ...params, active: false });
      if (a === null)
        return null;
      a.xrHitResult = hitResult ?? null;
      a.xrFrame = frame ?? null;
      a.onCreate.once(() => (a.xrFrame = null, a.xrHitResult = null));
      a.active = true;
      return a.onCreate.promise();
    }
    start() {
      if (this.uuid && this.engine.xr) {
        this.persist = true;
        if (this.engine.xr.session.restorePersistentAnchor === void 0) {
          console.warn("anchor: Persistent anchors are not supported by your client. Ignoring persist property.");
        }
        this.engine.xr.session.restorePersistentAnchor(this.uuid).then(__privateMethod(this, _onRestoreAnchor, onRestoreAnchor_fn).bind(this));
      } else if (__privateMethod(this, _getFrame, getFrame_fn).call(this)) {
        __privateMethod(this, _createAnchor, createAnchor_fn).call(this).then(__privateMethod(this, _onAddAnchor, onAddAnchor_fn).bind(this));
      } else {
        throw new Error("Anchors can only be created during the XR frame in an active XR session");
      }
    }
    update() {
      if (!this.xrAnchor || !this.engine.xr)
        return;
      const pose = this.engine.xr.frame.getPose(this.xrAnchor.anchorSpace, this.engine.xr.currentReferenceSpace);
      const visible = !!pose;
      if (visible != this.visible) {
        this.visible = visible;
        (visible ? this.onTrackingFound : this.onTrackingLost).notify(this);
      }
      if (pose) {
        setXRRigidTransformLocal(this.object, pose.transform);
      }
    }
    onDestroy() {
      var _a12;
      __privateMethod(_a12 = _Anchor, _removeAnchor, removeAnchor_fn).call(_a12, this);
    }
  };
  var Anchor = _Anchor;
  _anchors = new WeakMap();
  _addAnchor = new WeakSet();
  addAnchor_fn = function(anchor) {
    __privateGet(_Anchor, _anchors).push(anchor);
  };
  _removeAnchor = new WeakSet();
  removeAnchor_fn = function(anchor) {
    const index = __privateGet(_Anchor, _anchors).indexOf(anchor);
    if (index < 0)
      return;
    __privateGet(_Anchor, _anchors).splice(index, 1);
  };
  _getFrame = new WeakSet();
  getFrame_fn = function() {
    return this.xrFrame || this.engine.xr.frame;
  };
  _createAnchor = new WeakSet();
  createAnchor_fn = async function() {
    if (!__privateMethod(this, _getFrame, getFrame_fn).call(this).createAnchor) {
      throw new Error("Cannot create anchor - anchors not supported, did you enable the 'anchors' WebXR feature?");
    }
    if (this.xrHitResult) {
      if (this.xrHitResult.createAnchor === void 0) {
        throw new Error("Requested anchor on XRHitTestResult, but WebXR hit-test feature is not available.");
      }
      return this.xrHitResult.createAnchor();
    } else {
      this.object.getTranslationWorld(tempVec3);
      tempQuat2.set(this.object.rotationWorld);
      const rotation = tempQuat2;
      const anchorPose = new XRRigidTransform({ x: tempVec3[0], y: tempVec3[1], z: tempVec3[2] }, { x: rotation[0], y: rotation[1], z: rotation[2], w: rotation[3] });
      return __privateMethod(this, _getFrame, getFrame_fn).call(this)?.createAnchor(anchorPose, this.engine.xr.currentReferenceSpace);
    }
  };
  _onAddAnchor = new WeakSet();
  onAddAnchor_fn = function(anchor) {
    if (!anchor)
      return;
    if (this.persist) {
      if (anchor.requestPersistentHandle !== void 0) {
        anchor.requestPersistentHandle().then((uuid) => {
          var _a12;
          this.uuid = uuid;
          __privateMethod(this, _onCreate, onCreate_fn).call(this, anchor);
          __privateMethod(_a12 = _Anchor, _addAnchor, addAnchor_fn).call(_a12, this);
        });
        return;
      } else {
        console.warn("anchor: Persistent anchors are not supported by your client. Ignoring persist property.");
      }
    }
    __privateMethod(this, _onCreate, onCreate_fn).call(this, anchor);
  };
  _onRestoreAnchor = new WeakSet();
  onRestoreAnchor_fn = function(anchor) {
    __privateMethod(this, _onCreate, onCreate_fn).call(this, anchor);
  };
  _onCreate = new WeakSet();
  onCreate_fn = function(anchor) {
    this.xrAnchor = anchor;
    this.onCreate.notify(this);
  };
  __privateAdd(Anchor, _addAnchor);
  __privateAdd(Anchor, _removeAnchor);
  __publicField(Anchor, "TypeName", "anchor");
  /* Static management of all anchors */
  __privateAdd(Anchor, _anchors, []);
  __decorate2([
    property.bool(false)
  ], Anchor.prototype, "persist", void 0);
  __decorate2([
    property.string()
  ], Anchor.prototype, "uuid", void 0);

  // node_modules/@wonderlandengine/components/dist/cursor-target.js
  var CursorTarget = class extends Component3 {
    /** Emitter for events when the target is hovered */
    onHover = new Emitter();
    /** Emitter for events when the target is unhovered */
    onUnhover = new Emitter();
    /** Emitter for events when the target is clicked */
    onClick = new Emitter();
    /** Emitter for events when the cursor moves on the target */
    onMove = new Emitter();
    /** Emitter for events when the user pressed the select button on the target */
    onDown = new Emitter();
    /** Emitter for events when the user unpressed the select button on the target */
    onUp = new Emitter();
    /**
     * @deprecated Use the emitter instead.
     *
     * @example
     *    this.onHover.add(f);
     */
    addHoverFunction(f2) {
      this.onHover.add(f2);
    }
    /**
     * @deprecated Use the emitter instead.
     *
     * @example
     *    this.onHover.remove(f);
     */
    removeHoverFunction(f2) {
      this.onHover.remove(f2);
    }
    /**
     * @deprecated Use the emitter instead.
     *
     * @example
     *    this.onUnhover.add(f);
     */
    addUnHoverFunction(f2) {
      this.onUnhover.add(f2);
    }
    /**
     * @deprecated Use the emitter instead.
     *
     * @example
     *    this.onUnhover.remove(f);
     */
    removeUnHoverFunction(f2) {
      this.onUnhover.remove(f2);
    }
    /**
     * @deprecated Use the emitter instead.
     *
     * @example
     *    this.onClick.add(f);
     */
    addClickFunction(f2) {
      this.onClick.add(f2);
    }
    /**
     * @deprecated Use the emitter instead.
     *
     * @example
     *    component.onClick.remove(f);
     */
    removeClickFunction(f2) {
      this.onClick.remove(f2);
    }
    /**
     * @deprecated Use the emitter instead.
     *
     * @example
     *    component.onMove.add(f);
     */
    addMoveFunction(f2) {
      this.onMove.add(f2);
    }
    /**
     * @deprecated Use the emitter instead.
     *
     * @example
     *    component.onMove.remove(f);
     */
    removeMoveFunction(f2) {
      this.onMove.remove(f2);
    }
    /**
     * @deprecated Use the emitter instead.
     *
     * @example
     *    component.onDown.add(f);
     */
    addDownFunction(f2) {
      this.onDown.add(f2);
    }
    /**
     * @deprecated Use the emitter instead.
     *
     * @example
     *    component.onDown.remove(f);
     */
    removeDownFunction(f2) {
      this.onDown.remove(f2);
    }
    /**
     * @deprecated Use the emitter instead.
     *
     * @example
     *    component.onUp.add(f);
     */
    addUpFunction(f2) {
      this.onUp.add(f2);
    }
    /**
     * @deprecated Use the emitter instead.
     *
     * @example
     *    component.onUp.remove(f);
     */
    removeUpFunction(f2) {
      this.onUp.remove(f2);
    }
  };
  __publicField(CursorTarget, "TypeName", "cursor-target");
  __publicField(CursorTarget, "Properties", {});

  // node_modules/gl-matrix/esm/common.js
  var EPSILON = 1e-6;
  var ARRAY_TYPE = typeof Float32Array !== "undefined" ? Float32Array : Array;
  var RANDOM = Math.random;
  var degree = Math.PI / 180;
  if (!Math.hypot)
    Math.hypot = function() {
      var y2 = 0, i = arguments.length;
      while (i--) {
        y2 += arguments[i] * arguments[i];
      }
      return Math.sqrt(y2);
    };

  // node_modules/gl-matrix/esm/mat3.js
  function create() {
    var out = new ARRAY_TYPE(9);
    if (ARRAY_TYPE != Float32Array) {
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
      out[5] = 0;
      out[6] = 0;
      out[7] = 0;
    }
    out[0] = 1;
    out[4] = 1;
    out[8] = 1;
    return out;
  }

  // node_modules/gl-matrix/esm/mat4.js
  var mat4_exports = {};
  __export(mat4_exports, {
    add: () => add,
    adjoint: () => adjoint,
    clone: () => clone,
    copy: () => copy,
    create: () => create2,
    determinant: () => determinant,
    equals: () => equals,
    exactEquals: () => exactEquals,
    frob: () => frob,
    fromQuat: () => fromQuat,
    fromQuat2: () => fromQuat2,
    fromRotation: () => fromRotation,
    fromRotationTranslation: () => fromRotationTranslation,
    fromRotationTranslationScale: () => fromRotationTranslationScale,
    fromRotationTranslationScaleOrigin: () => fromRotationTranslationScaleOrigin,
    fromScaling: () => fromScaling,
    fromTranslation: () => fromTranslation,
    fromValues: () => fromValues,
    fromXRotation: () => fromXRotation,
    fromYRotation: () => fromYRotation,
    fromZRotation: () => fromZRotation,
    frustum: () => frustum,
    getRotation: () => getRotation,
    getScaling: () => getScaling,
    getTranslation: () => getTranslation,
    identity: () => identity,
    invert: () => invert,
    lookAt: () => lookAt,
    mul: () => mul,
    multiply: () => multiply,
    multiplyScalar: () => multiplyScalar,
    multiplyScalarAndAdd: () => multiplyScalarAndAdd,
    ortho: () => ortho,
    orthoNO: () => orthoNO,
    orthoZO: () => orthoZO,
    perspective: () => perspective,
    perspectiveFromFieldOfView: () => perspectiveFromFieldOfView,
    perspectiveNO: () => perspectiveNO,
    perspectiveZO: () => perspectiveZO,
    rotate: () => rotate,
    rotateX: () => rotateX,
    rotateY: () => rotateY,
    rotateZ: () => rotateZ,
    scale: () => scale,
    set: () => set,
    str: () => str,
    sub: () => sub,
    subtract: () => subtract,
    targetTo: () => targetTo,
    translate: () => translate,
    transpose: () => transpose
  });
  function create2() {
    var out = new ARRAY_TYPE(16);
    if (ARRAY_TYPE != Float32Array) {
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
      out[4] = 0;
      out[6] = 0;
      out[7] = 0;
      out[8] = 0;
      out[9] = 0;
      out[11] = 0;
      out[12] = 0;
      out[13] = 0;
      out[14] = 0;
    }
    out[0] = 1;
    out[5] = 1;
    out[10] = 1;
    out[15] = 1;
    return out;
  }
  function clone(a) {
    var out = new ARRAY_TYPE(16);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
  }
  function copy(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
  }
  function fromValues(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
    var out = new ARRAY_TYPE(16);
    out[0] = m00;
    out[1] = m01;
    out[2] = m02;
    out[3] = m03;
    out[4] = m10;
    out[5] = m11;
    out[6] = m12;
    out[7] = m13;
    out[8] = m20;
    out[9] = m21;
    out[10] = m22;
    out[11] = m23;
    out[12] = m30;
    out[13] = m31;
    out[14] = m32;
    out[15] = m33;
    return out;
  }
  function set(out, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
    out[0] = m00;
    out[1] = m01;
    out[2] = m02;
    out[3] = m03;
    out[4] = m10;
    out[5] = m11;
    out[6] = m12;
    out[7] = m13;
    out[8] = m20;
    out[9] = m21;
    out[10] = m22;
    out[11] = m23;
    out[12] = m30;
    out[13] = m31;
    out[14] = m32;
    out[15] = m33;
    return out;
  }
  function identity(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  function transpose(out, a) {
    if (out === a) {
      var a01 = a[1], a02 = a[2], a03 = a[3];
      var a12 = a[6], a13 = a[7];
      var a23 = a[11];
      out[1] = a[4];
      out[2] = a[8];
      out[3] = a[12];
      out[4] = a01;
      out[6] = a[9];
      out[7] = a[13];
      out[8] = a02;
      out[9] = a12;
      out[11] = a[14];
      out[12] = a03;
      out[13] = a13;
      out[14] = a23;
    } else {
      out[0] = a[0];
      out[1] = a[4];
      out[2] = a[8];
      out[3] = a[12];
      out[4] = a[1];
      out[5] = a[5];
      out[6] = a[9];
      out[7] = a[13];
      out[8] = a[2];
      out[9] = a[6];
      out[10] = a[10];
      out[11] = a[14];
      out[12] = a[3];
      out[13] = a[7];
      out[14] = a[11];
      out[15] = a[15];
    }
    return out;
  }
  function invert(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    var a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    var a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    var a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
    var b00 = a00 * a11 - a01 * a10;
    var b01 = a00 * a12 - a02 * a10;
    var b02 = a00 * a13 - a03 * a10;
    var b03 = a01 * a12 - a02 * a11;
    var b04 = a01 * a13 - a03 * a11;
    var b05 = a02 * a13 - a03 * a12;
    var b06 = a20 * a31 - a21 * a30;
    var b07 = a20 * a32 - a22 * a30;
    var b08 = a20 * a33 - a23 * a30;
    var b09 = a21 * a32 - a22 * a31;
    var b10 = a21 * a33 - a23 * a31;
    var b11 = a22 * a33 - a23 * a32;
    var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
    if (!det) {
      return null;
    }
    det = 1 / det;
    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
    return out;
  }
  function adjoint(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    var a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    var a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    var a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
    out[0] = a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22);
    out[1] = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
    out[2] = a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12);
    out[3] = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
    out[4] = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
    out[5] = a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22);
    out[6] = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
    out[7] = a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12);
    out[8] = a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21);
    out[9] = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
    out[10] = a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11);
    out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
    out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
    out[13] = a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21);
    out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
    out[15] = a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11);
    return out;
  }
  function determinant(a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    var a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    var a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    var a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
    var b00 = a00 * a11 - a01 * a10;
    var b01 = a00 * a12 - a02 * a10;
    var b02 = a00 * a13 - a03 * a10;
    var b03 = a01 * a12 - a02 * a11;
    var b04 = a01 * a13 - a03 * a11;
    var b05 = a02 * a13 - a03 * a12;
    var b06 = a20 * a31 - a21 * a30;
    var b07 = a20 * a32 - a22 * a30;
    var b08 = a20 * a33 - a23 * a30;
    var b09 = a21 * a32 - a22 * a31;
    var b10 = a21 * a33 - a23 * a31;
    var b11 = a22 * a33 - a23 * a32;
    return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
  }
  function multiply(out, a, b2) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    var a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    var a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    var a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
    var b0 = b2[0], b1 = b2[1], b22 = b2[2], b3 = b2[3];
    out[0] = b0 * a00 + b1 * a10 + b22 * a20 + b3 * a30;
    out[1] = b0 * a01 + b1 * a11 + b22 * a21 + b3 * a31;
    out[2] = b0 * a02 + b1 * a12 + b22 * a22 + b3 * a32;
    out[3] = b0 * a03 + b1 * a13 + b22 * a23 + b3 * a33;
    b0 = b2[4];
    b1 = b2[5];
    b22 = b2[6];
    b3 = b2[7];
    out[4] = b0 * a00 + b1 * a10 + b22 * a20 + b3 * a30;
    out[5] = b0 * a01 + b1 * a11 + b22 * a21 + b3 * a31;
    out[6] = b0 * a02 + b1 * a12 + b22 * a22 + b3 * a32;
    out[7] = b0 * a03 + b1 * a13 + b22 * a23 + b3 * a33;
    b0 = b2[8];
    b1 = b2[9];
    b22 = b2[10];
    b3 = b2[11];
    out[8] = b0 * a00 + b1 * a10 + b22 * a20 + b3 * a30;
    out[9] = b0 * a01 + b1 * a11 + b22 * a21 + b3 * a31;
    out[10] = b0 * a02 + b1 * a12 + b22 * a22 + b3 * a32;
    out[11] = b0 * a03 + b1 * a13 + b22 * a23 + b3 * a33;
    b0 = b2[12];
    b1 = b2[13];
    b22 = b2[14];
    b3 = b2[15];
    out[12] = b0 * a00 + b1 * a10 + b22 * a20 + b3 * a30;
    out[13] = b0 * a01 + b1 * a11 + b22 * a21 + b3 * a31;
    out[14] = b0 * a02 + b1 * a12 + b22 * a22 + b3 * a32;
    out[15] = b0 * a03 + b1 * a13 + b22 * a23 + b3 * a33;
    return out;
  }
  function translate(out, a, v2) {
    var x2 = v2[0], y2 = v2[1], z2 = v2[2];
    var a00, a01, a02, a03;
    var a10, a11, a12, a13;
    var a20, a21, a22, a23;
    if (a === out) {
      out[12] = a[0] * x2 + a[4] * y2 + a[8] * z2 + a[12];
      out[13] = a[1] * x2 + a[5] * y2 + a[9] * z2 + a[13];
      out[14] = a[2] * x2 + a[6] * y2 + a[10] * z2 + a[14];
      out[15] = a[3] * x2 + a[7] * y2 + a[11] * z2 + a[15];
    } else {
      a00 = a[0];
      a01 = a[1];
      a02 = a[2];
      a03 = a[3];
      a10 = a[4];
      a11 = a[5];
      a12 = a[6];
      a13 = a[7];
      a20 = a[8];
      a21 = a[9];
      a22 = a[10];
      a23 = a[11];
      out[0] = a00;
      out[1] = a01;
      out[2] = a02;
      out[3] = a03;
      out[4] = a10;
      out[5] = a11;
      out[6] = a12;
      out[7] = a13;
      out[8] = a20;
      out[9] = a21;
      out[10] = a22;
      out[11] = a23;
      out[12] = a00 * x2 + a10 * y2 + a20 * z2 + a[12];
      out[13] = a01 * x2 + a11 * y2 + a21 * z2 + a[13];
      out[14] = a02 * x2 + a12 * y2 + a22 * z2 + a[14];
      out[15] = a03 * x2 + a13 * y2 + a23 * z2 + a[15];
    }
    return out;
  }
  function scale(out, a, v2) {
    var x2 = v2[0], y2 = v2[1], z2 = v2[2];
    out[0] = a[0] * x2;
    out[1] = a[1] * x2;
    out[2] = a[2] * x2;
    out[3] = a[3] * x2;
    out[4] = a[4] * y2;
    out[5] = a[5] * y2;
    out[6] = a[6] * y2;
    out[7] = a[7] * y2;
    out[8] = a[8] * z2;
    out[9] = a[9] * z2;
    out[10] = a[10] * z2;
    out[11] = a[11] * z2;
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
  }
  function rotate(out, a, rad, axis) {
    var x2 = axis[0], y2 = axis[1], z2 = axis[2];
    var len5 = Math.hypot(x2, y2, z2);
    var s, c, t;
    var a00, a01, a02, a03;
    var a10, a11, a12, a13;
    var a20, a21, a22, a23;
    var b00, b01, b02;
    var b10, b11, b12;
    var b20, b21, b22;
    if (len5 < EPSILON) {
      return null;
    }
    len5 = 1 / len5;
    x2 *= len5;
    y2 *= len5;
    z2 *= len5;
    s = Math.sin(rad);
    c = Math.cos(rad);
    t = 1 - c;
    a00 = a[0];
    a01 = a[1];
    a02 = a[2];
    a03 = a[3];
    a10 = a[4];
    a11 = a[5];
    a12 = a[6];
    a13 = a[7];
    a20 = a[8];
    a21 = a[9];
    a22 = a[10];
    a23 = a[11];
    b00 = x2 * x2 * t + c;
    b01 = y2 * x2 * t + z2 * s;
    b02 = z2 * x2 * t - y2 * s;
    b10 = x2 * y2 * t - z2 * s;
    b11 = y2 * y2 * t + c;
    b12 = z2 * y2 * t + x2 * s;
    b20 = x2 * z2 * t + y2 * s;
    b21 = y2 * z2 * t - x2 * s;
    b22 = z2 * z2 * t + c;
    out[0] = a00 * b00 + a10 * b01 + a20 * b02;
    out[1] = a01 * b00 + a11 * b01 + a21 * b02;
    out[2] = a02 * b00 + a12 * b01 + a22 * b02;
    out[3] = a03 * b00 + a13 * b01 + a23 * b02;
    out[4] = a00 * b10 + a10 * b11 + a20 * b12;
    out[5] = a01 * b10 + a11 * b11 + a21 * b12;
    out[6] = a02 * b10 + a12 * b11 + a22 * b12;
    out[7] = a03 * b10 + a13 * b11 + a23 * b12;
    out[8] = a00 * b20 + a10 * b21 + a20 * b22;
    out[9] = a01 * b20 + a11 * b21 + a21 * b22;
    out[10] = a02 * b20 + a12 * b21 + a22 * b22;
    out[11] = a03 * b20 + a13 * b21 + a23 * b22;
    if (a !== out) {
      out[12] = a[12];
      out[13] = a[13];
      out[14] = a[14];
      out[15] = a[15];
    }
    return out;
  }
  function rotateX(out, a, rad) {
    var s = Math.sin(rad);
    var c = Math.cos(rad);
    var a10 = a[4];
    var a11 = a[5];
    var a12 = a[6];
    var a13 = a[7];
    var a20 = a[8];
    var a21 = a[9];
    var a22 = a[10];
    var a23 = a[11];
    if (a !== out) {
      out[0] = a[0];
      out[1] = a[1];
      out[2] = a[2];
      out[3] = a[3];
      out[12] = a[12];
      out[13] = a[13];
      out[14] = a[14];
      out[15] = a[15];
    }
    out[4] = a10 * c + a20 * s;
    out[5] = a11 * c + a21 * s;
    out[6] = a12 * c + a22 * s;
    out[7] = a13 * c + a23 * s;
    out[8] = a20 * c - a10 * s;
    out[9] = a21 * c - a11 * s;
    out[10] = a22 * c - a12 * s;
    out[11] = a23 * c - a13 * s;
    return out;
  }
  function rotateY(out, a, rad) {
    var s = Math.sin(rad);
    var c = Math.cos(rad);
    var a00 = a[0];
    var a01 = a[1];
    var a02 = a[2];
    var a03 = a[3];
    var a20 = a[8];
    var a21 = a[9];
    var a22 = a[10];
    var a23 = a[11];
    if (a !== out) {
      out[4] = a[4];
      out[5] = a[5];
      out[6] = a[6];
      out[7] = a[7];
      out[12] = a[12];
      out[13] = a[13];
      out[14] = a[14];
      out[15] = a[15];
    }
    out[0] = a00 * c - a20 * s;
    out[1] = a01 * c - a21 * s;
    out[2] = a02 * c - a22 * s;
    out[3] = a03 * c - a23 * s;
    out[8] = a00 * s + a20 * c;
    out[9] = a01 * s + a21 * c;
    out[10] = a02 * s + a22 * c;
    out[11] = a03 * s + a23 * c;
    return out;
  }
  function rotateZ(out, a, rad) {
    var s = Math.sin(rad);
    var c = Math.cos(rad);
    var a00 = a[0];
    var a01 = a[1];
    var a02 = a[2];
    var a03 = a[3];
    var a10 = a[4];
    var a11 = a[5];
    var a12 = a[6];
    var a13 = a[7];
    if (a !== out) {
      out[8] = a[8];
      out[9] = a[9];
      out[10] = a[10];
      out[11] = a[11];
      out[12] = a[12];
      out[13] = a[13];
      out[14] = a[14];
      out[15] = a[15];
    }
    out[0] = a00 * c + a10 * s;
    out[1] = a01 * c + a11 * s;
    out[2] = a02 * c + a12 * s;
    out[3] = a03 * c + a13 * s;
    out[4] = a10 * c - a00 * s;
    out[5] = a11 * c - a01 * s;
    out[6] = a12 * c - a02 * s;
    out[7] = a13 * c - a03 * s;
    return out;
  }
  function fromTranslation(out, v2) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = v2[0];
    out[13] = v2[1];
    out[14] = v2[2];
    out[15] = 1;
    return out;
  }
  function fromScaling(out, v2) {
    out[0] = v2[0];
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = v2[1];
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = v2[2];
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  function fromRotation(out, rad, axis) {
    var x2 = axis[0], y2 = axis[1], z2 = axis[2];
    var len5 = Math.hypot(x2, y2, z2);
    var s, c, t;
    if (len5 < EPSILON) {
      return null;
    }
    len5 = 1 / len5;
    x2 *= len5;
    y2 *= len5;
    z2 *= len5;
    s = Math.sin(rad);
    c = Math.cos(rad);
    t = 1 - c;
    out[0] = x2 * x2 * t + c;
    out[1] = y2 * x2 * t + z2 * s;
    out[2] = z2 * x2 * t - y2 * s;
    out[3] = 0;
    out[4] = x2 * y2 * t - z2 * s;
    out[5] = y2 * y2 * t + c;
    out[6] = z2 * y2 * t + x2 * s;
    out[7] = 0;
    out[8] = x2 * z2 * t + y2 * s;
    out[9] = y2 * z2 * t - x2 * s;
    out[10] = z2 * z2 * t + c;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  function fromXRotation(out, rad) {
    var s = Math.sin(rad);
    var c = Math.cos(rad);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = c;
    out[6] = s;
    out[7] = 0;
    out[8] = 0;
    out[9] = -s;
    out[10] = c;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  function fromYRotation(out, rad) {
    var s = Math.sin(rad);
    var c = Math.cos(rad);
    out[0] = c;
    out[1] = 0;
    out[2] = -s;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = s;
    out[9] = 0;
    out[10] = c;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  function fromZRotation(out, rad) {
    var s = Math.sin(rad);
    var c = Math.cos(rad);
    out[0] = c;
    out[1] = s;
    out[2] = 0;
    out[3] = 0;
    out[4] = -s;
    out[5] = c;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  function fromRotationTranslation(out, q2, v2) {
    var x2 = q2[0], y2 = q2[1], z2 = q2[2], w = q2[3];
    var x22 = x2 + x2;
    var y22 = y2 + y2;
    var z22 = z2 + z2;
    var xx = x2 * x22;
    var xy = x2 * y22;
    var xz = x2 * z22;
    var yy = y2 * y22;
    var yz = y2 * z22;
    var zz = z2 * z22;
    var wx = w * x22;
    var wy = w * y22;
    var wz = w * z22;
    out[0] = 1 - (yy + zz);
    out[1] = xy + wz;
    out[2] = xz - wy;
    out[3] = 0;
    out[4] = xy - wz;
    out[5] = 1 - (xx + zz);
    out[6] = yz + wx;
    out[7] = 0;
    out[8] = xz + wy;
    out[9] = yz - wx;
    out[10] = 1 - (xx + yy);
    out[11] = 0;
    out[12] = v2[0];
    out[13] = v2[1];
    out[14] = v2[2];
    out[15] = 1;
    return out;
  }
  function fromQuat2(out, a) {
    var translation = new ARRAY_TYPE(3);
    var bx = -a[0], by = -a[1], bz = -a[2], bw = a[3], ax = a[4], ay = a[5], az = a[6], aw = a[7];
    var magnitude = bx * bx + by * by + bz * bz + bw * bw;
    if (magnitude > 0) {
      translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2 / magnitude;
      translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2 / magnitude;
      translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2 / magnitude;
    } else {
      translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2;
      translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2;
      translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2;
    }
    fromRotationTranslation(out, a, translation);
    return out;
  }
  function getTranslation(out, mat) {
    out[0] = mat[12];
    out[1] = mat[13];
    out[2] = mat[14];
    return out;
  }
  function getScaling(out, mat) {
    var m11 = mat[0];
    var m12 = mat[1];
    var m13 = mat[2];
    var m21 = mat[4];
    var m22 = mat[5];
    var m23 = mat[6];
    var m31 = mat[8];
    var m32 = mat[9];
    var m33 = mat[10];
    out[0] = Math.hypot(m11, m12, m13);
    out[1] = Math.hypot(m21, m22, m23);
    out[2] = Math.hypot(m31, m32, m33);
    return out;
  }
  function getRotation(out, mat) {
    var scaling = new ARRAY_TYPE(3);
    getScaling(scaling, mat);
    var is1 = 1 / scaling[0];
    var is2 = 1 / scaling[1];
    var is3 = 1 / scaling[2];
    var sm11 = mat[0] * is1;
    var sm12 = mat[1] * is2;
    var sm13 = mat[2] * is3;
    var sm21 = mat[4] * is1;
    var sm22 = mat[5] * is2;
    var sm23 = mat[6] * is3;
    var sm31 = mat[8] * is1;
    var sm32 = mat[9] * is2;
    var sm33 = mat[10] * is3;
    var trace = sm11 + sm22 + sm33;
    var S2 = 0;
    if (trace > 0) {
      S2 = Math.sqrt(trace + 1) * 2;
      out[3] = 0.25 * S2;
      out[0] = (sm23 - sm32) / S2;
      out[1] = (sm31 - sm13) / S2;
      out[2] = (sm12 - sm21) / S2;
    } else if (sm11 > sm22 && sm11 > sm33) {
      S2 = Math.sqrt(1 + sm11 - sm22 - sm33) * 2;
      out[3] = (sm23 - sm32) / S2;
      out[0] = 0.25 * S2;
      out[1] = (sm12 + sm21) / S2;
      out[2] = (sm31 + sm13) / S2;
    } else if (sm22 > sm33) {
      S2 = Math.sqrt(1 + sm22 - sm11 - sm33) * 2;
      out[3] = (sm31 - sm13) / S2;
      out[0] = (sm12 + sm21) / S2;
      out[1] = 0.25 * S2;
      out[2] = (sm23 + sm32) / S2;
    } else {
      S2 = Math.sqrt(1 + sm33 - sm11 - sm22) * 2;
      out[3] = (sm12 - sm21) / S2;
      out[0] = (sm31 + sm13) / S2;
      out[1] = (sm23 + sm32) / S2;
      out[2] = 0.25 * S2;
    }
    return out;
  }
  function fromRotationTranslationScale(out, q2, v2, s) {
    var x2 = q2[0], y2 = q2[1], z2 = q2[2], w = q2[3];
    var x22 = x2 + x2;
    var y22 = y2 + y2;
    var z22 = z2 + z2;
    var xx = x2 * x22;
    var xy = x2 * y22;
    var xz = x2 * z22;
    var yy = y2 * y22;
    var yz = y2 * z22;
    var zz = z2 * z22;
    var wx = w * x22;
    var wy = w * y22;
    var wz = w * z22;
    var sx = s[0];
    var sy = s[1];
    var sz = s[2];
    out[0] = (1 - (yy + zz)) * sx;
    out[1] = (xy + wz) * sx;
    out[2] = (xz - wy) * sx;
    out[3] = 0;
    out[4] = (xy - wz) * sy;
    out[5] = (1 - (xx + zz)) * sy;
    out[6] = (yz + wx) * sy;
    out[7] = 0;
    out[8] = (xz + wy) * sz;
    out[9] = (yz - wx) * sz;
    out[10] = (1 - (xx + yy)) * sz;
    out[11] = 0;
    out[12] = v2[0];
    out[13] = v2[1];
    out[14] = v2[2];
    out[15] = 1;
    return out;
  }
  function fromRotationTranslationScaleOrigin(out, q2, v2, s, o) {
    var x2 = q2[0], y2 = q2[1], z2 = q2[2], w = q2[3];
    var x22 = x2 + x2;
    var y22 = y2 + y2;
    var z22 = z2 + z2;
    var xx = x2 * x22;
    var xy = x2 * y22;
    var xz = x2 * z22;
    var yy = y2 * y22;
    var yz = y2 * z22;
    var zz = z2 * z22;
    var wx = w * x22;
    var wy = w * y22;
    var wz = w * z22;
    var sx = s[0];
    var sy = s[1];
    var sz = s[2];
    var ox = o[0];
    var oy = o[1];
    var oz = o[2];
    var out0 = (1 - (yy + zz)) * sx;
    var out1 = (xy + wz) * sx;
    var out2 = (xz - wy) * sx;
    var out4 = (xy - wz) * sy;
    var out5 = (1 - (xx + zz)) * sy;
    var out6 = (yz + wx) * sy;
    var out8 = (xz + wy) * sz;
    var out9 = (yz - wx) * sz;
    var out10 = (1 - (xx + yy)) * sz;
    out[0] = out0;
    out[1] = out1;
    out[2] = out2;
    out[3] = 0;
    out[4] = out4;
    out[5] = out5;
    out[6] = out6;
    out[7] = 0;
    out[8] = out8;
    out[9] = out9;
    out[10] = out10;
    out[11] = 0;
    out[12] = v2[0] + ox - (out0 * ox + out4 * oy + out8 * oz);
    out[13] = v2[1] + oy - (out1 * ox + out5 * oy + out9 * oz);
    out[14] = v2[2] + oz - (out2 * ox + out6 * oy + out10 * oz);
    out[15] = 1;
    return out;
  }
  function fromQuat(out, q2) {
    var x2 = q2[0], y2 = q2[1], z2 = q2[2], w = q2[3];
    var x22 = x2 + x2;
    var y22 = y2 + y2;
    var z22 = z2 + z2;
    var xx = x2 * x22;
    var yx = y2 * x22;
    var yy = y2 * y22;
    var zx = z2 * x22;
    var zy = z2 * y22;
    var zz = z2 * z22;
    var wx = w * x22;
    var wy = w * y22;
    var wz = w * z22;
    out[0] = 1 - yy - zz;
    out[1] = yx + wz;
    out[2] = zx - wy;
    out[3] = 0;
    out[4] = yx - wz;
    out[5] = 1 - xx - zz;
    out[6] = zy + wx;
    out[7] = 0;
    out[8] = zx + wy;
    out[9] = zy - wx;
    out[10] = 1 - xx - yy;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  function frustum(out, left, right, bottom, top, near, far) {
    var rl = 1 / (right - left);
    var tb = 1 / (top - bottom);
    var nf = 1 / (near - far);
    out[0] = near * 2 * rl;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = near * 2 * tb;
    out[6] = 0;
    out[7] = 0;
    out[8] = (right + left) * rl;
    out[9] = (top + bottom) * tb;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = far * near * 2 * nf;
    out[15] = 0;
    return out;
  }
  function perspectiveNO(out, fovy, aspect, near, far) {
    var f2 = 1 / Math.tan(fovy / 2), nf;
    out[0] = f2 / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f2;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[15] = 0;
    if (far != null && far !== Infinity) {
      nf = 1 / (near - far);
      out[10] = (far + near) * nf;
      out[14] = 2 * far * near * nf;
    } else {
      out[10] = -1;
      out[14] = -2 * near;
    }
    return out;
  }
  var perspective = perspectiveNO;
  function perspectiveZO(out, fovy, aspect, near, far) {
    var f2 = 1 / Math.tan(fovy / 2), nf;
    out[0] = f2 / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f2;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[15] = 0;
    if (far != null && far !== Infinity) {
      nf = 1 / (near - far);
      out[10] = far * nf;
      out[14] = far * near * nf;
    } else {
      out[10] = -1;
      out[14] = -near;
    }
    return out;
  }
  function perspectiveFromFieldOfView(out, fov, near, far) {
    var upTan = Math.tan(fov.upDegrees * Math.PI / 180);
    var downTan = Math.tan(fov.downDegrees * Math.PI / 180);
    var leftTan = Math.tan(fov.leftDegrees * Math.PI / 180);
    var rightTan = Math.tan(fov.rightDegrees * Math.PI / 180);
    var xScale = 2 / (leftTan + rightTan);
    var yScale = 2 / (upTan + downTan);
    out[0] = xScale;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = yScale;
    out[6] = 0;
    out[7] = 0;
    out[8] = -((leftTan - rightTan) * xScale * 0.5);
    out[9] = (upTan - downTan) * yScale * 0.5;
    out[10] = far / (near - far);
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = far * near / (near - far);
    out[15] = 0;
    return out;
  }
  function orthoNO(out, left, right, bottom, top, near, far) {
    var lr = 1 / (left - right);
    var bt = 1 / (bottom - top);
    var nf = 1 / (near - far);
    out[0] = -2 * lr;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = -2 * bt;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 2 * nf;
    out[11] = 0;
    out[12] = (left + right) * lr;
    out[13] = (top + bottom) * bt;
    out[14] = (far + near) * nf;
    out[15] = 1;
    return out;
  }
  var ortho = orthoNO;
  function orthoZO(out, left, right, bottom, top, near, far) {
    var lr = 1 / (left - right);
    var bt = 1 / (bottom - top);
    var nf = 1 / (near - far);
    out[0] = -2 * lr;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = -2 * bt;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = nf;
    out[11] = 0;
    out[12] = (left + right) * lr;
    out[13] = (top + bottom) * bt;
    out[14] = near * nf;
    out[15] = 1;
    return out;
  }
  function lookAt(out, eye, center, up) {
    var x0, x1, x2, y0, y1, y2, z0, z1, z2, len5;
    var eyex = eye[0];
    var eyey = eye[1];
    var eyez = eye[2];
    var upx = up[0];
    var upy = up[1];
    var upz = up[2];
    var centerx = center[0];
    var centery = center[1];
    var centerz = center[2];
    if (Math.abs(eyex - centerx) < EPSILON && Math.abs(eyey - centery) < EPSILON && Math.abs(eyez - centerz) < EPSILON) {
      return identity(out);
    }
    z0 = eyex - centerx;
    z1 = eyey - centery;
    z2 = eyez - centerz;
    len5 = 1 / Math.hypot(z0, z1, z2);
    z0 *= len5;
    z1 *= len5;
    z2 *= len5;
    x0 = upy * z2 - upz * z1;
    x1 = upz * z0 - upx * z2;
    x2 = upx * z1 - upy * z0;
    len5 = Math.hypot(x0, x1, x2);
    if (!len5) {
      x0 = 0;
      x1 = 0;
      x2 = 0;
    } else {
      len5 = 1 / len5;
      x0 *= len5;
      x1 *= len5;
      x2 *= len5;
    }
    y0 = z1 * x2 - z2 * x1;
    y1 = z2 * x0 - z0 * x2;
    y2 = z0 * x1 - z1 * x0;
    len5 = Math.hypot(y0, y1, y2);
    if (!len5) {
      y0 = 0;
      y1 = 0;
      y2 = 0;
    } else {
      len5 = 1 / len5;
      y0 *= len5;
      y1 *= len5;
      y2 *= len5;
    }
    out[0] = x0;
    out[1] = y0;
    out[2] = z0;
    out[3] = 0;
    out[4] = x1;
    out[5] = y1;
    out[6] = z1;
    out[7] = 0;
    out[8] = x2;
    out[9] = y2;
    out[10] = z2;
    out[11] = 0;
    out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
    out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
    out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
    out[15] = 1;
    return out;
  }
  function targetTo(out, eye, target, up) {
    var eyex = eye[0], eyey = eye[1], eyez = eye[2], upx = up[0], upy = up[1], upz = up[2];
    var z0 = eyex - target[0], z1 = eyey - target[1], z2 = eyez - target[2];
    var len5 = z0 * z0 + z1 * z1 + z2 * z2;
    if (len5 > 0) {
      len5 = 1 / Math.sqrt(len5);
      z0 *= len5;
      z1 *= len5;
      z2 *= len5;
    }
    var x0 = upy * z2 - upz * z1, x1 = upz * z0 - upx * z2, x2 = upx * z1 - upy * z0;
    len5 = x0 * x0 + x1 * x1 + x2 * x2;
    if (len5 > 0) {
      len5 = 1 / Math.sqrt(len5);
      x0 *= len5;
      x1 *= len5;
      x2 *= len5;
    }
    out[0] = x0;
    out[1] = x1;
    out[2] = x2;
    out[3] = 0;
    out[4] = z1 * x2 - z2 * x1;
    out[5] = z2 * x0 - z0 * x2;
    out[6] = z0 * x1 - z1 * x0;
    out[7] = 0;
    out[8] = z0;
    out[9] = z1;
    out[10] = z2;
    out[11] = 0;
    out[12] = eyex;
    out[13] = eyey;
    out[14] = eyez;
    out[15] = 1;
    return out;
  }
  function str(a) {
    return "mat4(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ", " + a[4] + ", " + a[5] + ", " + a[6] + ", " + a[7] + ", " + a[8] + ", " + a[9] + ", " + a[10] + ", " + a[11] + ", " + a[12] + ", " + a[13] + ", " + a[14] + ", " + a[15] + ")";
  }
  function frob(a) {
    return Math.hypot(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8], a[9], a[10], a[11], a[12], a[13], a[14], a[15]);
  }
  function add(out, a, b2) {
    out[0] = a[0] + b2[0];
    out[1] = a[1] + b2[1];
    out[2] = a[2] + b2[2];
    out[3] = a[3] + b2[3];
    out[4] = a[4] + b2[4];
    out[5] = a[5] + b2[5];
    out[6] = a[6] + b2[6];
    out[7] = a[7] + b2[7];
    out[8] = a[8] + b2[8];
    out[9] = a[9] + b2[9];
    out[10] = a[10] + b2[10];
    out[11] = a[11] + b2[11];
    out[12] = a[12] + b2[12];
    out[13] = a[13] + b2[13];
    out[14] = a[14] + b2[14];
    out[15] = a[15] + b2[15];
    return out;
  }
  function subtract(out, a, b2) {
    out[0] = a[0] - b2[0];
    out[1] = a[1] - b2[1];
    out[2] = a[2] - b2[2];
    out[3] = a[3] - b2[3];
    out[4] = a[4] - b2[4];
    out[5] = a[5] - b2[5];
    out[6] = a[6] - b2[6];
    out[7] = a[7] - b2[7];
    out[8] = a[8] - b2[8];
    out[9] = a[9] - b2[9];
    out[10] = a[10] - b2[10];
    out[11] = a[11] - b2[11];
    out[12] = a[12] - b2[12];
    out[13] = a[13] - b2[13];
    out[14] = a[14] - b2[14];
    out[15] = a[15] - b2[15];
    return out;
  }
  function multiplyScalar(out, a, b2) {
    out[0] = a[0] * b2;
    out[1] = a[1] * b2;
    out[2] = a[2] * b2;
    out[3] = a[3] * b2;
    out[4] = a[4] * b2;
    out[5] = a[5] * b2;
    out[6] = a[6] * b2;
    out[7] = a[7] * b2;
    out[8] = a[8] * b2;
    out[9] = a[9] * b2;
    out[10] = a[10] * b2;
    out[11] = a[11] * b2;
    out[12] = a[12] * b2;
    out[13] = a[13] * b2;
    out[14] = a[14] * b2;
    out[15] = a[15] * b2;
    return out;
  }
  function multiplyScalarAndAdd(out, a, b2, scale7) {
    out[0] = a[0] + b2[0] * scale7;
    out[1] = a[1] + b2[1] * scale7;
    out[2] = a[2] + b2[2] * scale7;
    out[3] = a[3] + b2[3] * scale7;
    out[4] = a[4] + b2[4] * scale7;
    out[5] = a[5] + b2[5] * scale7;
    out[6] = a[6] + b2[6] * scale7;
    out[7] = a[7] + b2[7] * scale7;
    out[8] = a[8] + b2[8] * scale7;
    out[9] = a[9] + b2[9] * scale7;
    out[10] = a[10] + b2[10] * scale7;
    out[11] = a[11] + b2[11] * scale7;
    out[12] = a[12] + b2[12] * scale7;
    out[13] = a[13] + b2[13] * scale7;
    out[14] = a[14] + b2[14] * scale7;
    out[15] = a[15] + b2[15] * scale7;
    return out;
  }
  function exactEquals(a, b2) {
    return a[0] === b2[0] && a[1] === b2[1] && a[2] === b2[2] && a[3] === b2[3] && a[4] === b2[4] && a[5] === b2[5] && a[6] === b2[6] && a[7] === b2[7] && a[8] === b2[8] && a[9] === b2[9] && a[10] === b2[10] && a[11] === b2[11] && a[12] === b2[12] && a[13] === b2[13] && a[14] === b2[14] && a[15] === b2[15];
  }
  function equals(a, b2) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
    var a4 = a[4], a5 = a[5], a6 = a[6], a7 = a[7];
    var a8 = a[8], a9 = a[9], a10 = a[10], a11 = a[11];
    var a12 = a[12], a13 = a[13], a14 = a[14], a15 = a[15];
    var b0 = b2[0], b1 = b2[1], b22 = b2[2], b3 = b2[3];
    var b4 = b2[4], b5 = b2[5], b6 = b2[6], b7 = b2[7];
    var b8 = b2[8], b9 = b2[9], b10 = b2[10], b11 = b2[11];
    var b12 = b2[12], b13 = b2[13], b14 = b2[14], b15 = b2[15];
    return Math.abs(a0 - b0) <= EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b22) <= EPSILON * Math.max(1, Math.abs(a2), Math.abs(b22)) && Math.abs(a3 - b3) <= EPSILON * Math.max(1, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= EPSILON * Math.max(1, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= EPSILON * Math.max(1, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= EPSILON * Math.max(1, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= EPSILON * Math.max(1, Math.abs(a7), Math.abs(b7)) && Math.abs(a8 - b8) <= EPSILON * Math.max(1, Math.abs(a8), Math.abs(b8)) && Math.abs(a9 - b9) <= EPSILON * Math.max(1, Math.abs(a9), Math.abs(b9)) && Math.abs(a10 - b10) <= EPSILON * Math.max(1, Math.abs(a10), Math.abs(b10)) && Math.abs(a11 - b11) <= EPSILON * Math.max(1, Math.abs(a11), Math.abs(b11)) && Math.abs(a12 - b12) <= EPSILON * Math.max(1, Math.abs(a12), Math.abs(b12)) && Math.abs(a13 - b13) <= EPSILON * Math.max(1, Math.abs(a13), Math.abs(b13)) && Math.abs(a14 - b14) <= EPSILON * Math.max(1, Math.abs(a14), Math.abs(b14)) && Math.abs(a15 - b15) <= EPSILON * Math.max(1, Math.abs(a15), Math.abs(b15));
  }
  var mul = multiply;
  var sub = subtract;

  // node_modules/gl-matrix/esm/quat.js
  var quat_exports = {};
  __export(quat_exports, {
    add: () => add4,
    calculateW: () => calculateW,
    clone: () => clone4,
    conjugate: () => conjugate,
    copy: () => copy4,
    create: () => create5,
    dot: () => dot3,
    equals: () => equals4,
    exactEquals: () => exactEquals4,
    exp: () => exp,
    fromEuler: () => fromEuler,
    fromMat3: () => fromMat3,
    fromValues: () => fromValues4,
    getAngle: () => getAngle,
    getAxisAngle: () => getAxisAngle,
    identity: () => identity2,
    invert: () => invert2,
    len: () => len2,
    length: () => length3,
    lerp: () => lerp3,
    ln: () => ln,
    mul: () => mul3,
    multiply: () => multiply3,
    normalize: () => normalize3,
    pow: () => pow,
    random: () => random2,
    rotateX: () => rotateX3,
    rotateY: () => rotateY3,
    rotateZ: () => rotateZ3,
    rotationTo: () => rotationTo,
    scale: () => scale4,
    set: () => set4,
    setAxes: () => setAxes,
    setAxisAngle: () => setAxisAngle,
    slerp: () => slerp,
    sqlerp: () => sqlerp,
    sqrLen: () => sqrLen2,
    squaredLength: () => squaredLength3,
    str: () => str3
  });

  // node_modules/gl-matrix/esm/vec3.js
  var vec3_exports = {};
  __export(vec3_exports, {
    add: () => add2,
    angle: () => angle,
    bezier: () => bezier,
    ceil: () => ceil,
    clone: () => clone2,
    copy: () => copy2,
    create: () => create3,
    cross: () => cross,
    dist: () => dist,
    distance: () => distance,
    div: () => div,
    divide: () => divide,
    dot: () => dot,
    equals: () => equals2,
    exactEquals: () => exactEquals2,
    floor: () => floor,
    forEach: () => forEach,
    fromValues: () => fromValues2,
    hermite: () => hermite,
    inverse: () => inverse,
    len: () => len,
    length: () => length,
    lerp: () => lerp,
    max: () => max,
    min: () => min,
    mul: () => mul2,
    multiply: () => multiply2,
    negate: () => negate,
    normalize: () => normalize,
    random: () => random,
    rotateX: () => rotateX2,
    rotateY: () => rotateY2,
    rotateZ: () => rotateZ2,
    round: () => round,
    scale: () => scale2,
    scaleAndAdd: () => scaleAndAdd,
    set: () => set2,
    sqrDist: () => sqrDist,
    sqrLen: () => sqrLen,
    squaredDistance: () => squaredDistance,
    squaredLength: () => squaredLength,
    str: () => str2,
    sub: () => sub2,
    subtract: () => subtract2,
    transformMat3: () => transformMat3,
    transformMat4: () => transformMat4,
    transformQuat: () => transformQuat,
    zero: () => zero
  });
  function create3() {
    var out = new ARRAY_TYPE(3);
    if (ARRAY_TYPE != Float32Array) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
    }
    return out;
  }
  function clone2(a) {
    var out = new ARRAY_TYPE(3);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out;
  }
  function length(a) {
    var x2 = a[0];
    var y2 = a[1];
    var z2 = a[2];
    return Math.hypot(x2, y2, z2);
  }
  function fromValues2(x2, y2, z2) {
    var out = new ARRAY_TYPE(3);
    out[0] = x2;
    out[1] = y2;
    out[2] = z2;
    return out;
  }
  function copy2(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out;
  }
  function set2(out, x2, y2, z2) {
    out[0] = x2;
    out[1] = y2;
    out[2] = z2;
    return out;
  }
  function add2(out, a, b2) {
    out[0] = a[0] + b2[0];
    out[1] = a[1] + b2[1];
    out[2] = a[2] + b2[2];
    return out;
  }
  function subtract2(out, a, b2) {
    out[0] = a[0] - b2[0];
    out[1] = a[1] - b2[1];
    out[2] = a[2] - b2[2];
    return out;
  }
  function multiply2(out, a, b2) {
    out[0] = a[0] * b2[0];
    out[1] = a[1] * b2[1];
    out[2] = a[2] * b2[2];
    return out;
  }
  function divide(out, a, b2) {
    out[0] = a[0] / b2[0];
    out[1] = a[1] / b2[1];
    out[2] = a[2] / b2[2];
    return out;
  }
  function ceil(out, a) {
    out[0] = Math.ceil(a[0]);
    out[1] = Math.ceil(a[1]);
    out[2] = Math.ceil(a[2]);
    return out;
  }
  function floor(out, a) {
    out[0] = Math.floor(a[0]);
    out[1] = Math.floor(a[1]);
    out[2] = Math.floor(a[2]);
    return out;
  }
  function min(out, a, b2) {
    out[0] = Math.min(a[0], b2[0]);
    out[1] = Math.min(a[1], b2[1]);
    out[2] = Math.min(a[2], b2[2]);
    return out;
  }
  function max(out, a, b2) {
    out[0] = Math.max(a[0], b2[0]);
    out[1] = Math.max(a[1], b2[1]);
    out[2] = Math.max(a[2], b2[2]);
    return out;
  }
  function round(out, a) {
    out[0] = Math.round(a[0]);
    out[1] = Math.round(a[1]);
    out[2] = Math.round(a[2]);
    return out;
  }
  function scale2(out, a, b2) {
    out[0] = a[0] * b2;
    out[1] = a[1] * b2;
    out[2] = a[2] * b2;
    return out;
  }
  function scaleAndAdd(out, a, b2, scale7) {
    out[0] = a[0] + b2[0] * scale7;
    out[1] = a[1] + b2[1] * scale7;
    out[2] = a[2] + b2[2] * scale7;
    return out;
  }
  function distance(a, b2) {
    var x2 = b2[0] - a[0];
    var y2 = b2[1] - a[1];
    var z2 = b2[2] - a[2];
    return Math.hypot(x2, y2, z2);
  }
  function squaredDistance(a, b2) {
    var x2 = b2[0] - a[0];
    var y2 = b2[1] - a[1];
    var z2 = b2[2] - a[2];
    return x2 * x2 + y2 * y2 + z2 * z2;
  }
  function squaredLength(a) {
    var x2 = a[0];
    var y2 = a[1];
    var z2 = a[2];
    return x2 * x2 + y2 * y2 + z2 * z2;
  }
  function negate(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    return out;
  }
  function inverse(out, a) {
    out[0] = 1 / a[0];
    out[1] = 1 / a[1];
    out[2] = 1 / a[2];
    return out;
  }
  function normalize(out, a) {
    var x2 = a[0];
    var y2 = a[1];
    var z2 = a[2];
    var len5 = x2 * x2 + y2 * y2 + z2 * z2;
    if (len5 > 0) {
      len5 = 1 / Math.sqrt(len5);
    }
    out[0] = a[0] * len5;
    out[1] = a[1] * len5;
    out[2] = a[2] * len5;
    return out;
  }
  function dot(a, b2) {
    return a[0] * b2[0] + a[1] * b2[1] + a[2] * b2[2];
  }
  function cross(out, a, b2) {
    var ax = a[0], ay = a[1], az = a[2];
    var bx = b2[0], by = b2[1], bz = b2[2];
    out[0] = ay * bz - az * by;
    out[1] = az * bx - ax * bz;
    out[2] = ax * by - ay * bx;
    return out;
  }
  function lerp(out, a, b2, t) {
    var ax = a[0];
    var ay = a[1];
    var az = a[2];
    out[0] = ax + t * (b2[0] - ax);
    out[1] = ay + t * (b2[1] - ay);
    out[2] = az + t * (b2[2] - az);
    return out;
  }
  function hermite(out, a, b2, c, d2, t) {
    var factorTimes2 = t * t;
    var factor1 = factorTimes2 * (2 * t - 3) + 1;
    var factor2 = factorTimes2 * (t - 2) + t;
    var factor3 = factorTimes2 * (t - 1);
    var factor4 = factorTimes2 * (3 - 2 * t);
    out[0] = a[0] * factor1 + b2[0] * factor2 + c[0] * factor3 + d2[0] * factor4;
    out[1] = a[1] * factor1 + b2[1] * factor2 + c[1] * factor3 + d2[1] * factor4;
    out[2] = a[2] * factor1 + b2[2] * factor2 + c[2] * factor3 + d2[2] * factor4;
    return out;
  }
  function bezier(out, a, b2, c, d2, t) {
    var inverseFactor = 1 - t;
    var inverseFactorTimesTwo = inverseFactor * inverseFactor;
    var factorTimes2 = t * t;
    var factor1 = inverseFactorTimesTwo * inverseFactor;
    var factor2 = 3 * t * inverseFactorTimesTwo;
    var factor3 = 3 * factorTimes2 * inverseFactor;
    var factor4 = factorTimes2 * t;
    out[0] = a[0] * factor1 + b2[0] * factor2 + c[0] * factor3 + d2[0] * factor4;
    out[1] = a[1] * factor1 + b2[1] * factor2 + c[1] * factor3 + d2[1] * factor4;
    out[2] = a[2] * factor1 + b2[2] * factor2 + c[2] * factor3 + d2[2] * factor4;
    return out;
  }
  function random(out, scale7) {
    scale7 = scale7 || 1;
    var r = RANDOM() * 2 * Math.PI;
    var z2 = RANDOM() * 2 - 1;
    var zScale = Math.sqrt(1 - z2 * z2) * scale7;
    out[0] = Math.cos(r) * zScale;
    out[1] = Math.sin(r) * zScale;
    out[2] = z2 * scale7;
    return out;
  }
  function transformMat4(out, a, m2) {
    var x2 = a[0], y2 = a[1], z2 = a[2];
    var w = m2[3] * x2 + m2[7] * y2 + m2[11] * z2 + m2[15];
    w = w || 1;
    out[0] = (m2[0] * x2 + m2[4] * y2 + m2[8] * z2 + m2[12]) / w;
    out[1] = (m2[1] * x2 + m2[5] * y2 + m2[9] * z2 + m2[13]) / w;
    out[2] = (m2[2] * x2 + m2[6] * y2 + m2[10] * z2 + m2[14]) / w;
    return out;
  }
  function transformMat3(out, a, m2) {
    var x2 = a[0], y2 = a[1], z2 = a[2];
    out[0] = x2 * m2[0] + y2 * m2[3] + z2 * m2[6];
    out[1] = x2 * m2[1] + y2 * m2[4] + z2 * m2[7];
    out[2] = x2 * m2[2] + y2 * m2[5] + z2 * m2[8];
    return out;
  }
  function transformQuat(out, a, q2) {
    var qx = q2[0], qy = q2[1], qz = q2[2], qw = q2[3];
    var x2 = a[0], y2 = a[1], z2 = a[2];
    var uvx = qy * z2 - qz * y2, uvy = qz * x2 - qx * z2, uvz = qx * y2 - qy * x2;
    var uuvx = qy * uvz - qz * uvy, uuvy = qz * uvx - qx * uvz, uuvz = qx * uvy - qy * uvx;
    var w2 = qw * 2;
    uvx *= w2;
    uvy *= w2;
    uvz *= w2;
    uuvx *= 2;
    uuvy *= 2;
    uuvz *= 2;
    out[0] = x2 + uvx + uuvx;
    out[1] = y2 + uvy + uuvy;
    out[2] = z2 + uvz + uuvz;
    return out;
  }
  function rotateX2(out, a, b2, rad) {
    var p2 = [], r = [];
    p2[0] = a[0] - b2[0];
    p2[1] = a[1] - b2[1];
    p2[2] = a[2] - b2[2];
    r[0] = p2[0];
    r[1] = p2[1] * Math.cos(rad) - p2[2] * Math.sin(rad);
    r[2] = p2[1] * Math.sin(rad) + p2[2] * Math.cos(rad);
    out[0] = r[0] + b2[0];
    out[1] = r[1] + b2[1];
    out[2] = r[2] + b2[2];
    return out;
  }
  function rotateY2(out, a, b2, rad) {
    var p2 = [], r = [];
    p2[0] = a[0] - b2[0];
    p2[1] = a[1] - b2[1];
    p2[2] = a[2] - b2[2];
    r[0] = p2[2] * Math.sin(rad) + p2[0] * Math.cos(rad);
    r[1] = p2[1];
    r[2] = p2[2] * Math.cos(rad) - p2[0] * Math.sin(rad);
    out[0] = r[0] + b2[0];
    out[1] = r[1] + b2[1];
    out[2] = r[2] + b2[2];
    return out;
  }
  function rotateZ2(out, a, b2, rad) {
    var p2 = [], r = [];
    p2[0] = a[0] - b2[0];
    p2[1] = a[1] - b2[1];
    p2[2] = a[2] - b2[2];
    r[0] = p2[0] * Math.cos(rad) - p2[1] * Math.sin(rad);
    r[1] = p2[0] * Math.sin(rad) + p2[1] * Math.cos(rad);
    r[2] = p2[2];
    out[0] = r[0] + b2[0];
    out[1] = r[1] + b2[1];
    out[2] = r[2] + b2[2];
    return out;
  }
  function angle(a, b2) {
    var ax = a[0], ay = a[1], az = a[2], bx = b2[0], by = b2[1], bz = b2[2], mag1 = Math.sqrt(ax * ax + ay * ay + az * az), mag2 = Math.sqrt(bx * bx + by * by + bz * bz), mag = mag1 * mag2, cosine = mag && dot(a, b2) / mag;
    return Math.acos(Math.min(Math.max(cosine, -1), 1));
  }
  function zero(out) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    return out;
  }
  function str2(a) {
    return "vec3(" + a[0] + ", " + a[1] + ", " + a[2] + ")";
  }
  function exactEquals2(a, b2) {
    return a[0] === b2[0] && a[1] === b2[1] && a[2] === b2[2];
  }
  function equals2(a, b2) {
    var a0 = a[0], a1 = a[1], a2 = a[2];
    var b0 = b2[0], b1 = b2[1], b22 = b2[2];
    return Math.abs(a0 - b0) <= EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b22) <= EPSILON * Math.max(1, Math.abs(a2), Math.abs(b22));
  }
  var sub2 = subtract2;
  var mul2 = multiply2;
  var div = divide;
  var dist = distance;
  var sqrDist = squaredDistance;
  var len = length;
  var sqrLen = squaredLength;
  var forEach = function() {
    var vec = create3();
    return function(a, stride, offset2, count, fn, arg) {
      var i, l;
      if (!stride) {
        stride = 3;
      }
      if (!offset2) {
        offset2 = 0;
      }
      if (count) {
        l = Math.min(count * stride + offset2, a.length);
      } else {
        l = a.length;
      }
      for (i = offset2; i < l; i += stride) {
        vec[0] = a[i];
        vec[1] = a[i + 1];
        vec[2] = a[i + 2];
        fn(vec, vec, arg);
        a[i] = vec[0];
        a[i + 1] = vec[1];
        a[i + 2] = vec[2];
      }
      return a;
    };
  }();

  // node_modules/gl-matrix/esm/vec4.js
  function create4() {
    var out = new ARRAY_TYPE(4);
    if (ARRAY_TYPE != Float32Array) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
    }
    return out;
  }
  function clone3(a) {
    var out = new ARRAY_TYPE(4);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
  }
  function fromValues3(x2, y2, z2, w) {
    var out = new ARRAY_TYPE(4);
    out[0] = x2;
    out[1] = y2;
    out[2] = z2;
    out[3] = w;
    return out;
  }
  function copy3(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
  }
  function set3(out, x2, y2, z2, w) {
    out[0] = x2;
    out[1] = y2;
    out[2] = z2;
    out[3] = w;
    return out;
  }
  function add3(out, a, b2) {
    out[0] = a[0] + b2[0];
    out[1] = a[1] + b2[1];
    out[2] = a[2] + b2[2];
    out[3] = a[3] + b2[3];
    return out;
  }
  function scale3(out, a, b2) {
    out[0] = a[0] * b2;
    out[1] = a[1] * b2;
    out[2] = a[2] * b2;
    out[3] = a[3] * b2;
    return out;
  }
  function length2(a) {
    var x2 = a[0];
    var y2 = a[1];
    var z2 = a[2];
    var w = a[3];
    return Math.hypot(x2, y2, z2, w);
  }
  function squaredLength2(a) {
    var x2 = a[0];
    var y2 = a[1];
    var z2 = a[2];
    var w = a[3];
    return x2 * x2 + y2 * y2 + z2 * z2 + w * w;
  }
  function normalize2(out, a) {
    var x2 = a[0];
    var y2 = a[1];
    var z2 = a[2];
    var w = a[3];
    var len5 = x2 * x2 + y2 * y2 + z2 * z2 + w * w;
    if (len5 > 0) {
      len5 = 1 / Math.sqrt(len5);
    }
    out[0] = x2 * len5;
    out[1] = y2 * len5;
    out[2] = z2 * len5;
    out[3] = w * len5;
    return out;
  }
  function dot2(a, b2) {
    return a[0] * b2[0] + a[1] * b2[1] + a[2] * b2[2] + a[3] * b2[3];
  }
  function lerp2(out, a, b2, t) {
    var ax = a[0];
    var ay = a[1];
    var az = a[2];
    var aw = a[3];
    out[0] = ax + t * (b2[0] - ax);
    out[1] = ay + t * (b2[1] - ay);
    out[2] = az + t * (b2[2] - az);
    out[3] = aw + t * (b2[3] - aw);
    return out;
  }
  function exactEquals3(a, b2) {
    return a[0] === b2[0] && a[1] === b2[1] && a[2] === b2[2] && a[3] === b2[3];
  }
  function equals3(a, b2) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
    var b0 = b2[0], b1 = b2[1], b22 = b2[2], b3 = b2[3];
    return Math.abs(a0 - b0) <= EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b22) <= EPSILON * Math.max(1, Math.abs(a2), Math.abs(b22)) && Math.abs(a3 - b3) <= EPSILON * Math.max(1, Math.abs(a3), Math.abs(b3));
  }
  var forEach2 = function() {
    var vec = create4();
    return function(a, stride, offset2, count, fn, arg) {
      var i, l;
      if (!stride) {
        stride = 4;
      }
      if (!offset2) {
        offset2 = 0;
      }
      if (count) {
        l = Math.min(count * stride + offset2, a.length);
      } else {
        l = a.length;
      }
      for (i = offset2; i < l; i += stride) {
        vec[0] = a[i];
        vec[1] = a[i + 1];
        vec[2] = a[i + 2];
        vec[3] = a[i + 3];
        fn(vec, vec, arg);
        a[i] = vec[0];
        a[i + 1] = vec[1];
        a[i + 2] = vec[2];
        a[i + 3] = vec[3];
      }
      return a;
    };
  }();

  // node_modules/gl-matrix/esm/quat.js
  function create5() {
    var out = new ARRAY_TYPE(4);
    if (ARRAY_TYPE != Float32Array) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
    }
    out[3] = 1;
    return out;
  }
  function identity2(out) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
  }
  function setAxisAngle(out, axis, rad) {
    rad = rad * 0.5;
    var s = Math.sin(rad);
    out[0] = s * axis[0];
    out[1] = s * axis[1];
    out[2] = s * axis[2];
    out[3] = Math.cos(rad);
    return out;
  }
  function getAxisAngle(out_axis, q2) {
    var rad = Math.acos(q2[3]) * 2;
    var s = Math.sin(rad / 2);
    if (s > EPSILON) {
      out_axis[0] = q2[0] / s;
      out_axis[1] = q2[1] / s;
      out_axis[2] = q2[2] / s;
    } else {
      out_axis[0] = 1;
      out_axis[1] = 0;
      out_axis[2] = 0;
    }
    return rad;
  }
  function getAngle(a, b2) {
    var dotproduct = dot3(a, b2);
    return Math.acos(2 * dotproduct * dotproduct - 1);
  }
  function multiply3(out, a, b2) {
    var ax = a[0], ay = a[1], az = a[2], aw = a[3];
    var bx = b2[0], by = b2[1], bz = b2[2], bw = b2[3];
    out[0] = ax * bw + aw * bx + ay * bz - az * by;
    out[1] = ay * bw + aw * by + az * bx - ax * bz;
    out[2] = az * bw + aw * bz + ax * by - ay * bx;
    out[3] = aw * bw - ax * bx - ay * by - az * bz;
    return out;
  }
  function rotateX3(out, a, rad) {
    rad *= 0.5;
    var ax = a[0], ay = a[1], az = a[2], aw = a[3];
    var bx = Math.sin(rad), bw = Math.cos(rad);
    out[0] = ax * bw + aw * bx;
    out[1] = ay * bw + az * bx;
    out[2] = az * bw - ay * bx;
    out[3] = aw * bw - ax * bx;
    return out;
  }
  function rotateY3(out, a, rad) {
    rad *= 0.5;
    var ax = a[0], ay = a[1], az = a[2], aw = a[3];
    var by = Math.sin(rad), bw = Math.cos(rad);
    out[0] = ax * bw - az * by;
    out[1] = ay * bw + aw * by;
    out[2] = az * bw + ax * by;
    out[3] = aw * bw - ay * by;
    return out;
  }
  function rotateZ3(out, a, rad) {
    rad *= 0.5;
    var ax = a[0], ay = a[1], az = a[2], aw = a[3];
    var bz = Math.sin(rad), bw = Math.cos(rad);
    out[0] = ax * bw + ay * bz;
    out[1] = ay * bw - ax * bz;
    out[2] = az * bw + aw * bz;
    out[3] = aw * bw - az * bz;
    return out;
  }
  function calculateW(out, a) {
    var x2 = a[0], y2 = a[1], z2 = a[2];
    out[0] = x2;
    out[1] = y2;
    out[2] = z2;
    out[3] = Math.sqrt(Math.abs(1 - x2 * x2 - y2 * y2 - z2 * z2));
    return out;
  }
  function exp(out, a) {
    var x2 = a[0], y2 = a[1], z2 = a[2], w = a[3];
    var r = Math.sqrt(x2 * x2 + y2 * y2 + z2 * z2);
    var et = Math.exp(w);
    var s = r > 0 ? et * Math.sin(r) / r : 0;
    out[0] = x2 * s;
    out[1] = y2 * s;
    out[2] = z2 * s;
    out[3] = et * Math.cos(r);
    return out;
  }
  function ln(out, a) {
    var x2 = a[0], y2 = a[1], z2 = a[2], w = a[3];
    var r = Math.sqrt(x2 * x2 + y2 * y2 + z2 * z2);
    var t = r > 0 ? Math.atan2(r, w) / r : 0;
    out[0] = x2 * t;
    out[1] = y2 * t;
    out[2] = z2 * t;
    out[3] = 0.5 * Math.log(x2 * x2 + y2 * y2 + z2 * z2 + w * w);
    return out;
  }
  function pow(out, a, b2) {
    ln(out, a);
    scale4(out, out, b2);
    exp(out, out);
    return out;
  }
  function slerp(out, a, b2, t) {
    var ax = a[0], ay = a[1], az = a[2], aw = a[3];
    var bx = b2[0], by = b2[1], bz = b2[2], bw = b2[3];
    var omega, cosom, sinom, scale0, scale1;
    cosom = ax * bx + ay * by + az * bz + aw * bw;
    if (cosom < 0) {
      cosom = -cosom;
      bx = -bx;
      by = -by;
      bz = -bz;
      bw = -bw;
    }
    if (1 - cosom > EPSILON) {
      omega = Math.acos(cosom);
      sinom = Math.sin(omega);
      scale0 = Math.sin((1 - t) * omega) / sinom;
      scale1 = Math.sin(t * omega) / sinom;
    } else {
      scale0 = 1 - t;
      scale1 = t;
    }
    out[0] = scale0 * ax + scale1 * bx;
    out[1] = scale0 * ay + scale1 * by;
    out[2] = scale0 * az + scale1 * bz;
    out[3] = scale0 * aw + scale1 * bw;
    return out;
  }
  function random2(out) {
    var u1 = RANDOM();
    var u2 = RANDOM();
    var u3 = RANDOM();
    var sqrt1MinusU1 = Math.sqrt(1 - u1);
    var sqrtU1 = Math.sqrt(u1);
    out[0] = sqrt1MinusU1 * Math.sin(2 * Math.PI * u2);
    out[1] = sqrt1MinusU1 * Math.cos(2 * Math.PI * u2);
    out[2] = sqrtU1 * Math.sin(2 * Math.PI * u3);
    out[3] = sqrtU1 * Math.cos(2 * Math.PI * u3);
    return out;
  }
  function invert2(out, a) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
    var dot6 = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3;
    var invDot = dot6 ? 1 / dot6 : 0;
    out[0] = -a0 * invDot;
    out[1] = -a1 * invDot;
    out[2] = -a2 * invDot;
    out[3] = a3 * invDot;
    return out;
  }
  function conjugate(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    out[3] = a[3];
    return out;
  }
  function fromMat3(out, m2) {
    var fTrace = m2[0] + m2[4] + m2[8];
    var fRoot;
    if (fTrace > 0) {
      fRoot = Math.sqrt(fTrace + 1);
      out[3] = 0.5 * fRoot;
      fRoot = 0.5 / fRoot;
      out[0] = (m2[5] - m2[7]) * fRoot;
      out[1] = (m2[6] - m2[2]) * fRoot;
      out[2] = (m2[1] - m2[3]) * fRoot;
    } else {
      var i = 0;
      if (m2[4] > m2[0])
        i = 1;
      if (m2[8] > m2[i * 3 + i])
        i = 2;
      var j2 = (i + 1) % 3;
      var k = (i + 2) % 3;
      fRoot = Math.sqrt(m2[i * 3 + i] - m2[j2 * 3 + j2] - m2[k * 3 + k] + 1);
      out[i] = 0.5 * fRoot;
      fRoot = 0.5 / fRoot;
      out[3] = (m2[j2 * 3 + k] - m2[k * 3 + j2]) * fRoot;
      out[j2] = (m2[j2 * 3 + i] + m2[i * 3 + j2]) * fRoot;
      out[k] = (m2[k * 3 + i] + m2[i * 3 + k]) * fRoot;
    }
    return out;
  }
  function fromEuler(out, x2, y2, z2) {
    var halfToRad = 0.5 * Math.PI / 180;
    x2 *= halfToRad;
    y2 *= halfToRad;
    z2 *= halfToRad;
    var sx = Math.sin(x2);
    var cx = Math.cos(x2);
    var sy = Math.sin(y2);
    var cy = Math.cos(y2);
    var sz = Math.sin(z2);
    var cz = Math.cos(z2);
    out[0] = sx * cy * cz - cx * sy * sz;
    out[1] = cx * sy * cz + sx * cy * sz;
    out[2] = cx * cy * sz - sx * sy * cz;
    out[3] = cx * cy * cz + sx * sy * sz;
    return out;
  }
  function str3(a) {
    return "quat(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ")";
  }
  var clone4 = clone3;
  var fromValues4 = fromValues3;
  var copy4 = copy3;
  var set4 = set3;
  var add4 = add3;
  var mul3 = multiply3;
  var scale4 = scale3;
  var dot3 = dot2;
  var lerp3 = lerp2;
  var length3 = length2;
  var len2 = length3;
  var squaredLength3 = squaredLength2;
  var sqrLen2 = squaredLength3;
  var normalize3 = normalize2;
  var exactEquals4 = exactEquals3;
  var equals4 = equals3;
  var rotationTo = function() {
    var tmpvec3 = create3();
    var xUnitVec3 = fromValues2(1, 0, 0);
    var yUnitVec3 = fromValues2(0, 1, 0);
    return function(out, a, b2) {
      var dot6 = dot(a, b2);
      if (dot6 < -0.999999) {
        cross(tmpvec3, xUnitVec3, a);
        if (len(tmpvec3) < 1e-6)
          cross(tmpvec3, yUnitVec3, a);
        normalize(tmpvec3, tmpvec3);
        setAxisAngle(out, tmpvec3, Math.PI);
        return out;
      } else if (dot6 > 0.999999) {
        out[0] = 0;
        out[1] = 0;
        out[2] = 0;
        out[3] = 1;
        return out;
      } else {
        cross(tmpvec3, a, b2);
        out[0] = tmpvec3[0];
        out[1] = tmpvec3[1];
        out[2] = tmpvec3[2];
        out[3] = 1 + dot6;
        return normalize3(out, out);
      }
    };
  }();
  var sqlerp = function() {
    var temp1 = create5();
    var temp2 = create5();
    return function(out, a, b2, c, d2, t) {
      slerp(temp1, a, d2, t);
      slerp(temp2, b2, c, t);
      slerp(out, temp1, temp2, 2 * t * (1 - t));
      return out;
    };
  }();
  var setAxes = function() {
    var matr = create();
    return function(out, view, right, up) {
      matr[0] = right[0];
      matr[3] = right[1];
      matr[6] = right[2];
      matr[1] = up[0];
      matr[4] = up[1];
      matr[7] = up[2];
      matr[2] = -view[0];
      matr[5] = -view[1];
      matr[8] = -view[2];
      return normalize3(out, fromMat3(out, matr));
    };
  }();

  // node_modules/gl-matrix/esm/quat2.js
  var quat2_exports = {};
  __export(quat2_exports, {
    add: () => add5,
    clone: () => clone5,
    conjugate: () => conjugate2,
    copy: () => copy5,
    create: () => create6,
    dot: () => dot4,
    equals: () => equals5,
    exactEquals: () => exactEquals5,
    fromMat4: () => fromMat4,
    fromRotation: () => fromRotation2,
    fromRotationTranslation: () => fromRotationTranslation2,
    fromRotationTranslationValues: () => fromRotationTranslationValues,
    fromTranslation: () => fromTranslation2,
    fromValues: () => fromValues5,
    getDual: () => getDual,
    getReal: () => getReal,
    getTranslation: () => getTranslation2,
    identity: () => identity3,
    invert: () => invert3,
    len: () => len3,
    length: () => length4,
    lerp: () => lerp4,
    mul: () => mul4,
    multiply: () => multiply4,
    normalize: () => normalize4,
    rotateAroundAxis: () => rotateAroundAxis,
    rotateByQuatAppend: () => rotateByQuatAppend,
    rotateByQuatPrepend: () => rotateByQuatPrepend,
    rotateX: () => rotateX4,
    rotateY: () => rotateY4,
    rotateZ: () => rotateZ4,
    scale: () => scale5,
    set: () => set5,
    setDual: () => setDual,
    setReal: () => setReal,
    sqrLen: () => sqrLen3,
    squaredLength: () => squaredLength4,
    str: () => str4,
    translate: () => translate2
  });
  function create6() {
    var dq = new ARRAY_TYPE(8);
    if (ARRAY_TYPE != Float32Array) {
      dq[0] = 0;
      dq[1] = 0;
      dq[2] = 0;
      dq[4] = 0;
      dq[5] = 0;
      dq[6] = 0;
      dq[7] = 0;
    }
    dq[3] = 1;
    return dq;
  }
  function clone5(a) {
    var dq = new ARRAY_TYPE(8);
    dq[0] = a[0];
    dq[1] = a[1];
    dq[2] = a[2];
    dq[3] = a[3];
    dq[4] = a[4];
    dq[5] = a[5];
    dq[6] = a[6];
    dq[7] = a[7];
    return dq;
  }
  function fromValues5(x1, y1, z1, w1, x2, y2, z2, w2) {
    var dq = new ARRAY_TYPE(8);
    dq[0] = x1;
    dq[1] = y1;
    dq[2] = z1;
    dq[3] = w1;
    dq[4] = x2;
    dq[5] = y2;
    dq[6] = z2;
    dq[7] = w2;
    return dq;
  }
  function fromRotationTranslationValues(x1, y1, z1, w1, x2, y2, z2) {
    var dq = new ARRAY_TYPE(8);
    dq[0] = x1;
    dq[1] = y1;
    dq[2] = z1;
    dq[3] = w1;
    var ax = x2 * 0.5, ay = y2 * 0.5, az = z2 * 0.5;
    dq[4] = ax * w1 + ay * z1 - az * y1;
    dq[5] = ay * w1 + az * x1 - ax * z1;
    dq[6] = az * w1 + ax * y1 - ay * x1;
    dq[7] = -ax * x1 - ay * y1 - az * z1;
    return dq;
  }
  function fromRotationTranslation2(out, q2, t) {
    var ax = t[0] * 0.5, ay = t[1] * 0.5, az = t[2] * 0.5, bx = q2[0], by = q2[1], bz = q2[2], bw = q2[3];
    out[0] = bx;
    out[1] = by;
    out[2] = bz;
    out[3] = bw;
    out[4] = ax * bw + ay * bz - az * by;
    out[5] = ay * bw + az * bx - ax * bz;
    out[6] = az * bw + ax * by - ay * bx;
    out[7] = -ax * bx - ay * by - az * bz;
    return out;
  }
  function fromTranslation2(out, t) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    out[4] = t[0] * 0.5;
    out[5] = t[1] * 0.5;
    out[6] = t[2] * 0.5;
    out[7] = 0;
    return out;
  }
  function fromRotation2(out, q2) {
    out[0] = q2[0];
    out[1] = q2[1];
    out[2] = q2[2];
    out[3] = q2[3];
    out[4] = 0;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
    return out;
  }
  function fromMat4(out, a) {
    var outer = create5();
    getRotation(outer, a);
    var t = new ARRAY_TYPE(3);
    getTranslation(t, a);
    fromRotationTranslation2(out, outer, t);
    return out;
  }
  function copy5(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    return out;
  }
  function identity3(out) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    out[4] = 0;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
    return out;
  }
  function set5(out, x1, y1, z1, w1, x2, y2, z2, w2) {
    out[0] = x1;
    out[1] = y1;
    out[2] = z1;
    out[3] = w1;
    out[4] = x2;
    out[5] = y2;
    out[6] = z2;
    out[7] = w2;
    return out;
  }
  var getReal = copy4;
  function getDual(out, a) {
    out[0] = a[4];
    out[1] = a[5];
    out[2] = a[6];
    out[3] = a[7];
    return out;
  }
  var setReal = copy4;
  function setDual(out, q2) {
    out[4] = q2[0];
    out[5] = q2[1];
    out[6] = q2[2];
    out[7] = q2[3];
    return out;
  }
  function getTranslation2(out, a) {
    var ax = a[4], ay = a[5], az = a[6], aw = a[7], bx = -a[0], by = -a[1], bz = -a[2], bw = a[3];
    out[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2;
    out[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2;
    out[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2;
    return out;
  }
  function translate2(out, a, v2) {
    var ax1 = a[0], ay1 = a[1], az1 = a[2], aw1 = a[3], bx1 = v2[0] * 0.5, by1 = v2[1] * 0.5, bz1 = v2[2] * 0.5, ax2 = a[4], ay2 = a[5], az2 = a[6], aw2 = a[7];
    out[0] = ax1;
    out[1] = ay1;
    out[2] = az1;
    out[3] = aw1;
    out[4] = aw1 * bx1 + ay1 * bz1 - az1 * by1 + ax2;
    out[5] = aw1 * by1 + az1 * bx1 - ax1 * bz1 + ay2;
    out[6] = aw1 * bz1 + ax1 * by1 - ay1 * bx1 + az2;
    out[7] = -ax1 * bx1 - ay1 * by1 - az1 * bz1 + aw2;
    return out;
  }
  function rotateX4(out, a, rad) {
    var bx = -a[0], by = -a[1], bz = -a[2], bw = a[3], ax = a[4], ay = a[5], az = a[6], aw = a[7], ax1 = ax * bw + aw * bx + ay * bz - az * by, ay1 = ay * bw + aw * by + az * bx - ax * bz, az1 = az * bw + aw * bz + ax * by - ay * bx, aw1 = aw * bw - ax * bx - ay * by - az * bz;
    rotateX3(out, a, rad);
    bx = out[0];
    by = out[1];
    bz = out[2];
    bw = out[3];
    out[4] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by;
    out[5] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz;
    out[6] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx;
    out[7] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz;
    return out;
  }
  function rotateY4(out, a, rad) {
    var bx = -a[0], by = -a[1], bz = -a[2], bw = a[3], ax = a[4], ay = a[5], az = a[6], aw = a[7], ax1 = ax * bw + aw * bx + ay * bz - az * by, ay1 = ay * bw + aw * by + az * bx - ax * bz, az1 = az * bw + aw * bz + ax * by - ay * bx, aw1 = aw * bw - ax * bx - ay * by - az * bz;
    rotateY3(out, a, rad);
    bx = out[0];
    by = out[1];
    bz = out[2];
    bw = out[3];
    out[4] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by;
    out[5] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz;
    out[6] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx;
    out[7] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz;
    return out;
  }
  function rotateZ4(out, a, rad) {
    var bx = -a[0], by = -a[1], bz = -a[2], bw = a[3], ax = a[4], ay = a[5], az = a[6], aw = a[7], ax1 = ax * bw + aw * bx + ay * bz - az * by, ay1 = ay * bw + aw * by + az * bx - ax * bz, az1 = az * bw + aw * bz + ax * by - ay * bx, aw1 = aw * bw - ax * bx - ay * by - az * bz;
    rotateZ3(out, a, rad);
    bx = out[0];
    by = out[1];
    bz = out[2];
    bw = out[3];
    out[4] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by;
    out[5] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz;
    out[6] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx;
    out[7] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz;
    return out;
  }
  function rotateByQuatAppend(out, a, q2) {
    var qx = q2[0], qy = q2[1], qz = q2[2], qw = q2[3], ax = a[0], ay = a[1], az = a[2], aw = a[3];
    out[0] = ax * qw + aw * qx + ay * qz - az * qy;
    out[1] = ay * qw + aw * qy + az * qx - ax * qz;
    out[2] = az * qw + aw * qz + ax * qy - ay * qx;
    out[3] = aw * qw - ax * qx - ay * qy - az * qz;
    ax = a[4];
    ay = a[5];
    az = a[6];
    aw = a[7];
    out[4] = ax * qw + aw * qx + ay * qz - az * qy;
    out[5] = ay * qw + aw * qy + az * qx - ax * qz;
    out[6] = az * qw + aw * qz + ax * qy - ay * qx;
    out[7] = aw * qw - ax * qx - ay * qy - az * qz;
    return out;
  }
  function rotateByQuatPrepend(out, q2, a) {
    var qx = q2[0], qy = q2[1], qz = q2[2], qw = q2[3], bx = a[0], by = a[1], bz = a[2], bw = a[3];
    out[0] = qx * bw + qw * bx + qy * bz - qz * by;
    out[1] = qy * bw + qw * by + qz * bx - qx * bz;
    out[2] = qz * bw + qw * bz + qx * by - qy * bx;
    out[3] = qw * bw - qx * bx - qy * by - qz * bz;
    bx = a[4];
    by = a[5];
    bz = a[6];
    bw = a[7];
    out[4] = qx * bw + qw * bx + qy * bz - qz * by;
    out[5] = qy * bw + qw * by + qz * bx - qx * bz;
    out[6] = qz * bw + qw * bz + qx * by - qy * bx;
    out[7] = qw * bw - qx * bx - qy * by - qz * bz;
    return out;
  }
  function rotateAroundAxis(out, a, axis, rad) {
    if (Math.abs(rad) < EPSILON) {
      return copy5(out, a);
    }
    var axisLength = Math.hypot(axis[0], axis[1], axis[2]);
    rad = rad * 0.5;
    var s = Math.sin(rad);
    var bx = s * axis[0] / axisLength;
    var by = s * axis[1] / axisLength;
    var bz = s * axis[2] / axisLength;
    var bw = Math.cos(rad);
    var ax1 = a[0], ay1 = a[1], az1 = a[2], aw1 = a[3];
    out[0] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by;
    out[1] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz;
    out[2] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx;
    out[3] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz;
    var ax = a[4], ay = a[5], az = a[6], aw = a[7];
    out[4] = ax * bw + aw * bx + ay * bz - az * by;
    out[5] = ay * bw + aw * by + az * bx - ax * bz;
    out[6] = az * bw + aw * bz + ax * by - ay * bx;
    out[7] = aw * bw - ax * bx - ay * by - az * bz;
    return out;
  }
  function add5(out, a, b2) {
    out[0] = a[0] + b2[0];
    out[1] = a[1] + b2[1];
    out[2] = a[2] + b2[2];
    out[3] = a[3] + b2[3];
    out[4] = a[4] + b2[4];
    out[5] = a[5] + b2[5];
    out[6] = a[6] + b2[6];
    out[7] = a[7] + b2[7];
    return out;
  }
  function multiply4(out, a, b2) {
    var ax0 = a[0], ay0 = a[1], az0 = a[2], aw0 = a[3], bx1 = b2[4], by1 = b2[5], bz1 = b2[6], bw1 = b2[7], ax1 = a[4], ay1 = a[5], az1 = a[6], aw1 = a[7], bx0 = b2[0], by0 = b2[1], bz0 = b2[2], bw0 = b2[3];
    out[0] = ax0 * bw0 + aw0 * bx0 + ay0 * bz0 - az0 * by0;
    out[1] = ay0 * bw0 + aw0 * by0 + az0 * bx0 - ax0 * bz0;
    out[2] = az0 * bw0 + aw0 * bz0 + ax0 * by0 - ay0 * bx0;
    out[3] = aw0 * bw0 - ax0 * bx0 - ay0 * by0 - az0 * bz0;
    out[4] = ax0 * bw1 + aw0 * bx1 + ay0 * bz1 - az0 * by1 + ax1 * bw0 + aw1 * bx0 + ay1 * bz0 - az1 * by0;
    out[5] = ay0 * bw1 + aw0 * by1 + az0 * bx1 - ax0 * bz1 + ay1 * bw0 + aw1 * by0 + az1 * bx0 - ax1 * bz0;
    out[6] = az0 * bw1 + aw0 * bz1 + ax0 * by1 - ay0 * bx1 + az1 * bw0 + aw1 * bz0 + ax1 * by0 - ay1 * bx0;
    out[7] = aw0 * bw1 - ax0 * bx1 - ay0 * by1 - az0 * bz1 + aw1 * bw0 - ax1 * bx0 - ay1 * by0 - az1 * bz0;
    return out;
  }
  var mul4 = multiply4;
  function scale5(out, a, b2) {
    out[0] = a[0] * b2;
    out[1] = a[1] * b2;
    out[2] = a[2] * b2;
    out[3] = a[3] * b2;
    out[4] = a[4] * b2;
    out[5] = a[5] * b2;
    out[6] = a[6] * b2;
    out[7] = a[7] * b2;
    return out;
  }
  var dot4 = dot3;
  function lerp4(out, a, b2, t) {
    var mt = 1 - t;
    if (dot4(a, b2) < 0)
      t = -t;
    out[0] = a[0] * mt + b2[0] * t;
    out[1] = a[1] * mt + b2[1] * t;
    out[2] = a[2] * mt + b2[2] * t;
    out[3] = a[3] * mt + b2[3] * t;
    out[4] = a[4] * mt + b2[4] * t;
    out[5] = a[5] * mt + b2[5] * t;
    out[6] = a[6] * mt + b2[6] * t;
    out[7] = a[7] * mt + b2[7] * t;
    return out;
  }
  function invert3(out, a) {
    var sqlen = squaredLength4(a);
    out[0] = -a[0] / sqlen;
    out[1] = -a[1] / sqlen;
    out[2] = -a[2] / sqlen;
    out[3] = a[3] / sqlen;
    out[4] = -a[4] / sqlen;
    out[5] = -a[5] / sqlen;
    out[6] = -a[6] / sqlen;
    out[7] = a[7] / sqlen;
    return out;
  }
  function conjugate2(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    out[3] = a[3];
    out[4] = -a[4];
    out[5] = -a[5];
    out[6] = -a[6];
    out[7] = a[7];
    return out;
  }
  var length4 = length3;
  var len3 = length4;
  var squaredLength4 = squaredLength3;
  var sqrLen3 = squaredLength4;
  function normalize4(out, a) {
    var magnitude = squaredLength4(a);
    if (magnitude > 0) {
      magnitude = Math.sqrt(magnitude);
      var a0 = a[0] / magnitude;
      var a1 = a[1] / magnitude;
      var a2 = a[2] / magnitude;
      var a3 = a[3] / magnitude;
      var b0 = a[4];
      var b1 = a[5];
      var b2 = a[6];
      var b3 = a[7];
      var a_dot_b = a0 * b0 + a1 * b1 + a2 * b2 + a3 * b3;
      out[0] = a0;
      out[1] = a1;
      out[2] = a2;
      out[3] = a3;
      out[4] = (b0 - a0 * a_dot_b) / magnitude;
      out[5] = (b1 - a1 * a_dot_b) / magnitude;
      out[6] = (b2 - a2 * a_dot_b) / magnitude;
      out[7] = (b3 - a3 * a_dot_b) / magnitude;
    }
    return out;
  }
  function str4(a) {
    return "quat2(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ", " + a[4] + ", " + a[5] + ", " + a[6] + ", " + a[7] + ")";
  }
  function exactEquals5(a, b2) {
    return a[0] === b2[0] && a[1] === b2[1] && a[2] === b2[2] && a[3] === b2[3] && a[4] === b2[4] && a[5] === b2[5] && a[6] === b2[6] && a[7] === b2[7];
  }
  function equals5(a, b2) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5], a6 = a[6], a7 = a[7];
    var b0 = b2[0], b1 = b2[1], b22 = b2[2], b3 = b2[3], b4 = b2[4], b5 = b2[5], b6 = b2[6], b7 = b2[7];
    return Math.abs(a0 - b0) <= EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b22) <= EPSILON * Math.max(1, Math.abs(a2), Math.abs(b22)) && Math.abs(a3 - b3) <= EPSILON * Math.max(1, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= EPSILON * Math.max(1, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= EPSILON * Math.max(1, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= EPSILON * Math.max(1, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= EPSILON * Math.max(1, Math.abs(a7), Math.abs(b7));
  }

  // node_modules/gl-matrix/esm/vec2.js
  var vec2_exports = {};
  __export(vec2_exports, {
    add: () => add6,
    angle: () => angle2,
    ceil: () => ceil2,
    clone: () => clone6,
    copy: () => copy6,
    create: () => create7,
    cross: () => cross2,
    dist: () => dist2,
    distance: () => distance2,
    div: () => div2,
    divide: () => divide2,
    dot: () => dot5,
    equals: () => equals6,
    exactEquals: () => exactEquals6,
    floor: () => floor2,
    forEach: () => forEach3,
    fromValues: () => fromValues6,
    inverse: () => inverse2,
    len: () => len4,
    length: () => length5,
    lerp: () => lerp5,
    max: () => max2,
    min: () => min2,
    mul: () => mul5,
    multiply: () => multiply5,
    negate: () => negate2,
    normalize: () => normalize5,
    random: () => random3,
    rotate: () => rotate2,
    round: () => round2,
    scale: () => scale6,
    scaleAndAdd: () => scaleAndAdd2,
    set: () => set6,
    sqrDist: () => sqrDist2,
    sqrLen: () => sqrLen4,
    squaredDistance: () => squaredDistance2,
    squaredLength: () => squaredLength5,
    str: () => str5,
    sub: () => sub3,
    subtract: () => subtract3,
    transformMat2: () => transformMat2,
    transformMat2d: () => transformMat2d,
    transformMat3: () => transformMat32,
    transformMat4: () => transformMat42,
    zero: () => zero2
  });
  function create7() {
    var out = new ARRAY_TYPE(2);
    if (ARRAY_TYPE != Float32Array) {
      out[0] = 0;
      out[1] = 0;
    }
    return out;
  }
  function clone6(a) {
    var out = new ARRAY_TYPE(2);
    out[0] = a[0];
    out[1] = a[1];
    return out;
  }
  function fromValues6(x2, y2) {
    var out = new ARRAY_TYPE(2);
    out[0] = x2;
    out[1] = y2;
    return out;
  }
  function copy6(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    return out;
  }
  function set6(out, x2, y2) {
    out[0] = x2;
    out[1] = y2;
    return out;
  }
  function add6(out, a, b2) {
    out[0] = a[0] + b2[0];
    out[1] = a[1] + b2[1];
    return out;
  }
  function subtract3(out, a, b2) {
    out[0] = a[0] - b2[0];
    out[1] = a[1] - b2[1];
    return out;
  }
  function multiply5(out, a, b2) {
    out[0] = a[0] * b2[0];
    out[1] = a[1] * b2[1];
    return out;
  }
  function divide2(out, a, b2) {
    out[0] = a[0] / b2[0];
    out[1] = a[1] / b2[1];
    return out;
  }
  function ceil2(out, a) {
    out[0] = Math.ceil(a[0]);
    out[1] = Math.ceil(a[1]);
    return out;
  }
  function floor2(out, a) {
    out[0] = Math.floor(a[0]);
    out[1] = Math.floor(a[1]);
    return out;
  }
  function min2(out, a, b2) {
    out[0] = Math.min(a[0], b2[0]);
    out[1] = Math.min(a[1], b2[1]);
    return out;
  }
  function max2(out, a, b2) {
    out[0] = Math.max(a[0], b2[0]);
    out[1] = Math.max(a[1], b2[1]);
    return out;
  }
  function round2(out, a) {
    out[0] = Math.round(a[0]);
    out[1] = Math.round(a[1]);
    return out;
  }
  function scale6(out, a, b2) {
    out[0] = a[0] * b2;
    out[1] = a[1] * b2;
    return out;
  }
  function scaleAndAdd2(out, a, b2, scale7) {
    out[0] = a[0] + b2[0] * scale7;
    out[1] = a[1] + b2[1] * scale7;
    return out;
  }
  function distance2(a, b2) {
    var x2 = b2[0] - a[0], y2 = b2[1] - a[1];
    return Math.hypot(x2, y2);
  }
  function squaredDistance2(a, b2) {
    var x2 = b2[0] - a[0], y2 = b2[1] - a[1];
    return x2 * x2 + y2 * y2;
  }
  function length5(a) {
    var x2 = a[0], y2 = a[1];
    return Math.hypot(x2, y2);
  }
  function squaredLength5(a) {
    var x2 = a[0], y2 = a[1];
    return x2 * x2 + y2 * y2;
  }
  function negate2(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    return out;
  }
  function inverse2(out, a) {
    out[0] = 1 / a[0];
    out[1] = 1 / a[1];
    return out;
  }
  function normalize5(out, a) {
    var x2 = a[0], y2 = a[1];
    var len5 = x2 * x2 + y2 * y2;
    if (len5 > 0) {
      len5 = 1 / Math.sqrt(len5);
    }
    out[0] = a[0] * len5;
    out[1] = a[1] * len5;
    return out;
  }
  function dot5(a, b2) {
    return a[0] * b2[0] + a[1] * b2[1];
  }
  function cross2(out, a, b2) {
    var z2 = a[0] * b2[1] - a[1] * b2[0];
    out[0] = out[1] = 0;
    out[2] = z2;
    return out;
  }
  function lerp5(out, a, b2, t) {
    var ax = a[0], ay = a[1];
    out[0] = ax + t * (b2[0] - ax);
    out[1] = ay + t * (b2[1] - ay);
    return out;
  }
  function random3(out, scale7) {
    scale7 = scale7 || 1;
    var r = RANDOM() * 2 * Math.PI;
    out[0] = Math.cos(r) * scale7;
    out[1] = Math.sin(r) * scale7;
    return out;
  }
  function transformMat2(out, a, m2) {
    var x2 = a[0], y2 = a[1];
    out[0] = m2[0] * x2 + m2[2] * y2;
    out[1] = m2[1] * x2 + m2[3] * y2;
    return out;
  }
  function transformMat2d(out, a, m2) {
    var x2 = a[0], y2 = a[1];
    out[0] = m2[0] * x2 + m2[2] * y2 + m2[4];
    out[1] = m2[1] * x2 + m2[3] * y2 + m2[5];
    return out;
  }
  function transformMat32(out, a, m2) {
    var x2 = a[0], y2 = a[1];
    out[0] = m2[0] * x2 + m2[3] * y2 + m2[6];
    out[1] = m2[1] * x2 + m2[4] * y2 + m2[7];
    return out;
  }
  function transformMat42(out, a, m2) {
    var x2 = a[0];
    var y2 = a[1];
    out[0] = m2[0] * x2 + m2[4] * y2 + m2[12];
    out[1] = m2[1] * x2 + m2[5] * y2 + m2[13];
    return out;
  }
  function rotate2(out, a, b2, rad) {
    var p0 = a[0] - b2[0], p1 = a[1] - b2[1], sinC = Math.sin(rad), cosC = Math.cos(rad);
    out[0] = p0 * cosC - p1 * sinC + b2[0];
    out[1] = p0 * sinC + p1 * cosC + b2[1];
    return out;
  }
  function angle2(a, b2) {
    var x1 = a[0], y1 = a[1], x2 = b2[0], y2 = b2[1], mag = Math.sqrt(x1 * x1 + y1 * y1) * Math.sqrt(x2 * x2 + y2 * y2), cosine = mag && (x1 * x2 + y1 * y2) / mag;
    return Math.acos(Math.min(Math.max(cosine, -1), 1));
  }
  function zero2(out) {
    out[0] = 0;
    out[1] = 0;
    return out;
  }
  function str5(a) {
    return "vec2(" + a[0] + ", " + a[1] + ")";
  }
  function exactEquals6(a, b2) {
    return a[0] === b2[0] && a[1] === b2[1];
  }
  function equals6(a, b2) {
    var a0 = a[0], a1 = a[1];
    var b0 = b2[0], b1 = b2[1];
    return Math.abs(a0 - b0) <= EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1));
  }
  var len4 = length5;
  var sub3 = subtract3;
  var mul5 = multiply5;
  var div2 = divide2;
  var dist2 = distance2;
  var sqrDist2 = squaredDistance2;
  var sqrLen4 = squaredLength5;
  var forEach3 = function() {
    var vec = create7();
    return function(a, stride, offset2, count, fn, arg) {
      var i, l;
      if (!stride) {
        stride = 2;
      }
      if (!offset2) {
        offset2 = 0;
      }
      if (count) {
        l = Math.min(count * stride + offset2, a.length);
      } else {
        l = a.length;
      }
      for (i = offset2; i < l; i += stride) {
        vec[0] = a[i];
        vec[1] = a[i + 1];
        fn(vec, vec, arg);
        a[i] = vec[0];
        a[i + 1] = vec[1];
      }
      return a;
    };
  }();

  // node_modules/@wonderlandengine/components/dist/hit-test-location.js
  var __decorate3 = function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d2;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if (d2 = decorators[i])
          r = (c < 3 ? d2(r) : c > 3 ? d2(target, key, r) : d2(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  var HitTestLocation = class extends Component3 {
    tempScaling = new Float32Array(3);
    visible = false;
    xrHitTestSource = null;
    /** Reference space for creating the hit test when the session starts */
    xrReferenceSpace = null;
    /**
     * For maintaining backwards compatibility: Whether to scale the object to 0 and back.
     * @deprecated Use onHitLost and onHitFound instead.
     */
    scaleObject = true;
    /** Emits an event when the hit test switches from visible to invisible */
    onHitLost = new Emitter();
    /** Emits an event when the hit test switches from invisible to visible */
    onHitFound = new Emitter();
    onSessionStartCallback = null;
    onSessionEndCallback = null;
    start() {
      this.onSessionStartCallback = this.onXRSessionStart.bind(this);
      this.onSessionEndCallback = this.onXRSessionEnd.bind(this);
      if (this.scaleObject) {
        this.tempScaling.set(this.object.scalingLocal);
        this.object.scale([0, 0, 0]);
        this.onHitLost.add(() => {
          this.tempScaling.set(this.object.scalingLocal);
          this.object.scale([0, 0, 0]);
        });
        this.onHitFound.add(() => {
          this.object.scalingLocal.set(this.tempScaling);
          this.object.setDirty();
        });
      }
    }
    onActivate() {
      this.engine.onXRSessionStart.add(this.onSessionStartCallback);
      this.engine.onXRSessionEnd.add(this.onSessionEndCallback);
    }
    onDeactivate() {
      this.engine.onXRSessionStart.remove(this.onSessionStartCallback);
      this.engine.onXRSessionEnd.remove(this.onSessionEndCallback);
    }
    update() {
      const wasVisible = this.visible;
      if (this.xrHitTestSource) {
        const frame = this.engine.xrFrame;
        if (!frame)
          return;
        let hitTestResults = frame.getHitTestResults(this.xrHitTestSource);
        if (hitTestResults.length > 0) {
          let pose = hitTestResults[0].getPose(this.engine.xr.currentReferenceSpace);
          this.visible = !!pose;
          if (pose) {
            setXRRigidTransformLocal(this.object, pose.transform);
          }
        } else {
          this.visible = false;
        }
      }
      if (this.visible != wasVisible) {
        (this.visible ? this.onHitFound : this.onHitLost).notify(this);
      }
    }
    getHitTestResults(frame = this.engine.xr?.frame ?? null) {
      if (!frame)
        return [];
      if (!this.xrHitTestSource)
        return [];
      return frame.getHitTestResults(this.xrHitTestSource);
    }
    onXRSessionStart(session) {
      if (session.requestHitTestSource === void 0) {
        console.error("hit-test-location: hit test feature not available. Deactivating component.");
        this.active = false;
        return;
      }
      session.requestHitTestSource({
        space: this.xrReferenceSpace ?? this.engine.xr.referenceSpaceForType("viewer")
      }).then((hitTestSource) => {
        this.xrHitTestSource = hitTestSource;
      }).catch(console.error);
    }
    onXRSessionEnd() {
      if (!this.xrHitTestSource)
        return;
      this.xrHitTestSource.cancel();
      this.xrHitTestSource = null;
    }
  };
  __publicField(HitTestLocation, "TypeName", "hit-test-location");
  __decorate3([
    property.bool(true)
  ], HitTestLocation.prototype, "scaleObject", void 0);

  // node_modules/@wonderlandengine/components/dist/cursor.js
  var __decorate4 = function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d2;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if (d2 = decorators[i])
          r = (c < 3 ? d2(r) : c > 3 ? d2(target, key, r) : d2(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  var tempVec2 = new Float32Array(3);
  var ZERO = [0, 0, 0];
  var CursorTargetEmitters = class {
    /** Emitter for events when the target is hovered */
    onHover = new Emitter();
    /** Emitter for events when the target is unhovered */
    onUnhover = new Emitter();
    /** Emitter for events when the target is clicked */
    onClick = new Emitter();
    /** Emitter for events when the cursor moves on the target */
    onMove = new Emitter();
    /** Emitter for events when the user pressed the select button on the target */
    onDown = new Emitter();
    /** Emitter for events when the user unpressed the select button on the target */
    onUp = new Emitter();
  };
  var Cursor = class extends Component3 {
    static onRegister(engine) {
      engine.registerComponent(HitTestLocation);
    }
    _collisionMask = 0;
    _onDeactivateCallbacks = [];
    _input = null;
    _origin = new Float32Array(3);
    _cursorObjScale = new Float32Array(3);
    _direction = new Float32Array(3);
    _projectionMatrix = new Float32Array(16);
    _viewComponent = null;
    _isDown = false;
    _lastIsDown = false;
    _arTouchDown = false;
    _lastPointerPos = new Float32Array(2);
    _lastCursorPosOnTarget = new Float32Array(3);
    _hitTestLocation = null;
    _hitTestObject = null;
    _onSessionStartCallback = null;
    /**
     * Whether the cursor (and cursorObject) is visible, i.e. pointing at an object
     * that matches the collision group
     */
    visible = true;
    /** Currently hovered object */
    hoveringObject = null;
    /** CursorTarget component of the currently hovered object */
    hoveringObjectTarget = null;
    /** Whether the cursor is hovering reality via hit-test */
    hoveringReality = false;
    /**
     * Global target lets you receive global cursor events on any object.
     */
    globalTarget = new CursorTargetEmitters();
    /**
     * Hit test target lets you receive cursor events for "reality", if
     * `useWebXRHitTest` is set to `true`.
     *
     * @example
     * ```js
     * cursor.hitTestTarget.onClick.add((hit, cursor) => {
     *     // User clicked on reality
     * });
     * ```
     */
    hitTestTarget = new CursorTargetEmitters();
    /** World position of the cursor */
    cursorPos = new Float32Array(3);
    /** Collision group for the ray cast. Only objects in this group will be affected by this cursor. */
    collisionGroup = 1;
    /** (optional) Object that visualizes the cursor's ray. */
    cursorRayObject = null;
    /** Axis along which to scale the `cursorRayObject`. */
    cursorRayScalingAxis = 2;
    /** (optional) Object that visualizes the cursor's hit location. */
    cursorObject = null;
    /** Handedness for VR cursors to accept trigger events only from respective controller. */
    handedness = 0;
    /** Object that has an input component. */
    inputObject = null;
    /** Object that has a view component. */
    viewObject = null;
    /** Mode for raycasting, whether to use PhysX or simple collision components */
    rayCastMode = 0;
    /** Maximum distance for the cursor's ray cast. */
    maxDistance = 100;
    /** Whether to set the CSS style of the mouse cursor on desktop */
    styleCursor = true;
    /**
     * Use WebXR hit-test if available.
     *
     * Attaches a hit-test-location component to the cursorObject, which will be used
     * by the cursor to send events to the hitTestTarget with HitTestResult.
     */
    useWebXRHitTest = false;
    _onViewportResize = () => {
      if (!this._viewComponent)
        return;
      mat4_exports.invert(this._projectionMatrix, this._viewComponent.projectionMatrix);
    };
    start() {
      this._collisionMask = 1 << this.collisionGroup;
      if (this.handedness == 0) {
        const inputCompObj = this.inputObject || this.object;
        const inputComp = inputCompObj.getComponent(InputComponent);
        if (!inputComp) {
          console.warn("cursor component on object", this.object.name, 'was configured with handedness "input component", but object has no input component.');
        } else {
          this.handedness = inputComp.handedness || "none";
          this._input = inputComp;
        }
      } else {
        this.handedness = ["left", "right", "none"][this.handedness - 1];
      }
      const viewObject = this.viewObject || this.object;
      this._viewComponent = viewObject.getComponent(ViewComponent);
      if (this.useWebXRHitTest) {
        this._hitTestObject = this.engine.scene.addObject(this.object);
        this._hitTestLocation = this._hitTestObject.addComponent(HitTestLocation, {
          scaleObject: false
        }) ?? null;
      }
      this._onSessionStartCallback = this.setupVREvents.bind(this);
    }
    onActivate() {
      this.engine.onXRSessionStart.add(this._onSessionStartCallback);
      this.engine.onResize.add(this._onViewportResize);
      this._setCursorVisibility(true);
      if (this._viewComponent != null) {
        const canvas2 = this.engine.canvas;
        const onClick = this.onClick.bind(this);
        const onPointerMove = this.onPointerMove.bind(this);
        const onPointerDown = this.onPointerDown.bind(this);
        const onPointerUp = this.onPointerUp.bind(this);
        canvas2.addEventListener("click", onClick);
        canvas2.addEventListener("pointermove", onPointerMove);
        canvas2.addEventListener("pointerdown", onPointerDown);
        canvas2.addEventListener("pointerup", onPointerUp);
        this._onDeactivateCallbacks.push(() => {
          canvas2.removeEventListener("click", onClick);
          canvas2.removeEventListener("pointermove", onPointerMove);
          canvas2.removeEventListener("pointerdown", onPointerDown);
          canvas2.removeEventListener("pointerup", onPointerUp);
        });
      }
      this._onViewportResize();
    }
    _setCursorRayTransform(hitPosition) {
      if (!this.cursorRayObject)
        return;
      const dist3 = vec3_exports.dist(this._origin, hitPosition);
      this.cursorRayObject.setPositionLocal([0, 0, -dist3 / 2]);
      if (this.cursorRayScalingAxis != 4) {
        tempVec2.fill(1);
        tempVec2[this.cursorRayScalingAxis] = dist3 / 2;
        this.cursorRayObject.setScalingLocal(tempVec2);
      }
    }
    _setCursorVisibility(visible) {
      if (this.visible == visible)
        return;
      this.visible = visible;
      if (!this.cursorObject)
        return;
      if (visible) {
        this.cursorObject.setScalingWorld(this._cursorObjScale);
      } else {
        this.cursorObject.getScalingWorld(this._cursorObjScale);
        this.cursorObject.scaleLocal([0, 0, 0]);
      }
    }
    update() {
      if (this.engine.xr && this._arTouchDown && this._input && this.engine.xr.session.inputSources[0].handedness === "none" && this.engine.xr.session.inputSources[0].gamepad) {
        const p2 = this.engine.xr.session.inputSources[0].gamepad.axes;
        this._direction[0] = p2[0];
        this._direction[1] = -p2[1];
        this._direction[2] = -1;
        this.applyTransformAndProjectDirection();
      } else if (this.engine.xr && this._input && this._input.xrInputSource) {
        this._direction[0] = 0;
        this._direction[1] = 0;
        this._direction[2] = -1;
        this.applyTransformToDirection();
      } else if (this._viewComponent) {
        this.updateDirection();
      }
      this.rayCast(null, this.engine.xr?.frame);
      if (this.cursorObject) {
        if (this.hoveringObject && (this.cursorPos[0] != 0 || this.cursorPos[1] != 0 || this.cursorPos[2] != 0)) {
          this._setCursorVisibility(true);
          this.cursorObject.setPositionWorld(this.cursorPos);
          this._setCursorRayTransform(this.cursorPos);
        } else {
          this._setCursorVisibility(false);
        }
      }
    }
    /* Returns the hovered cursor target, if available */
    notify(event, originalEvent) {
      const target = this.hoveringObject;
      if (target) {
        const cursorTarget = this.hoveringObjectTarget;
        if (cursorTarget)
          cursorTarget[event].notify(target, this, originalEvent ?? void 0);
        this.globalTarget[event].notify(target, this, originalEvent ?? void 0);
      }
    }
    hoverBehaviour(rayHit, hitTestResult, doClick, originalEvent) {
      const hit = !this.hoveringReality && rayHit.hitCount > 0 ? rayHit.objects[0] : null;
      if (hit) {
        if (!this.hoveringObject || !this.hoveringObject.equals(hit)) {
          if (this.hoveringObject) {
            this.notify("onUnhover", originalEvent);
          }
          this.hoveringObject = hit;
          this.hoveringObjectTarget = this.hoveringObject.getComponent(CursorTarget);
          if (this.styleCursor)
            this.engine.canvas.style.cursor = "pointer";
          this.notify("onHover", originalEvent);
        }
      } else if (this.hoveringObject) {
        this.notify("onUnhover", originalEvent);
        this.hoveringObject = null;
        this.hoveringObjectTarget = null;
        if (this.styleCursor)
          this.engine.canvas.style.cursor = "default";
      }
      if (this.hoveringObject) {
        if (this._isDown !== this._lastIsDown) {
          this.notify(this._isDown ? "onDown" : "onUp", originalEvent);
        }
        if (doClick)
          this.notify("onClick", originalEvent);
      } else if (this.hoveringReality) {
        if (this._isDown !== this._lastIsDown) {
          (this._isDown ? this.hitTestTarget.onDown : this.hitTestTarget.onUp).notify(hitTestResult, this, originalEvent ?? void 0);
        }
        if (doClick)
          this.hitTestTarget.onClick.notify(hitTestResult, this, originalEvent ?? void 0);
      }
      if (hit) {
        if (this.hoveringObject) {
          this.hoveringObject.transformPointInverseWorld(tempVec2, this.cursorPos);
        } else {
          tempVec2.set(this.cursorPos);
        }
        if (!vec3_exports.equals(this._lastCursorPosOnTarget, tempVec2)) {
          this.notify("onMove", originalEvent);
          this._lastCursorPosOnTarget.set(tempVec2);
        }
      } else if (this.hoveringReality) {
        if (!vec3_exports.equals(this._lastCursorPosOnTarget, this.cursorPos)) {
          this.hitTestTarget.onMove.notify(hitTestResult, this, originalEvent ?? void 0);
          this._lastCursorPosOnTarget.set(this.cursorPos);
        }
      } else {
        this._lastCursorPosOnTarget.set(this.cursorPos);
      }
      this._lastIsDown = this._isDown;
    }
    /**
     * Setup event listeners on session object
     * @param s WebXR session
     *
     * Sets up 'select' and 'end' events.
     */
    setupVREvents(s) {
      if (!s)
        console.error("setupVREvents called without a valid session");
      if (!this.active)
        return;
      const onSelect = this.onSelect.bind(this);
      s.addEventListener("select", onSelect);
      const onSelectStart = this.onSelectStart.bind(this);
      s.addEventListener("selectstart", onSelectStart);
      const onSelectEnd = this.onSelectEnd.bind(this);
      s.addEventListener("selectend", onSelectEnd);
      this._onDeactivateCallbacks.push(() => {
        if (!this.engine.xr)
          return;
        s.removeEventListener("select", onSelect);
        s.removeEventListener("selectstart", onSelectStart);
        s.removeEventListener("selectend", onSelectEnd);
      });
      this._onViewportResize();
    }
    onDeactivate() {
      this.engine.onXRSessionStart.remove(this._onSessionStartCallback);
      this.engine.onResize.remove(this._onViewportResize);
      this._setCursorVisibility(false);
      if (this.hoveringObject)
        this.notify("onUnhover", null);
      if (this.cursorRayObject)
        this.cursorRayObject.setScalingLocal(ZERO);
      for (const f2 of this._onDeactivateCallbacks)
        f2();
      this._onDeactivateCallbacks.length = 0;
    }
    onDestroy() {
      this._hitTestObject?.destroy();
    }
    /** 'select' event listener */
    onSelect(e) {
      if (e.inputSource.handedness != this.handedness)
        return;
      this.rayCast(e, e.frame, true);
    }
    /** 'selectstart' event listener */
    onSelectStart(e) {
      this._arTouchDown = true;
      if (e.inputSource.handedness == this.handedness) {
        this._isDown = true;
        this.rayCast(e, e.frame);
      }
    }
    /** 'selectend' event listener */
    onSelectEnd(e) {
      this._arTouchDown = false;
      if (e.inputSource.handedness == this.handedness) {
        this._isDown = false;
        this.rayCast(e, e.frame);
      }
    }
    /** 'pointermove' event listener */
    onPointerMove(e) {
      if (!e.isPrimary)
        return;
      this.updateMousePos(e);
      this.rayCast(e, null);
    }
    /** 'click' event listener */
    onClick(e) {
      this.updateMousePos(e);
      this.rayCast(e, null, true);
    }
    /** 'pointerdown' event listener */
    onPointerDown(e) {
      if (!e.isPrimary || e.button !== 0)
        return;
      this.updateMousePos(e);
      this._isDown = true;
      this.rayCast(e);
    }
    /** 'pointerup' event listener */
    onPointerUp(e) {
      if (!e.isPrimary || e.button !== 0)
        return;
      this.updateMousePos(e);
      this._isDown = false;
      this.rayCast(e);
    }
    /**
     * Update mouse position in non-VR mode and raycast for new position
     * @returns @ref RayHit for new position.
     */
    updateMousePos(e) {
      this._lastPointerPos[0] = e.clientX;
      this._lastPointerPos[1] = e.clientY;
      this.updateDirection();
    }
    updateDirection() {
      const bounds = this.engine.canvas.getBoundingClientRect();
      const left = this._lastPointerPos[0] / bounds.width;
      const top = this._lastPointerPos[1] / bounds.height;
      this._direction[0] = left * 2 - 1;
      this._direction[1] = -top * 2 + 1;
      this._direction[2] = -1;
      this.applyTransformAndProjectDirection();
    }
    applyTransformAndProjectDirection() {
      vec3_exports.transformMat4(this._direction, this._direction, this._projectionMatrix);
      vec3_exports.normalize(this._direction, this._direction);
      this.applyTransformToDirection();
    }
    applyTransformToDirection() {
      this.object.transformVectorWorld(this._direction, this._direction);
      this.object.getPositionWorld(this._origin);
    }
    rayCast(originalEvent, frame = null, doClick = false) {
      const rayHit = this.rayCastMode == 0 ? this.engine.scene.rayCast(this._origin, this._direction, this._collisionMask) : this.engine.physics.rayCast(this._origin, this._direction, this._collisionMask, this.maxDistance);
      let hitResultDistance = Infinity;
      let hitTestResult = null;
      if (this._hitTestLocation?.visible) {
        this._hitTestObject.getPositionWorld(this.cursorPos);
        hitResultDistance = vec3_exports.distance(this.object.getPositionWorld(tempVec2), this.cursorPos);
        hitTestResult = this._hitTestLocation?.getHitTestResults(frame)[0];
      }
      let hoveringReality = false;
      if (rayHit.hitCount > 0) {
        const d2 = rayHit.distances[0];
        if (hitResultDistance >= d2) {
          this.cursorPos.set(rayHit.locations[0]);
        } else {
          hoveringReality = true;
        }
      } else if (hitResultDistance < Infinity) {
      } else {
        this.cursorPos.fill(0);
      }
      if (hoveringReality && !this.hoveringReality) {
        this.hitTestTarget.onHover.notify(hitTestResult, this);
      } else if (!hoveringReality && this.hoveringReality) {
        this.hitTestTarget.onUnhover.notify(hitTestResult, this);
      }
      this.hoveringReality = hoveringReality;
      this.hoverBehaviour(rayHit, hitTestResult, doClick, originalEvent);
      return rayHit;
    }
  };
  __publicField(Cursor, "TypeName", "cursor");
  /* Dependencies is deprecated, but we keep it here for compatibility
   * with 1.0.0-rc2 until 1.0.0 is released */
  __publicField(Cursor, "Dependencies", [HitTestLocation]);
  __decorate4([
    property.int(1)
  ], Cursor.prototype, "collisionGroup", void 0);
  __decorate4([
    property.object()
  ], Cursor.prototype, "cursorRayObject", void 0);
  __decorate4([
    property.enum(["x", "y", "z", "none"], "z")
  ], Cursor.prototype, "cursorRayScalingAxis", void 0);
  __decorate4([
    property.object()
  ], Cursor.prototype, "cursorObject", void 0);
  __decorate4([
    property.enum(["input component", "left", "right", "none"], "input component")
  ], Cursor.prototype, "handedness", void 0);
  __decorate4([
    property.object()
  ], Cursor.prototype, "inputObject", void 0);
  __decorate4([
    property.object()
  ], Cursor.prototype, "viewObject", void 0);
  __decorate4([
    property.enum(["collision", "physx"], "collision")
  ], Cursor.prototype, "rayCastMode", void 0);
  __decorate4([
    property.float(100)
  ], Cursor.prototype, "maxDistance", void 0);
  __decorate4([
    property.bool(true)
  ], Cursor.prototype, "styleCursor", void 0);
  __decorate4([
    property.bool(false)
  ], Cursor.prototype, "useWebXRHitTest", void 0);

  // node_modules/@wonderlandengine/components/dist/debug-object.js
  var __decorate5 = function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d2;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if (d2 = decorators[i])
          r = (c < 3 ? d2(r) : c > 3 ? d2(target, key, r) : d2(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  var DebugObject = class extends Component3 {
    /** A second object to print the name of */
    obj = null;
    start() {
      let origin = new Float32Array(3);
      quat2_exports.getTranslation(origin, this.object.transformWorld);
      console.log("Debug object:", this.object.name);
      console.log("Other object:", this.obj?.name);
      console.log("	translation", origin);
      console.log("	transformWorld", this.object.transformWorld);
      console.log("	transformLocal", this.object.transformLocal);
    }
  };
  __publicField(DebugObject, "TypeName", "debug-object");
  __decorate5([
    property.object()
  ], DebugObject.prototype, "obj", void 0);

  // node_modules/@wonderlandengine/components/dist/device-orientation-look.js
  function quatFromEulerYXZDeg(out, x2, y2, z2) {
    const halfToRad = 0.5 * Math.PI / 180;
    x2 *= halfToRad;
    y2 *= halfToRad;
    z2 *= halfToRad;
    const c1 = Math.cos(x2);
    const c2 = Math.cos(y2);
    const c3 = Math.cos(z2);
    const s1 = Math.sin(x2);
    const s2 = Math.sin(y2);
    const s3 = Math.sin(z2);
    out[0] = s1 * c2 * c3 + c1 * s2 * s3;
    out[1] = c1 * s2 * c3 - s1 * c2 * s3;
    out[2] = c1 * c2 * s3 - s1 * s2 * c3;
    out[3] = c1 * c2 * c3 + s1 * s2 * s3;
  }
  var DeviceOrientationLook = class extends Component3 {
    rotationX = 0;
    rotationY = 0;
    lastClientX = -1;
    lastClientY = -1;
    /* Initialize device orientation with Identity Quaternion */
    deviceOrientation = [0, 0, 0, 1];
    screenOrientation = 0;
    _origin = [0, 0, 0];
    onActivate() {
      this.screenOrientation = window.innerHeight > window.innerWidth ? 0 : 90;
      window.addEventListener("deviceorientation", this.onDeviceOrientation);
      window.addEventListener("orientationchange", this.onOrientationChange, false);
    }
    onDeactivate() {
      window.removeEventListener("deviceorientation", this.onDeviceOrientation);
      window.removeEventListener("orientationchange", this.onOrientationChange);
    }
    update() {
      if (this.engine.xr)
        return;
      this.object.getPositionLocal(this._origin);
      this.object.resetTransform();
      if (this.screenOrientation != 0) {
        this.object.rotateAxisAngleDegLocal([0, 0, -1], this.screenOrientation);
      }
      this.object.rotateLocal([-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)]);
      this.object.rotateLocal(this.deviceOrientation);
      this.object.translateLocal(this._origin);
    }
    onDeviceOrientation = (e) => {
      let alpha = e.alpha ?? 0;
      let beta = e.beta ?? 0;
      let gamma = e.gamma ?? 0;
      quatFromEulerYXZDeg(this.deviceOrientation, beta, alpha, -gamma);
    };
    onOrientationChange = () => {
      this.screenOrientation = window.screen?.orientation.angle ?? window.orientation ?? 0;
    };
  };
  __publicField(DeviceOrientationLook, "TypeName", "device-orientation-look");
  __publicField(DeviceOrientationLook, "Properties", {});

  // node_modules/@wonderlandengine/components/dist/finger-cursor.js
  var FingerCursor = class extends Component3 {
    lastTarget = null;
    tip;
    start() {
      const collisionComponent = this.object.getComponent(CollisionComponent);
      if (!collisionComponent) {
        throw new Error(`Finger-cursor component on object '${this.object.name}' requires a collision component to work properly.`);
      }
      this.tip = collisionComponent;
    }
    update() {
      const overlaps = this.tip.queryOverlaps();
      let overlapFound = null;
      for (let i = 0; i < overlaps.length; ++i) {
        const o = overlaps[i].object;
        const target = o.getComponent(CursorTarget);
        if (target) {
          if (!target.equals(this.lastTarget)) {
            target.onHover.notify(o, this);
            target.onClick.notify(o, this);
          }
          overlapFound = target;
          break;
        }
      }
      if (!overlapFound) {
        if (this.lastTarget)
          this.lastTarget.onUnhover.notify(this.lastTarget.object, this);
        this.lastTarget = null;
        return;
      } else {
        this.lastTarget = overlapFound;
      }
    }
  };
  __publicField(FingerCursor, "TypeName", "finger-cursor");

  // node_modules/@wonderlandengine/components/dist/fixed-foveation.js
  var __decorate6 = function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d2;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if (d2 = decorators[i])
          r = (c < 3 ? d2(r) : c > 3 ? d2(target, key, r) : d2(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  var FixedFoveation = class extends Component3 {
    /** Amount to apply from 0 (none) to 1 (full) */
    fixedFoveation;
    onActivate() {
      this.engine.onXRSessionStart.add(this.setFixedFoveation);
    }
    onDeactivate() {
      this.engine.onXRSessionStart.remove(this.setFixedFoveation);
    }
    setFixedFoveation = () => {
      this.engine.xr.baseLayer.fixedFoveation = this.fixedFoveation;
    };
  };
  __publicField(FixedFoveation, "TypeName", "fixed-foveation");
  __decorate6([
    property.float(0.5)
  ], FixedFoveation.prototype, "fixedFoveation", void 0);

  // node_modules/@wonderlandengine/components/dist/hand-tracking.js
  var __decorate7 = function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d2;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if (d2 = decorators[i])
          r = (c < 3 ? d2(r) : c > 3 ? d2(target, key, r) : d2(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  var ORDERED_JOINTS = [
    "wrist",
    "thumb-metacarpal",
    "thumb-phalanx-proximal",
    "thumb-phalanx-distal",
    "thumb-tip",
    "index-finger-metacarpal",
    "index-finger-phalanx-proximal",
    "index-finger-phalanx-intermediate",
    "index-finger-phalanx-distal",
    "index-finger-tip",
    "middle-finger-metacarpal",
    "middle-finger-phalanx-proximal",
    "middle-finger-phalanx-intermediate",
    "middle-finger-phalanx-distal",
    "middle-finger-tip",
    "ring-finger-metacarpal",
    "ring-finger-phalanx-proximal",
    "ring-finger-phalanx-intermediate",
    "ring-finger-phalanx-distal",
    "ring-finger-tip",
    "pinky-finger-metacarpal",
    "pinky-finger-phalanx-proximal",
    "pinky-finger-phalanx-intermediate",
    "pinky-finger-phalanx-distal",
    "pinky-finger-tip"
  ];
  var invTranslation = vec3_exports.create();
  var invRotation = quat_exports.create();
  var tempVec0 = vec3_exports.create();
  var tempVec1 = vec3_exports.create();
  var HandTracking = class extends Component3 {
    /** Handedness determining whether to receive tracking input from right or left hand */
    handedness = 0;
    /** (optional) Mesh to use to visualize joints */
    jointMesh = null;
    /** Material to use for display. Applied to either the spawned skinned mesh or the joint spheres. */
    jointMaterial = null;
    /** (optional) Skin to apply tracked joint poses to. If not present,
     * joint spheres will be used for display instead. */
    handSkin = null;
    /** Deactivate children if no pose was tracked */
    deactivateChildrenWithoutPose = true;
    /** Controller objects to activate including children if no pose is available */
    controllerToDeactivate = null;
    init() {
      this.handedness = ["left", "right"][this.handedness];
    }
    joints = {};
    session = null;
    /* Whether last update had a hand pose */
    hasPose = false;
    _childrenActive = true;
    start() {
      if (!("XRHand" in window)) {
        console.warn("WebXR Hand Tracking not supported by this browser.");
        this.active = false;
        return;
      }
      if (this.handSkin) {
        const skin = this.handSkin;
        const jointIds = skin.jointIds;
        this.joints[ORDERED_JOINTS[0]] = this.engine.wrapObject(jointIds[0]);
        for (let j2 = 0; j2 < jointIds.length; ++j2) {
          const joint = this.engine.wrapObject(jointIds[j2]);
          this.joints[joint.name] = joint;
        }
        return;
      }
      const jointObjects = this.engine.scene.addObjects(ORDERED_JOINTS.length, this.object, ORDERED_JOINTS.length);
      for (let j2 = 0; j2 < ORDERED_JOINTS.length; ++j2) {
        const joint = jointObjects[j2];
        joint.addComponent(MeshComponent, {
          mesh: this.jointMesh,
          material: this.jointMaterial
        });
        this.joints[ORDERED_JOINTS[j2]] = joint;
        joint.name = ORDERED_JOINTS[j2];
      }
    }
    update(dt) {
      if (!this.engine.xr)
        return;
      this.hasPose = false;
      if (this.engine.xr.session.inputSources) {
        for (let i = 0; i < this.engine.xr.session.inputSources.length; ++i) {
          const inputSource = this.engine.xr.session.inputSources[i];
          if (!inputSource?.hand || inputSource?.handedness != this.handedness)
            continue;
          const wristSpace = inputSource.hand.get("wrist");
          if (wristSpace) {
            const p2 = this.engine.xr.frame.getJointPose(wristSpace, this.engine.xr.currentReferenceSpace);
            if (p2) {
              setXRRigidTransformLocal(this.object, p2.transform);
            }
          }
          this.object.getRotationLocal(invRotation);
          quat_exports.conjugate(invRotation, invRotation);
          this.object.getPositionLocal(invTranslation);
          this.joints["wrist"].resetTransform();
          for (let j2 = 0; j2 < ORDERED_JOINTS.length; ++j2) {
            const jointName = ORDERED_JOINTS[j2];
            const joint = this.joints[jointName];
            if (!joint)
              continue;
            let jointPose = null;
            const jointSpace = inputSource.hand.get(jointName);
            if (jointSpace) {
              jointPose = this.engine.xr.frame.getJointPose(jointSpace, this.engine.xr.currentReferenceSpace);
            }
            if (jointPose) {
              this.hasPose = true;
              joint.resetPositionRotation();
              joint.translateLocal([
                jointPose.transform.position.x - invTranslation[0],
                jointPose.transform.position.y - invTranslation[1],
                jointPose.transform.position.z - invTranslation[2]
              ]);
              joint.rotateLocal(invRotation);
              joint.rotateObject([
                jointPose.transform.orientation.x,
                jointPose.transform.orientation.y,
                jointPose.transform.orientation.z,
                jointPose.transform.orientation.w
              ]);
              if (!this.handSkin) {
                const r = jointPose.radius || 7e-3;
                joint.setScalingLocal([r, r, r]);
              }
            }
          }
        }
      }
      if (!this.hasPose && this._childrenActive) {
        this._childrenActive = false;
        if (this.deactivateChildrenWithoutPose) {
          this.setChildrenActive(false);
        }
        if (this.controllerToDeactivate) {
          this.controllerToDeactivate.active = true;
          this.setChildrenActive(true, this.controllerToDeactivate);
        }
      } else if (this.hasPose && !this._childrenActive) {
        this._childrenActive = true;
        if (this.deactivateChildrenWithoutPose) {
          this.setChildrenActive(true);
        }
        if (this.controllerToDeactivate) {
          this.controllerToDeactivate.active = false;
          this.setChildrenActive(false, this.controllerToDeactivate);
        }
      }
    }
    setChildrenActive(active, object) {
      object = object || this.object;
      const children = object.children;
      for (const o of children) {
        o.active = active;
        this.setChildrenActive(active, o);
      }
    }
    isGrabbing() {
      this.joints["index-finger-tip"].getPositionLocal(tempVec0);
      this.joints["thumb-tip"].getPositionLocal(tempVec1);
      return vec3_exports.sqrDist(tempVec0, tempVec1) < 1e-3;
    }
  };
  __publicField(HandTracking, "TypeName", "hand-tracking");
  __decorate7([
    property.enum(["left", "right"])
  ], HandTracking.prototype, "handedness", void 0);
  __decorate7([
    property.mesh()
  ], HandTracking.prototype, "jointMesh", void 0);
  __decorate7([
    property.material()
  ], HandTracking.prototype, "jointMaterial", void 0);
  __decorate7([
    property.skin()
  ], HandTracking.prototype, "handSkin", void 0);
  __decorate7([
    property.bool(true)
  ], HandTracking.prototype, "deactivateChildrenWithoutPose", void 0);
  __decorate7([
    property.object()
  ], HandTracking.prototype, "controllerToDeactivate", void 0);

  // node_modules/@wonderlandengine/spatial-audio/dist/index.js
  var dist_exports = {};
  __export(dist_exports, {
    AudioChannel: () => AudioChannel,
    AudioListener: () => AudioListener,
    AudioManager: () => AudioManager,
    AudioSource: () => AudioSource,
    DEF_PLAYER_COUNT: () => DEF_PLAYER_COUNT,
    EmptyAudioManager: () => EmptyAudioManager,
    PlayState: () => PlayState,
    globalAudioManager: () => globalAudioManager,
    loadAudio: () => loadAudio
  });

  // node_modules/@wonderlandengine/spatial-audio/dist/audio-listener.js
  var SAMPLE_RATE = 48e3;
  var FADE_DURATION = 5 / 1e3;
  var tempVec4 = new Float32Array(3);
  var tempVec22 = new Float32Array(3);
  var _audioContext = null;
  if (window.AudioContext !== void 0) {
    _audioContext = new AudioContext({
      latencyHint: "interactive",
      sampleRate: SAMPLE_RATE
    });
  }
  async function _unlockAudioContext() {
    return new Promise((resolve) => {
      const unlockHandler = () => {
        _audioContext.resume().then(() => {
          window.removeEventListener("click", unlockHandler);
          window.removeEventListener("touch", unlockHandler);
          window.removeEventListener("keydown", unlockHandler);
          window.removeEventListener("mousedown", unlockHandler);
          resolve();
        });
      };
      window.addEventListener("click", unlockHandler);
      window.addEventListener("touch", unlockHandler);
      window.addEventListener("keydown", unlockHandler);
      window.addEventListener("mousedown", unlockHandler);
    });
  }
  var AudioListener = class extends Component3 {
    /**
     * The WebAudio listener instance associated with this component.
     */
    listener = _audioContext.listener;
    /**
     * The time in which the last position update will be done.
     */
    time = 0;
    start() {
      if ("positionX" in this.listener) {
        this.update = this._updateRecommended.bind(this);
      } else {
        this.update = this._updateDeprecated.bind(this);
      }
    }
    _updateDeprecated() {
      this.object.getPositionWorld(tempVec4);
      this.listener.setPosition(tempVec4[0], tempVec4[2], -tempVec4[1]);
      this.object.getForwardWorld(tempVec4);
      this.object.getUpWorld(tempVec22);
      this.listener.setOrientation(tempVec4[0], tempVec4[2], -tempVec4[1], tempVec22[0], tempVec22[2], -tempVec22[1]);
    }
    _updateRecommended() {
      this.time = _audioContext.currentTime + FADE_DURATION;
      this.object.getPositionWorld(tempVec4);
      this.listener.positionX.linearRampToValueAtTime(tempVec4[0], this.time);
      this.listener.positionY.linearRampToValueAtTime(tempVec4[2], this.time);
      this.listener.positionZ.linearRampToValueAtTime(-tempVec4[1], this.time);
      this.object.getForwardWorld(tempVec4);
      this.listener.forwardX.linearRampToValueAtTime(tempVec4[0], this.time);
      this.listener.forwardY.linearRampToValueAtTime(tempVec4[2], this.time);
      this.listener.forwardZ.linearRampToValueAtTime(-tempVec4[1], this.time);
      this.object.getUpWorld(tempVec4);
      this.listener.upX.linearRampToValueAtTime(tempVec4[0], this.time);
      this.listener.upY.linearRampToValueAtTime(tempVec4[2], this.time);
      this.listener.upZ.linearRampToValueAtTime(-tempVec4[1], this.time);
    }
  };
  __publicField(AudioListener, "TypeName", "audio-listener");
  __publicField(AudioListener, "Properties", {});

  // node_modules/@wonderlandengine/spatial-audio/dist/audio-players.js
  var MIN_RAMP_TIME = 5 / 1e3;
  var MIN_VOLUME = 1e-3;
  var DEF_VOL = 1;
  var DEFAULT_PANNER_CONFIG = {
    coneInnerAngle: 360,
    coneOuterAngle: 0,
    coneOuterGain: 0,
    distanceModel: "exponential",
    maxDistance: 1e4,
    refDistance: 1,
    rolloffFactor: 1,
    panningModel: "HRTF",
    positionX: 0,
    positionY: 0,
    positionZ: 1,
    orientationX: 0,
    orientationY: 0,
    orientationZ: 1
  };
  var BufferPlayer = class {
    playId = -1;
    buffer = _audioContext.createBuffer(1, _audioContext.sampleRate, _audioContext.sampleRate);
    looping = false;
    position;
    priority = false;
    playOffset = 0;
    channel = AudioChannel.Sfx;
    volume = DEF_VOL;
    oneShot = false;
    _gainNode = new GainNode(_audioContext);
    _pannerNode = new PannerNode(_audioContext, DEFAULT_PANNER_CONFIG);
    _audioNode = new AudioBufferSourceNode(_audioContext);
    _pannerOptions = DEFAULT_PANNER_CONFIG;
    _playState = PlayState.Stopped;
    _timeStamp = 0;
    _audioManager;
    /**
     * Constructs a BufferPlayer.
     *
     * @warning This is for internal use only. BufferPlayer's should only be created and used inside the AudioManager.
     * @param audioManager Manager that manages this player.
     */
    constructor(audioManager) {
      this._audioManager = audioManager;
    }
    play() {
      if (this._playState === PlayState.Playing) {
        this.stop();
      }
      switch (this.channel) {
        case AudioChannel.Music:
          this._gainNode.connect(this._audioManager["_musicGain"]);
          break;
        case AudioChannel.Master:
          this._gainNode.connect(this._audioManager["_masterGain"]);
          break;
        default:
          this._gainNode.connect(this._audioManager["_sfxGain"]);
      }
      this._gainNode.gain.value = this.volume;
      this._audioNode.buffer = this.buffer;
      this._audioNode.loop = this.looping;
      if (this.position) {
        this._pannerOptions.positionX = this.position[0];
        this._pannerOptions.positionY = this.position[2];
        this._pannerOptions.positionZ = -this.position[1];
        this._pannerNode = new PannerNode(_audioContext, this._pannerOptions);
        this._audioNode.connect(this._pannerNode).connect(this._gainNode);
      } else {
        this._audioNode.connect(this._gainNode);
      }
      this._audioNode.start(0, this.playOffset);
      this._timeStamp = _audioContext.currentTime - this.playOffset;
      this._audioNode.onended = () => this.stop();
      this._playState = PlayState.Playing;
      this.emitState();
    }
    emitState() {
      this._audioManager.emitter.notify({ id: this.playId, state: this._playState });
    }
    /**
     * Stops current playback and sends notification on the audio managers emitter.
     */
    stop() {
      if (this._playState === PlayState.Stopped)
        return;
      this._resetWebAudioNodes();
      if (this.priority) {
        this._audioManager._returnPriorityPlayer(this);
      }
      this._playState = PlayState.Stopped;
      this.emitState();
    }
    pause() {
      if (this._playState !== PlayState.Playing)
        return;
      this.playOffset = (_audioContext.currentTime - this._timeStamp) % this.buffer.duration;
      this._resetWebAudioNodes();
      this._playState = PlayState.Paused;
      this.emitState();
    }
    resume() {
      if (this._playState !== PlayState.Paused)
        return;
      this.play();
    }
    _resetWebAudioNodes() {
      this._audioNode.onended = null;
      this._audioNode.stop();
      this._audioNode.disconnect();
      this._pannerNode.disconnect();
      this._gainNode.disconnect();
      this._audioNode = new AudioBufferSourceNode(_audioContext);
    }
  };

  // node_modules/@wonderlandengine/spatial-audio/dist/audio-manager.js
  var AudioChannel;
  (function(AudioChannel2) {
    AudioChannel2[AudioChannel2["Sfx"] = 0] = "Sfx";
    AudioChannel2[AudioChannel2["Music"] = 1] = "Music";
    AudioChannel2[AudioChannel2["Master"] = 2] = "Master";
  })(AudioChannel || (AudioChannel = {}));
  var PlayState;
  (function(PlayState2) {
    PlayState2[PlayState2["Ready"] = 0] = "Ready";
    PlayState2[PlayState2["Playing"] = 1] = "Playing";
    PlayState2[PlayState2["Stopped"] = 2] = "Stopped";
    PlayState2[PlayState2["Paused"] = 3] = "Paused";
  })(PlayState || (PlayState = {}));
  var DEF_PLAYER_COUNT = 32;
  var SHIFT_AMOUNT = 16;
  var MAX_NUMBER_OF_INSTANCES = (1 << SHIFT_AMOUNT) - 1;
  var AudioManager = class {
    /** The emitter will notify all listeners about the PlayState of a unique ID.
     *
     * @remarks
     * - READY will be emitted if all sources of a given source ID have loaded.
     * - PLAYING / STOPPED / PAUSED are only emitted for play IDs that are returned by the play() method.
     * - If you want to check the status for a source ID, convert the play ID of the message using the
     *   getSourceIdFromPlayId() method.
     *
     * @see getSourceIdFromPlayId
     * @example
     * ```js
     * const music = audioManager.play(Sounds.Music);
     * audioManager.emitter.add((msg) => {
     *    if (msg.id === music) {
     *          console.log(msg.state);
     *    }
     * });
     * ```
     */
    emitter = new Emitter();
    /**
     * Sets the random function the manager will use for selecting buffers.
     *
     * @remarks Default random function is Math.random()
     * @param func Function that should be used for select the buffer.
     */
    randomBufferSelectFunction = Math.random;
    /* Cache for decoded audio buffers */
    _bufferCache = [];
    /* Simple, fast cache for players */
    _playerCache = [];
    _playerCacheIndex = 0;
    _amountOfFreePlayers = DEF_PLAYER_COUNT;
    /* Counts how many times a sourceId has played. Resets to 0 after {@link MAX_NUMBER_OF_INSTANCES }. */
    _instanceCounter = [];
    _masterGain;
    _musicGain;
    _sfxGain;
    _unlocked = false;
    _autoplayStorage = [];
    /**
     * Constructs a AudioManager.
     *
     * Uses the default amount of players.
     * @see DEF_PLAYER_COUNT
     * @example
     * ```js
     * // AudioManager can't be constructed in a non-browser environment!
     * export const am = window.AudioContext ? new AudioManager() : null!;
     * ```
     */
    constructor() {
      this._unlockAudioContext();
      this._sfxGain = new GainNode(_audioContext);
      this._masterGain = new GainNode(_audioContext);
      this._musicGain = new GainNode(_audioContext);
      this._sfxGain.connect(this._masterGain);
      this._musicGain.connect(this._masterGain);
      this._masterGain.connect(_audioContext.destination);
      for (let i = 0; i < DEF_PLAYER_COUNT; i++) {
        this._playerCache.push(new BufferPlayer(this));
      }
    }
    async load(path, id) {
      if (id < 0) {
        console.error("audio-manager: Negative IDs are not valid! Skipping ${path}.");
        return;
      }
      const paths = Array.isArray(path) ? path : [path];
      if (!this._bufferCache[id]) {
        this._bufferCache[id] = [];
      }
      this._instanceCounter[id] = -1;
      for (let i = 0; i < paths.length; i++) {
        const response = await fetch(paths[i]);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await _audioContext.decodeAudioData(arrayBuffer);
        this._bufferCache[id].push(audioBuffer);
      }
      this._instanceCounter[id] = 0;
      this.emitter.notify({ id, state: PlayState.Ready });
    }
    async loadBatch(...pair) {
      return Promise.all(pair.map((p2) => this.load(p2[0], p2[1])));
    }
    play(id, config2) {
      if (this._instanceCounter[id] == -1) {
        console.warn(`audio-manager: Tried to play audio that is still decoding: ${id}`);
        return -1;
      }
      const bufferList = this._bufferCache[id];
      if (!bufferList) {
        console.error(`audio-manager: No audio source is associated with identifier: ${id}`);
        return -1;
      }
      if (!this._unlocked) {
        return -1;
      }
      const player = this._getAvailablePlayer();
      if (!player) {
        console.warn(`audio-manager: All players are busy and no low priority player could be found to free up to play ${id}.`);
        return -1;
      }
      const unique_id = this._generateUniqueId(id);
      if (config2?.priority) {
        this._amountOfFreePlayers--;
        let index = this._playerCache.indexOf(player);
        this._playerCache.splice(index, 1);
        this._playerCache.push(player);
        player.priority = true;
      } else {
        player.priority = false;
      }
      player.playId = unique_id;
      player.buffer = this._selectRandomBuffer(bufferList);
      player.looping = config2?.loop ?? false;
      player.position = config2?.position;
      player.playOffset = config2?.playOffset ?? 0;
      player.channel = config2?.channel ?? AudioChannel.Sfx;
      player.volume = config2?.volume ?? DEF_VOL;
      player.play();
      return unique_id;
    }
    _playWithUniqueId(uniqueId, config2) {
      const id = this.getSourceIdFromPlayId(uniqueId);
      const bufferList = this._bufferCache[id];
      if (!bufferList) {
        console.error(`audio-manager: No audio source is associated with identifier: ${id}`);
        return;
      }
      const player = this._getAvailablePlayer();
      if (!player) {
        console.warn(`audio-manager: All players are busy and no low priority player could be found to free up.`);
        return;
      }
      if (config2?.priority) {
        this._amountOfFreePlayers--;
        let index = this._playerCache.indexOf(player);
        this._playerCache.splice(index, 1);
        this._playerCache.push(player);
        player.priority = true;
      } else {
        player.priority = false;
      }
      player.playId = uniqueId;
      player.buffer = this._selectRandomBuffer(bufferList);
      player.looping = config2?.loop ?? false;
      player.oneShot = config2?.oneShot ?? false;
      player.position = config2?.position;
      player.playOffset = config2?.playOffset ?? 0;
      player.channel = config2?.channel ?? AudioChannel.Sfx;
      player.volume = config2?.volume ?? DEF_VOL;
      player.play();
    }
    playOneShot(id, config2) {
      if (!config2)
        this.play(id, { oneShot: true });
      config2.loop = false;
      config2.priority = false;
      config2.oneShot = true;
      this.play(id, config2);
    }
    /**
     * Advances the _playerCacheIndex and stops the player on that position.
     *
     * @returns A BufferPlayer with PlayState.Stopped, or undefined if no player can be stopped.
     */
    _getAvailablePlayer() {
      if (this._amountOfFreePlayers < 1)
        return;
      this._playerCacheIndex = (this._playerCacheIndex + 1) % this._amountOfFreePlayers;
      const player = this._playerCache[this._playerCacheIndex];
      player.stop();
      return player;
    }
    autoplay(id, config2) {
      if (this._unlocked) {
        return this.play(id, config2);
      }
      const uniqueId = this._generateUniqueId(id);
      this._autoplayStorage.push([uniqueId, config2]);
      return uniqueId;
    }
    stop(playId) {
      this._playerCache.forEach((player) => {
        if (player.playId === playId) {
          player.stop();
          return;
        }
      });
    }
    pause(playId) {
      this._playerCache.forEach((player) => {
        if (player.playId === playId) {
          player.pause();
          return;
        }
      });
    }
    resume(playId) {
      this._playerCache.forEach((player) => {
        if (player.playId === playId) {
          player.resume();
          return;
        }
      });
    }
    stopOneShots() {
      this._playerCache.forEach((player) => {
        if (player.oneShot) {
          player.stop();
          return;
        }
      });
    }
    resumeAll() {
      this._playerCache.forEach((player) => {
        player.resume();
      });
    }
    pauseAll() {
      this._playerCache.forEach((player) => {
        player.pause();
      });
    }
    stopAll() {
      this._playerCache.forEach((player) => {
        player.stop();
      });
    }
    setGlobalVolume(channel, volume, time = 0) {
      volume = Math.max(MIN_VOLUME, volume);
      time = _audioContext.currentTime + Math.max(MIN_RAMP_TIME, time);
      switch (channel) {
        case AudioChannel.Music:
          this._musicGain.gain.linearRampToValueAtTime(volume, time);
          break;
        case AudioChannel.Sfx:
          this._sfxGain.gain.linearRampToValueAtTime(volume, time);
          break;
        case AudioChannel.Master:
          this._masterGain.gain.linearRampToValueAtTime(volume, time);
          break;
        default:
          return;
      }
    }
    remove(id) {
      if (id < 0)
        return;
      this.stop(id);
      this._bufferCache[id] = void 0;
      this._instanceCounter[id] = -1;
    }
    removeAll() {
      this.stopAll();
      this._bufferCache.length = 0;
      this._instanceCounter.length = 0;
    }
    getSourceIdFromPlayId(playId) {
      return playId >> SHIFT_AMOUNT;
    }
    get amountOfFreePlayers() {
      return this._amountOfFreePlayers;
    }
    _selectRandomBuffer(bufferList) {
      return bufferList[Math.floor(this.randomBufferSelectFunction() * bufferList.length)];
    }
    _generateUniqueId(id) {
      let instanceCount = this._instanceCounter[id];
      if (!instanceCount)
        instanceCount = 0;
      else if (instanceCount === -1)
        return -1;
      const unique_id = (id << SHIFT_AMOUNT) + instanceCount;
      this._instanceCounter[id] = (instanceCount + 1) % MAX_NUMBER_OF_INSTANCES;
      return unique_id;
    }
    /**
     * @warning This function is for internal use only!
     */
    _returnPriorityPlayer(player) {
      if (!player.priority)
        return;
      for (let i = this._playerCache.length - 1; i >= 0; i--) {
        if (this._playerCache[i] === player) {
          this._playerCache.splice(i, 1);
          this._playerCache.unshift(player);
          this._amountOfFreePlayers++;
          return;
        }
      }
    }
    _unlockAudioContext() {
      const unlockHandler = () => {
        _audioContext.resume().then(() => {
          window.removeEventListener("click", unlockHandler);
          window.removeEventListener("touch", unlockHandler);
          window.removeEventListener("keydown", unlockHandler);
          window.removeEventListener("mousedown", unlockHandler);
          this._unlocked = true;
          for (const audio of this._autoplayStorage) {
            this._playWithUniqueId(audio[0], audio[1]);
          }
          this._autoplayStorage.length = 0;
        });
      };
      window.addEventListener("click", unlockHandler);
      window.addEventListener("touch", unlockHandler);
      window.addEventListener("keydown", unlockHandler);
      window.addEventListener("mousedown", unlockHandler);
    }
  };
  var EmptyAudioManager = class {
    async load(path, id) {
    }
    async loadBatch(...pair) {
    }
    play(id, config2) {
      return -1;
    }
    playOneShot(id, config2) {
    }
    autoplay(id, config2) {
      return -1;
    }
    stop(playId) {
    }
    pause(playId) {
    }
    resume(playId) {
    }
    stopOneShots() {
    }
    resumeAll() {
    }
    pauseAll() {
    }
    stopAll() {
    }
    setGlobalVolume(channel, volume, time) {
    }
    remove(id) {
    }
    removeAll() {
    }
    getSourceIdFromPlayId(playId) {
      return -1;
    }
    get amountOfFreePlayers() {
      return -1;
    }
  };
  var globalAudioManager = window.AudioContext ? new AudioManager() : new EmptyAudioManager();

  // node_modules/@wonderlandengine/spatial-audio/dist/audio-source.js
  var __decorate8 = function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d2;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if (d2 = decorators[i])
          r = (c < 3 ? d2(r) : c > 3 ? d2(target, key, r) : d2(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  var PanningType;
  (function(PanningType2) {
    PanningType2[PanningType2["None"] = 0] = "None";
    PanningType2[PanningType2["Regular"] = 1] = "Regular";
    PanningType2[PanningType2["Hrtf"] = 2] = "Hrtf";
  })(PanningType || (PanningType = {}));
  var posVec = new Float32Array(3);
  var oriVec = new Float32Array(3);
  var distanceModels = ["linear", "exponential", "inverse"];
  var bufferCache = /* @__PURE__ */ new Map();
  async function loadAudio(source) {
    const response = await fetch(source);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = await _audioContext.decodeAudioData(arrayBuffer);
    return buffer;
  }
  async function addBufferToCache(source) {
    let audio;
    if (bufferCache.has(source)) {
      audio = bufferCache.get(source);
      audio.referenceCount += 1;
    } else {
      audio = {
        referenceCount: 1,
        buffer: loadAudio(source)
        // Delay await until bufferCache is set, to avoid subsequent calls with same source to start decoding
      };
      bufferCache.set(source, audio);
    }
    return await audio.buffer;
  }
  function removeBufferFromCache(source) {
    if (!bufferCache.has(source)) {
      return;
    }
    const audioFile = bufferCache.get(source);
    if (audioFile.referenceCount > 1) {
      audioFile.referenceCount -= 1;
    } else {
      bufferCache.delete(source);
    }
  }
  var AudioSource = class extends Component3 {
    static onRegister(engine) {
      engine.registerComponent(AudioListener);
    }
    /** Path to the audio file that should be played. */
    src;
    /**
     * Volume of the audio source.
     *
     * @remarks This will only take effect audio that has not started playing yet. Is the audio already playing, use
     * setVolumeDuringPlayback()
     * @see setVolumeDuringPlayback
     */
    volume;
    /** Whether to loop the sound. */
    loop;
    /** Whether to autoplay the sound. */
    autoplay;
    /**
     * Select the panning method.
     *
     * @warning Enabling HRTF (Head-Related Transfer Function) is computationally more intensive than regular panning!
     */
    spatial;
    /**
     * Set this property if the object will never move.
     * Disabling position updates each frame saves CPU time.
     */
    isStationary;
    /** The distance model used for spatial audio. */
    distanceModel;
    /** The maximum distance for audio falloff. */
    maxDistance;
    /** The reference distance for audio falloff. */
    refDistance;
    /** The rolloff factor for audio falloff. */
    rolloffFactor;
    /** The inner angle of the audio cone. */
    coneInnerAngle;
    /** The outer angle of the audio cone. */
    coneOuterAngle;
    /** The outer gain of the audio cone. */
    coneOuterGain;
    /**
     * The emitter will notify all subscribers when a state change occurs.
     * @see PlayState
     */
    emitter = new Emitter();
    _pannerOptions = {};
    _buffer;
    _pannerNode = new PannerNode(_audioContext);
    _audioNode = new AudioBufferSourceNode(_audioContext);
    _isPlaying = false;
    _time = 0;
    _gainNode = new GainNode(_audioContext);
    /**
     * Initializes the audio src component.
     * If `autoplay` is enabled, the audio will start playing as soon as the file is loaded.
     */
    async start() {
      this._gainNode.connect(_audioContext.destination);
      if (this.src !== "") {
        this._buffer = await addBufferToCache(this.src);
        this.emitter.notify(PlayState.Ready);
        if (this.autoplay) {
          this.play();
        }
      }
    }
    setAudioChannel(am, channel) {
      this.stop();
      switch (channel) {
        case AudioChannel.Music:
          this._gainNode.disconnect();
          this._gainNode.connect(am["_musicGain"]);
          break;
        case AudioChannel.Sfx:
          this._gainNode.disconnect();
          this._gainNode.connect(am["_sfxGain"]);
          break;
        case AudioChannel.Master:
          this._gainNode.disconnect();
          this._gainNode.connect(am["_masterGain"]);
          break;
        default:
          return;
      }
    }
    /**
     * Plays the audio associated with this audio src.
     *
     * @param buffer Optional parameter that will set the raw audio buffer that should be played. Defaults to internal audio buffer that is set with given audio path.
     * @remarks Is this audio-source currently playing, playback will be restarted.
     */
    async play(buffer = this._buffer) {
      if (this._isPlaying) {
        this.stop();
      } else if (_audioContext.state === "suspended") {
        await _unlockAudioContext();
      }
      this._gainNode.gain.value = this.volume;
      this._audioNode.buffer = buffer;
      this._audioNode.loop = this.loop;
      if (!this.spatial) {
        this._audioNode.connect(this._gainNode);
      } else {
        this._updateSettings();
        this._pannerNode = new PannerNode(_audioContext, this._pannerOptions);
        this._audioNode.connect(this._pannerNode).connect(this._gainNode);
      }
      this._audioNode.onended = () => this.stop();
      this._audioNode.start();
      this._isPlaying = true;
      if (!this.isStationary) {
        this.update = this._update.bind(this);
      }
      this.emitter.notify(PlayState.Playing);
    }
    /**
     * Stops the audio associated with this audio src.
     */
    stop() {
      if (!this._isPlaying)
        return;
      this._isPlaying = false;
      this._audioNode.onended = null;
      this._audioNode.stop();
      this.update = void 0;
      this._audioNode.disconnect();
      this._pannerNode.disconnect();
      this._audioNode = new AudioBufferSourceNode(_audioContext);
      this.emitter.notify(PlayState.Stopped);
    }
    /**
     * Checks if the audio src is currently playing.
     */
    get isPlaying() {
      return this._isPlaying;
    }
    /**
     * Changes the volume during playback.
     * @param v Volume that source should have.
     * @param t Optional parameter that specifies the time it takes for the volume to reach its specified value in
     * seconds (Default is 0).
     */
    setVolumeDuringPlayback(v2, t = 0) {
      const volume = Math.max(MIN_VOLUME, v2);
      const time = _audioContext.currentTime + Math.max(MIN_RAMP_TIME, t);
      this._gainNode.gain.linearRampToValueAtTime(volume, time);
    }
    /**
     * Change out the source.
     *
     * @param path Path to the audio file.
     */
    async changeAudioSource(path) {
      this._buffer = await addBufferToCache(path);
      removeBufferFromCache(this.src);
      this.src = path;
    }
    /**
     * Called when the component is deactivated.
     * Stops the audio playback.
     */
    onDeactivate() {
      this.stop();
    }
    /**
     * Called when the component is destroyed.
     * Stops the audio playback and removes the src from cache.
     */
    onDestroy() {
      this.stop();
      this._gainNode.disconnect();
      removeBufferFromCache(this.src);
    }
    _update(dt) {
      this.object.getPositionWorld(posVec);
      this.object.getForwardWorld(oriVec);
      this._time = _audioContext.currentTime + dt;
      this._pannerNode.positionX.linearRampToValueAtTime(posVec[0], this._time);
      this._pannerNode.positionY.linearRampToValueAtTime(posVec[2], this._time);
      this._pannerNode.positionZ.linearRampToValueAtTime(-posVec[1], this._time);
      this._pannerNode.orientationX.linearRampToValueAtTime(oriVec[0], this._time);
      this._pannerNode.orientationY.linearRampToValueAtTime(oriVec[2], this._time);
      this._pannerNode.orientationZ.linearRampToValueAtTime(-oriVec[1], this._time);
    }
    /**
     * @deprecated Use {@link #volume} instead
     */
    set maxVolume(v2) {
      this.volume = v2;
    }
    /**
     * @deprecated Use {@link #volume} instead
     */
    get maxVolume() {
      return this.volume;
    }
    _updateSettings() {
      this.object.getPositionWorld(posVec);
      this.object.getForwardWorld(oriVec);
      this._pannerOptions = {
        coneInnerAngle: this.coneInnerAngle,
        coneOuterAngle: this.coneOuterAngle,
        coneOuterGain: this.coneOuterGain,
        distanceModel: this._distanceModelSelector(),
        maxDistance: this.maxDistance,
        refDistance: this.refDistance,
        rolloffFactor: this.rolloffFactor,
        panningModel: this.spatial === PanningType.Hrtf ? "HRTF" : "equalpower",
        positionX: posVec[0],
        positionY: posVec[2],
        positionZ: -posVec[1],
        orientationX: oriVec[0],
        orientationY: oriVec[2],
        orientationZ: -oriVec[1]
      };
    }
    _distanceModelSelector() {
      if (distanceModels.includes(this.distanceModel)) {
        return this.distanceModel;
      }
      return "exponential";
    }
  };
  /**
   * The type name for this component.
   */
  __publicField(AudioSource, "TypeName", "audio-source");
  __decorate8([
    property.string()
  ], AudioSource.prototype, "src", void 0);
  __decorate8([
    property.float(1)
  ], AudioSource.prototype, "volume", void 0);
  __decorate8([
    property.bool(false)
  ], AudioSource.prototype, "loop", void 0);
  __decorate8([
    property.bool(false)
  ], AudioSource.prototype, "autoplay", void 0);
  __decorate8([
    property.enum(["none", "panning", "hrtf"], PanningType.Regular)
  ], AudioSource.prototype, "spatial", void 0);
  __decorate8([
    property.bool(false)
  ], AudioSource.prototype, "isStationary", void 0);
  __decorate8([
    property.enum(["linear", "inverse", "exponential"], "exponential")
  ], AudioSource.prototype, "distanceModel", void 0);
  __decorate8([
    property.float(1e4)
  ], AudioSource.prototype, "maxDistance", void 0);
  __decorate8([
    property.float(1)
  ], AudioSource.prototype, "refDistance", void 0);
  __decorate8([
    property.float(1)
  ], AudioSource.prototype, "rolloffFactor", void 0);
  __decorate8([
    property.float(360)
  ], AudioSource.prototype, "coneInnerAngle", void 0);
  __decorate8([
    property.float(0)
  ], AudioSource.prototype, "coneOuterAngle", void 0);
  __decorate8([
    property.float(0)
  ], AudioSource.prototype, "coneOuterGain", void 0);

  // node_modules/@wonderlandengine/components/dist/howler-audio-listener.js
  var HowlerAudioListener = class extends AudioListener {
  };
  __publicField(HowlerAudioListener, "TypeName", "howler-audio-listener");

  // node_modules/@wonderlandengine/components/dist/howler-audio-source.js
  var HowlerAudioSource = class extends AudioSource {
  };
  __publicField(HowlerAudioSource, "TypeName", "howler-audio-source");

  // node_modules/@wonderlandengine/components/dist/utils/utils.js
  function setFirstMaterialTexture(mat, texture, customTextureProperty) {
    if (customTextureProperty !== "auto") {
      mat[customTextureProperty] = texture;
      return true;
    }
    const shader = mat.shader;
    if (shader === "Flat Opaque Textured") {
      mat.flatTexture = texture;
      return true;
    } else if (shader === "Phong Opaque Textured" || shader === "Foliage" || shader === "Phong Normalmapped" || shader === "Phong Lightmapped") {
      mat.diffuseTexture = texture;
      return true;
    } else if (shader === "Particle") {
      mat.mainTexture = texture;
      return true;
    } else if (shader === "DistanceFieldVector") {
      mat.vectorTexture = texture;
      return true;
    } else if (shader === "Background" || shader === "Sky") {
      mat.texture = texture;
      return true;
    } else if (shader === "Physical Opaque Textured") {
      mat.albedoTexture = texture;
      return true;
    }
    return false;
  }
  function deg2rad(value) {
    return value * Math.PI / 180;
  }
  function rad2deg(value) {
    return value * 180 / Math.PI;
  }

  // node_modules/@wonderlandengine/components/dist/image-texture.js
  var __decorate9 = function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d2;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if (d2 = decorators[i])
          r = (c < 3 ? d2(r) : c > 3 ? d2(target, key, r) : d2(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  var ImageTexture = class extends Component3 {
    /** URL to download the image from */
    url;
    /** Material to apply the video texture to */
    material;
    /** Name of the texture property to set */
    textureProperty;
    texture;
    start() {
      this.engine.textures.load(this.url, "anonymous").then((texture) => {
        this.texture = texture;
        const mat = this.material;
        if (!setFirstMaterialTexture(mat, texture, this.textureProperty)) {
          console.error("Pipeline", mat.pipeline, "not supported by image-texture");
        }
      }).catch(console.error);
    }
    onDestroy() {
      this.texture?.destroy();
    }
  };
  __publicField(ImageTexture, "TypeName", "image-texture");
  __decorate9([
    property.string()
  ], ImageTexture.prototype, "url", void 0);
  __decorate9([
    property.material({ required: true })
  ], ImageTexture.prototype, "material", void 0);
  __decorate9([
    property.string("auto")
  ], ImageTexture.prototype, "textureProperty", void 0);

  // node_modules/@wonderlandengine/components/dist/mouse-look.js
  var __decorate10 = function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d2;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if (d2 = decorators[i])
          r = (c < 3 ? d2(r) : c > 3 ? d2(target, key, r) : d2(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  var preventDefault = (e) => {
    e.preventDefault();
  };
  var TEMP_ROT = new Float32Array(4);
  var ROT_MUL = 180 / Math.PI / 100;
  var MouseLookComponent = class extends Component3 {
    /** Mouse look sensitivity */
    sensitity = 0.25;
    /** Require a mouse button to be pressed to control view.
     * Otherwise view will allways follow mouse movement */
    requireMouseDown = true;
    /** If "moveOnClick" is enabled, mouse button which should
     * be held down to control view */
    mouseButtonIndex = 0;
    /** Enables pointer lock on "mousedown" event on canvas */
    pointerLockOnClick = false;
    currentRotationY = 0;
    currentRotationX = 0;
    mouseDown = false;
    onActivate() {
      document.addEventListener("mousemove", this.onMouseMove);
      const canvas2 = this.engine.canvas;
      if (this.pointerLockOnClick) {
        canvas2.addEventListener("mousedown", this.requestPointerLock);
      }
      if (this.requireMouseDown) {
        if (this.mouseButtonIndex === 2) {
          canvas2.addEventListener("contextmenu", preventDefault, false);
        }
        canvas2.addEventListener("mousedown", this.onMouseDown);
        canvas2.addEventListener("mouseup", this.onMouseUp);
      }
    }
    onDeactivate() {
      document.removeEventListener("mousemove", this.onMouseMove);
      const canvas2 = this.engine.canvas;
      if (this.pointerLockOnClick) {
        canvas2.removeEventListener("mousedown", this.requestPointerLock);
      }
      if (this.requireMouseDown) {
        if (this.mouseButtonIndex === 2) {
          canvas2.removeEventListener("contextmenu", preventDefault, false);
        }
        canvas2.removeEventListener("mousedown", this.onMouseDown);
        canvas2.removeEventListener("mouseup", this.onMouseUp);
      }
    }
    requestPointerLock = () => {
      const canvas2 = this.engine.canvas;
      canvas2.requestPointerLock = canvas2.requestPointerLock || canvas2.mozRequestPointerLock || canvas2.webkitRequestPointerLock;
      canvas2.requestPointerLock();
    };
    onMouseDown = (e) => {
      if (e.button === this.mouseButtonIndex) {
        this.mouseDown = true;
        document.body.style.cursor = "grabbing";
        if (e.button === 1) {
          e.preventDefault();
          return false;
        }
      }
    };
    onMouseUp = (e) => {
      if (e.button === this.mouseButtonIndex) {
        this.mouseDown = false;
        document.body.style.cursor = "initial";
      }
    };
    onMouseMove = (e) => {
      if (this.active && (this.mouseDown || !this.requireMouseDown)) {
        this.currentRotationX += -this.sensitity * e.movementY * ROT_MUL;
        this.currentRotationY += -this.sensitity * e.movementX * ROT_MUL;
        this.currentRotationX = Math.max(-89, Math.min(89, this.currentRotationX));
        quat_exports.fromEuler(TEMP_ROT, this.currentRotationX, this.currentRotationY, 0);
        this.object.setRotationLocal(TEMP_ROT);
      }
    };
  };
  __publicField(MouseLookComponent, "TypeName", "mouse-look");
  __decorate10([
    property.float(0.25)
  ], MouseLookComponent.prototype, "sensitity", void 0);
  __decorate10([
    property.bool(true)
  ], MouseLookComponent.prototype, "requireMouseDown", void 0);
  __decorate10([
    property.int()
  ], MouseLookComponent.prototype, "mouseButtonIndex", void 0);
  __decorate10([
    property.bool(false)
  ], MouseLookComponent.prototype, "pointerLockOnClick", void 0);

  // node_modules/@wonderlandengine/components/dist/player-height.js
  var __decorate11 = function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d2;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if (d2 = decorators[i])
          r = (c < 3 ? d2(r) : c > 3 ? d2(target, key, r) : d2(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  var PlayerHeight = class extends Component3 {
    height = 1.75;
    onSessionStartCallback;
    onSessionEndCallback;
    start() {
      this.object.resetPositionRotation();
      this.object.translateLocal([0, this.height, 0]);
      this.onSessionStartCallback = this.onXRSessionStart.bind(this);
      this.onSessionEndCallback = this.onXRSessionEnd.bind(this);
    }
    onActivate() {
      this.engine.onXRSessionStart.add(this.onSessionStartCallback);
      this.engine.onXRSessionEnd.add(this.onSessionEndCallback);
    }
    onDeactivate() {
      this.engine.onXRSessionStart.remove(this.onSessionStartCallback);
      this.engine.onXRSessionEnd.remove(this.onSessionEndCallback);
    }
    onXRSessionStart() {
      const type = this.engine.xr?.currentReferenceSpaceType;
      if (type !== "local" && type !== "viewer") {
        this.object.resetPositionRotation();
      }
    }
    onXRSessionEnd() {
      const type = this.engine.xr?.currentReferenceSpaceType;
      if (type !== "local" && type !== "viewer") {
        this.object.resetPositionRotation();
        this.object.translateLocal([0, this.height, 0]);
      }
    }
  };
  __publicField(PlayerHeight, "TypeName", "player-height");
  __decorate11([
    property.float(1.75)
  ], PlayerHeight.prototype, "height", void 0);

  // node_modules/@wonderlandengine/components/dist/target-framerate.js
  var __decorate12 = function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d2;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if (d2 = decorators[i])
          r = (c < 3 ? d2(r) : c > 3 ? d2(target, key, r) : d2(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  var TargetFramerate = class extends Component3 {
    framerate;
    onActivate() {
      this.engine.onXRSessionStart.add(this.setTargetFramerate);
    }
    onDeactivate() {
      this.engine.onXRSessionStart.remove(this.setTargetFramerate);
    }
    setTargetFramerate = (s) => {
      if (s.supportedFrameRates) {
        const a = s.supportedFrameRates;
        a.sort((a2, b2) => Math.abs(a2 - this.framerate) - Math.abs(b2 - this.framerate));
        s.updateTargetFrameRate(a[0]);
      }
    };
  };
  __publicField(TargetFramerate, "TypeName", "target-framerate");
  __decorate12([
    property.float(90)
  ], TargetFramerate.prototype, "framerate", void 0);

  // node_modules/@wonderlandengine/components/dist/teleport.js
  var TeleportComponent = class extends Component3 {
    init() {
      this._prevThumbstickAxis = new Float32Array(2);
      this._tempVec = new Float32Array(3);
      this._tempVec0 = new Float32Array(3);
      this._currentIndicatorRotation = 0;
      this.input = this.object.getComponent("input");
      if (!this.input) {
        console.error(this.object.name, "generic-teleport-component.js: input component is required on the object");
        return;
      }
      if (!this.teleportIndicatorMeshObject) {
        console.error(this.object.name, "generic-teleport-component.js: Teleport indicator mesh is missing");
        return;
      }
      if (!this.camRoot) {
        console.error(this.object.name, "generic-teleport-component.js: camRoot not set");
        return;
      }
      this.isIndicating = false;
      this.indicatorHidden = true;
      this.hitSpot = new Float32Array(3);
      this._hasHit = false;
      this._extraRotation = 0;
      this._currentStickAxes = new Float32Array(2);
    }
    start() {
      if (this.handedness == 0) {
        const inputComp = this.object.getComponent("input");
        if (!inputComp) {
          console.warn("teleport component on object", this.object.name, 'was configured with handedness "input component", but object has no input component.');
        } else {
          this.handedness = inputComp.handedness;
          this.input = inputComp;
        }
      } else {
        this.handedness = ["left", "right"][this.handedness - 1];
      }
      this.onSessionStartCallback = this.setupVREvents.bind(this);
      this.teleportIndicatorMeshObject.active = false;
    }
    onActivate() {
      if (this.cam) {
        this.isMouseIndicating = false;
        canvas.addEventListener("mousedown", this.onMouseDown);
        canvas.addEventListener("mouseup", this.onMouseUp);
      }
      this.engine.onXRSessionStart.add(this.onSessionStartCallback);
    }
    onDeactivate() {
      canvas.addEventListener("mousedown", this.onMouseDown);
      canvas.addEventListener("mouseup", this.onMouseUp);
      this.engine.onXRSessionStart.remove(this.onSessionStartCallback);
    }
    /* Get current camera Y rotation */
    _getCamRotation() {
      this.eyeLeft.getForward(this._tempVec);
      this._tempVec[1] = 0;
      vec3_exports.normalize(this._tempVec, this._tempVec);
      return Math.atan2(this._tempVec[0], this._tempVec[2]);
    }
    update() {
      let inputLength = 0;
      if (this.gamepad && this.gamepad.axes) {
        this._currentStickAxes[0] = this.gamepad.axes[2];
        this._currentStickAxes[1] = this.gamepad.axes[3];
        inputLength = Math.abs(this._currentStickAxes[0]) + Math.abs(this._currentStickAxes[1]);
      }
      if (!this.isIndicating && this._prevThumbstickAxis[1] >= this.thumbstickActivationThreshhold && this._currentStickAxes[1] < this.thumbstickActivationThreshhold) {
        this.isIndicating = true;
      } else if (this.isIndicating && inputLength < this.thumbstickDeactivationThreshhold) {
        this.isIndicating = false;
        this.teleportIndicatorMeshObject.active = false;
        if (this._hasHit) {
          this._teleportPlayer(this.hitSpot, this._extraRotation);
        }
      }
      if (this.isIndicating && this.teleportIndicatorMeshObject && this.input) {
        const origin = this._tempVec0;
        this.object.getPositionWorld(origin);
        const direction2 = this.object.getForwardWorld(this._tempVec);
        let rayHit = this.rayHit = this.rayCastMode == 0 ? this.engine.scene.rayCast(origin, direction2, 1 << this.floorGroup) : this.engine.physics.rayCast(origin, direction2, 1 << this.floorGroup, this.maxDistance);
        if (rayHit.hitCount > 0) {
          this.indicatorHidden = false;
          this._extraRotation = Math.PI + Math.atan2(this._currentStickAxes[0], this._currentStickAxes[1]);
          this._currentIndicatorRotation = this._getCamRotation() + (this._extraRotation - Math.PI);
          this.teleportIndicatorMeshObject.resetPositionRotation();
          this.teleportIndicatorMeshObject.rotateAxisAngleRad([0, 1, 0], this._currentIndicatorRotation);
          this.teleportIndicatorMeshObject.translate(rayHit.locations[0]);
          this.teleportIndicatorMeshObject.translate([
            0,
            this.indicatorYOffset,
            0
          ]);
          this.teleportIndicatorMeshObject.active = true;
          this.hitSpot.set(rayHit.locations[0]);
          this._hasHit = true;
        } else {
          if (!this.indicatorHidden) {
            this.teleportIndicatorMeshObject.active = false;
            this.indicatorHidden = true;
          }
          this._hasHit = false;
        }
      } else if (this.teleportIndicatorMeshObject && this.isMouseIndicating) {
        this.onMousePressed();
      }
      this._prevThumbstickAxis.set(this._currentStickAxes);
    }
    setupVREvents(s) {
      this.session = s;
      s.addEventListener("end", function() {
        this.gamepad = null;
        this.session = null;
      }.bind(this));
      if (s.inputSources && s.inputSources.length) {
        for (let i = 0; i < s.inputSources.length; i++) {
          let inputSource = s.inputSources[i];
          if (inputSource.handedness == this.handedness) {
            this.gamepad = inputSource.gamepad;
          }
        }
      }
      s.addEventListener("inputsourceschange", function(e) {
        if (e.added && e.added.length) {
          for (let i = 0; i < e.added.length; i++) {
            let inputSource = e.added[i];
            if (inputSource.handedness == this.handedness) {
              this.gamepad = inputSource.gamepad;
            }
          }
        }
      }.bind(this));
    }
    onMouseDown = () => {
      this.isMouseIndicating = true;
    };
    onMouseUp = () => {
      this.isMouseIndicating = false;
      this.teleportIndicatorMeshObject.active = false;
      if (this._hasHit) {
        this._teleportPlayer(this.hitSpot, 0);
      }
    };
    onMousePressed() {
      let origin = [0, 0, 0];
      this.cam.getPositionWorld(origin);
      const direction2 = this.cam.getForward(this._tempVec);
      let rayHit = this.rayHit = this.rayCastMode == 0 ? this.engine.scene.rayCast(origin, direction2, 1 << this.floorGroup) : this.engine.physics.rayCast(origin, direction2, 1 << this.floorGroup, this.maxDistance);
      if (rayHit.hitCount > 0) {
        this.indicatorHidden = false;
        direction2[1] = 0;
        vec3_exports.normalize(direction2, direction2);
        this._currentIndicatorRotation = -Math.sign(direction2[2]) * Math.acos(direction2[0]) - Math.PI * 0.5;
        this.teleportIndicatorMeshObject.resetPositionRotation();
        this.teleportIndicatorMeshObject.rotateAxisAngleRad([0, 1, 0], this._currentIndicatorRotation);
        this.teleportIndicatorMeshObject.translate(rayHit.locations[0]);
        this.teleportIndicatorMeshObject.active = true;
        this.hitSpot = rayHit.locations[0];
        this._hasHit = true;
      } else {
        if (!this.indicatorHidden) {
          this.teleportIndicatorMeshObject.active = false;
          this.indicatorHidden = true;
        }
        this._hasHit = false;
      }
    }
    _teleportPlayer(newPosition, rotationToAdd) {
      this.camRoot.rotateAxisAngleRad([0, 1, 0], rotationToAdd);
      const p2 = this._tempVec;
      const p1 = this._tempVec0;
      if (this.session) {
        this.eyeLeft.getPositionWorld(p2);
        this.eyeRight.getPositionWorld(p1);
        vec3_exports.add(p2, p2, p1);
        vec3_exports.scale(p2, p2, 0.5);
      } else {
        this.cam.getPositionWorld(p2);
      }
      this.camRoot.getPositionWorld(p1);
      vec3_exports.sub(p2, p1, p2);
      p2[0] += newPosition[0];
      p2[1] = newPosition[1];
      p2[2] += newPosition[2];
      this.camRoot.setPositionWorld(p2);
    }
  };
  __publicField(TeleportComponent, "TypeName", "teleport");
  __publicField(TeleportComponent, "Properties", {
    /** Object that will be placed as indiciation forwhere the player will teleport to. */
    teleportIndicatorMeshObject: { type: Type.Object },
    /** Root of the player, the object that will be positioned on teleportation. */
    camRoot: { type: Type.Object },
    /** Non-vr camera for use outside of VR */
    cam: { type: Type.Object },
    /** Left eye for use in VR*/
    eyeLeft: { type: Type.Object },
    /** Right eye for use in VR*/
    eyeRight: { type: Type.Object },
    /** Handedness for VR cursors to accept trigger events only from respective controller. */
    handedness: {
      type: Type.Enum,
      values: ["input component", "left", "right", "none"],
      default: "input component"
    },
    /** Collision group of valid "floor" objects that can be teleported on */
    floorGroup: { type: Type.Int, default: 1 },
    /** How far the thumbstick needs to be pushed to have the teleport target indicator show up */
    thumbstickActivationThreshhold: { type: Type.Float, default: -0.7 },
    /** How far the thumbstick needs to be released to execute the teleport */
    thumbstickDeactivationThreshhold: { type: Type.Float, default: 0.3 },
    /** Offset to apply to the indicator object, e.g. to avoid it from Z-fighting with the floor */
    indicatorYOffset: { type: Type.Float, default: 0.01 },
    /** Mode for raycasting, whether to use PhysX or simple collision components */
    rayCastMode: {
      type: Type.Enum,
      values: ["collision", "physx"],
      default: "collision"
    },
    /** Max distance for PhysX raycast */
    maxDistance: { type: Type.Float, default: 100 }
  });

  // node_modules/@wonderlandengine/components/dist/trail.js
  var __decorate13 = function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d2;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if (d2 = decorators[i])
          r = (c < 3 ? d2(r) : c > 3 ? d2(target, key, r) : d2(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  var direction = vec3_exports.create();
  var offset = vec3_exports.create();
  var normal = vec3_exports.create();
  var UP = vec3_exports.fromValues(0, 1, 0);
  var Trail = class extends Component3 {
    /** The material to apply to the trail mesh */
    material = null;
    /** The number of segments in the trail mesh */
    segments = 50;
    /** The time interval before recording a new point */
    interval = 0.1;
    /** The width of the trail (in world space) */
    width = 1;
    /** Whether or not the trail should taper off */
    taper = true;
    /**
     * The maximum delta time in seconds, above which the trail resets.
     * This prevents the trail from jumping around when updates happen
     * infrequently (e.g. when the tab doesn't have focus).
     */
    resetThreshold = 0.5;
    _currentPointIndex = 0;
    _timeTillNext = 0;
    _points = [];
    _trailContainer = null;
    _meshComp = null;
    _mesh = null;
    _indexData = null;
    start() {
      this._points = new Array(this.segments + 1);
      for (let i = 0; i < this._points.length; ++i) {
        this._points[i] = vec3_exports.create();
      }
      this._timeTillNext = this.interval;
      this._trailContainer = this.engine.scene.addObject();
      this._meshComp = this._trailContainer.addComponent("mesh");
      this._meshComp.material = this.material;
      const vertexCount = 2 * this._points.length;
      this._indexData = new Uint32Array(6 * this.segments);
      for (let i = 0, v2 = 0; i < vertexCount - 2; i += 2, v2 += 6) {
        this._indexData.subarray(v2, v2 + 6).set([i + 1, i + 0, i + 2, i + 2, i + 3, i + 1]);
      }
      this._mesh = new Mesh(this.engine, {
        vertexCount,
        indexData: this._indexData,
        indexType: MeshIndexType.UnsignedInt
      });
      this._meshComp.mesh = this._mesh;
    }
    updateVertices() {
      if (!this._mesh)
        return;
      const positions = this._mesh.attribute(MeshAttribute.Position);
      const texCoords = this._mesh.attribute(MeshAttribute.TextureCoordinate);
      const normals = this._mesh.attribute(MeshAttribute.Normal);
      vec3_exports.set(direction, 0, 0, 0);
      for (let i = 0; i < this._points.length; ++i) {
        const curr = this._points[(this._currentPointIndex + i + 1) % this._points.length];
        const next = this._points[(this._currentPointIndex + i + 2) % this._points.length];
        if (i !== this._points.length - 1) {
          vec3_exports.sub(direction, next, curr);
        }
        vec3_exports.cross(offset, UP, direction);
        vec3_exports.normalize(offset, offset);
        const timeFraction = 1 - this._timeTillNext / this.interval;
        const fraction = (i - timeFraction) / this.segments;
        vec3_exports.scale(offset, offset, (this.taper ? fraction : 1) * this.width / 2);
        positions.set(i * 2, [
          curr[0] - offset[0],
          curr[1] - offset[1],
          curr[2] - offset[2]
        ]);
        positions.set(i * 2 + 1, [
          curr[0] + offset[0],
          curr[1] + offset[1],
          curr[2] + offset[2]
        ]);
        if (normals) {
          vec3_exports.cross(normal, direction, offset);
          vec3_exports.normalize(normal, normal);
          normals.set(i * 2, normal);
          normals.set(i * 2 + 1, normal);
        }
        if (texCoords) {
          texCoords.set(i * 2, [0, fraction]);
          texCoords.set(i * 2 + 1, [1, fraction]);
        }
      }
      this._mesh.update();
    }
    resetTrail() {
      this.object.getPositionWorld(this._points[0]);
      for (let i = 1; i < this._points.length; ++i) {
        vec3_exports.copy(this._points[i], this._points[0]);
      }
      this._currentPointIndex = 0;
      this._timeTillNext = this.interval;
    }
    update(dt) {
      this._timeTillNext -= dt;
      if (dt > this.resetThreshold) {
        this.resetTrail();
      }
      if (this._timeTillNext < 0) {
        this._currentPointIndex = (this._currentPointIndex + 1) % this._points.length;
        this._timeTillNext = this._timeTillNext % this.interval + this.interval;
      }
      this.object.getPositionWorld(this._points[this._currentPointIndex]);
      this.updateVertices();
    }
    onActivate() {
      this.resetTrail();
      if (this._meshComp)
        this._meshComp.active = true;
    }
    onDeactivate() {
      if (this._meshComp)
        this._meshComp.active = false;
    }
    onDestroy() {
      if (this._trailContainer)
        this._trailContainer.destroy();
      if (this._mesh)
        this._mesh.destroy();
    }
  };
  __publicField(Trail, "TypeName", "trail");
  __decorate13([
    property.material()
  ], Trail.prototype, "material", void 0);
  __decorate13([
    property.int(50)
  ], Trail.prototype, "segments", void 0);
  __decorate13([
    property.float(50)
  ], Trail.prototype, "interval", void 0);
  __decorate13([
    property.float(1)
  ], Trail.prototype, "width", void 0);
  __decorate13([
    property.bool(true)
  ], Trail.prototype, "taper", void 0);
  __decorate13([
    property.float(1)
  ], Trail.prototype, "resetThreshold", void 0);

  // node_modules/@wonderlandengine/components/dist/two-joint-ik-solver.js
  function clamp(v2, a, b2) {
    return Math.max(a, Math.min(v2, b2));
  }
  var rootScaling = new Float32Array(3);
  var tempQuat3 = new Float32Array(4);
  var twoJointIK = function() {
    const ta = new Float32Array(3);
    const ca = new Float32Array(3);
    const ba = new Float32Array(3);
    const ab = new Float32Array(3);
    const cb = new Float32Array(3);
    const axis0 = new Float32Array(3);
    const axis1 = new Float32Array(3);
    const temp = new Float32Array(3);
    return function(root, middle, b2, c, targetPos, eps, helper) {
      ba.set(b2);
      const lab = vec3_exports.length(ba);
      vec3_exports.sub(ta, b2, c);
      const lcb = vec3_exports.length(ta);
      ta.set(targetPos);
      const lat = clamp(vec3_exports.length(ta), eps, lab + lcb - eps);
      ca.set(c);
      vec3_exports.scale(ab, b2, -1);
      vec3_exports.sub(cb, c, b2);
      vec3_exports.normalize(ca, ca);
      vec3_exports.normalize(ba, ba);
      vec3_exports.normalize(ab, ab);
      vec3_exports.normalize(cb, cb);
      vec3_exports.normalize(ta, ta);
      const ac_ab_0 = Math.acos(clamp(vec3_exports.dot(ca, ba), -1, 1));
      const ba_bc_0 = Math.acos(clamp(vec3_exports.dot(ab, cb), -1, 1));
      const ac_at_0 = Math.acos(clamp(vec3_exports.dot(ca, ta), -1, 1));
      const ac_ab_1 = Math.acos(clamp((lcb * lcb - lab * lab - lat * lat) / (-2 * lab * lat), -1, 1));
      const ba_bc_1 = Math.acos(clamp((lat * lat - lab * lab - lcb * lcb) / (-2 * lab * lcb), -1, 1));
      if (helper) {
        vec3_exports.sub(ba, helper, b2);
        vec3_exports.normalize(ba, ba);
      }
      vec3_exports.cross(axis0, ca, ba);
      vec3_exports.normalize(axis0, axis0);
      vec3_exports.cross(axis1, c, targetPos);
      vec3_exports.normalize(axis1, axis1);
      middle.transformVectorInverseLocal(temp, axis0);
      root.rotateAxisAngleRadObject(axis1, ac_at_0);
      root.rotateAxisAngleRadObject(axis0, ac_ab_1 - ac_ab_0);
      middle.rotateAxisAngleRadObject(axis0, ba_bc_1 - ba_bc_0);
    };
  }();
  var TwoJointIkSolver = class extends Component3 {
    time = 0;
    middlePos = new Float32Array(3);
    endPos = new Float32Array(3);
    targetPos = new Float32Array(3);
    helperPos = new Float32Array(3);
    rootTransform = new Float32Array(8);
    middleTransform = new Float32Array(8);
    endTransform = new Float32Array(8);
    start() {
      this.root.getTransformLocal(this.rootTransform);
      this.middle.getTransformLocal(this.middleTransform);
      this.end.getTransformLocal(this.endTransform);
    }
    update(dt) {
      this.time += dt;
      this.root.setTransformLocal(this.rootTransform);
      this.middle.setTransformLocal(this.middleTransform);
      this.end.setTransformLocal(this.endTransform);
      this.root.getScalingWorld(rootScaling);
      this.middle.getPositionLocal(this.middlePos);
      this.end.getPositionLocal(this.endPos);
      this.middle.transformPointLocal(this.endPos, this.endPos);
      if (this.helper) {
        this.helper.getPositionWorld(this.helperPos);
        this.root.transformPointInverseWorld(this.helperPos, this.helperPos);
        vec3_exports.div(this.helperPos, this.helperPos, rootScaling);
      }
      this.target.getPositionWorld(this.targetPos);
      this.root.transformPointInverseWorld(this.targetPos, this.targetPos);
      vec3_exports.div(this.targetPos, this.targetPos, rootScaling);
      twoJointIK(this.root, this.middle, this.middlePos, this.endPos, this.targetPos, 0.01, this.helper ? this.helperPos : null, this.time);
      if (this.copyTargetRotation) {
        this.end.setRotationWorld(this.target.getRotationWorld(tempQuat3));
      }
    }
  };
  __publicField(TwoJointIkSolver, "TypeName", "two-joint-ik-solver");
  __publicField(TwoJointIkSolver, "Properties", {
    /** Root bone, never moves */
    root: Property.object(),
    /** Bone attached to the root */
    middle: Property.object(),
    /** Bone attached to the middle */
    end: Property.object(),
    /** Target the joins should reach for */
    target: Property.object(),
    /** Flag for copying rotation from target to end */
    copyTargetRotation: Property.bool(true),
    /** Helper object to use to determine joint rotation axis */
    helper: Property.object()
  });

  // node_modules/@wonderlandengine/components/dist/video-texture.js
  var __decorate14 = function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d2;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if (d2 = decorators[i])
          r = (c < 3 ? d2(r) : c > 3 ? d2(target, key, r) : d2(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  var VideoTexture = class extends Component3 {
    /** URL to download video from */
    url;
    /** Material to apply the video texture to */
    material;
    /** Whether to loop the video */
    loop;
    /** Whether to automatically start playing the video */
    autoplay;
    /** Whether to mute sound */
    muted;
    /** Name of the texture property to set */
    textureProperty;
    loaded = false;
    frameUpdateRequested = true;
    video;
    texture;
    start() {
      this.video = document.createElement("video");
      this.video.src = this.url;
      this.video.crossOrigin = "anonymous";
      this.video.playsInline = true;
      this.video.loop = this.loop;
      this.video.muted = this.muted;
      this.video.addEventListener("playing", () => {
        this.loaded = true;
      });
      if (this.autoplay) {
        if (this.muted) {
          this.video?.play();
        } else {
          window.addEventListener("click", this.playAfterUserGesture);
          window.addEventListener("touchstart", this.playAfterUserGesture);
        }
      }
    }
    onDestroy() {
      this.video?.remove();
      this.texture?.destroy();
      if (this.autoplay && !this.muted) {
        window.removeEventListener("click", this.playAfterUserGesture);
        window.removeEventListener("touchstart", this.playAfterUserGesture);
      }
    }
    applyTexture() {
      const mat = this.material;
      const pipeline2 = mat.pipeline;
      const texture = this.texture = this.engine.textures.create(this.video);
      if (!setFirstMaterialTexture(mat, texture, this.textureProperty)) {
        console.error("Pipeline", pipeline2, "not supported by video-texture");
      }
      if ("requestVideoFrameCallback" in this.video) {
        this.video.requestVideoFrameCallback(this.updateVideo.bind(this));
      } else {
        this.video.addEventListener("timeupdate", () => {
          this.frameUpdateRequested = true;
        });
      }
    }
    update(dt) {
      if (this.loaded && this.frameUpdateRequested) {
        if (this.texture) {
          this.texture.update();
        } else {
          this.applyTexture();
        }
        this.frameUpdateRequested = false;
      }
    }
    updateVideo() {
      this.frameUpdateRequested = true;
      this.video.requestVideoFrameCallback(this.updateVideo.bind(this));
    }
    playAfterUserGesture = () => {
      this.video?.play();
      window.removeEventListener("click", this.playAfterUserGesture);
      window.removeEventListener("touchstart", this.playAfterUserGesture);
    };
  };
  __publicField(VideoTexture, "TypeName", "video-texture");
  __decorate14([
    property.string()
  ], VideoTexture.prototype, "url", void 0);
  __decorate14([
    property.material({ required: true })
  ], VideoTexture.prototype, "material", void 0);
  __decorate14([
    property.bool(true)
  ], VideoTexture.prototype, "loop", void 0);
  __decorate14([
    property.bool(true)
  ], VideoTexture.prototype, "autoplay", void 0);
  __decorate14([
    property.bool(true)
  ], VideoTexture.prototype, "muted", void 0);
  __decorate14([
    property.string("auto")
  ], VideoTexture.prototype, "textureProperty", void 0);

  // node_modules/@wonderlandengine/components/dist/vr-mode-active-switch.js
  var VrModeActiveSwitch = class extends Component3 {
    start() {
      this.components = [];
      this.getComponents(this.object);
      this.onXRSessionEnd();
      this.onSessionStartCallback = this.onXRSessionStart.bind(this);
      this.onSessionEndCallback = this.onXRSessionEnd.bind(this);
    }
    onActivate() {
      this.engine.onXRSessionStart.add(this.onSessionStartCallback);
      this.engine.onXRSessionEnd.add(this.onSessionEndCallback);
    }
    onDeactivate() {
      this.engine.onXRSessionStart.remove(this.onSessionStartCallback);
      this.engine.onXRSessionEnd.remove(this.onSessionEndCallback);
    }
    getComponents(obj) {
      const comps = obj.getComponents().filter((c) => c.type !== "vr-mode-active-switch");
      this.components = this.components.concat(comps);
      if (this.affectChildren) {
        let children = obj.children;
        for (let i = 0; i < children.length; ++i) {
          this.getComponents(children[i]);
        }
      }
    }
    setComponentsActive(active) {
      const comps = this.components;
      for (let i = 0; i < comps.length; ++i) {
        comps[i].active = active;
      }
    }
    onXRSessionStart() {
      this.setComponentsActive(this.activateComponents == 0);
    }
    onXRSessionEnd() {
      this.setComponentsActive(this.activateComponents != 0);
    }
  };
  __publicField(VrModeActiveSwitch, "TypeName", "vr-mode-active-switch");
  __publicField(VrModeActiveSwitch, "Properties", {
    /** When components should be active: In VR or when not in VR */
    activateComponents: {
      type: Type.Enum,
      values: ["in VR", "in non-VR"],
      default: "in VR"
    },
    /** Whether child object's components should be affected */
    affectChildren: { type: Type.Bool, default: true }
  });

  // node_modules/@wonderlandengine/components/dist/plane-detection.js
  var import_earcut = __toESM(require_earcut(), 1);
  var __decorate15 = function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d2;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if (d2 = decorators[i])
          r = (c < 3 ? d2(r) : c > 3 ? d2(target, key, r) : d2(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  var tempVec32 = new Float32Array(3);
  function extentsFromContour(out, points) {
    if (points.length == 0)
      return out;
    let absMaxX = Math.abs(points[0].x);
    let absMaxZ = Math.abs(points[0].z);
    for (let i = 1; i < points.length; ++i) {
      absMaxX = Math.max(absMaxX, Math.abs(points[i].x));
      absMaxZ = Math.max(absMaxZ, Math.abs(points[i].z));
    }
    out[0] = absMaxX;
    out[1] = 0;
    out[2] = absMaxZ;
  }
  function within(x2, a, b2) {
    if (a > b2)
      return x2 < a && x2 > b2;
    return x2 > a && x2 < b2;
  }
  function isPointLocalOnXRPlanePolygon(p2, plane) {
    const points = plane.polygon;
    if (points.length < 3)
      return false;
    const pX = p2[0];
    const pZ = p2[2];
    let intersections = 0;
    for (let n = 0, l = points.length - 1; n < points.length; ++n) {
      const aX = points[l].x;
      const aZ = points[l].z;
      const s = (points[n].z - aZ) / (points[n].x - aX);
      const x2 = Math.abs((pZ - aZ) / s);
      if (x2 >= 0 && x2 <= 1 && within(x2 + pX, aX, points[n].x))
        ++intersections;
      l = n;
    }
    return (intersections & 1) == 0;
  }
  function isPointWorldOnXRPlanePolygon(object, p2, plane) {
    if (plane.polygon.length < 3)
      return false;
    isPointLocalOnXRPlanePolygon(object.transformPointInverseWorld(tempVec32, p2), plane);
  }
  function planeMeshFromContour(engine, points, meshToUpdate = null) {
    const vertexCount = points.length;
    const vertices = new Float32Array(vertexCount * 2);
    for (let i = 0, d2 = 0; i < vertexCount; ++i, d2 += 2) {
      vertices[d2] = points[i].x;
      vertices[d2 + 1] = points[i].z;
    }
    const triangles = (0, import_earcut.default)(vertices);
    const mesh = meshToUpdate || new Mesh(engine, {
      vertexCount,
      /* Assumption here that we will never have more than 256 points
       * in the detected plane meshes! */
      indexType: MeshIndexType.UnsignedByte,
      indexData: triangles
    });
    if (mesh.vertexCount !== vertexCount) {
      console.warn("vertexCount of meshToUpdate did not match required vertexCount");
      return mesh;
    }
    const positions = mesh.attribute(MeshAttribute.Position);
    const textureCoords = mesh.attribute(MeshAttribute.TextureCoordinate);
    const normals = mesh.attribute(MeshAttribute.Normal);
    tempVec32[1] = 0;
    for (let i = 0, s = 0; i < vertexCount; ++i, s += 2) {
      tempVec32[0] = vertices[s];
      tempVec32[2] = vertices[s + 1];
      positions.set(i, tempVec32);
    }
    textureCoords?.set(0, vertices);
    if (normals) {
      tempVec32[0] = 0;
      tempVec32[1] = 1;
      tempVec32[2] = 0;
      for (let i = 0; i < vertexCount; ++i) {
        normals.set(i, tempVec32);
      }
    }
    if (meshToUpdate)
      mesh.update();
    return mesh;
  }
  var _planeLost, planeLost_fn, _planeFound, planeFound_fn, _planeUpdate, planeUpdate_fn, _planeUpdatePose, planeUpdatePose_fn;
  var PlaneDetection = class extends Component3 {
    constructor() {
      super(...arguments);
      __privateAdd(this, _planeLost);
      __privateAdd(this, _planeFound);
      __privateAdd(this, _planeUpdate);
      __privateAdd(this, _planeUpdatePose);
      /**
       * Material to assign to created plane meshes or `null` if meshes should not be created.
       */
      __publicField(this, "planeMaterial", null);
      /**
       * Collision mask to assign to newly created collision components or a negative value if
       * collision components should not be created.
       */
      __publicField(this, "collisionMask", -1);
      /** Map of all planes and their last updated timestamps */
      __publicField(this, "planes", /* @__PURE__ */ new Map());
      /** Objects generated for each XRPlane */
      __publicField(this, "planeObjects", /* @__PURE__ */ new Map());
      /** Called when a plane starts tracking */
      __publicField(this, "onPlaneFound", new Emitter());
      /** Called when a plane stops tracking */
      __publicField(this, "onPlaneLost", new Emitter());
    }
    update() {
      if (!this.engine.xr?.frame)
        return;
      if (this.engine.xr.frame.detectedPlanes === void 0) {
        console.error("plane-detection: WebXR feature not available.");
        this.active = false;
        return;
      }
      const detectedPlanes = this.engine.xr.frame.detectedPlanes;
      for (const [plane, _2] of this.planes) {
        if (!detectedPlanes.has(plane)) {
          __privateMethod(this, _planeLost, planeLost_fn).call(this, plane);
        }
      }
      detectedPlanes.forEach((plane) => {
        if (this.planes.has(plane)) {
          if (plane.lastChangedTime > this.planes.get(plane)) {
            __privateMethod(this, _planeUpdate, planeUpdate_fn).call(this, plane);
          }
        } else {
          __privateMethod(this, _planeFound, planeFound_fn).call(this, plane);
        }
        __privateMethod(this, _planeUpdatePose, planeUpdatePose_fn).call(this, plane);
      });
    }
  };
  _planeLost = new WeakSet();
  planeLost_fn = function(plane) {
    this.planes.delete(plane);
    const o = this.planeObjects.get(plane);
    this.onPlaneLost.notify(plane, o);
    if (o.objectId > 0)
      o.destroy();
  };
  _planeFound = new WeakSet();
  planeFound_fn = function(plane) {
    this.planes.set(plane, plane.lastChangedTime);
    const o = this.engine.scene.addObject(this.object);
    this.planeObjects.set(plane, o);
    if (this.planeMaterial) {
      o.addComponent(MeshComponent, {
        mesh: planeMeshFromContour(this.engine, plane.polygon),
        material: this.planeMaterial
      });
    }
    if (this.collisionMask >= 0) {
      extentsFromContour(tempVec32, plane.polygon);
      tempVec32[1] = 0.025;
      o.addComponent(CollisionComponent, {
        group: this.collisionMask,
        collider: Collider.Box,
        extents: tempVec32
      });
    }
    this.onPlaneFound.notify(plane, o);
  };
  _planeUpdate = new WeakSet();
  planeUpdate_fn = function(plane) {
    this.planes.set(plane, plane.lastChangedTime);
    const planeMesh = this.planeObjects.get(plane).getComponent(MeshComponent);
    if (!planeMesh)
      return;
    planeMeshFromContour(this.engine, plane.polygon, planeMesh.mesh);
  };
  _planeUpdatePose = new WeakSet();
  planeUpdatePose_fn = function(plane) {
    const o = this.planeObjects.get(plane);
    const pose = this.engine.xr.frame.getPose(plane.planeSpace, this.engine.xr.currentReferenceSpace);
    if (!pose) {
      o.active = false;
      return;
    }
    setXRRigidTransformLocal(o, pose.transform);
  };
  __publicField(PlaneDetection, "TypeName", "plane-detection");
  __decorate15([
    property.material()
  ], PlaneDetection.prototype, "planeMaterial", void 0);
  __decorate15([
    property.int()
  ], PlaneDetection.prototype, "collisionMask", void 0);

  // node_modules/@wonderlandengine/components/dist/vrm.js
  var __decorate16 = function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d2;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if (d2 = decorators[i])
          r = (c < 3 ? d2(r) : c > 3 ? d2(target, key, r) : d2(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  var VRM_ROLL_AXES = {
    X: [1, 0, 0],
    Y: [0, 1, 0],
    Z: [0, 0, 1]
  };
  var VRM_AIM_AXES = {
    PositiveX: [1, 0, 0],
    NegativeX: [-1, 0, 0],
    PositiveY: [0, 1, 0],
    NegativeY: [0, -1, 0],
    PositiveZ: [0, 0, 1],
    NegativeZ: [0, 0, -1]
  };
  var Rad2Deg = 180 / Math.PI;
  var RightVector = vec3_exports.fromValues(1, 0, 0);
  var UpVector = vec3_exports.fromValues(0, 1, 0);
  var ForwardVector = vec3_exports.fromValues(0, 0, 1);
  var Vrm = class extends Component3 {
    /** URL to a VRM file to load */
    src;
    /** Object the VRM is looking at */
    lookAtTarget;
    /** Meta information about the VRM model */
    meta = null;
    /** The humanoid bones of the VRM model */
    bones = {
      /* Torso */
      hips: null,
      spine: null,
      chest: null,
      upperChest: null,
      neck: null,
      /* Head */
      head: null,
      leftEye: null,
      rightEye: null,
      jaw: null,
      /* Legs */
      leftUpperLeg: null,
      leftLowerLeg: null,
      leftFoot: null,
      leftToes: null,
      rightUpperLeg: null,
      rightLowerLeg: null,
      rightFoot: null,
      rightToes: null,
      /* Arms */
      leftShoulder: null,
      leftUpperArm: null,
      leftLowerArm: null,
      leftHand: null,
      rightShoulder: null,
      rightUpperArm: null,
      rightLowerArm: null,
      rightHand: null,
      /* Fingers */
      leftThumbMetacarpal: null,
      leftThumbProximal: null,
      leftThumbDistal: null,
      leftIndexProximal: null,
      leftIndexIntermediate: null,
      leftIndexDistal: null,
      leftMiddleProximal: null,
      leftMiddleIntermediate: null,
      leftMiddleDistal: null,
      leftRingProximal: null,
      leftRingIntermediate: null,
      leftRingDistal: null,
      leftLittleProximal: null,
      leftLittleIntermediate: null,
      leftLittleDistal: null,
      rightThumbMetacarpal: null,
      rightThumbProximal: null,
      rightThumbDistal: null,
      rightIndexProximal: null,
      rightIndexIntermediate: null,
      rightIndexDistal: null,
      rightMiddleProximal: null,
      rightMiddleIntermediate: null,
      rightMiddleDistal: null,
      rightRingProximal: null,
      rightRingIntermediate: null,
      rightRingDistal: null,
      rightLittleProximal: null,
      rightLittleIntermediate: null,
      rightLittleDistal: null
    };
    /** Rotations of the bones in the rest pose (T-pose) */
    restPose = {};
    /* All node constraints, ordered to deal with dependencies */
    _nodeConstraints = [];
    /* VRMC_springBone chains */
    _springChains = [];
    /* Spherical colliders for spring bones */
    _sphereColliders = [];
    /* Capsule shaped colliders for spring bones */
    _capsuleColliders = [];
    /* Indicates which meshes are rendered in first/third person views */
    _firstPersonAnnotations = [];
    /* Contains details for (bone type) lookAt behaviour */
    _lookAt = null;
    /* Whether or not the VRM component has been initialized with `initializeVrm` */
    _initialized = false;
    _tempV3 = vec3_exports.create();
    _tempV3A = vec3_exports.create();
    _tempV3B = vec3_exports.create();
    _tempQuat = quat_exports.create();
    _tempQuatA = quat_exports.create();
    _tempQuatB = quat_exports.create();
    _tempQuat2 = quat2_exports.create();
    _tailToShape = vec3_exports.create();
    _headToTail = vec3_exports.create();
    _inertia = vec3_exports.create();
    _stiffness = vec3_exports.create();
    _external = vec3_exports.create();
    _identityQuat = quat_exports.identity(quat_exports.create());
    async start() {
      if (!this.src) {
        console.error("vrm: src property not set");
        return;
      }
      const prefab = await this.engine.loadGLTF({ url: this.src, extensions: true });
      const { root, extensions } = this.engine.scene.instantiate(prefab);
      root.children.forEach((child) => child.parent = this.object);
      this._initializeVrm(prefab.extensions, extensions?.idMapping);
      root.destroy();
    }
    /**
     * Parses the VRM glTF extensions and initializes the vrm component.
     * @param extensions The glTF extensions for the VRM model
     */
    _initializeVrm(extensions, idMapping) {
      if (this._initialized) {
        throw new Error("VRM component has already been initialized");
      }
      const VRMC_vrm = extensions.root["VRMC_vrm"];
      if (!VRMC_vrm) {
        throw new Error("Missing VRM extensions");
      }
      if (VRMC_vrm.specVersion !== "1.0") {
        throw new Error(`Unsupported VRM version, only 1.0 is supported, but encountered '${VRMC_vrm.specVersion}'`);
      }
      this.meta = VRMC_vrm.meta;
      this._parseHumanoid(VRMC_vrm.humanoid, idMapping);
      if (VRMC_vrm.firstPerson) {
        this._parseFirstPerson(VRMC_vrm.firstPerson, extensions);
      }
      if (VRMC_vrm.lookAt) {
        this._parseLookAt(VRMC_vrm.lookAt);
      }
      this._findAndParseNodeConstraints(extensions, idMapping);
      const springBone = extensions.root["VRMC_springBone"];
      if (springBone) {
        this._parseAndInitializeSpringBones(springBone, idMapping);
      }
      this._initialized = true;
    }
    _parseHumanoid(humanoid, idMapping) {
      for (const boneName in humanoid.humanBones) {
        if (!(boneName in this.bones)) {
          console.warn(`Unrecognized bone '${boneName}'`);
          continue;
        }
        const node = humanoid.humanBones[boneName].node;
        const objectId = idMapping[node];
        this.bones[boneName] = this.engine.scene.wrap(objectId);
        this.restPose[boneName] = this.bones[boneName].getRotationLocal(quat_exports.create());
      }
    }
    _parseFirstPerson(firstPerson, idMapping) {
      for (const meshAnnotation of firstPerson.meshAnnotations) {
        const annotation = {
          node: this.engine.scene.wrap(idMapping[meshAnnotation.node]),
          firstPerson: true,
          thirdPerson: true
        };
        switch (meshAnnotation.type) {
          case "firstPersonOnly":
            annotation.thirdPerson = false;
            break;
          case "thirdPersonOnly":
            annotation.firstPerson = false;
            break;
          case "both":
            break;
          case "auto":
            console.warn("First person mesh annotation type 'auto' is not supported, treating as 'both'!");
            break;
          default:
            console.error(`Invalid mesh annotation type '${meshAnnotation.type}'`);
            break;
        }
        this._firstPersonAnnotations.push(annotation);
      }
    }
    _parseLookAt(lookAt2) {
      if (lookAt2.type !== "bone") {
        console.warn(`Unsupported lookAt type '${lookAt2.type}', only 'bone' is supported`);
        return;
      }
      const parseRangeMap = (rangeMap) => {
        return {
          inputMaxValue: rangeMap.inputMaxValue,
          outputScale: rangeMap.outputScale
        };
      };
      this._lookAt = {
        offsetFromHeadBone: lookAt2.offsetFromHeadBone || [0, 0, 0],
        horizontalInner: parseRangeMap(lookAt2.rangeMapHorizontalInner),
        horizontalOuter: parseRangeMap(lookAt2.rangeMapHorizontalOuter),
        verticalDown: parseRangeMap(lookAt2.rangeMapVerticalDown),
        verticalUp: parseRangeMap(lookAt2.rangeMapVerticalUp)
      };
    }
    _findAndParseNodeConstraints(extensions, idMapping) {
      const traverse = (object) => {
        const nodeExtensions = extensions.node[object.objectId];
        if (nodeExtensions && "VRMC_node_constraint" in nodeExtensions) {
          const nodeConstraintExtension = nodeExtensions["VRMC_node_constraint"];
          const constraint = nodeConstraintExtension.constraint;
          let type, axis;
          if ("roll" in constraint) {
            type = "roll";
            axis = VRM_ROLL_AXES[constraint.roll.rollAxis];
          } else if ("aim" in constraint) {
            type = "aim";
            axis = VRM_AIM_AXES[constraint.aim.aimAxis];
          } else if ("rotation" in constraint) {
            type = "rotation";
          }
          if (type) {
            const source = this.engine.scene.wrap(idMapping[constraint[type].source]);
            this._nodeConstraints.push({
              type,
              source,
              destination: object,
              axis,
              weight: constraint[type].weight,
              /* Rest pose */
              destinationRestLocalRotation: object.getRotationLocal(quat_exports.create()),
              sourceRestLocalRotation: source.getRotationLocal(quat_exports.create()),
              sourceRestLocalRotationInv: quat_exports.invert(quat_exports.create(), source.getRotationLocal(this._tempQuat))
            });
          } else {
            console.warn("Unrecognized or invalid VRMC_node_constraint, ignoring it");
          }
        }
        for (const child of object.children) {
          traverse(child);
        }
      };
      traverse(this.object);
    }
    _parseAndInitializeSpringBones(springBone, idMapping) {
      const colliders = (springBone.colliders || []).map((collider, i) => {
        const shapeType = "capsule" in collider.shape ? "capsule" : "sphere";
        return {
          id: i,
          object: this.engine.scene.wrap(idMapping[collider.node]),
          shape: {
            isCapsule: shapeType === "capsule",
            radius: collider.shape[shapeType].radius,
            offset: collider.shape[shapeType].offset,
            tail: collider.shape[shapeType].tail
          },
          cache: {
            head: vec3_exports.create(),
            tail: vec3_exports.create()
          }
        };
      });
      this._sphereColliders = colliders.filter((c) => !c.shape.isCapsule);
      this._capsuleColliders = colliders.filter((c) => c.shape.isCapsule);
      const colliderGroups = (springBone.colliderGroups || []).map((group) => ({
        name: group.name,
        colliders: group.colliders.map((c) => colliders[c])
      }));
      for (const spring of springBone.springs) {
        const joints = [];
        for (const joint of spring.joints) {
          const springJoint = {
            hitRadius: 0,
            stiffness: 1,
            gravityPower: 0,
            gravityDir: [0, -1, 0],
            dragForce: 0.5,
            node: null,
            state: null
          };
          Object.assign(springJoint, joint);
          springJoint.node = this.engine.scene.wrap(idMapping[joint.node]);
          joints.push(springJoint);
        }
        const springChainColliders = (spring.colliderGroups || []).flatMap((cg) => colliderGroups[cg].colliders);
        this._springChains.push({
          name: spring.name,
          center: spring.center ? this.engine.scene.wrap(idMapping[spring.center]) : null,
          joints,
          sphereColliders: springChainColliders.filter((c) => !c.shape.isCapsule),
          capsuleColliders: springChainColliders.filter((c) => c.shape.isCapsule)
        });
      }
      for (const springChain of this._springChains) {
        for (let i = 0; i < springChain.joints.length - 1; ++i) {
          const springBoneJoint = springChain.joints[i];
          const childSpringBoneJoint = springChain.joints[i + 1];
          const springBonePosition = springBoneJoint.node.getPositionWorld(vec3_exports.create());
          const childSpringBonePosition = childSpringBoneJoint.node.getPositionWorld(vec3_exports.create());
          const boneDirection = vec3_exports.subtract(this._tempV3A, springBonePosition, childSpringBonePosition);
          const state = {
            prevTail: vec3_exports.copy(vec3_exports.create(), childSpringBonePosition),
            currentTail: vec3_exports.copy(vec3_exports.create(), childSpringBonePosition),
            initialLocalRotation: springBoneJoint.node.getRotationLocal(quat_exports.create()),
            initialLocalTransformInvert: quat2_exports.invert(quat2_exports.create(), springBoneJoint.node.getTransformLocal(this._tempQuat2)),
            boneAxis: vec3_exports.normalize(vec3_exports.create(), childSpringBoneJoint.node.getPositionLocal(this._tempV3)),
            /* Ensure bone length is at least 1cm to avoid jittery behaviour from zero-length bones */
            boneLength: Math.max(0.01, vec3_exports.length(boneDirection)),
            /* Tail positions in center space, if needed */
            prevTailCenter: null,
            currentTailCenter: null
          };
          if (springChain.center) {
            state.prevTailCenter = springChain.center.transformPointInverseWorld(vec3_exports.create(), childSpringBonePosition);
            state.currentTailCenter = vec3_exports.copy(vec3_exports.create(), childSpringBonePosition);
          }
          springBoneJoint.state = state;
        }
      }
    }
    update(dt) {
      if (!this._initialized) {
        return;
      }
      this._resolveLookAt();
      this._resolveConstraints();
      this._updateSpringBones(dt);
    }
    _rangeMap(rangeMap, input) {
      const maxValue = rangeMap.inputMaxValue;
      const outputScale = rangeMap.outputScale;
      return Math.min(input, maxValue) / maxValue * outputScale;
    }
    _resolveLookAt() {
      if (!this._lookAt || !this.lookAtTarget) {
        return;
      }
      const lookAtSource = this.bones.head.transformPointWorld(this._tempV3A, this._lookAt.offsetFromHeadBone);
      const lookAtTarget = this.lookAtTarget.getPositionWorld(this._tempV3B);
      const lookAtDirection = vec3_exports.sub(this._tempV3A, lookAtTarget, lookAtSource);
      vec3_exports.normalize(lookAtDirection, lookAtDirection);
      this.bones.head.parent.transformVectorInverseWorld(lookAtDirection);
      const z2 = vec3_exports.dot(lookAtDirection, ForwardVector);
      const x2 = vec3_exports.dot(lookAtDirection, RightVector);
      const yaw = Math.atan2(x2, z2) * Rad2Deg;
      const xz = Math.sqrt(x2 * x2 + z2 * z2);
      const y2 = vec3_exports.dot(lookAtDirection, UpVector);
      let pitch = Math.atan2(-y2, xz) * Rad2Deg;
      if (pitch > 0) {
        pitch = this._rangeMap(this._lookAt.verticalDown, pitch);
      } else {
        pitch = -this._rangeMap(this._lookAt.verticalUp, -pitch);
      }
      if (this.bones.leftEye) {
        let yawLeft = yaw;
        if (yawLeft > 0) {
          yawLeft = this._rangeMap(this._lookAt.horizontalInner, yawLeft);
        } else {
          yawLeft = -this._rangeMap(this._lookAt.horizontalOuter, -yawLeft);
        }
        const eyeRotation = quat_exports.fromEuler(this._tempQuatA, pitch, yawLeft, 0);
        this.bones.leftEye.setRotationLocal(quat_exports.multiply(eyeRotation, this.restPose.leftEye, eyeRotation));
      }
      if (this.bones.rightEye) {
        let yawRight = yaw;
        if (yawRight > 0) {
          yawRight = this._rangeMap(this._lookAt.horizontalOuter, yawRight);
        } else {
          yawRight = -this._rangeMap(this._lookAt.horizontalInner, -yawRight);
        }
        const eyeRotation = quat_exports.fromEuler(this._tempQuatA, pitch, yawRight, 0);
        this.bones.rightEye.setRotationLocal(quat_exports.multiply(eyeRotation, this.restPose.rightEye, eyeRotation));
      }
    }
    _resolveConstraints() {
      for (const nodeConstraint of this._nodeConstraints) {
        this._resolveConstraint(nodeConstraint);
      }
    }
    _resolveConstraint(nodeConstraint) {
      const dstRestQuat = nodeConstraint.destinationRestLocalRotation;
      const srcRestQuatInv = nodeConstraint.sourceRestLocalRotationInv;
      const targetQuat = quat_exports.identity(this._tempQuatA);
      switch (nodeConstraint.type) {
        case "roll":
          {
            const deltaSrcQuat = quat_exports.multiply(this._tempQuatA, srcRestQuatInv, nodeConstraint.source.rotationLocal);
            const deltaSrcQuatInParent = quat_exports.multiply(this._tempQuatA, nodeConstraint.sourceRestLocalRotation, deltaSrcQuat);
            quat_exports.mul(deltaSrcQuatInParent, deltaSrcQuatInParent, srcRestQuatInv);
            const dstRestQuatInv = quat_exports.invert(this._tempQuatB, dstRestQuat);
            const deltaSrcQuatInDst = quat_exports.multiply(this._tempQuatB, dstRestQuatInv, deltaSrcQuatInParent);
            quat_exports.multiply(deltaSrcQuatInDst, deltaSrcQuatInDst, dstRestQuat);
            const toVec = vec3_exports.transformQuat(this._tempV3A, nodeConstraint.axis, deltaSrcQuatInDst);
            const fromToQuat = quat_exports.rotationTo(this._tempQuatA, nodeConstraint.axis, toVec);
            quat_exports.mul(targetQuat, dstRestQuat, quat_exports.invert(this._tempQuat, fromToQuat));
            quat_exports.mul(targetQuat, targetQuat, deltaSrcQuatInDst);
          }
          break;
        case "aim":
          {
            const dstParentWorldQuat = nodeConstraint.destination.parent.rotationWorld;
            const fromVec = vec3_exports.transformQuat(this._tempV3A, nodeConstraint.axis, dstRestQuat);
            vec3_exports.transformQuat(fromVec, fromVec, dstParentWorldQuat);
            const toVec = nodeConstraint.source.getTranslationWorld(this._tempV3B);
            vec3_exports.sub(toVec, toVec, nodeConstraint.destination.getTranslationWorld(this._tempV3));
            vec3_exports.normalize(toVec, toVec);
            const fromToQuat = quat_exports.rotationTo(this._tempQuatA, fromVec, toVec);
            quat_exports.mul(targetQuat, quat_exports.invert(this._tempQuat, dstParentWorldQuat), fromToQuat);
            quat_exports.mul(targetQuat, targetQuat, dstParentWorldQuat);
            quat_exports.mul(targetQuat, targetQuat, dstRestQuat);
          }
          break;
        case "rotation":
          {
            const srcDeltaQuat = quat_exports.mul(targetQuat, srcRestQuatInv, nodeConstraint.source.rotationLocal);
            quat_exports.mul(targetQuat, dstRestQuat, srcDeltaQuat);
          }
          break;
      }
      quat_exports.slerp(targetQuat, dstRestQuat, targetQuat, nodeConstraint.weight);
      nodeConstraint.destination.rotationLocal = targetQuat;
    }
    _updateSpringBones(dt) {
      this._sphereColliders.forEach(({ object, shape, cache }) => {
        const offset2 = vec3_exports.copy(cache.head, shape.offset);
        object.transformVectorWorld(offset2);
        vec3_exports.add(cache.head, object.getPositionWorld(this._tempV3), offset2);
      });
      this._capsuleColliders.forEach(({ object, shape, cache }) => {
        const shapeCenter = object.getPositionWorld(this._tempV3A);
        const headOffset = vec3_exports.copy(cache.head, shape.offset);
        object.transformVectorWorld(headOffset);
        vec3_exports.add(cache.head, shapeCenter, headOffset);
        const tailOffset = vec3_exports.copy(cache.tail, shape.tail);
        object.transformVectorWorld(tailOffset);
        vec3_exports.add(cache.tail, shapeCenter, tailOffset);
      });
      this._springChains.forEach((springChain) => {
        for (let i = 0; i < springChain.joints.length - 1; ++i) {
          const joint = springChain.joints[i];
          if (!joint.state)
            continue;
          const parentWorldRotation = joint.node.parent ? joint.node.parent.getRotationWorld(this._tempQuat) : this._identityQuat;
          const inertia = this._inertia;
          if (springChain.center) {
            vec3_exports.sub(inertia, joint.state.currentTailCenter, joint.state.prevTailCenter);
            springChain.center.transformVectorWorld(inertia);
          } else {
            vec3_exports.sub(inertia, joint.state.currentTail, joint.state.prevTail);
          }
          vec3_exports.scale(inertia, inertia, 1 - joint.dragForce);
          const stiffness = vec3_exports.copy(this._stiffness, joint.state.boneAxis);
          vec3_exports.transformQuat(stiffness, stiffness, joint.state.initialLocalRotation);
          vec3_exports.transformQuat(stiffness, stiffness, parentWorldRotation);
          vec3_exports.scale(stiffness, stiffness, dt * joint.stiffness);
          const external = vec3_exports.scale(this._external, joint.gravityDir, dt * joint.gravityPower);
          const nextTail = vec3_exports.copy(this._tempV3A, joint.state.currentTail);
          vec3_exports.add(nextTail, nextTail, inertia);
          vec3_exports.add(nextTail, nextTail, stiffness);
          vec3_exports.add(nextTail, nextTail, external);
          const worldPosition = joint.node.getPositionWorld(this._tempV3B);
          vec3_exports.sub(nextTail, nextTail, worldPosition);
          vec3_exports.normalize(nextTail, nextTail);
          vec3_exports.scaleAndAdd(nextTail, worldPosition, nextTail, joint.state.boneLength);
          for (const { shape, cache } of springChain.sphereColliders) {
            let tailToShape = this._tailToShape;
            const sphereCenter = cache.head;
            tailToShape = vec3_exports.sub(tailToShape, nextTail, sphereCenter);
            const radius = shape.radius + joint.hitRadius;
            const dist3 = vec3_exports.length(tailToShape) - radius;
            if (dist3 < 0) {
              vec3_exports.normalize(tailToShape, tailToShape);
              vec3_exports.scaleAndAdd(nextTail, nextTail, tailToShape, -dist3);
              vec3_exports.sub(nextTail, nextTail, worldPosition);
              vec3_exports.normalize(nextTail, nextTail);
              vec3_exports.scaleAndAdd(nextTail, worldPosition, nextTail, joint.state.boneLength);
            }
          }
          for (const { shape, cache } of springChain.capsuleColliders) {
            let tailToShape = this._tailToShape;
            const head = cache.head;
            const tail = cache.tail;
            tailToShape = vec3_exports.sub(tailToShape, nextTail, head);
            const headToTail = vec3_exports.sub(this._headToTail, tail, head);
            const dot6 = vec3_exports.dot(headToTail, tailToShape);
            if (vec3_exports.squaredLength(headToTail) <= dot6) {
              vec3_exports.sub(tailToShape, nextTail, tail);
            } else if (dot6 > 0) {
              vec3_exports.scale(headToTail, headToTail, dot6 / vec3_exports.squaredLength(headToTail));
              vec3_exports.sub(tailToShape, tailToShape, headToTail);
            }
            const radius = shape.radius + joint.hitRadius;
            const dist3 = vec3_exports.length(tailToShape) - radius;
            if (dist3 < 0) {
              vec3_exports.normalize(tailToShape, tailToShape);
              vec3_exports.scaleAndAdd(nextTail, nextTail, tailToShape, -dist3);
              vec3_exports.sub(nextTail, nextTail, worldPosition);
              vec3_exports.normalize(nextTail, nextTail);
              vec3_exports.scaleAndAdd(nextTail, worldPosition, nextTail, joint.state.boneLength);
            }
          }
          vec3_exports.copy(joint.state.prevTail, joint.state.currentTail);
          vec3_exports.copy(joint.state.currentTail, nextTail);
          if (springChain.center) {
            vec3_exports.copy(joint.state.prevTailCenter, joint.state.currentTailCenter);
            vec3_exports.copy(joint.state.currentTailCenter, nextTail);
            springChain.center.transformPointInverseWorld(joint.state.currentTailCenter);
          }
          joint.node.parent.transformPointInverseWorld(nextTail);
          const nextTailDualQuat = quat2_exports.fromTranslation(this._tempQuat2, nextTail);
          quat2_exports.multiply(nextTailDualQuat, joint.state.initialLocalTransformInvert, nextTailDualQuat);
          quat2_exports.getTranslation(nextTail, nextTailDualQuat);
          vec3_exports.normalize(nextTail, nextTail);
          const jointRotation = quat_exports.rotationTo(this._tempQuatA, joint.state.boneAxis, nextTail);
          joint.node.setRotationLocal(quat_exports.mul(this._tempQuatA, joint.state.initialLocalRotation, jointRotation));
        }
      });
    }
    /**
     * @param firstPerson Whether the model should render for first person or third person views
     */
    set firstPerson(firstPerson) {
      this._firstPersonAnnotations.forEach((annotation) => {
        const visible = firstPerson == annotation.firstPerson || firstPerson != annotation.thirdPerson;
        annotation.node.getComponents("mesh").forEach((mesh) => {
          mesh.active = visible;
        });
      });
    }
  };
  __publicField(Vrm, "TypeName", "vrm");
  __decorate16([
    property.string()
  ], Vrm.prototype, "src", void 0);
  __decorate16([
    property.object()
  ], Vrm.prototype, "lookAtTarget", void 0);

  // node_modules/@wonderlandengine/components/dist/wasd-controls.js
  var __decorate17 = function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d2;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if (d2 = decorators[i])
          r = (c < 3 ? d2(r) : c > 3 ? d2(target, key, r) : d2(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  var _direction = new Float32Array(3);
  var _tempDualQuat = new Float32Array(8);
  var WasdControlsComponent = class extends Component3 {
    /** Movement speed in m/s. */
    speed;
    /** Flag for only moving the object on the global x & z planes */
    lockY;
    /** Object of which the orientation is used to determine forward direction */
    headObject;
    right = false;
    down = false;
    left = false;
    up = false;
    start() {
      this.headObject = this.headObject || this.object;
    }
    onActivate() {
      window.addEventListener("keydown", this.press);
      window.addEventListener("keyup", this.release);
    }
    onDeactivate() {
      window.removeEventListener("keydown", this.press);
      window.removeEventListener("keyup", this.release);
    }
    update() {
      vec3_exports.zero(_direction);
      if (this.up)
        _direction[2] -= 1;
      if (this.down)
        _direction[2] += 1;
      if (this.left)
        _direction[0] -= 1;
      if (this.right)
        _direction[0] += 1;
      vec3_exports.normalize(_direction, _direction);
      _direction[0] *= this.speed;
      _direction[2] *= this.speed;
      vec3_exports.transformQuat(_direction, _direction, this.headObject.getTransformWorld(_tempDualQuat));
      if (this.lockY) {
        _direction[1] = 0;
        vec3_exports.normalize(_direction, _direction);
        vec3_exports.scale(_direction, _direction, this.speed);
      }
      this.object.translateLocal(_direction);
    }
    press = (e) => {
      this.handleKey(e, true);
    };
    release = (e) => {
      this.handleKey(e, false);
    };
    handleKey(e, b2) {
      if (e.code === "ArrowUp" || e.code === "KeyW" || e.code === "KeyZ") {
        this.up = b2;
      } else if (e.code === "ArrowRight" || e.code === "KeyD") {
        this.right = b2;
      } else if (e.code === "ArrowDown" || e.code === "KeyS") {
        this.down = b2;
      } else if (e.code === "ArrowLeft" || e.code === "KeyA" || e.code === "KeyQ") {
        this.left = b2;
      }
    }
  };
  __publicField(WasdControlsComponent, "TypeName", "wasd-controls");
  __decorate17([
    property.float(0.1)
  ], WasdControlsComponent.prototype, "speed", void 0);
  __decorate17([
    property.bool(false)
  ], WasdControlsComponent.prototype, "lockY", void 0);
  __decorate17([
    property.object()
  ], WasdControlsComponent.prototype, "headObject", void 0);

  // node_modules/@wonderlandengine/components/dist/input-profile.js
  var __decorate18 = function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d2;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if (d2 = decorators[i])
          r = (c < 3 ? d2(r) : c > 3 ? d2(target, key, r) : d2(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  var _tempVec = vec3_exports.create();
  var _tempQuat = quat_exports.create();
  var _tempRotation1 = new Float32Array(4);
  var _tempRotation2 = new Float32Array(4);
  var minTemp = new Float32Array(3);
  var maxTemp = new Float32Array(3);
  var hands = ["left", "right"];
  var _InputProfile = class extends Component3 {
    _gamepadObjects = {};
    _controllerModel = null;
    _defaultControllerComponents;
    _handedness;
    _profileJSON = null;
    _buttons = [];
    _axes = [];
    /**
     * The XR gamepad associated with the current input source.
     */
    gamepad;
    /**
     * A reference to the emitter which triggered on model lodaed event.
     */
    onModelLoaded = new Emitter();
    /**
     * Returns url of input profile json file
     */
    url;
    /**
     * A set of components to filter during component retrieval.
     */
    toFilter = /* @__PURE__ */ new Set(["vr-mode-active-mode-switch"]);
    /**
     * The index representing the handedness of the controller (0 for left, 1 for right).
     */
    handedness = 0;
    /**
     * The base path where XR input profiles are stored.
     */
    defaultBasePath;
    /**
     * An optional folder path for loading custom XR input profiles.
     */
    customBasePath;
    /**
     * The default 3D controller model used when a custom model fails to load.
     */
    defaultController;
    /**
     * The object which has HandTracking component added to it.
     */
    trackedHand;
    /**
     * If true, the input profile will be mapped to the default controller, and no dynamic 3D model of controller will be loaded.
     */
    mapToDefaultController;
    /**
     * If true, adds a VR mode switch component to the loaded controller model.
     */
    addVrModeSwitch;
    onActivate() {
      this._handedness = hands[this.handedness];
      const defaultHandName = "Hand" + this._handedness.charAt(0).toUpperCase() + this._handedness.slice(1);
      this.trackedHand = this.trackedHand ?? this.object.parent?.findByNameRecursive(defaultHandName)[0];
      this.defaultController = this.defaultController || this.object.children[0];
      this._defaultControllerComponents = this._getComponents(this.defaultController);
      this.engine.onXRSessionStart.add(() => {
        this.engine.xr?.session.addEventListener("inputsourceschange", this._onInputSourcesChange.bind(this));
      });
    }
    onDeactivate() {
      this.engine.xr?.session?.removeEventListener("inputsourceschange", this._onInputSourcesChange.bind(this));
    }
    /**
     * Sets newly loaded controllers for the HandTracking component to proper switching.
     * @param controllerObject The controller object.
     * @hidden
     */
    _setHandTrackingControllers(controllerObject) {
      const handtrackingComponent = this.trackedHand.getComponent(HandTracking);
      if (!handtrackingComponent)
        return;
      handtrackingComponent.controllerToDeactivate = controllerObject;
    }
    /**
     * Retrieves all components from the specified object and its children.
     * @param obj The object to retrieve components from.
     * @return An array of components.
     * @hidden
     */
    _getComponents(obj) {
      const components = [];
      if (obj == null)
        return components;
      const stack = [obj];
      while (stack.length > 0) {
        const currentObj = stack.pop();
        const comps = currentObj.getComponents().filter((c) => !this.toFilter.has(c.type));
        components.push(...comps);
        const children = currentObj.children;
        for (let i = children.length - 1; i >= 0; --i) {
          stack.push(children[i]);
        }
      }
      return components;
    }
    /**
     * Activates or deactivates components based on the specified boolean value.
     * @param active If true, components are set to active; otherwise, they are set to inactive.
     * @hidden
     */
    _setComponentsActive(active) {
      const comps = this._defaultControllerComponents;
      if (comps == void 0)
        return;
      for (let i = 0; i < comps.length; ++i) {
        comps[i].active = active;
      }
    }
    /**
     * Event handler triggered when XR input sources change.
     * Detects new XR input sources and initiates the loading of input profiles.
     * @param event The XR input source change event.
     * @hidden
     */
    _onInputSourcesChange(event) {
      if (this._isModelLoaded() && !this.mapToDefaultController) {
        this._setComponentsActive(false);
      }
      event.added.forEach((xrInputSource) => {
        if (xrInputSource.hand != null)
          return;
        if (this._handedness != xrInputSource.handedness)
          return;
        this.gamepad = xrInputSource.gamepad;
        const profile = this.customBasePath !== "" ? this.customBasePath : this.defaultBasePath + xrInputSource.profiles[0];
        this.url = profile + "/profile.json";
        this._profileJSON = _InputProfile.Cache.get(this.url) ?? null;
        if (this._profileJSON != null)
          return;
        fetch(this.url).then((res) => res.json()).then((out) => {
          this._profileJSON = out;
          _InputProfile.Cache.set(this.url, this._profileJSON);
          if (!this._isModelLoaded())
            this._loadAndMapGamepad(profile);
        }).catch((e) => {
          console.error(`Failed to load profile from ${this.url}. Reason:`, e);
        });
      });
    }
    /**
     * Checks if the 3D controller model is loaded.
     * @return True if the model is loaded; otherwise, false.
     * @hidden
     */
    _isModelLoaded() {
      return this._controllerModel !== null;
    }
    /**
     * Loads the 3D controller model and caches the mapping to the gamepad.
     * @param profile The path to the input profile.
     * @hidden
     */
    async _loadAndMapGamepad(profile) {
      const assetPath = profile + "/" + this._handedness + ".glb";
      this._controllerModel = this.defaultController;
      if (!this.mapToDefaultController) {
        try {
          this._controllerModel = await this.engine.scene.append(assetPath);
        } catch (e) {
          console.error(`Failed to load i-p controller model. Reason:`, e, `Continuing with ${this._handedness} default controller.`);
          this._setComponentsActive(true);
        }
        this._controllerModel.parent = this.object;
        this._controllerModel.setPositionLocal([0, 0, 0]);
        this._setComponentsActive(false);
        if (this.addVrModeSwitch)
          this._controllerModel.addComponent(VrModeActiveSwitch);
        this.onModelLoaded.notify();
      }
      this._cacheGamepadObjectsFromProfile(this._profileJSON, this._controllerModel);
      this._setHandTrackingControllers(this._controllerModel);
      this.update = () => this._mapGamepadInput();
    }
    /**
     * Caches gamepad objects (buttons, axes) from the loaded input profile.
     * @hidden
     */
    _cacheGamepadObjectsFromProfile(profile, obj) {
      const components = profile.layouts[this._handedness].components;
      if (!components)
        return;
      this._buttons = [];
      this._axes = [];
      for (const i in components) {
        const visualResponses = components[i].visualResponses;
        if (components[i].rootNodeName === "menu")
          continue;
        for (const j2 in visualResponses) {
          const visualResponse = visualResponses[j2];
          const valueNode = visualResponse.valueNodeName;
          const minNode = visualResponse.minNodeName;
          const maxNode = visualResponse.maxNodeName;
          this._gamepadObjects[valueNode] = obj.findByNameRecursive(valueNode)[0];
          this._gamepadObjects[minNode] = obj.findByNameRecursive(minNode)[0];
          this._gamepadObjects[maxNode] = obj.findByNameRecursive(maxNode)[0];
          const prop = visualResponses[j2].componentProperty;
          const response = {
            target: this._gamepadObjects[valueNode],
            min: this._gamepadObjects[minNode],
            max: this._gamepadObjects[maxNode],
            id: components[i].gamepadIndices[prop]
            // Assign a unique ID
          };
          switch (prop) {
            case "button":
              this._buttons.push(response);
              break;
            case "xAxis":
            case "yAxis":
              this._axes.push(response);
              break;
          }
        }
      }
    }
    /**
     * Assigns a transformed position and rotation to the target based on minimum and maximum values and a normalized input value.
     * @param target The target object to be transformed.
     * @param min The minimum object providing transformation limits.
     * @param max The maximum object providing transformation limits.
     * @param value The normalized input value.
     * @hidden
     */
    _assignTransform(target, min3, max3, value) {
      vec3_exports.lerp(_tempVec, min3.getPositionWorld(minTemp), max3.getPositionWorld(maxTemp), value);
      target.setPositionWorld(_tempVec);
      quat_exports.lerp(_tempQuat, min3.getRotationWorld(_tempRotation1), max3.getRotationWorld(_tempRotation2), value);
      quat_exports.normalize(_tempQuat, _tempQuat);
      target.setRotationWorld(_tempQuat);
    }
    /**
     * Maps input values (buttons, axes) to the 3D controller model.
     * @hidden
     */
    _mapGamepadInput() {
      for (const button of this._buttons) {
        const buttonValue = this.gamepad.buttons[button.id].value;
        this._assignTransform(button.target, button.min, button.max, buttonValue);
      }
      for (const axis of this._axes) {
        const axisValue = this.gamepad.axes[axis.id];
        const normalizedAxisValue = (axisValue + 1) / 2;
        this._assignTransform(axis.target, axis.min, axis.max, normalizedAxisValue);
      }
    }
  };
  var InputProfile = _InputProfile;
  __publicField(InputProfile, "TypeName", "input-profile");
  /**
   * A cache to store loaded profiles for reuse.
   */
  __publicField(InputProfile, "Cache", /* @__PURE__ */ new Map());
  __decorate18([
    property.enum(hands, 0)
  ], InputProfile.prototype, "handedness", void 0);
  __decorate18([
    property.string("https://cdn.jsdelivr.net/npm/@webxr-input-profiles/assets@latest/dist/profiles/")
  ], InputProfile.prototype, "defaultBasePath", void 0);
  __decorate18([
    property.string()
  ], InputProfile.prototype, "customBasePath", void 0);
  __decorate18([
    property.object()
  ], InputProfile.prototype, "defaultController", void 0);
  __decorate18([
    property.object()
  ], InputProfile.prototype, "trackedHand", void 0);
  __decorate18([
    property.bool(false)
  ], InputProfile.prototype, "mapToDefaultController", void 0);
  __decorate18([
    property.bool(true)
  ], InputProfile.prototype, "addVrModeSwitch", void 0);

  // node_modules/@wonderlandengine/components/dist/orbital-camera.js
  var __decorate19 = function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d2;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if (d2 = decorators[i])
          r = (c < 3 ? d2(r) : c > 3 ? d2(target, key, r) : d2(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  var preventDefault2 = (e) => {
    e.preventDefault();
  };
  var tempVec5 = [0, 0, 0];
  var tempquat = quat_exports.create();
  var tempquat2 = quat_exports.create();
  var tempVec33 = vec3_exports.create();
  var OrbitalCamera = class extends Component3 {
    mouseButtonIndex = 0;
    radial = 5;
    minElevation = 0;
    maxElevation = 89.99;
    minZoom = 0.01;
    maxZoom = 10;
    xSensitivity = 0.5;
    ySensitivity = 0.5;
    zoomSensitivity = 0.02;
    damping = 0.9;
    _mouseDown = false;
    _origin = [0, 0, 0];
    _azimuth = 0;
    _polar = 45;
    _initialPinchDistance = 0;
    _touchStartX = 0;
    _touchStartY = 0;
    _azimuthSpeed = 0;
    _polarSpeed = 0;
    init() {
      this.object.getPositionWorld(this._origin);
    }
    start() {
      this._polar = Math.min(this.maxElevation, Math.max(this.minElevation, this._polar));
      this._updateCamera();
    }
    onActivate() {
      const canvas2 = this.engine.canvas;
      if (this.mouseButtonIndex === 2) {
        canvas2.addEventListener("contextmenu", preventDefault2, { passive: false });
      }
      canvas2.addEventListener("mousedown", this._onMouseDown);
      canvas2.addEventListener("wheel", this._onMouseScroll, { passive: false });
      canvas2.addEventListener("touchstart", this._onTouchStart, { passive: false });
      canvas2.addEventListener("touchmove", this._onTouchMove, { passive: false });
      canvas2.addEventListener("touchend", this._onTouchEnd);
    }
    onDeactivate() {
      const canvas2 = this.engine.canvas;
      if (this.mouseButtonIndex === 2) {
        canvas2.removeEventListener("contextmenu", preventDefault2);
      }
      canvas2.removeEventListener("mousemove", this._onMouseMove);
      canvas2.removeEventListener("mousedown", this._onMouseDown);
      canvas2.removeEventListener("wheel", this._onMouseScroll);
      canvas2.removeEventListener("touchstart", this._onTouchStart);
      canvas2.removeEventListener("touchmove", this._onTouchMove);
      canvas2.removeEventListener("touchend", this._onTouchEnd);
      this._mouseDown = false;
      this._initialPinchDistance = 0;
      this._touchStartX = 0;
      this._touchStartY = 0;
      this._azimuthSpeed = 0;
      this._polarSpeed = 0;
    }
    update() {
      this._azimuthSpeed *= this.damping;
      this._polarSpeed *= this.damping;
      if (Math.abs(this._azimuthSpeed) < 0.01)
        this._azimuthSpeed = 0;
      if (Math.abs(this._polarSpeed) < 0.01)
        this._polarSpeed = 0;
      this._azimuth += this._azimuthSpeed;
      this._polar += this._polarSpeed;
      this._polar = Math.min(this.maxElevation, Math.max(this.minElevation, this._polar));
      if (this._azimuthSpeed !== 0 || this._polarSpeed !== 0) {
        this._updateCamera();
      }
    }
    /**
     * Get the closest position to the given position on the orbit sphere of the camera.
     * This can be used to get a position and rotation to transition to.
     *
     * You pass this a position object. The method calculates the closest positition and updates the position parameter.
     * It also sets the rotation parameter to reflect the rotate the camera will have when it is on the orbit sphere,
     * pointing towards the center.
     * @param position the position to get the closest position to
     * @param rotation the rotation to get the closest position to
     */
    getClosestPosition(position, rotation) {
      this.object.getRotationWorld(tempquat);
      this.object.lookAt(this._origin);
      this.object.getRotationWorld(tempquat2);
      if (quat_exports.dot(tempquat, tempquat2) < 0) {
        quat_exports.scale(tempquat2, tempquat2, -1);
      }
      this.object.setRotationWorld(tempquat);
      const directionToCamera = vec3_exports.create();
      vec3_exports.subtract(directionToCamera, position, this._origin);
      vec3_exports.normalize(directionToCamera, directionToCamera);
      const nearestPointOnSphere = vec3_exports.create();
      vec3_exports.scale(nearestPointOnSphere, directionToCamera, this.radial);
      vec3_exports.add(nearestPointOnSphere, nearestPointOnSphere, this._origin);
      vec3_exports.copy(position, nearestPointOnSphere);
      quat_exports.copy(rotation, tempquat2);
    }
    /**
     * Set the camera position based on the given position and calculate the rotation.
     * @param cameraPosition the position to set the camera to
     */
    setPosition(cameraPosition) {
      const centerOfOrbit = this._origin;
      vec3_exports.subtract(tempVec33, cameraPosition, centerOfOrbit);
      vec3_exports.normalize(tempVec33, tempVec33);
      const azimuth = Math.atan2(tempVec33[0], tempVec33[2]);
      const polar = Math.acos(tempVec33[1]);
      const azimuthDeg = rad2deg(azimuth);
      const polarDeg = 90 - rad2deg(polar);
      this._azimuth = azimuthDeg;
      this._polar = polarDeg;
    }
    /**
     * Update the camera position based on the current azimuth,
     * polar and radial values
     */
    _updateCamera() {
      const azimuthInRadians = deg2rad(this._azimuth);
      const polarInRadians = deg2rad(this._polar);
      tempVec5[0] = this.radial * Math.sin(azimuthInRadians) * Math.cos(polarInRadians);
      tempVec5[1] = this.radial * Math.sin(polarInRadians);
      tempVec5[2] = this.radial * Math.cos(azimuthInRadians) * Math.cos(polarInRadians);
      this.object.setPositionWorld(tempVec5);
      this.object.translateWorld(this._origin);
      this.object.lookAt(this._origin);
    }
    /* Mouse Event Handlers */
    _onMouseDown = (e) => {
      window.addEventListener("mouseup", this._onMouseUp);
      window.addEventListener("mousemove", this._onMouseMove);
      if (e.button === this.mouseButtonIndex) {
        this._mouseDown = true;
        document.body.style.cursor = "grabbing";
        if (e.button === 1) {
          e.preventDefault();
          return false;
        }
      }
    };
    _onMouseUp = (e) => {
      window.removeEventListener("mouseup", this._onMouseUp);
      window.removeEventListener("mousemove", this._onMouseMove);
      if (e.button === this.mouseButtonIndex) {
        this._mouseDown = false;
        document.body.style.cursor = "initial";
      }
    };
    _onMouseMove = (e) => {
      if (this.active && this._mouseDown) {
        if (this.active && this._mouseDown) {
          this._azimuthSpeed = -(e.movementX * this.xSensitivity);
          this._polarSpeed = e.movementY * this.ySensitivity;
        }
      }
    };
    _onMouseScroll = (e) => {
      e.preventDefault();
      this.radial *= 1 - e.deltaY * this.zoomSensitivity * -1e-3;
      this.radial = Math.min(this.maxZoom, Math.max(this.minZoom, this.radial));
      this._updateCamera();
    };
    /* Touch event handlers */
    _onTouchStart = (e) => {
      if (e.touches.length === 1) {
        e.preventDefault();
        this._touchStartX = e.touches[0].clientX;
        this._touchStartY = e.touches[0].clientY;
        this._mouseDown = true;
      } else if (e.touches.length === 2) {
        this._initialPinchDistance = this._getDistanceBetweenTouches(e.touches);
        e.preventDefault();
      }
    };
    _onTouchMove = (e) => {
      if (!this.active || !this._mouseDown) {
        return;
      }
      e.preventDefault();
      if (e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - this._touchStartX;
        const deltaY = e.touches[0].clientY - this._touchStartY;
        this._azimuthSpeed = -(deltaX * this.xSensitivity);
        this._polarSpeed = deltaY * this.ySensitivity;
        this._touchStartX = e.touches[0].clientX;
        this._touchStartY = e.touches[0].clientY;
      } else if (e.touches.length === 2) {
        const currentPinchDistance = this._getDistanceBetweenTouches(e.touches);
        const pinchScale = this._initialPinchDistance / currentPinchDistance;
        this.radial *= pinchScale;
        this.radial = Math.min(this.maxZoom, Math.max(this.minZoom, this.radial));
        this._updateCamera();
        this._initialPinchDistance = currentPinchDistance;
      }
    };
    _onTouchEnd = (e) => {
      if (e.touches.length < 2) {
        this._mouseDown = false;
      }
      if (e.touches.length === 1) {
        this._touchStartX = e.touches[0].clientX;
        this._touchStartY = e.touches[0].clientY;
      }
    };
    /**
     * Helper function to calculate the distance between two touch points
     * @param touches list of touch points
     * @returns distance between the two touch points
     */
    _getDistanceBetweenTouches(touches) {
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    }
  };
  __publicField(OrbitalCamera, "TypeName", "orbital-camera");
  __decorate19([
    property.int()
  ], OrbitalCamera.prototype, "mouseButtonIndex", void 0);
  __decorate19([
    property.float(5)
  ], OrbitalCamera.prototype, "radial", void 0);
  __decorate19([
    property.float()
  ], OrbitalCamera.prototype, "minElevation", void 0);
  __decorate19([
    property.float(89.99)
  ], OrbitalCamera.prototype, "maxElevation", void 0);
  __decorate19([
    property.float()
  ], OrbitalCamera.prototype, "minZoom", void 0);
  __decorate19([
    property.float(10)
  ], OrbitalCamera.prototype, "maxZoom", void 0);
  __decorate19([
    property.float(0.5)
  ], OrbitalCamera.prototype, "xSensitivity", void 0);
  __decorate19([
    property.float(0.5)
  ], OrbitalCamera.prototype, "ySensitivity", void 0);
  __decorate19([
    property.float(0.02)
  ], OrbitalCamera.prototype, "zoomSensitivity", void 0);
  __decorate19([
    property.float(0.9)
  ], OrbitalCamera.prototype, "damping", void 0);

  // node_modules/@heyvr/sdk-ad-wonderland/build/sdk.min.js
  var D = Object.defineProperty;
  var S = Object.getOwnPropertySymbols;
  var Y = Object.prototype.hasOwnProperty;
  var W = Object.prototype.propertyIsEnumerable;
  var V = (r, e, t) => e in r ? D(r, e, { enumerable: true, configurable: true, writable: true, value: t }) : r[e] = t;
  var E = (r, e) => {
    for (var t in e ||= {})
      Y.call(e, t) && V(r, t, e[t]);
    if (S)
      for (var t of S(e))
        W.call(e, t) && V(r, t, e[t]);
    return r;
  };
  var $ = (r, e) => {
    for (var t in e)
      D(r, t, { get: e[t], enumerable: true });
  };
  var d = (r, e, t) => new Promise((i, n) => {
    var o = (c) => {
      try {
        a(t.next(c));
      } catch (h) {
        n(h);
      }
    }, s = (c) => {
      try {
        a(t.throw(c));
      } catch (h) {
        n(h);
      }
    }, a = (c) => c.done ? i(c.value) : Promise.resolve(c.value).then(o, s);
    a((t = t.apply(r, e)).next());
  });
  var T = class {
    appendUTMParams(e, t) {
      let i = new URL(e);
      return i.searchParams.set("utm_source", "heyVR"), i.searchParams.set("utm_campaign", "heyVRAd"), i.searchParams.set("utm_channel", `Campaign_${t}`), i.href;
    }
    getPlatform() {
      return d(this, null, function* () {
        let e = { platform: "", confidence: "" };
        return this.isOculus().match ? e = { platform: "Oculus", confidence: this.isOculus().confidence } : this.isWolvic().match ? e = { platform: "Wolvic", confidence: this.isWolvic().confidence } : (yield this.isPico()).match ? e = { platform: "Pico", confidence: (yield this.isPico()).confidence } : this.isDesktop().match ? e = { platform: "Desktop", confidence: this.isDesktop().confidence } : e = { platform: "Unknown", confidence: "None" }, e;
      });
    }
    isDesktop() {
      let e = navigator.maxTouchPoints === 0 || navigator.msMaxTouchPoints === 0, t = !navigator.userAgent.includes("Android") && !navigator.userAgent.includes("Mobile"), i = e && t ? "Full" : e || t ? "Partial" : "None";
      return { match: i !== "None", confidence: i };
    }
    isOculus() {
      let e = window.XRHand != null && window.XRMediaBinding != null, t = navigator.userAgent.includes("OculusBrowser"), i = e && t ? "Full" : e || t ? "Partial" : "None";
      return { match: i !== "None", confidence: i };
    }
    isPico() {
      return d(this, null, function* () {
        let e = navigator.xr && (yield navigator.xr.isSessionSupported("immersive-vr")) && (yield navigator.xr.isSessionSupported("immersive-ar")), t = navigator.userAgent.includes("Pico Neo 3 Link"), i = e && t ? "Full" : e || t ? "Partial" : "None";
        return { match: i !== "None", confidence: i };
      });
    }
    isWolvic() {
      let e = window.mozInnerScreenX != null && window.speechSynthesis == null, t = navigator.userAgent.includes("Mobile VR") && !navigator.userAgent.includes("OculusBrowser"), i = e && t ? "Full" : e || t ? "Partial" : "None";
      return { match: i !== "None", confidence: i };
    }
    openURL(e) {
      if (e) {
        if (this.isOculus().match) {
          if (e.includes("https://www.meta.com/experiences/")) {
            setTimeout(() => {
              window.open(e, "_blank");
            }, 1e3);
            return;
          }
        } else if (this.isWolvic().match) {
          let t = document.createElement("div"), i = document.createElement("div"), n = document.createElement("p"), o = document.createElement("button"), s = document.createElement("button");
          t.style.backgroundColor = "rgb(0, 0, 0, 0.75)", t.style.color = "white", t.style.textAlign = "center", t.style.position = "fixed", t.style.top = "50%", t.style.left = "50%", t.style.padding = "5%", t.style.borderRadius = "5%", t.style.transform = "translate(-50%, -50%)", n.innerHTML = `<b>This billboard leads to ${e}. Continue?</b>`, o.innerText = "Move cursor back into window.", o.style.width = "100vw", o.style.height = "100vh", o.onmouseenter = () => {
            o.style.width = "auto", o.style.height = "auto", o.innerText = "Yes";
          }, o.onclick = () => {
            window.open(e, "_blank"), t.remove();
          }, s.innerText = "No", s.onclick = () => {
            t.remove();
          }, t.append(i), i.append(n), i.append(o), i.append(s), document.body.append(t);
          return;
        }
        window.open(e, "_blank");
      }
    }
    urlContainsUTMParams(e) {
      return e.indexOf("utm_source=") !== -1 || e.indexOf("utm_campaign=") !== -1 || e.indexOf("utm_channel=") !== -1;
    }
  };
  var m = new T();
  var P = class {
    constructor() {
      var e;
      this.tld = (e = ["heyvr.test", "heyvr.de", "heyvr.dev", "heyvr.io"].find((t) => {
        var i;
        return (i = window.location) == null ? void 0 : i.hostname.endsWith(t);
      })) != null ? e : "heyvr.io";
    }
    fetch(e, t = "GET", i = void 0) {
      return d(this, null, function* () {
        let n = yield fetch(`https://api.${this.tld}${e}`, { method: t, headers: { Accept: "application/json", "Content-Type": "application/json" }, credentials: "include", body: i });
        if (n.ok)
          return (yield n.json()).data;
        let o = yield n.json();
        return "status" in o ? Promise.reject(o) : Promise.reject({ status: { success: false, code: 500, debug: "err_network", message: "A network error has occurred." }, data: null });
      });
    }
    fetchHeyVRAd(e, t, i) {
      return d(this, null, function* () {
        let n = new URLSearchParams();
        n.set("testing", (!!t).toString()), n.set("placeholder", (!!i).toString());
        try {
          return yield this.fetch(`/v1/public/ads/serve/${e}?${n.toString()}`);
        } catch (o) {
          switch (o.status.debug) {
            case "err_not_found": {
              console.warn("heyVR ADS: The ad unit does not seem to be valid.");
              break;
            }
            case "err_no_campaign": {
              console.log("heyVR ADS: No active campaigns found.");
              break;
            }
          }
          throw o;
        }
      });
    }
    registerClick(e) {
      return d(this, null, function* () {
        let { platform: t, confidence: i } = yield m.getPlatform();
        return this.fetch(`/v1/public/ads/event/${e}/click`, "PATCH", JSON.stringify({ platform: t, confidence: i })).catch((n) => console.log("heyVR ADS: Could not register user's click.", n));
      });
    }
    registerImpression(e) {
      return d(this, null, function* () {
        let { platform: t, confidence: i } = yield m.getPlatform();
        return this.fetch(`/v1/public/ads/event/${e}/impression`, "PATCH", JSON.stringify({ platform: t, confidence: i })).catch((n) => console.log("heyVR ADS: Could not register user's click.", n));
      });
    }
    sendInsight(e, t) {
      return d(this, null, function* () {
        let { platform: i, confidence: n } = yield m.getPlatform();
        return this.fetch(`/v1/public/ads/event/${e}/insight`, "POST", JSON.stringify({ payload: t, platform: i, confidence: n })).catch((o) => console.log("heyVR ADS: Could not register ad insights.", o.message));
      });
    }
  };
  var x = new P();
  var y = 1e-6;
  var v = typeof Float32Array < "u" ? Float32Array : Array;
  var b = Math.random;
  var Ye = Math.PI / 180;
  Math.hypot || (Math.hypot = function() {
    for (var r = 0, e = arguments.length; e--; )
      r += arguments[e] * arguments[e];
    return Math.sqrt(r);
  });
  var f = {};
  $(f, { add: () => K, angle: () => ye, bezier: () => de, ceil: () => Q, clone: () => H, copy: () => J, create: () => O, cross: () => ce, dist: () => Re, distance: () => L, div: () => ke, divide: () => _, dot: () => U, equals: () => Pe, exactEquals: () => Te, floor: () => Z, forEach: () => De, fromValues: () => X, hermite: () => le, inverse: () => se, len: () => Se, length: () => z, lerp: () => he, max: () => te, min: () => ee, mul: () => Ae, multiply: () => q, negate: () => oe, normalize: () => ae, random: () => ue, rotateX: () => ve, rotateY: () => ge, rotateZ: () => xe, round: () => re, scale: () => ie, scaleAndAdd: () => ne, set: () => G, sqrDist: () => Ce, sqrLen: () => Ve, squaredDistance: () => F, squaredLength: () => j, str: () => we, sub: () => be, subtract: () => N, transformMat3: () => me, transformMat4: () => pe, transformQuat: () => fe, zero: () => Me });
  function O() {
    var r = new v(3);
    return v != Float32Array && (r[0] = 0, r[1] = 0, r[2] = 0), r;
  }
  function H(r) {
    var e = new v(3);
    return e[0] = r[0], e[1] = r[1], e[2] = r[2], e;
  }
  function z(r) {
    var e = r[0], t = r[1], i = r[2];
    return Math.hypot(e, t, i);
  }
  function X(r, e, t) {
    var i = new v(3);
    return i[0] = r, i[1] = e, i[2] = t, i;
  }
  function J(r, e) {
    return r[0] = e[0], r[1] = e[1], r[2] = e[2], r;
  }
  function G(r, e, t, i) {
    return r[0] = e, r[1] = t, r[2] = i, r;
  }
  function K(r, e, t) {
    return r[0] = e[0] + t[0], r[1] = e[1] + t[1], r[2] = e[2] + t[2], r;
  }
  function N(r, e, t) {
    return r[0] = e[0] - t[0], r[1] = e[1] - t[1], r[2] = e[2] - t[2], r;
  }
  function q(r, e, t) {
    return r[0] = e[0] * t[0], r[1] = e[1] * t[1], r[2] = e[2] * t[2], r;
  }
  function _(r, e, t) {
    return r[0] = e[0] / t[0], r[1] = e[1] / t[1], r[2] = e[2] / t[2], r;
  }
  function Q(r, e) {
    return r[0] = Math.ceil(e[0]), r[1] = Math.ceil(e[1]), r[2] = Math.ceil(e[2]), r;
  }
  function Z(r, e) {
    return r[0] = Math.floor(e[0]), r[1] = Math.floor(e[1]), r[2] = Math.floor(e[2]), r;
  }
  function ee(r, e, t) {
    return r[0] = Math.min(e[0], t[0]), r[1] = Math.min(e[1], t[1]), r[2] = Math.min(e[2], t[2]), r;
  }
  function te(r, e, t) {
    return r[0] = Math.max(e[0], t[0]), r[1] = Math.max(e[1], t[1]), r[2] = Math.max(e[2], t[2]), r;
  }
  function re(r, e) {
    return r[0] = Math.round(e[0]), r[1] = Math.round(e[1]), r[2] = Math.round(e[2]), r;
  }
  function ie(r, e, t) {
    return r[0] = e[0] * t, r[1] = e[1] * t, r[2] = e[2] * t, r;
  }
  function ne(r, e, t, i) {
    return r[0] = e[0] + t[0] * i, r[1] = e[1] + t[1] * i, r[2] = e[2] + t[2] * i, r;
  }
  function L(r, e) {
    var t = e[0] - r[0], i = e[1] - r[1], n = e[2] - r[2];
    return Math.hypot(t, i, n);
  }
  function F(r, e) {
    var t = e[0] - r[0], i = e[1] - r[1], n = e[2] - r[2];
    return t * t + i * i + n * n;
  }
  function j(r) {
    var e = r[0], t = r[1], i = r[2];
    return e * e + t * t + i * i;
  }
  function oe(r, e) {
    return r[0] = -e[0], r[1] = -e[1], r[2] = -e[2], r;
  }
  function se(r, e) {
    return r[0] = 1 / e[0], r[1] = 1 / e[1], r[2] = 1 / e[2], r;
  }
  function ae(r, e) {
    var t = e[0], i = e[1], n = e[2], o = t * t + i * i + n * n;
    return o > 0 && (o = 1 / Math.sqrt(o)), r[0] = e[0] * o, r[1] = e[1] * o, r[2] = e[2] * o, r;
  }
  function U(r, e) {
    return r[0] * e[0] + r[1] * e[1] + r[2] * e[2];
  }
  function ce(r, e, t) {
    var i = e[0], n = e[1], o = e[2], s = t[0], a = t[1], c = t[2];
    return r[0] = n * c - o * a, r[1] = o * s - i * c, r[2] = i * a - n * s, r;
  }
  function he(r, e, t, i) {
    var n = e[0], o = e[1], s = e[2];
    return r[0] = n + i * (t[0] - n), r[1] = o + i * (t[1] - o), r[2] = s + i * (t[2] - s), r;
  }
  function le(r, e, t, i, n, o) {
    var s = o * o, a = s * (2 * o - 3) + 1, c = s * (o - 2) + o, h = s * (o - 1), l = s * (3 - 2 * o);
    return r[0] = e[0] * a + t[0] * c + i[0] * h + n[0] * l, r[1] = e[1] * a + t[1] * c + i[1] * h + n[1] * l, r[2] = e[2] * a + t[2] * c + i[2] * h + n[2] * l, r;
  }
  function de(r, e, t, i, n, o) {
    var s = 1 - o, a = s * s, c = o * o, h = a * s, l = 3 * o * a, u = 3 * c * s, p2 = c * o;
    return r[0] = e[0] * h + t[0] * l + i[0] * u + n[0] * p2, r[1] = e[1] * h + t[1] * l + i[1] * u + n[1] * p2, r[2] = e[2] * h + t[2] * l + i[2] * u + n[2] * p2, r;
  }
  function ue(r, e) {
    e = e || 1;
    var t = b() * 2 * Math.PI, i = b() * 2 - 1, n = Math.sqrt(1 - i * i) * e;
    return r[0] = Math.cos(t) * n, r[1] = Math.sin(t) * n, r[2] = i * e, r;
  }
  function pe(r, e, t) {
    var i = e[0], n = e[1], o = e[2], s = t[3] * i + t[7] * n + t[11] * o + t[15];
    return s = s || 1, r[0] = (t[0] * i + t[4] * n + t[8] * o + t[12]) / s, r[1] = (t[1] * i + t[5] * n + t[9] * o + t[13]) / s, r[2] = (t[2] * i + t[6] * n + t[10] * o + t[14]) / s, r;
  }
  function me(r, e, t) {
    var i = e[0], n = e[1], o = e[2];
    return r[0] = i * t[0] + n * t[3] + o * t[6], r[1] = i * t[1] + n * t[4] + o * t[7], r[2] = i * t[2] + n * t[5] + o * t[8], r;
  }
  function fe(r, e, t) {
    var i = t[0], n = t[1], o = t[2], s = t[3], a = e[0], c = e[1], h = e[2], l = n * h - o * c, u = o * a - i * h, p2 = i * c - n * a, k = n * p2 - o * u, R = o * l - i * p2, C = i * u - n * l, w = s * 2;
    return l *= w, u *= w, p2 *= w, k *= 2, R *= 2, C *= 2, r[0] = a + l + k, r[1] = c + u + R, r[2] = h + p2 + C, r;
  }
  function ve(r, e, t, i) {
    var n = [], o = [];
    return n[0] = e[0] - t[0], n[1] = e[1] - t[1], n[2] = e[2] - t[2], o[0] = n[0], o[1] = n[1] * Math.cos(i) - n[2] * Math.sin(i), o[2] = n[1] * Math.sin(i) + n[2] * Math.cos(i), r[0] = o[0] + t[0], r[1] = o[1] + t[1], r[2] = o[2] + t[2], r;
  }
  function ge(r, e, t, i) {
    var n = [], o = [];
    return n[0] = e[0] - t[0], n[1] = e[1] - t[1], n[2] = e[2] - t[2], o[0] = n[2] * Math.sin(i) + n[0] * Math.cos(i), o[1] = n[1], o[2] = n[2] * Math.cos(i) - n[0] * Math.sin(i), r[0] = o[0] + t[0], r[1] = o[1] + t[1], r[2] = o[2] + t[2], r;
  }
  function xe(r, e, t, i) {
    var n = [], o = [];
    return n[0] = e[0] - t[0], n[1] = e[1] - t[1], n[2] = e[2] - t[2], o[0] = n[0] * Math.cos(i) - n[1] * Math.sin(i), o[1] = n[0] * Math.sin(i) + n[1] * Math.cos(i), o[2] = n[2], r[0] = o[0] + t[0], r[1] = o[1] + t[1], r[2] = o[2] + t[2], r;
  }
  function ye(r, e) {
    var t = r[0], i = r[1], n = r[2], o = e[0], s = e[1], a = e[2], c = Math.sqrt(t * t + i * i + n * n), h = Math.sqrt(o * o + s * s + a * a), l = c * h, u = l && U(r, e) / l;
    return Math.acos(Math.min(Math.max(u, -1), 1));
  }
  function Me(r) {
    return r[0] = 0, r[1] = 0, r[2] = 0, r;
  }
  function we(r) {
    return "vec3(" + r[0] + ", " + r[1] + ", " + r[2] + ")";
  }
  function Te(r, e) {
    return r[0] === e[0] && r[1] === e[1] && r[2] === e[2];
  }
  function Pe(r, e) {
    var t = r[0], i = r[1], n = r[2], o = e[0], s = e[1], a = e[2];
    return Math.abs(t - o) <= y * Math.max(1, Math.abs(t), Math.abs(o)) && Math.abs(i - s) <= y * Math.max(1, Math.abs(i), Math.abs(s)) && Math.abs(n - a) <= y * Math.max(1, Math.abs(n), Math.abs(a));
  }
  var be = N;
  var Ae = q;
  var ke = _;
  var Re = L;
  var Ce = F;
  var Se = z;
  var Ve = j;
  var De = function() {
    var r = O();
    return function(e, t, i, n, o, s) {
      var a, c;
      for (t || (t = 3), i || (i = 0), n ? c = Math.min(n * t + i, e.length) : c = e.length, a = i; a < c; a += t)
        r[0] = e[a], r[1] = e[a + 1], r[2] = e[a + 2], o(r, r, s), e[a] = r[0], e[a + 1] = r[1], e[a + 2] = r[2];
      return e;
    };
  }();
  console.log("heyVR ADS: Wonderland SDK Loaded");
  var M = class extends Component3 {
    constructor() {
      super(...arguments);
      this.videoUpdateRequested = false;
    }
    boot() {
      this.isOnCooldown() || !this.checkVisibility() || this.busy || (this.busy = true, this.fetchNewAd().then((t) => {
        this.banner = t;
        let [i, n] = t.size.split("x"), o = Math.round(Number(i) / Number(n) * 10) / 10;
        this.height = this.object.getScalingLocal()[1], this.width = o * this.height, this.object.resetScaling(), this.createAutomaticCollision && (this.collision.extents = [this.width, this.height, 0.1]), this.object.scaleLocal([this.width, this.height, 1]), t.texture ? this.createFromImage(t) : t.type === "video" && this.createFromVideo(t), this.uuid && !this.testing ? x.registerImpression(this.uuid).then(() => this.impression = (/* @__PURE__ */ new Date()).getTime()).then(() => this.busy = false) : (this.impression = (/* @__PURE__ */ new Date()).getTime(), this.busy = false);
      }).catch(() => this.destroy()));
    }
    checkVisibility() {
      let t = this.scene || this.engine.scene, i = this.object.getPositionWorld([]), n = t.activeViews[0].object.getPositionWorld([]), o = t.activeViews[0].object.getForwardWorld([]), s = t.activeViews[0].fov, a = f.sub([], i, n);
      return f.normalize(a, a), f.dot(o, a) > Math.cos(Math.PI * s / 180);
    }
    click() {
      m.openURL(this.banner.url), this.uuid && !this.testing && x.registerClick(this.uuid);
    }
    createFromImage(t) {
      let i = this.mesh.material.clone();
      if (this.textureProperty === "auto") {
        if (i.diffuseTexture || i.hasParameter && i.hasParameter("diffuseTexture"))
          i.diffuseTexture = t.texture, i.alphaMaskThreshold = 0.3;
        else if (i.flatTexture || i.hasParameter && i.hasParameter("flatTexture"))
          i.flatTexture = t.texture, i.alphaMaskThreshold = 0.8;
        else
          throw Error(`heyVR ADS: Could not set the banner texture via ${pipeline}`);
        this.mesh.material = i, this.mesh.material.alphaMaskTexture = t.texture;
      } else
        this.mesh.material[this.textureProperty] = t.texture, this.mesh.material.alphaMaskTexture = t.texture;
    }
    createFromVideo(t) {
      let i = () => {
        var n, o;
        (n = this.video) != null && n.paused && ((o = this.video) == null || o.play().then(() => {
          window.removeEventListener("click", i), window.removeEventListener("touchstart", i);
        }));
      };
      window.addEventListener("click", i), window.addEventListener("touchstart", i), this.video = document.createElement("video"), this.video.crossOrigin = "anonymous", this.video.loop = true, this.video.muted = true, this.video.autoplay = true, this.video.src = t.media, this.video.play().then(() => {
        console.log("heyVR ADS: Video ad playback started."), this.videoUpdateRequested = true, this.videoTexture = new TextureManager(this.engine).create(this.video), setFirstMaterialTexture(this.mesh.material, this.videoTexture, this.textureProperty) || console.error("heyVR ADS: Shader ", this.mesh.material.shader, " not supported by video-texture"), "requestVideoFrameCallback" in this.video ? this.video.requestVideoFrameCallback(this.updateVideo.bind(this)) : this.video.addEventListener("timeupdate", () => this.videoUpdateRequested = true);
      });
    }
    fetchNewAd() {
      return d(this, null, function* () {
        var i, n;
        let t = yield x.fetchHeyVRAd(this.adUnit, this.testing, this.placeholder);
        return this.uuid = t.uuid, ((i = this.mesh.material) == null ? void 0 : i.flatTexture) != null ? this.mesh.material.flatTexture.destroy() : ((n = this.mesh.material) == null ? void 0 : n.diffuseTexture) != null && this.mesh.material.diffuseTexture.destroy(), t.type === "video" ? Promise.resolve(t) : this.engine.textures.load(t.media, "anonymous").then((o) => E({ texture: o }, t));
      });
    }
    init() {
      if (this.missing())
        throw this.destroy(), new Error("heyVR ADS: Failed to initialize the SDK. Please check the console for warnings.");
    }
    isOnCooldown() {
      return this.impression !== void 0 && (/* @__PURE__ */ new Date()).getTime() - this.impression < 2 * 60 * 1e3;
    }
    missing() {
      return this.adUnit ? false : (console.warn("heyVR ADS: Missing the ad unit."), true);
    }
    onClick() {
      var t;
      (t = this.banner) != null && t.url && (this.engine.xr ? this.engine.xr.session.end().then(this.click.bind(this)) : this.engine.xrSession ? this.engine.xrSession.end().then(this.click.bind(this)) : this.click());
    }
    static onRegister(t) {
      t.registerComponent(CursorTarget);
    }
    start() {
      if (this.mesh = this.object.getComponent(MeshComponent), !this.mesh)
        throw new Error("heyVR ADS: The attached component does not appear to be a mesh component.");
      this.collision = this.object.getComponent(CollisionComponent) || this.object.addComponent(CollisionComponent, { collider: Collider.Box, group: 2 }), this.cursorTarget = this.object.getComponent(CursorTarget) || this.object.addComponent(CursorTarget), this.cursorTarget.onClick.add(this.onClick.bind(this)), setInterval(this.boot.bind(this), 1e3);
    }
    update(t) {
      this.video && this.videoUpdateRequested && this.videoTexture && (this.videoTexture.update(), this.videoUpdateRequested = false);
    }
    updateVideo() {
      this.videoUpdateRequested = true, this.video.requestVideoFrameCallback(this.updateVideo.bind(this));
    }
  };
  M.Properties = { adUnit: Property.string(), placeholder: Property.bool(true), textureProperty: Property.string("auto"), assignAlphaMaskTexture: Property.bool(true), testing: Property.bool(false) }, M.TypeName = "heyvr-ad";

  // node_modules/@sorskoot/wonderland-components/dist/index.js
  var dist_exports3 = {};
  __export(dist_exports3, {
    Assert: () => Assert,
    AxisNegZ: () => AxisNegZ,
    AxisX: () => AxisX,
    AxisY: () => AxisY,
    AxisZ: () => AxisZ,
    Coroutine: () => Coroutine,
    CoroutineManager: () => CoroutineManager,
    DieAfterTime: () => DieAfterTime,
    Easing: () => Easing,
    FadeToBlack: () => FadeToBlack,
    Flipbook: () => Flipbook,
    InputManager: () => InputManager,
    KeyEventType: () => KeyEventType,
    KeyType: () => KeyType,
    KeyboardController: () => KeyboardController,
    MaterialPool: () => MaterialPool,
    Mathf: () => Mathf,
    Mathfx: () => Mathfx,
    MeshUtils: () => MeshUtils,
    Noise: () => Noise,
    NotifyPropertyChanged: () => NotifyPropertyChanged,
    ObjectCache: () => ObjectCache,
    Observable: () => Observable,
    OfflineHelper: () => OfflineHelper,
    Prefab: () => Prefab,
    PrefabStorage: () => PrefabStorage,
    PrefabsBase: () => PrefabsBase,
    Queue: () => Queue,
    RNG: () => RNG,
    STOP_PROPAGATION: () => STOP_PROPAGATION,
    SelfDestruct: () => SelfDestruct,
    ShootBase: () => ShootBase,
    Signal: () => Signal,
    SimpleAnimationBase: () => SimpleAnimationBase,
    SimpleAnimationLerpType: () => SimpleAnimationLerpType,
    SimpleAnimationStyle: () => SimpleAnimationStyle,
    SnapRotate: () => SnapRotate,
    SnowParticles: () => SnowParticles,
    SorskootLogger: () => SorskootLogger,
    StartStopAnimationOnActivate: () => StartStopAnimationOnActivate,
    Tags: () => Tags,
    TeleportController: () => TeleportController,
    TimerController: () => TimerController,
    TweenPositionAnimation: () => TweenPositionAnimation,
    TweenScaleAnimation: () => TweenScaleAnimation,
    Vec3One: () => Vec3One,
    Vec3Zero: () => Vec3Zero,
    clamp: () => clamp2,
    cloneObject: () => cloneObject,
    flagBitIsSet: () => flagBitIsSet,
    formatNumber: () => formatNumber,
    hapticFeedback: () => hapticFeedback,
    isMobile: () => isMobile,
    lerp: () => lerp6,
    lerpArr: () => lerpArr,
    lerpVec3: () => lerpVec3,
    moveFirstToLast: () => moveFirstToLast,
    moveLastToFirst: () => moveLastToFirst,
    rng: () => rng,
    rngWithWeight: () => rngWithWeight,
    sendMessage: () => sendMessage,
    timeSinceEpoch: () => timeSinceEpoch,
    vibrateDevice: () => vibrateDevice,
    waitForCondition: () => waitForCondition,
    waitForPromise: () => waitForPromise,
    waitForSeconds: () => waitForSeconds,
    wlUtils: () => wlUtils
  });

  // node_modules/@sorskoot/wonderland-components/dist/components/flipbook.js
  var __decorate20 = function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d2;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if (d2 = decorators[i])
          r = (c < 3 ? d2(r) : c > 3 ? d2(target, key, r) : d2(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  var DynamicTextureCache = class {
    _textures;
    _engine;
    constructor(engine) {
      this._textures = {};
      this._engine = engine;
    }
    loadTextures(url, columns, rows) {
      if (!this._textures.hasOwnProperty(url)) {
        this._textures[url] = new Promise((resolve, reject) => {
          const image = new Image();
          const textures = [];
          image.src = url;
          image.onload = () => {
            const canvas2 = document.createElement("canvas");
            const context2 = canvas2.getContext("2d");
            if (context2 == null) {
              reject("Could not get 2D context");
              return;
            }
            canvas2.width = image.width;
            canvas2.height = image.height;
            context2.drawImage(image, 0, 0);
            const spriteWidth = image.width / columns;
            const spriteHeight = image.height / rows;
            for (let y2 = 0; y2 < rows; y2++) {
              for (let x2 = 0; x2 < columns; x2++) {
                const pc = this._copyPartOfCanvas(canvas2, x2 * spriteWidth, y2 * spriteHeight, spriteWidth, spriteHeight);
                const texturePc = this._engine.textures.create(pc);
                textures.push(texturePc);
              }
            }
            resolve(textures);
          };
          image.onerror = () => {
            reject(`Failed to load image from URL: ${url}`);
          };
        });
      }
      return this._textures[url];
    }
    _copyPartOfCanvas(canvas2, x2, y2, width, height) {
      const copy7 = document.createElement("canvas");
      copy7.width = width;
      copy7.height = height;
      const ctx2 = copy7.getContext("2d");
      if (ctx2) {
        ctx2.drawImage(canvas2, x2, y2, width, height, 0, 0, width, height);
      }
      return copy7;
    }
  };
  var textureCache;
  var Flipbook = class extends Component3 {
    /**
     * Base material to clone for each frame
     */
    base;
    /**
     * URL to the sprite sheet texture
     */
    url = "";
    /**
     * URL to the emissive sprite sheet texture (optional)
     */
    urlEmissive = "";
    /**
     * Number of columns in the sprite sheet
     */
    columns = 4;
    /**
     * Number of rows in the sprite sheet
     */
    rows = 4;
    /**
     * Animation speed in frames per second
     */
    speed = 8;
    _textures = [];
    _loaded = false;
    _index = 0;
    _previousIndex = -1;
    _meshComponent = null;
    _time = 0;
    init() {
      if (!textureCache) {
        textureCache = new DynamicTextureCache(this.engine);
      }
      const texturesPromises = [];
      texturesPromises.push(textureCache.loadTextures(this.url, this.columns, this.rows));
      if (this.urlEmissive) {
        texturesPromises.push(textureCache.loadTextures(this.urlEmissive, this.columns, this.rows));
      }
      Promise.all(texturesPromises).then((tex) => {
        this._textures = [];
        if (this.urlEmissive) {
          for (let i = 0; i < tex[0].length; i++) {
            this._textures.push(this._createMaterial(this.base, tex[0][i], tex[1][i]));
          }
        } else {
          for (let i = 0; i < tex[0].length; i++) {
            this._textures.push(this._createMaterial(this.base, tex[0][i]));
          }
        }
        this._loaded = true;
        this._index = Math.floor(Math.random() * this._textures.length);
      }).catch((error) => {
        console.error("Flipbook: Failed to load textures", error);
      });
    }
    _createMaterial(base, texture, emissiveTexture = null) {
      const mat = base.clone();
      if (!mat) {
        throw new Error("Flipbook: Could not clone material");
      }
      if (mat.pipeline == "Flat Opaque Textured" || mat.pipeline.startsWith("FlatSorskoot")) {
        const flatMat = mat;
        flatMat.flatTexture = texture;
        if (mat.pipeline == "FlatSorskoot Emissive") {
          if (emissiveTexture) {
            flatMat.emissiveTexture = emissiveTexture;
          }
        }
      } else {
        console.error(`Flipbook: Pipeline ${mat.pipeline} not supported by flipbook`);
      }
      return mat;
    }
    start() {
      if (!this.url) {
        throw new Error("Flipbook: URL property is required for the sprite sheet");
      }
      if (!this.base) {
        throw new Error("Flipbook: Base material is required");
      }
      this._meshComponent = this.object.getComponent(MeshComponent);
      if (!this._meshComponent) {
        throw new Error("Flipbook: MeshComponent is required on the same object");
      }
      this._time = Math.random() * this.speed;
    }
    update(dt) {
      if (!this._loaded) {
        return;
      }
      this._time += dt * this.speed;
      this._index = Math.floor(this._time) % this._textures.length;
      if (this._textures.length > 0 && this._previousIndex != this._index && this._meshComponent) {
        this._previousIndex = this._index;
        this._meshComponent.material = this._textures[this._index];
      }
    }
  };
  __publicField(Flipbook, "TypeName", "flipbook");
  __decorate20([
    property.material({ required: true })
  ], Flipbook.prototype, "base", void 0);
  __decorate20([
    property.string("")
  ], Flipbook.prototype, "url", void 0);
  __decorate20([
    property.string("")
  ], Flipbook.prototype, "urlEmissive", void 0);
  __decorate20([
    property.int(4)
  ], Flipbook.prototype, "columns", void 0);
  __decorate20([
    property.int(4)
  ], Flipbook.prototype, "rows", void 0);
  __decorate20([
    property.float(8)
  ], Flipbook.prototype, "speed", void 0);

  // node_modules/@sorskoot/wonderland-components/dist/components/deprecated/prefab.js
  var __decorate21 = function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d2;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if (d2 = decorators[i])
          r = (c < 3 ? d2(r) : c > 3 ? d2(target, key, r) : d2(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  var Prefab = class extends Component3 {
    name;
  };
  __publicField(Prefab, "TypeName", "prefab");
  __decorate21([
    property.string()
  ], Prefab.prototype, "name", void 0);

  // node_modules/@sorskoot/wonderland-components/dist/components/deprecated/prefab-storage.js
  var PrefabStorage = class extends Component3 {
    prefabs = {};
    start() {
      let children = this.object.children;
      for (let i = 0; i < children.length; i++) {
        let child = children[i];
        let childPrefab = child.getComponent(Prefab);
        if (childPrefab) {
          this.prefabs[childPrefab.name] = child;
          child.setPositionWorld([-1e3, -1e3, -1e3]);
        }
      }
    }
    /**
     * Instantiate a prefab.
     *
     * @param {string} prefabName Name of the prefab to instantiate.
     * @param {Object3D} parentObject The object to parent the prefab to after instantiation.
     * @returns {Object3D|undefined} The root of the instantiated prefab.
     */
    instantiate(prefabName, parentObject) {
      let prefab = this.prefabs[prefabName];
      if (!prefab) {
        console.error("trying to create " + prefabName + " but that is not a registerd prefab");
        return;
      }
      let obj = this.engine.scene.addObject(parentObject);
      obj.name = prefabName;
      obj.scaleLocal(prefab.getScalingLocal());
      obj.setTransformLocal(prefab.getTransformLocal());
      var prefabMesh = prefab.getComponent(MeshComponent);
      if (prefabMesh) {
        let newMesh = obj.addComponent(MeshComponent);
        if (!newMesh) {
          console.error("mesh component could not be added to object");
          return;
        }
        newMesh.mesh = prefabMesh.mesh;
        newMesh.material = prefabMesh.material;
      }
      var prefabCollision = prefab.getComponent(CollisionComponent);
      if (prefabCollision) {
        let newCollision = obj.addComponent(CollisionComponent);
        if (!newCollision) {
          console.error("collision component could not be added to object");
          return;
        }
        newCollision.collider = prefabCollision.collider;
        newCollision.extents = prefabCollision.extents;
        newCollision.group = prefabCollision.group;
      }
      obj.setDirty();
      return obj;
    }
  };
  __publicField(PrefabStorage, "TypeName", "prefab-storage");

  // node_modules/@sorskoot/wonderland-components/dist/components/shootBase.js
  var __decorate22 = function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d2;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if (d2 = decorators[i])
          r = (c < 3 ? d2(r) : c > 3 ? d2(target, key, r) : d2(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  var handedness = ["left", "right"];
  var ShootBase = class extends Component3 {
    haptics = true;
    handedness = 0;
    initialized = false;
    start() {
      this.initialized = false;
      this.engine.onXRSessionStart.add((session) => {
        if (this.initialized)
          return;
        session.addEventListener("select", (e) => {
          if (!this.active)
            return;
          if (e.inputSource.handedness === handedness[this.handedness]) {
            if (this.haptics) {
              this.pulse(e.inputSource.gamepad);
            }
            this.shoot(this.object.getPositionWorld(), this.object.getRotationWorld());
          }
        });
        this.initialized = true;
      });
    }
    pulse(gamepad) {
      var actuator;
      if (!gamepad || !gamepad.hapticActuators) {
        return;
      }
      actuator = gamepad.hapticActuators[0];
      if (!actuator)
        return;
      actuator.pulse(1, 100);
    }
    shoot(transform, rotation) {
    }
  };
  __publicField(ShootBase, "TypeName", "shoot-base");
  __decorate22([
    property.bool(true)
  ], ShootBase.prototype, "haptics", void 0);
  __decorate22([
    property.enum(["Left", "Right"])
  ], ShootBase.prototype, "handedness", void 0);

  // node_modules/@sorskoot/wonderland-components/dist/components/snap-rotate.js
  var __decorate23 = function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d2;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if (d2 = decorators[i])
          r = (c < 3 ? d2(r) : c > 3 ? d2(target, key, r) : d2(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  var SnapRotate = class extends Component3 {
    player;
    degrees;
    input = null;
    snapped = false;
    start() {
      this.input = this.object.getComponent(InputComponent);
      this.snapped = false;
    }
    update(dt) {
      if (!this.input || !this.input.xrInputSource || !this.input.xrInputSource.gamepad || !this.input.xrInputSource.gamepad.axes) {
        return;
      }
      const currentAxis = this.input.xrInputSource.gamepad.axes[2];
      if (currentAxis > -0.2 && currentAxis < 0.2) {
        this.snapped = false;
        return;
      }
      if (Math.abs(currentAxis) < 0.8) {
        return;
      }
      let lastHeadPos = vec3_exports.fromValues(0, 0, 0);
      this.player.getPositionWorld(lastHeadPos);
      if (currentAxis < -0.8 && !this.snapped) {
        this.player.rotateAxisAngleDegLocal([0, 1, 0], this.degrees);
        this.snapped = true;
      }
      if (currentAxis > 0.8 && !this.snapped) {
        this.player.rotateAxisAngleDegLocal([0, 1, 0], -this.degrees);
        this.snapped = true;
      }
      let currentHeadPos = vec3_exports.fromValues(0, 0, 0);
      this.player.getPositionWorld(currentHeadPos);
      let newPos = vec3_exports.fromValues(0, 0, 0);
      vec3_exports.sub(newPos, lastHeadPos, currentHeadPos);
      this.player.translateLocal(newPos);
    }
  };
  __publicField(SnapRotate, "TypeName", "snap-rotate");
  __decorate23([
    property.object()
  ], SnapRotate.prototype, "player", void 0);
  __decorate23([
    property.int(30)
  ], SnapRotate.prototype, "degrees", void 0);

  // node_modules/@sorskoot/wonderland-components/dist/components/snow-particles.js
  var __decorate24 = function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d2;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if (d2 = decorators[i])
          r = (c < 3 ? d2(r) : c > 3 ? d2(target, key, r) : d2(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  var _objects, _velocities, _speeds, _direction2;
  var SnowParticles = class extends Component3 {
    constructor() {
      super(...arguments);
      __publicField(this, "mesh");
      __publicField(this, "material");
      __publicField(this, "delay");
      __publicField(this, "maxParticles");
      __publicField(this, "initialSpeed");
      __publicField(this, "particleScale");
      __publicField(this, "size");
      __publicField(this, "time", 0);
      __publicField(this, "count", 0);
      /**
       * @type {Object3D[]}
       */
      __privateAdd(this, _objects, []);
      /**
      * @type {number[][]}
      */
      __privateAdd(this, _velocities, []);
      __privateAdd(this, _speeds, []);
      __privateAdd(this, _direction2, [0, 0, 0]);
    }
    start() {
      __privateSet(this, _objects, this.engine.scene.addObjects(this.maxParticles, null, this.maxParticles));
      for (let i = 0; i < this.maxParticles; ++i) {
        __privateGet(this, _velocities).push([Math.random() / 4 - 0.125, -Math.random() - 0.2, Math.random() / 4 - 0.125]);
        let obj = __privateGet(this, _objects)[i];
        obj.name = "particle" + this.count.toString();
        let mesh = obj.addComponent(MeshComponent);
        mesh.mesh = this.mesh;
        mesh.material = this.material;
        obj.scaleLocal([0, 0, 0]);
      }
      for (let i = 0; i < this.maxParticles; ++i) {
        this.spawn();
      }
    }
    update(dt) {
      let origin = vec3_exports.fromValues(0, 0, 0);
      let distance3 = vec3_exports.fromValues(0, 0, 0);
      for (let i = 0; i < Math.min(this.count, __privateGet(this, _objects).length); ++i) {
        quat2_exports.getTranslation(origin, __privateGet(this, _objects)[i].getTransformWorld());
        const vel = __privateGet(this, _velocities)[i];
        if (origin[0] + vel[0] * dt > 8)
          origin[0] -= 16;
        else if (origin[0] + vel[0] * dt <= -8)
          origin[0] += 16;
        if (origin[2] + vel[2] * dt > 8)
          origin[2] -= 16;
        else if (origin[2] + vel[2] * dt <= -8)
          origin[2] += 16;
        if (origin[1] + vel[1] * dt <= 0) {
          origin[1] = 5;
          __privateGet(this, _objects)[i].setPositionWorld(origin);
        }
      }
      for (let i = 0; i < Math.min(this.count, __privateGet(this, _objects).length); ++i) {
        vec3_exports.scale(distance3, __privateGet(this, _velocities)[i], dt);
        __privateGet(this, _objects)[i].translateWorld(distance3);
      }
    }
    /** Spawn a particle */
    spawn() {
      let index = this.count % this.maxParticles;
      let obj = __privateGet(this, _objects)[index];
      obj.resetTransform();
      obj.scaleLocal([this.particleScale, this.particleScale, this.particleScale]);
      obj.getComponent(MeshComponent).active = true;
      obj.translateWorld([Math.random() * this.size - this.size / 2, Math.random() * 5, Math.random() * this.size - this.size / 2]);
      this.count += 1;
    }
  };
  _objects = new WeakMap();
  _velocities = new WeakMap();
  _speeds = new WeakMap();
  _direction2 = new WeakMap();
  __publicField(SnowParticles, "TypeName", "snow-particles");
  __decorate24([
    property.mesh()
  ], SnowParticles.prototype, "mesh", void 0);
  __decorate24([
    property.material()
  ], SnowParticles.prototype, "material", void 0);
  __decorate24([
    property.float(0.1)
  ], SnowParticles.prototype, "delay", void 0);
  __decorate24([
    property.int(1500)
  ], SnowParticles.prototype, "maxParticles", void 0);
  __decorate24([
    property.float(15)
  ], SnowParticles.prototype, "initialSpeed", void 0);
  __decorate24([
    property.float(0.01)
  ], SnowParticles.prototype, "particleScale", void 0);
  __decorate24([
    property.int(16)
  ], SnowParticles.prototype, "size", void 0);

  // node_modules/@sorskoot/wonderland-components/dist/components/tags.js
  var __decorate25 = function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d2;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if (d2 = decorators[i])
          r = (c < 3 ? d2(r) : c > 3 ? d2(target, key, r) : d2(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  var _Tags = class extends Component3 {
    /**
     * A space-separated list of tags.
     *
     * Note: Do not change the tags at runtime.
     * If you need to change it, use the Tags.setTag method.
     */
    tags;
    start() {
      this._addToTagMap();
    }
    onDestroy() {
      this._removeFromTagMap();
    }
    /**
     * Checks if the current object has a specific tag.
     * @param tag - The tag to test.
     * @returns `true` if the object has the specified tag, otherwise `false`.
     */
    hasTag(tag) {
      const tags = this._getAll();
      return tags.includes(tag);
    }
    /**
     * Returns all objects with the given tag.
     * @param tag - The tag to search for.
     * @returns An array of objects with the given tag.
     */
    static getObjectsWithTag(tag) {
      return _Tags._tagMap.get(tag)?.map((entry) => entry.object) ?? [];
    }
    /**
     * Retrieves all tags associated with a given object.
     * @param object - The object to retrieve tags from.
     * @returns An array of tags associated with the object.
     */
    static getTags(object) {
      const tags = object.getComponent(_Tags);
      if (tags) {
        return tags._getAll();
      }
      return [];
    }
    /**
     * Checks if a given object has a specific tag.
     * @param object - The object to check.
     * @param tag - The tag to test.
     * @returns `true` if the object has the specified tag, otherwise `false`.
     */
    static hasTag(object, tag) {
      const tags = object.getComponent(_Tags);
      if (tags) {
        return tags.hasTag(tag);
      }
      return false;
    }
    /**
     * Retrieves the first tag for a given object.
     * @param object - The object to retrieve the first tag from.
     * @returns The first tag of the object, or an empty string if no tags are found.
     */
    static getFirst(object) {
      const tags = object.getComponent(_Tags);
      if (tags) {
        return tags._getAll()[0];
      }
      return "";
    }
    /**
     * Sets the tag on an object, overwriting any existing tags.
     * If the object does not have a Tags component, one will be added.
     * @param object - The object to set the tag on.
     * @param tag - The tag to set.
     */
    static setTag(object, tag) {
      let tags = object.getComponent(_Tags);
      if (!tags) {
        tags = object.addComponent(_Tags, {
          tags: tag
        });
        return;
      }
      tags._updateTags(tag);
    }
    /**
     * Retrieves all tags of the current object.
     * @returns An array of tags.
     * @private
     */
    _getAll() {
      return this.tags.split(/\W+/g).filter(Boolean);
    }
    /**
     * Adds the current object to the tag map.
     * @private
     */
    _addToTagMap() {
      const tags = this._getAll();
      tags.forEach((tag) => {
        if (!_Tags._tagMap.has(tag)) {
          _Tags._tagMap.set(tag, []);
        }
        _Tags._tagMap.get(tag).push(this);
      });
    }
    /**
     * Removes the current object from the tag map.
     * @private
     */
    _removeFromTagMap() {
      const tags = this._getAll();
      tags.forEach((tag) => {
        const list = _Tags._tagMap.get(tag);
        if (list) {
          const index = list.indexOf(this);
          if (index > -1) {
            list.splice(index, 1);
          }
          if (list.length === 0) {
            _Tags._tagMap.delete(tag);
          }
        }
      });
    }
    /**
     * Updates the tags of the current object and modifies the tag map.
     * @param newTags - The new tags to set.
     * @private
     */
    _updateTags(newTags) {
      this._removeFromTagMap();
      this.tags = newTags;
      this._addToTagMap();
    }
  };
  var Tags = _Tags;
  __publicField(Tags, "TypeName", "tags");
  __publicField(Tags, "_tagMap", /* @__PURE__ */ new Map());
  __decorate25([
    property.string()
  ], Tags.prototype, "tags", void 0);

  // node_modules/@sorskoot/wonderland-components/dist/utils/wlUtils.js
  function cloneObject(engine, object, cache) {
    if (!object || !object.parent) {
      console.log("can't clone undefined object");
      return;
    }
    return object.clone(object.parent);
  }
  function findChild(object, childName) {
    return object.children.filter((o) => o.name == childName)[0];
  }
  function replaceAt(string, index, replacement) {
    return string.slice(0, index) + replacement + string.slice(index + replacement.length);
  }
  function findComponentInParents(typeOrClass, object) {
    const component = object.getComponent(typeOrClass);
    if (component) {
      return component;
    }
    if (object.parent == null) {
      return null;
    }
    return findComponentInParents(typeOrClass, object.parent);
  }
  function getComponentsOfType(object, type) {
    return object.getComponents().filter((c) => c instanceof type);
  }
  function getComponentOfType(object, type) {
    return getComponentsOfType(object, type)[0];
  }
  function getComponentsOfTypeRecursive(object, type) {
    const result = [];
    const components = object.getComponents().filter((c) => c instanceof type);
    result.push(...components);
    for (const child of object.children) {
      result.push(...getComponentsOfTypeRecursive(child, type));
    }
    return result;
  }
  function setActive(object, active) {
    object.active = active;
    object.getComponents().forEach((c) => c.active = active);
    object.children.forEach((c) => setActive(c, active));
  }
  function destroyWithDelay(object, delay) {
    setTimeout(() => {
      if (object) {
        if (object.isDestroyed) {
          return;
        }
        object.destroy();
      }
    }, delay);
  }
  function hasComponent(object, type) {
    if (object instanceof Component3) {
      object = object.object;
    }
    return object.getComponents().some((c) => c instanceof type);
  }
  function sendMessage(object, methodName, value, requireReceiver = true) {
    let isCalled = false;
    const components = object.getComponents(Component3);
    for (const component of components) {
      if (component.active) {
        const method = component[methodName];
        if (method && typeof method === "function") {
          method.call(component, value);
          isCalled = true;
        }
      }
    }
    if (requireReceiver && !isCalled) {
      console.warn(`No receiver found for message '${methodName}' on object '${object.name}'`);
    }
  }
  var wlUtils = {
    cloneObject,
    findChild,
    replaceAt,
    findComponentInParents,
    setActive,
    getComponentOfType,
    getComponentsOfType,
    getComponentsOfTypeRecursive,
    destroyWithDelay,
    hasComponent,
    sendMessage
  };

  // node_modules/@sorskoot/wonderland-components/dist/components/fade-to-black.js
  var __decorate26 = function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d2;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if (d2 = decorators[i])
          r = (c < 3 ? d2(r) : c > 3 ? d2(target, key, r) : d2(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  var TransitionType;
  (function(TransitionType2) {
    TransitionType2[TransitionType2["FadeToBlack"] = 0] = "FadeToBlack";
    TransitionType2[TransitionType2["FadeFromBlack"] = 1] = "FadeFromBlack";
    TransitionType2[TransitionType2["None"] = 2] = "None";
  })(TransitionType || (TransitionType = {}));
  var FadeToBlack = class extends Component3 {
    /**
     * The object that will be faded
     */
    fadeObject;
    /**
     * Time in seconds for the fade transition
     */
    fadeTransitionTime = 0.5;
    /**
     * Color to fade to/from [r, g, b, a]
     */
    fadeColor = [0, 0, 0, 1];
    /** Current transition state */
    _transitionInProgress = TransitionType.None;
    /** Material used for fading */
    _fadeMaterial;
    /** Current alpha value */
    _alphaValue = 1;
    /** Promise resolver function */
    _resolve = () => {
    };
    /**
     * Initialize the component
     */
    init() {
      wlUtils.setActive(this.object, false);
      this.object.resetPosition();
    }
    /**
     * Validate required properties and setup component
     */
    start() {
      if (!this.fadeObject) {
        throw new Error("fade-to-black: fadeObject is required");
      }
      if (this.fadeTransitionTime <= 0) {
        throw new Error("fade-to-black: fadeTransitionTime must be greater than 0");
      }
      const meshComponent = this.fadeObject.getComponent(MeshComponent);
      if (!meshComponent) {
        throw new Error("fade-to-black: fadeObject must have a MeshComponent");
      }
      this._fadeMaterial = meshComponent.material;
      if (!this._fadeMaterial) {
        throw new Error("fade-to-black: fadeObject must have a FlatOpaque material");
      }
    }
    /**
     * Begin fade to black transition
     * @returns Promise that resolves when fade is complete
     */
    fadeToBlack() {
      return this._startTransition(TransitionType.FadeToBlack, 0);
    }
    /**
     * Begin fade from black transition
     * @returns Promise that resolves when fade is complete
     */
    fadeFromBlack() {
      return this._startTransition(TransitionType.FadeFromBlack, 1);
    }
    /**
     * Start a transition with the specified type and initial alpha
     * @param type Type of transition to start
     * @param initialAlpha Initial alpha value
     * @returns Promise that resolves when transition is complete
     */
    _startTransition(type, initialAlpha) {
      this._transitionInProgress = type;
      this._setObjectsActive();
      this._alphaValue = initialAlpha;
      this._fadeMaterial.setColor(this.fadeColor);
      return new Promise((resolve) => this._resolve = resolve);
    }
    /**
     * Set objects active based on current transition state
     */
    _setObjectsActive() {
      wlUtils.setActive(this.object, true);
      if (this._transitionInProgress === TransitionType.FadeToBlack || this._transitionInProgress === TransitionType.FadeFromBlack) {
        wlUtils.setActive(this.fadeObject, true);
      }
    }
    /**
     * Update the component each frame
     * @param dt Delta time since last frame
     */
    update(dt) {
      if (this._transitionInProgress === TransitionType.None) {
        return;
      }
      if (this._transitionInProgress === TransitionType.FadeToBlack) {
        this._alphaValue += dt / this.fadeTransitionTime;
        if (this._alphaValue >= 1) {
          this._alphaValue = 1;
          this._transitionInProgress = TransitionType.None;
          this._resolve();
        }
      } else if (this._transitionInProgress === TransitionType.FadeFromBlack) {
        this._alphaValue -= dt / this.fadeTransitionTime;
        if (this._alphaValue <= 0) {
          this._alphaValue = 0;
          wlUtils.setActive(this.object, false);
          this._transitionInProgress = TransitionType.None;
          this._resolve();
        }
      }
      this._updateMaterialColor();
    }
    /**
     * Updates the material color with the current alpha value
     */
    _updateMaterialColor() {
      this._fadeMaterial.setColor([
        this.fadeColor[0],
        this.fadeColor[1],
        this.fadeColor[2],
        this._alphaValue
      ]);
    }
  };
  /** Component registration name in Wonderland Engine */
  __publicField(FadeToBlack, "TypeName", "fade-to-black");
  __decorate26([
    property.object({ required: true })
  ], FadeToBlack.prototype, "fadeObject", void 0);
  __decorate26([
    property.float(0.5)
  ], FadeToBlack.prototype, "fadeTransitionTime", void 0);
  __decorate26([
    property.color(0, 0, 0, 1)
  ], FadeToBlack.prototype, "fadeColor", void 0);

  // node_modules/@sorskoot/wonderland-components/dist/components/teleport-controller.js
  var __decorate27 = function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d2;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if (d2 = decorators[i])
          r = (c < 3 ? d2(r) : c > 3 ? d2(target, key, r) : d2(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  var _TeleportController = class extends Component3 {
    static get instance() {
      return _TeleportController._instance;
    }
    init() {
      if (_TeleportController._instance) {
        console.error("There can only be one instance of Teleport Component");
      }
      _TeleportController._instance = this;
    }
    /**
     * Left eye for use in VR
     */
    eyeLeft;
    /**
     * Right eye for use in VR
     */
    eyeRight;
    /**
     * Non-vr camera for use outside of VR
     */
    nonVrCamera;
    /**
     * Root of the player, the object that will be positioned on teleportation.
     * In a default project setup this is 'Player'.
     */
    playerRoot;
    _tempVec = new Float32Array(3);
    _tempVec0 = new Float32Array(3);
    start() {
      if (!this.eyeLeft || !this.eyeRight || !this.nonVrCamera || !this.playerRoot) {
        throw new Error("teleport-controller: All properties must be properly assigned before using the component.");
      }
    }
    /**
     * Moves the player to a new position.
     * @param newPosition - The new position to teleport the player to.
     */
    moveToPosition(newPosition) {
      this._teleportPlayer(newPosition);
    }
    _teleportPlayer(newPosition) {
      const p2 = this._tempVec;
      const p1 = this._tempVec0;
      this.eyeLeft.getPositionWorld(p2);
      this.eyeRight.getPositionWorld(p1);
      vec3_exports.add(p2, p2, p1);
      vec3_exports.scale(p2, p2, 0.5);
      this.playerRoot.getPositionWorld(p1);
      vec3_exports.sub(p2, p1, p2);
      p2[0] += newPosition[0];
      p2[1] = newPosition[1];
      p2[2] += newPosition[2];
      this.playerRoot.setPositionWorld(p2);
    }
    _rotatePlayer(rotationToAdd) {
      this.playerRoot.resetRotation();
      this.playerRoot.rotateAxisAngleDegObject([0, 1, 0], rotationToAdd);
    }
  };
  var TeleportController = _TeleportController;
  __publicField(TeleportController, "TypeName", "teleport-controller");
  __publicField(TeleportController, "_instance");
  __decorate27([
    property.object()
  ], TeleportController.prototype, "eyeLeft", void 0);
  __decorate27([
    property.object()
  ], TeleportController.prototype, "eyeRight", void 0);
  __decorate27([
    property.object()
  ], TeleportController.prototype, "nonVrCamera", void 0);
  __decorate27([
    property.object()
  ], TeleportController.prototype, "playerRoot", void 0);

  // node_modules/@sorskoot/wonderland-components/dist/components/die-after-time.js
  var __decorate28 = function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d2;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if (d2 = decorators[i])
          r = (c < 3 ? d2(r) : c > 3 ? d2(target, key, r) : d2(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  var DieAfterTime = class extends Component3 {
    lifeTime = 1;
    _time = 0;
    init() {
      this.active = false;
    }
    start() {
    }
    update(dt) {
      this._time += dt;
      if (!this.object.isDestroyed && this._time > this.lifeTime) {
        this.object.destroy();
      }
    }
  };
  __publicField(DieAfterTime, "TypeName", "die-after-time");
  __decorate28([
    property.float(1)
  ], DieAfterTime.prototype, "lifeTime", void 0);

  // node_modules/@sorskoot/wonderland-components/dist/components/self-destruct.js
  var __decorate29 = function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d2;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if (d2 = decorators[i])
          r = (c < 3 ? d2(r) : c > 3 ? d2(target, key, r) : d2(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  var SelfDestruct = class extends Component3 {
    /**
     * Time in seconds after which the object will be destroyed
     */
    lifeTime = 1;
    /** Tracks elapsed time since component activation */
    _time = 0;
    /**
     * Validates component properties on start
     */
    start() {
      if (this.lifeTime <= 0) {
        throw new Error("self-destruct: lifeTime must be greater than 0");
      }
    }
    /**
     * Updates elapsed time and destroys object when lifetime is reached
     * @param dt Delta time in seconds
     */
    update(dt) {
      this._time += dt;
      if (!this.object.isDestroyed && this._time > this.lifeTime) {
        this.object.destroy();
      }
    }
  };
  __publicField(SelfDestruct, "TypeName", "self-destruct");
  __decorate29([
    property.float(1)
  ], SelfDestruct.prototype, "lifeTime", void 0);

  // node_modules/@sorskoot/wonderland-components/dist/components/start-stop-animation-on-activate.js
  var StartStopAnimationOnActivate = class extends Component3 {
    onActivate() {
      const animationC = this.object.getComponent(AnimationComponent);
      if (animationC) {
        animationC.play();
      }
    }
    onDeactivate() {
      const animationC = this.object.getComponent(AnimationComponent);
      if (animationC) {
        animationC.stop();
      }
    }
  };
  __publicField(StartStopAnimationOnActivate, "TypeName", "start-stop-animation-on-activate");

  // node_modules/@sorskoot/wonderland-components/dist/components/abstract/prefab-base.js
  var _PrefabsBase = class extends Component3 {
    /**
     * Gets the singleton instance of PrefabsBase
     */
    static get instance() {
      return _PrefabsBase._instance;
    }
    /**
     * Reference to the root object containing all prefabs
     */
    _prefabs;
    /**
     * Gets the root object containing all prefabs
     */
    get prefabs() {
      return this._prefabs;
    }
    /**
     * Event emitter that notifies when prefabs are loaded
     */
    onPrefabsLoaded = new RetainEmitter();
    _isLoaded = false;
    /**
     * Gets whether the prefabs have been loaded
     */
    get isLoaded() {
      return this._isLoaded;
    }
    /**
     * Initializes the component and sets the singleton instance
     */
    init() {
      _PrefabsBase._instance = this;
    }
    /**
     * Loads the prefabs bin file and initializes the prefabs
     */
    async start() {
      const prefabData = await this.engine.loadPrefab(this.PrefabBinName());
      const result = this.engine.scene.instantiate(prefabData);
      this._prefabs = result.root;
      this._prefabs.parent = this.object;
      wlUtils.setActive(this._prefabs, false);
      this._isLoaded = true;
      setTimeout(() => this.onPrefabsLoaded.notify(this._prefabs), 0);
    }
    /**
     * Spawns an object with the given name
     * @param name Name of the prefab to spawn
     * @param parent Optional parent object of the spawned object
     * @param startActive Optional boolean to set the active state of the spawned object; default is true
     * @returns The spawned object or null if spawn failed
     */
    spawn(name, parent = null, startActive = true) {
      if (!this._prefabs) {
        console.warn(`Spawning Failed. Prefabs not loaded`);
        return null;
      }
      const prefab = this._prefabs.findByName(name)[0];
      if (!prefab) {
        console.warn(`Spawning Failed. Prefab with name ${name} not found`);
        return null;
      }
      const clonedPrefab = prefab.clone(parent);
      if (startActive) {
        wlUtils.setActive(clonedPrefab, true);
      }
      clonedPrefab.resetPositionRotation();
      return clonedPrefab;
    }
  };
  var PrefabsBase = _PrefabsBase;
  __publicField(PrefabsBase, "TypeName", "prefabs-base");
  // Singleton
  __publicField(PrefabsBase, "_instance");

  // node_modules/@sorskoot/wonderland-components/dist/utils/lerp.js
  var Easing = {
    /**
     * Linear easing function.
     * @param t A value between 0 and 1 representing the progress of the animation.
     * @returns The same value as `t`, providing a linear progression.
     */
    Linear: (t) => t,
    /**
     * Quadratic ease-in function.
     * @param t A value between 0 and 1 representing the progress of the animation.
     * @returns A value representing an accelerated (quadratic) progression from 0 to 1.
     */
    InQuad: (t) => t * t,
    /**
     * Quadratic ease-out function.
     * @param t A value between 0 and 1 representing the progress of the animation.
     * @returns A value representing a decelerated (quadratic) progression from 0 to 1.
     */
    OutQuad: (t) => 1 - (1 - t) * (1 - t),
    /**
     * Quadratic ease-in-out function.
     * @param t A value between 0 and 1 representing the progress of the animation.
     * @returns A value that accelerates in, then decelerates out, providing a smooth transition between motion states.
     */
    InOutQuad: (t) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
    /**
     * Cubic ease-in function.
     * @param t A value between 0 and 1 representing the progress of the animation.
     * @returns A value representing an accelerated (cubic) progression from 0 to 1.
     */
    InCubic: (t) => Math.pow(t, 3),
    /**
     * Cubic ease-out function.
     * @param t A value between 0 and 1 representing the progress of the animation.
     * @returns A value representing an decelerated (cubic) progression from 0 to 1.
     */
    OutCubic: (t) => Math.pow(t - 1, 3) + 1,
    /**
     * Cubic ease-in-out function.
     * @param t A value between 0 and 1 representing the progress of the animation.
     * @returns A value that accelerates in, then decelerates out, providing a smooth transition between motion states.
     */
    InOutCubic: (t) => {
      if (t < 0.5) {
        return Math.pow(2 * t, 3) / 2;
      } else {
        return (Math.pow(2 * t - 2, 3) + 2) / 2;
      }
    },
    /**
     * Hermite easing function.
     * @param t A value between 0 and 1 representing the progress of the animation.
     * @returns A value that is a smooth, S-shaped curve that smoothly interpolates between 0 and 1.
     */
    Hermite: (t) => t * t * (3 - 2 * t),
    /**
     * Custom bezier curve type function.
     * @param t A value between 0 and 1 representing the progress of the animation.
     * @returns A value that starts fast, then slows down, then speeds up again.
     */
    BumpEasing: (t) => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
  };
  function lerp6(start, end, t, easing = Easing.Linear) {
    if (typeof easing === "function") {
      easing = getEasingFunction(easing);
    }
    return start * (1 - easing(t)) + end * easing(t);
  }
  function lerpVec3(out, start, end, t, easing = Easing.Linear) {
    if (typeof easing === "function") {
      easing = getEasingFunction(easing);
    }
    for (let i = 0; i < 3; i++) {
      out[i] = start[i] * (1 - easing(t)) + end[i] * easing(t);
    }
    return out;
  }
  function lerpArr(out, start, end, t, easing = Easing.Linear) {
    if (typeof easing === "function") {
      easing = getEasingFunction(easing);
    }
    for (let i = 0; i < start.length; i++) {
      out[i] = start[i] * (1 - easing(t)) + end[i] * easing(t);
    }
    return out;
  }
  function getEasingFunction(type) {
    return typeof type === "function" ? type : Easing.Linear;
  }

  // node_modules/@sorskoot/wonderland-components/dist/components/simple-animations/simple-animation-base.js
  var __decorate30 = function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d2;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if (d2 = decorators[i])
          r = (c < 3 ? d2(r) : c > 3 ? d2(target, key, r) : d2(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  var SimpleAnimationLerpType;
  (function(SimpleAnimationLerpType2) {
    SimpleAnimationLerpType2[SimpleAnimationLerpType2["Linear"] = 0] = "Linear";
    SimpleAnimationLerpType2[SimpleAnimationLerpType2["EaseIn"] = 1] = "EaseIn";
    SimpleAnimationLerpType2[SimpleAnimationLerpType2["EaseOut"] = 2] = "EaseOut";
    SimpleAnimationLerpType2[SimpleAnimationLerpType2["EaseInOut"] = 3] = "EaseInOut";
  })(SimpleAnimationLerpType || (SimpleAnimationLerpType = {}));
  var SimpleAnimationStyle;
  (function(SimpleAnimationStyle2) {
    SimpleAnimationStyle2[SimpleAnimationStyle2["Once"] = 0] = "Once";
    SimpleAnimationStyle2[SimpleAnimationStyle2["Loop"] = 1] = "Loop";
    SimpleAnimationStyle2[SimpleAnimationStyle2["PingPong"] = 2] = "PingPong";
  })(SimpleAnimationStyle || (SimpleAnimationStyle = {}));
  var SimpleAnimationBase = class extends Component3 {
    /**
     * Duration of the animation in seconds
     */
    duration = 1;
    /**
     * The easing method to use for the animation
     */
    method;
    /**
     * The animation style (once, loop, ping-pong)
     */
    style;
    /**
     * Delay in seconds before the animation starts
     */
    startDelay = 0;
    /**
     * Whether the animation should start automatically when the component activates
     */
    autoStart = true;
    /**
     * Time elapsed since the animation started
     * @private
     */
    _elapsedTime = 0;
    /**
     * Current normalized lerp value (0-1)
     * @private
     */
    _lerpValue = 0;
    /**
     * Whether the animation is currently active
     * @private
     */
    _isLerping = false;
    /**
     * Direction of the animation (1 = forward, -1 = backward)
     * @private
     */
    _direction = 1;
    /**
     * Whether the animation is currently delayed
     * @private
     */
    _isDelayed = false;
    /**
     * Current delay time counter
     * @private
     */
    _delayTimer = 0;
    /**
     * Optional callback function that will be called when the animation completes
     * @private
     */
    _onComplete;
    /**
     * Called when the component is started.
     * Initializes and activates the animation if autoStart is true.
     */
    start() {
      if (this.autoStart) {
        this.startLerp();
      }
    }
    /**
     * Called when the component is activated
     */
    onActivate() {
    }
    /**
     * Called when the component is deactivated
     */
    onDeactivate() {
    }
    /**
     * Update method called every frame.
     * Handles the animation timing and calls onLerpUpdate with the current lerp value.
     *
     * @param deltaTime - Time in seconds since the last frame
     */
    update(deltaTime) {
      if (!this._isLerping) {
        return;
      }
      if (this._isDelayed) {
        this._delayTimer += deltaTime;
        if (this._delayTimer >= this.startDelay) {
          this._isDelayed = false;
        }
        return;
      }
      this._elapsedTime += deltaTime * this._direction;
      this._lerpValue = this._elapsedTime / this.duration;
      if (this._lerpValue >= 1) {
        switch (this.style) {
          case SimpleAnimationStyle.Loop:
            this._lerpValue = 0;
            this._elapsedTime = 0;
            break;
          case SimpleAnimationStyle.PingPong:
            this._lerpValue = 1;
            this._direction = -1;
            break;
          default:
            this._lerpValue = 1;
            this._isLerping = false;
            this._notifyComplete();
            break;
        }
      } else if (this._lerpValue <= 0) {
        switch (this.style) {
          case SimpleAnimationStyle.PingPong:
            this._lerpValue = 0;
            this._direction = 1;
            break;
          default:
            this._lerpValue = 0;
            this._isLerping = false;
            this._notifyComplete();
            break;
        }
      }
      let easedValue;
      switch (this.method) {
        case SimpleAnimationLerpType.EaseIn:
          easedValue = lerp6(0, 1, this._lerpValue, Easing.InCubic);
          break;
        case SimpleAnimationLerpType.EaseOut:
          easedValue = lerp6(0, 1, this._lerpValue, Easing.OutCubic);
          break;
        case SimpleAnimationLerpType.EaseInOut:
          easedValue = lerp6(0, 1, this._lerpValue, Easing.InOutCubic);
          break;
        case SimpleAnimationLerpType.Linear:
        default:
          easedValue = lerp6(0, 1, this._lerpValue, Easing.Linear);
          break;
      }
      this.onLerpUpdate(easedValue);
    }
    /**
     * Start or restart the animation
     *
     * @param onComplete - Optional callback function that will be called when the animation completes
     * @returns Reference to this component for method chaining
     */
    startLerp(onComplete) {
      this._reset();
      this._isLerping = true;
      this._onComplete = onComplete;
      if (this.startDelay > 0) {
        this._isDelayed = true;
        this._delayTimer = 0;
      }
      return this;
    }
    /**
     * Stop the animation
     *
     * @returns Reference to this component for method chaining
     */
    stopLerp() {
      this._isLerping = false;
      return this;
    }
    /**
     * Reset the animation state
     * @private
     */
    _reset() {
      this._elapsedTime = 0;
      this._lerpValue = 0;
      this._direction = 1;
      this._isLerping = false;
      this._isDelayed = false;
      this._delayTimer = 0;
    }
    /**
     * Notify completion callback if one exists
     * @private
     */
    _notifyComplete() {
      if (this._onComplete) {
        this._onComplete();
      }
    }
    /**
     * Override this method in derived classes to implement specific animation behavior
     *
     * @param lerpValue - Current animation value (0-1) with easing applied
     * @protected
     */
    onLerpUpdate(lerpValue) {
    }
  };
  __publicField(SimpleAnimationBase, "TypeName", "simple-animation-base");
  __decorate30([
    property.float(1)
  ], SimpleAnimationBase.prototype, "duration", void 0);
  __decorate30([
    property.enum(Object.keys(SimpleAnimationLerpType).filter((e) => isNaN(Number(e))))
  ], SimpleAnimationBase.prototype, "method", void 0);
  __decorate30([
    property.enum(Object.keys(SimpleAnimationStyle).filter((e) => isNaN(Number(e))))
  ], SimpleAnimationBase.prototype, "style", void 0);
  __decorate30([
    property.float(0)
  ], SimpleAnimationBase.prototype, "startDelay", void 0);
  __decorate30([
    property.bool(true)
  ], SimpleAnimationBase.prototype, "autoStart", void 0);

  // node_modules/@sorskoot/wonderland-components/dist/components/simple-animations/tween-position-animation.js
  var __decorate31 = function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d2;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if (d2 = decorators[i])
          r = (c < 3 ? d2(r) : c > 3 ? d2(target, key, r) : d2(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  var tempVec34 = vec3_exports.create();
  var TweenPositionAnimation = class extends SimpleAnimationBase {
    /**
     * Starting position offset relative to the object's initial position
     */
    from = [0, 0, 0];
    /**
     * Ending position offset relative to the object's initial position
     */
    to = [0, 0, 0];
    /**
     * The object's initial position when animation starts
     * @private
     */
    _startPosition = vec3_exports.create();
    /**
     * Initialize the component, capturing the object's initial position
     */
    start() {
      super.start();
      this.object.getPositionLocal(this._startPosition);
    }
    /**
     * Called by SimpleAnimationBase with the current animation progress value
     * Calculates and applies the interpolated position based on the animation progress
     *
     * @param value - Current animation value (0-1) with easing applied
     * @protected
     */
    onLerpUpdate(value) {
      for (let i = 0; i < 3; i++) {
        tempVec34[i] = this._startPosition[i] + this.from[i] * (1 - value) + this.to[i] * value;
      }
      this.object.setPositionLocal(tempVec34);
    }
  };
  __publicField(TweenPositionAnimation, "TypeName", "tween-position-animation");
  __publicField(TweenPositionAnimation, "InheritProperties", true);
  __decorate31([
    property.vector3(0, 0, 0)
  ], TweenPositionAnimation.prototype, "from", void 0);
  __decorate31([
    property.vector3(0, 0, 0)
  ], TweenPositionAnimation.prototype, "to", void 0);

  // node_modules/@sorskoot/wonderland-components/dist/components/simple-animations/tween-scale-animation.js
  var __decorate32 = function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d2;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if (d2 = decorators[i])
          r = (c < 3 ? d2(r) : c > 3 ? d2(target, key, r) : d2(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  var tempVec35 = vec3_exports.create();
  var TweenScaleAnimation = class extends SimpleAnimationBase {
    /**
     * Starting scale factor relative to the object's initial scale
     */
    from = [1, 1, 1];
    /**
     * Ending scale factor relative to the object's initial scale
     */
    to = [1, 1, 1];
    /**
     * The object's initial scale when animation starts
     * @private
     */
    _startScale = vec3_exports.create();
    /**
     * Initialize the component, capturing the object's initial scale
     */
    start() {
      super.start();
      this.object.getScalingLocal(this._startScale);
    }
    /**
     * Called by SimpleAnimationBase with the current animation progress value
     * Calculates and applies the interpolated scale based on the animation progress
     *
     * @param value - Current animation value (0-1) with easing applied
     * @protected
     */
    onLerpUpdate(value) {
      for (let i = 0; i < 3; i++) {
        tempVec35[i] = this._startScale[i] * ((1 - value) * this.from[i] + value * this.to[i]);
      }
      this.object.setScalingLocal(tempVec35);
    }
  };
  __publicField(TweenScaleAnimation, "TypeName", "tween-scale-animation");
  __publicField(TweenScaleAnimation, "InheritProperties", true);
  __decorate32([
    property.vector3(1, 1, 1)
  ], TweenScaleAnimation.prototype, "from", void 0);
  __decorate32([
    property.vector3(1, 1, 1)
  ], TweenScaleAnimation.prototype, "to", void 0);

  // node_modules/@sorskoot/wonderland-components/dist/components/input/InputManager.js
  var KeyEventType;
  (function(KeyEventType2) {
    KeyEventType2[KeyEventType2["Triggered"] = 0] = "Triggered";
    KeyEventType2[KeyEventType2["Pressed"] = 1] = "Pressed";
    KeyEventType2[KeyEventType2["Released"] = 2] = "Released";
    KeyEventType2[KeyEventType2["None"] = 3] = "None";
  })(KeyEventType || (KeyEventType = {}));
  var KeyType;
  (function(KeyType2) {
    KeyType2[KeyType2["Nothing"] = 0] = "Nothing";
    KeyType2[KeyType2["Button1"] = 1] = "Button1";
    KeyType2[KeyType2["Button2"] = 2] = "Button2";
    KeyType2[KeyType2["Left"] = 3] = "Left";
    KeyType2[KeyType2["Right"] = 4] = "Right";
    KeyType2[KeyType2["Up"] = 5] = "Up";
    KeyType2[KeyType2["Down"] = 6] = "Down";
    KeyType2[KeyType2["Pause"] = 7] = "Pause";
    KeyType2[KeyType2["Back"] = 8] = "Back";
    KeyType2[KeyType2["Menu1"] = 9] = "Menu1";
    KeyType2[KeyType2["Menu2"] = 10] = "Menu2";
    KeyType2[KeyType2["Menu3"] = 11] = "Menu3";
    KeyType2[KeyType2["Menu4"] = 12] = "Menu4";
    KeyType2[KeyType2["Menu5"] = 13] = "Menu5";
  })(KeyType || (KeyType = {}));
  var _InputManager = class {
    /**
     * Gets the singleton instance of InputManager
     */
    static get instance() {
      return _InputManager._instance ?? (_InputManager._instance = new _InputManager());
    }
    _lastTouch = {
      position: vec2_exports.create(),
      type: KeyEventType.None
    };
    _keyStatus = /* @__PURE__ */ new Map();
    /**
     * Private constructor to enforce singleton pattern
     */
    constructor() {
      this._reset();
    }
    /**
     * Checks if a key is currently pressed
     * @param keyType The type of key to check
     * @returns True if the key is pressed, false otherwise
     */
    static getKey(keyType) {
      return _InputManager.instance.getKeyStatus(keyType) === KeyEventType.Pressed;
    }
    /**
     * Records a touch event with position and type
     * @param position The position of the touch [x, y]
     * @param type The type of touch event
     */
    recordTouch(position, type) {
      vec2_exports.set(this._lastTouch.position, position[0], position[1]);
      this._lastTouch.type = type;
    }
    /**
     * Gets the position of a touch point
     * @param pointerIndex The index of the pointer to get position for
     * @returns The position as a vec2
     */
    getTouchPoint(pointerIndex) {
      return this._lastTouch.position;
    }
    /**
     * Checks if a touch is currently pressed
     * @param pointerIndex The index of the pointer to check
     * @returns True if the touch is pressed, false otherwise
     */
    getTouchPressed(pointerIndex) {
      return this._lastTouch.type === KeyEventType.Pressed;
    }
    /**
     * Checks if a touch was just triggered
     * @param pointerIndex The index of the pointer to check
     * @returns True if the touch was triggered, false otherwise
     */
    getTouchTriggered(pointerIndex) {
      return this._lastTouch.type === KeyEventType.Triggered;
    }
    /**
     * Checks if a touch was just released
     * @param pointerIndex The index of the pointer to check
     * @returns True if the touch was released, false otherwise
     */
    getTouchReleased(pointerIndex) {
      return this._lastTouch.type === KeyEventType.Released;
    }
    /**
     * Gets the current status of a key
     * @param action The key type to check
     * @returns The current event type for the key
     */
    getKeyStatus(action) {
      return this._keyStatus.get(action);
    }
    /**
     * Records a key event
     * @param key The key that was acted upon
     * @param event The type of event that occurred
     */
    recordKey(key, event) {
      if (event !== KeyEventType.None) {
        this._keyStatus.set(key, event);
      }
    }
    /**
     * Resets all key statuses to None
     */
    _reset() {
      for (let key in KeyType) {
        if (isNaN(Number(key))) {
          this._keyStatus.set(KeyType[key], KeyEventType.None);
        }
      }
    }
  };
  var InputManager = _InputManager;
  __publicField(InputManager, "_instance");

  // node_modules/@sorskoot/wonderland-components/dist/components/input/keyboard-controller.js
  var _KeyboardController = class extends Component3 {
    /**
     * Gets the singleton instance of KeyboardController
     * @throws Error if the instance hasn't been initialized yet
     */
    static get instance() {
      if (!_KeyboardController._instance) {
        throw new Error("KeyboardController: Instance not yet initialized. Make sure the component is active in your scene.");
      }
      return _KeyboardController._instance;
    }
    _inputManager;
    _upCodes = ["KeyW", "ArrowUp", "Numpad8"];
    _downCodes = ["KeyS", "ArrowDown", "Numpad2"];
    _leftCodes = ["KeyA", "ArrowLeft", "Numpad4"];
    _rightCodes = ["KeyD", "ArrowRight", "Numpad6"];
    _spaceCodes = ["Space"];
    _escapeCodes = ["Escape"];
    _keyboardMap = /* @__PURE__ */ new Map([
      [KeyType.Up, this._upCodes],
      [KeyType.Down, this._downCodes],
      [KeyType.Left, this._leftCodes],
      [KeyType.Right, this._rightCodes],
      [KeyType.Button1, this._spaceCodes],
      [KeyType.Back, this._escapeCodes]
    ]);
    _pressedKeys = {};
    /**
     * Initialize the component and setup the singleton instance
     */
    init() {
      if (_KeyboardController._instance) {
        throw new Error("KeyboardController: There can only be one instance of KeyboardController Component");
      }
      _KeyboardController._instance = this;
    }
    /**
     * Start the component and get reference to the InputManager
     * @throws Error if InputManager instance cannot be found
     */
    start() {
      try {
        this._inputManager = InputManager.instance;
      } catch (error) {
        throw new Error("KeyboardController: Failed to get InputManager instance. Make sure InputManager is active in your scene.");
      }
    }
    /**
     * Process the keyboard states each frame and update the InputManager.
     * Implements the state machine for key presses:
     * Pressed -> Down -> StayDown (stays in this state until released)
     * Up -> None (key is removed from tracking)
     *
     * @param delta Time since last frame in seconds
     */
    update(delta) {
      const toBeDeleted = [];
      for (const key in this._pressedKeys) {
        if (this._pressedKeys.hasOwnProperty(key)) {
          const keyType = Number(key);
          const keyState = this._pressedKeys[keyType];
          if (keyState === _KeyboardController.KeyPressState.Pressed) {
            this._inputManager.recordKey(keyType, KeyEventType.Triggered);
            this._pressedKeys[keyType] = _KeyboardController.KeyPressState.Down;
          } else if (keyState === _KeyboardController.KeyPressState.Down) {
            this._inputManager.recordKey(keyType, KeyEventType.Pressed);
            this._pressedKeys[keyType] = _KeyboardController.KeyPressState.StayDown;
          } else if (keyState === _KeyboardController.KeyPressState.Up) {
            this._inputManager.recordKey(keyType, KeyEventType.Released);
            toBeDeleted.push(keyType);
            this._pressedKeys[keyType] = _KeyboardController.KeyPressState.None;
          }
        }
      }
      toBeDeleted.forEach((keyType) => {
        delete this._pressedKeys[keyType];
      });
    }
    /**
     * Register event listeners when component is activated
     */
    onActivate() {
      window.addEventListener("keydown", this._onKeyDown);
      window.addEventListener("keyup", this._onKeyUp);
    }
    /**
     * Remove event listeners when component is deactivated
     */
    onDeactivate() {
      window.removeEventListener("keydown", this._onKeyDown);
      window.removeEventListener("keyup", this._onKeyUp);
    }
    /**
     * Maps a keyboard code to the corresponding input type
     * @param code The keyboard code to check
     * @returns The corresponding KeyType or undefined if not mapped
     */
    _getTypeFromCode(code) {
      for (const [type, codes] of this._keyboardMap) {
        if (codes.includes(code)) {
          return type;
        }
      }
      return void 0;
    }
    /**
     * Event handler for keydown events
     * @param event The keyboard event
     */
    _onKeyDown = (event) => {
      const keyType = this._getTypeFromCode(event.code);
      if (keyType === void 0 || this._pressedKeys[keyType]) {
        return;
      }
      this._pressedKeys[keyType] = _KeyboardController.KeyPressState.Pressed;
    };
    /**
     * Event handler for keyup events
     * @param event The keyboard event
     */
    _onKeyUp = (event) => {
      const keyType = this._getTypeFromCode(event.code);
      if (keyType !== void 0 && this._pressedKeys[keyType] && this._pressedKeys[keyType] !== _KeyboardController.KeyPressState.Up) {
        this._pressedKeys[keyType] = _KeyboardController.KeyPressState.Up;
      }
    };
    /**
     * Clean up when component is destroyed
     */
    onDestroy() {
      if (_KeyboardController._instance === this) {
        _KeyboardController._instance = null;
      }
    }
  };
  var KeyboardController = _KeyboardController;
  __publicField(KeyboardController, "TypeName", "keyboard-controller");
  // Singleton instance
  __publicField(KeyboardController, "_instance", null);
  (function(KeyboardController2) {
    let KeyPressState;
    (function(KeyPressState2) {
      KeyPressState2[KeyPressState2["None"] = 0] = "None";
      KeyPressState2[KeyPressState2["Pressed"] = 1] = "Pressed";
      KeyPressState2[KeyPressState2["Down"] = 2] = "Down";
      KeyPressState2[KeyPressState2["StayDown"] = 3] = "StayDown";
      KeyPressState2[KeyPressState2["Up"] = 4] = "Up";
    })(KeyPressState = KeyboardController2.KeyPressState || (KeyboardController2.KeyPressState = {}));
  })(KeyboardController || (KeyboardController = {}));

  // node_modules/@sorskoot/wonderland-components/dist/components/timer-controller.js
  var _TimerController = class extends Component3 {
    // The time in seconds since the first update.
    _gameTime = 0;
    _schedules = /* @__PURE__ */ new Map();
    _scheduleId = 0;
    _lastSyncSysClock = 0;
    _tickLength = 0;
    _ticksPerSecond = 20;
    // Default value
    renderPartialTicks = 0;
    elapsedPartialTicks = 0;
    static get instance() {
      return _TimerController._instance;
    }
    init() {
      if (_TimerController._instance) {
        console.error("There can only be one instance of TimerController Component");
      }
      _TimerController._instance = this;
      this._tickLength = 1 / this._ticksPerSecond;
      this._lastSyncSysClock = this._gameTime;
    }
    start() {
    }
    update(dt) {
      this._gameTime += dt;
      if (this._schedules.size > 0) {
        const toRemove = [];
        this._schedules.forEach((schedule, id) => {
          if (this._gameTime >= schedule.trigger) {
            schedule.callback();
            toRemove.push(id);
          }
        });
        toRemove.forEach((id) => {
          this._schedules.delete(id);
        });
      }
    }
    /**
     * Schedules a callback to be called after a delay.
     */
    schedule(callback, delay) {
      const id = this._scheduleId++;
      this._schedules.set(id, {
        callback,
        trigger: this._gameTime + delay
      });
      return id;
    }
    /**
     * Unschedules a callback by its id.
     */
    unschedule(id) {
      return this._schedules.delete(id);
    }
    /**
     * Sets the number of ticks per second.
     */
    setTicksPerSecond(ticks) {
      this._ticksPerSecond = ticks;
      this._tickLength = 1 / ticks;
    }
    /**
     * Calculates and returns the number of whole ticks that have elapsed.
     * Updates partial tick tracking for smooth animations.
     *
     * @returns Number of whole ticks that have elapsed
     */
    getPartialTicks() {
      this.elapsedPartialTicks = (this._gameTime - this._lastSyncSysClock) / this._tickLength;
      this._lastSyncSysClock = this._gameTime;
      this.renderPartialTicks += this.elapsedPartialTicks;
      const i = Math.floor(this.renderPartialTicks);
      this.renderPartialTicks -= i;
      return i;
    }
  };
  var TimerController = _TimerController;
  __publicField(TimerController, "TypeName", "timer-controller");
  // Singleton
  __publicField(TimerController, "_instance");

  // node_modules/@sorskoot/wonderland-components/dist/utils/rng.js
  var FRAC = 23283064365386963e-26;
  var RNG = class {
    _seed = 0;
    _s0 = 0;
    _s1 = 0;
    _s2 = 0;
    _c = 0;
    getSeed() {
      return this._seed;
    }
    /**
     * Seed the number generator
     * @type {number} seed - Seed value
     */
    setSeed(seed2) {
      seed2 = seed2 < 1 ? 1 / seed2 : seed2;
      this._seed = seed2;
      this._s0 = (seed2 >>> 0) * FRAC;
      seed2 = seed2 * 69069 + 1 >>> 0;
      this._s1 = seed2 * FRAC;
      seed2 = seed2 * 69069 + 1 >>> 0;
      this._s2 = seed2 * FRAC;
      this._c = 1;
      return this;
    }
    /**
     * @returns Pseudorandom value [0,1), uniformly distributed
     */
    getUniform() {
      let t = 2091639 * this._s0 + this._c * FRAC;
      this._s0 = this._s1;
      this._s1 = this._s2;
      this._c = t | 0;
      this._s2 = t - this._c;
      return this._s2;
    }
    /**
     * @param {number} lowerBound The lower end of the range to return a value from, inclusive
     * @param {number} upperBound The upper end of the range to return a value from, inclusive
     * @returns Pseudorandom value [lowerBound, upperBound], using ROT.RNG.getUniform() to distribute the value
     */
    getUniformInt(lowerBound, upperBound) {
      let max3 = Math.max(lowerBound, upperBound);
      let min3 = Math.min(lowerBound, upperBound);
      return Math.floor(this.getUniform() * (max3 - min3 + 1)) + min3;
    }
    /**
     * @param mean Mean value
     * @param stddev Standard deviation. ~95% of the absolute values will be lower than 2*stddev.
     * @returns A normally distributed pseudorandom value
     */
    getNormal(mean = 0, stddev = 1) {
      let u, v2, r;
      do {
        u = 2 * this.getUniform() - 1;
        v2 = 2 * this.getUniform() - 1;
        r = u * u + v2 * v2;
      } while (r > 1 || r == 0);
      let gauss = u * Math.sqrt(-2 * Math.log(r) / r);
      return mean + gauss * stddev;
    }
    /**
     * @returns Pseudorandom value [1,100] inclusive, uniformly distributed
     */
    getPercentage() {
      return 1 + Math.floor(this.getUniform() * 100);
    }
    /**
     * @param {Array} array Array to pick a random item from
     * @returns Randomly picked item, null when length=0
     */
    getItem(array) {
      if (!array.length) {
        return null;
      }
      return array[Math.floor(this.getUniform() * array.length)];
    }
    /**
     * Gets random unique items from an array
     * @param array the array to get items from
     * @param amount the amount of items to get
     * @returns the random item; null if the array is empty
     */
    getItems(array, amount) {
      if (!array.length) {
        return [];
      }
      if (amount > array.length) {
        amount = array.length;
      }
      const result = /* @__PURE__ */ new Set();
      while (result.size < amount) {
        result.add(array[Math.floor(this.getUniform() * array.length)]);
      }
      return Array.from(result);
    }
    /**
     * @param {Array} array Array to randomize
     * @returns New array with randomized items
     */
    shuffle(array) {
      let result = [];
      let clone7 = array.slice();
      while (clone7.length) {
        let index = clone7.indexOf(this.getItem(clone7));
        result.push(clone7.splice(index, 1)[0]);
      }
      return result;
    }
    /**
     * @param {Object} data key = whatever, value=weight (relative probability)
     * @returns whatever
     */
    getWeightedValue(data) {
      let total = 0;
      for (let id2 in data) {
        total += data[id2];
      }
      let random4 = this.getUniform() * total;
      let id, part = 0;
      for (id in data) {
        part += data[id];
        if (random4 < part) {
          return id;
        }
      }
      return id;
    }
    /**
     * Get RNG state. Useful for storing the state and re-setting it via setState.
     * @returns Internal state
     */
    getState() {
      return [this._s0, this._s1, this._s2, this._c];
    }
    randomNonRepeatingValues(min3, max3, valueCount) {
      const count = max3 - min3;
      const values = new Array(count);
      for (let x2 = 0; x2 < count; x2++) {
        values[x2] = x2 + min3;
      }
      this.shuffleArray(values);
      let results = [];
      for (let x2 = 0; x2 < valueCount && x2 < values.length; x2++) {
        results.push(values[x2]);
      }
      return results;
    }
    shuffleArray(array) {
      for (let x2 = array.length - 1; x2 >= 0; x2--) {
        let index = this.getUniformInt(0, x2);
        const temp = array[x2];
        array[x2] = array[index];
        array[index] = temp;
      }
    }
    /**
     * Set a previously retrieved state.
     */
    setState(state) {
      this._s0 = state[0];
      this._s1 = state[1];
      this._s2 = state[2];
      this._c = state[3];
      return this;
    }
    /**
     * Returns a cloned RNG
     */
    clone() {
      let clone7 = new RNG();
      return clone7.setState(this.getState());
    }
  };
  var rng = new RNG().setSeed(Date.now());

  // node_modules/@sorskoot/wonderland-components/dist/utils/ObjectCache.js
  var ObjectCache = class {
    #objects;
    engine;
    name;
    cacheSize;
    index;
    /**
     *
     * @param {WonderlandEngine} engine
     * @param {string} name
     * @param {number} cacheSize
     * @param {Object3D} parent
     * @param {number} components
     */
    constructor(engine, name, cacheSize, parent, components) {
      this.engine = engine;
      this.name = name;
      console.log(`creating cache: ${name} with ${cacheSize} elements`);
      this.cacheSize = cacheSize;
      this.#objects = this.engine.scene.addObjects(cacheSize, parent, components);
      this.index = 0;
    }
    reset() {
      this.index = 0;
      this.#objects.forEach((obj) => {
        obj.getComponents().forEach((c) => {
          c.active = false;
        });
        obj.parent = null;
        obj.resetPositionRotation();
      });
    }
    getItem() {
      if (this.index >= this.cacheSize) {
        console.warn(`Cache ${this.name} ran out of space`);
        return;
      }
      let obj = this.#objects[this.index];
      this.index++;
      return obj;
    }
  };

  // node_modules/@sorskoot/wonderland-components/dist/utils/queue.js
  var Queue = class {
    items = [];
    enqueue(item) {
      this.items.push(item);
    }
    dequeue() {
      return this.items.shift();
    }
    isEmpty() {
      return this.items.length === 0;
    }
  };

  // node_modules/@sorskoot/wonderland-components/dist/utils/rngWithWeight.js
  function rngWithWeight(array, itemsWithWeights) {
    let totalWeight = itemsWithWeights.reduce((total, itemWithWeight) => {
      return total + itemWithWeight;
    }, 0);
    let randomValue = rng.getUniformInt(0, totalWeight);
    for (let i = 0; i < itemsWithWeights.length; i++) {
      randomValue -= itemsWithWeights[i];
      if (randomValue <= 0) {
        return array[i];
      }
    }
    return null;
  }

  // node_modules/@sorskoot/wonderland-components/dist/utils/MeshUtils.js
  var MeshUtils = class {
    // no need to create an instance of this class
    constructor() {
    }
    static createPlane(meshBuilder, width = 1, height = width) {
      const vertexCount = 4;
      const indexData = new Uint16Array([0, 1, 2, 1, 3, 2]);
      const mesh = meshBuilder.create({
        indexData,
        vertexCount,
        indexType: MeshIndexType.UnsignedInt
      });
      const positions = mesh.attribute(MeshAttribute.Position);
      if (positions) {
        positions.set(0, [-0.5 * width, -0.5 * height, 0]);
        positions.set(1, [0.5 * width, -0.5 * height, 0]);
        positions.set(2, [-0.5 * width, 0.5 * height, 0]);
        positions.set(3, [0.5 * width, 0.5 * height, 0]);
      }
      const texCoords = mesh.attribute(MeshAttribute.TextureCoordinate);
      if (texCoords) {
        texCoords.set(0, [0, 0]);
        texCoords.set(1, [1, 0]);
        texCoords.set(2, [0, 1]);
        texCoords.set(3, [1, 1]);
      }
      const normals = mesh.attribute(MeshAttribute.Normal);
      if (normals) {
        normals.set(0, [0, 0, 1]);
        normals.set(1, [0, 0, 1]);
        normals.set(2, [0, 0, 1]);
        normals.set(3, [0, 0, 1]);
      }
      const vcs = mesh.attribute(MeshAttribute.Color);
      if (vcs) {
        vcs.set(0, [1, 0, 0, 1]);
        vcs.set(1, [0, 1, 0, 1]);
        vcs.set(2, [0, 0, 1, 0]);
        vcs.set(3, [1, 0, 1, 0]);
      }
      mesh.update();
      return mesh;
    }
    static createBox(meshBuilder, width = 1, height = width, depth = width) {
      const vertexCount = 8;
      const indexData = new Uint16Array([
        0,
        2,
        1,
        //face front
        0,
        3,
        2,
        2,
        3,
        4,
        //face top
        2,
        4,
        5,
        1,
        2,
        5,
        //face right
        1,
        5,
        6,
        0,
        7,
        4,
        //face left
        0,
        4,
        3,
        5,
        4,
        7,
        //face back
        5,
        7,
        6,
        0,
        6,
        7,
        //face bottom 
        0,
        1,
        6
      ]);
      const mesh = meshBuilder.create({
        indexData,
        vertexCount,
        indexType: MeshIndexType.UnsignedInt
      });
      const positions = mesh.attribute(MeshAttribute.Position);
      if (positions) {
        positions.set(0, [-0.5 * width, -0.5 * height, -0.5 * depth]);
        positions.set(1, [0.5 * width, -0.5 * height, -0.5 * depth]);
        positions.set(2, [0.5 * width, 0.5 * height, -0.5 * depth]);
        positions.set(3, [-0.5 * width, 0.5 * height, -0.5 * depth]);
        positions.set(4, [-0.5 * width, 0.5 * height, 0.5 * depth]);
        positions.set(5, [0.5 * width, 0.5 * height, 0.5 * depth]);
        positions.set(6, [0.5 * width, -0.5 * height, 0.5 * depth]);
        positions.set(7, [-0.5 * width, -0.5 * height, 0.5 * depth]);
      }
      return mesh;
    }
  };

  // node_modules/@sorskoot/wonderland-components/dist/utils/sorskootLogger.js
  var SorskootLogger = class {
    debugFlagPresent = false;
    badges;
    constructor(badge = void 0, color = "#e92a7d") {
      if (typeof DEBUG !== "undefined") {
        this.debugFlagPresent = true;
      }
      if (false) {
        this.debugFlagPresent = true;
      }
      var r = "border-radius: 8px; padding: 2px 4px; color: white;";
      const defaultBadge = ["%cSORSKOOT", "background-color: #e92a7d; ".concat(r)];
      if (badge) {
        this.badges = [
          `${defaultBadge[0]}%c %c${badge}`,
          defaultBadge[1],
          "",
          `background-color: ${color};`.concat(r)
        ];
        console.dir(this.badges);
      } else {
        this.badges = defaultBadge;
      }
    }
    log(message, ...args) {
      if (!this.debugFlagPresent)
        return;
      console.log.apply(console, [...this.badges, message, ...args]);
    }
  };

  // node_modules/@sorskoot/wonderland-components/dist/utils/Mathf.js
  var AxisX = vec3_exports.fromValues(1, 0, 0);
  var AxisY = vec3_exports.fromValues(0, 1, 0);
  var AxisZ = vec3_exports.fromValues(0, 0, 1);
  var AxisNegZ = vec3_exports.fromValues(0, 0, -1);
  var Vec3Zero = vec3_exports.fromValues(0, 0, 0);
  var Vec3One = vec3_exports.fromValues(1, 1, 1);
  var Rad2Deg2 = 57.29577951;
  var Deg2Rad = 0.017453292;
  function repeat(t, length6) {
    return clamp2(t - Math.floor(t / length6) * length6, 0, length6);
  }
  function fract(value) {
    return value - (value << 0);
  }
  function clamp2(value, min3, max3) {
    return Math.min(Math.max(value, min3), max3);
  }
  function approximately(a, b2) {
    return Math.abs(b2 - a) < Math.max(1e-6 * Math.max(Math.abs(a), Math.abs(b2)), Number.EPSILON * 8);
  }
  var Mathf = {
    Rad2Deg: Rad2Deg2,
    Deg2Rad,
    repeat,
    clamp: clamp2,
    approximately,
    fract
  };

  // node_modules/@sorskoot/wonderland-components/dist/utils/MathFx.js
  function sinerp(start, end, value) {
    return lerp6(start, end, Math.sin(value * Math.PI * 0.5));
  }
  function directionalAngleDelta(first, second, forward) {
    const firstClamped = Mathf.repeat(first, 360);
    const secondClamped = Mathf.repeat(second, 360);
    let forwardDistance = secondClamped - firstClamped;
    let reverseDistance = firstClamped + 360 - secondClamped;
    if (secondClamped < firstClamped) {
      reverseDistance = firstClamped - secondClamped;
      forwardDistance = secondClamped + 360 - firstClamped;
    }
    return forward ? forwardDistance : reverseDistance;
  }
  function moveTowardsAngleDirection(current, target, maxDelta, forward) {
    const currentClamped = Mathf.repeat(current, 360);
    const targetClamped = Mathf.repeat(target, 360);
    let result = currentClamped;
    if (forward) {
      if (currentClamped < targetClamped) {
        if (currentClamped + maxDelta >= targetClamped) {
          result = targetClamped;
        } else {
          result = currentClamped + maxDelta;
        }
      } else {
        if (currentClamped + maxDelta < 360) {
          result = currentClamped + maxDelta;
        } else {
          const wrapped = Mathf.repeat(currentClamped + maxDelta, 360);
          if (wrapped < targetClamped) {
            result = wrapped;
          } else {
            result = targetClamped;
          }
        }
      }
    } else {
      if (currentClamped > targetClamped) {
        if (currentClamped - maxDelta <= targetClamped) {
          result = targetClamped;
        } else {
          result = currentClamped - maxDelta;
        }
      } else {
        if (currentClamped - maxDelta > 0) {
          result = currentClamped - maxDelta;
        } else {
          const wrapped = Mathf.repeat(currentClamped - maxDelta, 360);
          if (wrapped > targetClamped) {
            result = wrapped;
          } else {
            result = targetClamped;
          }
        }
      }
    }
    return result;
  }
  var Mathfx = {
    sinerp,
    directionalAngleDelta,
    moveTowardsAngleDirection
  };

  // node_modules/@sorskoot/wonderland-components/dist/utils/NotifyPropertyChanged.js
  var NotifyPropertyChanged = class {
    propertyChanged = new Emitter();
    notifyPropertyChanged(propertyName, newValue = void 0, oldValue = void 0) {
      this.propertyChanged.notify(propertyName, newValue, oldValue);
    }
  };

  // node_modules/@sorskoot/wonderland-components/dist/utils/Observable.js
  var Observable = class {
    _observers = /* @__PURE__ */ new Set();
    _value;
    get value() {
      return this.getValue();
    }
    set value(newValue) {
      this.setValue(newValue);
    }
    constructor(initialValue) {
      this._value = initialValue;
    }
    subscribe(observer) {
      this._observers.add(observer);
      observer.update(this._value);
      return () => this._observers.delete(observer);
    }
    getValue() {
      return this._value;
    }
    setValue(newValue) {
      this._value = newValue;
      this.notify();
    }
    notify() {
      this._observers.forEach((observer) => observer.update(this._value));
    }
  };

  // node_modules/@sorskoot/wonderland-components/dist/utils/OfflineManager.js
  var _OfflineHelper = class {
    // Emitters to notify when the application goes online or offline
    wentOnline = new Emitter();
    wentOffline = new Emitter();
    /**
     * Returns the single instance of the OfflineHelper.
     * If the instance does not exist, it creates a new one.
     */
    static get instance() {
      if (!_OfflineHelper._instance) {
        _OfflineHelper._instance = new _OfflineHelper();
      }
      return _OfflineHelper._instance;
    }
    // Private constructor to prevent direct instantiation
    constructor() {
      window.addEventListener("online", this._online);
      window.addEventListener("offline", this._offline);
    }
    /**
     * Returns true if the application is offline, false otherwise.
     */
    get isOffline() {
      return !navigator.onLine;
    }
    // Private method to handle the online event
    _online = () => {
      this.wentOnline.notify();
    };
    // Private method to handle the offline event
    _offline = () => {
      this.wentOffline.notify();
    };
  };
  var OfflineHelper = _OfflineHelper;
  // Private static instance of OfflineHelper
  __publicField(OfflineHelper, "_instance");

  // node_modules/@sorskoot/wonderland-components/dist/utils/hapticFeedback.js
  function hapticFeedback(object, strength, duration) {
    const input = object.getComponent("input");
    if (input && input.xrInputSource) {
      const gamepad = input.xrInputSource.gamepad;
      if (gamepad && gamepad.hapticActuators) {
        const hapticActiator = gamepad.hapticActuators[0];
        hapticActiator.pulse(strength, duration);
      }
    }
  }
  function vibrateDevice(amount = 10) {
    if (navigator.userActivation.hasBeenActive) {
      if ("vibrate" in navigator) {
        try {
          navigator.vibrate(amount);
        } catch (e) {
          console.log(e);
        }
      }
    }
  }

  // node_modules/@sorskoot/wonderland-components/dist/utils/misc.js
  function flagBitIsSet(flag, bit) {
    return (flag >> bit & 1) == 1;
  }
  var formatter = new Intl.NumberFormat("en-US", {
    style: "decimal",
    maximumFractionDigits: 0,
    useGrouping: true
  });
  function formatNumber(n) {
    return formatter.format(n);
  }
  function timeSinceEpoch() {
    const timestamp = Math.floor(Date.now() / 1e3);
    return timestamp;
  }
  function moveLastToFirst(arr) {
    if (arr.length === 0)
      return arr;
    const lastElement = arr.pop();
    if (lastElement !== void 0) {
      arr.unshift(lastElement);
    }
    return arr;
  }
  function moveFirstToLast(arr) {
    if (arr.length === 0)
      return arr;
    const firstElement = arr.shift();
    if (firstElement !== void 0) {
      arr.push(firstElement);
    }
    return arr;
  }

  // node_modules/@sorskoot/wonderland-components/dist/utils/mobile.js
  var isMobile = false;

  // node_modules/@sorskoot/wonderland-components/dist/utils/noise.js
  var Grad = class {
    x;
    y;
    z;
    constructor(x2, y2, z2) {
      this.x = x2;
      this.y = y2;
      this.z = z2;
    }
    dot2(x2, y2) {
      return this.x * x2 + this.y * y2;
    }
    dot3(x2, y2, z2) {
      return this.x * x2 + this.y * y2 + this.z * z2;
    }
  };
  var grad3 = [
    new Grad(1, 1, 0),
    new Grad(-1, 1, 0),
    new Grad(1, -1, 0),
    new Grad(-1, -1, 0),
    new Grad(1, 0, 1),
    new Grad(-1, 0, 1),
    new Grad(1, 0, -1),
    new Grad(-1, 0, -1),
    new Grad(0, 1, 1),
    new Grad(0, -1, 1),
    new Grad(0, 1, -1),
    new Grad(0, -1, -1)
  ];
  var p = [
    151,
    160,
    137,
    91,
    90,
    15,
    131,
    13,
    201,
    95,
    96,
    53,
    194,
    233,
    7,
    225,
    140,
    36,
    103,
    30,
    69,
    142,
    8,
    99,
    37,
    240,
    21,
    10,
    23,
    190,
    6,
    148,
    247,
    120,
    234,
    75,
    0,
    26,
    197,
    62,
    94,
    252,
    219,
    203,
    117,
    35,
    11,
    32,
    57,
    177,
    33,
    88,
    237,
    149,
    56,
    87,
    174,
    20,
    125,
    136,
    171,
    168,
    68,
    175,
    74,
    165,
    71,
    134,
    139,
    48,
    27,
    166,
    77,
    146,
    158,
    231,
    83,
    111,
    229,
    122,
    60,
    211,
    133,
    230,
    220,
    105,
    92,
    41,
    55,
    46,
    245,
    40,
    244,
    102,
    143,
    54,
    65,
    25,
    63,
    161,
    1,
    216,
    80,
    73,
    209,
    76,
    132,
    187,
    208,
    89,
    18,
    169,
    200,
    196,
    135,
    130,
    116,
    188,
    159,
    86,
    164,
    100,
    109,
    198,
    173,
    186,
    3,
    64,
    52,
    217,
    226,
    250,
    124,
    123,
    5,
    202,
    38,
    147,
    118,
    126,
    255,
    82,
    85,
    212,
    207,
    206,
    59,
    227,
    47,
    16,
    58,
    17,
    182,
    189,
    28,
    42,
    223,
    183,
    170,
    213,
    119,
    248,
    152,
    2,
    44,
    154,
    163,
    70,
    221,
    153,
    101,
    155,
    167,
    43,
    172,
    9,
    129,
    22,
    39,
    253,
    19,
    98,
    108,
    110,
    79,
    113,
    224,
    232,
    178,
    185,
    112,
    104,
    218,
    246,
    97,
    228,
    251,
    34,
    242,
    193,
    238,
    210,
    144,
    12,
    191,
    179,
    162,
    241,
    81,
    51,
    145,
    235,
    249,
    14,
    239,
    107,
    49,
    192,
    214,
    31,
    181,
    199,
    106,
    157,
    184,
    84,
    204,
    176,
    115,
    121,
    50,
    45,
    127,
    4,
    150,
    254,
    138,
    236,
    205,
    93,
    222,
    114,
    67,
    29,
    24,
    72,
    243,
    141,
    128,
    195,
    78,
    66,
    215,
    61,
    156,
    180
  ];
  var perm = new Array(512);
  var gradP = new Array(512);
  function seed(seed2) {
    if (seed2 > 0 && seed2 < 1) {
      seed2 *= 65536;
    }
    seed2 = Math.floor(seed2);
    if (seed2 < 256) {
      seed2 |= seed2 << 8;
    }
    for (var i = 0; i < 256; i++) {
      var v2;
      if (i & 1) {
        v2 = p[i] ^ seed2 & 255;
      } else {
        v2 = p[i] ^ seed2 >> 8 & 255;
      }
      perm[i] = perm[i + 256] = v2;
      gradP[i] = gradP[i + 256] = grad3[v2 % 12];
    }
  }
  seed(0);
  var F2 = 0.5 * (Math.sqrt(3) - 1);
  var G2 = (3 - Math.sqrt(3)) / 6;
  var F3 = 1 / 3;
  var G3 = 1 / 6;
  function simplex2(xin, yin) {
    var n0, n1, n2;
    var s = (xin + yin) * F2;
    var i = Math.floor(xin + s);
    var j2 = Math.floor(yin + s);
    var t = (i + j2) * G2;
    var x0 = xin - i + t;
    var y0 = yin - j2 + t;
    var i1, j1;
    if (x0 > y0) {
      i1 = 1;
      j1 = 0;
    } else {
      i1 = 0;
      j1 = 1;
    }
    var x1 = x0 - i1 + G2;
    var y1 = y0 - j1 + G2;
    var x2 = x0 - 1 + 2 * G2;
    var y2 = y0 - 1 + 2 * G2;
    i &= 255;
    j2 &= 255;
    var gi0 = gradP[i + perm[j2]];
    var gi1 = gradP[i + i1 + perm[j2 + j1]];
    var gi2 = gradP[i + 1 + perm[j2 + 1]];
    var t0 = 0.5 - x0 * x0 - y0 * y0;
    if (t0 < 0) {
      n0 = 0;
    } else {
      t0 *= t0;
      n0 = t0 * t0 * gi0.dot2(x0, y0);
    }
    var t1 = 0.5 - x1 * x1 - y1 * y1;
    if (t1 < 0) {
      n1 = 0;
    } else {
      t1 *= t1;
      n1 = t1 * t1 * gi1.dot2(x1, y1);
    }
    var t2 = 0.5 - x2 * x2 - y2 * y2;
    if (t2 < 0) {
      n2 = 0;
    } else {
      t2 *= t2;
      n2 = t2 * t2 * gi2.dot2(x2, y2);
    }
    return 70 * (n0 + n1 + n2);
  }
  function simplex3(xin, yin, zin) {
    var n0, n1, n2, n3;
    var s = (xin + yin + zin) * F3;
    var i = Math.floor(xin + s);
    var j2 = Math.floor(yin + s);
    var k = Math.floor(zin + s);
    var t = (i + j2 + k) * G3;
    var x0 = xin - i + t;
    var y0 = yin - j2 + t;
    var z0 = zin - k + t;
    var i1, j1, k1;
    var i2, j22, k2;
    if (x0 >= y0) {
      if (y0 >= z0) {
        i1 = 1;
        j1 = 0;
        k1 = 0;
        i2 = 1;
        j22 = 1;
        k2 = 0;
      } else if (x0 >= z0) {
        i1 = 1;
        j1 = 0;
        k1 = 0;
        i2 = 1;
        j22 = 0;
        k2 = 1;
      } else {
        i1 = 0;
        j1 = 0;
        k1 = 1;
        i2 = 1;
        j22 = 0;
        k2 = 1;
      }
    } else {
      if (y0 < z0) {
        i1 = 0;
        j1 = 0;
        k1 = 1;
        i2 = 0;
        j22 = 1;
        k2 = 1;
      } else if (x0 < z0) {
        i1 = 0;
        j1 = 1;
        k1 = 0;
        i2 = 0;
        j22 = 1;
        k2 = 1;
      } else {
        i1 = 0;
        j1 = 1;
        k1 = 0;
        i2 = 1;
        j22 = 1;
        k2 = 0;
      }
    }
    var x1 = x0 - i1 + G3;
    var y1 = y0 - j1 + G3;
    var z1 = z0 - k1 + G3;
    var x2 = x0 - i2 + 2 * G3;
    var y2 = y0 - j22 + 2 * G3;
    var z2 = z0 - k2 + 2 * G3;
    var x3 = x0 - 1 + 3 * G3;
    var y3 = y0 - 1 + 3 * G3;
    var z3 = z0 - 1 + 3 * G3;
    i &= 255;
    j2 &= 255;
    k &= 255;
    var gi0 = gradP[i + perm[j2 + perm[k]]];
    var gi1 = gradP[i + i1 + perm[j2 + j1 + perm[k + k1]]];
    var gi2 = gradP[i + i2 + perm[j2 + j22 + perm[k + k2]]];
    var gi3 = gradP[i + 1 + perm[j2 + 1 + perm[k + 1]]];
    var t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
    if (t0 < 0) {
      n0 = 0;
    } else {
      t0 *= t0;
      n0 = t0 * t0 * gi0.dot3(x0, y0, z0);
    }
    var t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
    if (t1 < 0) {
      n1 = 0;
    } else {
      t1 *= t1;
      n1 = t1 * t1 * gi1.dot3(x1, y1, z1);
    }
    var t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
    if (t2 < 0) {
      n2 = 0;
    } else {
      t2 *= t2;
      n2 = t2 * t2 * gi2.dot3(x2, y2, z2);
    }
    var t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
    if (t3 < 0) {
      n3 = 0;
    } else {
      t3 *= t3;
      n3 = t3 * t3 * gi3.dot3(x3, y3, z3);
    }
    return 32 * (n0 + n1 + n2 + n3);
  }
  function fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }
  function lerp7(a, b2, t) {
    return (1 - t) * a + t * b2;
  }
  function perlin2(x2, y2) {
    var X2 = Math.floor(x2), Y2 = Math.floor(y2);
    x2 = x2 - X2;
    y2 = y2 - Y2;
    X2 = X2 & 255;
    Y2 = Y2 & 255;
    var n00 = gradP[X2 + perm[Y2]].dot2(x2, y2);
    var n01 = gradP[X2 + perm[Y2 + 1]].dot2(x2, y2 - 1);
    var n10 = gradP[X2 + 1 + perm[Y2]].dot2(x2 - 1, y2);
    var n11 = gradP[X2 + 1 + perm[Y2 + 1]].dot2(x2 - 1, y2 - 1);
    var u = fade(x2);
    return lerp7(lerp7(n00, n10, u), lerp7(n01, n11, u), fade(y2));
  }
  function perlin3(x2, y2, z2) {
    var X2 = Math.floor(x2), Y2 = Math.floor(y2), Z2 = Math.floor(z2);
    x2 = x2 - X2;
    y2 = y2 - Y2;
    z2 = z2 - Z2;
    X2 = X2 & 255;
    Y2 = Y2 & 255;
    Z2 = Z2 & 255;
    var n000 = gradP[X2 + perm[Y2 + perm[Z2]]].dot3(x2, y2, z2);
    var n001 = gradP[X2 + perm[Y2 + perm[Z2 + 1]]].dot3(x2, y2, z2 - 1);
    var n010 = gradP[X2 + perm[Y2 + 1 + perm[Z2]]].dot3(x2, y2 - 1, z2);
    var n011 = gradP[X2 + perm[Y2 + 1 + perm[Z2 + 1]]].dot3(x2, y2 - 1, z2 - 1);
    var n100 = gradP[X2 + 1 + perm[Y2 + perm[Z2]]].dot3(x2 - 1, y2, z2);
    var n101 = gradP[X2 + 1 + perm[Y2 + perm[Z2 + 1]]].dot3(x2 - 1, y2, z2 - 1);
    var n110 = gradP[X2 + 1 + perm[Y2 + 1 + perm[Z2]]].dot3(x2 - 1, y2 - 1, z2);
    var n111 = gradP[X2 + 1 + perm[Y2 + 1 + perm[Z2 + 1]]].dot3(x2 - 1, y2 - 1, z2 - 1);
    var u = fade(x2);
    var v2 = fade(y2);
    var w = fade(z2);
    return lerp7(lerp7(lerp7(n000, n100, u), lerp7(n001, n101, u), w), lerp7(lerp7(n010, n110, u), lerp7(n011, n111, u), w), v2);
  }
  var Noise = {
    simplex2,
    simplex3,
    perlin2,
    perlin3,
    seed
  };

  // node_modules/@sorskoot/wonderland-components/dist/utils/Assert.js
  var Assert = class {
    /**
     * Asserts that a value is a string.
     * @param value - The value to check
     * @throws Error if the value is not a string
     */
    static isString(value) {
      if (typeof value !== "string") {
        throw new Error("Value must be a string");
      }
    }
    /**
     * Asserts that a value is a number.
     * @param value - The value to check
     * @throws Error if the value is not a number
     */
    static isNumber(value) {
      if (typeof value !== "number") {
        throw new Error("Value must be a number");
      }
    }
    /**
     * Asserts that an object has a specific key.
     * @param obj - The object to check
     * @param key - The key to verify exists on the object
     * @throws Error if the key does not exist on the object
     */
    static hasKey(obj, key) {
      if (!(key in obj)) {
        throw new Error(`Property ${String(key)} is missing`);
      }
    }
    /**
     * Asserts that a value is not null or undefined.
     * @param value - The value to check
     * @throws Error if the value is null or undefined
     */
    static isNotNull(value) {
      if (value == null) {
        throw new Error("Value cannot be null or undefined");
      }
    }
    /**
     * Asserts that a value is a boolean.
     * @param value - The value to check
     * @throws Error if the value is not a boolean
     */
    static isBoolean(value) {
      if (typeof value !== "boolean") {
        throw new Error("Value must be a boolean");
      }
    }
    /**
     * Asserts that a value is an array.
     * @param value - The value to check
     * @throws Error if the value is not an array
     */
    static isArray(value) {
      if (!Array.isArray(value)) {
        throw new Error("Value must be an array");
      }
    }
    /**
     * Asserts that a value is an object (not null, not an array).
     * @param value - The value to check
     * @throws Error if the value is not an object
     */
    static isObject(value) {
      if (typeof value !== "object" || value === null || Array.isArray(value)) {
        throw new Error("Value must be an object");
      }
    }
    /**
     * Asserts that a value is a function.
     * @param value - The value to check
     * @throws Error if the value is not a function
     */
    static isFunction(value) {
      if (typeof value !== "function") {
        throw new Error("Value must be a function");
      }
    }
    /**
     * Asserts that a value is an instance of a specific class.
     * @param value - The value to check
     * @param constructor - The constructor to check against
     * @throws Error if the value is not an instance of the specified class
     */
    static isInstanceOf(value, constructor) {
      if (!(value instanceof constructor)) {
        throw new Error(`Value must be an instance of ${constructor.name}`);
      }
    }
  };

  // node_modules/@sorskoot/wonderland-components/dist/utils/Signal.js
  var STOP_PROPAGATION = "stop_propagation";
  var Signal = class {
    _receivers = [];
    _modifyCount = 0;
    /**
     * Adds a new signal listener
     * @param receiver - The function to call when the signal is dispatched
     * @param scope - The scope to apply when calling the receiver
     */
    add(receiver, scope) {
      Assert.isNotNull(receiver);
      this._receivers.push({ receiver, scope });
      ++this._modifyCount;
    }
    /**
     * Adds a new signal listener to the top of the stack
     * @param receiver - The function to call when the signal is dispatched
     * @param scope - The scope to apply when calling the receiver
     */
    addToTop(receiver, scope) {
      Assert.isNotNull(receiver);
      this._receivers.unshift({ receiver, scope });
      ++this._modifyCount;
    }
    /**
     * Dispatches the signal to all receivers
     * @param payload - Arguments to pass to the receivers
     * @returns STOP_PROPAGATION if propagation was stopped, void otherwise
     */
    dispatch(...payload) {
      const modifyState = this._modifyCount;
      const n = this._receivers.length;
      for (let i = 0; i < n; ++i) {
        const { receiver, scope } = this._receivers[i];
        if (receiver.apply(scope, payload) === STOP_PROPAGATION) {
          return STOP_PROPAGATION;
        }
        if (modifyState !== this._modifyCount) {
          return STOP_PROPAGATION;
        }
      }
    }
    /**
     * Removes a specific receiver
     * @param receiver - The receiver to remove
     */
    remove(receiver) {
      let index = null;
      const n = this._receivers.length;
      for (let i = 0; i < n; ++i) {
        if (this._receivers[i].receiver === receiver) {
          index = i;
          break;
        }
      }
      if (index === null) {
        throw new Error("Receiver not found in list");
      }
      this._receivers.splice(index, 1);
      ++this._modifyCount;
    }
    /**
     * Removes all receivers
     */
    removeAll() {
      this._receivers = [];
      ++this._modifyCount;
    }
  };

  // node_modules/@sorskoot/wonderland-components/dist/utils/MaterialPool.js
  var _MaterialPool = class {
    _materials = /* @__PURE__ */ new Map();
    constructor() {
    }
    /**
     * Returns the singleton instance of MaterialPool
     */
    static get instance() {
      if (!_MaterialPool._instance) {
        _MaterialPool._instance = new _MaterialPool();
      }
      return _MaterialPool._instance;
    }
    /**
     * Gets a material from the pool or creates and stores it if it doesn't exist
     *
     * @param name - Unique identifier for the material
     * @param createMaterial - Function that creates the material if it doesn't exist in the pool
     * @returns The requested material
     */
    getOrSetMaterial(name, createMaterial) {
      if (!this._materials.has(name)) {
        const material = createMaterial();
        this._materials.set(name, material);
      }
      return this._materials.get(name);
    }
  };
  var MaterialPool = _MaterialPool;
  __publicField(MaterialPool, "_instance");

  // node_modules/@sorskoot/wonderland-components/dist/coroutines/Coroutine.js
  var Coroutine = class {
    generator;
    constructor(generator) {
      this.generator = generator;
    }
    update(deltaTime) {
      const result = this.generator.next(deltaTime);
      if (result.done) {
        return false;
      }
      return true;
    }
  };

  // node_modules/@sorskoot/wonderland-components/dist/coroutines/CoroutineManager.js
  var CoroutineManager = class {
    coroutines = /* @__PURE__ */ new Map();
    nextId = 0;
    addCoroutine(coroutine) {
      const id = this.nextId++;
      this.coroutines.set(id, coroutine);
      return id;
    }
    stopCoroutine(id) {
      this.coroutines.delete(id);
    }
    update(deltaTime) {
      for (const [id, coroutine] of this.coroutines.entries()) {
        if (!coroutine.update(deltaTime)) {
          this.coroutines.delete(id);
        }
      }
    }
  };

  // node_modules/@sorskoot/wonderland-components/dist/coroutines/YieldInstructions.js
  function* waitForSeconds(seconds) {
    let elapsedTime = 0;
    while (elapsedTime < seconds) {
      const deltaTime = yield;
      elapsedTime += deltaTime;
    }
  }
  function* waitForCondition(conditionFn) {
    while (!conditionFn()) {
      yield;
    }
  }
  function* waitForPromise(promise) {
    let isResolved = false;
    let result;
    let error;
    promise.then((res) => {
      isResolved = true;
      result = res;
    }, (err) => {
      isResolved = true;
      error = err;
    });
    while (!isResolved) {
      yield;
    }
    if (error) {
      throw error;
    }
    return result;
  }

  // js/classes/game-state.ts
  var game_state_exports = {};
  __export(game_state_exports, {
    Sounds: () => Sounds,
    State: () => State,
    gameState: () => gameState
  });

  // node_modules/tslib/tslib.es6.mjs
  var extendStatics = function(d2, b2) {
    extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d3, b3) {
      d3.__proto__ = b3;
    } || function(d3, b3) {
      for (var p2 in b3)
        if (Object.prototype.hasOwnProperty.call(b3, p2))
          d3[p2] = b3[p2];
    };
    return extendStatics(d2, b2);
  };
  function __extends(d2, b2) {
    if (typeof b2 !== "function" && b2 !== null)
      throw new TypeError("Class extends value " + String(b2) + " is not a constructor or null");
    extendStatics(d2, b2);
    function __() {
      this.constructor = d2;
    }
    d2.prototype = b2 === null ? Object.create(b2) : (__.prototype = b2.prototype, new __());
  }
  function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m2 = s && o[s], i = 0;
    if (m2)
      return m2.call(o);
    if (o && typeof o.length === "number")
      return {
        next: function() {
          if (o && i >= o.length)
            o = void 0;
          return { value: o && o[i++], done: !o };
        }
      };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
  }
  function __read(o, n) {
    var m2 = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m2)
      return o;
    var i = m2.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
        ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m2 = i["return"]))
          m2.call(i);
      } finally {
        if (e)
          throw e.error;
      }
    }
    return ar;
  }
  function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar)
            ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  }

  // node_modules/rxjs/dist/esm5/internal/util/isFunction.js
  function isFunction(value) {
    return typeof value === "function";
  }

  // node_modules/rxjs/dist/esm5/internal/util/createErrorClass.js
  function createErrorClass(createImpl) {
    var _super = function(instance) {
      Error.call(instance);
      instance.stack = new Error().stack;
    };
    var ctorFunc = createImpl(_super);
    ctorFunc.prototype = Object.create(Error.prototype);
    ctorFunc.prototype.constructor = ctorFunc;
    return ctorFunc;
  }

  // node_modules/rxjs/dist/esm5/internal/util/UnsubscriptionError.js
  var UnsubscriptionError = createErrorClass(function(_super) {
    return function UnsubscriptionErrorImpl(errors) {
      _super(this);
      this.message = errors ? errors.length + " errors occurred during unsubscription:\n" + errors.map(function(err, i) {
        return i + 1 + ") " + err.toString();
      }).join("\n  ") : "";
      this.name = "UnsubscriptionError";
      this.errors = errors;
    };
  });

  // node_modules/rxjs/dist/esm5/internal/util/arrRemove.js
  function arrRemove(arr, item) {
    if (arr) {
      var index = arr.indexOf(item);
      0 <= index && arr.splice(index, 1);
    }
  }

  // node_modules/rxjs/dist/esm5/internal/Subscription.js
  var Subscription = function() {
    function Subscription2(initialTeardown) {
      this.initialTeardown = initialTeardown;
      this.closed = false;
      this._parentage = null;
      this._finalizers = null;
    }
    Subscription2.prototype.unsubscribe = function() {
      var e_1, _a12, e_2, _b;
      var errors;
      if (!this.closed) {
        this.closed = true;
        var _parentage = this._parentage;
        if (_parentage) {
          this._parentage = null;
          if (Array.isArray(_parentage)) {
            try {
              for (var _parentage_1 = __values(_parentage), _parentage_1_1 = _parentage_1.next(); !_parentage_1_1.done; _parentage_1_1 = _parentage_1.next()) {
                var parent_1 = _parentage_1_1.value;
                parent_1.remove(this);
              }
            } catch (e_1_1) {
              e_1 = { error: e_1_1 };
            } finally {
              try {
                if (_parentage_1_1 && !_parentage_1_1.done && (_a12 = _parentage_1.return))
                  _a12.call(_parentage_1);
              } finally {
                if (e_1)
                  throw e_1.error;
              }
            }
          } else {
            _parentage.remove(this);
          }
        }
        var initialFinalizer = this.initialTeardown;
        if (isFunction(initialFinalizer)) {
          try {
            initialFinalizer();
          } catch (e) {
            errors = e instanceof UnsubscriptionError ? e.errors : [e];
          }
        }
        var _finalizers = this._finalizers;
        if (_finalizers) {
          this._finalizers = null;
          try {
            for (var _finalizers_1 = __values(_finalizers), _finalizers_1_1 = _finalizers_1.next(); !_finalizers_1_1.done; _finalizers_1_1 = _finalizers_1.next()) {
              var finalizer = _finalizers_1_1.value;
              try {
                execFinalizer(finalizer);
              } catch (err) {
                errors = errors !== null && errors !== void 0 ? errors : [];
                if (err instanceof UnsubscriptionError) {
                  errors = __spreadArray(__spreadArray([], __read(errors)), __read(err.errors));
                } else {
                  errors.push(err);
                }
              }
            }
          } catch (e_2_1) {
            e_2 = { error: e_2_1 };
          } finally {
            try {
              if (_finalizers_1_1 && !_finalizers_1_1.done && (_b = _finalizers_1.return))
                _b.call(_finalizers_1);
            } finally {
              if (e_2)
                throw e_2.error;
            }
          }
        }
        if (errors) {
          throw new UnsubscriptionError(errors);
        }
      }
    };
    Subscription2.prototype.add = function(teardown) {
      var _a12;
      if (teardown && teardown !== this) {
        if (this.closed) {
          execFinalizer(teardown);
        } else {
          if (teardown instanceof Subscription2) {
            if (teardown.closed || teardown._hasParent(this)) {
              return;
            }
            teardown._addParent(this);
          }
          (this._finalizers = (_a12 = this._finalizers) !== null && _a12 !== void 0 ? _a12 : []).push(teardown);
        }
      }
    };
    Subscription2.prototype._hasParent = function(parent) {
      var _parentage = this._parentage;
      return _parentage === parent || Array.isArray(_parentage) && _parentage.includes(parent);
    };
    Subscription2.prototype._addParent = function(parent) {
      var _parentage = this._parentage;
      this._parentage = Array.isArray(_parentage) ? (_parentage.push(parent), _parentage) : _parentage ? [_parentage, parent] : parent;
    };
    Subscription2.prototype._removeParent = function(parent) {
      var _parentage = this._parentage;
      if (_parentage === parent) {
        this._parentage = null;
      } else if (Array.isArray(_parentage)) {
        arrRemove(_parentage, parent);
      }
    };
    Subscription2.prototype.remove = function(teardown) {
      var _finalizers = this._finalizers;
      _finalizers && arrRemove(_finalizers, teardown);
      if (teardown instanceof Subscription2) {
        teardown._removeParent(this);
      }
    };
    Subscription2.EMPTY = function() {
      var empty = new Subscription2();
      empty.closed = true;
      return empty;
    }();
    return Subscription2;
  }();
  var EMPTY_SUBSCRIPTION = Subscription.EMPTY;
  function isSubscription(value) {
    return value instanceof Subscription || value && "closed" in value && isFunction(value.remove) && isFunction(value.add) && isFunction(value.unsubscribe);
  }
  function execFinalizer(finalizer) {
    if (isFunction(finalizer)) {
      finalizer();
    } else {
      finalizer.unsubscribe();
    }
  }

  // node_modules/rxjs/dist/esm5/internal/config.js
  var config = {
    onUnhandledError: null,
    onStoppedNotification: null,
    Promise: void 0,
    useDeprecatedSynchronousErrorHandling: false,
    useDeprecatedNextContext: false
  };

  // node_modules/rxjs/dist/esm5/internal/scheduler/timeoutProvider.js
  var timeoutProvider = {
    setTimeout: function(handler, timeout) {
      var args = [];
      for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
      }
      var delegate = timeoutProvider.delegate;
      if (delegate === null || delegate === void 0 ? void 0 : delegate.setTimeout) {
        return delegate.setTimeout.apply(delegate, __spreadArray([handler, timeout], __read(args)));
      }
      return setTimeout.apply(void 0, __spreadArray([handler, timeout], __read(args)));
    },
    clearTimeout: function(handle) {
      var delegate = timeoutProvider.delegate;
      return ((delegate === null || delegate === void 0 ? void 0 : delegate.clearTimeout) || clearTimeout)(handle);
    },
    delegate: void 0
  };

  // node_modules/rxjs/dist/esm5/internal/util/reportUnhandledError.js
  function reportUnhandledError(err) {
    timeoutProvider.setTimeout(function() {
      var onUnhandledError = config.onUnhandledError;
      if (onUnhandledError) {
        onUnhandledError(err);
      } else {
        throw err;
      }
    });
  }

  // node_modules/rxjs/dist/esm5/internal/util/noop.js
  function noop() {
  }

  // node_modules/rxjs/dist/esm5/internal/NotificationFactories.js
  var COMPLETE_NOTIFICATION = function() {
    return createNotification("C", void 0, void 0);
  }();
  function errorNotification(error) {
    return createNotification("E", void 0, error);
  }
  function nextNotification(value) {
    return createNotification("N", value, void 0);
  }
  function createNotification(kind, value, error) {
    return {
      kind,
      value,
      error
    };
  }

  // node_modules/rxjs/dist/esm5/internal/util/errorContext.js
  var context = null;
  function errorContext(cb) {
    if (config.useDeprecatedSynchronousErrorHandling) {
      var isRoot = !context;
      if (isRoot) {
        context = { errorThrown: false, error: null };
      }
      cb();
      if (isRoot) {
        var _a12 = context, errorThrown = _a12.errorThrown, error = _a12.error;
        context = null;
        if (errorThrown) {
          throw error;
        }
      }
    } else {
      cb();
    }
  }
  function captureError(err) {
    if (config.useDeprecatedSynchronousErrorHandling && context) {
      context.errorThrown = true;
      context.error = err;
    }
  }

  // node_modules/rxjs/dist/esm5/internal/Subscriber.js
  var Subscriber = function(_super) {
    __extends(Subscriber2, _super);
    function Subscriber2(destination) {
      var _this = _super.call(this) || this;
      _this.isStopped = false;
      if (destination) {
        _this.destination = destination;
        if (isSubscription(destination)) {
          destination.add(_this);
        }
      } else {
        _this.destination = EMPTY_OBSERVER;
      }
      return _this;
    }
    Subscriber2.create = function(next, error, complete) {
      return new SafeSubscriber(next, error, complete);
    };
    Subscriber2.prototype.next = function(value) {
      if (this.isStopped) {
        handleStoppedNotification(nextNotification(value), this);
      } else {
        this._next(value);
      }
    };
    Subscriber2.prototype.error = function(err) {
      if (this.isStopped) {
        handleStoppedNotification(errorNotification(err), this);
      } else {
        this.isStopped = true;
        this._error(err);
      }
    };
    Subscriber2.prototype.complete = function() {
      if (this.isStopped) {
        handleStoppedNotification(COMPLETE_NOTIFICATION, this);
      } else {
        this.isStopped = true;
        this._complete();
      }
    };
    Subscriber2.prototype.unsubscribe = function() {
      if (!this.closed) {
        this.isStopped = true;
        _super.prototype.unsubscribe.call(this);
        this.destination = null;
      }
    };
    Subscriber2.prototype._next = function(value) {
      this.destination.next(value);
    };
    Subscriber2.prototype._error = function(err) {
      try {
        this.destination.error(err);
      } finally {
        this.unsubscribe();
      }
    };
    Subscriber2.prototype._complete = function() {
      try {
        this.destination.complete();
      } finally {
        this.unsubscribe();
      }
    };
    return Subscriber2;
  }(Subscription);
  var _bind = Function.prototype.bind;
  function bind(fn, thisArg) {
    return _bind.call(fn, thisArg);
  }
  var ConsumerObserver = function() {
    function ConsumerObserver2(partialObserver) {
      this.partialObserver = partialObserver;
    }
    ConsumerObserver2.prototype.next = function(value) {
      var partialObserver = this.partialObserver;
      if (partialObserver.next) {
        try {
          partialObserver.next(value);
        } catch (error) {
          handleUnhandledError(error);
        }
      }
    };
    ConsumerObserver2.prototype.error = function(err) {
      var partialObserver = this.partialObserver;
      if (partialObserver.error) {
        try {
          partialObserver.error(err);
        } catch (error) {
          handleUnhandledError(error);
        }
      } else {
        handleUnhandledError(err);
      }
    };
    ConsumerObserver2.prototype.complete = function() {
      var partialObserver = this.partialObserver;
      if (partialObserver.complete) {
        try {
          partialObserver.complete();
        } catch (error) {
          handleUnhandledError(error);
        }
      }
    };
    return ConsumerObserver2;
  }();
  var SafeSubscriber = function(_super) {
    __extends(SafeSubscriber2, _super);
    function SafeSubscriber2(observerOrNext, error, complete) {
      var _this = _super.call(this) || this;
      var partialObserver;
      if (isFunction(observerOrNext) || !observerOrNext) {
        partialObserver = {
          next: observerOrNext !== null && observerOrNext !== void 0 ? observerOrNext : void 0,
          error: error !== null && error !== void 0 ? error : void 0,
          complete: complete !== null && complete !== void 0 ? complete : void 0
        };
      } else {
        var context_1;
        if (_this && config.useDeprecatedNextContext) {
          context_1 = Object.create(observerOrNext);
          context_1.unsubscribe = function() {
            return _this.unsubscribe();
          };
          partialObserver = {
            next: observerOrNext.next && bind(observerOrNext.next, context_1),
            error: observerOrNext.error && bind(observerOrNext.error, context_1),
            complete: observerOrNext.complete && bind(observerOrNext.complete, context_1)
          };
        } else {
          partialObserver = observerOrNext;
        }
      }
      _this.destination = new ConsumerObserver(partialObserver);
      return _this;
    }
    return SafeSubscriber2;
  }(Subscriber);
  function handleUnhandledError(error) {
    if (config.useDeprecatedSynchronousErrorHandling) {
      captureError(error);
    } else {
      reportUnhandledError(error);
    }
  }
  function defaultErrorHandler(err) {
    throw err;
  }
  function handleStoppedNotification(notification, subscriber) {
    var onStoppedNotification = config.onStoppedNotification;
    onStoppedNotification && timeoutProvider.setTimeout(function() {
      return onStoppedNotification(notification, subscriber);
    });
  }
  var EMPTY_OBSERVER = {
    closed: true,
    next: noop,
    error: defaultErrorHandler,
    complete: noop
  };

  // node_modules/rxjs/dist/esm5/internal/symbol/observable.js
  var observable = function() {
    return typeof Symbol === "function" && Symbol.observable || "@@observable";
  }();

  // node_modules/rxjs/dist/esm5/internal/util/identity.js
  function identity4(x2) {
    return x2;
  }

  // node_modules/rxjs/dist/esm5/internal/util/pipe.js
  function pipeFromArray(fns) {
    if (fns.length === 0) {
      return identity4;
    }
    if (fns.length === 1) {
      return fns[0];
    }
    return function piped(input) {
      return fns.reduce(function(prev, fn) {
        return fn(prev);
      }, input);
    };
  }

  // node_modules/rxjs/dist/esm5/internal/Observable.js
  var Observable2 = function() {
    function Observable3(subscribe) {
      if (subscribe) {
        this._subscribe = subscribe;
      }
    }
    Observable3.prototype.lift = function(operator) {
      var observable2 = new Observable3();
      observable2.source = this;
      observable2.operator = operator;
      return observable2;
    };
    Observable3.prototype.subscribe = function(observerOrNext, error, complete) {
      var _this = this;
      var subscriber = isSubscriber(observerOrNext) ? observerOrNext : new SafeSubscriber(observerOrNext, error, complete);
      errorContext(function() {
        var _a12 = _this, operator = _a12.operator, source = _a12.source;
        subscriber.add(operator ? operator.call(subscriber, source) : source ? _this._subscribe(subscriber) : _this._trySubscribe(subscriber));
      });
      return subscriber;
    };
    Observable3.prototype._trySubscribe = function(sink) {
      try {
        return this._subscribe(sink);
      } catch (err) {
        sink.error(err);
      }
    };
    Observable3.prototype.forEach = function(next, promiseCtor) {
      var _this = this;
      promiseCtor = getPromiseCtor(promiseCtor);
      return new promiseCtor(function(resolve, reject) {
        var subscriber = new SafeSubscriber({
          next: function(value) {
            try {
              next(value);
            } catch (err) {
              reject(err);
              subscriber.unsubscribe();
            }
          },
          error: reject,
          complete: resolve
        });
        _this.subscribe(subscriber);
      });
    };
    Observable3.prototype._subscribe = function(subscriber) {
      var _a12;
      return (_a12 = this.source) === null || _a12 === void 0 ? void 0 : _a12.subscribe(subscriber);
    };
    Observable3.prototype[observable] = function() {
      return this;
    };
    Observable3.prototype.pipe = function() {
      var operations = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        operations[_i] = arguments[_i];
      }
      return pipeFromArray(operations)(this);
    };
    Observable3.prototype.toPromise = function(promiseCtor) {
      var _this = this;
      promiseCtor = getPromiseCtor(promiseCtor);
      return new promiseCtor(function(resolve, reject) {
        var value;
        _this.subscribe(function(x2) {
          return value = x2;
        }, function(err) {
          return reject(err);
        }, function() {
          return resolve(value);
        });
      });
    };
    Observable3.create = function(subscribe) {
      return new Observable3(subscribe);
    };
    return Observable3;
  }();
  function getPromiseCtor(promiseCtor) {
    var _a12;
    return (_a12 = promiseCtor !== null && promiseCtor !== void 0 ? promiseCtor : config.Promise) !== null && _a12 !== void 0 ? _a12 : Promise;
  }
  function isObserver(value) {
    return value && isFunction(value.next) && isFunction(value.error) && isFunction(value.complete);
  }
  function isSubscriber(value) {
    return value && value instanceof Subscriber || isObserver(value) && isSubscription(value);
  }

  // node_modules/rxjs/dist/esm5/internal/util/lift.js
  function hasLift(source) {
    return isFunction(source === null || source === void 0 ? void 0 : source.lift);
  }
  function operate(init) {
    return function(source) {
      if (hasLift(source)) {
        return source.lift(function(liftedSource) {
          try {
            return init(liftedSource, this);
          } catch (err) {
            this.error(err);
          }
        });
      }
      throw new TypeError("Unable to lift unknown Observable type");
    };
  }

  // node_modules/rxjs/dist/esm5/internal/operators/OperatorSubscriber.js
  function createOperatorSubscriber(destination, onNext, onComplete, onError, onFinalize) {
    return new OperatorSubscriber(destination, onNext, onComplete, onError, onFinalize);
  }
  var OperatorSubscriber = function(_super) {
    __extends(OperatorSubscriber2, _super);
    function OperatorSubscriber2(destination, onNext, onComplete, onError, onFinalize, shouldUnsubscribe) {
      var _this = _super.call(this, destination) || this;
      _this.onFinalize = onFinalize;
      _this.shouldUnsubscribe = shouldUnsubscribe;
      _this._next = onNext ? function(value) {
        try {
          onNext(value);
        } catch (err) {
          destination.error(err);
        }
      } : _super.prototype._next;
      _this._error = onError ? function(err) {
        try {
          onError(err);
        } catch (err2) {
          destination.error(err2);
        } finally {
          this.unsubscribe();
        }
      } : _super.prototype._error;
      _this._complete = onComplete ? function() {
        try {
          onComplete();
        } catch (err) {
          destination.error(err);
        } finally {
          this.unsubscribe();
        }
      } : _super.prototype._complete;
      return _this;
    }
    OperatorSubscriber2.prototype.unsubscribe = function() {
      var _a12;
      if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
        var closed_1 = this.closed;
        _super.prototype.unsubscribe.call(this);
        !closed_1 && ((_a12 = this.onFinalize) === null || _a12 === void 0 ? void 0 : _a12.call(this));
      }
    };
    return OperatorSubscriber2;
  }(Subscriber);

  // node_modules/rxjs/dist/esm5/internal/util/ObjectUnsubscribedError.js
  var ObjectUnsubscribedError = createErrorClass(function(_super) {
    return function ObjectUnsubscribedErrorImpl() {
      _super(this);
      this.name = "ObjectUnsubscribedError";
      this.message = "object unsubscribed";
    };
  });

  // node_modules/rxjs/dist/esm5/internal/Subject.js
  var Subject = function(_super) {
    __extends(Subject2, _super);
    function Subject2() {
      var _this = _super.call(this) || this;
      _this.closed = false;
      _this.currentObservers = null;
      _this.observers = [];
      _this.isStopped = false;
      _this.hasError = false;
      _this.thrownError = null;
      return _this;
    }
    Subject2.prototype.lift = function(operator) {
      var subject = new AnonymousSubject(this, this);
      subject.operator = operator;
      return subject;
    };
    Subject2.prototype._throwIfClosed = function() {
      if (this.closed) {
        throw new ObjectUnsubscribedError();
      }
    };
    Subject2.prototype.next = function(value) {
      var _this = this;
      errorContext(function() {
        var e_1, _a12;
        _this._throwIfClosed();
        if (!_this.isStopped) {
          if (!_this.currentObservers) {
            _this.currentObservers = Array.from(_this.observers);
          }
          try {
            for (var _b = __values(_this.currentObservers), _c = _b.next(); !_c.done; _c = _b.next()) {
              var observer = _c.value;
              observer.next(value);
            }
          } catch (e_1_1) {
            e_1 = { error: e_1_1 };
          } finally {
            try {
              if (_c && !_c.done && (_a12 = _b.return))
                _a12.call(_b);
            } finally {
              if (e_1)
                throw e_1.error;
            }
          }
        }
      });
    };
    Subject2.prototype.error = function(err) {
      var _this = this;
      errorContext(function() {
        _this._throwIfClosed();
        if (!_this.isStopped) {
          _this.hasError = _this.isStopped = true;
          _this.thrownError = err;
          var observers = _this.observers;
          while (observers.length) {
            observers.shift().error(err);
          }
        }
      });
    };
    Subject2.prototype.complete = function() {
      var _this = this;
      errorContext(function() {
        _this._throwIfClosed();
        if (!_this.isStopped) {
          _this.isStopped = true;
          var observers = _this.observers;
          while (observers.length) {
            observers.shift().complete();
          }
        }
      });
    };
    Subject2.prototype.unsubscribe = function() {
      this.isStopped = this.closed = true;
      this.observers = this.currentObservers = null;
    };
    Object.defineProperty(Subject2.prototype, "observed", {
      get: function() {
        var _a12;
        return ((_a12 = this.observers) === null || _a12 === void 0 ? void 0 : _a12.length) > 0;
      },
      enumerable: false,
      configurable: true
    });
    Subject2.prototype._trySubscribe = function(subscriber) {
      this._throwIfClosed();
      return _super.prototype._trySubscribe.call(this, subscriber);
    };
    Subject2.prototype._subscribe = function(subscriber) {
      this._throwIfClosed();
      this._checkFinalizedStatuses(subscriber);
      return this._innerSubscribe(subscriber);
    };
    Subject2.prototype._innerSubscribe = function(subscriber) {
      var _this = this;
      var _a12 = this, hasError = _a12.hasError, isStopped = _a12.isStopped, observers = _a12.observers;
      if (hasError || isStopped) {
        return EMPTY_SUBSCRIPTION;
      }
      this.currentObservers = null;
      observers.push(subscriber);
      return new Subscription(function() {
        _this.currentObservers = null;
        arrRemove(observers, subscriber);
      });
    };
    Subject2.prototype._checkFinalizedStatuses = function(subscriber) {
      var _a12 = this, hasError = _a12.hasError, thrownError = _a12.thrownError, isStopped = _a12.isStopped;
      if (hasError) {
        subscriber.error(thrownError);
      } else if (isStopped) {
        subscriber.complete();
      }
    };
    Subject2.prototype.asObservable = function() {
      var observable2 = new Observable2();
      observable2.source = this;
      return observable2;
    };
    Subject2.create = function(destination, source) {
      return new AnonymousSubject(destination, source);
    };
    return Subject2;
  }(Observable2);
  var AnonymousSubject = function(_super) {
    __extends(AnonymousSubject2, _super);
    function AnonymousSubject2(destination, source) {
      var _this = _super.call(this) || this;
      _this.destination = destination;
      _this.source = source;
      return _this;
    }
    AnonymousSubject2.prototype.next = function(value) {
      var _a12, _b;
      (_b = (_a12 = this.destination) === null || _a12 === void 0 ? void 0 : _a12.next) === null || _b === void 0 ? void 0 : _b.call(_a12, value);
    };
    AnonymousSubject2.prototype.error = function(err) {
      var _a12, _b;
      (_b = (_a12 = this.destination) === null || _a12 === void 0 ? void 0 : _a12.error) === null || _b === void 0 ? void 0 : _b.call(_a12, err);
    };
    AnonymousSubject2.prototype.complete = function() {
      var _a12, _b;
      (_b = (_a12 = this.destination) === null || _a12 === void 0 ? void 0 : _a12.complete) === null || _b === void 0 ? void 0 : _b.call(_a12);
    };
    AnonymousSubject2.prototype._subscribe = function(subscriber) {
      var _a12, _b;
      return (_b = (_a12 = this.source) === null || _a12 === void 0 ? void 0 : _a12.subscribe(subscriber)) !== null && _b !== void 0 ? _b : EMPTY_SUBSCRIPTION;
    };
    return AnonymousSubject2;
  }(Subject);

  // node_modules/rxjs/dist/esm5/internal/operators/filter.js
  function filter(predicate, thisArg) {
    return operate(function(source, subscriber) {
      var index = 0;
      source.subscribe(createOperatorSubscriber(subscriber, function(value) {
        return predicate.call(thisArg, value, index++) && subscriber.next(value);
      }));
    });
  }

  // js/classes/game-state.ts
  var State = /* @__PURE__ */ ((State2) => {
    State2[State2["welcome"] = 0] = "welcome";
    State2[State2["playing"] = 1] = "playing";
    State2[State2["gameOver"] = 2] = "gameOver";
    State2[State2["notInVR"] = 3] = "notInVR";
    return State2;
  })(State || {});
  var Sounds = /* @__PURE__ */ ((Sounds3) => {
    Sounds3[Sounds3["explosion"] = 0] = "explosion";
    Sounds3[Sounds3["gameOver"] = 1] = "gameOver";
    Sounds3[Sounds3["shoot"] = 2] = "shoot";
    return Sounds3;
  })(Sounds || {});
  var GameState = class {
    stateSubject;
    isInVRSubject;
    _state = 3 /* notInVR */;
    get state() {
      return this._state;
    }
    set state(newState) {
      this._state = newState;
      this.stateSubject.next(newState);
    }
    _currentWave = 0;
    get currentWave() {
      return this._currentWave;
    }
    set currentWave(v2) {
      this._currentWave = v2;
    }
    _score = 0;
    get score() {
      return this._score;
    }
    set score(v2) {
      this._score = v2;
    }
    _isInVR = false;
    get isInVR() {
      return this._isInVR;
    }
    set isInVR(v2) {
      this._isInVR = v2;
      this.isInVRSubject.next(v2);
    }
    constructor() {
      this.stateSubject = new Subject();
      this.isInVRSubject = new Subject();
    }
    setState(state) {
      this.state = state;
    }
    spawnMissile = new Emitter();
    newGame = new Emitter();
    invaderHit = new Emitter();
    /**
     * Space or trigger is pressed, fire a bullet or start the game
     */
    fire(direction2, position) {
      switch (this.state) {
        case 3 /* notInVR */:
          break;
        case 0 /* welcome */:
        case 2 /* gameOver */:
          this.setState(1 /* playing */);
          this.score = 0;
          this.newGame.notify();
          break;
        case 1 /* playing */:
          this.spawnMissile.notify({ direction: direction2, position });
          globalAudioManager.play(2 /* shoot */);
          break;
      }
    }
    hit() {
      this.score++;
      this.invaderHit.notify();
    }
    gameOver() {
      this.setState(2 /* gameOver */);
    }
  };
  var gameState = new GameState();

  // js/classes/sfx-manager.ts
  var sfx_manager_exports = {};
  __export(sfx_manager_exports, {
    Sounds: () => Sounds2
  });
  var Sounds2 = /* @__PURE__ */ ((Sounds3) => {
    Sounds3["shoot"] = "shoot";
    Sounds3["explosion"] = "explosion";
    Sounds3["gameOVer"] = "gameOver";
    Sounds3["musGamePlay"] = "musGamePlay";
    return Sounds3;
  })(Sounds2 || {});

  // js/components/active-ad.ts
  var active_ad_exports = {};
  __export(active_ad_exports, {
    ActiveAd: () => ActiveAd
  });
  var _ActiveAd = class extends Component3 {
    components;
    start() {
      this.components = [];
      this.getComponents(this.object);
      this.onStateChange(gameState.state);
      gameState.stateSubject.subscribe(this.onStateChange.bind(this));
    }
    onStateChange(newState) {
      if (newState === 2 /* gameOver */ || newState === 0 /* welcome */) {
        this.components.forEach((c) => c.active = true);
      } else {
        this.components.forEach((c) => c.active = false);
      }
    }
    getComponents(obj) {
      const comps = obj.getComponents().filter((c) => c.type !== _ActiveAd.TypeName);
      this.components = this.components.concat(comps);
    }
  };
  var ActiveAd = _ActiveAd;
  __publicField(ActiveAd, "TypeName", "active-ad");

  // js/components/active-on-state.ts
  var active_on_state_exports = {};
  __export(active_on_state_exports, {
    ActiveOnState: () => ActiveOnState
  });
  var ActiveOnState = class extends Component3 {
    state = 0 /* welcome */;
    inactive = false;
    // components!: Component[];
    start() {
      this._onStateChange(gameState.state);
      gameState.stateSubject.subscribe(this._onStateChange);
    }
    _onStateChange = (newState) => {
      if (newState === this.state) {
        wlUtils.setActive(this.object, !this.inactive);
      } else {
        wlUtils.setActive(this.object, this.inactive);
      }
    };
    // getComponents(obj: Object3D) {
    //     const comps = obj.getComponents().filter((c) => c.type !== ActiveOnState.TypeName);
    //     this.components = this.components.concat(comps);
    //     if (this.affectChildren) {
    //         const children = obj.children;
    //         for (let i = 0; i < children.length; ++i) {
    //             this.getComponents(children[i]);
    //         }
    //     }
    // }
  };
  __publicField(ActiveOnState, "TypeName", "active-on-state");
  __decorateClass([
    property.enum(Object.keys(State).filter((k) => isNaN(Number(k))))
  ], ActiveOnState.prototype, "state", 2);
  __decorateClass([
    property.bool(false)
  ], ActiveOnState.prototype, "inactive", 2);

  // js/components/explosion-particles.ts
  var explosion_particles_exports = {};
  __export(explosion_particles_exports, {
    ExplosionParticles: () => ExplosionParticles,
    ParticlePool: () => ParticlePool
  });
  var tempQuat22 = quat2_exports.create();
  var tempQuat4 = quat_exports.create();
  var TOTALPARTICLES = 2500;
  var ParticlePool = class {
    objects;
    pointer = 0;
    constructor(engine) {
      this.objects = engine.scene.addObjects(TOTALPARTICLES, null, TOTALPARTICLES * 3);
      for (let i = 0; i < this.objects.length; ++i) {
        const obj = this.objects[i];
        obj.scaleLocal([0, 0, 0]);
        obj.addComponent(MeshComponent);
      }
    }
    request(amount) {
      const result = [];
      for (let i = 0; i < amount; ++i) {
        result.push(this.objects[this.pointer]);
        this.pointer = (this.pointer + 1) % this.objects.length;
      }
      return result;
    }
  };
  __publicField(ParticlePool, "instance");
  var ExplosionParticles = class extends Component3 {
    mesh;
    material;
    maxParticles;
    initialSpeed;
    particleScale;
    size;
    time = 0;
    selfDestructCountdown = 2.5;
    /**
     * @type {number[][]}
     */
    velocities = [];
    objects = [];
    rotations = [];
    lifetime = [];
    start() {
      this.objects = ParticlePool.instance.request(this.maxParticles);
      for (let i = 0; i < this.maxParticles; i++) {
        this.velocities.push([
          (Math.random() * 2 - 1) * this.initialSpeed,
          (Math.random() * 2 - 0.5) * this.initialSpeed,
          (Math.random() * 2 - 1) * this.initialSpeed
        ]);
        this.rotations.push([
          (Math.random() * 2 - 1) * 10,
          (Math.random() * 2 - 1) * 10,
          (Math.random() * 2 - 1) * 10
        ]);
        this.lifetime.push(Math.random() * 0.5 + 1);
        this.objects[i].scaleLocal([0, 0, 0]);
      }
      for (let i = 0; i < this.maxParticles; i++) {
        const obj = this.objects[i];
        obj.resetTransform();
        obj.scaleLocal([this.particleScale, this.particleScale, this.particleScale]);
        obj.getComponent(MeshComponent).active = true;
        obj.getComponent(MeshComponent).material = this.material;
        obj.getComponent(MeshComponent).mesh = this.mesh;
        const pos = this.object.getPositionWorld();
        obj.setPositionWorld(pos);
      }
    }
    update(dt) {
      this.selfDestructCountdown -= dt;
      if (this.selfDestructCountdown < 0) {
        console.log("destroying explosion particles");
        this.destroy();
        return;
      }
      const origin = vec3_exports.fromValues(0, 0, 0);
      const distance3 = vec3_exports.fromValues(0, 0, 0);
      for (let i = 0; i < this.objects.length; ++i) {
        if (this.lifetime[i] <= 0) {
          continue;
        }
        this.objects[i].getTransformWorld(tempQuat22);
        quat2_exports.getTranslation(origin, tempQuat22);
        const rot = this.rotations[i];
        this.objects[i].getRotationWorld(tempQuat4);
        quat_exports.rotateX(tempQuat4, tempQuat4, rot[0] * dt);
        quat_exports.rotateY(tempQuat4, tempQuat4, rot[1] * dt);
        quat_exports.rotateZ(tempQuat4, tempQuat4, rot[2] * dt);
        this.objects[i].setRotationWorld(tempQuat4);
        this.lifetime[i] -= dt;
        if (this.lifetime[i] <= 0) {
          this.objects[i].scaleLocal([0, 0, 0]);
          continue;
        }
      }
      for (let i = 0; i < this.objects.length; ++i) {
        this.velocities[i][1] -= 9.81 * dt;
        vec3_exports.scale(distance3, this.velocities[i], dt);
        this.objects[i].translateWorld(distance3);
      }
    }
  };
  __publicField(ExplosionParticles, "TypeName", "explosion-particles");
  __decorateClass([
    property.mesh()
  ], ExplosionParticles.prototype, "mesh", 2);
  __decorateClass([
    property.material()
  ], ExplosionParticles.prototype, "material", 2);
  __decorateClass([
    property.int(100)
  ], ExplosionParticles.prototype, "maxParticles", 2);
  __decorateClass([
    property.float(25)
  ], ExplosionParticles.prototype, "initialSpeed", 2);
  __decorateClass([
    property.float(0.01)
  ], ExplosionParticles.prototype, "particleScale", 2);
  __decorateClass([
    property.int(16)
  ], ExplosionParticles.prototype, "size", 2);

  // js/components/game.ts
  var game_exports = {};
  __export(game_exports, {
    Game: () => Game
  });

  // js/components/missile.ts
  var missile_exports = {};
  __export(missile_exports, {
    Missile: () => Missile
  });

  // js/components/invader.ts
  var invader_exports = {};
  __export(invader_exports, {
    Invader: () => Invader
  });

  // js/classes/utils/lerp.ts
  var Easing2 = {
    /**
     * Linear easing function.
     * @param t A value between 0 and 1 representing the progress of the animation.
     * @returns The same value as `t`, providing a linear progression.
     */
    Linear: (t) => t,
    /**
     * Quadratic ease-in function.
     * @param t A value between 0 and 1 representing the progress of the animation.
     * @returns A value representing an accelerated (quadratic) progression from 0 to 1.
     */
    InQuad: (t) => t * t,
    /**
     * Quadratic ease-out function.
     * @param t A value between 0 and 1 representing the progress of the animation.
     * @returns A value representing a decelerated (quadratic) progression from 0 to 1.
     */
    OutQuad: (t) => 1 - (1 - t) * (1 - t),
    /**
     * Quadratic ease-in-out function.
     * @param t A value between 0 and 1 representing the progress of the animation.
     * @returns A value that accelerates in, then decelerates out, providing a smooth transition between motion states.
     */
    InOutQuad: (t) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
    /**
     * Cubic ease-in function.
     * @param t A value between 0 and 1 representing the progress of the animation.
     * @returns A value representing an accelerated (cubic) progression from 0 to 1.
     */
    InCubic: (t) => Math.pow(t, 3),
    /**
     * Cubic ease-out function.
     * @param t A value between 0 and 1 representing the progress of the animation.
     * @returns A value representing an decelerated (cubic) progression from 0 to 1.
     */
    OutCubic: (t) => Math.pow(t - 1, 3) + 1,
    /**
     * Cubic ease-in-out function.
     * @param t A value between 0 and 1 representing the progress of the animation.
     * @returns A value that accelerates in, then decelerates out, providing a smooth transition between motion states.
     */
    InOutCubic: (t) => {
      if (t < 0.5) {
        return Math.pow(2 * t, 3) / 2;
      } else {
        return (Math.pow(2 * t - 2, 3) + 2) / 2;
      }
    }
  };
  function lerp8(start, end, t, easing = Easing2.Linear) {
    if (typeof easing === "function") {
      easing = getEasingFunction2(easing);
    }
    return start * (1 - easing(t)) + end * easing(t);
  }
  function lerpVec32(out, start, end, t, easing = Easing2.Linear) {
    if (typeof easing === "function") {
      easing = getEasingFunction2(easing);
    }
    for (let i = 0; i < 3; i++) {
      out[i] = start[i] * (1 - easing(t)) + end[i] * easing(t);
    }
    return out;
  }
  function getEasingFunction2(type) {
    return typeof type === "function" ? type : Easing2.Linear;
  }

  // js/components/invader.ts
  var Invader = class extends Component3 {
    shardMesh;
    speed = 5;
    frequency = 2;
    breakChange = 100;
    amp = 1;
    startDist = 0;
    dir = vec3_exports.create();
    deltaFreq = 0;
    orgX = 0;
    broken = false;
    collision;
    gameOver = false;
    isShowing = false;
    timer = Math.random() * -3;
    start() {
      const pos = this.object.getPositionWorld();
      const dist3 = vec3_exports.length(pos);
      this.startDist = dist3;
      this.dir = vec3_exports.normalize(vec3_exports.create(), pos);
      this.deltaFreq = this.frequency * Math.PI * 2 / dist3;
      this.orgX = pos[0];
      gameState.stateSubject.subscribe((state) => {
        if (state === 2 /* gameOver */) {
          this.gameOver = true;
        }
      });
      this.isShowing = true;
      this.object.scaleLocal([0, 0, 0]);
    }
    hit() {
      globalAudioManager.playOneShot(0 /* explosion */).catch(() => {
      });
      const obj = this.engine.scene.addObject();
      obj.setPositionWorld(this.object.getPositionWorld());
      obj.addComponent(ExplosionParticles, {
        mesh: this.shardMesh,
        material: this.object.getComponent(MeshComponent).material,
        maxParticles: 250,
        particleScale: 1,
        size: 1,
        initialSpeed: 100
      });
      this.object.destroy();
      return;
    }
    update(dt) {
      if (this.gameOver) {
        return;
      }
      if (this.isShowing) {
        this.timer += dt;
        if (this.timer >= 0) {
          const clampTimer = clamp2(this.timer, 0, 1);
          const scaleValue = lerp8(0, 1.5, clampTimer, Easing.OutCubic);
          this.object.setScalingLocal([scaleValue, scaleValue, scaleValue]);
        }
        if (this.timer >= 1) {
          this.isShowing = false;
          this.object.setScalingLocal([1.5, 1.5, 1.5]);
        }
      }
      const deltaTime = dt * this.speed;
      const pos = this.object.getPositionWorld();
      this.orgX -= this.dir[0] * deltaTime;
      pos[1] -= this.dir[1] * deltaTime;
      pos[2] -= this.dir[2] * deltaTime;
      const currentDist = vec3_exports.length(vec3_exports.fromValues(this.orgX, pos[1], pos[2]));
      pos[0] = Math.sin(this.startDist * this.deltaFreq - this.deltaFreq * currentDist) * currentDist / 10 * this.amp + this.orgX;
      this.object.lookAt(vec3_exports.fromValues(0, 0, 0));
      this.object.setPositionWorld(pos);
      if (currentDist < 10) {
        gameState.gameOver();
      }
      if (currentDist > 10 && !this.broken) {
        if (Math.random() * 1e6 <= this.breakChange) {
          this.broken = true;
          this.speed *= 2;
          this.frequency *= 4;
          this.amp *= 5;
        }
      }
    }
  };
  __publicField(Invader, "TypeName", "invader");
  __decorateClass([
    property.mesh()
  ], Invader.prototype, "shardMesh", 2);
  __decorateClass([
    property.int(5)
  ], Invader.prototype, "speed", 2);

  // js/components/missile.ts
  var Missile = class extends Component3 {
    aliensParent;
    speed = 100;
    lifetime = 2;
    fired = false;
    direction = vec3_exports.create();
    velocity = vec3_exports.create();
    update(dt) {
      if (!this.fired) {
        return;
      }
      const distance3 = this.speed * dt;
      vec3_exports.scale(this.velocity, this.direction, distance3);
      const pos = this.object.getPositionWorld();
      const newPosition = vec3_exports.create();
      vec3_exports.add(newPosition, pos, this.velocity);
      this.object.setPositionWorld(newPosition);
      this.aliensParent.children.forEach((alien) => {
        const alienPos = alien.getPositionWorld();
        if (alienPos[0] !== 0 && alienPos[1] !== 0 && alienPos[2] !== 0) {
          const distance4 = vec3_exports.distance(alienPos, newPosition);
          if (distance4 < 5) {
            alien.getComponent(Invader)?.hit();
            this.end();
            gameState.hit();
            return;
          }
        }
      });
      this.lifetime -= dt;
      if (this.lifetime < 0 || newPosition[1] < -150) {
        this.end();
      }
    }
    end() {
      this.object.active = false;
      this.fired = false;
    }
    liftOff(direction2) {
      this.direction = vec3_exports.clone(direction2);
      const quaternion = quat_exports.create();
      quat_exports.rotationTo(quaternion, vec3_exports.fromValues(0, 0, -1), this.direction);
      this.object.rotateObject(quaternion);
      this.fired = true;
      this.lifetime = 2;
    }
  };
  __publicField(Missile, "TypeName", "missile");
  __decorateClass([
    property.object()
  ], Missile.prototype, "aliensParent", 2);

  // js/data/Waves.ts
  var Waves = [
    [
      [1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1],
      [2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2],
      [3, 3, 3, 3, 3, 0, 3, 3, 3, 3, 3],
      [0, 4, 4, 4, 0, 0, 0, 4, 4, 4, 0],
      [0, 4, 0, 4, 0, 0, 0, 4, 0, 4, 0]
    ],
    [
      [0, 2, 0, 0, 0, 3, 0, 0, 0, 2, 0],
      [0, 4, 0, 0, 0, 1, 0, 0, 0, 4, 0],
      [4, 6, 4, 0, 1, 7, 1, 0, 4, 6, 4],
      [2, 4, 2, 0, 3, 1, 3, 0, 2, 4, 2],
      [4, 2, 4, 0, 1, 3, 1, 0, 4, 2, 4]
    ],
    [
      [0, 0, 0, 3, 2, 1, 2, 3, 0, 0, 0],
      [0, 0, 3, 2, 1, 1, 1, 2, 3, 0, 0],
      [0, 3, 2, 1, 1, 4, 1, 1, 2, 3, 0],
      [0, 0, 3, 2, 1, 1, 1, 2, 3, 0, 0],
      [0, 0, 0, 3, 2, 1, 2, 3, 0, 0, 0]
    ],
    [
      [1, 2, 3, 4, 5, 8, 5, 4, 3, 2, 1],
      [0, 1, 2, 3, 4, 5, 4, 3, 2, 1, 0],
      [0, 0, 1, 2, 3, 4, 3, 2, 1, 0, 0],
      [0, 0, 0, 1, 2, 3, 2, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0]
    ],
    [
      [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
      [4, 0, 4, 0, 4, 0, 4, 0, 4, 0, 4],
      [0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0],
      [6, 0, 6, 0, 6, 0, 6, 0, 6, 0, 6],
      [0, 7, 0, 7, 0, 7, 0, 7, 0, 7, 0]
    ],
    [
      [0, 0, 0, 8, 0, 0, 0, 8, 0, 0, 0],
      [0, 0, 8, 6, 8, 0, 8, 6, 8, 0, 0],
      [0, 8, 6, 4, 6, 8, 6, 4, 6, 8, 0],
      [8, 6, 4, 2, 4, 6, 4, 2, 4, 6, 8],
      [6, 4, 2, 0, 2, 4, 2, 0, 2, 4, 6]
    ]
  ];

  // js/components/show-leaderboard.ts
  var show_leaderboard_exports = {};
  __export(show_leaderboard_exports, {
    ShowLeaderboard: () => ShowLeaderboard
  });
  var tempVec36 = vec3_exports.create();
  var ShowLeaderboard = class extends Component3 {
    originalPosition = vec3_exports.create();
    hiddenPosition = vec3_exports.create();
    timer = 0;
    isShown = true;
    start() {
      this.object.getPositionWorld(this.originalPosition);
      vec3_exports.copy(this.hiddenPosition, this.originalPosition);
      this.hiddenPosition[1] = -3.5;
    }
    show() {
      this.isShown = true;
      this.active = true;
      this.timer = 0;
    }
    hide() {
      this.isShown = false;
      this.active = true;
      this.timer = 0;
    }
    update(dt) {
      this.timer += dt;
      clamp2(this.timer, 0, 1);
      if (this.isShown) {
        lerpVec32(
          tempVec36,
          this.hiddenPosition,
          this.originalPosition,
          this.timer,
          Easing2.InCubic
        );
      } else {
        lerpVec32(
          tempVec36,
          this.originalPosition,
          this.hiddenPosition,
          this.timer,
          Easing2.OutCubic
        );
      }
      this.object.setPositionWorld(tempVec36);
      if (this.timer >= 1) {
        this.active = false;
      }
    }
  };
  __publicField(ShowLeaderboard, "TypeName", "show-leaderboard");

  // js/heyvr/heyvr-leaderboard.ts
  var heyvr_leaderboard_exports = {};
  __export(heyvr_leaderboard_exports, {
    HeyvrLeaderboard: () => HeyvrLeaderboard
  });
  var HeyvrLeaderboard = class extends Component3 {
    leaderboardId = "";
    amountScoresDisplayed = 10;
    lastScoreDisplay;
    textColumn1Object;
    textColumn2Object;
    textColumn3Object;
    debug = false;
    loaded = false;
    firstColumn;
    secondColumn;
    thirdColumn;
    lastScoreDisplayText;
    init() {
      this.debug = false;
      this.loaded = false;
      this.firstColumn = this.textColumn1Object.getComponent(TextComponent);
      this.secondColumn = this.textColumn2Object.getComponent(TextComponent);
      this.thirdColumn = this.textColumn3Object.getComponent(TextComponent);
      if (this.lastScoreDisplay) {
        this.lastScoreDisplayText = this.lastScoreDisplay.getComponent(TextComponent);
      }
      if ("heyVR" in window || this.debug) {
        if (!this.loaded) {
          this.loaded = true;
          this.getLeaderboard().catch(console.error);
        }
      }
    }
    async submitScore(score) {
      if (this.lastScoreDisplayText) {
        this.lastScoreDisplayText.text = "Last score: " + score;
        this.lastScoreDisplayText.active = true;
      }
      if ("heyVR" in window) {
        const success = await window.heyVR.leaderboard.postScore(
          this.leaderboardId,
          score
        );
        if (success) {
          await this.getLeaderboard();
        }
      } else if (this.debug) {
        this.firstColumn.text = "";
        this.secondColumn.text = "Loading...";
        this.thirdColumn.text = "";
        setTimeout(() => {
          this.getLeaderboard().catch(console.error);
        }, 2e3);
      }
    }
    /**
     * @summary Request an update of the leaderboard entries.
     *
     * This is already done after @ref submitScore()
     */
    async getLeaderboard() {
      if (!("heyVR" in window)) {
        return;
      }
      this.firstColumn.text = "";
      this.secondColumn.text = "Loading...";
      this.thirdColumn.text = "";
      const result = await window.heyVR.leaderboard.get(
        this.leaderboardId,
        this.amountScoresDisplayed
      );
      this.onScoresRetrieved(result);
    }
    onScoresRetrieved(scores) {
      if (scores == null) {
        console.warn("Retrieving scores failed.");
        return;
      }
      let leftText = "\n";
      let centerText = "\n";
      let rightText = "\n";
      for (let i = 0; i < Math.min(this.amountScoresDisplayed, scores.length); i++) {
        const rank = i + 1 + "\n";
        const name = (scores[i].user || "unknown") + "\n";
        const score = scores[i].score + "\n";
        leftText += rank;
        centerText += name;
        rightText += score;
      }
      this.firstColumn.text = leftText;
      this.secondColumn.text = centerText;
      this.thirdColumn.text = rightText;
    }
  };
  __publicField(HeyvrLeaderboard, "TypeName", "heyvr-leaderboard");
  __decorateClass([
    property.string("")
  ], HeyvrLeaderboard.prototype, "leaderboardId", 2);
  __decorateClass([
    property.int(10)
  ], HeyvrLeaderboard.prototype, "amountScoresDisplayed", 2);
  __decorateClass([
    property.object({ required: true })
  ], HeyvrLeaderboard.prototype, "lastScoreDisplay", 2);
  __decorateClass([
    property.object({ required: true })
  ], HeyvrLeaderboard.prototype, "textColumn1Object", 2);
  __decorateClass([
    property.object({ required: true })
  ], HeyvrLeaderboard.prototype, "textColumn2Object", 2);
  __decorateClass([
    property.object({ required: true })
  ], HeyvrLeaderboard.prototype, "textColumn3Object", 2);
  __decorateClass([
    property.bool(false)
  ], HeyvrLeaderboard.prototype, "debug", 2);

  // js/components/game.ts
  var missilePoolSize = 1e3;
  var tempVec6 = vec3_exports.create();
  var Game = class extends Component3 {
    nonVRCamera;
    leaderboardObject;
    scoreObject;
    prefabStoreObject;
    missilesParent;
    aliensParent;
    alien1Mesh;
    alien2Mesh;
    shardMesh;
    alienMaterial1;
    alienMaterial2;
    alienMaterial3;
    alienMaterial4;
    alienMaterial5;
    alienMaterial6;
    missileMesh;
    missileMaterial;
    particleMesh;
    particleMaterial;
    startMissilePositionObject;
    prefabStore;
    currentwave = 0;
    missilePool;
    lastShot = 0;
    invadersLeftInWave = 0;
    currentspeed = 5;
    showLeaderboardComponent;
    leaderboard;
    scoreText;
    static onRegister(engine) {
      engine.registerComponent(Missile);
      engine.registerComponent(Invader);
    }
    start() {
      Promise.all([
        globalAudioManager.load(
          ["explosion.wav", "explosion2.wav", "explosion3.wav"],
          0 /* explosion */
        ),
        globalAudioManager.load("bigExplosion.wav", 1 /* gameOver */),
        globalAudioManager.load("laserShoot.wav", 2 /* shoot */)
      ]).then(() => {
        console.log("loaded all sounds");
      }).catch((e) => console.error(e));
      ParticlePool.instance = new ParticlePool(this.engine);
      if (!this.prefabStoreObject) {
        throw new Error("prefabStoreObject is not set");
      }
      this.prefabStore = this.prefabStoreObject.getComponent(PrefabStorage);
      this.leaderboard = this.leaderboardObject.getComponent(HeyvrLeaderboard);
      this.showLeaderboardComponent = this.leaderboardObject.getComponent(ShowLeaderboard);
      this.scoreText = this.scoreObject.getComponent(TextComponent);
      this.scoreText.text = "";
      this.engine.onXRSessionStart.add(() => gameState.isInVR = true);
      this.engine.onXRSessionEnd.add(() => gameState.isInVR = false);
      gameState.spawnMissile.add((data) => {
        this.startMissilePositionObject.getPositionWorld(tempVec6);
        this.spawnMissile(data.direction, tempVec6);
      });
      gameState.newGame.add(this.newGame);
      gameState.stateSubject.pipe(filter((x2) => x2 === 2 /* gameOver */)).subscribe(this.isGameOver.bind(this));
      gameState.isInVRSubject.subscribe((isInVR) => {
        if (isInVR) {
          console.log("enter vr");
          gameState.setState(0 /* welcome */);
        } else {
          console.log("exit vr");
          this.clearInvaders();
          this.clearMissilePool();
          this.scoreText.text = "";
          gameState.setState(3 /* notInVR */);
        }
      });
      gameState.invaderHit.add(() => {
        this.invadersLeftInWave--;
        this.scoreText.text = `${gameState.score}`;
        if (this.invadersLeftInWave === 0) {
          this.currentwave++;
          this.currentspeed++;
          if (this.currentwave >= Waves.length) {
            this.currentwave = 0;
          }
          this.invadersLeftInWave = this.spawnInvaderWave();
        }
      });
    }
    newGame = () => {
      this.showLeaderboardComponent.hide();
      this.scoreText.text = "0";
      if (!this.missilePool) {
        this.createMissilePool();
      } else {
        this.clearMissilePool();
      }
      this.currentspeed = 5;
      this.currentwave = 0;
      this.clearInvaders();
      this.invadersLeftInWave = this.spawnInvaderWave();
    };
    createMissilePool() {
      this.missilePool = this.engine.scene.addObjects(
        missilePoolSize,
        this.missilesParent,
        missilePoolSize * 3
      );
      for (let m2 = 0; m2 < missilePoolSize; m2++) {
        const missile = this.missilePool[m2];
        missile.name = `missile-${m2}`;
        missile.addComponent(MeshComponent, {
          mesh: this.missileMesh,
          material: this.missileMaterial
        });
        missile.addComponent(Missile, {
          aliensParent: this.aliensParent
        });
        missile.active = false;
      }
    }
    clearMissilePool() {
      if (!this.missilePool || this.missilePool.length === 0) {
        return;
      }
      for (let m2 = 0; m2 < missilePoolSize; m2++) {
        const missile = this.missilePool[m2];
        missile.active = false;
        const missileComponent = missile.getComponent(Missile);
        missileComponent.fired = false;
      }
    }
    spawnMissile(direction2, position) {
      const missileInstance = this.missilePool[this.lastShot];
      this.lastShot++;
      if (this.lastShot > this.missilePool.length) {
        this.lastShot = 0;
      }
      if (missileInstance) {
        missileInstance.resetPositionRotation();
        missileInstance.setPositionWorld(position ?? [0, 0, 0]);
        missileInstance.active = true;
        const missile = missileInstance.getComponent(Missile);
        missile.liftOff(direction2 ?? [0, 0, -1]);
      } else {
        console.error("no missiles left, somehow");
      }
    }
    clearInvaders() {
      this.aliensParent.children.forEach((alien) => {
        alien.destroy();
      });
    }
    spawnInvaderWave() {
      let spawned = 0;
      this.engine.scene.addObjects(55, this.aliensParent, 1e3);
      for (let i = 0; i < 5; i++) {
        for (let j2 = 0; j2 < 11; j2++) {
          if (Waves[this.currentwave][i][j2] > 0) {
            spawned++;
            this.spawnInvader(j2, i, Waves[this.currentwave][i][j2]);
          }
        }
      }
      return spawned;
    }
    spawnInvader(x2, y2, type) {
      const rndY = -y2 * 25 + 150;
      const rad = ((x2 + 0.5) / 11 - 0.5) * (Math.PI / 1.5);
      const obj = this.engine.scene.addObject(this.aliensParent);
      const meshComponent = obj.addComponent(MeshComponent, {
        mesh: type % 2 ? this.alien2Mesh : this.alien1Mesh
      });
      switch (type) {
        case 1:
          meshComponent.material = this.alienMaterial1;
          break;
        case 2:
          meshComponent.material = this.alienMaterial2;
          break;
        case 3:
          meshComponent.material = this.alienMaterial3;
          break;
        case 4:
          meshComponent.material = this.alienMaterial4;
          break;
        case 5:
        case 6:
          meshComponent.material = this.alienMaterial5;
          break;
        case 7:
        case 8:
          meshComponent.material = this.alienMaterial6;
          break;
        default:
          meshComponent.material = this.alienMaterial1;
          break;
      }
      const position = vec3_exports.fromValues(Math.sin(rad) * 250, rndY, Math.cos(rad) * -150);
      obj.setPositionWorld(position);
      obj.lookAt(vec3_exports.fromValues(0, 0, 0));
      obj.addComponent(Invader, {
        speed: this.currentspeed,
        shardMesh: this.shardMesh
      });
    }
    isGameOver() {
      this.leaderboard.submitScore(gameState.score).catch(console.error);
      this.showLeaderboardComponent.show();
    }
  };
  __publicField(Game, "TypeName", "game");
  __decorateClass([
    property.object()
  ], Game.prototype, "nonVRCamera", 2);
  __decorateClass([
    property.object({ required: true })
  ], Game.prototype, "leaderboardObject", 2);
  __decorateClass([
    property.object({ required: true })
  ], Game.prototype, "scoreObject", 2);
  __decorateClass([
    property.object()
  ], Game.prototype, "prefabStoreObject", 2);
  __decorateClass([
    property.object()
  ], Game.prototype, "missilesParent", 2);
  __decorateClass([
    property.object()
  ], Game.prototype, "aliensParent", 2);
  __decorateClass([
    property.mesh()
  ], Game.prototype, "alien1Mesh", 2);
  __decorateClass([
    property.mesh()
  ], Game.prototype, "alien2Mesh", 2);
  __decorateClass([
    property.mesh()
  ], Game.prototype, "shardMesh", 2);
  __decorateClass([
    property.material()
  ], Game.prototype, "alienMaterial1", 2);
  __decorateClass([
    property.material()
  ], Game.prototype, "alienMaterial2", 2);
  __decorateClass([
    property.material()
  ], Game.prototype, "alienMaterial3", 2);
  __decorateClass([
    property.material()
  ], Game.prototype, "alienMaterial4", 2);
  __decorateClass([
    property.material()
  ], Game.prototype, "alienMaterial5", 2);
  __decorateClass([
    property.material()
  ], Game.prototype, "alienMaterial6", 2);
  __decorateClass([
    property.mesh()
  ], Game.prototype, "missileMesh", 2);
  __decorateClass([
    property.material()
  ], Game.prototype, "missileMaterial", 2);
  __decorateClass([
    property.mesh({ required: true })
  ], Game.prototype, "particleMesh", 2);
  __decorateClass([
    property.material({ required: true })
  ], Game.prototype, "particleMaterial", 2);
  __decorateClass([
    property.object({ required: true })
  ], Game.prototype, "startMissilePositionObject", 2);

  // js/components/keyboard-controls.ts
  var keyboard_controls_exports = {};
  __export(keyboard_controls_exports, {
    KeyboardControls: () => KeyboardControls
  });
  var KeyboardControls = class extends Component3 {
    nonVRCamera;
    missileSpawnPoint;
    spacePressed = false;
    forward = vec3_exports.create();
    onActivate() {
    }
    onDeactivate() {
    }
    pressKeyboard = (input) => {
      if (input.code == "Space" && !this.spacePressed) {
        this.spacePressed = true;
        if (this.nonVRCamera && this.missileSpawnPoint) {
          this.nonVRCamera.getForwardWorld(this.forward);
          const position = this.missileSpawnPoint.getPositionWorld();
          gameState.fire(this.forward, position);
        }
      }
    };
    releaseKeyboard = (input) => {
      if (input.code == "Space" && this.spacePressed) {
        this.spacePressed = false;
      }
    };
  };
  __publicField(KeyboardControls, "TypeName", "keyboard-controls");
  __decorateClass([
    property.object()
  ], KeyboardControls.prototype, "nonVRCamera", 2);
  __decorateClass([
    property.object()
  ], KeyboardControls.prototype, "missileSpawnPoint", 2);

  // js/components/mouse-controls.ts
  var mouse_controls_exports = {};
  __export(mouse_controls_exports, {
    MouseControls: () => MouseControls
  });
  var MouseControls = class extends Component3 {
    cursorTargetObject;
    mouseLookObject;
    cursorTarget;
    mouselook;
    start() {
    }
  };
  __publicField(MouseControls, "TypeName", "mouse-controls");
  __decorateClass([
    property.object()
  ], MouseControls.prototype, "cursorTargetObject", 2);
  __decorateClass([
    property.object()
  ], MouseControls.prototype, "mouseLookObject", 2);

  // js/components/vr-controls.ts
  var vr_controls_exports = {};
  __export(vr_controls_exports, {
    VrControls: () => VrControls
  });
  var handedness2 = ["left", "right"];
  var tempVec37 = vec3_exports.create();
  var VrControls = class extends Component3 {
    leftController;
    rightController;
    haptics = true;
    handedness = 1;
    initialized = false;
    currentlyShootingWithRight = true;
    forward = vec3_exports.create();
    start() {
      this.initialized = false;
      this.engine.onXRSessionStart.add(this.onSessionStart);
    }
    onSessionStart = (session) => {
      session.addEventListener("select", async (e) => {
        if (!this.active) {
          return;
        }
        if (e.inputSource.handedness === handedness2[this.handedness]) {
          if (this.haptics) {
            await this.pulse(e.inputSource.gamepad);
          }
          this.rightController.getForwardWorld(this.forward);
          this.rightController.getPositionWorld(tempVec37);
          tempVec37[1] += 0.13;
          tempVec37[2] -= 0.4;
          this.shoot(this.forward, tempVec37);
        }
      });
      this.initialized = true;
    };
    async pulse(gamepad) {
      if (!gamepad || !gamepad.hapticActuators) {
        return;
      }
      const actuator = gamepad.hapticActuators[0];
      if (!actuator) {
        return;
      }
      await actuator.pulse(1, 100);
    }
    shoot(transform, rotation) {
      gameState.fire(transform, rotation);
    }
  };
  __publicField(VrControls, "TypeName", "vr-controls");
  __decorateClass([
    property.object()
  ], VrControls.prototype, "leftController", 2);
  __decorateClass([
    property.object()
  ], VrControls.prototype, "rightController", 2);
  __decorateClass([
    property.bool(true)
  ], VrControls.prototype, "haptics", 2);

  // cache/back-to-space/js/_editor_index.js
  _registerEditor(sdk_min_exports);
  _registerEditor(dist_exports3);
  _registerEditor(dist_exports2);
  _registerEditor(dist_exports);
  _registerEditor(game_state_exports);
  _registerEditor(sfx_manager_exports);
  _registerEditor(active_ad_exports);
  _registerEditor(active_on_state_exports);
  _registerEditor(explosion_particles_exports);
  _registerEditor(game_exports);
  _registerEditor(invader_exports);
  _registerEditor(keyboard_controls_exports);
  _registerEditor(missile_exports);
  _registerEditor(mouse_controls_exports);
  _registerEditor(show_leaderboard_exports);
  _registerEditor(vr_controls_exports);
  _registerEditor(heyvr_leaderboard_exports);
})();
