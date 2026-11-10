import React, { useCallback } from 'react';
import { useDropzone, Accept } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  accept?: Accept;
  multiple?: boolean;
  title?: string;
  subtitle?: string;
}

export default function FileUpload({ 
  onFilesSelected, 
  accept, 
  multiple = false,
  title = "Drop your file here or Choose File",
  subtitle = "Supported formats will be processed securely in your browser"
}: FileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFilesSelected(acceptedFiles);
    }
  }, [onFilesSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple
  } as any);

  return (
    <div 
      {...getRootProps()} 
      className={`p-10 border-2 border-dashed rounded-xl text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'}`}
    >
      <input {...getInputProps()} />
      <UploadCloud className="mx-auto h-16 w-16 text-blue-500 mb-4" />
      <h3 className="text-xl font-semibold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-500 mb-6">{subtitle}</p>
      <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors shadow-sm">
        Choose {multiple ? 'Files' : 'File'}
      </button>
    </div>
  );
}
