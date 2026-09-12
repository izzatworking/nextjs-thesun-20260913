import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { GetStaticProps } from 'next';
import Layout from '../../components/layout/Layout';
import Breadcrumb from '../../components/common/Breadcrumb';
import { PDFData } from '@/types/ipaper';
import { WPCategory } from '../../types/wordpress';
import { getCategories } from '../../lib/wordpress';
import styles from '@/styles/IPaper.module.css';

interface Props {
  categories: WPCategory[];
}

// Dynamic import dengan path yang betul
const Flipbook = dynamic(() => import('@/components/ipaper/Flipbook'), {
  ssr: false,
  loading: () => <div className={styles.loading}>Loading flipbook...</div>
});

export default function IPaperPage({ categories }: Props) {
  const [currentPDF, setCurrentPDF] = useState<PDFData | null>(null);
  const [previousPDFs, setPreviousPDFs] = useState<PDFData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pageInfo, setPageInfo] = useState({ current: 1, total: 12 });

  // Load initial data
  useEffect(() => {
    fetchPDFs();
  }, []);

  const fetchPDFs = async () => {
    try {
      // Fetch dari API
      const response = await fetch('/api/ipaper/list');
      const data = await response.json();
      
      if (data.success && Array.isArray(data.pdfs)) {
        setCurrentPDF(data.todayPDF || data.pdfs[0]);
        setPreviousPDFs(data.pdfs);
      }
    } catch (error) {
      console.error('Error fetching PDFs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPDF = (pdf: PDFData) => {
    setCurrentPDF(pdf);
    setPageInfo({ current: 1, total: pdf.pages || 12 });
  };

  const handleDownload = () => {
    if (currentPDF?.fileUrl) {
      window.open(currentPDF.fileUrl, '_blank');
    }
  };

  const handlePageChange = (page: number) => {
    setPageInfo(prev => ({ ...prev, current: page }));
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading theSun iPaper...</p>
      </div>
    );
  }

  return (
    <Layout 
      categories={categories}
      title="theSun iPaper - Digital Newspaper | The Sun Malaysia"
      description="Read theSun newspaper in digital format"
    >
      <Breadcrumb categories={categories} />

      <div className={styles.container}>
        {/* Current Paper Info */}
        <div className={styles.currentPaper}>
          <h1 className={styles.paperTitle}>
            {currentPDF?.title || 'Today\'s Edition'}
          </h1>
          <p className={styles.paperDate}>
            {currentPDF?.date 
              ? new Date(currentPDF.date).toLocaleDateString('en-MY', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })
              : new Date().toLocaleDateString('en-MY', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })
            }
          </p>
        </div>

        {/* Flipbook Section */}
        <div className={styles.flipbookSection}>
          <Flipbook 
            pdf={currentPDF}
            onPageChange={handlePageChange}
          />

          {/* Controls */}
          <div className={styles.controls}>
            <div className={styles.pageControls}>
              <button className={styles.controlBtn} onClick={() => {}}>
                <i className="fas fa-fast-backward"></i>
              </button>
              <button className={styles.controlBtn} onClick={() => {}}>
                <i className="fas fa-chevron-left"></i>
              </button>
              
              <div className={styles.pageInfo}>
                Page {pageInfo.current} of {pageInfo.total}
              </div>
              
              <button className={styles.controlBtn} onClick={() => {}}>
                <i className="fas fa-chevron-right"></i>
              </button>
              <button className={styles.controlBtn} onClick={() => {}}>
                <i className="fas fa-fast-forward"></i>
              </button>
            </div>

            <div className={styles.actionButtons}>
              <button className={styles.actionBtn} onClick={() => {}}>
                <i className="fas fa-search-plus"></i> Zoom In
              </button>
              <button className={styles.actionBtn} onClick={() => {}}>
                <i className="fas fa-search-minus"></i> Zoom Out
              </button>
              <button className={styles.actionBtn} onClick={() => {}}>
                <i className="fas fa-expand"></i> Fullscreen
              </button>
              <button className={styles.actionBtn} onClick={handleDownload}>
                <i className="fas fa-download"></i> Download
              </button>
            </div>
          </div>
        </div>

        {/* Previous PDFs */}
        <div className={styles.previousPDFs}>
          <h2 className={styles.sectionTitle}>
            <i className="fas fa-history"></i> Previous Editions
          </h2>
          
          <div className={styles.pdfsGrid}>
            {previousPDFs.map((pdf, index) => (
              <div 
                key={pdf.id || index}
                className={`${styles.pdfCard} ${currentPDF?.id === pdf.id ? styles.active : ''}`}
                onClick={() => handleSelectPDF(pdf)}
              >
                {index === 0 && <span className={styles.pdfBadge}>TODAY</span>}
                <div className={styles.pdfDate}>
                  {new Date(pdf.date).toLocaleDateString('en-MY', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </div>
                <div className={styles.pdfDay}>
                  {new Date(pdf.date).toLocaleDateString('en-MY', { weekday: 'short' })}
                </div>
                <div className={styles.pdfMeta}>
                  <span><i className="fas fa-file-pdf"></i> {pdf.pages || 12} pages</span>
                  <span>{pdf.size || '2.4 MB'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Include Font Awesome */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const categories = await getCategories();
  return {
    props: {
      categories,
    },
  };
};