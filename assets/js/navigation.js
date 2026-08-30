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
});
