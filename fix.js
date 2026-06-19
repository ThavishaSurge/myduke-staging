const fs = require('fs');
let css = fs.readFileSync('assets/section-myduke-shop-all.css', 'utf8');

// The broken block:
const brokenRegex = /\.msa__mobile-toggle {\s*display: flex;\s*border-radius: 0;\s*background: transparent;\s*color: var\(--msa-text\);\s*border: none;\s*border-bottom: 1px solid var\(--msa-border\);\s*font-size: 15px;\s*font-weight: 400;\s*padding: 18px 20px;\s*justify-content: space-between;\s*align-items: center;\s*transition: none;\s*width: 100%;\s*}/;

const fixedBase = `.msa__mobile-toggle {
  display: none;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 14px 16px;
  background: transparent;
  border: 1px solid var(--msa-border);
  font-family: var(--font-body-family);
  font-size: 14px;
  font-weight: 500;
  color: var(--msa-text);
  cursor: pointer;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
  letter-spacing: 0.01em;
}`;

css = css.replace(brokenRegex, fixedBase);

// Now we need to inject the mobile version into the @media query.
// Look for @media (max-width: 767.98px) { and insert right after it.
const mediaQueryRegex = /@media \(max-width: 767\.98px\) \{/;

const mobileVersion = `@media (max-width: 767.98px) {
  /* ── Filters toggle button ── */
  .msa__mobile-toggle {
    display: flex;
    border-radius: 0;
    background: transparent;
    color: var(--msa-text);
    border: none;
    border-bottom: 1px solid var(--msa-border);
    font-size: 15px;
    font-weight: 400;
    padding: 18px 20px;
    justify-content: space-between;
    align-items: center;
    transition: none;
    width: 100%;
  }`;

css = css.replace(mediaQueryRegex, mobileVersion);

fs.writeFileSync('assets/section-myduke-shop-all.css', css);
