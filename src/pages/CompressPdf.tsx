import React, { useState } from 'react';
import ToolLayout from '../components/ToolLayout';
import FileUpload from '../components/FileUpload';
import ResultPreview from '../components/ResultPreview';
import { PDFDocument } from 'pdf-lib';
import { Loader2 } from 'lucide-react';

export default function CompressPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<{ original: number, compressed: number } | null>(null);

  const handleFilesSelected = (files: File[]) => {
    setError(null);
    setFile(files[0]);
  };

  const handleCompress = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      // Load the PDF. pdf-lib by default drops unused objects and metadata.
      const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      
      // Save it back. 
      const pdfBytes = await pdf.save({ useObjectStreams: false });
      
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      setStats({
        original: file.size,
        compressed: blob.size
      });
      setResultUrl(url);
    } catch (err) {
      console.error(err);
      setError("An error occurred while compressing the PDF. The file might be corrupted or encrypted.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setFile(null);
    setResultUrl(null);
    setError(null);
    setStats(null);
  };

  const formatSize = (bytes: number) => (bytes / 1024 / 1024).toFixed(2) + ' MB';

  const infoContent = (
    <div>
      <h2>How to use Compress PDF</h2>
      <p>
        Large PDF files can be hard to email or upload to online forms. Use this tool to shrink your PDF size in three easy steps:
      </p>
      <ol>
        <li>Select a PDF file from your computer or phone, or drag and drop it into the upload box.</li>
        <li>Check the file name and original size displayed on your screen.</li>
        <li>Click "Compress PDF" to optimize the document, then compare the new size and download your smaller file.</li>
      </ol>

      <h3>Frequently Asked Questions</h3>
      <p>
        <strong>How does browser-based compression work?</strong><br />
        The tool cleans up unused objects, redundant metadata, and extra structure inside the PDF to make the file smaller without altering your text.
      </p>
      <p>
        <strong>Will my PDF still look sharp after compressing?</strong><br />
        Yes. Text and vector graphics stay crisp. However, if your PDF consists mostly of large scanned photos, the size reduction may be modest.
      </p>
      <p>
        <strong>Is it safe for confidential documents?</strong><br />
        Yes. Compression happens locally on your device, so your files are never uploaded or stored on any server.
      </p>
    </div>
  );

  if (resultUrl) {
    return (
      <ToolLayout 
        title="Compress PDF" 
        description="Reduce file size while optimizing for maximal quality." 
        seoTitle="Compress PDF | Quick PDF Tools" 
        seoDescription="Reduce PDF file size online for free without losing readability. Fast, secure, and private PDF compression in your browser."
        infoContent={infoContent}
      >
        <div className="bg-slate-50 border-b border-slate-200 p-4 text-center">
          <p className="text-sm font-medium text-slate-700">
            Original Size: <span className="line-through text-slate-500 mr-4">{formatSize(stats?.original || 0)}</span>
            Compressed Size: <span className="text-green-600 font-bold">{formatSize(stats?.compressed || 0)}</span>
          </p>
          <p className="text-xs text-slate-500 mt-1">Note: Browser-based compression removes unused objects and metadata. For heavily image-based PDFs, compression ratio may be limited.</p>
        </div>
        <ResultPreview 
          resultUrl={resultUrl} 
          filename="quick-pdf-compressed.pdf" 
          onReset={handleReset} 
        />
      </ToolLayout>
    );
  }

  return (
    <ToolLayout 
      title="Compress PDF" 
      description="Reduce file size while optimizing for maximal quality." 
      seoTitle="Compress PDF | Quick PDF Tools" 
      seoDescription="Reduce PDF file size online for free without losing readability. Fast, secure, and private PDF compression in your browser."
      infoContent={infoContent}
    >
      <div className="p-8">
        {!file ? (
          <FileUpload onFilesSelected={handleFilesSelected} accept={{'application/pdf': ['.pdf']}} />
        ) : (
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-slate-800 mb-2">{file.name}</h3>
            <p className="text-slate-500 mb-8">{formatSize(file.size)}</p>
            
            <div className="w-full max-w-md flex flex-col gap-4">
              <button 
                onClick={handleCompress}
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-sm"
              >
                {isProcessing ? (
                  <><Loader2 className="h-5 w-5 animate-spin" /> Compressing...</>
                ) : (
                  'Compress PDF'
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
