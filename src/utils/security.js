import DOMPurify from 'dompurify';

export const securityUtils = {
  sanitizeContent(content) {
    if (!content) return '';
    
    return DOMPurify.sanitize(content, {
      ALLOWED_TAGS: [
        'p', 'b', 'i', 'em', 'strong', 'u', 'br', 
        'ul', 'ol', 'li', 'h1', 'h2', 'h3'
      ],
      ALLOWED_ATTR: [], // No attributes allowed for security
    });
  },

  // Utility untuk sanitize input biasa (title, tags, dll)
  sanitizeInput(input) {
    if (!input) return '';
    return DOMPurify.sanitize(input, { 
      ALLOWED_TAGS: [], // No HTML tags allowed
      ALLOWED_ATTR: [] 
    });
  }
};