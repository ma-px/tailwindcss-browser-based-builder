import { describe, it, expect, beforeEach } from 'vitest';
import { getTagsWithClasses } from '../src/utils.js';

describe('getTagsWithClasses - only elements with classes', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.body.className = '';
  });

  it('should return empty array when body has no classes', () => {
    const result = getTagsWithClasses();
    
    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });

  it('should return body element when it has classes', () => {
    document.body.className = 'main-content light-theme';
    
    const result = getTagsWithClasses();
    
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      tag: 'body',
      classes: ['main-content', 'light-theme']
    });
  });

  it('should skip elements without classes', () => {
    document.body.innerHTML = `
      <div class="container">
        <span></span>
        <p></p>
      </div>
    `;
    
    const result = getTagsWithClasses();
    
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ tag: 'div', classes: ['container'] });
  });

  it('should return only elements with classes from nested structure', () => {
    document.body.innerHTML = `
      <div class="wrapper">
        <header class="site-header">
          <nav>
            <a class="nav-link"></a>
          </nav>
        </header>
      </div>
    `;
    
    const result = getTagsWithClasses();
    
    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({ tag: 'div', classes: ['wrapper'] });
    expect(result[1]).toEqual({ tag: 'header', classes: ['site-header'] });
    expect(result[2]).toEqual({ tag: 'a', classes: ['nav-link'] });
    expect(result.find(el => el.tag === 'nav')).toBeUndefined();
  });

  it('should handle structure with no classes at all', () => {
    document.body.innerHTML = `
      <div>
        <header>
          <nav>
            <ul>
              <li><a>Link</a></li>
            </ul>
          </nav>
        </header>
      </div>
    `;
    
    const result = getTagsWithClasses();
    
    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });

  it('should handle mixed elements with and without classes', () => {
    document.body.innerHTML = `
      <div class="container">
        <header>
          <nav class="navbar">
            <ul>
              <li class="nav-item"><a>Link 1</a></li>
              <li><a class="nav-link">Link 2</a></li>
            </ul>
          </nav>
        </header>
        <main class="content">
          <section></section>
        </main>
      </div>
    `;
    
    const result = getTagsWithClasses();
    
    expect(result).toHaveLength(5);
    expect(result).toContainEqual({ tag: 'div', classes: ['container'] });
    expect(result).toContainEqual({ tag: 'nav', classes: ['navbar'] });
    expect(result).toContainEqual({ tag: 'li', classes: ['nav-item'] });
    expect(result).toContainEqual({ tag: 'a', classes: ['nav-link'] });
    expect(result).toContainEqual({ tag: 'main', classes: ['content'] });
    expect(result.find(el => el.tag === 'header')).toBeUndefined();
    expect(result.find(el => el.tag === 'ul')).toBeUndefined();
    expect(result.find(el => el.tag === 'section')).toBeUndefined();
  });

  it('should maintain correct traversal order for elements with classes', () => {
    document.body.innerHTML = `
      <div class="parent">
        <div>
          <div class="grandchild1"></div>
        </div>
        <div class="child2"></div>
      </div>
    `;
    
    const result = getTagsWithClasses();
    const classes = result.map(r => r.classes[0]);
    
    expect(classes).toEqual(['parent', 'grandchild1', 'child2']);
    expect(result).toHaveLength(3);
  });

  it('should handle elements with multiple classes', () => {
    document.body.innerHTML = `
      <div class="class1 class2 class3 class4"></div>
    `;
    
    const result = getTagsWithClasses();
    
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      tag: 'div',
      classes: ['class1', 'class2', 'class3', 'class4']
    });
  });

  it('should handle deep nesting with sparse classes', () => {
    document.body.innerHTML = `
      <div>
        <div>
          <div class="deep-nested">
            <span></span>
            <span class="highlighted"></span>
          </div>
        </div>
      </div>
    `;
    
    const result = getTagsWithClasses();
    
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ tag: 'div', classes: ['deep-nested'] });
    expect(result[1]).toEqual({ tag: 'span', classes: ['highlighted'] });
  });

  it('should handle only leaf elements with classes', () => {
    document.body.innerHTML = `
      <div>
        <header>
          <nav>
            <a class="link1"></a>
            <a class="link2"></a>
            <a class="link3"></a>
          </nav>
        </header>
      </div>
    `;
    
    const result = getTagsWithClasses();
    
    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({ tag: 'a', classes: ['link1'] });
    expect(result[1]).toEqual({ tag: 'a', classes: ['link2'] });
    expect(result[2]).toEqual({ tag: 'a', classes: ['link3'] });
  });

  it('should include body when it has classes along with children', () => {
    document.body.className = 'app-container';
    document.body.innerHTML = `
      <div class="wrapper">
        <span class="text"></span>
      </div>
    `;
    
    const result = getTagsWithClasses();
    
    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({ tag: 'body', classes: ['app-container'] });
    expect(result[1]).toEqual({ tag: 'div', classes: ['wrapper'] });
    expect(result[2]).toEqual({ tag: 'span', classes: ['text'] });
  });

  it('should handle single child with class', () => {
    document.body.innerHTML = '<div class="single"></div>';
    
    const result = getTagsWithClasses();
    
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ tag: 'div', classes: ['single'] });
  });

  it('should handle siblings where only some have classes', () => {
    document.body.innerHTML = `
      <div class="first"></div>
      <div></div>
      <div class="third"></div>
      <div></div>
      <div class="fifth"></div>
    `;
    
    const result = getTagsWithClasses();
    
    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({ tag: 'div', classes: ['first'] });
    expect(result[1]).toEqual({ tag: 'div', classes: ['third'] });
    expect(result[2]).toEqual({ tag: 'div', classes: ['fifth'] });
  });

  it('should handle complex UI component structure', () => {
    document.body.innerHTML = `
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Title</h2>
          <button class="btn btn-close"></button>
        </div>
        <div class="card-body">
          <p>Some content</p>
          <span class="badge">New</span>
        </div>
        <div class="card-footer">
          <button class="btn btn-primary">Action</button>
        </div>
      </div>
    `;
    
    const result = getTagsWithClasses();
    
    expect(result).toHaveLength(8);
    expect(result.find(el => el.tag === 'p')).toBeUndefined();
    expect(result.filter(el => el.tag === 'button')).toHaveLength(2);
    expect(result.filter(el => el.tag === 'div')).toHaveLength(4);
  });

  it('should handle empty body with class', () => {
    document.body.className = 'empty-state';
    
    const result = getTagsWithClasses();
    
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ tag: 'body', classes: ['empty-state'] });
  });
});