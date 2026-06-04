/**
 * MyDuke FAQ Schema Generator
 *
 * Automatically scans the page for FAQ sections and generates valid
 * FAQPage schema (JSON-LD) for SEO purposes.
 *
 * Supports:
 * - myduke-faq sections
 * - myduke-faq-page sections
 * - Schema.org FAQPage specification
 */

(function() {
  'use strict';

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    // Find all FAQ schema generator sections on the page
    const schemaScripts = document.querySelectorAll('script[type="application/ld+json"][id^="myduke-faq-schema-"]');

    schemaScripts.forEach(schemaScript => {
      generateFAQSchema(schemaScript);
    });
  }

  /**
   * Generate FAQ schema for a specific schema script element
   * @param {HTMLElement} schemaScript - The script tag to populate with schema
   */
  function generateFAQSchema(schemaScript) {
    const sectionId = schemaScript.id.replace('myduke-faq-schema-', '');
    const section = schemaScript.closest('.myduke-faq-schema-generator-section');

    if (!section) return;

    // Get settings from data attributes (these would be added via Liquid if needed)
    // For now, we'll scan all FAQ sections by default
    const settings = {
      includeMydukeFaq: true,
      includeMydukeFaqPage: true
    };

    // Collect all FAQ items from the page
    const faqData = collectFAQData(settings);

    // Generate the schema object
    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqData.questions
    };

    // Update the script tag with the generated schema
    schemaScript.textContent = JSON.stringify(schema, null, 2);

    // Update preview if in design mode
    updatePreview(section, faqData, schema);
  }

  /**
   * Collect FAQ data from all FAQ sections on the page
   * @param {Object} settings - Settings object
   * @returns {Object} Object containing sections and questions data
   */
  function collectFAQData(settings) {
    const sections = [];
    const questions = [];
    let totalQuestions = 0;

    // Scan for myduke-faq sections
    if (settings.includeMydukeFaq) {
      const faqSections = document.querySelectorAll('.myduke-faq-section');
      faqSections.forEach(section => {
        const sectionData = extractFAQFromMyDukeFaq(section);
        if (sectionData.questions.length > 0) {
          sections.push({
            type: 'myduke-faq',
            heading: sectionData.heading,
            questionsCount: sectionData.questions.length
          });
          questions.push(...sectionData.questions);
          totalQuestions += sectionData.questions.length;
        }
      });
    }

    // Scan for myduke-faq-page sections
    if (settings.includeMydukeFaqPage) {
      const faqPageSections = document.querySelectorAll('.myduke-faq-page-section');
      faqPageSections.forEach(section => {
        const sectionData = extractFAQFromMyDukeFaqPage(section);
        if (sectionData.questions.length > 0) {
          sections.push({
            type: 'myduke-faq-page',
            heading: sectionData.heading,
            questionsCount: sectionData.questions.length
          });
          questions.push(...sectionData.questions);
          totalQuestions += sectionData.questions.length;
        }
      });
    }

    return {
      sections,
      questions,
      totalSections: sections.length,
      totalQuestions
    };
  }

  /**
   * Extract FAQ data from a myduke-faq section
   * @param {HTMLElement} section - The FAQ section element
   * @returns {Object} Object containing heading and questions
   */
  function extractFAQFromMyDukeFaq(section) {
    const heading = extractHeading(section, '.myduke-faq__heading');
    const questions = [];

    const faqItems = section.querySelectorAll('.myduke-faq__item');
    faqItems.forEach(item => {
      const questionEl = item.querySelector('.myduke-faq__question');
      const answerEl = item.querySelector('.myduke-faq__answer');

      if (questionEl && answerEl) {
        const questionText = cleanText(questionEl.textContent);
        const answerText = cleanHTML(answerEl.innerHTML);

        if (questionText && answerText) {
          questions.push({
            "@type": "Question",
            "name": questionText,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": answerText
            }
          });
        }
      }
    });

    return { heading, questions };
  }

  /**
   * Extract FAQ data from a myduke-faq-page section
   * @param {HTMLElement} section - The FAQ page section element
   * @returns {Object} Object containing heading and questions
   */
  function extractFAQFromMyDukeFaqPage(section) {
    const heading = extractHeading(section, '.myduke-faq-page__faq-title');
    const questions = [];

    const faqItems = section.querySelectorAll('.myduke-faq-page__item');
    faqItems.forEach(item => {
      const questionEl = item.querySelector('.myduke-faq-page__question');
      const answerEl = item.querySelector('.myduke-faq-page__answer');

      if (questionEl && answerEl) {
        const questionText = cleanText(questionEl.textContent);
        const answerText = cleanHTML(answerEl.innerHTML);

        if (questionText && answerText) {
          questions.push({
            "@type": "Question",
            "name": questionText,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": answerText
            }
          });
        }
      }
    });

    return { heading, questions };
  }

  /**
   * Extract heading text from a section
   * @param {HTMLElement} section - The section element
   * @param {string} selector - CSS selector for the heading
   * @returns {string} Cleaned heading text
   */
  function extractHeading(section, selector) {
    const headingEl = section.querySelector(selector);
    return headingEl ? cleanText(headingEl.textContent) : '';
  }

  /**
   * Clean text content (remove extra whitespace, trim)
   * @param {string} text - Raw text
   * @returns {string} Cleaned text
   */
  function cleanText(text) {
    return text.replace(/\s+/g, ' ').trim();
  }

  /**
   * Clean HTML content for schema (strip all HTML tags, keep only text)
   * @param {string} html - Raw HTML
   * @returns {string} Plain text without HTML tags
   */
  function cleanHTML(html) {
    // Create a temporary element to parse HTML
    const temp = document.createElement('div');
    temp.innerHTML = html;

    // Remove script and style tags
    temp.querySelectorAll('script, style').forEach(el => el.remove());

    // Get only the text content (strips all HTML tags)
    let cleaned = temp.textContent || temp.innerText || '';

    // Remove extra whitespace
    cleaned = cleaned.replace(/\s+/g, ' ').trim();

    return cleaned;
  }

  /**
   * Update the preview display in the Shopify customizer
   * @param {HTMLElement} section - The schema generator section
   * @param {Object} faqData - Collected FAQ data
   * @param {Object} schema - Generated schema object
   */
  function updatePreview(section, faqData, schema) {
    const preview = section.querySelector('.myduke-faq-schema-preview');
    if (!preview) return;

    // Update status
    const statusEl = preview.querySelector('[data-status]');
    if (statusEl) {
      if (faqData.totalQuestions === 0) {
        statusEl.textContent = 'No FAQs found';
        statusEl.setAttribute('data-status', 'error');
      } else {
        statusEl.textContent = 'Schema generated successfully';
        statusEl.setAttribute('data-status', 'ready');
      }
    }

    // Update sections count
    const sectionsCountEl = preview.querySelector('[data-sections-count]');
    if (sectionsCountEl) {
      sectionsCountEl.textContent = faqData.totalSections;
    }

    // Update questions count
    const questionsCountEl = preview.querySelector('[data-questions-count]');
    if (questionsCountEl) {
      questionsCountEl.textContent = faqData.totalQuestions;
    }

    // Update schema output textarea
    const schemaOutputEl = preview.querySelector('[data-schema-output]');
    if (schemaOutputEl) {
      schemaOutputEl.value = JSON.stringify(schema, null, 2);
      // Auto-resize textarea to fit content
      schemaOutputEl.style.height = 'auto';
      schemaOutputEl.style.height = Math.min(schemaOutputEl.scrollHeight, 500) + 'px';
    }
  }

  // Handle Shopify theme editor section updates
  if (window.Shopify && window.Shopify.designMode) {
    document.addEventListener('shopify:section:load', function(event) {
      const section = event.target;
      const schemaScript = section.querySelector('script[type="application/ld+json"][id^="myduke-faq-schema-"]');
      if (schemaScript) {
        // Re-generate schema when section is loaded/updated
        setTimeout(() => generateFAQSchema(schemaScript), 100);
      }
    });

    document.addEventListener('shopify:section:reorder', function() {
      // Re-generate all schemas when sections are reordered
      setTimeout(init, 100);
    });
  }

})();
