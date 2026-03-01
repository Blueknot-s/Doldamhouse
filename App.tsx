import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Gallery from './pages/Gallery';
import News from './pages/News';
import Contact from './pages/Contact';
import Support from './pages/Support';
import CountryHouse from './pages/CountryHouse';
import StoneWall from './pages/StoneWall';
import BlogBoard from './pages/BlogBoard';

// Admin & Login
import Login from './pages/Login';
import Admin from './pages/Admin';

// Detail Pages
import NewsDetail from './pages/NewsDetail';
import ProjectDetail from './pages/ProjectDetail';

// ─── Error Boundary (생략 - 기존과 동일) ─────────────────────────

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen font-sans text-doldam-dark antialiased">
        <Navigation />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/country-house" element={<CountryHouse />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/support" element={<Support />} />
            <Route path="/stone-wall" element={<StoneWall />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:id" element={<NewsDetail />} />
            
            {/* [중요] 경로 매칭 범위를 넓혀 강제로 블로그를 잡습니다 */}
            <Route path="/blog" element={<BlogBoard />} />
            <Route path="/blog/*" element={<BlogBoard />} />

            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Admin />} />
            
            {/* 정의되지 않은 모든 경로는 홈으로 리다이렉트 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
