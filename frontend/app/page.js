"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { BarChart3 } from 'lucide-react';
import UploadZone from '../components/UploadZone';
import ChartDashboard from '../components/ChartDashboard';

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (file) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await fetch('http://127.0.0.1:8000/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!res.ok) {
        throw new Error("Failed to process file");
      }
      
      const result = await res.json();
      setData(result);
    } catch (error) {
      alert("Error: " + error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setData(null);
  };

  return (
    <div className="layout-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <BarChart3 size={40} color="#e94057" />
          <h1 className="title" style={{ margin: 0 }}>AutoGraph</h1>
        </div>
        <p className="subtitle" style={{ marginBottom: '1.5rem' }}>
          Upload your data and instantly get meaningful visualizations.
        </p>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '650px', margin: '0 auto', fontSize: '0.95rem', lineHeight: '1.6' }}>
          AutoGraph is an intelligent workflow tool designed to bridge the gap between raw datasets and actionable insights. Our charting engine automatically parses column types and determines the highest-value data relationships to create automated, ready-to-share interactive visualizations.
        </p>
      </header>

      <main style={{ flexGrow: 1 }}>
        {!data && !loading && (
          <UploadZone onUpload={handleUpload} />
        )}
        
        {loading && (
          <div className="glass-panel" style={{ textAlign: 'center' }}>
            <div className="spinner"></div>
            <p>Analyzing context, extracting relationships, and generating ideal charts...</p>
          </div>
        )}

        {data && !loading && (
          <ChartDashboard data={data} onReset={handleReset} />
        )}
      </main>

      <footer style={{ textAlign: 'center', marginTop: '4rem', padding: '2rem 0', color: 'var(--text-secondary)' }}>
        <p>Built with love by sutapa ❤️</p>
      </footer>
    </div>
  );
}
