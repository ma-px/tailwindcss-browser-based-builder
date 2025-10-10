import { describe, it, expect, beforeEach } from 'vitest';
import { mergeTagsWithClasses } from '../src/utils.js'

describe('mergeTagsWithClasses', () => {
  let firstArray;
  let secondArray;

  beforeEach(() => {
    // Reset arrays before each test
    firstArray = [];
    secondArray = [];
  });

  it('should return a copy of the first array when second array is empty', () => {
    firstArray = [
      { tag: 'div', classes: ['container'] },
      { tag: 'span', classes: ['text-bold'] }
    ];
    secondArray = [];

    const result = mergeTagsWithClasses(firstArray, secondArray);

    expect(result).toEqual(firstArray);
    expect(result).not.toBe(firstArray); // Should be a copy, not the same reference
  });

  it('should add all items from second array when first array is empty', () => {
    firstArray = [];
    secondArray = [
      { tag: 'div', classes: ['container'] },
      { tag: 'span', classes: ['text-bold'] }
    ];

    const result = mergeTagsWithClasses(firstArray, secondArray);

    expect(result).toEqual(secondArray);
    expect(result.length).toBe(2);
  });

  it('should not add duplicate tag-class combinations', () => {
    firstArray = [
      { tag: 'div', classes: ['container', 'mx-auto'] },
      { tag: 'span', classes: ['text-bold'] }
    ];
    secondArray = [
      { tag: 'div', classes: ['container', 'mx-auto'] }, // Duplicate
      { tag: 'p', classes: ['paragraph'] } // New
    ];

    const result = mergeTagsWithClasses(firstArray, secondArray);

    expect(result.length).toBe(3);
    expect(result).toContainEqual({ tag: 'div', classes: ['container', 'mx-auto'] });
    expect(result).toContainEqual({ tag: 'span', classes: ['text-bold'] });
    expect(result).toContainEqual({ tag: 'p', classes: ['paragraph'] });
  });

  it('should handle classes in different order as duplicates', () => {
    firstArray = [
      { tag: 'div', classes: ['container', 'mx-auto', 'p-4'] }
    ];
    secondArray = [
      { tag: 'div', classes: ['mx-auto', 'p-4', 'container'] } // Same classes, different order
    ];

    const result = mergeTagsWithClasses(firstArray, secondArray);

    expect(result.length).toBe(1);
    expect(result).toEqual(firstArray);
  });

  it('should add items with same tag but different classes', () => {
    firstArray = [
      { tag: 'div', classes: ['container'] }
    ];
    secondArray = [
      { tag: 'div', classes: ['wrapper'] }, // Same tag, different classes
      { tag: 'div', classes: ['container', 'mx-auto'] } // Same tag, more classes
    ];

    const result = mergeTagsWithClasses(firstArray, secondArray);

    expect(result.length).toBe(3);
    expect(result).toContainEqual({ tag: 'div', classes: ['container'] });
    expect(result).toContainEqual({ tag: 'div', classes: ['wrapper'] });
    expect(result).toContainEqual({ tag: 'div', classes: ['container', 'mx-auto'] });
  });

  it('should handle empty classes arrays', () => {
    firstArray = [
      { tag: 'div', classes: [] }
    ];
    secondArray = [
      { tag: 'div', classes: [] }, // Duplicate with empty classes
      { tag: 'span', classes: [] } // New with empty classes
    ];

    const result = mergeTagsWithClasses(firstArray, secondArray);

    expect(result.length).toBe(2);
    expect(result).toContainEqual({ tag: 'div', classes: [] });
    expect(result).toContainEqual({ tag: 'span', classes: [] });
  });

  it('should handle complex scenario with multiple duplicates and new items', () => {
    firstArray = [
      { tag: 'div', classes: ['container', 'flex'] },
      { tag: 'span', classes: ['text-sm'] },
      { tag: 'button', classes: ['btn', 'btn-primary'] }
    ];
    secondArray = [
      { tag: 'div', classes: ['flex', 'container'] }, // Duplicate (different order)
      { tag: 'span', classes: ['text-sm'] }, // Duplicate
      { tag: 'p', classes: ['paragraph'] }, // New
      { tag: 'a', classes: ['link', 'underline'] }, // New
      { tag: 'button', classes: ['btn', 'btn-secondary'] } // Same tag, different classes
    ];

    const result = mergeTagsWithClasses(firstArray, secondArray);

    expect(result.length).toBe(6);
    expect(result).toContainEqual({ tag: 'div', classes: ['container', 'flex'] });
    expect(result).toContainEqual({ tag: 'span', classes: ['text-sm'] });
    expect(result).toContainEqual({ tag: 'button', classes: ['btn', 'btn-primary'] });
    expect(result).toContainEqual({ tag: 'p', classes: ['paragraph'] });
    expect(result).toContainEqual({ tag: 'a', classes: ['link', 'underline'] });
    expect(result).toContainEqual({ tag: 'button', classes: ['btn', 'btn-secondary'] });
  });

  it('should not mutate the original arrays', () => {
    firstArray = [
      { tag: 'div', classes: ['container'] }
    ];
    secondArray = [
      { tag: 'span', classes: ['text-bold'] }
    ];

    const firstArrayCopy = JSON.parse(JSON.stringify(firstArray));
    const secondArrayCopy = JSON.parse(JSON.stringify(secondArray));

    mergeTagsWithClasses(firstArray, secondArray);

    expect(firstArray).toEqual(firstArrayCopy);
    expect(secondArray).toEqual(secondArrayCopy);
  });
});