const fs = require('fs');
let css = fs.readFileSync('assets/section-myduke-shop-all.css', 'utf8');

css += `
@media (max-width: 767.98px) {
  .msa__sort-mobile .msa__dropdown {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    left: auto;
    width: max-content;
    min-width: 200px;
    background: #fff;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
    border: 1px solid var(--msa-border);
    z-index: 100;
    /* Reset inline accordion styles for the floating dropdown */
    display: none !important; 
    grid-template-rows: none;
  }
  
  .msa__sort-mobile .msa__dropdown[data-open] {
    display: block !important;
    animation: msaDropdownIn 0.15s ease;
  }
  
  .msa__sort-mobile .msa__dropdown-inner {
    padding: 6px 0;
  }
}
`;

fs.writeFileSync('assets/section-myduke-shop-all.css', css);
