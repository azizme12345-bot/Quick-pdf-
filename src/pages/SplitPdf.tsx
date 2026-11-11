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
      <h2>How to use Split PDF</h2>
      <p>
        The Split PDF tool helps you extract only the pages you actually need from a large PDF document and save them as a brand-new, smaller file. Instead of sending a 50-page handbook when someone only asked for three pages, you can pull out those exact pages in seconds.
      </p>

      <h3>Step-by-step guide</h3>
      <ol>
        <li>Click the upload area or drag and drop the PDF file you want to split.</li>
        <li>Check the total page count displayed below your file name.</li>
        <li>Type the page numbers or ranges you want to extract into the input box, such as "1-3, 5, 8-10".</li>
        <li>Click the "Split PDF" button to create a new document containing only your chosen pages.</li>
        <li>Download the extracted PDF to your computer or phone.</li>
      </ol>

      <h3>Common real-life use case</h3>
      <p>
        Students and office workers frequently receive long course packets, scanned contracts, or monthly statements where only one or two pages are needed for a school form or expense report. Using Split PDF, you can extract just the signed page or the relevant assignment pages without sharing the rest of the document.
      </p>

      <h3>Tips for best results</h3>
      <ul>
        <li>Use a hyphen for continuous page ranges (for example, 4-9) and commas to separate single pages (for example, 2, 7, 11).</li>
        <li>Double-check the total page count so you do not enter a number higher than the last page.</li>
        <li>Keep your original file as a backup; splitting creates a new file without modifying the source PDF.</li>
      </ul>

      <h3>Frequently Asked Questions</h3>
      <p>
        <strong>Will splitting a PDF delete pages from my original file?</strong><br />
        No. Your original PDF stays completely untouched on your device. The tool creates a separate new PDF with only the pages you selected.
      </p>
      <p>
        <strong>Can I extract non-consecutive pages into one PDF?</strong><br />
        Yes. Simply separate the page numbers or ranges with commas, like "1, 4-6, 12", and they will all be combined into your new file in order.
      </p>
      <p>
        <strong>Is my document sent to an external server?</strong><br />
        No. All page extraction runs locally in your browser, so confidential contracts and school records remain private.
      </p>
    </div>
  );

  if (resultUrl) {
    return (
      <ToolLayout 
        title="Split PDF" 
        description="Extract pages from your PDF into a new document." 
        seoTitle="Split PDF | Quick PDF Tools" 
        seoDescription="Extract specific pages or split a PDF into a smaller document online for free. Fast, private, and easy to use in your browser."
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
      seoTitle="Split PDF | Quick PDF Tools" 
      seoDescription="Extract specific pages or split a PDF into a smaller document online for free. Fast, private, and easy to use in your browser."
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
