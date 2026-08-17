/* WeConvertFiles motion layer — reveal-on-scroll + upload drag feedback.
   Passive and tiny. If IntersectionObserver is missing or the user prefers
   reduced motion, we do nothing and all content remains fully visible. */
(function () {
  var doc = document, root = doc.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Scroll reveals — only enable the hidden-first state once we know it can be undone.
  if (!reduce && 'IntersectionObserver' in window) {
    root.classList.add('wcf-anim');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    var bind = function () {
      doc.querySelectorAll('.reveal:not(.in)').forEach(function (el) { io.observe(el); });
    };
    if (doc.readyState !== 'loading') bind();
    else doc.addEventListener('DOMContentLoaded', bind);
  }

  // Upload zone drag feedback (additive class; does not interfere with the app's own handlers).
  var bindDrop = function () {
    var dz = doc.getElementById('dropZone');
    if (!dz) return;
    var on = function () { dz.classList.add('wcf-dragover'); };
    var off = function () { dz.classList.remove('wcf-dragover'); };
    ['dragenter', 'dragover'].forEach(function (ev) { dz.addEventListener(ev, on); });
    ['dragleave', 'drop', 'dragend'].forEach(function (ev) { dz.addEventListener(ev, off); });
  };
  if (doc.readyState !== 'loading') bindDrop();
  else doc.addEventListener('DOMContentLoaded', bindDrop);
})();
