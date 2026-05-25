(function () {
  function initContactModal(section) {

    const root = section || document;

    const toggle = root.querySelector(".steps_content_button");
    const modal = root.querySelector(".contact-modal");
    const overlay = root.querySelector(".showcase_modal__overlay");
    const closeBtn = root.querySelector(".close_modal_element");

    if (!toggle || !modal) return; 

    
    toggle.addEventListener("click", () => {
      modal.classList.add("active");
      document.body.classList.add("overflow-hidden");
    });

    
    overlay?.addEventListener("click", () => {
      modal.classList.remove("active");
      document.body.classList.remove("overflow-hidden");
    });

    
    closeBtn?.addEventListener("click", () => {
      modal.classList.remove("active");
      document.body.classList.remove("overflow-hidden");
    });

    
    document.addEventListener("keyup", (e) => {
      if (e.key === "Escape") {
        modal.classList.remove("active");
        document.body.classList.remove("overflow-hidden");
      }
    });
  }


  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".shopify-section").forEach(section => {
      initContactModal(section);
    });
  });


  document.addEventListener("shopify:section:load", (event) => {
    initContactModal(event.target);
  });
})();
