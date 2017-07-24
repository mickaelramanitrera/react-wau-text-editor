"use strict";

module.exports = function (t) {
  function e(r) {
    if (n[r]) return n[r].exports;var a = n[r] = { i: r, l: !1, exports: {} };return t[r].call(a.exports, a, a.exports, e), a.l = !0, a.exports;
  }var n = {};return e.m = t, e.c = n, e.d = function (t, n, r) {
    e.o(t, n) || Object.defineProperty(t, n, { configurable: !1, enumerable: !0, get: r });
  }, e.n = function (t) {
    var n = t && t.__esModule ? function () {
      return t.default;
    } : function () {
      return t;
    };return e.d(n, "a", n), n;
  }, e.o = function (t, e) {
    return Object.prototype.hasOwnProperty.call(t, e);
  }, e.p = "", e(e.s = 1);
}([function (t, e, n) {
  "use strict";
  function r(t) {
    return t && S[t];
  }function a(t) {
    var e = "";return (0, L.forEach)(t, function (t, n) {
      n && (e += t + ":" + n + ";");
    }), e;
  }function u(t, e) {
    var n = [];if (e) for (var r = 0, a = 0, u = t, i = e.trigger || "#", s = e.separator || " "; u.length > 0 && a >= 0;) {
      if (u[0] === i ? (a = 0, r = 0, u = u.substr(i.length)) : (a = u.indexOf(s + i)) >= 0 && (u = u.substr(a + (s + i).length), r += a + s.length), a >= 0) {
        var o = u.indexOf(s) >= 0 ? u.indexOf(s) : u.length,
            f = u.substr(0, o);f && f.length > 0 && n.push({ offset: r, length: f.length + i.length, type: "HASHTAG" }), r += i.length;
      }
    }return n;
  }function i(t, e) {
    var n = [],
        r = 0,
        a = t.entityRanges.map(function (t) {
      return { offset: t.offset, length: t.length, key: t.key, type: "ENTITY" };
    });return a = a.concat(u(t.text, e)), a = a.sort(function (t, e) {
      return t.offset - e.offset;
    }), a.forEach(function (t) {
      t.offset > r && n.push({ start: r, end: t.offset }), n.push({ start: t.offset, end: t.offset + t.length, entityKey: t.key, type: t.type }), r = t.offset + t.length;
    }), r < t.text.length && n.push({ start: r, end: t.text.length }), n;
  }function s(t) {
    return !!(t.entityRanges.length > 0 && (0, L.isEmptyString)(t.text) || "atomic" === t.type);
  }function o(t) {
    var e = t.text,
        n = t.inlineStyleRanges,
        r = { BOLD: new Array(e.length), ITALIC: new Array(e.length), UNDERLINE: new Array(e.length), STRIKETHROUGH: new Array(e.length), CODE: new Array(e.length), SUPERSCRIPT: new Array(e.length), SUBSCRIPT: new Array(e.length), COLOR: new Array(e.length), BGCOLOR: new Array(e.length), FONTSIZE: new Array(e.length), FONTFAMILY: new Array(e.length), length: e.length };return n && n.length > 0 && n.forEach(function (t) {
      for (var e = t.offset, n = e + t.length, a = e; a < n; a += 1) {
        0 === t.style.indexOf("color-") ? r.COLOR[a] = t.style.substring(6) : 0 === t.style.indexOf("bgcolor-") ? r.BGCOLOR[a] = t.style.substring(8) : 0 === t.style.indexOf("fontsize-") ? r.FONTSIZE[a] = t.style.substring(9) : 0 === t.style.indexOf("fontfamily-") ? r.FONTFAMILY[a] = t.style.substring(11) : r[t.style] && (r[t.style][a] = !0);
      }
    }), r;
  }function f(t, e) {
    var n = {};return t.COLOR[e] && (n.COLOR = t.COLOR[e]), t.BGCOLOR[e] && (n.BGCOLOR = t.BGCOLOR[e]), t.FONTSIZE[e] && (n.FONTSIZE = t.FONTSIZE[e]), t.FONTFAMILY[e] && (n.FONTFAMILY = t.FONTFAMILY[e]), t.UNDERLINE[e] && (n.UNDERLINE = !0), t.ITALIC[e] && (n.ITALIC = !0), t.BOLD[e] && (n.BOLD = !0), t.STRIKETHROUGH[e] && (n.STRIKETHROUGH = !0), t.CODE[e] && (n.CODE = !0), t.SUBSCRIPT[e] && (n.SUBSCRIPT = !0), t.SUPERSCRIPT[e] && (n.SUPERSCRIPT = !0), n;
  }function l(t, e, n) {
    var r = !0;return n > 0 && n < t.length ? e.forEach(function (e) {
      r = r && t[e][n] === t[e][n - 1];
    }) : r = !1, r;
  }function h(t, e) {
    return "BOLD" === t ? "<strong>" + e + "</strong>" : "ITALIC" === t ? "<em>" + e + "</em>" : "UNDERLINE" === t ? "<ins>" + e + "</ins>" : "STRIKETHROUGH" === t ? "<del>" + e + "</del>" : "CODE" === t ? "<code>" + e + "</code>" : "SUPERSCRIPT" === t ? "<sup>" + e + "</sup>" : "SUBSCRIPT" === t ? "<sub>" + e + "</sub>" : e;
  }function c(t) {
    if (t && t.length > 0) {
      return t.map(function (t) {
        switch (t) {case "\n":
            return "<br>";case "&":
            return "&amp;";case "<":
            return "&lt;";case ">":
            return "&gt;";default:
            return t;}
      }).join("");
    }return "";
  }function g(t, e) {
    if (t && (t.COLOR || t.BGCOLOR || t.FONTSIZE || t.FONTFAMILY)) {
      var n = 'style="';return t.COLOR && (n += "color: " + t.COLOR + ";"), t.BGCOLOR && (n += "background-color: " + t.BGCOLOR + ";"), t.FONTSIZE && (n += "font-size: " + t.FONTSIZE + "px;"), t.FONTFAMILY && (n += "font-family: " + t.FONTFAMILY + ";"), "<span " + (n += '"') + ">" + e + "</span>";
    }return e;
  }function p(t, e, n, r) {
    var a = t[e];if ("function" == typeof r) {
      var u = r(a, n);if (u) return u;
    }if ("MENTION" === a.type) return '<a href="' + a.data.url + '" class="wysiwyg-mention" data-mention data-value="' + a.data.value + '">' + n + "</a>";if ("LINK" === a.type) {
      var i = a.data.target || "_blank";return '<a href="' + a.data.url + '" target="' + i + '" >' + n + "</a>";
    }return "IMAGE" === a.type ? '<img src="' + a.data.src + '" alt="' + a.data.alt + '" style="float:' + (a.data.alignment || "none") + ";height: " + a.data.height + ";width: " + a.data.width + '"/>' : "EMBEDDED_LINK" === a.type ? '<iframe width="' + a.data.width + '" height="' + a.data.height + '" src="' + a.data.src + '" frameBorder="0"></iframe>' : n;
  }function y(t, e, n, r) {
    var a = [],
        u = t.text;if (u.length > 0) for (var i = o(t), s = void 0, h = n; h < r; h += 1) {
      h !== n && l(i, e, h) ? (s.text.push(u[h]), s.end = h + 1) : (s = { styles: f(i, h), text: [u[h]], start: h, end: h + 1 }, a.push(s));
    }return a;
  }function O(t) {
    if (t) {
      for (var e = t, n = 0; n < e.length && " " === t[n]; n += 1) {
        e = e.replace(" ", "&nbsp;");
      }return e;
    }return t;
  }function d(t) {
    if (t) {
      for (var e = t, n = e.length - 1; n >= 0 && " " === e[n]; n -= 1) {
        e = e.substring(0, n) + "&nbsp;" + e.substring(n + 1);
      }return e;
    }return t;
  }function I(t) {
    var e = t.styles,
        n = t.text,
        r = c(n);return (0, L.forEach)(e, function (t, e) {
      r = h(t, r, e);
    }), r;
  }function T(t, e) {
    var n = y(t, ["BOLD", "ITALIC", "UNDERLINE", "STRIKETHROUGH", "CODE", "SUPERSCRIPT", "SUBSCRIPT"], e.start, e.end),
        r = "";return n.forEach(function (t) {
      r += I(t);
    }), r = g(e.styles, r);
  }function v(t, e, n, r) {
    var a = [];y(t, ["COLOR", "BGCOLOR", "FONTSIZE", "FONTFAMILY"], n.start, n.end).forEach(function (e) {
      a.push(T(t, e));
    });var u = a.join("");return "ENTITY" === n.type ? void 0 !== n.entityKey && null !== n.entityKey && (u = p(e, n.entityKey, u, r)) : "HASHTAG" === n.type && (u = '<a href="' + u + '" class="wysiwyg-hashtag">' + u + "</a>"), u;
  }function E(t, e, n, r) {
    var a = [],
        u = i(t, n);return u.forEach(function (n, i) {
      var s = v(t, e, n, r);0 === i && (s = O(s)), i === u.length - 1 && (s = d(s)), a.push(s);
    }), a.join("");
  }function R(t, e, n, u, i) {
    var o = [];if (s(t)) o.push(p(e, t.entityRanges[0].key, void 0, i));else {
      var f = r(t.type);if (f) {
        o.push("<" + f);var l = a(t.data);l && o.push(' style="' + l + '"'), u && o.push(' dir = "auto"'), o.push(">"), o.push(E(t, e, n, i)), o.push("</" + f + ">");
      }
    }return o.push("\n"), o.join("");
  }Object.defineProperty(e, "__esModule", { value: !0 }), e.getBlockTag = r, e.getBlockStyle = a, e.getStylesAtOffset = f, e.sameStyleAsPrevious = l, e.addInlineStyleMarkup = h, e.addStylePropertyMarkup = g, e.trimLeadingZeros = O, e.trimTrailingZeros = d, e.getBlockInnerMarkup = E, e.getBlockMarkup = R;var L = n(3),
      S = { unstyled: "p", "header-one": "h1", "header-two": "h2", "header-three": "h3", "header-four": "h4", "header-five": "h5", "header-six": "h6", "unordered-list-item": "ul", "ordered-list-item": "ol", blockquote: "blockquote" };
}, function (t, e, n) {
  t.exports = n(2);
}, function (t, e, n) {
  "use strict";
  function r(t, e, n, r) {
    var i = [];if (t) {
      var s = t.blocks,
          o = t.entityMap;if (s && s.length > 0) {
        var f = [];if (s.forEach(function (t) {
          if ((0, u.isList)(t.type)) f.push(t);else {
            if (f.length > 0) {
              var s = (0, u.getListMarkup)(f, o, e, r);i.push(s), f = [];
            }var l = (0, a.getBlockMarkup)(t, o, e, n, r);i.push(l);
          }
        }), f.length > 0) {
          var l = (0, u.getListMarkup)(f, o, e, n, r);i.push(l), f = [];
        }
      }
    }return i.join("");
  }Object.defineProperty(e, "__esModule", { value: !0 }), e.default = r;var a = n(0),
      u = n(4);
}, function (t, e, n) {
  "use strict";
  function r(t, e) {
    if (t) for (var n in t) {
      ({}).hasOwnProperty.call(t, n) && e(n, t[n]);
    }
  }function a(t) {
    return void 0 === t || null === t || 0 === t.length || 0 === t.trim().length;
  }Object.defineProperty(e, "__esModule", { value: !0 }), e.forEach = r, e.isEmptyString = a;
}, function (t, e, n) {
  "use strict";
  function r(t) {
    return "unordered-list-item" === t || "ordered-list-item" === t;
  }function a(t, e, n, r, i) {
    var s = [],
        o = [],
        f = void 0;return t.forEach(function (t) {
      var l = !1;if (f ? f.type !== t.type ? (s.push("</" + (0, u.getBlockTag)(f.type) + ">\n"), s.push("<" + (0, u.getBlockTag)(t.type) + ">\n")) : f.depth === t.depth ? o && o.length > 0 && (s.push(a(o, e, n, r, i)), o = []) : (l = !0, o.push(t)) : s.push("<" + (0, u.getBlockTag)(t.type) + ">\n"), !l) {
        s.push("<li");var h = (0, u.getBlockStyle)(t.data);h && s.push(' style="' + h + '"'), r && s.push(' dir = "auto"'), s.push(">"), s.push((0, u.getBlockInnerMarkup)(t, e, n, i)), s.push("</li>\n"), f = t;
      }
    }), o && o.length > 0 && s.push(a(o, e, n, r, i)), s.push("</" + (0, u.getBlockTag)(f.type) + ">\n"), s.join("");
  }Object.defineProperty(e, "__esModule", { value: !0 }), e.isList = r, e.getListMarkup = a;var u = n(0);
}]);