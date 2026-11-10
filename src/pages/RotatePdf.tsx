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
      <h2>What is Rotate PDF?</h2>
      <p>This tool allows you to rotate the pages of your PDF document by 90, 180, or 270 degrees. It's perfect for fixing documents that were scanned upside down or sideways.</p>
      
      <h3>How to use in 3 steps:</h3>
      <ol>
        <li>Click "Select PDF File" or drag your PDF into the upload area.</li>
        <li>Select the desired rotation angle (90°, 180°, or 270°).</li>
        <li>Click "Rotate PDF" and download the corrected document.</li>
      </ol>

      <h3>Common Questions:</h3>
      <p><strong>Does it rotate all pages?</strong> Yes, the tool applies the selected rotation angle to all pages of the document.</p>
      <p><strong>Is the process permanent?</strong> Yes, it creates a new, rotated version of your file for you to download.</p>
    </div>
  );

  if (resultUrl) {
    return (
      <ToolLayout 
        title="Rotate PDF" 
        description="Rotate your PDFs the way you need them." 
        seoTitle="Rotate PDF Online Free | Quick PDF Tools" 
        seoDescription="Rotate PDF pages online for free. Secure, fast, and easy to use."
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
      seoTitle="Rotate PDF Online Free | Quick PDF Tools" 
      seoDescription="Rotate PDF pages online for free. Secure, fast, and easy to use."
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
