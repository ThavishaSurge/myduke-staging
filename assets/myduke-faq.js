(function () {
  function initFaq(sectionEl) {
    var items = Array.prototype.slice.call(sectionEl.querySelectorAll('.myduke-faq__item'));

    function openItem(item) {
      var trigger = item.querySelector('.myduke-faq__trigger');
      var panel   = item.querySelector('.myduke-faq__panel');
      item.classList.add('is-open');
      if (trigger) trigger.setAttribute('aria-expanded', 'true');
      if (panel)   panel.classList.add('is-open');
    }

    function closeItem(item) {
      var trigger = item.querySelector('.myduke-faq__trigger');
      var panel   = item.querySelector('.myduke-faq__panel');
      item.classList.remove('is-open');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
      if (panel)   panel.classList.remove('is-open');
    }

    // Open first item by default (matches Figma open state)
    if (items.length > 0) openItem(items[0]);

    items.forEach(function (item) {
      var trigger = item.querySelector('.myduke-faq__trigger');
      if (!trigger) return;

      trigger.addEventListener('click', function () {
        var isOpen = trigger.getAttribute('aria-expanded') === 'true';
        items.forEach(closeItem);
        if (!isOpen) openItem(item);
      });
    });
  }

  function initAll() {
    document.querySelectorAll('.myduke-faq[data-section-id]').forEach(initFaq);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
