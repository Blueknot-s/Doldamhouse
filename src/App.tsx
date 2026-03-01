import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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

// ─── Error Boundary ────────────────────────────────────────────
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#333' }}>
          <h2>페이지를 불러오는 중 오류가 발생했습니다.</h2>
          <p style={{ color: '#999', fontSize: '0.8rem' }}>{this.state.error?.message}</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{ marginTop: '1rem', padding: '0.5rem 1.5rem', cursor: 'pointer' }}
          >
            다시 시도
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

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
      <div className="flex flex-col min-h-screen font-sans text-doldam-dark antialiased selection:bg-doldam-accent selection:text-white">
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
            
            {/* 이제 /blog 경로가 깔끔하게 매칭됩니다 */}
            <Route path="/blog" element={<BlogBoard />} />

            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<ErrorBoundary><Admin /></ErrorBoundary>} />
            
            {/* 404 방지를 위해 모든 정의되지 않은 경로는 홈으로 보냅니다 */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
