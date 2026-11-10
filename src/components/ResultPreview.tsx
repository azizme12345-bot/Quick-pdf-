import React, { useEffect, useState } from 'react';
import { Download, RefreshCw, Loader2 } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

interface ResultPreviewProps {
  title?: string;
  resultUrl: string;
  filename: string;
  onReset: () => void;
  type?: 'pdf' | 'image' | 'text';
  textResult?: string;
}

export default function ResultPreview({ 
  title = "Your PDF is ready", 
  resultUrl, 
  filename, 
  onReset,
  type = 'pdf',
  textResult
}: ResultPreviewProps) {
  const [pdfPreviewDataUrl, setPdfPreviewDataUrl] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState<boolean>(false);
  const [renderError, setRenderError] = useState<string | null>(null);

  useEffect(() => {
    if (type === 'pdf') {
      let isMounted = true;
      setIsRendering(true);
      setRenderError(null);

      const renderPdf = async () => {
        try {
          // Fetch the blob to array buffer
          const response = await fetch(resultUrl);
          const arrayBuffer = await response.arrayBuffer();
          
          // Load PDF
          const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          const page = await pdf.getPage(1);
          
          const viewport = page.getViewport({ scale: 1.5 }); // Good quality preview scale
          
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          
          if (!context) {
            throw new Error('Canvas context not available');
          }
          
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          
          const renderContext = {
            canvasContext: context,
            viewport: viewport,
          } as any;
          
          await page.render(renderContext).promise;
          
          if (isMounted) {
            const dataUrl = canvas.toDataURL('image/png');
            setPdfPreviewDataUrl(dataUrl);
          }
        } catch (err) {
          console.error('Error rendering PDF preview:', err);
          if (isMounted) {
            setRenderError('Could not render PDF preview.');
          }
        } finally {
          if (isMounted) {
            setIsRendering(false);
          }
        }
      };

      renderPdf();

      return () => {
        isMounted = false;
      };
    }
  }, [type, resultUrl]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = resultUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyText = async () => {
    if (textResult) {
      try {
        await navigator.clipboard.writeText(textResult);
        alert('Text copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy text', err);
      }
    }
  };

  return (
    <div className="p-8 flex flex-col items-center w-full">
      <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-6">{title}</h2>

      <div className="w-full max-w-3xl border border-slate-200 rounded-xl overflow-hidden bg-slate-50 mb-8 flex justify-center items-center shadow-inner" style={{ minHeight: '300px' }}>
        {type === 'pdf' && (
          <div className="flex items-center justify-center w-full p-6 overflow-auto">
            {isRendering ? (
               <div className="flex flex-col items-center text-slate-500 py-12">
                 <Loader2 className="h-8 w-8 animate-spin mb-4 text-blue-500" />
                 <p className="font-medium text-sm">Generating preview...</p>
               </div>
            ) : renderError ? (
               <div className="text-red-500 py-12 font-medium text-center bg-red-50 p-4 rounded-lg">
                 {renderError}
               </div>
            ) : pdfPreviewDataUrl ? (
               <img 
                 src={pdfPreviewDataUrl} 
                 alt="PDF Preview" 
                 className="max-w-full h-auto max-h-[600px] object-contain shadow-md border border-slate-300 bg-white" 
               />
            ) : null}
          </div>
        )}
        
        {type === 'image' && (
           <div className="flex items-center justify-center w-full p-6">
             <img src={resultUrl} alt="Result Preview" className="max-w-full h-auto max-h-[600px] object-contain shadow-md border border-slate-300 bg-white" />
           </div>
        )}
        
        {type === 'text' && (
           <textarea 
             readOnly 
             value={textResult} 
             className="w-full h-[400px] p-4 text-sm font-mono text-slate-700 bg-transparent resize-none focus:outline-none"
           />
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-md">
        <button 
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-sm"
        >
          <Download className="h-5 w-5" />
          Download {type === 'text' ? 'TXT' : type === 'image' ? 'Image' : 'PDF'}
        </button>
        {type === 'text' && (
           <button 
             onClick={handleCopyText}
             className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-sm"
           >
             Copy Text
           </button>
        )}
      </div>
      
      <button 
        onClick={onReset}
        className="mt-6 flex items-center justify-center gap-2 text-slate-500 hover:text-slate-700 font-medium py-2 px-4 transition-colors"
      >
        <RefreshCw className="h-4 w-4" />
        Process Another File
      </button>
    </div>
  );
}
