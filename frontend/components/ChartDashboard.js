"use client";
import React from 'react';
import dynamic from 'next/dynamic';
import { RefreshCcw, Download } from 'lucide-react';

// Plotly needs to be rendered client-side only
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false, loading: () => <p>Loading chart...</p> });

export default function ChartDashboard({ data, onReset }) {
  if (!data) return null;

  const { filename, summary, columns, charts } = data;

  const handleExport = (chartData, index) => {
    // Generate a simple HTML export with plotly.js injection
    const targetDiv = "chart-" + index;
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>${chartData.title}</title>
          <script src="https://cdn.plot.ly/plotly-3.5.0.min.js"></script>
          <style>
             body { margin:0; padding:20px; font-family: sans-serif; background-color: #f3f4f6; }
             .container { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 1000px; margin: 0 auto; }
          </style>
        </head>
        <body>
          <div class="container">
             <h2 style="margin-top:0;">${chartData.title}</h2>
             <p style="color: #666;">${chartData.explanation}</p>
             <div id="${targetDiv}" style="width: 100%; height: 75vh;"></div>
          </div>
          <script>
            var plotData = ${JSON.stringify(chartData.plotly_data.data)};
            var plotLayout = ${JSON.stringify(chartData.plotly_data.layout)};
            plotLayout.autosize = true;
            Plotly.newPlot('${targetDiv}', plotData, plotLayout, {responsive: true});
          </script>
        </body>
      </html>
    `;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${chartData.title.replace(/\s+/g, '_')}_export.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="glass-panel" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Analysis Results: {filename}</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            Rows: {summary.original_rows} • Columns: {summary.columns} 
            {summary.dropped_na_rows > 0 && ` • Cleaned: ${summary.dropped_na_rows} rows missing data`}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {Object.entries(columns).slice(0, 7).map(([col, type]) => (
                 <span key={col} className="badge">{col}: {type}</span>
            ))}
            {Object.keys(columns).length > 7 && <span className="badge">...</span>}
          </div>
        </div>
        <button className="btn" onClick={onReset}>
          <RefreshCcw size={18} /> Upload Another
        </button>
      </div>

      <div className="grid-charts">
        {charts && charts.length > 0 ? charts.map((chart, idx) => (
          <div key={idx} className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>{chart.title}</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem', flexGrow: 1 }}>
              {chart.explanation}
            </p>
            <div style={{ background: 'rgba(255, 255, 255, 0.4)', borderRadius: '12px', padding: '0.5rem', overflow: 'hidden' }}>
              <Plot
                data={chart.plotly_data.data}
                layout={{ ...chart.plotly_data.layout, autosize: true, margin: { l:40, r:20, t:20, b:40 } }}
                config={{ responsive: true, displayModeBar: false }}
                style={{ width: "100%", height: "300px" }}
                useResizeHandler={true}
              />
            </div>
            <div style={{ marginTop: '1rem', textAlign: 'right' }}>
               <button className="btn" onClick={() => handleExport(chart, idx)} style={{ fontSize: '0.875rem', padding: '0.4rem 1rem' }}>
                 <Download size={16} /> Export Interactive
               </button>
            </div>
          </div>
        )) : (
           <div className="glass-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>No ideal charts found</h3>
              <p style={{ color: 'var(--text-secondary)' }}>We couldn't determine the best visualization for this data structure automatically.</p>
           </div>
        )}
      </div>
    </div>
  );
}
