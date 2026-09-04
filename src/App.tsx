import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { ReportProvider } from './context/ReportContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Browse } from './pages/Browse';
import { ItemDetails } from './pages/ItemDetails';
import { ReportForm } from './pages/ReportForm';
import { MyReports } from './pages/MyReports';
import { Admin } from './pages/Admin';

// Scroll to top helper component
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export default function App() {
  return (
    <ReportProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-[#E8EEF5] text-slate-800 selection:bg-indigo-200 selection:text-indigo-900 font-sans antialiased relative overflow-x-hidden">
          {/* Ambient blurred orbs for Frosted Glass theme */}
          <div className="fixed top-[-120px] left-[-120px] w-[520px] h-[520px] bg-blue-300 rounded-full blur-[140px] opacity-40 pointer-events-none -z-10" />
          <div className="fixed bottom-[-120px] right-[-120px] w-[620px] h-[620px] bg-indigo-400 rounded-full blur-[160px] opacity-30 pointer-events-none -z-10" />
          <div className="fixed top-[45%] right-[15%] w-[420px] h-[420px] bg-purple-300/30 rounded-full blur-[140px] opacity-25 pointer-events-none -z-10" />

          <Navbar />
          <main className="flex-1 z-10">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/item/:id" element={<ItemDetails />} />
              <Route path="/report" element={<ReportForm />} />
              <Route path="/my-reports" element={<MyReports />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </ReportProvider>
  );
}
