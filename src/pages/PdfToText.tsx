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
      <h2>How to use PDF to Text</h2>
      <p>
        Our PDF to Text tool extracts selectable text from your PDF documents and converts it into a clean, plain text format. It is a fast way to pull written content out of locked or formatted PDFs so you can edit, quote, or search through it in any text editor or word processor.
      </p>

      <h3>Step-by-step guide</h3>
      <ol>
        <li>Click the upload area or drag and drop the PDF file you want to extract text from.</li>
        <li>Click the "Extract Text" button to scan all pages of your document.</li>
        <li>Read through the extracted text in the preview box, organized page by page.</li>
        <li>Copy the text directly to your clipboard or click "Download" to save it as a .txt file.</li>
      </ol>

      <h3>Common real-life use case</h3>
      <p>
        Students researching essays and office workers reviewing long reports often need to pull quotes, paragraphs, or data from a PDF into Word or Google Docs. Instead of manually retyping paragraphs or dealing with broken PDF copy-pasting, you can extract the entire document's text in one click.
      </p>

      <h3>Tips for best results</h3>
      <ul>
        <li>Make sure your PDF contains selectable digital text rather than flat scanned images of pages.</li>
        <li>Use the page markers in the output (such as "--- Page 1 ---") to quickly locate where each section came from.</li>
        <li>After downloading the .txt file, you can open it in Notepad, TextEdit, Word, or Google Docs for further editing.</li>
      </ul>

      <h3>Frequently Asked Questions</h3>
      <p>
        <strong>Can this tool read scanned PDFs or photos of text?</strong><br />
        No. It extracts digital text embedded inside the PDF. If your PDF is a scanned image without selectable text, no text will be found.
      </p>
      <p>
        <strong>Will fonts, colors, and tables be preserved?</strong><br />
        The output is plain text (.txt), so styling, fonts, and complex table borders are removed while basic line breaks and page order are kept.
      </p>
      <p>
        <strong>Is my PDF uploaded to a server?</strong><br />
        No. Text extraction runs completely inside your browser, keeping your documents private.
      </p>
    </div>
  );

  if (resultText !== null) {
    const textBlob = new Blob([resultText], { type: 'text/plain' });
    const textUrl = URL.createObjectURL(textBlob);
    
    return (
      <ToolLayout 
        title="PDF to Text" 
        description="Extract text from your PDF into a text document." 
        seoTitle="PDF to Text | Quick PDF Tools" 
        seoDescription="Extract selectable text from PDF files into a plain text document online for free. Fast, private, and easy to use in your browser."
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
      seoTitle="PDF to Text | Quick PDF Tools" 
      seoDescription="Extract selectable text from PDF files into a plain text document online for free. Fast, private, and easy to use in your browser."
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
