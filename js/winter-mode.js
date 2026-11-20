/*!
 * winter-mode v1.0.0
 * Turns any website into a winter wonderland: falling snow that piles up on
 * top of the letters, words, images and buttons of the page.
 * MIT License
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
    module.exports.default = api;
  } else if (typeof define === 'function' && define.amd) {
    define([], function () { return api; });
  } else {
    root.WinterMode = api;
    // Loaded with a classic <script> tag: start right away unless data-autostart="false".
    var script = typeof document !== 'undefined' && document.currentScript;
    if (script && script.getAttribute('data-autostart') !== 'false') api.autoStart(script.dataset);
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var VERSION = '1.0.0';
  var COL = 2;   // width in px of one column of snow on a surface
  var BIN = 48;  // width in px of the collision buckets
  var HTML_NS = 'http://www.w3.org/1999/xhtml';
  var SKIP_TAGS = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, TEXTAREA: 1, SELECT: 1, OPTION: 1, TEMPLATE: 1, IFRAME: 1, CANVAS: 1 };
  var WORD = /\S+/g;
  var NON_WS = /\S/;
  var isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

  var DEFAULTS = {
    flakes: 140,          // falling flakes on a 1440x900 screen (scaled to the viewport)
    speed: 1,             // fall speed multiplier
    wind: 0.25,           // base horizontal drift (negative = blows left)
    minSize: 0.8,         // smallest flake radius in px
    maxSize: 4,           // largest flake radius in px
    crystals: true,       // draw some big flakes as six-armed crystals
    stick: true,          // let snow pile up on text and surfaces
    stickSpeed: 1,        // how quickly snow builds up on text
    maxPile: 10,          // max height in px of the snow on big headlines (smaller text gets less)
    surfaces: 'img,button,input,select,textarea,video,hr,[data-winter-surface]',
    ground: true,         // snow drift along the bottom of the screen
    groundMax: 22,        // max height in px of that drift
    frost: true,          // icy glow on the text
    tint: true,           // frosty vignette around the edges of the screen
    shake: true,          // hovering a snowy word knocks the snow off
    zIndex: 2147483000,
    maxWords: 1500,       // cap on words tracked at once (performance)
    reducedMotion: 'reduce' // 'reduce' | 'ignore' | 'off' when the user prefers reduced motion
  };

  var S = null;                 // state of the running effect
  var piles = isBrowser ? new WeakMap() : null; // snow kept per text node / element across rescans
  var measureCtx = null;
  var glyphCache = {};
  var fontCache = {};

  function assign(target) {
    for (var i = 1; i < arguments.length; i++) {
      var src = arguments[i];
      if (src) for (var k in src) if (Object.prototype.hasOwnProperty.call(src, k) && src[k] !== undefined) target[k] = src[k];
    }
    return target;
  }

  function rand(a, b) { return a + Math.random() * (b - a); }

  // ---------------------------------------------------------------- measuring

  function fontMetrics(font) {
    var m = fontCache[font];
    if (m) return m;
    measureCtx.font = font;
    var t = measureCtx.measureText('Hg');
    var size = parseFloat(font.split(' ')[2]) || 16;
    m = {
      asc: t.fontBoundingBoxAscent !== undefined ? t.fontBoundingBoxAscent : size * 0.9,
      desc: t.fontBoundingBoxDescent !== undefined ? t.fontBoundingBoxDescent : size * 0.22,
      size: size
    };
    return (fontCache[font] = m);
  }

  // Width of a character and the distance from the top of the text box to the top of its ink.
  function glyph(font, ch) {
    var key = font + '\u0000' + ch;
    var g = glyphCache[key];
    if (g) return g;
    var m = fontMetrics(font);
    measureCtx.font = font;
    var t = measureCtx.measureText(ch);
    var top;
    if (t.actualBoundingBoxAscent !== undefined) {
      var ink = t.actualBoundingBoxAscent + t.actualBoundingBoxDescent;
      top = ink <= 0 ? -1 : Math.max(0, m.asc - t.actualBoundingBoxAscent);
    } else {
      top = /[a-z]/.test(ch) && !/[bdfhiklt]/.test(ch) ? m.size * 0.45 : m.size * 0.2;
    }
    return (glyphCache[key] = { w: t.width || m.size * 0.5, top: top, ascDesc: m.asc + m.desc });
  }

  // ----------------------------------------------------------------- surfaces

  function pileFor(owner, key) {
    var map = piles.get(owner);
    if (!map) { map = new Map(); piles.set(owner, map); }
    var p = map.get(key);
    if (!p) { p = { h: null, total: 0 }; map.set(key, p); }
    return p;
  }

  // The nearest fixed or sticky ancestor (things that stay put while the page scrolls), or null.
  function pinnedAncestor(el, cache) {
    var chain = [];
    var result = null;
    while (el && el !== document.body && el.nodeType === 1) {
      if (cache.has(el)) { result = cache.get(el); break; }
      chain.push(el);
      var pos = getComputedStyle(el).position;
      if (pos === 'fixed' || pos === 'sticky') { result = el; break; }
      el = el.parentElement;
    }
    for (var i = 0; i < chain.length; i++) cache.set(chain[i], result);
    return result;
  }

  function inspect(el, vh, margin, fixedCache) {
    if (el.namespaceURI !== HTML_NS) return null;
    var r = el.getBoundingClientRect();
    if (r.bottom < -margin || r.top > vh + margin) return null;
    var cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.opacity === '0') return null;
    return {
      font: cs.fontStyle + ' ' + cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily,
      fixed: !!pinnedAncestor(el, fixedCache)
    };
  }

  // Builds the per-column "ink top" profile of a word so snow sits on each letter.
  function profile(base, word, font, rect) {
    var chars = Array.from(word);
    var gs = [], total = 0, i;
    for (i = 0; i < chars.length; i++) { gs.push(glyph(font, chars[i])); total += gs[i].w; }
    var sx = total > 0 ? rect.width / total : 1;
    var sy = rect.height / (gs[0].ascDesc || rect.height);
    var ci = 0, edge = gs[0].w * sx;
    for (var c = 0; c < base.length; c++) {
      var cx = (c + 0.5) * COL;
      while (cx > edge && ci < gs.length - 1) { ci++; edge += gs[ci].w * sx; }
      base[c] = gs[ci].top < 0 ? NaN : Math.min(rect.height * 0.9, gs[ci].top * sy);
    }
  }

  function makeSurface(pile, rect, info, word) {
    var o = S.o;
    var cols = Math.max(1, Math.ceil(rect.width / COL));
    var base = new Float32Array(cols);
    if (word) profile(base, word, info.font, rect);
    else base.fill(info.font ? rect.height * 0.22 : 0);

    // Snow height scales with the text size so small text stays readable.
    var max = info.font ? Math.max(1.5, Math.min(o.maxPile, rect.height * 0.18)) : Math.min(o.maxPile * 1.2, 12);

    // Split into runs of equal height (letters of the same shape) and taper the
    // snow at the ends of each run so it forms rounded caps.
    var segs = [], cap = new Float32Array(cols), start = -1, c;
    for (c = 0; c <= cols; c++) {
      var b = c < cols ? base[c] : NaN;
      var breakHere = c === cols || b !== b || (start >= 0 && Math.abs(b - base[start]) > 0.75);
      if (breakHere && start >= 0) { segs.push(start, c - 1); start = -1; }
      if (c < cols && b === b && start < 0) start = c;
    }
    for (var k = 0; k < segs.length; k += 2) {
      for (c = segs[k]; c <= segs[k + 1]; c++) {
        var d = Math.min(c - segs[k], segs[k + 1] - c);
        cap[c] = max * Math.min(1, (d + 0.6) / 2.6);
      }
    }

    if (!pile.h || pile.h.length !== cols) {
      var old = pile.h, h = new Float32Array(cols), tot = 0;
      if (old) for (c = 0; c < cols; c++) h[c] = old[Math.floor(c * old.length / cols)];
      for (c = 0; c < cols; c++) { h[c] = base[c] === base[c] ? Math.min(h[c], cap[c]) : 0; tot += h[c]; }
      pile.h = h;
      pile.total = tot;
    }

    return {
      x: rect.left, y: rect.top, w: rect.width, h: rect.height,
      base: base, cap: cap, segs: segs, pile: pile, fixed: info.fixed
    };
  }

  // True when something else (a sticky header, a modal...) is painted over this point.
  // Pinned elements found covering text are remembered so snow on text scrolling under them is hidden.
  function covered(el, x, y, fixedCache, occluders) {
    if (x < 0 || y < 0 || x >= S.w || y >= S.h) return false;
    var hit = document.elementFromPoint(x, y);
    if (!hit || hit === el || el.contains(hit) || hit.contains(el)) return false;
    var pin = pinnedAncestor(hit, fixedCache);
    if (pin && !pin.contains(el) && !occluders.has(pin)) occluders.set(pin, true);
    return true;
  }

  function hiddenBehind(s, x, y) {
    if (s.fixed) return false;
    for (var i = 0; i < S.occluders.length; i++) {
      var r = S.occluders[i];
      if (x + s.w > r.left && x < r.right && y + s.h * 0.5 > r.top && y < r.bottom) return true;
    }
    return false;
  }

  function scan() {
    if (!S) return;
    var o = S.o, vw = S.w, vh = S.h, margin = vh * 0.6;
    var list = [], infos = new Map(), fixedCache = new Map(), occluders = new Map();
    var range = document.createRange();
    var words = 0, node, i;

    if (o.stick) {
      var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
        acceptNode: function (n) {
          if (n.nodeType === 3) return NodeFilter.FILTER_ACCEPT;
          if (SKIP_TAGS[n.tagName] || n.hasAttribute('data-winter-ignore') || n === S.canvas || n === S.overlay) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_SKIP;
        }
      });

      while ((node = walker.nextNode()) && words < o.maxWords) {
        var text = node.nodeValue;
        if (!text || !NON_WS.test(text)) continue;
        var el = node.parentElement;
        if (!el) continue;
        var info = infos.get(el);
        if (info === undefined) { info = inspect(el, vh, margin, fixedCache); infos.set(el, info); }
        if (!info) continue;

        WORD.lastIndex = 0;
        var m;
        while ((m = WORD.exec(text)) && words < o.maxWords) {
          range.setStart(node, m.index);
          range.setEnd(node, m.index + m[0].length);
          var rects = range.getClientRects();
          for (i = 0; i < rects.length; i++) {
            var r = rects[i];
            if (r.width < 3 || r.height < 6 || r.bottom < -margin || r.top > vh + margin || r.right < 0 || r.left > vw) continue;
            if (covered(el, r.left + r.width / 2, r.top + r.height / 2, fixedCache, occluders)) continue;
            list.push(makeSurface(pileFor(node, m.index + ':' + i), r, info, rects.length === 1 ? m[0] : null));
            words++;
          }
        }
      }

      if (o.surfaces) {
        var els = document.querySelectorAll(o.surfaces);
        for (i = 0; i < els.length; i++) {
          var e = els[i];
          if (e.closest('[data-winter-ignore]')) continue;
          var er = e.getBoundingClientRect();
          if (er.width < 16 || er.height < 4 || er.bottom < -margin || er.top > vh + margin || er.right < 0 || er.left > vw) continue;
          if (covered(e, er.left + er.width / 2, er.top + 2, fixedCache, occluders)) continue;
          list.push(makeSurface(pileFor(e, 'el'), er, { font: null, fixed: !!pinnedAncestor(e, fixedCache) }, null));
        }
      }
    }

    var buckets = {};
    for (i = 0; i < list.length; i++) {
      var s = list[i];
      for (var b = Math.floor(s.x / BIN), e2 = Math.floor((s.x + s.w) / BIN); b <= e2; b++) {
        (buckets[b] || (buckets[b] = [])).push(s);
      }
    }

    S.surfaces = list;
    S.occluders = [];
    occluders.forEach(function (r, el) { if (r) S.occluders.push(el.getBoundingClientRect()); });
    S.buckets = buckets;
    S.scanX = window.scrollX;
    S.scanY = window.scrollY;
    S.lastScan = performance.now();
    S.dirty = false;
  }

  function requestScan(delay) {
    if (!S) return;
    S.dirty = true;
    clearTimeout(S.scanTimer);
    S.scanTimer = setTimeout(scan, delay || 0);
  }

  // ------------------------------------------------------------- simulation

  function resetFlake(f, initial) {
    var o = S.o;
    f.r = o.minSize + (o.maxSize - o.minSize) * Math.pow(Math.random(), 2.2);
    f.x = rand(-20, S.w + 20);
    f.y = initial ? rand(-S.h * 0.2, S.h) : rand(-60, -8);
    f.vy = (0.35 + f.r * 0.3) * o.speed;
    f.sway = rand(0.2, 1);
    f.phase = rand(0, Math.PI * 2);
    f.freq = rand(0.01, 0.03);
    f.alpha = 0.5 + 0.5 * (f.r / o.maxSize);
    f.near = f.r > 1.5; // small, distant flakes drift behind the page and never land
    f.crystal = o.crystals && f.r > o.maxSize * 0.6 && Math.random() < 0.3;
    f.rot = rand(0, Math.PI);
    f.vr = rand(-0.02, 0.02);
    return f;
  }

  function surfY(s) { return s.fixed ? s.y : s.y - (window.scrollY - S.scanY); }
  function surfX(s) { return s.fixed ? s.x : s.x - (window.scrollX - S.scanX); }

  function deposit(s, c, amt, rad) {
    var h = s.pile.h, base = s.base, cap = s.cap, n = h.length, added = 0;
    for (var k = -rad; k <= rad; k++) {
      var i = c + k;
      if (i < 0 || i >= n || base[i] !== base[i]) continue;
      var nh = Math.min(cap[i], h[i] + amt * (1 - Math.abs(k) / (rad + 1)));
      if (nh > h[i]) { added += nh - h[i]; h[i] = nh; }
    }
    s.pile.total += added;
    return added > 0.01;
  }

  // Returns true when the flake moving from y0 to y1 at x landed on something.
  function collide(f, x, y0, y1) {
    var list = S.buckets[Math.floor(x / BIN)];
    if (!list) return false;
    for (var i = 0; i < list.length; i++) {
      var s = list[i];
      var sx = surfX(s);
      if (x < sx || x >= sx + s.w || hiddenBehind(s, sx, surfY(s))) continue;
      var c = Math.floor((x - sx) / COL);
      var b = s.base[c];
      if (b !== b) continue;
      var top = surfY(s) + b - s.pile.h[c];
      if (y0 <= top && y1 >= top) {
        if (Math.random() < 0.85 && deposit(s, c, f.r * 0.45, Math.max(1, Math.round(f.r / COL)))) return true;
      }
    }
    return false;
  }

  function depositGround(x, amt, rad) {
    var g = S.groundH, max = S.o.groundMax;
    var c = Math.floor(x / COL);
    for (var k = -rad; k <= rad; k++) {
      var i = c + k;
      if (i < 0 || i >= g.length) continue;
      g[i] = Math.min(max, g[i] + amt * (1 - Math.abs(k) / (rad + 1)));
    }
  }

  function knock(s, sx, sy, mvx) {
    var h = s.pile.h, spawned = 0;
    for (var c = 0; c < h.length; c++) {
      if (h[c] > 0.6 && spawned < 40 && Math.random() < 0.5) {
        S.puffs.push({
          x: sx + c * COL, y: sy + s.base[c] - h[c],
          vx: rand(-1, 1) + mvx * 0.15, vy: rand(-1.6, -0.2),
          r: rand(0.8, 1.8), life: 1
        });
        spawned++;
      }
      h[c] = 0;
    }
    s.pile.total = 0;
  }

  function update(dt, t) {
    var o = S.o, w = S.w, h = S.h, i;
    var wind = o.wind + Math.sin(t * 0.00023) * 0.35 + Math.sin(t * 0.0011) * 0.12;

    for (i = 0; i < S.flakes.length; i++) {
      var f = S.flakes[i];
      var y0 = f.y;
      f.phase += f.freq * dt;
      f.rot += f.vr * dt;
      f.y += f.vy * dt;
      f.x += (wind * (0.4 + f.r / o.maxSize) + Math.sin(f.phase) * f.sway * 0.45) * dt;
      if (f.x < -30) f.x += w + 60; else if (f.x > w + 30) f.x -= w + 60;

      if (o.stick && f.near && f.y > 0 && collide(f, f.x, y0, f.y)) { resetFlake(f, false); continue; }
      if (o.ground && f.near && f.x >= 0 && f.x < w && f.y >= h - S.groundH[Math.floor(f.x / COL)]) {
        depositGround(f.x, f.r * 0.5, Math.max(2, Math.round(f.r)));
        resetFlake(f, false);
        continue;
      }
      if (f.y > h + 10) resetFlake(f, false);
    }

    // Snow from the flakes you can't see: keeps the build-up visible within a minute.
    if (o.stick && S.visible.length) {
      var drops = S.visible.length * 0.035 * dt * o.stickSpeed;
      drops = Math.floor(drops) + (Math.random() < drops % 1 ? 1 : 0);
      for (i = 0; i < drops; i++) {
        var s = S.visible[(Math.random() * S.visible.length) | 0];
        var c = (Math.random() * s.base.length) | 0;
        if (s.base[c] === s.base[c]) deposit(s, c, rand(0.25, 0.7), 2);
      }
    }
    if (o.ground && Math.random() < 0.6 * dt) depositGround(Math.random() * w, rand(0.2, 0.6), 4);

    // Hovering a snowy word shakes the snow loose.
    if (o.shake && S.mouse.moved) {
      S.mouse.moved = false;
      var mx = S.mouse.x, my = S.mouse.y, list = S.buckets[Math.floor(mx / BIN)];
      if (list) for (i = 0; i < list.length; i++) {
        var q = list[i], qx = surfX(q), qy = surfY(q);
        if (q.pile.total > 0.5 && mx >= qx && mx <= qx + q.w && my >= qy - 10 && my <= qy + q.h) knock(q, qx, qy, S.mouse.vx);
      }
    }

    for (i = S.puffs.length - 1; i >= 0; i--) {
      var p = S.puffs[i];
      p.vy += 0.06 * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= 0.012 * dt;
      if (p.life <= 0 || p.y > h) S.puffs.splice(i, 1);
    }
  }

  // ---------------------------------------------------------------- drawing

  function makeSprite() {
    var c = document.createElement('canvas');
    c.width = c.height = 64;
    var g = c.getContext('2d');
    var grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.42, 'rgba(255,255,255,0.95)');
    grad.addColorStop(0.55, 'rgba(160,190,230,0.55)');
    grad.addColorStop(1, 'rgba(160,190,230,0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, 64, 64);
    return c;
  }

  function drawCrystal(ctx, f) {
    var r = f.r * 2.4;
    ctx.save();
    ctx.translate(f.x, f.y);
    ctx.rotate(f.rot);
    ctx.beginPath();
    for (var a = 0; a < 6; a++) {
      var ang = a * Math.PI / 3, ca = Math.cos(ang), sa = Math.sin(ang);
      ctx.moveTo(0, 0);
      ctx.lineTo(ca * r, sa * r);
      var bx = ca * r * 0.55, by = sa * r * 0.55, br = r * 0.3;
      ctx.moveTo(bx, by); ctx.lineTo(bx + Math.cos(ang + 0.7) * br, by + Math.sin(ang + 0.7) * br);
      ctx.moveTo(bx, by); ctx.lineTo(bx + Math.cos(ang - 0.7) * br, by + Math.sin(ang - 0.7) * br);
    }
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgba(140,175,225,0.55)';
    ctx.lineWidth = 2.2;
    ctx.stroke();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.1;
    ctx.stroke();
    ctx.restore();
  }

  function draw() {
    var ctx = S.ctx, w = S.w, h = S.h, i, c;
    ctx.setTransform(S.dpr, 0, 0, S.dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    // Snow caps on words and surfaces: one path for the bodies, one for the top outlines.
    var body = new Path2D(), rim = new Path2D(), visible = [];
    for (i = 0; i < S.surfaces.length; i++) {
      var s = S.surfaces[i], sy = surfY(s);
      if (sy + s.h < -20 || sy - 20 > h) continue;
      var sx = surfX(s);
      if (sx + s.w < 0 || sx > w || hiddenBehind(s, sx, sy)) continue;
      visible.push(s);
      if (s.pile.total < 0.5) continue;
      var ph = s.pile.h, base = s.base, segs = s.segs;
      for (var k = 0; k < segs.length; k += 2) {
        var a = segs[k], b = segs[k + 1], peak = 0;
        for (c = a; c <= b; c++) if (ph[c] > peak) peak = ph[c];
        if (peak < 0.4) continue;
        var by = sy + base[a];
        var sink = Math.min(1.2, peak * 0.3, s.h * 0.04); // a little snow overlaps the letter so it looks stuck
        var pen = false;
        body.moveTo(sx + a * COL, by + sink);
        for (c = a; c <= b; c++) {
          var px = sx + c * COL + COL / 2, py = by - ph[c];
          body.lineTo(px, py);
          // Outline only where there is real snow, so bare letter tops get no stray lines.
          if (ph[c] >= 0.5) { if (pen) rim.lineTo(px, py); else rim.moveTo(px, py); pen = true; }
          else pen = false;
        }
        body.lineTo(sx + (b + 1) * COL, by);
        body.lineTo(sx + (b + 1) * COL, by + sink);
        body.closePath();
      }
    }
    S.visible = visible;

    // Ground drift
    if (S.o.ground) {
      var g = S.groundH;
      body.moveTo(0, h);
      rim.moveTo(0, h - g[0]);
      for (c = 0; c < g.length; c++) {
        body.lineTo(c * COL, h - g[c]);
        rim.lineTo(c * COL, h - g[c]);
      }
      body.lineTo(w, h);
      body.closePath();
    }

    ctx.save();
    ctx.translate(0, 1.5);
    ctx.fillStyle = 'rgba(110,140,195,0.5)';
    ctx.fill(body);
    ctx.restore();
    ctx.fillStyle = '#fff';
    ctx.fill(body);
    ctx.strokeStyle = 'rgba(140,170,215,0.6)';
    ctx.lineWidth = 0.8;
    ctx.lineJoin = 'round';
    ctx.stroke(rim);

    // Puffs knocked off words
    for (i = 0; i < S.puffs.length; i++) {
      var p = S.puffs[i];
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.drawImage(S.sprite, p.x - p.r * 2, p.y - p.r * 2, p.r * 4, p.r * 4);
    }

    // Falling flakes
    for (i = 0; i < S.flakes.length; i++) {
      var f = S.flakes[i];
      ctx.globalAlpha = f.alpha;
      if (f.crystal) drawCrystal(ctx, f);
      else ctx.drawImage(S.sprite, f.x - f.r * 2, f.y - f.r * 2, f.r * 4, f.r * 4);
    }
    ctx.globalAlpha = 1;
  }

  function frame(t) {
    if (!S) return;
    S.raf = requestAnimationFrame(frame);
    var dt = S.last ? Math.min(3, (t - S.last) / 16.667) : 1;
    S.last = t;
    if (!S.dirty && t - S.lastScan > 2000) scan(); // catch animations, lazy images, late fonts
    update(dt, t);
    draw();
  }

  // ------------------------------------------------------------------ setup

  var CSS =
    'html.winter-mode-frost body{text-shadow:0 0 1px rgba(255,255,255,.7),0 0 8px rgba(170,210,255,.5)}' +
    '.winter-mode-canvas,.winter-mode-overlay{position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;opacity:0;transition:opacity 1.2s ease}' +
    '.winter-mode-overlay{box-shadow:inset 0 0 120px rgba(215,235,255,.55),inset 0 0 30px rgba(235,245,255,.6);' +
    'background:radial-gradient(ellipse at center,rgba(255,255,255,0) 60%,rgba(200,225,255,.22) 100%)}' +
    '.winter-mode-on .winter-mode-canvas,.winter-mode-on .winter-mode-overlay{opacity:1}';

  function resize() {
    if (!S) return;
    var w = window.innerWidth, h = window.innerHeight;
    S.dpr = Math.min(window.devicePixelRatio || 1, 2);
    S.w = w;
    S.h = h;
    S.canvas.width = Math.round(w * S.dpr);
    S.canvas.height = Math.round(h * S.dpr);
    var g = new Float32Array(Math.ceil(w / COL) + 1);
    if (S.groundH) g.set(S.groundH.subarray(0, Math.min(g.length, S.groundH.length)));
    S.groundH = g;
    var want = Math.round(S.o.flakes * Math.min(1.6, Math.max(0.35, (w * h) / (1440 * 900))));
    while (S.flakes.length < want) S.flakes.push(resetFlake({}, true));
    S.flakes.length = want;
    requestScan(150);
  }

  function start(options) {
    if (!isBrowser) return api;
    if (S) stop();
    if (!document.body) {
      document.addEventListener('DOMContentLoaded', function () { start(options); }, { once: true });
      return api;
    }
    var o = assign({}, DEFAULTS, options);
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce && o.reducedMotion === 'off') return api;
    if (reduce && o.reducedMotion === 'reduce') { o.flakes = Math.round(o.flakes * 0.3); o.speed *= 0.5; o.shake = false; }

    if (!measureCtx) measureCtx = document.createElement('canvas').getContext('2d');

    var style = document.createElement('style');
    style.setAttribute('data-winter-mode', '');
    style.textContent = CSS;
    document.head.appendChild(style);

    var overlay = null;
    if (o.tint) {
      overlay = document.createElement('div');
      overlay.className = 'winter-mode-overlay';
      overlay.setAttribute('aria-hidden', 'true');
      overlay.style.zIndex = o.zIndex - 1;
      document.body.appendChild(overlay);
    }

    var canvas = document.createElement('canvas');
    canvas.className = 'winter-mode-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.zIndex = o.zIndex;
    document.body.appendChild(canvas);

    S = {
      o: o, canvas: canvas, overlay: overlay, style: style, ctx: canvas.getContext('2d'),
      sprite: makeSprite(), flakes: [], puffs: [], surfaces: [], visible: [], buckets: {},
      groundH: null, occluders: [], scanX: 0, scanY: 0, lastScan: 0, last: 0, dirty: true,
      mouse: { x: -1, y: -1, vx: 0, moved: false }, listeners: []
    };

    function on(target, type, fn, opts) {
      target.addEventListener(type, fn, opts);
      S.listeners.push([target, type, fn, opts]);
    }

    on(window, 'resize', resize);
    on(document, 'scroll', function (e) {
      // Page scrolls are tracked by offset; anything else (scroll containers, horizontal) needs a rescan.
      var t = e.target;
      if (t === document || t === document.documentElement || t === document.body) {
        requestScan(window.scrollX !== S.scanX || performance.now() - S.lastScan > 120 ? 0 : 120);
      } else {
        requestScan(60);
      }
    }, { capture: true, passive: true });
    on(window, 'mousemove', function (e) {
      S.mouse.vx = e.clientX - S.mouse.x;
      S.mouse.x = e.clientX;
      S.mouse.y = e.clientY;
      S.mouse.moved = true;
    }, { passive: true });
    on(document, 'visibilitychange', function () {
      if (document.hidden) { cancelAnimationFrame(S.raf); S.raf = 0; }
      else if (!S.raf) { S.last = 0; S.raf = requestAnimationFrame(frame); }
    });
    on(window, 'load', function () { requestScan(0); });

    if (window.MutationObserver) {
      S.observer = new MutationObserver(function (records) {
        for (var i = 0; i < records.length; i++) {
          var t = records[i].target;
          if (t !== canvas && t !== overlay && t !== style && t !== document.head) { requestScan(250); return; }
        }
      });
      S.observer.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['class', 'style', 'hidden'] });
    }
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { glyphCache = {}; fontCache = {}; requestScan(0); });
    }

    resize();
    scan();
    document.documentElement.classList.add('winter-mode-on');
    if (o.frost) document.documentElement.classList.add('winter-mode-frost');
    if (!document.hidden) S.raf = requestAnimationFrame(frame);
    return api;
  }

  function stop() {
    if (!S) return api;
    cancelAnimationFrame(S.raf);
    clearTimeout(S.scanTimer);
    if (S.observer) S.observer.disconnect();
    for (var i = 0; i < S.listeners.length; i++) {
      var l = S.listeners[i];
      l[0].removeEventListener(l[1], l[2], l[3]);
    }
    S.canvas.remove();
    if (S.overlay) S.overlay.remove();
    S.style.remove();
    document.documentElement.classList.remove('winter-mode-on', 'winter-mode-frost');
    S = null;
    return api;
  }

  // Shakes all the settled snow off the page.
  function clear() {
    piles = new WeakMap();
    if (S) {
      S.groundH.fill(0);
      scan();
    }
    return api;
  }

  function toggle(options) { return S ? stop() : start(options); }
  function isRunning() { return !!S; }

  // Reads options from data-* attributes, e.g. <script data-flakes="200" data-ground="false">.
  function autoStart(dataset) {
    if (!isBrowser) return api;
    var opts = {};
    if (dataset) {
      for (var k in DEFAULTS) {
        var v = dataset[k];
        if (v === undefined) continue;
        if (typeof DEFAULTS[k] === 'number') opts[k] = parseFloat(v);
        else if (typeof DEFAULTS[k] === 'boolean') opts[k] = v !== 'false';
        else opts[k] = v;
      }
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () { start(opts); }, { once: true });
    } else {
      start(opts);
    }
    return api;
  }

  var api = {
    version: VERSION,
    defaults: DEFAULTS,
    start: start,
    stop: stop,
    toggle: toggle,
    clear: clear,
    isRunning: isRunning,
    autoStart: autoStart
  };
  return api;
});
