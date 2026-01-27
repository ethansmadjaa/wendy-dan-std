'use client'
import { useState, forwardRef } from 'react';
import { Document, Page as PdfPage, pdfjs } from 'react-pdf';
import HTMLFlipBook from "react-pageflip";
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Utiliser la version legacy du worker pour éviter les erreurs SSR
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;

const PageFlip = forwardRef<HTMLDivElement, { pageNumber: number }>(({ pageNumber }, ref) => {
  return (
    <div ref={ref} className="bg-white shadow-lg">
      <PdfPage pageNumber={pageNumber} height={500} width={300} />
    </div>
  );
});
PageFlip.displayName = 'PageFlip';

export default function PdfViewer() {
  const [numPages, setNumPages] = useState<number>(0);


  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-full">
      <Document file="/std.pdf" onLoadSuccess={onDocumentLoadSuccess}>
        {numPages > 0 && (
          <div className="flex flex-col items-center gap-6 w-full">
            <div className="flex items-center justify-center w-full">
              <HTMLFlipBook
                width={300}
                height={500}
                className="shadow-2xl mx-auto"
                style={{}}
                startPage={0}
                size="fixed"
                minWidth={2480}
                maxWidth={3508}
                minHeight={2480}
                maxHeight={3508}
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
                  <PageFlip key={i} pageNumber={i + 1} />
                ))}
              </HTMLFlipBook>
            </div>
          </div>
        )}
      </Document>
    </div>
  )
};
