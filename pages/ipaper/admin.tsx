import { useState, useEffect, useRef, ChangeEvent, DragEvent } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import Layout from '../../components/layout/Layout';
import Breadcrumb from '../../components/common/Breadcrumb';
import { PDFData } from '@/types/ipaper';
import { WPCategory } from '../../types/wordpress';
import { getCategories } from '../../lib/wordpress';
import styles from '@/styles/IPaperAdmin.module.css';

interface Props {
  categories: WPCategory[];
}
interface UploadStatus {
  type: 'success' | 'error' | 'info';
  message: string;
}

export default function IPaperAdminPage({ categories }: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [pdfs, setPDFs] = useState<PDFData[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedPDF, setSelectedPDF] = useState<PDFData | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus | null>(null);
  
  // Set today's date as default
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
    fetchPDFs(today);
  }, []);

  const fetchPDFs = async (date: string) => {
    try {
      const response = await fetch(`/api/ipaper/list?date=${date}`);
      const data = await response.json();
      
      if (data.success && Array.isArray(data.pdfs)) {
        setPDFs(data.pdfs);
        if (data.pdfs.length > 0) {
          setSelectedPDF(data.pdfs[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching PDFs:', error);
    }
  };

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setSelectedDate(date);
    fetchPDFs(date);
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      uploadPDF(file);
    } else {
      setUploadStatus({
        type: 'error',
        message: 'Please select a PDF file'
      });
    }
  };

  const uploadPDF = async (file: File) => {
  setUploading(true);
  setUploadStatus({
    type: 'info',
    message: 'Uploading...'
  });
  
  const formData = new FormData();
  formData.append('pdf', file);
  formData.append('date', selectedDate);
  formData.append('title', `theSun Edition - ${selectedDate}`);
  
  try {
    const response = await fetch('/api/ipaper/upload', {
      method: 'POST',
      body: formData,
      // Note: Don't set Content-Type header for FormData
    });
    
    const data = await response.json();
    
    if (data.success) {
      setUploadStatus({
        type: 'success',
        message: 'PDF uploaded successfully!'
      });
      
      // Refresh the PDF list
      fetchPDFs(selectedDate);
      
      // Auto-select the new PDF
      setSelectedPDF(data.pdf);
      
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } else {
      setUploadStatus({
        type: 'error',
        message: data.message || 'Upload failed'
      });
    }
  } catch (error) {
    setUploadStatus({
      type: 'error',
      message: 'Upload failed. Please try again.'
    });
    console.error('Upload error:', error);
  } finally {
    setUploading(false);
  }
};
  const handleDeletePDF = async () => {
    if (!selectedPDF || !confirm('Are you sure you want to delete this PDF?')) return;
    
    try {
      const response = await fetch('/api/ipaper/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedPDF.id, date: selectedPDF.date }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('PDF deleted successfully');
        fetchPDFs(selectedDate);
        setSelectedPDF(null);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete PDF');
    }
  };

  const handleViewAsUser = () => {
    if (selectedPDF) {
      router.push(`/ipaper?pdf=${selectedPDF.id}`);
    }
  };

  return (
    <Layout 
      categories={categories}
      title="theSun iPaper Admin | The Sun Malaysia"
      description="Admin panel for theSun iPaper"
    >
      <Breadcrumb categories={categories} />

      <div className={styles.adminContainer}>
        {/* Header */}
        <div className={styles.header}>
          <h1><i className="fas fa-user-shield"></i> iPaper Admin</h1>
          <p>Manage daily newspaper PDFs</p>
        </div>

        <div className={styles.mainContent}>
          {/* Sidebar */}
          <div className={styles.sidebar}>
            <div className={styles.dateSelector}>
              <h3><i className="fas fa-calendar-alt"></i> Select Date</h3>
              <input 
                type="date" 
                value={selectedDate}
                onChange={handleDateChange}
                className={styles.dateInput}
              />
              
              <div className={styles.quickDates}>
                <button onClick={() => {
                  const today = new Date().toISOString().split('T')[0];
                  setSelectedDate(today);
                  fetchPDFs(today);
                }}>
                  Today
                </button>
                <button onClick={() => {
                  const yesterday = new Date();
                  yesterday.setDate(yesterday.getDate() - 1);
                  const dateStr = yesterday.toISOString().split('T')[0];
                  setSelectedDate(dateStr);
                  fetchPDFs(dateStr);
                }}>
                  Yesterday
                </button>
              </div>
            </div>

            {/* PDF List */}
            <div className={styles.pdfList}>
              <h3>PDFs for {selectedDate}</h3>
              <div className={styles.pdfItems}>
                {pdfs.length > 0 ? (
                  pdfs.map((pdf, index) => (
                    <div 
                      key={pdf.id || index}
                      className={`${styles.pdfItem} ${selectedPDF?.id === pdf.id ? styles.active : ''}`}
                      onClick={() => setSelectedPDF(pdf)}
                    >
                      <div className={styles.pdfInfo}>
                        <h4>{pdf.title}</h4>
                        <div className={styles.pdfMeta}>
                          <span><i className="far fa-file"></i> {pdf.size || 'N/A'}</span>
                          <span><i className="far fa-calendar"></i> {pdf.date}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={styles.noPDFs}>
                    <i className="far fa-file-pdf"></i>
                    <p>No PDFs for this date</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Area */}
          <div className={styles.mainArea}>
            {/* Preview Section */}
            <div className={styles.previewSection}>
              <div className={styles.previewHeader}>
                <div>
                  <h2>{selectedPDF?.title || 'Select a PDF'}</h2>
                  <div className={styles.previewMeta}>
                    {selectedPDF && (
                      <>
                        <span><i className="far fa-calendar"></i> {selectedPDF.date}</span>
                        <span><i className="far fa-file"></i> {selectedPDF.size}</span>
                        <span><i className="far fa-copy"></i> {selectedPDF.pages || '?'} pages</span>
                      </>
                    )}
                  </div>
                </div>
                
                <div className={styles.previewActions}>
                  <button 
                    className={styles.actionBtn}
                    onClick={handleViewAsUser}
                    disabled={!selectedPDF}
                  >
                    <i className="fas fa-eye"></i> View as User
                  </button>
                  <button 
                    className={styles.actionBtn}
                    onClick={() => {
                      if (selectedPDF?.fileUrl) {
                        window.open(selectedPDF.fileUrl, '_blank');
                      }
                    }}
                    disabled={!selectedPDF}
                  >
                    <i className="fas fa-download"></i> Download
                  </button>
                  <button 
                    className={styles.deleteBtn}
                    onClick={handleDeletePDF}
                    disabled={!selectedPDF}
                  >
                    <i className="fas fa-trash"></i> Delete
                  </button>
                </div>
              </div>

              {/* Preview Content */}
              <div className={styles.previewContent}>
                {selectedPDF ? (
                  <iframe 
                    src={`${selectedPDF.fileUrl}#toolbar=0&navpanes=0`}
                    className={styles.pdfPreview}
                    title="PDF Preview"
                  />
                ) : (
                  <div className={styles.noPreview}>
                    <i className="far fa-file-pdf"></i>
                    <h3>No PDF Selected</h3>
                    <p>Select a PDF from the list to preview</p>
                  </div>
                )}
              </div>
            </div>

            {/* Upload Section */}
            <div className={styles.uploadSection}>
              <h3><i className="fas fa-cloud-upload-alt"></i> Upload New PDF</h3>
              
              <div 
                className={styles.uploadArea}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e: DragEvent<HTMLDivElement>) => {
                  e.preventDefault();
                  e.currentTarget.classList.add(styles.dragover);
                }}
                onDragLeave={(e: DragEvent<HTMLDivElement>) => {
                  e.currentTarget.classList.remove(styles.dragover);
                }}
                onDrop={(e: DragEvent<HTMLDivElement>) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove(styles.dragover);
                  if (e.dataTransfer.files[0]) {
                    uploadPDF(e.dataTransfer.files[0]);
                  }
                }}
              >
                <div className={styles.uploadIcon}>
                  <i className="fas fa-file-upload"></i>
                </div>
                <div className={styles.uploadInfo}>
                  <h4>Drag & Drop PDF File</h4>
                  <p>or click to browse (Max 50MB)</p>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".pdf"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                  disabled={uploading}
                />
                <button 
                  className={styles.uploadButton}
                  disabled={uploading}
                >
                  {uploading ? 'Uploading...' : 'Browse Files'}
                </button>
              </div>
              
              {uploadStatus && (
                <div className={`${styles.uploadStatus} ${styles[uploadStatus.type]}`}>
                  {uploadStatus.message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Include Font Awesome */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=300, stale-while-revalidate=600'
  );
  const categories = await getCategories();
  return {
    props: {
      categories,
    },
  };
};