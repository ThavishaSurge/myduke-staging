const fs = require('fs');
const file = '/Users/thavisha/Desktop/SURGE/Shopify/MyDukeStaging/myduke-staging/sections/myduke-section-shop-all.liquid';
let content = fs.readFileSync(file, 'utf8');

const target = `<span class="msa__plus-minus" aria-hidden="true">
                  <svg class="msa__icon-plus" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  <svg class="msa__icon-minus" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </span>`;

const replacement = `<span class="msa__filter-icons" aria-hidden="true">
                  <svg class="msa__caret" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span class="msa__plus-minus">
                    <svg class="msa__icon-plus" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    <svg class="msa__icon-minus" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </span>
                </span>`;

let parts = content.split(target);
if (parts.length >= 5) {
  content = parts.join(replacement);
  fs.writeFileSync(file, content);
  console.log('Successfully replaced ' + (parts.length - 1) + ' SVGs.');
} else {
  console.log('Not enough parts to replace exactly 4 occurrences. Found: ' + (parts.length - 1));
}
