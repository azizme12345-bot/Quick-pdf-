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
      <h2>What is JPG to PDF?</h2>
      <p>This tool converts your JPG or JPEG images into high-quality PDF files. It's useful for combining multiple photos into a single document.</p>
      
      <h3>How to use in 3 steps:</h3>
      <ol>
        <li>Click "Select JPG Files" or drag your images into the upload area.</li>
        <li>Arrange images in the desired order by dragging them in the list.</li>
        <li>Click "Convert to PDF" to generate your document and download it.</li>
      </ol>

      <h3>Common Questions:</h3>
      <p><strong>Can I convert multiple images?</strong> Yes, you can upload and convert multiple JPG files at once.</p>
      <p><strong>Is the quality maintained?</strong> Yes, the tool preserves the original image quality in the PDF output.</p>
    </div>
  );
  return (
    <ImagesToPdfBase 
      title="JPG to PDF" 
      description="Convert JPG images into PDF files quickly."
      seoTitle="JPG to PDF Converter - Free Online | Quick PDF Tools"
      seoDescription="Convert JPG images to PDF for free. Fast, secure, and easy to use. Drag and drop your JPG files to convert them to PDF directly in your browser."
      accept={{'image/jpeg': ['.jpg', '.jpeg']}}
      infoContent={infoContent}
    />
  );
}

export function PngToPdf() {
  const infoContent = (
    <div>
      <h2>What is PNG to PDF?</h2>
      <p>This tool converts your PNG images into a PDF document. It's great for images that need transparency support or are already in PNG format.</p>
      
      <h3>How to use in 3 steps:</h3>
      <ol>
        <li>Click "Select PNG Files" or drag your images into the upload area.</li>
        <li>Arrange the images in the correct order in the list.</li>
        <li>Click "Convert to PDF" to create your new PDF file and download it.</li>
      </ol>

      <h3>Common Questions:</h3>
      <p><strong>Is transparency supported?</strong> Yes, PNG images with transparency are handled correctly during conversion.</p>
      <p><strong>Can I convert multiple PNGs?</strong> Yes, you can combine multiple PNG files into one PDF.</p>
    </div>
  );
  return (
    <ImagesToPdfBase 
      title="PNG to PDF" 
      description="Convert PNG images into a PDF document."
      seoTitle="PNG to PDF Converter - Free Online | Quick PDF Tools"
      seoDescription="Convert PNG images to PDF for free. Process PNG files into high-quality PDFs securely in your browser."
      accept={{'image/png': ['.png']}}
      infoContent={infoContent}
    />
  );
}

export function ImagesToPdf() {
  const infoContent = (
    <div>
      <h2>What is Images to PDF?</h2>
      <p>Combine multiple JPG, JPEG, and PNG images into a single PDF document. It's the most convenient way to create a PDF from various image sources.</p>
      
      <h3>How to use in 3 steps:</h3>
      <ol>
        <li>Upload your JPG and PNG images using the upload area.</li>
        <li>Sort your images by dragging and dropping them into the desired order.</li>
        <li>Click "Convert to PDF" to combine all images and download the final PDF.</li>
      </ol>

      <h3>Common Questions:</h3>
      <p><strong>Can I mix image types?</strong> Yes, you can easily combine both JPG and PNG images into a single PDF file.</p>
      <p><strong>Does it work offline?</strong> Yes, the conversion happens directly in your browser, and no internet connection is required after loading the page.</p>
    </div>
  );
  return (
    <ImagesToPdfBase 
      title="Images to PDF" 
      description="Convert multiple JPG & PNG images to a single PDF."
      seoTitle="Images to PDF Converter - Free Online | Quick PDF Tools"
      seoDescription="Combine multiple JPG, JPEG, and PNG images into a single PDF document for free. Easy to use online tool."
      accept={{'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png']}}
      infoContent={infoContent}
    />
  );
}
