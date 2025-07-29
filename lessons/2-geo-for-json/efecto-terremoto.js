// Efecto terremoto: https://esqsoft.com/javascript_examples/earthquake
// El código ha sido minimizado (utilizando https://minify-js.com/) y se ha modificado ligeramente para que la animación tenga una duración de 20 segundos */
function earthQuake(e) {
  function t(e) {
    return `${e}px`;
  }
  function a(e, a, n) {
    (e.style.left = t(a)), (e.style.top = t(n));
  }
  e.el.getAttribute("data-quake") ||
    (e.el.setAttribute("data-quake", !0),
    (function e(t) {
      switch (t.animationOption) {
        case "rotate":
          ++t.index > 8 && (t.index = 1);
          break;
        case "shaky":
          t.index = parseInt(8 * Math.random());
          break;
        case "horizontal":
          (t.index += 4), t.index > 8 && (t.index = 0);
          break;
        case "diagonal":
          (t.index += 5), t.index > 8 && (t.index = 1);
          break;
        case "faster":
          (t.index += 2), t.index > 8 && (t.index = 1);
          break;
        default:
          confirm("hmmm... default (error)") || (t.ttl = 0);
      }
      let n = t.el,
        i = t.x,
        o = t.y,
        r = t.delta;
      switch (t.index) {
        case 1:
          a(n, i - r, o - r);
          break;
        case 2:
          a(n, i, o - r);
          break;
        case 3:
          a(n, i + r, o - r);
          break;
        case 4:
          a(n, i + r, o);
          break;
        case 5:
          a(n, i + r, o + r);
          break;
        case 6:
          a(n, i, o + r);
          break;
        case 7:
          a(n, i - r, o + r);
          break;
        case 8:
          a(n, i - r, o);
      }
      --t.ttl > 0
        ? setTimeout(() => e(t), t.speedMilliseconds)
        : (t.el.removeAttribute("data-quake"), (t = null));
    })({
      el: e.el,
      index: 0,
      ttl: 360,
      delta: 1,
      speedMilliseconds: 50,
      animationOption: e.animationOption || parseInt(2 * Math.random()),
      ...(function (e) {
        let t = e.offsetLeft,
          a = e.offsetTop,
          n = e.offsetParent;
        for (; null != n && "relative" !== getComputedStyle(n).position; )
          (t += n.offsetLeft), (a += n.offsetTop), (n = n.offsetParent);
        return { x: t, y: a };
      })(e.el),
    }));
}