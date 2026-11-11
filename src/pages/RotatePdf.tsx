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
        The Rotate PDF tool lets you fix the orientation of PDF pages that were scanned sideways or upside down. Instead of tilting your head or screen every time you open a document, you can permanently rotate the pages and save a clean copy in seconds.
      </p>

      <h3>Step-by-step guide</h3>
      <ol>
        <li>Click the upload box or drag and drop the PDF file you want to rotate.</li>
        <li>Choose your desired rotation angle: 90 degrees, 180 degrees, or 270 degrees clockwise.</li>
        <li>Click the "Rotate PDF" button to apply the new orientation to the document.</li>
        <li>Wait a moment for processing to finish, then download your corrected PDF file.</li>
      </ol>

      <h3>Common real-life use case</h3>
      <p>
        When scanning ID cards, signed lease agreements, or handwritten class notes on a phone or office scanner, pages often end up rotated 90 degrees or completely upside down. Before emailing those documents to a manager, landlord, or teacher, you can rotate them upright so they are easy to read on any screen.
      </p>

      <h3>Tips for best results</h3>
      <ul>
        <li>Use 90 degrees clockwise to turn a page lying on its left side upright, or 270 degrees if it is lying on its right side.</li>
        <li>Use 180 degrees to flip an upside-down scan right-side up.</li>
        <li>If you need to rotate only specific pages, split them out first, rotate them, and then merge the PDF back together.</li>
      </ul>

      <h3>Frequently Asked Questions</h3>
      <p>
        <strong>Does this rotate every page in the PDF?</strong><br />
        Yes. The rotation angle you select is applied to all pages in the document at once, which is ideal for multi-page scans.
      </p>
      <p>
        <strong>Is the rotation saved permanently?</strong><br />
        Yes. The downloaded PDF stores the updated page orientation permanently, so it will open upright in every PDF viewer.
      </p>
      <p>
        <strong>Are my scanned documents uploaded anywhere?</strong><br />
        No. Rotation happens directly inside your browser without sending your files to any server.
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
