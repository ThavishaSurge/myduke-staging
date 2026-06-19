const fs = require('fs');
let css = fs.readFileSync('assets/section-myduke-shop-all.css', 'utf8');

css += `
@media (max-width: 767.98px) {
  .msa__sort-mobile.msa__filter-group {
    border-top: none;
  }
}
`;

fs.writeFileSync('assets/section-myduke-shop-all.css', css);
