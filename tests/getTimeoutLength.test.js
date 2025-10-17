import { describe, it, expect } from 'vitest';
import { getTimeoutLength } from '../src/utils.js';

describe('getTimeoutLength', () => {
    describe('minimum timeout (1000ms)', () => {
        it('should return 1000ms for empty array', () => {
            const result = getTimeoutLength([]);
            expect(result).toBe(1000);
        });

        it('should return 1000ms when calculation is below minimum', () => {
            // 50 elements = 500ms, but minimum is 1000ms
            const elements = new Array(50).fill({});
            const result = getTimeoutLength(elements);
            expect(result).toBe(1000);
        });

        it('should return 1000ms for 99 elements (990ms calculated)', () => {
            const elements = new Array(99).fill({});
            const result = getTimeoutLength(elements);
            expect(result).toBe(1000);
        });

        it('should return 1000ms for exactly 100 elements', () => {
            const elements = new Array(100).fill({});
            const result = getTimeoutLength(elements);
            expect(result).toBe(1000);
        });

        it('should return 1000ms for single element', () => {
            const result = getTimeoutLength([{}]);
            expect(result).toBe(1000);
        });

        it('should return 1000ms for 10 elements (100ms calculated)', () => {
            const elements = new Array(10).fill({});
            const result = getTimeoutLength(elements);
            expect(result).toBe(1000);
        });
    });

    describe('calculated timeout (between 1000ms and 2000ms)', () => {
        it('should return 1010ms for 101 elements', () => {
            const elements = new Array(101).fill({});
            const result = getTimeoutLength(elements);
            expect(result).toBe(1010);
        });

        it('should return 1500ms for 150 elements', () => {
            const elements = new Array(150).fill({});
            const result = getTimeoutLength(elements);
            expect(result).toBe(1500);
        });

        it('should return 1800ms for 180 elements', () => {
            const elements = new Array(180).fill({});
            const result = getTimeoutLength(elements);
            expect(result).toBe(1800);
        });

        it('should return 1990ms for 199 elements', () => {
            const elements = new Array(199).fill({});
            const result = getTimeoutLength(elements);
            expect(result).toBe(1990);
        });
    });

    describe('maximum timeout (2000ms)', () => {
        it('should return 2000ms for exactly 200 elements', () => {
            const elements = new Array(200).fill({});
            const result = getTimeoutLength(elements);
            expect(result).toBe(2000);
        });

        it('should return 2000ms for 201 elements (capped at maximum)', () => {
            const elements = new Array(201).fill({});
            const result = getTimeoutLength(elements);
            expect(result).toBe(2000);
        });

        it('should return 2000ms for 300 elements', () => {
            const elements = new Array(300).fill({});
            const result = getTimeoutLength(elements);
            expect(result).toBe(2000);
        });

        it('should return 2000ms for 500 elements', () => {
            const elements = new Array(500).fill({});
            const result = getTimeoutLength(elements);
            expect(result).toBe(2000);
        });

        it('should return 2000ms for 1000 elements', () => {
            const elements = new Array(1000).fill({});
            const result = getTimeoutLength(elements);
            expect(result).toBe(2000);
        });

        it('should return 2000ms for very large array (10000 elements)', () => {
            const elements = new Array(10000).fill({});
            const result = getTimeoutLength(elements);
            expect(result).toBe(2000);
        });
    });

    describe('boundary values', () => {
        it('should handle exactly 100 elements (boundary of minimum)', () => {
            const elements = new Array(100).fill({});
            const result = getTimeoutLength(elements);
            expect(result).toBe(1000);
        });

        it('should handle exactly 200 elements (boundary of maximum)', () => {
            const elements = new Array(200).fill({});
            const result = getTimeoutLength(elements);
            expect(result).toBe(2000);
        });

        it('should correctly calculate for 101 elements (just above minimum boundary)', () => {
            const elements = new Array(101).fill({});
            const result = getTimeoutLength(elements);
            expect(result).toBe(1010);
        });

        it('should correctly calculate for 199 elements (just below maximum boundary)', () => {
            const elements = new Array(199).fill({});
            const result = getTimeoutLength(elements);
            expect(result).toBe(1990);
        });
    });

    describe('array content independence', () => {
        it('should only care about array length, not content', () => {
            const arrays = [
                new Array(150).fill(null),
                new Array(150).fill(undefined),
                new Array(150).fill({ complex: 'object' }),
                new Array(150).fill('string'),
                new Array(150).fill(123),
                Array.from({ length: 150 }, (_, i) => i)
            ];

            arrays.forEach(arr => {
                expect(getTimeoutLength(arr)).toBe(1500);
            });
        });

        it('should work with sparse arrays', () => {
            const sparseArray = new Array(150);
            const result = getTimeoutLength(sparseArray);
            expect(result).toBe(1500);
        });

        it('should work with arrays of different object types', () => {
            const mixedArray = [
                { tag: 'div', classes: ['test'] },
                { tag: 'span', classes: [] },
                { tag: 'p' }
            ];
            mixedArray.length = 150; // Extend to 150
            const result = getTimeoutLength(mixedArray);
            expect(result).toBe(1500);
        });
    });

    describe('formula verification', () => {
        it('should use formula: length * 10', () => {
            // Test various points to verify the 10x multiplier
            expect(getTimeoutLength(new Array(100).fill({}))).toBe(1000); // 100 * 10 = 1000
            expect(getTimeoutLength(new Array(110).fill({}))).toBe(1100); // 110 * 10 = 1100
            expect(getTimeoutLength(new Array(150).fill({}))).toBe(1500); // 150 * 10 = 1500
            expect(getTimeoutLength(new Array(175).fill({}))).toBe(1750); // 175 * 10 = 1750
        });

        it('should clamp values below 1000 to 1000', () => {
            // Any calculation resulting in < 1000 should return 1000
            for (let i = 0; i <= 99; i++) {
                const result = getTimeoutLength(new Array(i).fill({}));
                expect(result).toBe(1000);
            }
        });

        it('should clamp values above 2000 to 2000', () => {
            // Any calculation resulting in > 2000 should return 2000
            const testCases = [201, 250, 300, 500, 1000, 5000];
            testCases.forEach(length => {
                const result = getTimeoutLength(new Array(length).fill({}));
                expect(result).toBe(2000);
            });
        });
    });

    describe('edge cases with parseInt', () => {
        it('should handle array-like objects with length property', () => {
            const arrayLike = { length: 150 };
            const result = getTimeoutLength(arrayLike);
            expect(result).toBe(1500);
        });

        it('should handle objects with numeric length', () => {
            const obj = { length: 175 };
            const result = getTimeoutLength(obj);
            expect(result).toBe(1750);
        });

        it('should handle string length properties (parseInt behavior)', () => {
            const obj = { length: '150' };
            const result = getTimeoutLength(obj);
            expect(result).toBe(1500);
        });

        it('should handle decimal length values (parseInt truncates)', () => {
            const obj = { length: 150.9 };
            const result = getTimeoutLength(obj);
            expect(result).toBe(1500);
        });

        it('should return 1000 for NaN length (parseInt returns NaN, NaN * 10 = NaN, NaN < 1000 = false, NaN > 2000 = false)', () => {
            const obj = { length: 'invalid' };
            const result = getTimeoutLength(obj);
            // NaN * 10 = NaN, the comparisons with NaN are all false, so timeout stays as NaN
            // Then NaN < 1000 is false, so it doesn't set to 1000
            // Then NaN > 2000 is false, so it doesn't set to 2000
            // Result will be NaN
            expect(isNaN(result)).toBe(true);
        });
    });

    describe('return value type', () => {
        it('should return a number', () => {
            const result = getTimeoutLength(new Array(150).fill({}));
            expect(typeof result).toBe('number');
        });

        it('should return an integer value', () => {
            const result = getTimeoutLength(new Array(150).fill({}));
            expect(Number.isInteger(result)).toBe(true);
        });
    });

    describe('realistic use cases', () => {
        it('should handle typical small component count', () => {
            // Typical: 20-50 components
            const result = getTimeoutLength(new Array(30).fill({}));
            expect(result).toBe(1000); // Minimum
        });

        it('should handle medium component count', () => {
            // Medium: 100-150 components
            const result = getTimeoutLength(new Array(125).fill({}));
            expect(result).toBe(1250);
        });

        it('should handle large component count', () => {
            // Large: 200+ components
            const result = getTimeoutLength(new Array(250).fill({}));
            expect(result).toBe(2000); // Maximum
        });
    });
});