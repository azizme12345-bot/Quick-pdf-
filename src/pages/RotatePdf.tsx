import React, { useState } from 'react';
import ToolLayout from '../components/ToolLayout';
import FileUpload from '../components/FileUpload';
import ResultPreview from '../components/ResultPreview';
import { PDFDocument, degrees } from 'pdf-lib';
import { Loader2, RotateCw } from 'lucide-react';

export default function RotatePdf() {
  const [file, setFile] = useState<File | null>(null);
  const [rotation, setRotation] = useState<number>(90);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = (files: File[]) => {
    setError(null);
    setFile(files[0]);
  };

  const handleRotate = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const pages = pdf.getPages();
      
      pages.forEach(page => {
        const currentRotation = page.getRotation().angle;
        page.setRotation(degrees(currentRotation + rotation));
      });
      
      const pdfBytes = await pdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
    } catch (err) {
      console.error(err);
      setError("An error occurred while rotating the PDF. Ensure the file is a valid PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setFile(null);
    setResultUrl(null);
    setError(null);
  };

  const infoContent = (
    <div>
      <h2>How to use Rotate PDF</h2>
      <p>
        If a scanned document or report opens sideways or upside down, you can fix its orientation in seconds. Follow these three simple steps:
      </p>
      <ol>
        <li>Click the upload area or drag and drop the PDF file you want to fix.</li>
        <li>Choose the rotation angle you need: 90 degrees, 180 degrees, or 270 degrees clockwise.</li>
        <li>Click the "Rotate PDF" button to apply the change and download your properly oriented document.</li>
      </ol>

      <h3>Frequently Asked Questions</h3>
      <p>
        <strong>Does this rotate every page in the PDF?</strong><br />
        Yes. The selected rotation angle is applied to all pages in your document at once, saving you time on multi-page scans.
      </p>
      <p>
        <strong>Is the rotation saved permanently?</strong><br />
        Yes. The downloaded PDF file has the new page orientation saved permanently, so it will open upright in any PDF viewer.
      </p>
      <p>
        <strong>Are my files kept private?</strong><br />
        Yes. Rotating happens directly in your browser without uploading your PDF to any external server.
      </p>
    </div>
  );

  if (resultUrl) {
    return (
      <ToolLayout 
        title="Rotate PDF" 
        description="Rotate your PDFs the way you need them." 
        seoTitle="Rotate PDF | Quick PDF Tools" 
        seoDescription="Rotate PDF pages 90, 180, or 270 degrees online for free. Fix sideways or upside-down PDFs securely in your browser."
        infoContent={infoContent}
      >
        <ResultPreview 
          resultUrl={resultUrl} 
          filename="quick-pdf-rotated.pdf" 
          onReset={handleReset} 
        />
      </ToolLayout>
    );
  }

  return (
    <ToolLayout 
      title="Rotate PDF" 
      description="Rotate your PDFs the way you need them." 
      seoTitle="Rotate PDF | Quick PDF Tools" 
      seoDescription="Rotate PDF pages 90, 180, or 270 degrees online for free. Fix sideways or upside-down PDFs securely in your browser."
      infoContent={infoContent}
    >
      <div className="p-8">
        {!file ? (
          <FileUpload onFilesSelected={handleFilesSelected} accept={{'application/pdf': ['.pdf']}} />
        ) : (
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4">
              <RotateCw className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-medium text-slate-800 mb-2">{file.name}</h3>
            
            <div className="my-8 flex gap-4 bg-slate-50 p-2 rounded-lg border border-slate-200">
              {[90, 180, 270].map((deg) => (
                <button
                  key={deg}
                  onClick={() => setRotation(deg)}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    rotation === deg 
                      ? 'bg-white shadow-sm border border-slate-300 text-indigo-600' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Right {deg}&deg;
                </button>
              ))}
            </div>
            
            <div className="w-full max-w-md flex flex-col gap-4">
              <button 
                onClick={handleRotate}
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-sm"
              >
                {isProcessing ? (
                  <><Loader2 className="h-5 w-5 animate-spin" /> Processing...</>
                ) : (
                  `Rotate PDF ${rotation}°`
                )}
              </button>
              <button 
                onClick={() => setFile(null)}
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Choose a different file
              </button>
            </div>
            {error && <p className="text-red-500 mt-4">{error}</p>}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
