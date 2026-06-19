const fs = require('fs');
let liquid = fs.readFileSync('sections/main-search.liquid', 'utf8');

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

const sortSelectRegex = /<div class="facet-sort-select__select focus-inset button button--secondary" tabindex="0">[\s\S]*?<\/div>\s*<div\s*class="facet-sort-modal"/;

const newSortSelect = `<div class="facet-sort-select__select focus-inset button button--secondary" tabindex="0">
                        <div class="facet-sort-select__icon desktop-icon">
                          {% render 'icon-sort' %}
                        </div>
                        <span class="facet-sort-select__current body-normal desktop-only-text">
                          {%- assign sort_by = search.sort_by | default: search.default_sort_by -%}
                          {%- for option in search.sort_options -%}
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

fs.writeFileSync('sections/main-search.liquid', liquid);
