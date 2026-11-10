import React, { useState } from 'react';
import ToolLayout from '../components/ToolLayout';
import FileUpload from '../components/FileUpload';
import SortableFileList, { FileWithId } from '../components/SortableFileList';
import ResultPreview from '../components/ResultPreview';
import { PDFDocument } from 'pdf-lib';
import { Loader2 } from 'lucide-react';

export default function MergePdf() {
  const [items, setItems] = useState<FileWithId[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = (files: File[]) => {
    setError(null);
    const newItems = files.map(file => ({
      id: Math.random().toString(36).substring(7),
      file
    }));
    setItems(prev => [...prev, ...newItems]);
  };

  const handleRemove = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleMerge = async () => {
    if (items.length < 2) {
      setError("Please select at least two PDF files to merge.");
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const mergedPdf = await PDFDocument.create();
      
      for (const item of items) {
        const arrayBuffer = await item.file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => {
          mergedPdf.addPage(page);
        });
      }
      
      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
    } catch (err) {
      console.error(err);
      setError("An error occurred while merging the PDFs. Ensure all files are valid PDFs.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setItems([]);
    setResultUrl(null);
    setError(null);
  };

  const infoContent = (
    <div>
      <h2>What is Merge PDF?</h2>
      <p>Merge PDF is a free online tool that allows you to combine multiple PDF files into a single, cohesive document. It's perfect for organizing your paperwork, reports, or projects.</p>
      
      <h3>How to use Merge PDF in 3 steps:</h3>
      <ol>
        <li>Click the "Select PDF Files" button or drag and drop your files into the upload area.</li>
        <li>Arrange your files in the desired order by dragging and dropping them in the list.</li>
        <li>Click the "Merge PDFs" button to combine your files, then download your new document.</li>
      </ol>

      <h3>Common Questions:</h3>
      <p><strong>Is it safe to use?</strong> Yes, your files are processed securely, often directly in your browser, and are not stored permanently.</p>
      <p><strong>Is there a limit on file size?</strong> You can merge multiple PDF files as long as your browser can handle the total size.</p>
    </div>
  );

  if (resultUrl) {
    return (
      <ToolLayout 
        title="Merge PDF" 
        description="Combine multiple PDF files into one single document." 
        seoTitle="Merge PDF Online Free | Quick PDF Tools" 
        seoDescription="Merge multiple PDF files into a single document for free. Easy to use online PDF merger. Secure and fast."
        infoContent={infoContent}
      >
        <ResultPreview 
          resultUrl={resultUrl} 
          filename="quick-pdf-merged.pdf" 
          onReset={handleReset} 
        />
      </ToolLayout>
    );
  }

  return (
    <ToolLayout 
      title="Merge PDF" 
      description="Combine multiple PDF files into one single document." 
      seoTitle="Merge PDF Online Free | Quick PDF Tools" 
      seoDescription="Merge multiple PDF files into a single document for free. Easy to use online PDF merger. Secure and fast."
      infoContent={infoContent}
    >
      <div className="p-8">
        {items.length === 0 ? (
          <FileUpload onFilesSelected={handleFilesSelected} accept={{'application/pdf': ['.pdf']}} multiple={true} />
        ) : (
          <div className="flex flex-col items-center">
            <h3 className="text-xl font-medium text-slate-800 mb-4">Arrange PDFs</h3>
            <p className="text-slate-500 mb-6 text-sm">Drag and drop to reorder the PDF files before merging.</p>
            
            <SortableFileList items={items} setItems={setItems} onRemove={handleRemove} />
            
            <div className="w-full max-w-2xl mt-4 flex gap-4">
              <label className="flex-1 flex items-center justify-center gap-2 border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 font-medium py-3 px-6 rounded-lg transition-colors cursor-pointer">
                <input type="file" multiple accept=".pdf,application/pdf" className="hidden" onChange={(e) => {
                  if (e.target.files) handleFilesSelected(Array.from(e.target.files));
                }} />
                Add More Files
              </label>
              <button 
                onClick={handleMerge}
                disabled={isProcessing || items.length < 2}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-sm"
              >
                {isProcessing ? (
                  <><Loader2 className="h-5 w-5 animate-spin" /> Processing...</>
                ) : (
                  'Merge PDFs'
                )}
              </button>
            </div>
            {error && <p className="text-red-500 mt-4">{error}</p>}
            {items.length === 1 && !error && <p className="text-amber-500 mt-4">Please add at least one more PDF to merge.</p>}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
