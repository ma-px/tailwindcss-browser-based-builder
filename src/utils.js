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