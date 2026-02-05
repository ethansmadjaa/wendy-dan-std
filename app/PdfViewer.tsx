'use client'
import { useState, forwardRef, useCallback } from 'react';
import { Document, Page as PdfPage, pdfjs } from 'react-pdf';
import HTMLFlipBook from "react-pageflip";
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Utiliser la version legacy du worker pour éviter les erreurs SSR
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;

// Largeur fixe, la hauteur sera calculée selon le ratio du PDF
const PAGE_WIDTH = 350;

const PageFlip = forwardRef<HTMLDivElement, { pageNumber: number; height: number }>(({ pageNumber, height }, ref) => {
  return (
    <div ref={ref} className="bg-white shadow-lg">
      <PdfPage pageNumber={pageNumber} width={PAGE_WIDTH} height={height} />
    </div>
  );
});
PageFlip.displayName = 'PageFlip';

export default function PdfViewer() {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageHeight, setPageHeight] = useState<number>(0);

  const onDocumentLoadSuccess = useCallback(async ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  }, []);

  const onPageLoadSuccess = useCallback((page: { originalWidth: number; originalHeight: number }) => {
    // Calculer la hauteur proportionnelle basée sur la largeur fixe
    const ratio = page.originalHeight / page.originalWidth;
    setPageHeight(Math.round(PAGE_WIDTH * ratio));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-full">
      <Document file="/std.pdf" onLoadSuccess={onDocumentLoadSuccess}>
        {/* Page cachée pour obtenir les dimensions réelles */}
        {numPages > 0 && pageHeight === 0 && (
          <div className="absolute opacity-0 pointer-events-none">
            <PdfPage pageNumber={1} width={PAGE_WIDTH} onLoadSuccess={onPageLoadSuccess} />
          </div>
        )}
        {numPages > 0 && pageHeight > 0 && (
          <div className="flex flex-col items-center gap-6 w-full">
            <div className="flex items-center justify-center w-full">
              <HTMLFlipBook
                width={PAGE_WIDTH}
                height={pageHeight}
                className="shadow-2xl mx-auto"
                style={{}}
                startPage={0}
                size="fixed"
                minWidth={PAGE_WIDTH}
                maxWidth={PAGE_WIDTH}
                minHeight={pageHeight}
                maxHeight={pageHeight}
                drawShadow={true}
                flippingTime={1000}
                usePortrait={true}
                startZIndex={0}
                autoSize={false}
                maxShadowOpacity={0.5}
                showCover={true}
                mobileScrollSupport={true}
                swipeDistance={50}
                clickEventForward={true}
                useMouseEvents={true}
                renderOnlyPageLengthChange={false}
                showPageCorners={true}
                disableFlipByClick={false}
              >
                {Array.from({ length: numPages }, (_, i) => (
                  <PageFlip key={i} pageNumber={i + 1} height={pageHeight} />
                ))}
              </HTMLFlipBook>
            </div>
          </div>
        )}
      </Document>
    </div>
  )
};
