import React, { Suspense } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import { Phone } from 'lucide-react';

// Lazy load pages for performance
const Home = React.lazy(() => import('./pages/Home'));
const About = React.lazy(() => import('./pages/About'));
const Projects = React.lazy(() => import('./pages/Projects'));
const Gallery = React.lazy(() => import('./pages/Gallery'));
const News = React.lazy(() => import('./pages/News'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Support = React.lazy(() => import('./pages/Support'));
const CountryHouse = React.lazy(() => import('./pages/CountryHouse'));
const StoneWall = React.lazy(() => import('./pages/StoneWall'));
const Login = React.lazy(() => import('./pages/Login'));
const Admin = React.lazy(() => import('./pages/Admin'));
const NewsDetail = React.lazy(() => import('./pages/NewsDetail'));
const ProjectDetail = React.lazy(() => import('./pages/ProjectDetail'));

// Scroll to top component
const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const FloatingContact = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      <a 
        href="tel:064-772-3697" 
        className="w-14 h-14 bg-doldam-dark text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-doldam-accent hover:scale-110 transition-all duration-300 group"
        aria-label="전화상담"
      >
        <Phone size={24} className="group-hover:animate-pulse" />
      </a>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <Helmet>
        <title>Doldam House | 제주 돌담하우스</title>
        <meta name="description" content="제주스러움을 고집하는 전문 기업 돌담하우스. 전원주택, 농촌주택개량, 돌담시공 전문." />
        <meta property="og:title" content="Doldam House | 제주 돌담하우스" />
        <meta property="og:description" content="제주스러움을 고집하는 전문 기업 돌담하우스. 전원주택, 농촌주택개량, 돌담시공 전문." />
        <meta property="og:type" content="website" />
      </Helmet>
      <Router>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen font-sans text-doldam-dark antialiased selection:bg-doldam-accent selection:text-white">
          <Navigation />
          <main className="flex-grow">
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-black"><div className="w-8 h-8 border-2 border-doldam-accent border-t-transparent rounded-full animate-spin"></div></div>}>
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

                {/* Admin Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
          <FloatingContact />
        </div>
      </Router>
    </HelmetProvider>
  );
};

export default App;