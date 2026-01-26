'use client'
import { useState, forwardRef, useCallback } from 'react';
import { Document, Page as PdfPage, pdfjs } from 'react-pdf';
import HTMLFlipBook from "react-pageflip";
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Utiliser la version legacy du worker pour éviter les erreurs SSR
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;

const PageFlip = forwardRef<HTMLDivElement, { pageNumber: number }>(({ pageNumber }, ref) => {
  return (
    <div ref={ref} className="bg-white shadow-lg">
      <PdfPage pageNumber={pageNumber} width={400} />
    </div>
  );
});
PageFlip.displayName = 'PageFlip';

export default function PdfViewer() {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  const onFlip = useCallback((e: { data: number }) => {
    setCurrentPage(e.data);
  }, []);

  return (
    <>
      <Document file="/std.pdf" onLoadSuccess={onDocumentLoadSuccess}>
        {numPages > 0 && (
          <HTMLFlipBook
            width={400}
            height={550}
            size="fixed"
            minWidth={300}
            maxWidth={600}
            minHeight={400}
            maxHeight={800}
            drawShadow={true}
            flippingTime={1000}
            usePortrait={false}
            startZIndex={0}
            autoSize={true}
            maxShadowOpacity={1}
            showCover={true}
            mobileScrollSupport={true}
            swipeDistance={30}
            clickEventForward={true}
            useMouseEvents={true}
            renderOnlyPageLengthChange={false}
            showPageCorners={true}
            disableFlipByClick={false}
            onFlip={onFlip}
            className="shadow-2xl"
            style={{}}
            startPage={0}
          >
            {Array.from({ length: numPages }, (_, i) => (
              <PageFlip key={i} pageNumber={i + 1} />
            ))}
          </HTMLFlipBook>
        )}
      </Document>
      <p className="fixed bottom-8 text-white">
        Page {currentPage + 1} of {numPages}
      </p>
    </>
  );
}
