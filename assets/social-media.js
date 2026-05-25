(function () {

  const initSocialMedia = (container) => {
    const sections = container.querySelectorAll('.social-media');
    if (!sections.length) return;

    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.2
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const section = entry.target;

          const button = section.querySelector('.social-media-content__button');
          if (button) button.classList.add('animate-in');

          observer.unobserve(section);
        }
      });
    });

    sections.forEach(section => observer.observe(section));
  };


  document.addEventListener("DOMContentLoaded", function () {
    initSocialMedia(document);
  });

  document.addEventListener("shopify:section:load", function (event) {
    initSocialMedia(event.target);
  });
})();
