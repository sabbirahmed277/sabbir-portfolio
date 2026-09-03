/* ==========================================================================
   Sabbir Ahmed Akash — portfolio behaviour
   --------------------------------------------------------------------------
   Five small, independent pieces:
     1. Footer year         — keeps the copyright current on its own
     2. Theme toggle        — dark/light, seeded from the OS preference
     3. Nav border on scroll
     4. Scroll reveal       — IntersectionObserver, degrades to always-visible
     5. Nav scrollspy + copy-to-clipboard

   No dependencies, no build step. The theme is seeded by a tiny inline script
   in index.html <head> so the first paint is already the right colour.
   ========================================================================== */

(function () {
  'use strict';

  var root = document.documentElement;

  /* ---- Footer year ------------------------------------------------ */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---- Theme toggle ---------------------------------------------- *
   * The head script already set the starting theme from the visitor's
   * OS preference. This only handles the explicit override, and keeps
   * following the OS until the visitor actually picks a side.
   * ---------------------------------------------------------------- */
  var themeBtn  = document.getElementById('themeBtn');
  var metaTheme = document.querySelector('meta[name="theme-color"]');
  var chosen    = false;

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);

    var next  = theme === 'dark' ? 'light' : 'dark';
    var label = 'Switch to ' + next + ' theme';
    themeBtn.setAttribute('aria-label', label);
    themeBtn.setAttribute('title', label);

    if (metaTheme) {
      metaTheme.setAttribute('content', theme === 'dark' ? '#08080b' : '#f6f7fb');
    }
  }

  applyTheme(root.getAttribute('data-theme') === 'light' ? 'light' : 'dark');

  themeBtn.addEventListener('click', function () {
    chosen = true;
    applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });

  if (window.matchMedia) {
    var mq = window.matchMedia('(prefers-color-scheme: light)');
    var follow = function (e) {
      if (!chosen) applyTheme(e.matches ? 'light' : 'dark');
    };
    if (mq.addEventListener)     mq.addEventListener('change', follow);
    else if (mq.addListener)     mq.addListener(follow);   // Safari < 14
  }

  /* ---- Nav border appears once the page has scrolled -------------- */
  var nav = document.getElementById('nav');
  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 8);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- Scroll reveal --------------------------------------------- */
  var revealables = document.querySelectorAll('.reveal:not(.in)');

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    revealables.forEach(function (el) { io.observe(el); });
  } else {
    // No observer support: show everything rather than hiding content.
    revealables.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- Active nav link ------------------------------------------- */
  var sections = document.querySelectorAll('main section[id]');
  var links = document.querySelectorAll('.nav-links a');

  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        links.forEach(function (link) {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---- Copy email ------------------------------------------------ */
  var EMAIL = 'sabbirahmedakash277@gmail.com';
  var copyBtn = document.getElementById('copyBtn');
  var copyLabel = document.getElementById('copyLabel');

  function flash(text) {
    copyLabel.textContent = text;
    copyBtn.classList.add('done');
    setTimeout(function () {
      copyLabel.textContent = 'Copy';
      copyBtn.classList.remove('done');
    }, 1900);
  }

  function legacyCopy() {
    var ta = document.createElement('textarea');
    ta.value = EMAIL;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    flash(ok ? 'Copied' : 'Copy failed');
  }

  copyBtn.addEventListener('click', function () {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(EMAIL).then(function () {
        flash('Copied');
      })['catch'](legacyCopy);
    } else {
      legacyCopy();
    }
  });
})();
