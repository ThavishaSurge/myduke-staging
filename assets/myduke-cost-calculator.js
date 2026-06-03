(function () {
  function initSection(sectionEl) {
    var sectionId = sectionEl.dataset.sectionId;
    var slider = document.getElementById('myduke-calc-slider-' + sectionId);
    if (!slider) return;

    var countEl  = document.getElementById('myduke-calc-count-' + sectionId);
    var weeklyEl = document.getElementById('myduke-calc-weekly-' + sectionId);
    var yearlyEl = document.getElementById('myduke-calc-yearly-' + sectionId);
    var costPerCig = parseFloat(sectionEl.dataset.cost) || 2.00;

    function fmt(n) {
      return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    function updateFill() {
      var min = parseFloat(slider.min) || 1;
      var max = parseFloat(slider.max) || 60;
      var pct = ((parseFloat(slider.value) - min) / (max - min)) * 100;
      sectionEl.style.setProperty('--calc-fill', pct.toFixed(2) + '%');
    }

    function calc() {
      var cigs = parseInt(slider.value, 10);
      if (countEl) countEl.textContent = cigs;
      if (weeklyEl) weeklyEl.textContent = fmt(cigs * 7 * costPerCig);
      if (yearlyEl) yearlyEl.textContent = fmt(cigs * 365 * costPerCig);
      updateFill();
    }

    slider.addEventListener('input', calc);
    calc();

    // Quick Facts collapsible toggle — mobile only
    var factsToggle = sectionEl.querySelector('[aria-controls="myduke-calc-facts-' + sectionId + '"]');
    var factsList = document.getElementById('myduke-calc-facts-' + sectionId);
    var mobileQuery = window.matchMedia('(max-width: 575px)');

    if (factsToggle && factsList) {
      factsToggle.addEventListener('click', function () {
        if (!mobileQuery.matches) return;
        var isOpen = factsToggle.getAttribute('aria-expanded') === 'true';
        factsToggle.setAttribute('aria-expanded', String(!isOpen));
        if (isOpen) {
          factsList.setAttribute('hidden', '');
        } else {
          factsList.removeAttribute('hidden');
        }
      });
    }
  }

  function initAll() {
    document.querySelectorAll('.myduke-calc[data-section-id]').forEach(initSection);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
