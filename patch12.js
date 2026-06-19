const fs = require('fs');

let css = fs.readFileSync('assets/section-myduke-shop-all.css', 'utf8');

// 1. Remove the old transparent override for msa__mobile-toggle on mobile
css = css.replace(
  /\.msa__mobile-toggle\[aria-expanded="true"\] {\s*background: transparent;\s*color: var\(--msa-text\);\s*border: none;\s*box-shadow: none;\s*}/,
  `.msa__mobile-toggle[aria-expanded="true"] {
    background: var(--msa-teal);
    color: #fff;
    border: 1px solid var(--msa-teal);
    box-shadow: 0 4px 12px rgba(33, 131, 128, 0.2);
  }`
);

// We need to also make sure the +/- icon turns white for msa__mobile-toggle when expanded
css += `
@media (max-width: 767.98px) {
  .msa__mobile-toggle[aria-expanded="true"] .msa__plus-minus {
    color: #fff;
  }
}
`;

// 2. Add the green background override for msa__sort-custom .msa__filter-btn on mobile
css += `
@media (max-width: 767.98px) {
  .msa__sort-custom .msa__filter-btn[aria-expanded="true"] {
    background: var(--msa-teal) !important;
    color: #fff !important;
    border: 1px solid var(--msa-teal) !important;
    box-shadow: 0 4px 12px rgba(33, 131, 128, 0.2) !important;
  }
  .msa__sort-custom .msa__filter-btn[aria-expanded="true"] .msa__plus-minus {
    color: #fff !important;
  }
}
`;

fs.writeFileSync('assets/section-myduke-shop-all.css', css);
