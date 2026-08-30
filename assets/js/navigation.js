/**
 * Phase 1 remediation — accessible "Calculators" disclosure menu.
 * Fixes AUDIT-06-A11Y-PERFORMANCE.md P0-1: the trigger is now a real <button>
 * (native keyboard focus + Enter/Space activation), its aria-expanded state
 * is kept in sync with visibility, Escape closes the menu and returns focus
 * to the trigger, and an outside click still closes it. Mouse hover continues
 * to work via CSS (:hover), unaffected by this script.
 */
document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var dropdown = document.querySelector('.nav-dropdown');
  if (!dropdown) return;

  var trigger = dropdown.querySelector('.nav-dropdown-toggle');
  var menu = dropdown.querySelector('.nav-dropdown-menu');
  if (!trigger || !menu) return;

  function setOpen(isOpen) {
    dropdown.classList.toggle('open', isOpen);
    trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  }

  trigger.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    setOpen(!dropdown.classList.contains('open'));
  });

  document.addEventListener('click', function (e) {
    if (!dropdown.contains(e.target)) {
      setOpen(false);
    }
  });

  dropdown.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.key === 'Esc') {
      if (dropdown.classList.contains('open')) {
        setOpen(false);
        trigger.focus();
      }
    }
  });

  /**
   * Phase 4A — mobile navigation toggle. Independent of the Calculators
   * disclosure above: this only shows/hides the shared .nav-links list at
   * narrow viewports (see assets/css/styles.css @media max-width: 760px).
   * The Calculators dropdown nested inside .nav-links keeps working exactly
   * as it does on desktop once the list is expanded.
   */
  var mobileToggle = document.querySelector('.nav-mobile-toggle');
  var navLinks = document.querySelector('.nav-links');
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('mobile-open');
      mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }
});
