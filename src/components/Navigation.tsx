import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// [수정] 상대 경로를 더욱 명확히 표기합니다.
import Navigation from './components/Navigation.tsx';
import Footer from './components/Footer.tsx';
import Home from './pages/Home.tsx';
import About from './pages/About.tsx';
import Projects from './pages/Projects.tsx';
import Gallery from './pages/Gallery.tsx';
import News from './pages/News.tsx';
import Contact from './pages/Contact.tsx';
import Support from './pages/Support.tsx';
import CountryHouse from './pages/CountryHouse.tsx';
import StoneWall from './pages/StoneWall.tsx';

import Login from './pages/Login.tsx';
import Admin from './pages/Admin.tsx';
import NewsDetail from './pages/NewsDetail.tsx';
import ProjectDetail from './pages/ProjectDetail.tsx';

// ... (ErrorBoundary 및 ScrollToTop 로직은 이전과 동일)

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Navigation />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/news" element={<News />} />
            {/* BlogBoard 관련 코드는 로그에서 에러의 주범이므로 반드시 제거 상태를 유지하세요. */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};
export default App;
