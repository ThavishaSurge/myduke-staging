const fs = require('fs');

let css = fs.readFileSync('assets/section-myduke-shop-all.css', 'utf8');

// 1. Add border to filter buttons on desktop to make them boxes
// Currently .msa__filter-btn has border: none;
css = css.replace(
  /\.msa__filter-btn {\s*display: inline-flex;[\s\S]*?border: none;/g,
  `.msa__filter-btn {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 12px 20px;
  background: transparent;
  border: 1px solid var(--msa-border);`
);

// 2. Fix caret vertical alignment by removing bottom: 7px;
css = css.replace(
  /\.msa__filter-icons {\s*position: relative;\s*bottom: 7px;\s*}/g,
  `.msa__filter-icons {
  position: relative;
  display: flex;
  align-items: center;
}`
);

// 3. Make the Sort By group a unified box
// Remove border from msa__sort-select
css = css.replace(
  /\.msa__sort-select {\s*appearance: none;[\s\S]*?border: 1px solid var\(--msa-border\);/g,
  `.msa__sort-select {
  appearance: none;
  -webkit-appearance: none;
  padding: 12px 40px 12px 6px;
  border: none;`
);

// Add border to msa__sort-group, add padding to make it look like the filter buttons
css = css.replace(
  /\.msa__sort-group {\s*display: flex;\s*align-items: center;\s*gap: 10px;\s*margin-left: auto;\s*}/g,
  `.msa__sort-group {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
  border: 1px solid var(--msa-border);
  padding: 0 0 0 20px;
  background: transparent;
  transition: all 0.3s ease;
}`
);

// On hover, highlight the unified sort group
css = css.replace(
  /\.msa__sort-select:hover,\s*\.msa__sort-select:focus {\s*border-color: var\(--msa-teal\);\s*box-shadow: 0 4px 12px rgba\(33, 131, 128, 0\.08\);\s*}/g,
  `.msa__sort-group.msa__sort-desktop:hover,
.msa__sort-group.msa__sort-desktop:focus-within {
  border-color: var(--msa-teal);
  box-shadow: 0 4px 12px rgba(33, 131, 128, 0.08);
}`
);

fs.writeFileSync('assets/section-myduke-shop-all.css', css);
