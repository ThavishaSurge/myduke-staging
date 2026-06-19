const fs = require('fs');

let liquid = fs.readFileSync('sections/main-collection-product-grid.liquid', 'utf8');
let css = fs.readFileSync('assets/template-collection.css', 'utf8');

// 1. Modify Filters Button in liquid
const filterBtnRegex = /<button[\s\S]*?class="button facets-button-show vertical no-js-hidden focus-inset"[\s\S]*?<\/button>/;

const newFilterBtn = `<button
              type="button"
              data-desktop-modal="FacetsWrapperDesktop-{{ section.id }}"
              class="button facets-button-show vertical no-js-hidden focus-inset"
            >
              <span class="show-label desktop-icon" aria-label="{{ 'products.facets.filters' | t }}">
                {%- render 'icon-filter' -%}
              </span>
              <span class="hide-label hidden desktop-icon" aria-label="{{ 'accessibility.close' | t }}">
                {%- render 'icon-filter' -%}
              </span>
              <span class="button__label" data-label="Filter by">
                <span class="desktop-only-text">{{ 'products.facets.filters' | t }}</span>
                <span class="mobile-only-text">Filter by</span>
              </span>
              <span class="mobile-plus-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              </span>
            </button>`;

liquid = liquid.replace(filterBtnRegex, newFilterBtn);

// 2. Modify Sort Button in liquid
const sortSelectRegex = /<div class="facet-sort-select__select focus-inset button button--secondary" tabindex="0">[\s\S]*?<\/div>\s*<div\s*class="facet-sort-modal"/;

const newSortSelect = `<div class="facet-sort-select__select focus-inset button button--secondary" tabindex="0">
                      <div class="facet-sort-select__icon desktop-icon">
                        {% render 'icon-sort' %}
                      </div>
                      <span class="facet-sort-select__current body-normal desktop-only-text">
                        {%- for option in collection.sort_options -%}
                          {% if option.value == sort_by %}
                            {{- option.name | escape -}}
                          {% endif %}
                        {%- endfor -%}
                      </span>
                      <span class="facet-sort-select__current body-normal mobile-only-text">
                        Sort by
                      </span>
                      <span class="mobile-plus-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                      </span>
                    </div>
                    <div
                      class="facet-sort-modal"`;

liquid = liquid.replace(sortSelectRegex, newSortSelect);

fs.writeFileSync('sections/main-collection-product-grid.liquid', liquid);

// 3. Modify CSS
css += `
/* --- Mobile Filter & Sort Overrides --- */
@media (min-width: 768px) {
  .mobile-only-text, .mobile-plus-icon {
    display: none !important;
  }
}

@media (max-width: 767.98px) {
  .desktop-icon, .desktop-only-text {
    display: none !important;
  }
  
  .collection-top__container {
    display: flex;
    flex-direction: column;
    gap: 0;
    padding: 0;
  }

  .collection-top__container-left, .collection-top__container-right {
    width: 100%;
    margin: 0;
    padding: 0;
  }

  /* Make filter form full width */
  .collection-top__container facet-filters-form, .facets-sorting {
    width: 100%;
  }

  .collection-top .facets-button-show, 
  .facet-sort-select__select {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: transparent;
    border: none;
    border-top: 1px solid rgba(var(--color-foreground), 0.08);
    border-radius: 0;
    padding: 18px 0;
    font-size: 15px;
    font-weight: 400;
    color: rgb(var(--color-foreground));
    box-shadow: none;
    min-height: auto;
  }

  /* Make sure sort select has border-bottom for the last item */
  .facet-sort-select__select {
    border-bottom: 1px solid rgba(var(--color-foreground), 0.08);
    padding: 18px 0;
  }

  /* Adjust internal spacing */
  .collection-top .facets-button-show .button__label,
  .facet-sort-select__current {
    font-size: 15px;
    font-family: var(--font-body-family);
    color: rgb(var(--color-foreground));
  }

  .mobile-plus-icon {
    display: flex;
    align-items: center;
    color: rgb(var(--color-foreground), 0.6);
  }

  /* Hide product count and per row toggle on mobile if they are in the way of the stacked design */
  .collection-top__layout-toggler, .facets__product-count {
    display: none !important;
  }
}
`;

fs.writeFileSync('assets/template-collection.css', css);
