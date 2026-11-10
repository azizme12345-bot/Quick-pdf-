import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  FileImage, 
  Image as ImageIcon, 
  Files, 
  SplitSquareHorizontal, 
  Minimize, 
  RotateCw, 
  Type, 
  ArrowRight
} from 'lucide-react';
import { AdPlaceholder } from '../components/Layout';

const tools = [
  {
    id: 'jpg-to-pdf',
    name: 'JPG to PDF',
    description: 'Convert JPG images into PDF files quickly.',
    icon: FileImage,
    path: '/jpg-to-pdf',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50'
  },
  {
    id: 'png-to-pdf',
    name: 'PNG to PDF',
    description: 'Convert PNG images into a PDF document.',
    icon: ImageIcon,
    path: '/png-to-pdf',
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    id: 'images-to-pdf',
    name: 'Images to PDF',
    description: 'Convert multiple JPG & PNG images to a single PDF.',
    icon: Files,
    path: '/images-to-pdf',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50'
  },
  {
    id: 'pdf-to-jpg',
    name: 'PDF to JPG',
    description: 'Extract pages from your PDF as JPG images.',
    icon: FileImage,
    path: '/pdf-to-jpg',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50'
  },
  {
    id: 'pdf-to-png',
    name: 'PDF to PNG',
    description: 'Extract pages from your PDF as PNG images.',
    icon: ImageIcon,
    path: '/pdf-to-png',
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    id: 'merge-pdf',
    name: 'Merge PDF',
    description: 'Combine multiple PDF files into one single document.',
    icon: Files,
    path: '/merge-pdf',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    id: 'split-pdf',
    name: 'Split PDF',
    description: 'Extract pages or split a PDF into separate files.',
    icon: SplitSquareHorizontal,
    path: '/split-pdf',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    id: 'compress-pdf',
    name: 'Compress PDF',
    description: 'Reduce file size while optimizing for maximal quality.',
    icon: Minimize,
    path: '/compress-pdf',
    color: 'text-red-600',
    bgColor: 'bg-red-50'
  },
  {
    id: 'rotate-pdf',
    name: 'Rotate PDF',
    description: 'Rotate your PDFs the way you need them.',
    icon: RotateCw,
    path: '/rotate-pdf',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50'
  },
  {
    id: 'pdf-to-text',
    name: 'PDF to Text',
    description: 'Extract text from your PDF into a text document.',
    icon: Type,
    path: '/pdf-to-text',
    color: 'text-teal-600',
    bgColor: 'bg-teal-50'
  }
];

export default function Home() {
  const canonicalUrl = typeof window !== 'undefined' ? 'https://quick-pdf-tools.ai.studio' + window.location.pathname : '';
  const seoTitle = "Quick PDF Tools - Fast, Free & Simple PDF Tools";
  const seoDescription = "Free Online PDF Tools. Convert, merge, split, compress and manage your PDF files quickly and easily directly in your browser. Fully secure, private, and 100% free.";

  return (
    <div>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
        
        {/* Dynamic OG Tags */}
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
        <meta property="og:type" content="website" />
        
        {/* Dynamic Twitter Tags */}
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
      </Helmet>

      {/* Hero Section */}
      <div className="bg-white border-b border-slate-200 pt-16 pb-20 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
          Free Online PDF Tools
        </h1>
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 mb-8">
          Convert, merge, split, compress and manage your PDF files quickly and easily. Processed securely in your browser.
        </p>
        <div className="flex justify-center">
          <a href="#tools" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Explore PDF Tools
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdPlaceholder className="w-full h-24 mb-12" />

        <div id="tools" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {tools.map((tool) => (
            <Link 
              key={tool.id} 
              to={tool.path}
              className="group flex flex-col bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md hover:border-blue-300 transition-all duration-200"
            >
              <div className={`w-12 h-12 ${tool.bgColor} rounded-lg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
                <tool.icon className={`h-6 w-6 ${tool.color}`} />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                {tool.name}
              </h3>
              <p className="text-slate-500 text-sm mb-4 flex-grow">
                {tool.description}
              </p>
              <div className="mt-auto flex items-center text-sm font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                Use Tool <ArrowRight className="ml-1 h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>

        {/* Informative SEO Semantic Content */}
        <section className="mt-16 border-t border-slate-200 pt-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-8">
            Why Use Quick PDF Tools?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">🔒 100% Client-Side Privacy</h3>
              <p className="text-slate-600 leading-relaxed">
                Unlike other online services that upload your documents to external cloud servers, Quick PDF Tools handles file processing right on your device inside your browser whenever possible. Your sensitive files and private records never leave your control, guaranteeing top-tier document privacy.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">⚡ Ultra-Fast File Conversion</h3>
              <p className="text-slate-600 leading-relaxed">
                Since conversion, merging, and compression occur locally using advanced JavaScript APIs (such as pdf-lib and PDF.js), there are no long upload wait times, server queue lines, or downloading delays. Experience high-quality instant results on both mobile and desktop.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">📱 Fully Mobile-First Experience</h3>
              <p className="text-slate-600 leading-relaxed">
                Need to convert an image or merge PDFs on the go? Our interface is designed specifically for high performance on Android, iOS, and tablets, with simple tap targets, straightforward file managers, and responsive previews.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">🆓 Truly Free, Zero Limitations</h3>
              <p className="text-slate-600 leading-relaxed">
                No sign-up forms, no subscription plans, no premium paywalls, and absolutely no watermarks on your documents. Every utility is available at 100% capacity with infinite uses.
              </p>
            </div>
          </div>

          {/* Detailed explanations for crawlers */}
          <div className="bg-slate-100/60 rounded-2xl p-8 border border-slate-200/60 mb-16">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Complete Suite of PDF Utilities</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              Quick PDF Tools brings together all standard PDF actions into a single browser dashboard. You can effortlessly bundle images using our <strong>JPG to PDF</strong> and <strong>PNG to PDF</strong> pipelines, reorder sheets before generating documents, or do the exact opposite by converting single files using <strong>PDF to JPG</strong> and <strong>PDF to PNG</strong> extractions.
            </p>
            <p className="text-slate-600 leading-relaxed">
              We also support formatting actions. Optimize size through <strong>Compress PDF</strong>, combine records with <strong>Merge PDF</strong>, split selected sections with <strong>Split PDF</strong>, align orientation using <strong>Rotate PDF</strong>, or extract textual characters into copyable lists using <strong>PDF to Text</strong> processing.
            </p>
          </div>

          {/* FAQ Section */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-slate-900 text-center mb-8">Frequently Asked Questions (FAQ)</h3>
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <h4 className="text-lg font-bold text-slate-800 mb-2">Are my PDF files safe to upload here?</h4>
                <p className="text-slate-600 leading-relaxed">
                  Yes, absolutely. Quick PDF Tools processes files using local client-side scripts. No files are stored or uploaded to our servers, keeping your documents entirely safe on your local hardware.
                </p>
              </div>
              <div className="border-b border-slate-200 pb-4">
                <h4 className="text-lg font-bold text-slate-800 mb-2">Can I use this on my Android phone?</h4>
                <p className="text-slate-600 leading-relaxed">
                  Yes. This website is specifically designed with a mobile-first philosophy. Drag, select, reorder, convert, and download files directly from any Android or mobile phone browser.
                </p>
              </div>
              <div className="border-b border-slate-200 pb-4">
                <h4 className="text-lg font-bold text-slate-800 mb-2">Is there any limit on document sizes?</h4>
                <p className="text-slate-600 leading-relaxed">
                  Because processing happens client-side, the only limit is the memory of your own browser and device. You can convert large, high-resolution images or lengthy documents without artificial platform limits.
                </p>
              </div>
            </div>
          </div>
        </section>

        <AdPlaceholder className="w-full h-24 mt-12 mb-8" />
      </div>
    </div>
  );
}
