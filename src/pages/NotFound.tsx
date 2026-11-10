import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function NotFound() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <Helmet>
        <title>Page Not Found | Quick PDF Tools</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <h1 className="text-4xl font-bold text-slate-900 mb-4">Page not found</h1>
      <p className="text-lg text-slate-600 mb-8">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
