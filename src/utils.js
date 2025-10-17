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

export function createElementsForClasses(classesArray) {
    // Create container element
    const container = document.createElement('div');
    container.style.display = 'none';

    // Create elements from the array
    classesArray.forEach(item => {
        // Create element with the tag name
        const element = document.createElement(item.tag);

        // Add classes to the element
        if (item.classes && item.classes.length > 0) {
            element.classList.add(...item.classes);
        }

        // Append element to container
        container.appendChild(element);
    });

    // Add container to body
    document.body.appendChild(container);

    return container;
}

export function getCss() {
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
    return minify(getCss()).css;
}

export function getTimeoutLength(elementsToCreate) {
    let timeout = 10 * parseInt(elementsToCreate.length)
    timeout = timeout < 1000 ? 1000 : timeout
    timeout = timeout > 2000 ? 2000 : timeout
    return timeout
}

export function copyTextToClipboard(text, copyBtn, originalText) {
    navigator.clipboard.writeText(text)
        .then(() => {
            copyBtn.textContent = 'Copied!'
            setTimeout(() => {
                copyBtn.textContent = originalText
            }, 2000)
        })
        .catch(err => {
            console.error("Failed to copy text: ", err);
        });
}


