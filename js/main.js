/* The Firoz Master Bespoke & Tailoring: vanilla JS, no dependencies.
   main.js handles: WhatsApp links, mobile menu, enquiry form (validation + WhatsApp message), scroll reveal.
   Business details live in js/config.js. */
(function () {
  'use strict';

  var CFG = window.FM_CONFIG || {};
  var WHATSAPP_NUMBER = CFG.whatsappNumber || '919820458461';
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* Shared helpers for gallery.js */
  window.FM = window.FM || {};
  window.FM.waLink = function (text) {
    return 'https://wa.me/' + WHATSAPP_NUMBER + (text ? '?text=' + encodeURIComponent(text) : '');
  };
  window.FM.openDialog = null; // set below

  /* Point every WhatsApp link at the number in config.js (links that open the form are left alone). */
  $$('a[data-wa]').forEach(function (a) {
    if (a.hasAttribute('data-enquire')) return;
    var msg = a.getAttribute('data-wa-msg') || '';
    a.href = window.FM.waLink(msg);
    if (!a.target) { a.target = '_blank'; a.rel = 'noopener'; }
  });

  var root = document.documentElement;
  var yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Dialog helpers (native <dialog> with a basic fallback) ---------- */
  function openDialog(dlg) {
    if (typeof dlg.showModal === 'function') {
      if (!dlg.open) dlg.showModal();
    } else {
      dlg.setAttribute('open', '');
    }
    root.classList.add('is-locked');
  }
  function closeDialog(dlg) {
    if (typeof dlg.close === 'function') dlg.close();
    else dlg.removeAttribute('open');
    unlockIfNoneOpen();
  }
  window.FM.openDialog = function (d) { openDialog(d); };
  window.FM.closeDialog = function (d) { closeDialog(d); };
  function unlockIfNoneOpen() {
    if (!$$('dialog[open]').length) root.classList.remove('is-locked');
  }
  $$('dialog').forEach(function (dlg) {
    dlg.addEventListener('close', unlockIfNoneOpen);
    dlg.addEventListener('click', function (e) { if (e.target === dlg) closeDialog(dlg); }); // backdrop click
    $$('[data-close]', dlg).forEach(function (b) { b.addEventListener('click', function () { closeDialog(dlg); }); });
  });

  /* ---------- Mobile navigation ---------- */
  var toggle = $('.menu-toggle');
  var nav = $('#site-nav');
  var mq = window.matchMedia('(max-width: 980px)');

  function setMenu(open) {
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
    root.classList.toggle('is-locked', open || $$('dialog[open]').length > 0);
    var label = $('.menu-toggle__label', toggle);
    if (label) label.textContent = open ? 'Close' : 'Menu';
  }
  function syncNavA11y() {
    // Off-canvas menu should not be reachable by keyboard while hidden on small screens.
    if (!nav) return;
    if (mq.matches && !nav.classList.contains('is-open')) nav.setAttribute('inert', '');
    else nav.removeAttribute('inert');
  }
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
      syncNavA11y();
    });
    $$('a', nav).forEach(function (a) {
      a.addEventListener('click', function () { if (mq.matches) { setMenu(false); syncNavA11y(); } });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); syncNavA11y(); toggle.focus(); }
    });
    var onMq = function () { if (!mq.matches) setMenu(false); syncNavA11y(); };
    if (mq.addEventListener) mq.addEventListener('change', onMq); else mq.addListener(onMq);
    syncNavA11y();
  }

  /* ---------- Enquiry form ---------- */
  var dlg = $('#enquiry-dialog');
  var form = $('#enquiry-form');
  /* Gentle reveal on scroll (only when JS is on; skipped for reduced motion). */
  (function () {
    var items = $$('[data-reveal]');
    if (!items.length) return;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { el.classList.add('reveal'); io.observe(el); });
    window.FM.observeReveal = function (els) { els.forEach(function (el) { el.classList.add('reveal'); io.observe(el); }); };
  })();

  if (!dlg || !form) return;

  var els = {
    name: $('#f-name'), mobile: $('#f-mobile'), category: $('#f-category'), categoryOther: $('#f-category-other'),
    occasionOther: $('#f-occasion-other'), date: $('#f-date'), colour: $('#f-colour'), notes: $('#f-notes'),
    piece: $('#f-piece'), pieceNote: $('#piece-note'), summary: $('#form-summary'), title: $('#enquiry-title'),
    catWrap: $('#category-other-wrap'), occWrap: $('#occasion-other-wrap'), count: $('#notes-count'),
    done: $('#enquiry-done'), doneLink: $('#done-link'), edit: $('#edit-enquiry'), occFieldset: $('.fieldset', form)
  };
  var occasionRadios = $$('input[name="occasion"]', form);
  var lastTrigger = null;

  function isoDate(d) {
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + m + '-' + day;
  }
  function setDateLimits() {
    var today = new Date();
    var max = new Date(today.getFullYear() + 2, today.getMonth(), today.getDate());
    els.date.min = isoDate(today);
    els.date.max = isoDate(max);
  }

  function selectedOccasion() {
    var r = occasionRadios.filter(function (x) { return x.checked; })[0];
    return r ? r.value : '';
  }
  function setOccasion(value) {
    occasionRadios.forEach(function (r) { r.checked = (r.value === value); });
    syncOther();
  }
  function syncOther() {
    els.catWrap.hidden = els.category.value !== 'Other';
    els.occWrap.hidden = selectedOccasion() !== 'Other';
  }

  /* error helpers */
  function errEl(input) {
    var id = input.id === 'f-colour' ? 'e-colour' : 'e-' + input.id.replace(/^f-/, '');
    return document.getElementById(id);
  }
  function setError(input, msg) {
    var p = errEl(input);
    if (!p) return;
    input.setAttribute('aria-invalid', 'true');
    p.textContent = msg; p.hidden = false;
  }
  function clearError(input) {
    var p = errEl(input);
    input.removeAttribute('aria-invalid');
    if (p) { p.textContent = ''; p.hidden = true; }
  }
  function setOccasionError(msg) {
    var p = $('#e-occasion');
    els.occFieldset.setAttribute('aria-invalid', 'true');
    p.textContent = msg; p.hidden = false;
  }
  function clearOccasionError() {
    var p = $('#e-occasion');
    els.occFieldset.removeAttribute('aria-invalid');
    p.textContent = ''; p.hidden = true;
  }

  /* validators — each returns an error string or '' */
  function vName() {
    var v = els.name.value.trim().replace(/\s+/g, ' ');
    if (!v) return 'Enter your full name.';
    if (v.length < 2 || !/^[\p{L}][\p{L}\p{M} .'’\-]*$/u.test(v)) return 'Use letters only for your name (at least 2 characters).';
    return '';
  }
  function normaliseMobile(raw) {
    var d = String(raw).replace(/[^\d]/g, '');
    if (d.length === 12 && d.indexOf('91') === 0) d = d.slice(2);
    else if (d.length === 11 && d.charAt(0) === '0') d = d.slice(1);
    return d;
  }
  function vMobile() {
    var raw = els.mobile.value.trim();
    if (!raw) return 'Enter your mobile number.';
    if (/[^\d\s+\-()]/.test(raw)) return 'Use digits only, for example 98765 43210.';
    var d = normaliseMobile(raw);
    if (!/^[6-9]\d{9}$/.test(d)) return 'Enter a valid 10-digit Indian mobile number starting with 6, 7, 8 or 9.';
    return '';
  }
  function vCategory() { return els.category.value ? '' : 'Choose a clothing category.'; }
  function vCategoryOther() {
    if (els.category.value !== 'Other') return '';
    return els.categoryOther.value.trim().length >= 2 ? '' : 'Tell us which category you need.';
  }
  function vOccasion() { return selectedOccasion() ? '' : 'Choose an occasion.'; }
  function vOccasionOther() {
    if (selectedOccasion() !== 'Other') return '';
    return els.occasionOther.value.trim().length >= 2 ? '' : 'Tell us which occasion this is for.';
  }
  function vDate() {
    var v = els.date.value;
    if (!v) return 'Choose the date you need the outfit by.';
    var d = new Date(v + 'T00:00:00');
    if (isNaN(d.getTime())) return 'Enter a valid date.';
    var today = new Date(); today.setHours(0, 0, 0, 0);
    if (d < today) return 'Choose today or a future date.';
    var max = new Date(today.getFullYear() + 2, today.getMonth(), today.getDate());
    if (d > max) return 'Choose a date within the next two years.';
    return '';
  }

  var rules = [
    { input: els.name, test: vName },
    { input: els.mobile, test: vMobile },
    { input: els.category, test: vCategory },
    { input: els.categoryOther, test: vCategoryOther },
    { input: 'occasion', test: vOccasion },
    { input: els.occasionOther, test: vOccasionOther },
    { input: els.date, test: vDate }
  ];

  function runRule(rule) {
    var msg = rule.test();
    if (rule.input === 'occasion') { if (msg) setOccasionError(msg); else clearOccasionError(); }
    else { if (msg) setError(rule.input, msg); else clearError(rule.input); }
    return msg;
  }

  /* live feedback after the first blur / change */
  rules.forEach(function (rule) {
    if (rule.input === 'occasion') return;
    var ev = (rule.input.tagName === 'SELECT' || rule.input.type === 'date') ? 'change' : 'blur';
    rule.input.addEventListener(ev, function () {
      // Don't flag an untouched, empty field on blur: the message would shift the layout
      // under the pointer and swallow the next click. Empty fields are flagged on submit.
      if (ev === 'blur' && !rule.input.value.trim() && rule.input.getAttribute('aria-invalid') !== 'true') return;
      runRule(rule);
    });
    rule.input.addEventListener('input', function () {
      if (rule.input.getAttribute('aria-invalid') === 'true') runRule(rule);
    });
  });
  occasionRadios.forEach(function (r) {
    r.addEventListener('change', function () { syncOther(); clearOccasionError(); });
  });
  els.category.addEventListener('change', syncOther);
  els.notes.addEventListener('input', function () { els.count.textContent = els.notes.value.length; });

  /* tidy mobile number as the person leaves the field */
  els.mobile.addEventListener('blur', function () {
    var d = normaliseMobile(els.mobile.value);
    if (/^[6-9]\d{9}$/.test(d)) els.mobile.value = d.slice(0, 5) + ' ' + d.slice(5);
  });

  function labelFor(input) {
    if (input === 'occasion') return { text: 'Occasion', target: occasionRadios[0] };
    var l = form.querySelector('label[for="' + input.id + '"]');
    return { text: l ? l.textContent.replace('*', '').trim() : 'Field', target: input };
  }

  function showSummary(failed) {
    var s = els.summary;
    s.innerHTML = '';
    var p = document.createElement('p');
    p.textContent = failed.length === 1 ? 'Please fix 1 field:' : 'Please fix ' + failed.length + ' fields:';
    var ul = document.createElement('ul');
    failed.forEach(function (f) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      var lab = labelFor(f.rule.input);
      a.href = '#'; a.textContent = lab.text + ': ' + f.msg;
      a.addEventListener('click', function (e) { e.preventDefault(); lab.target.focus(); });
      li.appendChild(a); ul.appendChild(li);
    });
    s.appendChild(p); s.appendChild(ul);
    s.hidden = false;
    s.focus();
  }

  /* ---------- WhatsApp message ---------- */
  function formatDate(value) {
    var d = new Date(value + 'T00:00:00');
    try { return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }); }
    catch (e) { return value; }
  }
  function buildMessage() {
    var name = els.name.value.trim().replace(/\s+/g, ' ');
    var m = normaliseMobile(els.mobile.value);
    var mobile = '+91 ' + m.slice(0, 5) + ' ' + m.slice(5);
    var category = els.category.value === 'Other' ? 'Other: ' + els.categoryOther.value.trim() : els.category.value;
    var occ = selectedOccasion();
    var occasion = occ === 'Other' ? 'Other: ' + els.occasionOther.value.trim() : occ;
    var colour = els.colour.value.trim() || 'Not specified';
    var notes = els.notes.value.trim() || 'None';
    var lines = [
      'Hello Firoz Master, I would like to make an enquiry.',
      '',
      '*Full name:* ' + name,
      '*Mobile number:* ' + mobile,
      '*Clothing category:* ' + category,
      '*Occasion:* ' + occasion,
      '*Required by:* ' + formatDate(els.date.value),
      '*Preferred colour:* ' + colour,
      '*Additional requirements:* ' + notes
    ];
    if (els.piece.value) lines.push('*Look of interest:* ' + els.piece.value);
    lines.push('', 'Sent from the Firoz Master website enquiry form.');
    return lines.join('\n');
  }
  function whatsappUrl(text) {
    return 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(text);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var failed = [];
    rules.forEach(function (rule) {
      var msg = runRule(rule);
      if (msg) failed.push({ rule: rule, msg: msg });
    });
    if (failed.length) { showSummary(failed); return; }
    els.summary.hidden = true;

    var url = whatsappUrl(buildMessage());
    els.doneLink.href = url;
    form.hidden = true;
    els.done.hidden = false;
    els.done.focus();
    var win = window.open(url, '_blank', 'noopener');
    if (!win) { /* pop-up blocked: the visible "Open WhatsApp" button is the fallback */ }
  });

  els.edit.addEventListener('click', function () {
    els.done.hidden = true; form.hidden = false; els.name.focus();
  });

  function resetForm() {
    form.reset();
    [els.name, els.mobile, els.category, els.categoryOther, els.occasionOther, els.date].forEach(clearError);
    clearOccasionError();
    els.summary.hidden = true; els.summary.innerHTML = '';
    els.count.textContent = '0';
    els.piece.value = ''; els.pieceNote.hidden = true; els.pieceNote.textContent = '';
    form.hidden = false; els.done.hidden = true;
    syncOther();
  }

  function openEnquiry(opts) {
    opts = opts || {};
    resetForm();
    setDateLimits();
    els.title.textContent = opts.title || 'Send an enquiry';
    if (opts.category) els.category.value = opts.category;
    if (opts.occasion) setOccasion(opts.occasion);
    if (opts.piece) {
      els.piece.value = opts.piece;
      els.pieceNote.textContent = 'Look of interest: ' + opts.piece;
      els.pieceNote.hidden = false;
    }
    syncOther();
    openDialog(dlg);
    dlg.scrollTop = 0;
    // Start at the first field that still needs an answer.
    var first = els.name;
    setTimeout(function () { first.focus(); }, 30);
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target.closest('[data-enquire]') : null;
    if (!t) return;
    e.preventDefault();
    lastTrigger = t;
    if (nav && nav.classList.contains('is-open')) { setMenu(false); syncNavA11y(); }
    openEnquiry({
      title: t.getAttribute('data-title') || 'Send an enquiry',
      category: t.getAttribute('data-category') || '',
      occasion: t.getAttribute('data-occasion') || ''
    });
  });

  dlg.addEventListener('close', function () {
    if (lastTrigger && document.contains(lastTrigger)) { try { lastTrigger.focus({ preventScroll: true }); } catch (e) {} }
  });

})();
