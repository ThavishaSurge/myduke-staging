const fs = require('fs');

let css = fs.readFileSync('assets/section-myduke-shop-all.css.bak', 'utf8');

// Append the new mobile overrides to the end of the file
css += `
/* --- New Mobile Overrides for Shop All --- */
.msa__sort-mobile { display: none; }

@media (max-width: 767.98px) {
  .msa__sort-desktop { display: none !important; }
  .msa__sort-mobile { display: block; }

  /* Redefine the mobile toggles container to be stacked instead of side-by-side */
  .msa__mobile-toggles {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-bottom: 0;
    gap: 0;
    border-top: 1px solid var(--msa-border);
  }

  /* Style the mobile filters button to match the accordions */
  .msa__mobile-toggle {
    display: flex;
    border-radius: 0;
    background: transparent;
    color: var(--msa-text);
    border: none;
    border-bottom: 1px solid var(--msa-border);
    font-size: 15px;
    font-weight: 400;
    padding: 18px 20px;
    justify-content: space-between;
    align-items: center;
    transition: none;
    width: 100%;
  }

  .msa__mobile-toggle[aria-expanded="true"] {
    background: transparent;
    color: var(--msa-text);
    border-color: var(--msa-border);
    box-shadow: none;
  }

  /* Plus/Minus icons for the mobile toggle */
  .msa__mobile-toggle .msa__plus-minus {
    display: flex;
    position: relative;
    width: 20px;
    height: 20px;
    align-items: center;
    justify-content: center;
  }
  
  .msa__mobile-toggle[aria-expanded="true"] .msa__icon-plus {
    opacity: 0;
    transform: translate(-50%, -50%) rotate(90deg);
  }
  
  .msa__mobile-toggle[aria-expanded="true"] .msa__icon-minus {
    opacity: 1;
    transform: translate(-50%, -50%) rotate(0deg);
  }

  /* Ensure sort-mobile has a border at the bottom */
  .msa__sort-mobile {
    border-bottom: 1px solid var(--msa-border);
  }
}
`;

fs.writeFileSync('assets/section-myduke-shop-all.css', css);
