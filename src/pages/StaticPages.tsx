import React from 'react';
import Page from './Page';

export function About() {
  return (
    <Page title="About Us">
      <p className="text-lg text-slate-700 leading-relaxed mb-6">
        Welcome to Quick PDF Tools, your number one source for all things PDF. We're dedicated to giving you the very best of online PDF utilities, with a focus on speed, privacy, and simplicity.
      </p>
      <p className="text-lg text-slate-700 leading-relaxed mb-6">
        Founded with the mission to make document management accessible to everyone, Quick PDF Tools offers a suite of free, browser-based tools. Because our tools process your files directly in your web browser whenever technically possible, you don't have to worry about your sensitive documents being stored on external servers.
      </p>
      <p className="text-lg text-slate-700 leading-relaxed mb-6">
        We hope you enjoy our products as much as we enjoy offering them to you. If you have any questions or comments, please don't hesitate to contact us.
      </p>
    </Page>
  );
}

export function Contact() {
  return (
    <Page title="Contact Us">
      <p className="text-lg text-slate-700 leading-relaxed mb-6">
        Have a question or need assistance? We'd love to hear from you.
      </p>
      <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
        <p className="text-slate-700 mb-2"><strong>Email:</strong> support@quick-pdf-tools.ai.studio</p>
        <p className="text-slate-700">We aim to respond to all inquiries within 24-48 hours.</p>
      </div>
    </Page>
  );
}

export function PrivacyPolicy() {
  return (
    <Page title="Privacy Policy">
      <p className="text-lg text-slate-700 leading-relaxed mb-6">Last updated: {new Date().toLocaleDateString()}</p>
      <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">1. Information We Collect</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        We process your files directly in your web browser. This means that your files (PDFs, images) are not uploaded to our servers for processing. All modifications happen locally on your device.
      </p>
      <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">2. Usage Data</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        We may collect information on how the Service is accessed and used. This Usage Data may include information such as your computer's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers and other diagnostic data.
      </p>
      <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">3. Advertising</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        We may use third-party Service Providers to show advertisements to you to help support and maintain our Service.
      </p>
    </Page>
  );
}

export function TermsOfService() {
  return (
    <Page title="Terms of Service">
      <p className="text-lg text-slate-700 leading-relaxed mb-6">Last updated: {new Date().toLocaleDateString()}</p>
      <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">1. Acceptance of Terms</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        By accessing this website, you are agreeing to be bound by these website Terms and Conditions of Use, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.
      </p>
      <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">2. Use License</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Permission is granted to temporarily use the materials (information or software) on Quick PDF Tools's website for personal, non-commercial transitory viewing only.
      </p>
      <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">3. Disclaimer</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        The materials on Quick PDF Tools's website are provided "as is". Quick PDF Tools makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties, including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
      </p>
    </Page>
  );
}
