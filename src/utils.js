import { minify } from 'csso'

export function getTagsWithClasses() {
  const result = [];
  
  function traverse(element) {
    // Get the tag name in lowercase
    const tagName = element.tagName.toLowerCase();
    
    // Only process if element has classes
    if (element.classList.length > 0) {
      const classes = Array.from(element.classList);
      
      // Store as object with tag name and classes
      result.push({
        tag: tagName,
        classes: classes
      });
    }
    
    // Recursively traverse all children
    for (let child of element.children) {
      traverse(child);
    }
  }
  
  // Start traversal from body element
  traverse(document.body);
  
  return result;
}

export function mergeTagsWithClasses(firstArray, secondArray) {
  const result = [...firstArray]; // Start with a copy of the first array
  
  for (let secondItem of secondArray) {
    // Check if this tag-classes combination exists in the first array
    const exists = firstArray.some(firstItem => 
      firstItem.tag === secondItem.tag &&
      arraysEqual(firstItem.classes, secondItem.classes)
    );
    
    // If it doesn't exist, add it to the result
    if (!exists) {
      result.push(secondItem);
    }
  }
  
  return result;
}

// Helper function to compare two arrays
function arraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;
  
  // Sort both arrays to compare regardless of order
  const sorted1 = [...arr1].sort();
  const sorted2 = [...arr2].sort();
  
  return sorted1.every((value, index) => value === sorted2[index]);
}

export function getCss()  {
  const styleElements = Array.from(document.head.querySelectorAll('style'));
  
  // First priority: Check for tailwindcss.com in comments
  let tailwindStyle = styleElements.find(style => 
    /\/\*.*tailwindcss\.com.*\*\//s.test(style.textContent)
  );
  
  // Second priority: Check for 'tailwindcss' in comments
  if (!tailwindStyle) {
    tailwindStyle = styleElements.find(style => 
      /\/\*.*tailwindcss.*\*\//s.test(style.textContent)
    );
  }
  
  return tailwindStyle ? tailwindStyle.textContent : ''
}

export function getMinifiedCss() {
    return minify(getCss());
}