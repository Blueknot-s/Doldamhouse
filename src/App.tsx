import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// [수정] 모든 import 경로에 .tsx 확장자를 붙여 경로를 명확히 합니다.
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

// Scroll to top component
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
      <div className="flex flex-col min-h-screen">
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
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Admin />} />
            {/* BlogBoard 관련 코드는 로그에서 에러의 주범이므로 제거 상태를 유지합니다. */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
