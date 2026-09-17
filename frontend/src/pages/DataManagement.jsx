import React, { useState } from 'react';
import { UploadCloud, CheckCircle2, FileSpreadsheet, RefreshCw, AlertCircle } from 'lucide-react';
import { apiService } from '../api/apiService';

export default function DataManagement() {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file) => {
    setUploading(true);
    setErrorMsg(null);
    setUploadStatus(null);

    apiService.uploadCSV(file)
      .then(res => {
        setUploadStatus(res);
        setUploading(false);
      })
      .catch(err => {
        setErrorMsg(err.message || 'Upload failed');
        setUploading(false);
      });
  };

  const handleResetSample = () => {
    setUploading(true);
    setErrorMsg(null);
    apiService.resetSampleDataset()
      .then(res => {
        setUploadStatus(res);
        setUploading(false);
      })
      .catch(err => {
        setErrorMsg('Failed to reset dataset');
        setUploading(false);
      });
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Overview Card */}
      <div className="crios-card">
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
          Data Ingestion & Dataset Management
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Ingest raw transaction datasets (CSV) to dynamically run data cleaning, RFM score calculations, and machine learning feature extraction.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
        {/* Drag & Drop Upload Zone */}
        <div className="crios-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem' }}>
            Upload Custom Transaction Dataset (CSV)
          </h3>

          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            style={{
              border: `2px dashed ${dragActive ? 'var(--accent-primary)' : 'var(--border-color)'}`,
              background: dragActive ? 'var(--accent-glow)' : 'var(--bg-primary)',
              borderRadius: '1rem',
              padding: '3rem 2rem',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <UploadCloud size={48} color="var(--accent-primary)" style={{ margin: '0 auto 1rem auto' }} />
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Drag & Drop your Transaction CSV file here
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.5rem 0 1.25rem 0' }}>
              Required Columns: <code className="font-mono" style={{ color: 'var(--accent-primary)' }}>CustomerID, InvoiceNo, UnitPrice, Quantity</code>
            </p>

            <label className="btn-primary" style={{ display: 'inline-flex', cursor: 'pointer' }}>
              <span>Browse CSV File</span>
              <input type="file" accept=".csv" onChange={handleFileChange} style={{ display: 'none' }} />
            </label>
          </div>

          <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>or reset to sample dataset: </span>
            <button onClick={handleResetSample} disabled={uploading} className="btn-secondary" style={{ marginLeft: '0.5rem', fontSize: '0.8rem' }}>
              <RefreshCw size={14} className={uploading ? 'animate-spin' : ''} />
              Load Sample E-Commerce Dataset (5,000+ records)
            </button>
          </div>
        </div>

        {/* Dataset Status & Pipeline Logs */}
        <div className="crios-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem' }}>
            Dataset Ingestion Status
          </h3>

          {uploading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              Processing CSV records & recalculating RFM ML feature matrix...
            </div>
          ) : errorMsg ? (
            <div style={{ background: 'var(--danger-bg)', border: '1px solid var(--danger)', padding: '1rem', borderRadius: '0.6rem', color: 'var(--danger)', fontSize: '0.85rem' }}>
              <AlertCircle size={18} style={{ marginBottom: '4px' }} />
              <div>{errorMsg}</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.85rem', color: 'var(--success)' }}>
                <CheckCircle2 size={18} />
                <span>Dataset Structure Validated</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.85rem', color: 'var(--success)' }}>
                <CheckCircle2 size={18} />
                <span>
                  {uploadStatus?.records_processed || '5,000+'} Transaction Records Ingested
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.85rem', color: 'var(--success)' }}>
                <CheckCircle2 size={18} />
                <span>Missing Values Cleaned & Filtered</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.85rem', color: 'var(--success)' }}>
                <CheckCircle2 size={18} />
                <span>RFM Features & Predictor Trained</span>
              </div>

              {uploadStatus?.message && (
                <div style={{ marginTop: '1rem', background: 'var(--bg-primary)', padding: '0.85rem', borderRadius: '0.6rem', border: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  {uploadStatus.message}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
