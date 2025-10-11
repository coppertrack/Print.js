import type { PrintParams } from "../types"
import Browser from './browser'
import { cleanUp } from './functions'

const Print = {
  send: (params: PrintParams, printFrame: HTMLIFrameElement) => {
    // Append iframe element to document body
    document.getElementsByTagName('body')[0].appendChild(printFrame)

    // Get iframe element
    const iframeElement = document.getElementById(params.frameId) as HTMLIFrameElement

    // Wait for iframe to load all content
    iframeElement.onload = () => {
      if (params.type === 'pdf') {
        // Add a delay for Firefox. In my tests, 1000ms was sufficient but 100ms was not
        if (Browser.isFirefox() && Browser.getFirefoxMajorVersion(navigator.userAgent) < 110) {
          setTimeout(() => performPrint(iframeElement, params), 1000)
        } else {
          performPrint(iframeElement, params)
        }
        return
      }

      // Get iframe element document
      let printDocument = ((iframeElement as HTMLIFrameElement).contentWindow || (iframeElement as any).contentDocument)
      if (printDocument.document) printDocument = printDocument.document

      // Append printable element to the iframe body
      printDocument.body.appendChild(params.printableElement)

      // Add custom style
      if (params.style) {
        // Create style element
        const style = document.createElement('style')
        style.innerHTML = params.style

        // Append style element to iframe's head
        printDocument.head.appendChild(style)
      }

      // If printing images, wait for them to load inside the iframe
      const images = printDocument.getElementsByTagName('img')

      if (images.length > 0) {
        loadIframeImages(Array.from(images)).then(() => performPrint(iframeElement, params))
      } else {
        performPrint(iframeElement, params)
      }
    }
  }
}

function performPrint (iframeElement: HTMLIFrameElement, params: PrintParams) {
  try {
    iframeElement.focus()

    // If Edge or IE, try catch with execCommand
    if (Browser.isEdge() || Browser.isIE()) {
      try {
        iframeElement.contentWindow.document.execCommand('print', false, null)
      } catch (e) {
        setTimeout(function () {
          iframeElement.contentWindow.print()
        }, 1000)
      }
    } else {
      // Other browsers
      setTimeout(function () {
        iframeElement.contentWindow.print()
      }, 1000)
    }
  } catch (error) {
    params.onError(error as Error)
  } finally {
    if (Browser.isFirefox() && Browser.getFirefoxMajorVersion(navigator.userAgent) < 110) {
      // Move the iframe element off-screen and make it invisible
      iframeElement.style.visibility = 'hidden'
      iframeElement.style.left = '-1px'
    }

    cleanUp(params)
  }
}

function loadIframeImages (images: HTMLImageElement[]) {
  const promises = images.map(image => {
    if (image.src && image.src !== window.location.href) {
      return loadIframeImage(image)
    }
    return Promise.resolve()
  })

  return Promise.all(promises)
}

function loadIframeImage (image: HTMLImageElement) {
  return new Promise<void>(resolve => {
    const pollImage = () => {
      !image || typeof image.naturalWidth === 'undefined' || image.naturalWidth === 0 || !image.complete
        ? setTimeout(pollImage, 500)
        : resolve()
    }
    pollImage()
  })
}

export default Print
