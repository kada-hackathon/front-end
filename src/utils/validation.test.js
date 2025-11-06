import { validationUtils } from './validation';

describe('Worklog Validation Tests', () => {
  describe('Title Validation', () => {
    test('should reject empty title', () => {
      const result = validationUtils.worklog.validateContent({
        title: '',
        content: 'Some content',
        tag: []
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.title).toBe('Title cannot be empty');
    });

    test('should reject title with special characters', () => {
      const result = validationUtils.worklog.validateContent({
        title: 'Title with <tags>',
        content: 'Some content',
        tag: []
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.title).toBe('Title cannot contain special characters');
    });

    test('should reject title longer than 200 characters', () => {
      const longTitle = 'a'.repeat(201);
      const result = validationUtils.worklog.validateContent({
        title: longTitle,
        content: 'Some content',
        tag: []
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.title).toBe('Title maximum 200 characters');
    });

    test('should reject title with leading/trailing spaces', () => {
      const result = validationUtils.worklog.validateContent({
        title: ' Title with spaces ',
        content: 'Some content',
        tag: []
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.title).toBe('Title cannot start or end with whitespace');
    });
  });

  describe('Content Validation', () => {
    test('should reject empty content', () => {
      const result = validationUtils.worklog.validateContent({
        title: 'Valid Title',
        content: '',
        tag: []
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.content).toBe('Content cannot be empty');
    });

    test('should handle HTML content properly', () => {
      const result = validationUtils.worklog.validateContent({
        title: 'Valid Title',
        content: '<p>Valid content</p>',
        tag: []
      });
      expect(result.isValid).toBe(true);
    });
  });

  describe('Tag Validation', () => {
    test('should reject more than 5 tags', () => {
      const result = validationUtils.worklog.validateContent({
        title: 'Valid Title',
        content: 'Valid content',
        tag: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5', 'tag6']
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.tag).toBe('Maximum 5 tags');
    });

    test('should reject tags with special characters', () => {
      const result = validationUtils.worklog.validateContent({
        title: 'Valid Title',
        content: 'Valid content',
        tag: ['tag<1>']
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.tag).toBe('Tag "tag<1>" contains invalid characters');
    });

    test('should reject tags longer than 20 characters', () => {
      const result = validationUtils.worklog.validateContent({
        title: 'Valid Title',
        content: 'Valid content',
        tag: ['thisIsAVeryLongTagNameThatExceeds20Characters']
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.tag).toBe('Tag "thisIsAVeryLongTagNameThatExceeds20Characters" is too long (max 20 characters)');
    });
  });

  describe('Valid Cases', () => {
    test('should accept valid worklog data', () => {
      const result = validationUtils.worklog.validateContent({
        title: 'Valid Title',
        content: 'Valid content',
        tag: ['tag1', 'tag2', 'tag3']
      });
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    test('should accept HTML content', () => {
      const result = validationUtils.worklog.validateContent({
        title: 'Valid Title',
        content: '<p>Valid content with <strong>HTML</strong></p>',
        tag: ['tag1']
      });
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });
  });
});