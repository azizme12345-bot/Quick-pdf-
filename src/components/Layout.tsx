import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Menu, X, FileText } from 'lucide-react';

const AdPlaceholder = ({ className = '' }: { className?: string }) => (
  <div className={`bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center text-slate-400 text-sm font-medium ${className}`}>
    Advertisement
  </div>
);

export default function Layout() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <FileText className="h-8 w-8 text-blue-600" />
                <span className="font-bold text-xl text-slate-900 tracking-tight">Quick PDF Tools</span>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Home</Link>
              <Link to="/" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">PDF Tools</Link>
              <Link to="/about" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">About</Link>
            </nav>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-slate-500 hover:text-slate-700 p-2"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 py-2">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link onClick={() => setIsMenuOpen(false)} to="/" className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-md">Home</Link>
              <Link onClick={() => setIsMenuOpen(false)} to="/" className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-md">PDF Tools</Link>
              <Link onClick={() => setIsMenuOpen(false)} to="/about" className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-md">About</Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <FileText className="h-6 w-6 text-blue-400" />
                <span className="font-bold text-lg text-white">Quick PDF Tools</span>
              </Link>
              <p className="text-slate-400 max-w-sm">
                Fast, Free & Simple PDF Tools. Convert, merge, split, compress and manage your PDF files quickly and easily directly in your browser.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Tools</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/merge-pdf" className="hover:text-white transition-colors">Merge PDF</Link></li>
                <li><Link to="/split-pdf" className="hover:text-white transition-colors">Split PDF</Link></li>
                <li><Link to="/compress-pdf" className="hover:text-white transition-colors">Compress PDF</Link></li>
                <li><Link to="/images-to-pdf" className="hover:text-white transition-colors">Images to PDF</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
            <p>&copy; {new Date().getFullYear()} Quick PDF Tools. All rights reserved.</p>
            <p className="mt-2 md:mt-0">Processed securely in your browser.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export { AdPlaceholder };
