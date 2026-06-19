const fs = require('fs');
let css = fs.readFileSync('assets/section-myduke-shop-all.css', 'utf8');

css += `
@media (max-width: 767.98px) {
  .msa__filter-btn {
    border: none;
  }
}
`;

fs.writeFileSync('assets/section-myduke-shop-all.css', css);
