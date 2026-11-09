/* Collections grid, filterable lookbook and full-screen viewer.
   Data comes from js/products.js; WhatsApp helpers from js/main.js. */
(function () {
  'use strict';
  var CATS = window.FM_CATEGORIES || [];
  var PRODUCTS = window.FM_PRODUCTS || [];
  var FM = window.FM || {};
  var waLink = FM.waLink || function (t) { return 'https://wa.me/919820458461?text=' + encodeURIComponent(t); };
  var $ = function (s, c) { return (c || document).querySelector(s); };

  var catById = {};
  CATS.forEach(function (c) { catById[c.id] = c; });

  function productsIn(catId) {
    return PRODUCTS.filter(function (p) { return p.categories.indexOf(catId) !== -1; });
  }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function img(p, sizes, lazy) {
    var i = document.createElement('img');
    i.src = p.src;
    i.srcset = p.thumb + ' 360w, ' + p.full + ' ' + p.w + 'w';
    i.sizes = sizes;
    i.width = p.w; i.height = p.h;
    i.alt = p.alt || p.title;
    i.decoding = 'async';
    if (lazy !== false) i.loading = 'lazy';
    return i;
  }
  function primaryCat(p) { return catById[p.categories[0]]; }
  function productMessage(p) {
    var cat = primaryCat(p);
    return 'Hello, I would like to enquire about "' + p.title + '" (' + (cat ? cat.name : 'Collection') + ') shown on your website.';
  }
  function categoryMessage(c) {
    if (c.id === 'custom-design') return 'Hello, I would like a design made from a reference photograph. I will attach the photo in this chat.';
    if (c.id === 'custom-embroidery') return 'Hello, I would like to enquire about custom embroidery (pattern / name / motif). I will share the details in this chat.';
    return 'Hello, I would like to enquire about ' + c.name + '.';
  }
  function waButton(href, label, cls) {
    var a = el('a', 'btn ' + (cls || 'btn--lime btn--sm'));
    a.href = href; a.target = '_blank'; a.rel = 'noopener';
    a.appendChild(document.createTextNode(label));
    return a;
  }

  /* ---------- Collections grid ---------- */
  var grid = $('#collection-grid');
  var current = 'all';

  function renderCollections() {
    if (!grid) return;
    grid.innerHTML = '';
    CATS.forEach(function (c) {
      var items = productsIn(c.id);
      var card = el('article', 'cat-card' + (items.length ? '' : ' cat-card--type') + (c.custom ? ' cat-card--custom' : ''));
      card.setAttribute('data-reveal', '');
      var media = el('div', 'cat-card__media');
      if (items.length) {
        var coverItem = items[0];
        if (c.cover) items.forEach(function (it) { if (it.id === c.cover) coverItem = it; });
        media.appendChild(img(coverItem, '(max-width: 560px) 46vw, (max-width: 980px) 30vw, 300px'));
      } else {
        media.appendChild(el('span', 'cat-card__type', c.name));
        media.appendChild(el('span', 'tape cat-card__tape'));
        media.lastChild.setAttribute('aria-hidden', 'true');
      }
      var body = el('div', 'cat-card__body');
      body.appendChild(el('h3', 'cat-card__title', c.name));
      body.appendChild(el('p', 'cat-card__desc', c.desc));
      var actions = el('div', 'cat-card__actions');
      if (c.custom) {
        var more = el('a', 'btn btn--lime btn--sm', 'How it works');
        more.href = c.link;
        actions.appendChild(more);
        actions.appendChild(waButton(waLink(categoryMessage(c)), 'Enquire', 'btn--ghost btn--sm'));
      } else {
        actions.appendChild(waButton(waLink(categoryMessage(c)), 'Enquire'));
        var view = el('button', 'btn btn--ghost btn--sm', items.length ? 'View designs' : 'View');
        view.type = 'button';
        view.addEventListener('click', function () { setFilter(c.id, true); });
        if (items.length) actions.appendChild(view);
      }
      body.appendChild(actions);
      card.appendChild(media); card.appendChild(body);
      grid.appendChild(card);
    });
    if (FM.observeReveal) FM.observeReveal(Array.prototype.slice.call(grid.querySelectorAll('[data-reveal]')));
  }

  /* ---------- Filters + lookbook ---------- */
  var filtersEl = $('#filters');
  var lookGrid = $('#look-grid');
  var countEl = $('#filter-count');
  var emptyEl = $('#look-empty');
  var visible = [];

  function renderFilters() {
    if (!filtersEl) return;
    filtersEl.innerHTML = '';
    var all = [{ id: 'all', name: 'All' }].concat(CATS.filter(function (c) { return !c.custom; }));
    all.forEach(function (c) {
      var b = el('button', 'filter', c.name);
      b.type = 'button';
      b.setAttribute('data-filter', c.id);
      b.setAttribute('aria-pressed', c.id === current ? 'true' : 'false');
      b.addEventListener('click', function () { setFilter(c.id, false); });
      filtersEl.appendChild(b);
    });
  }

  function renderLook() {
    if (!lookGrid) return;
    visible = current === 'all' ? PRODUCTS.slice() : productsIn(current);
    lookGrid.innerHTML = '';
    visible.forEach(function (p, idx) {
      var li = el('li', 'look-item');
      var open = el('button', 'look');
      open.type = 'button';
      open.setAttribute('aria-label', 'View ' + p.title + ' full screen');
      open.appendChild(img(p, '(max-width: 560px) 46vw, (max-width: 980px) 30vw, 290px'));
      if (p.source === 'editorial') open.appendChild(el('span', 'look__flag', 'Inspiration photo'));
      open.addEventListener('click', function () { openViewer(idx, open); });
      var info = el('div', 'look-item__info');
      var cat = primaryCat(p);
      info.appendChild(el('p', 'look-item__cat', cat ? cat.name : ''));
      info.appendChild(el('h3', 'look-item__title', p.title));
      var a = waButton(waLink(productMessage(p)), 'Enquire on WhatsApp', 'btn btn--ink btn--sm');
      info.appendChild(a);
      li.appendChild(open); li.appendChild(info);
      lookGrid.appendChild(li);
    });

    if (visible.length) {
      var cta = el('li', 'look-item look-item--cta');
      var ci = el('div', 'look-item__info');
      ci.appendChild(el('h3', null, 'Have a design in mind?'));
      ci.appendChild(el('p', null, 'Send us a reference photograph and ask for a similar design.'));
      var ca = el('a', 'btn btn--ink btn--sm', 'See how it works');
      ca.href = '#custom-design';
      ci.appendChild(ca); cta.appendChild(ci); lookGrid.appendChild(cta);
    }

    var cat = catById[current];
    if (countEl) {
      var label = cat ? cat.name : 'all collections';
      countEl.textContent = visible.length + (visible.length === 1 ? ' design' : ' designs') + ' in ' + label;
    }
    if (emptyEl) {
      var isEmpty = visible.length === 0;
      emptyEl.hidden = !isEmpty;
      lookGrid.hidden = isEmpty;
      if (isEmpty && cat) {
        $('#look-empty-title').textContent = cat.name;
        $('#look-empty-text').textContent = 'We do not have photographs of this collection on the website yet. Message us on WhatsApp to ask about ' + cat.name + '.';
        var cta = $('#look-empty-cta');
        cta.href = waLink(categoryMessage(cat)); cta.target = '_blank'; cta.rel = 'noopener';
      }
    }
  }

  function setFilter(id, scroll) {
    current = id;
    var btns = filtersEl ? filtersEl.querySelectorAll('.filter') : [];
    Array.prototype.forEach.call(btns, function (b) {
      var on = b.getAttribute('data-filter') === id;
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      if (on && filtersEl.scrollTo) {
        var left = b.offsetLeft - (filtersEl.clientWidth - b.offsetWidth) / 2;
        try { filtersEl.scrollTo({ left: Math.max(0, left), behavior: 'smooth' }); } catch (e) {}
      }
    });
    renderLook();
    if (scroll) {
      var target = $('#lookbook');
      if (target) target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    }
  }

  /* ---------- Full-screen viewer ---------- */
  var lb = $('#lightbox');
  var idx = 0, opener = null;
  function showViewer(i) {
    if (!visible.length) return;
    idx = (i + visible.length) % visible.length;
    var p = visible[idx];
    var im = $('#lb-img');
    im.src = p.full; im.alt = p.alt || p.title;
    im.width = p.w; im.height = p.h;
    var cat = primaryCat(p);
    $('#lb-cat').textContent = cat ? cat.name : '';
    $('#lightbox-title').textContent = p.title;
    $('#lb-tag').hidden = p.source !== 'editorial';
    var a = $('#lb-enquire');
    a.href = waLink(productMessage(p));
    $('#lb-count').textContent = (idx + 1) + ' of ' + visible.length;
    var multi = visible.length > 1;
    $('#lb-prev').hidden = !multi; $('#lb-next').hidden = !multi;
  }
  function openViewer(i, trigger) {
    if (!lb) return;
    opener = trigger || null;
    showViewer(i);
    if (FM.openDialog) FM.openDialog(lb);
  }
  if (lb) {
    $('#lb-prev').addEventListener('click', function () { showViewer(idx - 1); });
    $('#lb-next').addEventListener('click', function () { showViewer(idx + 1); });
    lb.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') showViewer(idx - 1);
      else if (e.key === 'ArrowRight') showViewer(idx + 1);
    });
    lb.addEventListener('close', function () {
      if (opener && document.contains(opener)) { try { opener.focus({ preventScroll: true }); } catch (e) {} }
    });
    /* Swipe on touch screens */
    var sx = null, sy = null;
    lb.addEventListener('touchstart', function (e) { if (e.touches.length === 1) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; } }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      sx = sy = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) showViewer(idx + (dx < 0 ? 1 : -1));
    }, { passive: true });
  }

  renderCollections();
  renderFilters();
  renderLook();
})();
