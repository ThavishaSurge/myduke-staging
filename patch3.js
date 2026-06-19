const fs = require('fs');
let css = fs.readFileSync('assets/section-myduke-shop-all.css', 'utf8');

// Replace the mobile toggles container definition (the one we appended earlier)
css = css.replace(
  /\.msa__mobile-toggles {\s*display: flex;\s*flex-direction: column;\s*width: 100%;\s*margin-bottom: 0;\s*gap: 0;\s*border-top: 1px solid var\(--msa-border\);\s*}/,
  `.msa__mobile-toggles {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 0;
    gap: 12px;
    border-top: none;
  }`
);

// Replace the mobile toggle button definition
css = css.replace(
  /\.msa__mobile-toggle {\s*display: flex;\s*border-radius: 0;\s*background: transparent;\s*color: var\(--msa-text\);\s*border: none;\s*border-bottom: 1px solid var\(--msa-border\);\s*font-size: 15px;\s*font-weight: 400;\s*padding: 18px 20px;\s*justify-content: space-between;\s*align-items: center;\s*transition: none;\s*width: 100%;\s*}/,
  `.msa__mobile-toggle {
    display: inline-flex;
    border-radius: 0;
    background: transparent;
    color: var(--msa-text);
    border: none;
    font-size: 15px;
    font-weight: 400;
    padding: 14px 0;
    justify-content: flex-start;
    align-items: center;
    gap: 8px;
    transition: none;
    width: auto;
  }`
);

// Remove the border-color override on aria-expanded
css = css.replace(
  /\.msa__mobile-toggle\[aria-expanded="true"\] {\s*background: transparent;\s*color: var\(--msa-text\);\s*border-color: var\(--msa-border\);\s*box-shadow: none;\s*}/,
  `.msa__mobile-toggle[aria-expanded="true"] {
    background: transparent;
    color: var(--msa-text);
    border: none;
    box-shadow: none;
  }`
);

// Remove the border-bottom from msa__sort-mobile
css = css.replace(
  /\.msa__sort-mobile {\s*border-bottom: 1px solid var\(--msa-border\);\s*}/,
  `.msa__sort-mobile {
    border: none;
  }`
);

// Also need to make sure the sort-mobile button inside doesn't have 100% width and padding
// The .msa__sort-mobile has a .msa__filter-btn inside it.
// On mobile, .msa__filter-btn defaults to:
// .msa__filter-btn { width: 100%; ... justify-content: space-between; }
// We need to override this for .msa__sort-mobile .msa__filter-btn
css += `
@media (max-width: 767.98px) {
  .msa__sort-mobile .msa__filter-btn {
    display: inline-flex;
    width: auto;
    padding: 14px 0;
    border: none;
    justify-content: flex-start;
    gap: 8px;
  }
}
`;

fs.writeFileSync('assets/section-myduke-shop-all.css', css);
