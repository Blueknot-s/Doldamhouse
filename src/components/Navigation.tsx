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

  // 페이지 이동 시 메뉴 닫기
  useEffect(() => {
    setIsOpen(false);
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

  // [보정] HashRouter 환경에서 현재 경로가 활성화되었는지 확인하는 함수
  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const toggleMobileSubmenu = (name: string) => {
    setMobileSubmenuOpen(mobileSubmenuOpen === name ? null : name);
  };

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 w-full z-[300] border-b transition-all duration-500 ${
          isOpen 
            ? 'bg-white border-gray-100 text-black py-4' 
            : (scrolled || !isHome)
              ? 'bg-white/95 backdrop-blur-md border-gray-100 py-3 text-black shadow-sm' 
              : 'bg-black/20 backdrop-blur-sm border-white/10 py-5 text-white' 
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-black tracking-tighter flex items-center group relative z-[310]">
            <span className="transition-transform group-hover:text-doldam-accent duration-300">Doldam</span>
            <span className="text-doldam-accent mx-0.5">.</span>
            <span className="transition-transform group-hover:text-doldam-accent duration-300">House</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-
