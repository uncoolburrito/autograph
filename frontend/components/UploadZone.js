"use client";
import React, { useCallback, useState } from 'react';
import { UploadCloud } from 'lucide-react';

export default function UploadZone({ onUpload }) {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragActive(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onUpload(e.dataTransfer.files[0]);
    }
  }, [onUpload]);

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(e.target.files[0]);
    }
  };

  return (
    <div 
      className={`glass-panel upload-zone ${isDragActive ? 'drag-active' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <UploadCloud size={60} className="upload-icon" />
      <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Drag & Drop your dataset here</h2>
      <p style={{ color: 'var(--text-secondary)', margin: '1rem 0' }}>Supports .csv, .xlsx, and .json</p>
      
      <input 
        type="file" 
        id="fileInput" 
        style={{ display: 'none' }} 
        accept=".csv, .xlsx, .json"
        onChange={handleChange}
      />
      <label htmlFor="fileInput" className="btn" style={{ marginTop: '0.5rem' }}>
        Browse Files
      </label>
    </div>
  );
}
