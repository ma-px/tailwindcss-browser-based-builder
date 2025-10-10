import { describe, it, expect, beforeEach } from 'vitest';

// The function to test
function getTagsWithClasses() {
  const result = [];
  
  function traverse(element) {
    const tagName = element.tagName.toLowerCase();
    const classes = element.classList.length > 0 
      ? Array.from(element.classList) 
      : [];
    
    result.push({
      tag: tagName,
      classes: classes
    });
    
    for (let child of element.children) {
      traverse(child);
    }
  }
  
  traverse(document.body);
  return result;
}

describe('getTagsWithClasses', () => {
  beforeEach(() => {
    // Clear the body content AND classes before each test
    document.body.innerHTML = '';
    document.body.className = ''; // Add this line to clear body classes
  });

  it('should return body element with no classes', () => {
    const result = getTagsWithClasses();
    
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      tag: 'body',
      classes: []
    });
  });

  it('should return body with classes', () => {
    document.body.className = 'main-content light-theme';
    
    const result = getTagsWithClasses();
    
    expect(result[0]).toEqual({
      tag: 'body',
      classes: ['main-content', 'light-theme']
    });
  });

  it('should traverse single child element', () => {
    document.body.innerHTML = '<div class="container"></div>';
    
    const result = getTagsWithClasses();
    
    expect(result).toHaveLength(2);
    expect(result[0].tag).toBe('body');
    expect(result[1]).toEqual({
      tag: 'div',
      classes: ['container']
    });
  });

  it('should traverse nested elements', () => {
    document.body.innerHTML = `
      <div class="wrapper">
        <header class="site-header fixed">
          <nav>
            <a class="nav-link"></a>
          </nav>
        </header>
      </div>
    `;
    
    const result = getTagsWithClasses();
    
    expect(result).toHaveLength(5); // body, div, header, nav, a
    expect(result[1]).toEqual({ tag: 'div', classes: ['wrapper'] });
    expect(result[2]).toEqual({ tag: 'header', classes: ['site-header', 'fixed'] });
    expect(result[3]).toEqual({ tag: 'nav', classes: [] });
    expect(result[4]).toEqual({ tag: 'a', classes: ['nav-link'] });
  });

  it('should handle elements with no classes', () => {
    document.body.innerHTML = `
      <div></div>
      <span></span>
      <p></p>
    `;
    
    const result = getTagsWithClasses();
    
    expect(result).toHaveLength(4);
    result.slice(1).forEach(item => {
      expect(item.classes).toEqual([]);
    });
  });

  it('should handle complex nested structure', () => {
    document.body.innerHTML = `
      <div class="container">
        <header class="header">
          <nav class="navbar">
            <ul class="nav-list">
              <li class="nav-item"><a class="nav-link active">Link 1</a></li>
              <li class="nav-item"><a class="nav-link">Link 2</a></li>
            </ul>
          </nav>
        </header>
        <main class="content">
          <section class="hero"></section>
        </main>
      </div>
    `;
    
    const result = getTagsWithClasses();
    
    expect(result).toHaveLength(11); // body + 10 elements
    expect(result.find(el => el.tag === 'a' && el.classes.includes('active'))).toBeDefined();
    expect(result.filter(el => el.tag === 'li')).toHaveLength(2);
  });

  it('should maintain correct traversal order (depth-first)', () => {
    document.body.innerHTML = `
      <div class="parent">
        <div class="child1">
          <div class="grandchild1"></div>
        </div>
        <div class="child2"></div>
      </div>
    `;
    
    const result = getTagsWithClasses();
    const tags = result.map(r => r.classes[0] || r.tag);
    
    expect(tags).toEqual(['body', 'parent', 'child1', 'grandchild1', 'child2']);
  });

  it('should handle elements with multiple classes', () => {
    document.body.innerHTML = '<div class="class1 class2 class3 class4"></div>';
    
    const result = getTagsWithClasses();
    
    expect(result[1].classes).toEqual(['class1', 'class2', 'class3', 'class4']);
  });
});