'use client';

import dynamic from 'next/dynamic';

const PdfViewer = dynamic(() => import('./PdfViewer'), { 
  ssr: false,
  loading: () => <div className="text-white">Chargement du PDF...</div>
});
  
export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-900">
      <PdfViewer />
    </div>
  );
}
