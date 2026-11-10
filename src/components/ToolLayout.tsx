import React from 'react';
import { Helmet } from 'react-helmet-async';
import { AdPlaceholder } from './Layout';

interface ToolLayoutProps {
  title: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  infoContent?: React.ReactNode;
  children: React.ReactNode;
}

export default function ToolLayout({ title, description, seoTitle, seoDescription, infoContent, children }: ToolLayoutProps) {
  const canonicalUrl = typeof window !== 'undefined' ? 'https://quick-pdf-tools.ai.studio' + window.location.pathname : '';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
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

      <div className="text-center max-w-3xl mx-auto mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{title}</h1>
        <p className="text-lg text-slate-600">{description}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-12">
        {children}
      </div>
      
      {infoContent && (
        <div className="prose prose-slate max-w-3xl mx-auto mb-12">
          {infoContent}
        </div>
      )}

      <div className="text-center text-sm text-slate-500 mb-12 max-w-2xl mx-auto">
        <p>🔒 Your files are processed securely. Whenever possible, processing happens directly in your browser and files are not stored permanently.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <AdPlaceholder className="w-full h-64" />
        <AdPlaceholder className="w-full h-64" />
      </div>
    </div>
  );
}
