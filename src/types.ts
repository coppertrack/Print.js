export interface PrintParams {
  printable: string | HTMLElement | null
  fallbackPrintable: string | null
  type: 'pdf' | 'html' | 'image' | 'json' | 'raw-html'
  header: string | null
  headerStyle: string
  footer: string | null
  footerStyle: string
  maxWidth: number
  properties: string[] | null
  gridHeaderStyle: string
  gridStyle: string
  repeatTableHeader: boolean
  css: string[] | string | null
  style: string | null
  scanStyles: boolean
  targetStyle: string[]
  targetStyles: string[]
  ignoreElements: string[]
  font: string
  font_size: string
  honorMarginPadding: boolean
  honorColor: boolean
  imageStyle: string
  documentTitle: string
  base64: boolean
  showModal: boolean
  modalMessage: string
  onError: (error: Error) => void
  onLoadingStart: (() => void) | null
  onLoadingEnd: (() => void) | null
  onPrintDialogClose: () => void
  onPdfOpen: (() => void) | null
  onIncompatibleBrowser?: (() => void) | null
  frameId: string
  printableElement?: HTMLElement
  frameRemoveDelay?: number
}

export interface WindowWithPrint extends Window {
  printJS?: (options: Partial<PrintParams>) => void
}

declare global {
  interface Window {
    printJS?: (options: Partial<PrintParams>) => void
    chrome?: unknown
    StyleMedia?: unknown
  }

  interface Document {
    documentMode?: number
  }

  const InstallTrigger: unknown
}

export {}
