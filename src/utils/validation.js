export const validationUtils = {
  worklog: {
    validateContent({ title, content, tag }) {
      const errors = {};
      console.log('Validating worklog:', { title, content, tag }); // Debug input

      // Title validation
      if (!title?.trim()) {
        errors.title = 'Title cannot be empty';
      } else if (title.length > 50) {
        errors.title = 'Title maximum 50 characters';
      } else if (/[<>{}]/.test(title)) {
        errors.title = 'Title cannot contain special characters';
      } else if (/^\s+|\s+$/.test(title)) {
        errors.title = 'Title cannot start or end with whitespace';
      }
      
      // Content validation
      // Check if content is HTML string
      let plainContent = '';
      if (typeof content === 'string') {
        if (content.includes('<') && content.includes('>')) {
          // If it's HTML, strip tags and get text content
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = content;
          plainContent = (tempDiv.textContent || tempDiv.innerText || '').trim();
        } else {
          plainContent = content.trim();
        }
      } else if (content) {
        // Handle non-string content (e.g., object from editor)
        plainContent = String(content).trim();
      }
      
      console.log('Plain content:', plainContent); // Debug content
      console.log('Plain content length:', plainContent.length); // Debug length

      // Check if content is truly empty after stripping HTML and trimming
      if (!plainContent || plainContent.length === 0) {
        errors.content = 'Content cannot be empty';
        console.log('Content is empty after processing'); // Debug empty content
      }
      
      // Tags validation
      console.log('Processing tags:', tag); // Debug tags input
      if (tag && Array.isArray(tag)) {
        // Check max tags
        if (tag.length > 5) {
          errors.tag = 'Maximum 5 tags';
          console.log('Too many tags:', tag.length);
        }
        
        // Check individual tags
        tag.forEach((t, index) => {
          if (t && t.length > 30) {
            errors.tag = `Tag "${t}" is too long (max 30 characters)`;
            console.log('Long tag found:', t);
          }
          if (t && /[<>{}]/.test(t)) {
            errors.tag = `Tag "${t}" contains invalid characters`;
            console.log('Invalid tag found:', t);
          }
        });
      }
      
      console.log('Validation errors:', errors); // Debug errors
      
      const isValid = Object.keys(errors).length === 0;
      console.log('Validation result:', isValid); // Debug result
      
      return { 
        isValid,
        errors 
      };
    },
  }
};