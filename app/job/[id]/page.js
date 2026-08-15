'use client';

import { use } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import JobSheetStatic from '@/components/JobSheetStatic';

export default function JobPage({ params }) {
  // In client components, params is a Promise — unwrap with React.use()
  const { id } = use(params);

  return (
    <>
      <Navbar />
      <div style={{
        minHeight: '100vh',
        background: 'var(--bg-soft)',
        paddingTop: 'calc(var(--nav-height) + 48px)',
        paddingBottom: '80px',
      }}>
        <div className="container">
          <div style={{ maxWidth: '580px', margin: '0 auto' }}>
            <JobSheetStatic jobId={id} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
