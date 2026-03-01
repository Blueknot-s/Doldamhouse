import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Phone } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface NavItem {
  name: string;
  path: string;
  children?: { name: string; path: string }[];
}

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState<string | null>(null);
  const location = useLocation();

  // 스크롤 감지 및 배경 전환
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 모바일 메뉴 열림/닫힘 시 바디 스크롤 제어
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // 페이지 이동 시 메뉴 닫기 및 스크롤 상단 이동
  useEffect(() => {
    setIsOpen(false);
    window.scrollTo(0, 0);
  }, [location]);

  const navLinks: NavItem[] = [
    { name: 'About', path: '/about' },
    { 
      name: 'Projects', 
      path: '/projects',
      children: [
        { name: '전원주택', path: '/country-house' },
        { name: '농촌주택개량', path: '/support' },
        { name: '돌담시공', path: '/stone-wall' },
        { name: '시공사례', path: '/projects' },
      ]
    },
    { name: 'Gallery', path: '/gallery' },
    { name: 'News', path: '/news' },
    { name: 'Blog', path: '/blog' },
  ];

  const isHome = location.pathname === '/';

  const toggleMobileSubmenu = (name: string) => {
    setMobileSubmenuOpen(mobileSubmenuOpen === name ? null : name);
  };

  return (
    <>
      {/* 
        Fixed Navigation Header 
        - Always fixed at the top
        - Higher z-index than the menu overlay to keep logo/toggle visible
      */}
      <nav 
        className={`fixed top-0 left-0 w-full z-[300] border-b transition-all duration-500 ${
          isOpen 
            ? 'bg-white border-gray-100 text-black py-4' // Menu open state
            : (scrolled || !isHome)
              ? 'bg-white/95 backdrop-blur-md border-gray-100 py-3 text-black shadow-sm' // Scrolled/Non-home state
              : 'bg-black/20 backdrop-blur-sm border-white/10 py-5 text-white' // Hero state
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-black tracking-tighter flex items-center group relative z-[310]">
            <span className="transition-transform group-hover:text-doldam-accent duration-300">Doldam</span>
            <span className="text-doldam-accent mx-0.5">.</span>
            <span className="transition-transform group-hover:text-doldam-accent duration-300">House</span>
          </Link>

          {/* Desktop Menu (Horizontally Aligned) */}
          <div className="hidden lg:flex items-center space-x-12">
            {navLinks.map((link) => (
              <div key={link.name} className="relative group h-full flex items-center">
                <Link
                  to={link.path}
                  className={`text-[11px] font-bold hover:text-doldam-accent transition-all tracking-[0.2em] uppercase flex items-center gap-1.5 ${
                    location.pathname.startsWith(link.path) && link.path !== '/' ? 'text-doldam-accent' : ''
                  }`}
                >
                  {link.name}
                  {link.children && <ChevronDown size={10} className="group-hover:rotate-180 transition-transform duration-300" />}
                </Link>

                {link.children && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-52 bg-white shadow-2xl border-t-2 border-doldam-accent opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-4 group-hover:translate-y-2 rounded-b-sm">
                    <div className="py-3">
                      {link.children.map((child) => (
                        <Link
                          key={child.name}
                          to={child.path}
                          className="block px-7 py-3 text-[10px] font-bold text-gray-500 hover:text-white hover:bg-black transition-all uppercase tracking-widest"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            <Link 
              to="/contact" 
              className="flex items-center gap-2 bg-doldam-accent text-white px-7 py-3 rounded-sm text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-black hover:scale-105 transition-all shadow-lg"
            >
              <Phone size={14} />
              무료상담신청
            </Link>
          </div>

          {/* Mobile Toggle Button */}
          <button 
            className="lg:hidden p-2 relative z-[310] transition-colors" 
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={32} className="text-black" /> : <Menu size={32} />}
          </button>
        </div>
      </nav>

      {/* 
        Mobile Menu Full-screen Overlay 
        - Fixed inset-0 covers everything
        - Sits just below the header z-index (z-200)
        - Content is padded top to appear "under" the fixed header
      */}
      <div 
        className={`fixed inset-0 bg-white text-black z-[250] flex flex-col transition-all duration-500 ease-in-out lg:hidden ${
          isOpen ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col h-full pt-28 pb-10 px-10 overflow-y-auto">
          <div className="flex flex-col space-y-7 mb-10">
            {navLinks.map((link) => (
              <div key={link.name} className="w-full">
                <div className="flex justify-between items-center w-full">
                  <Link 
                    to={link.path} 
                    className="text-3xl font-black hover:text-doldam-accent tracking-tighter transition-colors"
                    onClick={() => !link.children && setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                  {link.children && (
                    <button 
                      onClick={() => toggleMobileSubmenu(link.name)} 
                      className="p-3 bg-gray-50 rounded-full active:bg-gray-100 transition-colors"
                    >
                      <ChevronDown size={22} className={`transition-transform duration-300 ${mobileSubmenuOpen === link.name ? 'rotate-180' : ''}`} />
                    </button>
                  )}
                </div>
                
                {link.children && (
                  <div className={`overflow-hidden transition-all duration-500 ${mobileSubmenuOpen === link.name ? 'max-h-80 mt-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="flex flex-col space-y-5 pl-5 border-l-4 border-doldam-accent/20">
                      {link.children.map((child) => (
                        <Link 
                          key={child.name} 
                          to={child.path} 
                          className="text-base font-bold text-gray-400 hover:text-doldam-accent uppercase tracking-widest transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-auto pt-8 border-t border-gray-100">
            <Link 
              to="/contact" 
              onClick={() => setIsOpen(false)}
              className="bg-doldam-accent text-white w-full py-5 text-center font-black rounded-sm shadow-xl uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 active:scale-95 transition-transform"
            >
              <Phone size={18} />
              무료상담신청
            </Link>
            
            <div className="mt-8 flex justify-center gap-6">
               <a href="#" className="text-gray-300 hover:text-doldam-accent transition-colors">
                  <span className="text-[10px] font-bold uppercase tracking-widest">Instagram</span>
               </a>
               <a href="#" className="text-gray-300 hover:text-doldam-accent transition-colors">
                  <span className="text-[10px] font-bold uppercase tracking-widest">Blog</span>
               </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;
