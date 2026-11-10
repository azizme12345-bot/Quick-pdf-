import React, { useState } from 'react';
import ToolLayout from '../components/ToolLayout';
import FileUpload from '../components/FileUpload';
import ResultPreview from '../components/ResultPreview';
import * as pdfjsLib from 'pdfjs-dist';
import { Loader2, Type } from 'lucide-react';

export default function PdfToText() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultText, setResultText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = (files: File[]) => {
    setError(null);
    setFile(files[0]);
  };

  const handleExtract = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;
      let fullText = '';

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        // Basic heuristic to reconstruct text with some formatting
        let lastY = -1;
        let pageText = '';
        
        for (const item of textContent.items) {
          if ('str' in item) {
             const currentY = item.transform[5];
             if (lastY !== -1 && Math.abs(currentY - lastY) > 5) {
                pageText += '\n';
             }
             pageText += item.str;
             lastY = currentY;
          }
        }
        
        fullText += `--- Page ${i} ---\n\n${pageText}\n\n`;
      }

      setResultText(fullText.trim() || "No selectable text found in this document.");
    } catch (err) {
      console.error(err);
      setError("An error occurred while extracting text from the PDF. Ensure it's not a scanned image.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResultText(null);
    setError(null);
  };

  const infoContent = (
    <div>
      <h2>What is PDF to Text?</h2>
      <p>This tool extracts selectable text from your PDF document and converts it into a plain text format. It's helpful for quickly getting content out of documents for editing or analysis.</p>
      
      <h3>How to use in 3 steps:</h3>
      <ol>
        <li>Click "Select PDF File" or drag your PDF into the upload area.</li>
        <li>Click the "Extract Text" button to process your file.</li>
        <li>Review the extracted text and download it as a .txt file.</li>
      </ol>

      <h3>Common Questions:</h3>
      <p><strong>Does it work with scanned PDFs?</strong> No, this tool extracts selectable text. If your PDF is a scanned image, the tool will not be able to read the text.</p>
      <p><strong>Is the formatting preserved?</strong> The tool attempts to preserve the basic layout, but complex formatting may not be fully retained.</p>
    </div>
  );

  if (resultText !== null) {
    const textBlob = new Blob([resultText], { type: 'text/plain' });
    const textUrl = URL.createObjectURL(textBlob);
    
    return (
      <ToolLayout 
        title="PDF to Text" 
        description="Extract text from your PDF into a text document." 
        seoTitle="PDF to Text Converter - Free Online | Quick PDF Tools" 
        seoDescription="Extract text from PDF files online for free. Fast, secure, and accurate text extraction."
        infoContent={infoContent}
      >
        <ResultPreview 
          resultUrl={textUrl} 
          filename="quick-pdf-extracted.txt" 
          onReset={handleReset} 
          type="text"
          textResult={resultText}
        />
      </ToolLayout>
    );
  }

  return (
    <ToolLayout 
      title="PDF to Text" 
      description="Extract text from your PDF into a text document." 
      seoTitle="PDF to Text Converter - Free Online | Quick PDF Tools" 
      seoDescription="Extract text from PDF files online for free. Fast, secure, and accurate text extraction."
      infoContent={infoContent}
    >
      <div className="p-8">
        {!file ? (
          <FileUpload onFilesSelected={handleFilesSelected} accept={{'application/pdf': ['.pdf']}} />
        ) : (
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mb-4">
              <Type className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-medium text-slate-800 mb-8">{file.name}</h3>
            
            <div className="w-full max-w-md flex flex-col gap-4">
              <button 
                onClick={handleExtract}
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-sm"
              >
                {isProcessing ? (
                  <><Loader2 className="h-5 w-5 animate-spin" /> Extracting Text...</>
                ) : (
                  'Extract Text'
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
