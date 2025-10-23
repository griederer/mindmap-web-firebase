import { describe, it, expect } from 'vitest';
import { isValidNodeImage, type NodeImage } from './node';

describe('NodeImage Type Validation', () => {
  describe('isValidNodeImage', () => {
    it('should return true for valid NodeImage', () => {
      const validImage: NodeImage = {
        id: 'img-1234567890',
        data: 'data:image/jpeg;base64,/9j/4AAQSkZJRg...',
        filename: 'test.jpg',
        size: 156789,
        addedAt: 1729554100000,
      };

      expect(isValidNodeImage(validImage)).toBe(true);
    });

    it('should return true for PNG image', () => {
      const pngImage = {
        id: 'img-9876543210',
        data: 'data:image/png;base64,iVBORw0KGgo...',
        filename: 'screenshot.png',
        size: 234567,
        addedAt: Date.now(),
      };

      expect(isValidNodeImage(pngImage)).toBe(true);
    });

    it('should return false for null', () => {
      expect(isValidNodeImage(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(isValidNodeImage(undefined)).toBe(false);
    });

    it('should return false for non-object', () => {
      expect(isValidNodeImage('not an object')).toBe(false);
      expect(isValidNodeImage(123)).toBe(false);
      expect(isValidNodeImage(true)).toBe(false);
    });

    it('should return false when id is missing', () => {
      const invalidImage = {
        data: 'data:image/jpeg;base64,/9j/4AAQ...',
        filename: 'test.jpg',
        size: 156789,
        addedAt: 1729554100000,
      };

      expect(isValidNodeImage(invalidImage)).toBe(false);
    });

    it('should return false when data is not a base64 data URI', () => {
      const invalidImage = {
        id: 'img-123',
        data: 'https://example.com/image.jpg', // URL instead of base64
        filename: 'test.jpg',
        size: 156789,
        addedAt: 1729554100000,
      };

      expect(isValidNodeImage(invalidImage)).toBe(false);
    });

    it('should return false when data does not start with data:image/', () => {
      const invalidImage = {
        id: 'img-123',
        data: 'data:text/plain;base64,SGVsbG8=', // Not an image
        filename: 'test.jpg',
        size: 156789,
        addedAt: 1729554100000,
      };

      expect(isValidNodeImage(invalidImage)).toBe(false);
    });

    it('should return false when filename is missing', () => {
      const invalidImage = {
        id: 'img-123',
        data: 'data:image/jpeg;base64,/9j/4AAQ...',
        size: 156789,
        addedAt: 1729554100000,
      };

      expect(isValidNodeImage(invalidImage)).toBe(false);
    });

    it('should return false when size is zero or negative', () => {
      const zeroSize = {
        id: 'img-123',
        data: 'data:image/jpeg;base64,/9j/4AAQ...',
        filename: 'test.jpg',
        size: 0,
        addedAt: 1729554100000,
      };

      const negativeSize = {
        id: 'img-123',
        data: 'data:image/jpeg;base64,/9j/4AAQ...',
        filename: 'test.jpg',
        size: -100,
        addedAt: 1729554100000,
      };

      expect(isValidNodeImage(zeroSize)).toBe(false);
      expect(isValidNodeImage(negativeSize)).toBe(false);
    });

    it('should return false when addedAt is zero or negative', () => {
      const zeroTimestamp = {
        id: 'img-123',
        data: 'data:image/jpeg;base64,/9j/4AAQ...',
        filename: 'test.jpg',
        size: 156789,
        addedAt: 0,
      };

      const negativeTimestamp = {
        id: 'img-123',
        data: 'data:image/jpeg;base64,/9j/4AAQ...',
        filename: 'test.jpg',
        size: 156789,
        addedAt: -1000,
      };

      expect(isValidNodeImage(zeroTimestamp)).toBe(false);
      expect(isValidNodeImage(negativeTimestamp)).toBe(false);
    });

    it('should return false when fields have wrong types', () => {
      const wrongTypes = {
        id: 123, // Should be string
        data: 'data:image/jpeg;base64,/9j/4AAQ...',
        filename: 'test.jpg',
        size: 156789,
        addedAt: 1729554100000,
      };

      expect(isValidNodeImage(wrongTypes)).toBe(false);
    });

    it('should accept various image formats', () => {
      const formats = ['jpeg', 'jpg', 'png', 'gif', 'webp'];

      formats.forEach((format) => {
        const image = {
          id: `img-${format}`,
          data: `data:image/${format};base64,abc123...`,
          filename: `test.${format}`,
          size: 100000,
          addedAt: Date.now(),
        };

        expect(isValidNodeImage(image)).toBe(true);
      });
    });
  });
});
