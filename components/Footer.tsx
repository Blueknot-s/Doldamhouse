import React from 'react';
import { Instagram, BookOpen, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white pt-24 pb-12 border-t border-white/10">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-8 uppercase">Doldam<span className="text-red-600">.</span>House</h2>
            <p className="text-gray-400 max-w-md leading-relaxed font-light">
              제주스러움을 고집하는 전문 기업 돌담하우스.<br/>
              자연과 어우러지는 건축으로 당신의 삶에 가치를 더합니다.<br/>
              <span className="block mt-4 text-sm text-gray-500">제주특별자치도 제주시 한경면 고산로8길 4-101</span>
            </p>
          </div>
          <div className="flex flex-col md:items-end justify-start">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-doldam-accent mb-6">Contact Us</h3>
            <p className="text-3xl font-light hover:text-doldam-accent transition-colors mb-3 tracking-tight">
              <a href="tel:064-772-3697">064-772-3697</a>
            </p>
            <p className="text-lg text-gray-400 font-light hover:text-white transition-colors">
              <a href="mailto:kangh_7@naver.com">kangh_7@naver.com</a>
            </p>
            <div className="mt-10">
               <span className="text-[10px] text-gray-500 border border-gray-800 px-4 py-2 rounded-sm cursor-pointer hover:border-doldam-accent hover:text-doldam-accent transition-all uppercase tracking-widest">
                개인정보보호정책
               </span>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 font-light">
          <div className="flex items-center gap-3">
            <p className="tracking-widest uppercase">© Copyright Doldam House. All Rights Reserved.</p>
            {/* Secret Admin Link */}
            <Link to="/admin" className="opacity-0 hover:opacity-100 transition-opacity duration-300 text-gray-500 hover:text-doldam-accent" aria-label="Admin Login">
              <Lock size={12} />
            </Link>
          </div>
          <div className="mt-6 md:mt-0 flex space-x-8 items-center">
            <a href="https://www.instagram.com/jejudoldamhouse" target="_blank" rel="noopener noreferrer" className="hover:text-doldam-accent transition-colors flex items-center gap-2 group">
              <Instagram size={16} />
              <span className="uppercase tracking-widest font-bold text-[10px]">Instagram</span>
            </a>
            <a href="https://blog.naver.com/doldamhousekr" target="_blank" rel="noopener noreferrer" className="hover:text-doldam-accent transition-colors flex items-center gap-2 group">
              <BookOpen size={16} />
              <span className="uppercase tracking-widest font-bold text-[10px]">Naver Blog</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;