const fs = require('fs');

// Read files
let liquid = fs.readFileSync('sections/myduke-section-shop-all.liquid', 'utf8');
let css = fs.readFileSync('assets/section-myduke-shop-all.css', 'utf8');

// --- 1. Modify myduke-section-shop-all.liquid ---
// Replace Filters toggle button inside msa__mobile-toggles
const toggleRegex = /<button class="msa__mobile-toggle js-msa-mobile-toggle" aria-expanded="false">[\s\S]*?<\/button>/;
const newToggle = `<button class="msa__mobile-toggle js-msa-mobile-toggle" aria-expanded="false">
              <span class="msa__mobile-toggle-inner">
                <span>Filter by</span>
              </span>
              <span class="msa__plus-minus">
                <svg class="msa__icon-plus" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                <svg class="msa__icon-minus" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </span>
            </button>`;
liquid = liquid.replace(toggleRegex, newToggle);

// Replace Sort group inside msa__mobile-toggles
// We want to keep the desktop select, but add a mobile custom sort dropdown
const sortGroupRegex = /<div class="msa__sort-group">[\s\S]*?<\/div>\s*<\/div>/;

// We need to carefully extract the current sort group and append the mobile one.
const sortSelectHTML = liquid.match(sortGroupRegex)[0];

const mobileSortHTML = `
            <div class="msa__filter-group msa__sort-mobile" data-filter-group="sort">
              <button
                class="msa__filter-btn"
                aria-haspopup="listbox"
                aria-expanded="false"
                id="msa-sort-mobile-btn-{{ section.id }}"
              >
                <span class="msa__filter-label">
                  {{- section.settings.sort_label | default: 'Sort by' -}}
                </span>
                <span class="msa__filter-icons" aria-hidden="true">
                  <span class="msa__plus-minus" style="display: flex;">
                    <svg class="msa__icon-plus" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    <svg class="msa__icon-minus" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </span>
                </span>
              </button>

              <div class="msa__dropdown" role="listbox" aria-labelledby="msa-sort-mobile-btn-{{ section.id }}">
                <div class="msa__dropdown-inner">
                  {%- if section.settings.show_sort_featured -%}
                    <button class="msa__dropdown-item msa__dropdown-item--active" data-filter-value="manual" data-filter-type="sort" role="option" aria-selected="true">{{ section.settings.sort_featured_label | default: 'Featured' }}</button>
                  {%- endif -%}
                  {%- if section.settings.show_sort_best -%}
                    <button class="msa__dropdown-item" data-filter-value="best-selling" data-filter-type="sort" role="option" aria-selected="false">{{ section.settings.sort_best_label | default: 'Best Selling' }}</button>
                  {%- endif -%}
                  {%- if section.settings.show_sort_az -%}
                    <button class="msa__dropdown-item" data-filter-value="title-ascending" data-filter-type="sort" role="option" aria-selected="false">{{ section.settings.sort_az_label | default: 'A–Z' }}</button>
                  {%- endif -%}
                  {%- if section.settings.show_sort_za -%}
                    <button class="msa__dropdown-item" data-filter-value="title-descending" data-filter-type="sort" role="option" aria-selected="false">{{ section.settings.sort_za_label | default: 'Z–A' }}</button>
                  {%- endif -%}
                  {%- if section.settings.show_sort_price_asc -%}
                    <button class="msa__dropdown-item" data-filter-value="price-ascending" data-filter-type="sort" role="option" aria-selected="false">{{ section.settings.sort_price_asc_label | default: 'Price: Low → High' }}</button>
                  {%- endif -%}
                  {%- if section.settings.show_sort_price_desc -%}
                    <button class="msa__dropdown-item" data-filter-value="price-descending" data-filter-type="sort" role="option" aria-selected="false">{{ section.settings.sort_price_desc_label | default: 'Price: High → Low' }}</button>
                  {%- endif -%}
                  {%- if section.settings.show_sort_new -%}
                    <button class="msa__dropdown-item" data-filter-value="created-descending" data-filter-type="sort" role="option" aria-selected="false">{{ section.settings.sort_new_label | default: 'Newest' }}</button>
                  {%- endif -%}
                  {%- if section.settings.show_sort_old -%}
                    <button class="msa__dropdown-item" data-filter-value="created-ascending" data-filter-type="sort" role="option" aria-selected="false">{{ section.settings.sort_old_label | default: 'Oldest' }}</button>
                  {%- endif -%}
                </div>
              </div>
            </div>`;

// Add classes to toggle desktop/mobile sort
let modifiedSortSelectHTML = sortSelectHTML.replace('<div class="msa__sort-group">', '<div class="msa__sort-group msa__sort-desktop">');

liquid = liquid.replace(sortGroupRegex, modifiedSortSelectHTML + '\n' + mobileSortHTML);

// Write back liquid
fs.writeFileSync('sections/myduke-section-shop-all.liquid', liquid);

// --- 2. Modify section-myduke-shop-all.css ---

// First, make .msa__sort-mobile hidden on desktop, and .msa__sort-desktop hidden on mobile.
css += `
/* Media queries for new mobile sort and filter layouts */
.msa__sort-mobile { display: none; }
@media (max-width: 767.98px) {
  .msa__sort-desktop { display: none !important; }
  .msa__sort-mobile { display: block; }
}
`;

// Modify mobile toggles
css = css.replace(
  /grid-template-columns: 3fr 2fr;[\s\S]*?margin-bottom: 0;\s*gap: 12px;/,
  `display: flex;
    flex-direction: column;
    width: 100%;
    margin-bottom: 0;
    gap: 0;
    border-top: 1px solid var(--msa-border);`
);

// Modify .msa__mobile-toggle to not be a box
css = css.replace(
  /\.msa__mobile-toggle {[\s\S]*?transition: all 0\.3s ease;\s*}/,
  `.msa__mobile-toggle {
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
  }`
);

// Remove the box shadow and teal background from aria-expanded
css = css.replace(
  /\.msa__mobile-toggle\[aria-expanded="true"\] {[\s\S]*?box-shadow: 0 4px 12px rgba\(33, 131, 128, 0\.2\);\s*}/,
  `.msa__mobile-toggle[aria-expanded="true"] {
    background: transparent;
    color: var(--msa-text);
    border-color: var(--msa-border);
    box-shadow: none;
  }`
);

// Add styling for the plus/minus inside .msa__mobile-toggle
css += `
@media (max-width: 767.98px) {
  .msa__mobile-toggle .msa__plus-minus {
    display: flex;
    position: relative;
    width: 20px;
    height: 20px;
    align-items: center;
    justify-content: center;
  }
  .msa__mobile-toggle[aria-expanded="true"] .msa__icon-plus {
    opacity: 0;
    transform: translate(-50%, -50%) rotate(90deg);
  }
  .msa__mobile-toggle[aria-expanded="true"] .msa__icon-minus {
    opacity: 1;
    transform: translate(-50%, -50%) rotate(0deg);
  }
  .msa__sort-mobile {
    border-bottom: 1px solid var(--msa-border);
  }
}
`;

fs.writeFileSync('assets/section-myduke-shop-all.css', css);
