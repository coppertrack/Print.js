declare const printJS: (args?: string | Partial<PrintParams>, type?: string) => void;
export default printJS;

declare interface PrintParams {
    printable: string | HTMLElement | null;
    fallbackPrintable: string | null;
    type: 'pdf' | 'html' | 'image' | 'json' | 'raw-html';
    header: string | null;
    headerStyle: string;
    footer: string | null;
    footerStyle: string;
    maxWidth: number;
    properties: string[] | null;
    gridHeaderStyle: string;
    gridStyle: string;
    repeatTableHeader: boolean;
    css: string[] | string | null;
    style: string | null;
    scanStyles: boolean;
    targetStyle: string[];
    targetStyles: string[];
    ignoreElements: string[];
    font: string;
    font_size: string;
    honorMarginPadding: boolean;
    honorColor: boolean;
    imageStyle: string;
    documentTitle: string;
    base64: boolean;
    showModal: boolean;
    modalMessage: string;
    onError: (error: Error) => void;
    onLoadingStart: (() => void) | null;
    onLoadingEnd: (() => void) | null;
    onPrintDialogClose: () => void;
    onPdfOpen: (() => void) | null;
    onIncompatibleBrowser?: (() => void) | null;
    frameId: string;
    printableElement?: HTMLElement;
    frameRemoveDelay?: number;
}

export { }
