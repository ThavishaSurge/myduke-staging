const fs = require('fs');

let css = fs.readFileSync('assets/section-myduke-shop-all.css', 'utf8');

// 1. Remove border: none from mobile filter buttons in patch9
css = css.replace(
  /@media \(max-width: 767\.98px\) {\s*\.msa__filter-btn {\s*border: none;\s*}\s*}/g,
  `@media (max-width: 767.98px) {
  .msa__filter-btn {
    /* inherit border from desktop */
  }
}`
);

// 2. Add border and padding to msa__mobile-toggle on mobile
css = css.replace(
  /\.msa__mobile-toggle {\s*display: inline-flex;\s*border-radius: 0;\s*background: transparent;\s*color: var\(--msa-text\);\s*border: none;\s*font-size: 15px;\s*font-weight: 400;\s*padding: 14px 0;/g,
  `.msa__mobile-toggle {
    display: inline-flex;
    border-radius: 0;
    background: transparent;
    color: var(--msa-text);
    border: 1px solid var(--msa-border);
    font-size: 15px;
    font-weight: 400;
    padding: 12px 20px;`
);

// 3. Add border and padding to msa__sort-custom .msa__filter-btn on mobile
css = css.replace(
  /\.msa__sort-custom \.msa__filter-btn {\s*display: inline-flex;\s*width: auto;\s*padding: 14px 0;\s*border: none;/g,
  `.msa__sort-custom .msa__filter-btn {
    display: inline-flex;
    width: auto;
    padding: 12px 20px;
    border: 1px solid var(--msa-border);`
);

fs.writeFileSync('assets/section-myduke-shop-all.css', css);
