const fs = require('fs');
let css = fs.readFileSync('assets/section-myduke-shop-all.css', 'utf8');

// 1. Remove background color change on Sort dropdown when expanded
css += `
/* Remove background color change on Sort extended */
.msa__sort-mobile .msa__filter-btn[aria-expanded="true"] {
  background: transparent;
  color: var(--msa-text);
  border: none;
  box-shadow: none;
}

.msa__sort-mobile .msa__filter-btn[aria-expanded="true"] .msa__plus-minus {
  color: var(--msa-text);
}
`;

// 2. Fix the missing minus icon issue on mobile by ensuring both SVG icons have display: block
// We need to inject display: block!important into the mobile positioning rule.
css = css.replace(
  /\.msa__icon-plus,\s*\.msa__icon-minus {\s*position: absolute;/g,
  `.msa__icon-plus,
  .msa__icon-minus {
    display: block !important;
    position: absolute;`
);

// We should also make sure .msa__plus-minus is display: flex on mobile for both filter and sort
css += `
@media (max-width: 767.98px) {
  .msa__sort-mobile .msa__plus-minus {
    display: flex !important;
    position: relative;
    width: 20px;
    height: 20px;
    align-items: center;
    justify-content: center;
  }

  /* Make sure the icons rotate correctly for sort too */
  .msa__sort-mobile .msa__filter-btn[aria-expanded="true"] .msa__icon-plus {
    opacity: 0;
    transform: translate(-50%, -50%) rotate(90deg);
  }
  .msa__sort-mobile .msa__filter-btn[aria-expanded="true"] .msa__icon-minus {
    opacity: 1;
    transform: translate(-50%, -50%) rotate(0deg);
  }
}
`;

fs.writeFileSync('assets/section-myduke-shop-all.css', css);
