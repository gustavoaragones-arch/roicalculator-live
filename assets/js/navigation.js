/**
 * Phase 17.7 — mobile-friendly Calculators dropdown (click to toggle + outside close).
 */
document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var dropdown = document.querySelector('.nav-dropdown');
  if (!dropdown) return;

  var trigger = dropdown.querySelector('span');
  if (!trigger) return;

  trigger.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    dropdown.classList.toggle('open');
  });

  document.addEventListener('click', function (e) {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove('open');
    }
  });
});
