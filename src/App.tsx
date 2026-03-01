import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// [수정] 모든 import 경로에 .tsx를 명시하여 Vercel의 경로 탐색 오류를 방지합니다.
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

// ─── Error Boundary ────────────────────────────────────────────
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) return <div className="p-8 text-center"><h2>오류가 발생했습니다.</h2></div>;
    return this.props.children;
  }
}

// Scroll to top component
const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
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
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<ErrorBoundary><Admin /></ErrorBoundary>} />
            {/* Blog 관련 모든 호출이 제거되었습니다. */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
