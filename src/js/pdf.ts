import type { PrintParams } from "../types"
import Print from './print'
import { cleanUp } from './functions'
import { isValidUrl } from './security'

export default {
  print: (params: PrintParams, printFrame: HTMLIFrameElement) => {
    // Check if we have base64 data
    if (params.base64) {
      const printableStr = params.printable as string
      if (printableStr.indexOf(',') !== -1) {
        // If pdf base64 start with `data:application/pdf;base64,`,Excute the atob function will throw an error.So we get the content after `,`
        params.printable = printableStr.split(',')[1]
      }
      const bytesArray = Uint8Array.from(atob(params.printable as string), c => c.charCodeAt(0))
      createBlobAndPrint(params, printFrame, bytesArray)
      return
    }

    // Format pdf url
    const printableStr = params.printable as string

    // Validate URL before using it
    if (!isValidUrl(printableStr)) {
      cleanUp(params)
      params.onError(new Error('Invalid or unsafe URL provided for printable PDF'))
      return
    }

    params.printable = /^(blob:|https?:)/i.test(printableStr)
      ? printableStr
      : window.location.origin + (printableStr.charAt(0) !== '/' ? '/' + printableStr : printableStr)

    // Get the file through a http request (Preload)
    const req = new window.XMLHttpRequest()
    req.responseType = 'arraybuffer'

    req.addEventListener('error', () => {
      cleanUp(params)
      params.onError(new Error(req.statusText))

      // Since we don't have a pdf document available, we will stop the print job
    })

    req.addEventListener('load', () => {
      // Check for errors
      if ([200, 201].indexOf(req.status) === -1) {
        cleanUp(params)
        params.onError(new Error(req.statusText))

        // Since we don't have a pdf document available, we will stop the print job
        return
      }

      // Print requested document
      createBlobAndPrint(params, printFrame, req.response)
    })

    req.open('GET', params.printable as string, true)
    req.send()
  }
}

function createBlobAndPrint (params: PrintParams, printFrame: HTMLIFrameElement, data: ArrayBuffer | Uint8Array) {
  // Pass response or base64 data to a blob and create a local object url
  const pdfBlob = new window.Blob([data as BlobPart], { type: 'application/pdf' })
  const localPdfUrl = window.URL.createObjectURL(pdfBlob)

  // Set iframe src with pdf document url
  printFrame.setAttribute('src', localPdfUrl)

  Print.send(params, printFrame)
}
