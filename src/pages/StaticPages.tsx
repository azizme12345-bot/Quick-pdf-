import React from 'react';
import Page from './Page';

export function About() {
  return (
    <Page title="About Quick PDF Tools">
      <p className="text-lg text-slate-700 leading-relaxed mb-6">
        Quick PDF Tools is a free online toolkit built for students, job seekers, and office users who need to fix, combine, or prepare PDF documents without installing heavy software.
      </p>
      <p className="text-lg text-slate-700 leading-relaxed mb-6">
        Whether you are merging certificates for a job application, compressing a large assignment for a school portal, or rotating a scanned form, our tools are designed to be fast, simple, and reliable.
      </p>
      <p className="text-lg text-slate-700 leading-relaxed mb-6">
        Every tool runs directly in your web browser. Your files stay on your own device and are never uploaded to a remote server, giving you complete privacy for your personal and work documents.
      </p>
    </Page>
  );
}

export function Contact() {
  return (
    <Page title="Contact">
      <p className="text-lg text-slate-700 leading-relaxed mb-6">
        Have a question, suggestion, or feedback about Quick PDF Tools? We would love to hear from you.
      </p>
      <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
        <p className="text-slate-700 mb-2">
          <strong>Email:</strong>{' '}
          <a href="mailto:support@quick-pdf-tools.ai.studio" className="text-blue-600 hover:underline">
            support@quick-pdf-tools.ai.studio
          </a>
        </p>
        <p className="text-slate-700">We aim to respond to all inquiries within 24–48 hours.</p>
      </div>
    </Page>
  );
}

export function PrivacyPolicy() {
  return (
    <Page title="Privacy Policy">
      <p className="text-lg text-slate-700 leading-relaxed mb-6">Last updated: November 10, 2026</p>
      <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">1. Local Browser Processing</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        All PDF and image files you select on Quick PDF Tools are processed locally inside your own web browser. Your files are not uploaded to, stored on, or shared with any external server.
      </p>
      <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">2. Browser Storage</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        We do not require accounts or logins, and we do not store your documents. Any temporary data created while you use a tool is cleared when you close or refresh the page.
      </p>
      <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">3. Google AdSense and Cookies</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        This site uses Google AdSense to display advertisements. Google and its partners may use cookies to serve ads based on your prior visits to this website or other websites. You can manage your ad preferences through Google Ads Settings.
      </p>
    </Page>
  );
}

export function TermsOfService() {
  return (
    <Page title="Terms of Service">
      <p className="text-lg text-slate-700 leading-relaxed mb-6">Last updated: November 10, 2026</p>
      <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">1. Free Use of Tools</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Quick PDF Tools provides free browser-based utilities for personal, educational, and office use. You may use the tools as needed without registration.
      </p>
      <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">2. Your Responsibility</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        You are solely responsible for the files you process and for keeping backups of your original documents. Do not use the site for any unlawful purpose.
      </p>
      <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">3. Disclaimer</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        The tools are provided "as is" without warranties of any kind. We are not liable for any data loss or damages resulting from the use of this website.
      </p>
    </Page>
  );
}
