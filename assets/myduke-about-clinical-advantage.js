(function () {
  function initSection(sectionEl) {
    var items = Array.prototype.slice.call(sectionEl.querySelectorAll('.myduke-clinical-advantage__item'));

    function openItem(item) {
      var trigger = item.querySelector('.myduke-clinical-advantage__trigger');
      var panel   = item.querySelector('.myduke-clinical-advantage__panel');
      item.classList.add('is-open');
      if (trigger) trigger.setAttribute('aria-expanded', 'true');
      if (panel)   panel.classList.add('is-open');
    }

    function closeItem(item) {
      var trigger = item.querySelector('.myduke-clinical-advantage__trigger');
      var panel   = item.querySelector('.myduke-clinical-advantage__panel');
      item.classList.remove('is-open');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
      if (panel)   panel.classList.remove('is-open');
    }

    items.forEach(function (item) {
      var trigger = item.querySelector('.myduke-clinical-advantage__trigger');
      if (!trigger) return;

      trigger.addEventListener('click', function () {
        var isOpen = trigger.getAttribute('aria-expanded') === 'true';
        items.forEach(closeItem);
        if (!isOpen) openItem(item);
      });
    });
  }

  function initAll() {
    document.querySelectorAll('.myduke-clinical-advantage[data-section-id]').forEach(initSection);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
