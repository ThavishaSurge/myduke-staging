const fs = require('fs');

let liquid = fs.readFileSync('sections/myduke-section-shop-all.liquid', 'utf8');

// Remove the msa__sort-desktop completely
const sortDesktopRegex = /<div class="msa__sort-group msa__sort-desktop">[\s\S]*?<\/div>\s*<\/div>/;
liquid = liquid.replace(sortDesktopRegex, '');

// Rename msa__sort-mobile to msa__sort-custom
liquid = liquid.replace(/msa__sort-mobile/g, 'msa__sort-custom');

fs.writeFileSync('sections/myduke-section-shop-all.liquid', liquid);

// Now update CSS
let css = fs.readFileSync('assets/section-myduke-shop-all.css', 'utf8');

// Remove the display none for desktop/mobile hiding
css = css.replace(/\.msa__sort-mobile {\s*display: none;\s*}/g, '');
css = css.replace(/\.msa__sort-desktop {\s*display: none !important;\s*}/g, '');
css = css.replace(/\.msa__sort-mobile {\s*display: block;\s*}/g, '');

// Rename msa__sort-mobile to msa__sort-custom
css = css.replace(/\.msa__sort-mobile/g, '.msa__sort-custom');

// We also need to fix .msa__sort-group references if they were changed
css = css.replace(/\.msa__sort-group\.msa__sort-desktop/g, '.msa__sort-custom');

// Also, the desktop flex styling for the old sort group was:
// .msa__sort-group { display: flex; align-items: center; gap: 6px; margin-left: auto; border: 1px solid var(--msa-border); padding: 0 0 0 20px; ... }
// We want the new custom sort dropdown to sit on the right and look like a filter btn!
// The msa__sort-custom is a .msa__filter-group, which on desktop doesn't have margin-left: auto
// We can add margin-left: auto to msa__sort-custom on desktop so it gets pushed to the right.
css += `
@media (min-width: 768px) {
  .msa__sort-custom {
    margin-left: auto;
  }
}
`;

fs.writeFileSync('assets/section-myduke-shop-all.css', css);
