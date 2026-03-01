// App.tsx 수정 (복구본)
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
// ... 기존 import 유지
import News from './pages/News';
import Projects from './pages/Projects';
// BlogBoard 관련 import는 삭제하세요.

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen font-sans text-doldam-dark antialiased">
        <Navigation />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/news" element={<News />} />
            <Route path="/projects" element={<Projects />} />
            {/* Blog 관련 Route는 삭제하고 기존 뉴스/프로젝트 경로만 유지합니다. */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};
