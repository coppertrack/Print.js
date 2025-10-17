const d = {
  // Firefox 1.0+
  isFirefox: () => typeof InstallTrigger < "u",
  getFirefoxMajorVersion: (e) => {
    e = e || navigator.userAgent;
    const n = /firefox\/(\S+)/, t = e.toLowerCase().match(n);
    if (t)
      return t[1].split(".").map((i) => parseInt(i))[0];
  },
  // Internet Explorer 6-11
  isIE: () => navigator.userAgent.indexOf("MSIE") !== -1 || !!document.documentMode,
  // Edge 20+
  isEdge: () => !d.isIE() && !!window.StyleMedia,
  // Chrome 1+
  isChrome: (e = window) => !!e.chrome,
  // At least Safari 3+: "[object HTMLElementConstructor]"
  isSafari: () => Object.prototype.toString.call(window.HTMLElement).indexOf("Constructor") > 0 || navigator.userAgent.toLowerCase().indexOf("safari") !== -1,
  // IOS Chrome
  isIOSChrome: () => navigator.userAgent.toLowerCase().indexOf("crios") !== -1
}, f = {
  show(e) {
    const n = "font-family:sans-serif; display:table; text-align:center; font-weight:300; font-size:30px; left:0; top:0;position:fixed; z-index: 9990;color: #0460B5; width: 100%; height: 100%; background-color:rgba(255,255,255,.9);transition: opacity .3s ease;", t = document.createElement("div");
    t.setAttribute("style", n), t.setAttribute("id", "printJS-Modal");
    const i = document.createElement("div");
    i.setAttribute("style", "display:table-cell; vertical-align:middle; padding-bottom:100px;");
    const o = document.createElement("div");
    o.setAttribute("class", "printClose"), o.setAttribute("id", "printClose"), i.appendChild(o);
    const r = document.createElement("span");
    r.setAttribute("class", "printSpinner"), i.appendChild(r);
    const l = document.createTextNode(e.modalMessage);
    i.appendChild(l), t.appendChild(i), document.getElementsByTagName("body")[0].appendChild(t), document.getElementById("printClose").addEventListener("click", function() {
      f.close();
    });
  },
  close() {
    const e = document.getElementById("printJS-Modal");
    e && e.parentNode.removeChild(e);
  }
};
function m(e) {
  return e.charAt(0).toUpperCase() + e.slice(1);
}
function E(e, n) {
  const t = document.defaultView || window;
  let i = "";
  const o = t.getComputedStyle(e, "");
  for (let r = 0; r < o.length; r++)
    (n.targetStyles.indexOf("*") !== -1 || n.targetStyle.indexOf(o[r]) !== -1 || S(n.targetStyles, o[r])) && o.getPropertyValue(o[r]) && (i += o[r] + ":" + o.getPropertyValue(o[r]) + ";");
  return i += "max-width: " + n.maxWidth + "px !important; font-size: " + n.font_size + " !important;", i;
}
function S(e, n) {
  for (let t = 0; t < e.length; t++)
    if (typeof n == "object" && n.indexOf(e[t]) !== -1) return !0;
  return !1;
}
function u(e, n) {
  const t = document.createElement("div");
  if (w(n.header))
    t.innerHTML = n.header;
  else {
    const i = document.createElement("h1"), o = document.createTextNode(n.header);
    i.appendChild(o), i.setAttribute("style", n.headerStyle), t.appendChild(i);
  }
  e.insertBefore(t, e.childNodes[0]);
}
function b(e, n) {
  const t = document.createElement("div");
  if (w(n.footer))
    t.innerHTML = n.footer;
  else {
    const i = document.createElement("h1"), o = document.createTextNode(n.footer);
    i.appendChild(o), i.setAttribute("style", n.footerStyle), t.appendChild(i);
  }
  e.insertBefore(t, e.childNodes.lastChild);
}
function a(e) {
  e.showModal && f.close(), e.onLoadingEnd && e.onLoadingEnd(), (e.showModal || e.onLoadingStart) && window.URL.revokeObjectURL(e.printable);
  let n = "mouseover";
  (d.isChrome() || d.isFirefox()) && (n = "focus");
  const t = () => {
    window.removeEventListener(n, t), e.onPrintDialogClose();
    const i = document.getElementById(e.frameId);
    i && (e.frameRemoveDelay ? setTimeout(
      () => {
        i.remove();
      },
      e.frameRemoveDelay
    ) : i.remove());
  };
  window.addEventListener(n, t);
}
function w(e) {
  return /<([A-Za-z][A-Za-z0-9]*)\b[^>]*>(.*?)<\/\1>/.test(e);
}
const c = {
  send: (e, n) => {
    document.getElementsByTagName("body")[0].appendChild(n);
    const t = document.getElementById(e.frameId);
    t.onload = () => {
      if (e.type === "pdf") {
        d.isFirefox() && d.getFirefoxMajorVersion(navigator.userAgent) < 110 || d.isSafari() ? setTimeout(() => s(t, e), 500) : s(t, e);
        return;
      }
      let i = t.contentWindow || t.contentDocument;
      if (i.document && (i = i.document), i.body.appendChild(e.printableElement), e.style) {
        const r = document.createElement("style");
        r.innerHTML = e.style, i.head.appendChild(r);
      }
      const o = i.getElementsByTagName("img");
      o.length > 0 ? x(Array.from(o)).then(() => s(t, e)) : s(t, e);
    };
  }
};
function s(e, n) {
  try {
    if (e.focus(), !e.contentWindow)
      throw new Error("iframe contentWindow is not accessible");
    if (d.isEdge() || d.isIE())
      try {
        e.contentWindow.document.execCommand("print", !1, null);
      } catch {
        setTimeout(function() {
          e.contentWindow && e.contentWindow.print();
        }, 1e3);
      }
    else
      setTimeout(function() {
        e.contentWindow && e.contentWindow.print();
      }, 1e3);
  } catch (t) {
    n.onError(t);
  } finally {
    (d.isFirefox() && d.getFirefoxMajorVersion(navigator.userAgent) < 110 || d.isSafari()) && (e.style.visibility = "hidden", e.style.left = "-1px"), a(n);
  }
}
function x(e) {
  const n = e.map((t) => t.src && t.src !== window.location.href ? v(t) : Promise.resolve());
  return Promise.all(n);
}
function v(e) {
  return new Promise((n) => {
    const t = () => {
      !e || typeof e.naturalWidth > "u" || e.naturalWidth === 0 || !e.complete ? setTimeout(t, 500) : n();
    };
    t();
  });
}
const C = ["http:", "https:", "blob:", "data:application/pdf"];
function L(e) {
  if (!e || typeof e != "string")
    return !1;
  const n = e.trim();
  if (n === "" || n.startsWith("//"))
    return !1;
  try {
    const t = new URL(n, window.location.origin);
    return C.includes(t.protocol) ? !0 : t.protocol === "data:" ? n.toLowerCase().startsWith("data:application/pdf") : !1;
  } catch {
    return !n.includes(":");
  }
}
function A(e) {
  if (!e || typeof e != "string")
    return !1;
  const n = e.trim();
  if (n === "" || n.startsWith("//"))
    return !1;
  try {
    const t = new URL(n, window.location.origin);
    return t.protocol === "http:" || t.protocol === "https:" ? !0 : t.protocol === "data:" ? n.toLowerCase().startsWith("data:application/pdf") : !1;
  } catch {
    return !1;
  }
}
function T(e) {
  if (!e || typeof e != "string")
    return !1;
  const n = e.trim();
  if (n === "" || n.startsWith("//") || n.match(/^(javascript|data|vbscript|file):/i))
    return !1;
  try {
    const t = new URL(n, window.location.origin);
    return t.protocol === "http:" || t.protocol === "https:";
  } catch {
    return !n.includes("<") && !n.includes(">");
  }
}
const I = {
  print: (e, n) => {
    if (e.base64) {
      const o = e.printable;
      o.indexOf(",") !== -1 && (e.printable = o.split(",")[1]);
      const r = Uint8Array.from(atob(e.printable), (l) => l.charCodeAt(0));
      y(e, n, r);
      return;
    }
    const t = e.printable;
    if (!L(t)) {
      a(e), e.onError(new Error("Invalid or unsafe URL provided for printable PDF"));
      return;
    }
    e.printable = /^(blob:|https?:)/i.test(t) ? t : window.location.origin + (t.charAt(0) !== "/" ? "/" + t : t);
    const i = new window.XMLHttpRequest();
    i.responseType = "arraybuffer", i.addEventListener("error", () => {
      a(e), e.onError(new Error(i.statusText));
    }), i.addEventListener("load", () => {
      if ([200, 201].indexOf(i.status) === -1) {
        a(e), e.onError(new Error(i.statusText));
        return;
      }
      y(e, n, i.response);
    }), i.open("GET", e.printable, !0), i.send();
  }
};
function y(e, n, t) {
  const i = new window.Blob([t], { type: "application/pdf" }), o = window.URL.createObjectURL(i);
  n.setAttribute("src", o), c.send(e, n);
}
const P = {
  print: (e, n) => {
    const t = k(e.printable) ? e.printable : document.getElementById(e.printable);
    if (!t) {
      window.console.error("Invalid HTML element id: " + e.printable);
      return;
    }
    e.printableElement = g(t, e), e.header && u(e.printableElement, e), e.footer && b(e.printableElement, e), c.send(e, n);
  }
};
function g(e, n) {
  const t = e.cloneNode(), i = Array.prototype.slice.call(e.childNodes);
  for (let o = 0; o < i.length; o++) {
    if (n.ignoreElements.indexOf(i[o].id) !== -1)
      continue;
    const r = g(i[o], n);
    t.appendChild(r);
  }
  switch (n.scanStyles && e.nodeType === 1 && t.setAttribute("style", E(e, n)), e.tagName) {
    case "SELECT":
      t.value = e.value;
      break;
    case "CANVAS":
      t.getContext("2d").drawImage(e, 0, 0);
      break;
  }
  return t;
}
function k(e) {
  return typeof e == "object" && e && e.nodeType === 1;
}
const M = {
  print: (e, n) => {
    e.printableElement = document.createElement("div"), e.printableElement.setAttribute("style", "width:100%"), e.printableElement.innerHTML = e.printable, e.header && u(e.printableElement, e), e.footer && b(e.printableElement, e), c.send(e, n);
  }
}, O = {
  print: (e, n) => {
    e.printable.constructor !== Array && (e.printable = [e.printable]), e.printableElement = document.createElement("div"), e.printable.forEach((t) => {
      const i = document.createElement("img");
      if (i.setAttribute("style", e.imageStyle), i.src = t, d.isFirefox()) {
        const r = i.src;
        i.src = r;
      }
      const o = document.createElement("div");
      o.appendChild(i), e.printableElement.appendChild(o);
    }), e.header && u(e.printableElement, e), e.footer && b(e.printableElement, e), c.send(e, n);
  }
}, j = {
  print: (e, n) => {
    if (typeof e.printable != "object")
      throw new Error("Invalid javascript data object (JSON).");
    if (typeof e.repeatTableHeader != "boolean")
      throw new Error("Invalid value for repeatTableHeader attribute (JSON).");
    if (!e.properties || !Array.isArray(e.properties))
      throw new Error("Invalid properties array for your JSON data.");
    e.properties = e.properties.map((t) => ({
      field: typeof t == "object" ? t.field : t,
      displayName: typeof t == "object" ? t.displayName : t,
      columnSize: typeof t == "object" && t.columnSize ? t.columnSize + ";" : 100 / e.properties.length + "%;"
    })), e.printableElement = document.createElement("div"), e.header && u(e.printableElement, e), e.printableElement.innerHTML += N(e), e.footer && b(e.printableElement, e), c.send(e, n);
  }
};
function N(e) {
  const n = e.printable, t = e.properties;
  let i = '<table style="border-collapse: collapse; width: 100%;">';
  e.repeatTableHeader && (i += "<thead>"), i += "<tr>";
  for (let o = 0; o < t.length; o++)
    i += '<th style="width:' + t[o].columnSize + ";" + e.gridHeaderStyle + '">' + m(t[o].displayName) + "</th>";
  i += "</tr>", e.repeatTableHeader && (i += "</thead>"), i += "<tbody>";
  for (let o = 0; o < n.length; o++) {
    i += "<tr>";
    for (let r = 0; r < t.length; r++) {
      let l = n[o];
      const p = t[r].field.split(".");
      if (p.length > 1)
        for (let h = 0; h < p.length; h++)
          l = l[p[h]];
      else
        l = l[t[r].field];
      i += '<td style="width:' + t[r].columnSize + e.gridStyle + '">' + l + "</td>";
    }
    i += "</tr>";
  }
  return i += "</tbody></table>", i;
}
const H = ["pdf", "html", "image", "json", "raw-html"], R = {
  init(e, n) {
    const t = {
      printable: null,
      fallbackPrintable: null,
      type: "pdf",
      header: null,
      headerStyle: "font-weight: 300;",
      footer: null,
      footerStyle: "font-weight: 300;",
      maxWidth: 800,
      properties: null,
      gridHeaderStyle: "font-weight: bold; padding: 5px; border: 1px solid #dddddd;",
      gridStyle: "border: 1px solid lightgray; margin-bottom: -1px;",
      showModal: !1,
      onError: (r) => {
        throw r;
      },
      onLoadingStart: null,
      onLoadingEnd: null,
      onPrintDialogClose: () => {
      },
      onIncompatibleBrowser: () => {
      },
      modalMessage: "Retrieving Document...",
      frameId: "printJS",
      frameRemoveDelay: null,
      printableElement: null,
      documentTitle: "Document",
      targetStyle: ["clear", "display", "width", "min-width", "height", "min-height", "max-height"],
      targetStyles: ["border", "box", "break", "text-decoration"],
      ignoreElements: [],
      repeatTableHeader: !0,
      css: null,
      style: null,
      scanStyles: !0,
      base64: !1,
      // Deprecated
      onPdfOpen: null,
      font: "TimesNewRoman",
      font_size: "12pt",
      honorMarginPadding: !0,
      honorColor: !1,
      imageStyle: "max-width: 100%;"
    };
    if (e === void 0)
      throw new Error("printJS expects at least 1 attribute.");
    switch (typeof e) {
      case "string":
        t.printable = encodeURI(e), t.fallbackPrintable = t.printable, t.type = n || t.type;
        break;
      case "object":
        t.printable = e.printable || null, t.fallbackPrintable = typeof e.fallbackPrintable < "u" ? e.fallbackPrintable : t.printable, t.fallbackPrintable = t.base64 ? `data:application/pdf;base64,${t.fallbackPrintable}` : t.fallbackPrintable, Object.keys(t).forEach((r) => {
          if (r === "printable" || r === "fallbackPrintable") return;
          const l = r;
          typeof e[l] < "u" && (t[l] = e[l]);
        });
        break;
      default:
        throw new Error('Unexpected argument type! Expected "string" or "object", got ' + typeof e);
    }
    if (!t.printable) throw new Error("Missing printable information.");
    if (!t.type || typeof t.type != "string" || H.indexOf(t.type.toLowerCase()) === -1)
      throw new Error("Invalid print type. Available types are: pdf, html, image and json.");
    t.showModal && f.show(t), t.onLoadingStart && t.onLoadingStart();
    const i = document.getElementById(t.frameId);
    i && i.parentNode && i.parentNode.removeChild(i);
    const o = document.createElement("iframe");
    switch (d.isFirefox() ? o.setAttribute("style", "width: 1px; height: 100px; position: fixed; left: 0; top: 0; opacity: 0; border-width: 0; margin: 0; padding: 0") : o.setAttribute("style", "visibility: hidden; height: 0; width: 0; position: absolute; border: 0"), o.setAttribute("id", t.frameId), t.type !== "pdf" && (o.srcdoc = "<html><head><title>" + t.documentTitle + "</title>", t.css && (Array.isArray(t.css) ? t.css : [t.css]).forEach((l) => {
      T(l) ? o.srcdoc += '<link rel="stylesheet" href="' + l + '">' : console.warn("Print.js: Skipping invalid CSS path:", l);
    }), o.srcdoc += "</head><body></body></html>"), t.type) {
      case "pdf":
        if (d.isIE())
          try {
            if (console.info("Print.js doesn't support PDF printing in Internet Explorer."), t.fallbackPrintable && A(t.fallbackPrintable)) {
              const l = window.open(t.fallbackPrintable, "_blank");
              l && l.focus();
            } else if (t.fallbackPrintable)
              throw new Error("Invalid or unsafe URL provided for fallbackPrintable");
            const r = t.onIncompatibleBrowser;
            r && r();
          } catch (r) {
            t.onError(r);
          } finally {
            t.showModal && f.close(), t.onLoadingEnd && t.onLoadingEnd();
          }
        else
          I.print(t, o);
        break;
      case "image":
        O.print(t, o);
        break;
      case "html":
        P.print(t, o);
        break;
      case "raw-html":
        M.print(t, o);
        break;
      case "json":
        j.print(t, o);
        break;
    }
  }
}, W = R.init;
typeof window < "u" && (window.printJS = W);
export {
  W as default
};
//# sourceMappingURL=print.js.map
