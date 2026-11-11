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
        Our JPG to PDF converter turns one or more JPG or JPEG photos into a clean, easy-to-share PDF document. Instead of sending a messy folder of separate image files, you can package everything into a single PDF that opens neatly on any computer or phone.
      </p>

      <h3>Step-by-step guide</h3>
      <ol>
        <li>Click the upload box or drag and drop your JPG or JPEG images onto the page.</li>
        <li>Drag the image cards up or down in the list to set the exact page order you want.</li>
        <li>Click "Add More" if you need to include additional photos.</li>
        <li>Click the "Convert to PDF" button to place each photo onto an A4 PDF page.</li>
        <li>Download your finished PDF document to your device.</li>
      </ol>

      <h3>Common real-life use case</h3>
      <p>
        Students and job applicants often take photos of handwritten homework, ID cards, or paper certificates with their phone camera. Most school and job portals only accept PDF uploads, so converting those JPG photos into a single PDF lets you submit everything cleanly in one file.
      </p>

      <h3>Tips for best results</h3>
      <ul>
        <li>Take photos in bright, even lighting so text on paper documents is easy to read.</li>
        <li>Crop out messy desk backgrounds on your phone before converting to PDF.</li>
        <li>Arrange the photos in page order before clicking convert so page 1 appears first.</li>
      </ul>

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
        The Images to PDF tool lets you combine both JPG and PNG pictures into a single, well-organized PDF document. Whether you have screenshots saved as PNGs and camera photos saved as JPGs, you can mix them together in any order without converting file formats first.
      </p>

      <h3>Step-by-step guide</h3>
      <ol>
        <li>Click the upload area or drag and drop your JPG, JPEG, and PNG files into the box.</li>
        <li>Reorder the image list by dragging each item into the sequence you want.</li>
        <li>Use "Add More" if you want to append extra screenshots or photos.</li>
        <li>Click "Convert to PDF" to generate your multi-page A4 PDF document.</li>
        <li>Download the completed PDF file directly to your device.</li>
      </ol>

      <h3>Common real-life use case</h3>
      <p>
        Office workers and students often need to put together visual reports, expense receipts, or project portfolios that include both phone photos (JPG) and computer screenshots (PNG). Combining them into one PDF creates a clean, consistent handout that anyone can open.
      </p>

      <h3>Tips for best results</h3>
      <ul>
        <li>Keep all images oriented upright before uploading so every page of your PDF reads naturally.</li>
        <li>Use PNGs for crisp screenshots and JPGs for camera photos; the tool handles both automatically.</li>
        <li>Each image is centered and scaled to fit an A4 page without stretching or cropping.</li>
      </ul>

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
        <strong>Is there any cost or watermark?</strong><br />
        No. It is 100% free with no watermarks, and everything processes directly inside your web browser.
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

