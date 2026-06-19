const fs = require('fs');
let css = fs.readFileSync('assets/section-myduke-shop-all.css', 'utf8');

css = css.replace(
  /\.msa__toolbar {\s*flex-direction: column;\s*align-items: stretch;\s*gap: 0;\s*border-bottom: 1px solid var\(--msa-border\);\s*padding-bottom: 0;\s*margin-bottom: 16px;\s*}/,
  `.msa__toolbar {
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    border-bottom: none;
    padding-bottom: 0;
    margin-bottom: 16px;
  }`
);

fs.writeFileSync('assets/section-myduke-shop-all.css', css);
