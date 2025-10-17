import * as localForage from "localforage"
import { copyTextToClipboard, createElementsForClasses, getCss, getMinifiedCss, getTimeoutLength, injectBuilderUI } from './utils.js'
import { getCapturedClasses, startCapturing } from "./capture.js"


window.addEventListener('DOMContentLoaded', function () {

  injectBuilderUI()

  const captureBtn = this.document.querySelector('#--capture')
  const stopCaptureBtn = this.document.querySelector('#--stop-capture')
  const copyCssBtn = this.document.querySelector('#--copy-css')
  const copyMinifiedCssBtn = this.document.querySelector('#--copy-minified-css')

  let isCapturing = false
  let watcher = null

  localForage.getItem('capture').then((isCapturingState) => {
    isCapturing = isCapturingState
    if (isCapturing) {
      watcher = startCapturing()
      captureBtn.textContent = 'Capturing...'
    }
  })

  captureBtn.addEventListener('click', function () {
    if (!isCapturing) {
      watcher = startCapturing()
      captureBtn.textContent = 'Capturing...'
    }
  })

  stopCaptureBtn.addEventListener('click', function () {
    if (watcher) {
      watcher.disconnect()
      captureBtn.textContent = 'Start Capturing'
    }
  })

  copyCssBtn.addEventListener('click', function () {
    getCapturedClasses().then((allClassesElements) => {
      const timeout = getTimeoutLength(allClassesElements)

      const container = createElementsForClasses(allClassesElements)
      setTimeout(() => {
        const cssText = getCss()
        copyTextToClipboard(cssText, copyCssBtn, 'Copy CSS')
      }, timeout)
      setTimeout(() => {
        container.remove()
      }, timeout + 500)
    })

  })

  copyMinifiedCssBtn.addEventListener('click', () => {
    getCapturedClasses().then((allClassesElements) => {
      const timeout = getTimeoutLength(allClassesElements)
      const container = createElementsForClasses(allClassesElements)

      setTimeout(() => {
        const minifiedCssText = getMinifiedCss()
        copyTextToClipboard(minifiedCssText, copyMinifiedCssBtn, 'Copy Minified CSS')
      }, timeout)
      setTimeout(() => {
        container.remove()
      }, timeout + 500)
    })
  })

  // dargging functionality
  const cssBuilderContainer = document.querySelector("#-css-builder");

  let offsetX, offsetY, isDragging = false;

  cssBuilderContainer.addEventListener("mousedown", (e) => {
    isDragging = true;
    cssBuilderContainer.style.cursor = "grabbing";

    offsetX = e.clientX - cssBuilderContainer.offsetLeft;
    offsetY = e.clientY - cssBuilderContainer.offsetTop;

    e.preventDefault();
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    cssBuilderContainer.style.left = (e.clientX - offsetX) + "px";
    cssBuilderContainer.style.top = (e.clientY - offsetY) + "px";
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    cssBuilderContainer.style.cursor = "grab";
  });

})
