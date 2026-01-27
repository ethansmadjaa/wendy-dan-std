'use client';

import dynamic from 'next/dynamic';

const PdfViewer = dynamic(() => import('./PdfViewer'), { 
  ssr: false,
  loading: () => <div className="text-white">Chargement du save the date...</div>
});
  
export default function Home() {
  return (
    <div className="flex min-h-screen w-full h-full items-center justify-center bg-zinc-900 p-4 md:p-8 overflow-x-hidden">
      <PdfViewer />
    </div>
  );
}
