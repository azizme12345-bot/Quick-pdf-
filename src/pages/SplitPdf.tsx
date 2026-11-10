import React, { useState } from 'react';
import ToolLayout from '../components/ToolLayout';
import FileUpload from '../components/FileUpload';
import ResultPreview from '../components/ResultPreview';
import { PDFDocument } from 'pdf-lib';
import { Loader2, SplitSquareHorizontal } from 'lucide-react';

export default function SplitPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [range, setRange] = useState<string>('');
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = async (files: File[]) => {
    setError(null);
    const selectedFile = files[0];
    setFile(selectedFile);
    
    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      setTotalPages(pdf.getPageCount());
      setRange(`1-${pdf.getPageCount()}`);
    } catch (err) {
      console.error(err);
      setError("Could not read the PDF file to determine page count.");
    }
  };

  const parseRange = (rangeStr: string, maxPages: number): number[] => {
    const pages = new Set<number>();
    const parts = rangeStr.split(',').map(p => p.trim());
    
    for (const part of parts) {
      if (part.includes('-')) {
        const [startStr, endStr] = part.split('-');
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        
        if (!isNaN(start) && !isNaN(end) && start > 0 && end >= start && start <= maxPages) {
          const actualEnd = Math.min(end, maxPages);
          for (let i = start; i <= actualEnd; i++) {
            pages.add(i);
          }
        }
      } else {
        const page = parseInt(part, 10);
        if (!isNaN(page) && page > 0 && page <= maxPages) {
          pages.add(page);
        }
      }
    }
    
    return Array.from(pages).sort((a, b) => a - b);
  };

  const handleSplit = async () => {
    if (!file) return;
    
    const pagesToExtract = parseRange(range, totalPages);
    if (pagesToExtract.length === 0) {
      setError("Please enter a valid page range.");
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const sourcePdf = await PDFDocument.load(arrayBuffer);
      const newPdf = await PDFDocument.create();
      
      // pdf-lib page indices are 0-based
      const indicesToExtract = pagesToExtract.map(p => p - 1);
      const copiedPages = await newPdf.copyPages(sourcePdf, indicesToExtract);
      
      copiedPages.forEach(page => newPdf.addPage(page));
      
      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
    } catch (err) {
      console.error(err);
      setError("An error occurred while splitting the PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setFile(null);
    setResultUrl(null);
    setError(null);
    setRange('');
    setTotalPages(0);
  };

  const infoContent = (
    <div>
      <h2>What is Split PDF?</h2>
      <p>This tool lets you extract specific pages from your PDF and save them as a new, smaller document. It's perfect for when you only need a portion of a larger file.</p>
      
      <h3>How to use in 3 steps:</h3>
      <ol>
        <li>Click "Select PDF File" or drag your PDF into the upload area.</li>
        <li>Enter the pages or ranges you want to extract (e.g., 1-3, 5, 8).</li>
        <li>Click "Split PDF" to create your new document and download it.</li>
      </ol>

      <h3>Common Questions:</h3>
      <p><strong>How do I specify pages?</strong> You can use single numbers (e.g., 3), comma-separated values (e.g., 1, 3, 5), or ranges (e.g., 1-5).</p>
      <p><strong>Is the original file changed?</strong> No, this tool extracts the pages to create a new file, leaving your original document intact.</p>
    </div>
  );

  if (resultUrl) {
    return (
      <ToolLayout 
        title="Split PDF" 
        description="Extract pages from your PDF into a new document." 
        seoTitle="Split PDF Online Free | Quick PDF Tools" 
        seoDescription="Split PDF files or extract specific pages for free. Secure, fast, and easy to use."
        infoContent={infoContent}
      >
        <ResultPreview 
          resultUrl={resultUrl} 
          filename="quick-pdf-split.pdf" 
          onReset={handleReset} 
        />
      </ToolLayout>
    );
  }

  return (
    <ToolLayout 
      title="Split PDF" 
      description="Extract pages from your PDF into a new document." 
      seoTitle="Split PDF Online Free | Quick PDF Tools" 
      seoDescription="Split PDF files or extract specific pages for free. Secure, fast, and easy to use."
      infoContent={infoContent}
    >
      <div className="p-8">
        {!file ? (
          <FileUpload onFilesSelected={handleFilesSelected} accept={{'application/pdf': ['.pdf']}} />
        ) : (
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4">
              <SplitSquareHorizontal className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-medium text-slate-800 mb-2">{file.name}</h3>
            {totalPages > 0 && <p className="text-slate-500 mb-6">Total Pages: {totalPages}</p>}
            
            <div className="w-full max-w-md bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8 text-left">
              <label htmlFor="range" className="block text-sm font-medium text-slate-700 mb-2">
                Pages to extract:
              </label>
              <input
                type="text"
                id="range"
                value={range}
                onChange={(e) => setRange(e.target.value)}
                placeholder="e.g., 1-5, 8, 11-13"
                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-2 text-xs text-slate-500">
                Example: 1-5, 8, 11-13
              </p>
            </div>
            
            <div className="w-full max-w-md flex flex-col gap-4">
              <button 
                onClick={handleSplit}
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-sm"
              >
                {isProcessing ? (
                  <><Loader2 className="h-5 w-5 animate-spin" /> Processing...</>
                ) : (
                  'Split PDF'
                )}
              </button>
              <button 
                onClick={handleReset}
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
