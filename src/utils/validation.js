export const validationUtils = {
  worklog: {
    validateContent({ title, content, tag }) {
      const errors = {};
      console.log('Validating worklog:', { title, content, tag }); // Debug input

      // Title validation
      if (!title?.trim()) {
        errors.title = 'Title cannot be empty';
      } else if (title.length > 200) {
        errors.title = 'Title maximum 200 characters';
      } else if (/[<>{}]/.test(title)) {
        errors.title = 'Title cannot contain special characters';
      } else if (/^\s+|\s+$/.test(title)) {
        errors.title = 'Title cannot start or end with whitespace';
      }
      
      // Content validation
      // Check if content is HTML string
      let plainContent = '';
      if (typeof content === 'string') {
        if (content.includes('<p>') || content.includes('</p>')) {
          // If it's HTML, strip tags
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = content;
          plainContent = tempDiv.textContent || tempDiv.innerText;
        } else {
          plainContent = content;
        }
      }
      console.log('Plain content:', plainContent); // Debug content

      if (!plainContent?.trim()) {
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
          if (t && t.length > 20) {
            errors.tag = `Tag "${t}" is too long (max 20 characters)`;
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