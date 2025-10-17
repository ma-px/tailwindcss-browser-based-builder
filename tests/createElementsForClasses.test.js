import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createElementsForClasses } from '../src/utils.js';

describe('createElementsForClasses', () => {
    let container;

    afterEach(() => {
        // Clean up DOM after each test
        if (container && container.parentNode) {
            container.parentNode.removeChild(container);
        }
        container = null;
    });

    describe('container creation', () => {
        it('should create a container div', () => {
            container = createElementsForClasses([]);
            
            expect(container).toBeInstanceOf(HTMLDivElement);
            expect(container.tagName).toBe('DIV');
        });

        it('should set container display to none', () => {
            container = createElementsForClasses([]);
            
            expect(container.style.display).toBe('none');
        });

        it('should append container to document body', () => {
            container = createElementsForClasses([]);
            
            expect(document.body.contains(container)).toBe(true);
        });

        it('should return the created container', () => {
            container = createElementsForClasses([]);
            
            expect(container).toBeDefined();
            expect(container.parentNode).toBe(document.body);
        });
    });

    describe('element creation', () => {
        it('should create elements with specified tag names', () => {
            const classesArray = [
                { tag: 'div', classes: [] },
                { tag: 'span', classes: [] },
                { tag: 'p', classes: [] }
            ];
            
            container = createElementsForClasses(classesArray);
            
            expect(container.children.length).toBe(3);
            expect(container.children[0].tagName).toBe('DIV');
            expect(container.children[1].tagName).toBe('SPAN');
            expect(container.children[2].tagName).toBe('P');
        });

        it('should add single class to element', () => {
            const classesArray = [
                { tag: 'div', classes: ['test-class'] }
            ];
            
            container = createElementsForClasses(classesArray);
            const element = container.children[0];
            
            expect(element.classList.contains('test-class')).toBe(true);
            expect(element.classList.length).toBe(1);
        });

        it('should add multiple classes to element', () => {
            const classesArray = [
                { tag: 'div', classes: ['class-1', 'class-2', 'class-3'] }
            ];
            
            container = createElementsForClasses(classesArray);
            const element = container.children[0];
            
            expect(element.classList.contains('class-1')).toBe(true);
            expect(element.classList.contains('class-2')).toBe(true);
            expect(element.classList.contains('class-3')).toBe(true);
            expect(element.classList.length).toBe(3);
        });

        it('should handle elements with no classes', () => {
            const classesArray = [
                { tag: 'div', classes: [] }
            ];
            
            container = createElementsForClasses(classesArray);
            const element = container.children[0];
            
            expect(element.classList.length).toBe(0);
        });

        it('should handle elements without classes property', () => {
            const classesArray = [
                { tag: 'div' }
            ];
            
            container = createElementsForClasses(classesArray);
            const element = container.children[0];
            
            expect(element.classList.length).toBe(0);
        });

        it('should create multiple elements with different configurations', () => {
            const classesArray = [
                { tag: 'div', classes: ['div-class-1', 'div-class-2'] },
                { tag: 'span', classes: ['span-class'] },
                { tag: 'p', classes: [] },
                { tag: 'section' }
            ];
            
            container = createElementsForClasses(classesArray);
            
            expect(container.children.length).toBe(4);
            
            const div = container.children[0];
            expect(div.tagName).toBe('DIV');
            expect(div.classList.contains('div-class-1')).toBe(true);
            expect(div.classList.contains('div-class-2')).toBe(true);
            
            const span = container.children[1];
            expect(span.tagName).toBe('SPAN');
            expect(span.classList.contains('span-class')).toBe(true);
            
            const p = container.children[2];
            expect(p.tagName).toBe('P');
            expect(p.classList.length).toBe(0);
            
            const section = container.children[3];
            expect(section.tagName).toBe('SECTION');
            expect(section.classList.length).toBe(0);
        });
    });

    describe('edge cases', () => {
        it('should handle empty array', () => {
            container = createElementsForClasses([]);
            
            expect(container.children.length).toBe(0);
        });

        it('should handle classes with special characters', () => {
            const classesArray = [
                { tag: 'div', classes: ['test-class', 'test_class', 'test:class'] }
            ];
            
            container = createElementsForClasses(classesArray);
            const element = container.children[0];
            
            expect(element.classList.contains('test-class')).toBe(true);
            expect(element.classList.contains('test_class')).toBe(true);
            expect(element.classList.contains('test:class')).toBe(true);
        });

        it('should handle Tailwind-style classes', () => {
            const classesArray = [
                { tag: 'div', classes: ['bg-blue-500', 'hover:bg-blue-700', 'text-white', 'font-bold'] }
            ];
            
            container = createElementsForClasses(classesArray);
            const element = container.children[0];
            
            expect(element.classList.contains('bg-blue-500')).toBe(true);
            expect(element.classList.contains('hover:bg-blue-700')).toBe(true);
            expect(element.classList.contains('text-white')).toBe(true);
            expect(element.classList.contains('font-bold')).toBe(true);
        });

        it('should handle various HTML5 tags', () => {
            const classesArray = [
                { tag: 'article', classes: ['article-class'] },
                { tag: 'section', classes: ['section-class'] },
                { tag: 'header', classes: ['header-class'] },
                { tag: 'footer', classes: ['footer-class'] },
                { tag: 'nav', classes: ['nav-class'] }
            ];
            
            container = createElementsForClasses(classesArray);
            
            expect(container.children.length).toBe(5);
            expect(container.children[0].tagName).toBe('ARTICLE');
            expect(container.children[1].tagName).toBe('SECTION');
            expect(container.children[2].tagName).toBe('HEADER');
            expect(container.children[3].tagName).toBe('FOOTER');
            expect(container.children[4].tagName).toBe('NAV');
        });

        it('should handle large number of elements', () => {
            const classesArray = Array.from({ length: 100 }, (_, i) => ({
                tag: 'div',
                classes: [`class-${i}`]
            }));
            
            container = createElementsForClasses(classesArray);
            
            expect(container.children.length).toBe(100);
            expect(container.children[0].classList.contains('class-0')).toBe(true);
            expect(container.children[99].classList.contains('class-99')).toBe(true);
        });

        it('should handle classes with null in array', () => {
            const classesArray = [
                { tag: 'div', classes: null }
            ];
            
            container = createElementsForClasses(classesArray);
            const element = container.children[0];
            
            expect(element.classList.length).toBe(0);
        });

        it('should handle duplicate classes in same element', () => {
            const classesArray = [
                { tag: 'div', classes: ['duplicate', 'duplicate', 'unique'] }
            ];
            
            container = createElementsForClasses(classesArray);
            const element = container.children[0];
            
            // classList automatically deduplicates
            expect(element.classList.contains('duplicate')).toBe(true);
            expect(element.classList.contains('unique')).toBe(true);
        });
    });

    describe('DOM structure', () => {
        it('should maintain order of elements', () => {
            const classesArray = [
                { tag: 'div', classes: ['first'] },
                { tag: 'span', classes: ['second'] },
                { tag: 'p', classes: ['third'] }
            ];
            
            container = createElementsForClasses(classesArray);
            
            expect(container.children[0].classList.contains('first')).toBe(true);
            expect(container.children[1].classList.contains('second')).toBe(true);
            expect(container.children[2].classList.contains('third')).toBe(true);
        });

        it('should create flat structure (no nested elements)', () => {
            const classesArray = [
                { tag: 'div', classes: ['parent'] },
                { tag: 'div', classes: ['sibling'] }
            ];
            
            container = createElementsForClasses(classesArray);
            
            expect(container.children.length).toBe(2);
            expect(container.children[0].children.length).toBe(0);
            expect(container.children[1].children.length).toBe(0);
        });
    });
});