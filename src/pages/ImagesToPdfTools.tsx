import React, { useState } from 'react';
import ToolLayout from '../components/ToolLayout';
import FileUpload from '../components/FileUpload';
import SortableFileList, { FileWithId } from '../components/SortableFileList';
import ResultPreview from '../components/ResultPreview';
import jsPDF from 'jspdf';
import { Loader2 } from 'lucide-react';

interface ImagesToPdfBaseProps {
  title: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  accept: Record<string, string[]>;
  infoContent: React.ReactNode;
}

export function ImagesToPdfBase({ title, description, seoTitle, seoDescription, accept, infoContent }: ImagesToPdfBaseProps) {
  const [items, setItems] = useState<FileWithId[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = (files: File[]) => {
    setError(null);
    const newItems = files.map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      previewUrl: URL.createObjectURL(file)
    }));
    setItems(prev => [...prev, ...newItems]);
  };

  const handleRemove = (id: string) => {
    setItems(prev => prev.filter(item => {
      if (item.id === id && item.previewUrl) {
        URL.revokeObjectURL(item.previewUrl);
      }
      return item.id !== id;
    }));
  };

  const handleConvert = async () => {
    if (items.length === 0) {
      setError("Please select at least one image.");
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4'
      });
      
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        
        // Load image to get dimensions
        const img = new Image();
        img.src = item.previewUrl!;
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });
        
        // Calculate aspect ratio fit
        const imgRatio = img.width / img.height;
        const pageRatio = pageWidth / pageHeight;
        
        let renderWidth = pageWidth;
        let renderHeight = pageHeight;
        
        if (imgRatio > pageRatio) {
          renderHeight = pageWidth / imgRatio;
        } else {
          renderWidth = pageHeight * imgRatio;
        }
        
        // Center image
        const x = (pageWidth - renderWidth) / 2;
        const y = (pageHeight - renderHeight) / 2;
        
        if (i > 0) {
          pdf.addPage();
        }
        
        const type = item.file.type === 'image/png' ? 'PNG' : 'JPEG';
        pdf.addImage(img, type, x, y, renderWidth, renderHeight);
      }
      
      const pdfBlob = pdf.output('blob');
      const url = URL.createObjectURL(pdfBlob);
      setResultUrl(url);
    } catch (err) {
      console.error(err);
      setError("An error occurred while converting the images. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    items.forEach(item => {
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
    });
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setItems([]);
    setResultUrl(null);
    setError(null);
  };

  if (resultUrl) {
    return (
      <ToolLayout title={title} description={description} seoTitle={seoTitle} seoDescription={seoDescription} infoContent={infoContent}>
        <ResultPreview 
          resultUrl={resultUrl} 
          filename="quick-pdf-result.pdf" 
          onReset={handleReset} 
        />
      </ToolLayout>
    );
  }

  return (
    <ToolLayout title={title} description={description} seoTitle={seoTitle} seoDescription={seoDescription} infoContent={infoContent}>
      <div className="p-8">
        {items.length === 0 ? (
          <FileUpload onFilesSelected={handleFilesSelected} accept={accept} multiple={true} />
        ) : (
          <div className="flex flex-col items-center">
            <h3 className="text-xl font-medium text-slate-800 mb-4">Arrange Images</h3>
            <p className="text-slate-500 mb-6 text-sm">Drag and drop to reorder images before converting.</p>
            
            <SortableFileList items={items} setItems={setItems} onRemove={handleRemove} />
            
            <div className="w-full max-w-2xl mt-4 flex gap-4">
              <label className="flex-1 flex items-center justify-center gap-2 border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 font-medium py-3 px-6 rounded-lg transition-colors cursor-pointer">
                <input type="file" multiple accept={Object.keys(accept).join(',')} className="hidden" onChange={(e) => {
                  if (e.target.files) handleFilesSelected(Array.from(e.target.files));
                }} />
                Add More
              </label>
              <button 
                onClick={handleConvert}
                disabled={isProcessing}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-sm"
              >
                {isProcessing ? (
                  <><Loader2 className="h-5 w-5 animate-spin" /> Processing...</>
                ) : (
                  'Convert to PDF'
                )}
              </button>
            </div>
            {error && <p className="text-red-500 mt-4">{error}</p>}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

export function JpgToPdf() {
  const infoContent = (
    <div>
      <h2>How to use JPG to PDF</h2>
      <p>
        Converting JPG photos into a PDF makes them much easier to share, print, or submit online. Follow these three steps to create your PDF:
      </p>
      <ol>
        <li>Select one or more JPG or JPEG images from your device, or drag them into the upload area.</li>
        <li>Drag the image cards up or down to arrange them in the exact page order you want.</li>
        <li>Click "Convert to PDF" to combine your photos into an A4 PDF document, then download it.</li>
      </ol>

      <h3>Frequently Asked Questions</h3>
      <p>
        <strong>Can I combine multiple JPG files into one PDF?</strong><br />
        Yes. You can upload several JPG images at once and arrange their order before converting them into a single multi-page PDF.
      </p>
      <p>
        <strong>Will my photos lose quality?</strong><br />
        No. Each JPG image is scaled cleanly to fit the PDF page while keeping its original clarity and colors.
      </p>
      <p>
        <strong>Are my photos uploaded to a server?</strong><br />
        No. The entire conversion runs locally in your browser, so your personal photos stay private on your device.
      </p>
    </div>
  );
  return (
    <ImagesToPdfBase 
      title="JPG to PDF" 
      description="Convert JPG images into PDF files quickly."
      seoTitle="JPG to PDF | Quick PDF Tools"
      seoDescription="Convert JPG and JPEG images into a PDF document online for free. Fast, private, and easy to use directly in your web browser."
      accept={{'image/jpeg': ['.jpg', '.jpeg']}}
      infoContent={infoContent}
    />
  );
}

export function ImagesToPdf() {
  const infoContent = (
    <div>
      <h2>How to use Images to PDF</h2>
      <p>
        Need to turn a mix of JPG and PNG pictures into a single PDF? Follow these three simple steps to build your document:
      </p>
      <ol>
        <li>Upload any combination of JPG, JPEG, and PNG files using the upload box above.</li>
        <li>Reorder your images by dragging them into the sequence you want them to appear in the PDF.</li>
        <li>Click "Convert to PDF" to generate your multi-page PDF file and download it right away.</li>
      </ol>

      <h3>Frequently Asked Questions</h3>
      <p>
        <strong>Can I mix JPG and PNG images in the same PDF?</strong><br />
        Yes. You can upload both JPG and PNG files together and combine them into one clean PDF document.
      </p>
      <p>
        <strong>How are different image sizes handled?</strong><br />
        Each image is automatically centered and scaled to fit neatly onto an A4 page without stretching or cropping.
      </p>
      <p>
        <strong>Is there any cost or file limit?</strong><br />
        It is 100% free with no watermarks, and everything processes directly inside your web browser.
      </p>
    </div>
  );
  return (
    <ImagesToPdfBase 
      title="Images to PDF" 
      description="Convert multiple JPG & PNG images to a single PDF."
      seoTitle="Images to PDF | Quick PDF Tools"
      seoDescription="Combine multiple JPG and PNG images into a single PDF document online for free. Fast, private, and easy to use in your browser."
      accept={{'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png']}}
      infoContent={infoContent}
    />
  );
}

