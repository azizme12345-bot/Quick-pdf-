import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SITE_URL } from '../config/site';

interface PageProps {
  title: string;
  children: React.ReactNode;
}

export default function Page({ title, children }: PageProps) {
  const canonicalUrl = typeof window !== 'undefined' ? SITE_URL + window.location.pathname : '';
  const seoTitle = `${title} | Quick PDF Tools`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="robots" content="index, follow" />
        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
        
        {/* Dynamic OG Tags */}
        <meta property="og:title" content={seoTitle} />
        {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
        <meta property="og:type" content="website" />
        
        {/* Dynamic Twitter Tags */}
        <meta name="twitter:title" content={seoTitle} />
      </Helmet>
      <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">{title}</h1>
      <div className="prose prose-slate prose-blue max-w-none">
        {children}
      </div>
    </div>
  );
}
