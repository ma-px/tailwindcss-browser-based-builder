import { describe, it, expect } from 'vitest';
import { arraysEqual } from '../src/utils.js';

describe('arraysEqual', () => {
    describe('equal arrays', () => {
        it('should return true for identical arrays in same order', () => {
            expect(arraysEqual([1, 2, 3], [1, 2, 3])).toBe(true);
        });

        it('should return true for identical arrays in different order', () => {
            expect(arraysEqual([3, 1, 2], [1, 2, 3])).toBe(true);
        });

        it('should return true for empty arrays', () => {
            expect(arraysEqual([], [])).toBe(true);
        });

        it('should return true for arrays with single identical element', () => {
            expect(arraysEqual([1], [1])).toBe(true);
        });

        it('should return true for arrays with duplicate elements', () => {
            expect(arraysEqual([1, 2, 2, 3], [2, 1, 3, 2])).toBe(true);
        });

        it('should return true for arrays with string elements', () => {
            expect(arraysEqual(['a', 'b', 'c'], ['c', 'a', 'b'])).toBe(true);
        });

        it('should return true for arrays with mixed types', () => {
            expect(arraysEqual([1, 'a', 2], ['a', 1, 2])).toBe(true);
        });
    });

    describe('unequal arrays', () => {
        it('should return false for arrays with different lengths', () => {
            expect(arraysEqual([1, 2, 3], [1, 2])).toBe(false);
        });

        it('should return false for arrays with different elements', () => {
            expect(arraysEqual([1, 2, 3], [1, 2, 4])).toBe(false);
        });

        it('should return false when one array is empty', () => {
            expect(arraysEqual([], [1])).toBe(false);
            expect(arraysEqual([1], [])).toBe(false);
        });

        it('should return false for arrays with different number of duplicates', () => {
            expect(arraysEqual([1, 1, 2], [1, 2, 2])).toBe(false);
        });

        it('should return false for completely different arrays', () => {
            expect(arraysEqual([1, 2, 3], [4, 5, 6])).toBe(false);
        });
    });

    describe('edge cases', () => {
        it('should handle arrays with null values', () => {
            expect(arraysEqual([null, 1, 2], [1, null, 2])).toBe(true);
            expect(arraysEqual([null], [1])).toBe(false);
        });

        it('should handle arrays with undefined values', () => {
            expect(arraysEqual([undefined, 1], [1, undefined])).toBe(true);
        });

        it('should handle arrays with boolean values', () => {
            expect(arraysEqual([true, false, true], [false, true, true])).toBe(true);
        });

        it('should handle arrays with zero', () => {
            expect(arraysEqual([0, 1, 2], [2, 0, 1])).toBe(true);
        });

        it('should handle negative numbers', () => {
            expect(arraysEqual([-1, -2, 3], [3, -2, -1])).toBe(true);
        });

        it('should handle floating point numbers', () => {
            expect(arraysEqual([1.5, 2.3, 3.1], [3.1, 1.5, 2.3])).toBe(true);
        });

        it('should handle large arrays', () => {
            const arr1 = Array.from({ length: 1000 }, (_, i) => i);
            const arr2 = [...arr1].reverse();
            expect(arraysEqual(arr1, arr2)).toBe(true);
        });
    });

    describe('array mutation', () => {
        it('should not mutate original arrays', () => {
            const arr1 = [3, 1, 2];
            const arr2 = [1, 2, 3];
            const arr1Copy = [...arr1];
            const arr2Copy = [...arr2];
            
            arraysEqual(arr1, arr2);
            
            expect(arr1).toEqual(arr1Copy);
            expect(arr2).toEqual(arr2Copy);
        });
    });
});