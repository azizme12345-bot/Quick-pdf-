import React, { useState } from 'react';
import ToolLayout from '../components/ToolLayout';
import FileUpload from '../components/FileUpload';
import * as pdfjsLib from 'pdfjs-dist';
import JSZip from 'jszip';
import { Loader2, Download, RefreshCw, FileImage } from 'lucide-react';

interface PdfToImagesBaseProps {
  title: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  format: 'jpeg' | 'png';
  infoContent: React.ReactNode;
}

export function PdfToImagesBase({ title, description, seoTitle, seoDescription, format, infoContent }: PdfToImagesBaseProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [images, setImages] = useState<{ url: string; pageNum: number }[]>([]);
  const [zipUrl, setZipUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = (files: File[]) => {
    setError(null);
    setFile(files[0]);
  };

  const handleConvert = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);
    setImages([]);
    setZipUrl(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;
      const newImages: { url: string; pageNum: number }[] = [];
      const zip = new JSZip();

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 }); // Scale for better quality

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) throw new Error("Could not create canvas context");

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        } as any;

        await page.render(renderContext).promise;

        const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
        const quality = format === 'jpeg' ? 0.92 : undefined;
        const dataUrl = canvas.toDataURL(mimeType, quality);

        newImages.push({ url: dataUrl, pageNum: i });

        // Add to zip
        const base64Data = dataUrl.split(',')[1];
        zip.file(`page-${i}.${format === 'jpeg' ? 'jpg' : 'png'}`, base64Data, { base64: true });
      }

      setImages(newImages);

      // Generate zip if multiple pages
      if (numPages > 1) {
        const content = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(content);
        setZipUrl(url);
      }

    } catch (err) {
      console.error(err);
      setError(`An error occurred while converting the PDF to ${format.toUpperCase()}. Ensure the file is a valid PDF.`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    images.forEach(img => URL.revokeObjectURL(img.url));
    if (zipUrl) URL.revokeObjectURL(zipUrl);
    setFile(null);
    setImages([]);
    setZipUrl(null);
    setError(null);
  };

  const downloadImage = (url: string, pageNum: number) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `page-${pageNum}.${format === 'jpeg' ? 'jpg' : 'png'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadZip = () => {
    if (!zipUrl) return;
    const link = document.createElement('a');
    link.href = zipUrl;
    link.download = `quick-pdf-to-${format === 'jpeg' ? 'jpg' : 'png'}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (images.length > 0) {
    return (
      <ToolLayout title={title} description={description} seoTitle={seoTitle} seoDescription={seoDescription} infoContent={infoContent}>
        <div className="p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Your Images are Ready</h2>
            
            {images.length > 1 && zipUrl && (
              <button 
                onClick={downloadZip}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors shadow-sm mb-4"
              >
                <Download className="h-5 w-5" />
                Download All as ZIP
              </button>
            )}
            
            <button 
              onClick={handleReset}
              className="flex items-center justify-center gap-2 text-slate-500 hover:text-slate-700 font-medium py-2 px-4 transition-colors mb-8"
            >
              <RefreshCw className="h-4 w-4" />
              Process Another File
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {images.map((img) => (
              <div key={img.pageNum} className="bg-slate-50 border border-slate-200 rounded-lg overflow-hidden flex flex-col shadow-sm">
                <div className="p-2 border-b border-slate-200 flex justify-between items-center bg-white">
                  <span className="text-sm font-medium text-slate-600">Page {img.pageNum}</span>
                </div>
                <div className="p-4 flex-grow flex items-center justify-center bg-slate-100">
                  <img src={img.url} alt={`Page ${img.pageNum}`} className="max-h-64 object-contain shadow-sm border border-slate-300" />
                </div>
                <div className="p-3 bg-white">
                  <button 
                    onClick={() => downloadImage(img.url, img.pageNum)}
                    className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white text-sm font-medium py-2 rounded transition-colors"
                  >
                    <Download className="h-4 w-4" /> Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ToolLayout>
    );
  }

  return (
    <ToolLayout title={title} description={description} seoTitle={seoTitle} seoDescription={seoDescription} infoContent={infoContent}>
      <div className="p-8">
        {!file ? (
          <FileUpload onFilesSelected={handleFilesSelected} accept={{'application/pdf': ['.pdf']}} />
        ) : (
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mb-4">
              <FileImage className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-medium text-slate-800 mb-8">{file.name}</h3>
            
            <div className="w-full max-w-md flex flex-col gap-4">
              <button 
                onClick={handleConvert}
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-sm"
              >
                {isProcessing ? (
                  <><Loader2 className="h-5 w-5 animate-spin" /> Converting...</>
                ) : (
                  `Convert to ${format === 'jpeg' ? 'JPG' : 'PNG'}`
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

export function PdfToJpg() {
  const infoContent = (
    <div>
      <h2>How to use PDF to JPG</h2>
      <p>
        Our PDF to JPG converter turns every page of your PDF document into a separate, high-resolution JPG image. This makes it easy to share individual pages on social media, embed them into presentations, or view them on devices that do not have a PDF reader.
      </p>

      <h3>Step-by-step guide</h3>
      <ol>
        <li>Click the upload box or drag and drop the PDF file you want to convert.</li>
        <li>Click the "Convert to JPG" button to render each page as a crisp JPG image.</li>
        <li>Preview all converted pages in the grid on your screen.</li>
        <li>Click "Download" under any single page to save it, or click "Download All as ZIP" for multi-page PDFs.</li>
      </ol>

      <h3>Common real-life use case</h3>
      <p>
        Teachers, marketers, and office staff often need to post a flyer, schedule, or chart from a PDF onto a website, WhatsApp group, or PowerPoint slide. Converting the PDF page to a JPG image lets you drop it straight into any image editor or messaging app.
      </p>

      <h3>Tips for best results</h3>
      <ul>
        <li>If your PDF has many pages, use the "Download All as ZIP" button to save every image in one click.</li>
        <li>JPG is ideal for PDFs with photos and colorful flyers because it keeps file sizes small.</li>
        <li>If your PDF has lots of sharp text or line diagrams, consider using our PDF to PNG tool for even crisper edges.</li>
      </ul>

      <h3>Frequently Asked Questions</h3>
      <p>
        <strong>Does it convert every page of my PDF?</strong><br />
        Yes. Every page in your PDF document is converted into its own separate JPG image file.
      </p>
      <p>
        <strong>What resolution are the exported JPG images?</strong><br />
        Pages are rendered at high resolution (2x scale) so text, charts, and photos remain clear and easy to read.
      </p>
      <p>
        <strong>Are my PDFs uploaded to a server?</strong><br />
        No. All rendering happens locally inside your web browser, keeping your documents private.
      </p>
    </div>
  );
  return (
    <PdfToImagesBase 
      title="PDF to JPG" 
      description="Extract pages from your PDF as JPG images."
      seoTitle="PDF to JPG | Quick PDF Tools"
      seoDescription="Convert PDF pages into high-quality JPG images online for free. Download single pages or a ZIP archive directly in your browser."
      format="jpeg"
      infoContent={infoContent}
    />
  );
}

export function PdfToPng() {
  const infoContent = (
    <div>
      <h2>How to use PDF to PNG</h2>
      <p>
        The PDF to PNG tool converts each page of your PDF into a lossless PNG image. Because PNG compression does not blur sharp edges, it is the best choice when your PDF contains small text, tables, technical drawings, or clean UI screenshots.
      </p>

      <h3>Step-by-step guide</h3>
      <ol>
        <li>Select a PDF file from your device or drag and drop it into the upload area.</li>
        <li>Click the "Convert to PNG" button to render every page into a lossless PNG image.</li>
        <li>Review the generated page previews right on the screen.</li>
        <li>Download individual PNG pages, or click "Download All as ZIP" to save all pages together.</li>
      </ol>

      <h3>Common real-life use case</h3>
      <p>
        Designers, students, and office professionals often need to extract a clean diagram, resume preview, or spreadsheet table from a PDF without any fuzzy compression artifacts. Exporting to PNG keeps every line and letter razor-sharp for reports and portfolios.
      </p>

      <h3>Tips for best results</h3>
      <ul>
        <li>Choose PNG over JPG whenever your PDF contains mostly text, charts, or black-and-white forms.</li>
        <li>Use the ZIP download option for multi-page documents to keep all your exported pages organized in one folder.</li>
        <li>You can open the downloaded PNGs in any image viewer, browser, or presentation tool.</li>
      </ul>

      <h3>Frequently Asked Questions</h3>
      <p>
        <strong>When should I choose PNG instead of JPG?</strong><br />
        Choose PNG when your PDF has sharp text, line art, or screenshots, as PNG avoids compression artifacts around edges.
      </p>
      <p>
        <strong>How do I download a multi-page PDF?</strong><br />
        For PDFs with two or more pages, a "Download All as ZIP" button appears so you can grab all PNGs in one click.
      </p>
      <p>
        <strong>Is my file kept private?</strong><br />
        Yes. Conversion runs completely inside your browser without uploading your PDF anywhere.
      </p>
    </div>
  );
  return (
    <PdfToImagesBase 
      title="PDF to PNG" 
      description="Extract pages from your PDF as PNG images."
      seoTitle="PDF to PNG | Quick PDF Tools"
      seoDescription="Convert PDF pages into lossless PNG images online for free. Fast, private, and easy to use directly in your web browser."
      format="png"
      infoContent={infoContent}
    />
  );
}
