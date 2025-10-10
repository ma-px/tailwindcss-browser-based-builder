function getTagsWithClasses() {
  const result = [];
  
  function traverse(element) {
    // Get the tag name in lowercase
    const tagName = element.tagName.toLowerCase();
    
    // Get classes as an array (or empty array if no classes)
    const classes = element.classList.length > 0 
      ? Array.from(element.classList) 
      : [];
    
    // Store as object with tag name and classes
    result.push({
      tag: tagName,
      classes: classes
    });
    
    // Recursively traverse all children
    for (let child of element.children) {
      traverse(child);
    }
  }
  
  // Start traversal from body element
  traverse(document.body);
  
  return result;
}