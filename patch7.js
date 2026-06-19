const fs = require('fs');
let css = fs.readFileSync('assets/section-myduke-shop-all.css', 'utf8');

css += `
@media (max-width: 767.98px) {
  .msa__sort-mobile.msa__filter-group {
    width: auto;
    border-top: none;
  }
  
  .msa__mobile-toggle {
    white-space: nowrap;
    min-width: 0;
  }
  
  .msa__sort-mobile .msa__filter-btn {
    white-space: nowrap;
    min-width: 0;
  }
}
`;

fs.writeFileSync('assets/section-myduke-shop-all.css', css);
