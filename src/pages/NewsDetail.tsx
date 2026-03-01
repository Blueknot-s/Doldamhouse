import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config"; //
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight, Share2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

const NewsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [news, setNews] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  useEffect(() => {
    const fetchNews = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, "news", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setNews({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Error fetching news:", error);
      }
      setLoading(false);
    };
    fetchNews();
  }, [id]);

  if (loading) return <div className="pt-40 text-center font-bold tracking-widest text-gray-300">소식을 불러오는 중...</div>;
  if (!news) return <div className="pt-40 text-center">해당 뉴스를 찾을 수 없습니다.</div>;

  // ★ 다중 이미지(images) 또는 단일 이미지(imageUrl) 대응
  const images = news.images || (news.imageUrl ? [news.imageUrl] : []);

  const nextImage = () => setCurrentImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  const prevImage = () => setCurrentImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  return (
    <div className="w-full pt-32 pb-24 bg-white min-h-screen">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* 상단 네비게이션 */}
        <div className="flex justify-between items-center mb-12">
          <button onClick={() => navigate(-1)} className="flex items-center text-gray-400 hover:text-black transition-colors group">
            <ArrowLeft size={20} className="mr-2 transform group-hover:-translate-x-1 transition-transform" /> 목록으로 돌아가기
          </button>
          <button className="text-gray-300 hover:text-black transition-colors">
            <Share2 size={20} />
          </button>
        </div>

        {/* 헤더 섹션 */}
        <header className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <span className="bg-black text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
              {news.category}
            </span>
            <div className="flex items-center text-gray-400 text-xs font-bold tracking-widest uppercase">
              <Calendar size={14} className="mr-2" /> {news.date}
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-8 leading-tight tracking-tighter text-doldam-dark">
            {news.title}
          </h1>
          <div className="w-20 h-1 bg-doldam-accent"></div>
        </header>

        {/* 이미지 갤러리 (16:9 비율 유지) */}
        {images.length > 0 && (
          <div className="mb-16 space-y-4">
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-50 group shadow-lg">
              <img
                src={images[currentImgIndex]}
                alt={`News Visual ${currentImgIndex}`}
                className="w-full h-full object-cover transition-opacity duration-700"
              />

              {images.length > 1 && (
                <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={prevImage} className="bg-black/50 text-white p-2 rounded-full hover:bg-black transition-all">
                    <ChevronLeft size={24} />
                  </button>
                  <button onClick={nextImage} className="bg-black/50 text-white p-2 rounded-full hover:bg-black transition-all">
                    <ChevronRight size={24} />
                  </button>
                </div>
              )}
            </div>

            {/* 썸네일 네비게이션 */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
                {images.map((img: string, idx: number) => (
                  <div
                    key={idx}
                    onClick={() => setCurrentImgIndex(idx)}
                    className={`shrink-0 w-24 aspect-video cursor-pointer border-2 transition-all ${currentImgIndex === idx ? 'border-doldam-accent' : 'border-transparent opacity-40 hover:opacity-100'
                      }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 본문 텍스트 - 티스토리 HTML 대응 최적화 */}
        <article className="prose prose-lg max-w-none text-gray-700 leading-relaxed font-light">
          <div
            className="tistory-content"
            dangerouslySetInnerHTML={{ __html: news.description || news.content || news.summary }}
          />
        </article>

        {/* 하단 푸터 라인 */}
        <div className="mt-20 pt-10 border-t border-gray-100">
          <p className="text-gray-400 text-sm italic">
            &copy; {new Date().getFullYear()} Doldam House. 모든 소식은 현장에서 직접 전해드립니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;