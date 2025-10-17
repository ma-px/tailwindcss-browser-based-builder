import * as localForage from "localforage";
import { getTagsWithClasses, mergeTagsWithClasses } from "./utils.js";

export function watchDOMChanges(callback, options = {}) {
    const {
        debounceDelay = 300,  // Wait time after last change before calling callback
        target = document.body, // Element to observe
        includeAttributes = true, // Watch for class changes
        includeChildList = true,  // Watch for added/removed elements
    } = options;

    let debounceTimeout;
    let changeDetails = {
        hasChanges: false,
        addedNodes: [],
        removedNodes: [],
        classChanges: []
    };

    // Debounced callback execution
    function executeCallback() {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            if (changeDetails.hasChanges) {
                callback(changeDetails);
                // Reset change details
                changeDetails = {
                    hasChanges: false,
                    addedNodes: [],
                    removedNodes: [],
                    classChanges: []
                };
            }
        }, debounceDelay);
    }

    // Create MutationObserver
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {

            // Track added/removed nodes
            if (mutation.type === 'childList' && includeChildList) {
                if (mutation.addedNodes.length > 0) {
                    changeDetails.hasChanges = true;
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            changeDetails.addedNodes.push({
                                element: node,
                                tag: node.tagName.toLowerCase(),
                                classes: Array.from(node.classList || [])
                            });
                        }
                    });
                }

                if (mutation.removedNodes.length > 0) {
                    changeDetails.hasChanges = true;
                    mutation.removedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            changeDetails.removedNodes.push({
                                element: node,
                                tag: node.tagName.toLowerCase(),
                                classes: Array.from(node.classList || [])
                            });
                        }
                    });
                }
            }

            // Track class attribute changes
            if (mutation.type === 'attributes' &&
                mutation.attributeName === 'class' &&
                includeAttributes) {
                changeDetails.hasChanges = true;

                const oldClasses = mutation.oldValue ? mutation.oldValue.split(' ').filter(Boolean) : [];
                const newClasses = Array.from(mutation.target.classList);

                changeDetails.classChanges.push({
                    element: mutation.target,
                    tag: mutation.target.tagName.toLowerCase(),
                    oldClasses,
                    newClasses,
                    addedClasses: newClasses.filter(c => !oldClasses.includes(c)),
                    removedClasses: oldClasses.filter(c => !newClasses.includes(c))
                });
            }
        }

        // Execute callback after debounce
        if (changeDetails.hasChanges) {
            executeCallback();
        }
    });

    // Configuration for the observer
    const config = {
        childList: includeChildList,
        attributes: includeAttributes,
        attributeFilter: includeAttributes ? ['class'] : [],
        attributeOldValue: includeAttributes,
        subtree: true // Watch all descendants
    };

    // Start observing
    observer.observe(target, config);

    // Return object with disconnect method
    return {
        disconnect: () => {
            localForage.setItem('capture', false)
            clearTimeout(debounceTimeout);
            observer.disconnect();
        },
        // Force immediate check (bypasses debounce)
        forceCheck: () => {
            clearTimeout(debounceTimeout);
            if (changeDetails.hasChanges) {
                callback(changeDetails);
                changeDetails = {
                    hasChanges: false,
                    addedNodes: [],
                    removedNodes: [],
                    classChanges: []
                };
            }
        }
    };
}

export function capture() {
    // Use the current page URL as the storage key
    const storeKey = window.location.href

    // Retrieve previously stored classes for this URL
    localForage.getItem(storeKey).then((tagsToClasses) => {
        if(tagsToClasses == null) {
            tagsToClasses = []
        }

        // Get all tags and their classes from the current page
        const currentTagsWidthClasses = getTagsWithClasses()

        // Merge current classes with previously stored ones
        const mergedTagsWidthClasses = mergeTagsWithClasses(currentTagsWidthClasses, tagsToClasses)

        // Save the merged result back to storage
        localForage.setItem(storeKey, mergedTagsWidthClasses)
    })
}

export function startCapturing() {
    localForage.setItem('capture', true)
    const watcher = watchDOMChanges((changes) => {
        capture()
    });

    capture()

    return watcher
}

export function getCapturedClasses() {
    return localForage.keys().then(function (keys) {
        // Create an array of promises for all getItem calls
        const promises = keys.filter(function(key) {
            return key.startsWith('http')
        }).map(function (urlKey) {
            return localForage.getItem(urlKey);
        });

        // Wait for all promises to resolve
        return Promise.all(promises).then(function (allClassesArrays) {
            // Flatten the array of arrays into a single array
            const allClasses = allClassesArrays.flat();
            return allClasses;
        });
    });
}