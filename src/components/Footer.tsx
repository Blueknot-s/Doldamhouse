import React from 'react';
import { Instagram, BookOpen, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-doldam-dark text-white pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-4xl font-bold tracking-tighter mb-6">Doldam<span className="text-doldam-accent">.</span>House</h2>
            <p className="text-gray-400 max-w-sm leading-relaxed">
              제주스러움을 고집하는 전문 기업 돌담하우스.<br/>
              제주특별자치도 제주시 한경면 고산로8길 4-101
            </p>
          </div>
          <div className="flex flex-col md:items-end justify-start">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">Contact Us</h3>
            <p className="text-2xl font-light hover:text-doldam-accent transition-colors mb-2">
              <a href="tel:064-772-3697">064-772-3697</a>
            </p>
            <p className="text-lg text-gray-400">
              <a href="mailto:kangh_7@naver.com">kangh_7@naver.com</a>
            </p>
            <div className="mt-8">
               <span className="text-xs text-gray-600 border border-gray-600 px-3 py-1 rounded-full cursor-pointer hover:border-doldam-accent hover:text-doldam-accent transition-colors">
                개인정보보호정책
               </span>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <p>© Copyright 돌담하우스. All Rights Reserved.</p>
            {/* Secret Admin Link */}
            <Link to="/admin" className="opacity-10 hover:opacity-100 transition-opacity duration-300 text-gray-500 hover:text-doldam-accent">
              <Lock size={10} />
            </Link>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-6 items-center">
            <a href="#" className="hover:text-doldam-accent transition-colors flex items-center gap-2 group">
              <Instagram size={18} />
              <span className="hidden group-hover:inline-block">Instagram</span>
            </a>
            <a href="#" className="hover:text-doldam-accent transition-colors flex items-center gap-2 group">
              <BookOpen size={18} />
              <span className="hidden group-hover:inline-block">Blog</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;