import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import { About, Contact, PrivacyPolicy, TermsOfService } from './pages/StaticPages';
import { JpgToPdf, ImagesToPdf } from './pages/ImagesToPdfTools';
import { PdfToJpg, PdfToPng } from './pages/PdfToImagesTools';
import MergePdf from './pages/MergePdf';
import SplitPdf from './pages/SplitPdf';
import CompressPdf from './pages/CompressPdf';
import RotatePdf from './pages/RotatePdf';
import PdfToText from './pages/PdfToText';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        
        {/* Tool Routes */}
        <Route path="jpg-to-pdf" element={<JpgToPdf />} />
        <Route path="images-to-pdf" element={<ImagesToPdf />} />
        <Route path="pdf-to-jpg" element={<PdfToJpg />} />
        <Route path="pdf-to-png" element={<PdfToPng />} />
        <Route path="merge-pdf" element={<MergePdf />} />
        <Route path="split-pdf" element={<SplitPdf />} />
        <Route path="compress-pdf" element={<CompressPdf />} />
        <Route path="rotate-pdf" element={<RotatePdf />} />
        <Route path="pdf-to-text" element={<PdfToText />} />

        {/* Static Pages */}
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="terms-of-service" element={<TermsOfService />} />

        {/* Catch-all 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
