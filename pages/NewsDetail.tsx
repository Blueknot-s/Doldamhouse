import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight, Share2 } from 'lucide-react';

const NewsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [news, setNews] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [copied, setCopied] = useState(false);

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

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return (
    <div className="pt-40 text-center font-bold tracking-widest text-gray-300">
      소식을 불러오는 중...
    </div>
  );
  if (!news) return (
    <div className="pt-40 text-center">해당 뉴스를 찾을 수 없습니다.</div>
  );

  const images = news.images?.filter((url: string) => url && url.startsWith('http')) 
    || (news.imageUrl ? [news.imageUrl] : []);

  const nextImage = () => setCurrentImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  const prevImage = () => setCurrentImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  const content = news.content || news.description || news.summary || '';

  return (
    <div className="w-full pt-32 pb-24 bg-white min-h-screen">
      <div className="container mx-auto px-6 max-w-3xl">

        {/* 상단 네비게이션 */}
        <div className="flex justify-between items-center mb-12">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-400 hover:text-black transition-colors group text-sm"
          >
            <ArrowLeft size={16} className="mr-2 transform group-hover:-translate-x-1 transition-transform" />
            목록으로 돌아가기
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 text-gray-300 hover:text-black transition-colors text-xs"
          >
            <Share2 size={16} />
            {copied ? '복사됨!' : ''}
          </button>
        </div>

        {/* 헤더 */}
        <header className="mb-10">
          <div className="flex items-center gap-4 mb-5">
            <span className="bg-black text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
              {news.category}
            </span>
            <div className="flex items-center text-gray-400 text-xs font-bold tracking-widest uppercase">
              <Calendar size={13} className="mr-2" /> {news.date}
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight tracking-tighter text-doldam-dark">
            {news.title}
          </h1>
          {news.summary && (
            <p className="text-gray-500 text-base leading-relaxed border-l-4 border-doldam-accent pl-4 mb-6">
              {news.summary.replace(/\.\.\.$/,'') }
            </p>
          )}
          <div className="w-16 h-1 bg-doldam-accent"></div>
        </header>

        {/* 이미지 갤러리 */}
        {images.length > 0 && (
          <div className="mb-12 space-y-3">
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-50 group shadow-md rounded-sm">
              <img
                src={images[currentImgIndex]}
                alt={`News Visual ${currentImgIndex + 1}`}
                className="w-full h-full object-cover transition-opacity duration-700"
              />
              {images.length > 1 && (
                <>
                  <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={prevImage} className="bg-black/50 text-white p-2 rounded-full hover:bg-black transition-all">
                      <ChevronLeft size={22} />
                    </button>
                    <button onClick={nextImage} className="bg-black/50 text-white p-2 rounded-full hover:bg-black transition-all">
                      <ChevronRight size={22} />
                    </button>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                    {currentImgIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img: string, idx: number) => (
                  <div
                    key={idx}
                    onClick={() => setCurrentImgIndex(idx)}
                    className={`shrink-0 w-20 aspect-video cursor-pointer border-2 transition-all rounded-sm overflow-hidden ${
                      currentImgIndex === idx
                        ? 'border-doldam-accent opacity-100'
                        : 'border-transparent opacity-40 hover:opacity-80'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 본문 */}
        <article
          className="news-content"
          dangerouslySetInnerHTML={{ __html: content }}
        />

        {/* 원본 링크 */}
        {news.sourceUrl && (
          <div className="mt-10 pt-6 border-t border-gray-100">
            <a
              href={news.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-black transition-colors"
            >
              원문 보기 →
            </a>
          </div>
        )}

        {/* 하단 푸터 */}
        <div className="mt-16 pt-8 border-t border-gray-100">
          <p className="text-gray-400 text-sm italic">
            &copy; {new Date().getFullYear()} Doldam House. 모든 소식은 현장에서 직접 전해드립니다.
          </p>
        </div>

      </div>

      {/* 본문 스타일 */}
      <style>{`
        .news-content {
          color: #374151;
          font-size: 16px;
          line-height: 1.9;
          font-weight: 300;
        }
        .news-content h1 {
          font-size: 28px;
          font-weight: 700;
          margin: 36px 0 16px;
          color: #111;
          line-height: 1.4;
          border-bottom: 2px solid #f0f0f0;
          padding-bottom: 8px;
        }
        .news-content h2 {
          font-size: 22px;
          font-weight: 700;
          margin: 32px 0 14px;
          color: #1a1a1a;
          line-height: 1.4;
          padding-left: 12px;
          border-left: 4px solid #111;
        }
        .news-content h3 {
          font-size: 18px;
          font-weight: 600;
          margin: 24px 0 10px;
          color: #222;
        }
        .news-content p {
          margin-bottom: 18px;
          line-height: 1.9;
        }
        .news-content ul {
          list-style: disc;
          padding-left: 24px;
          margin-bottom: 18px;
        }
        .news-content ol {
          list-style: decimal;
          padding-left: 24px;
          margin-bottom: 18px;
        }
        .news-content li {
          margin-bottom: 8px;
          line-height: 1.8;
        }
        .news-content strong, .news-content b {
          font-weight: 700;
          color: #111;
        }
        .news-content img {
          width: 100%;
          height: auto;
          border-radius: 4px;
          margin: 24px 0;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
        }
        .news-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 24px 0;
          font-size: 14px;
        }
        .news-content th {
          background: #111;
          color: white;
          padding: 10px 14px;
          text-align: left;
          font-weight: 600;
        }
        .news-content td {
          padding: 10px 14px;
          border-bottom: 1px solid #e5e7eb;
        }
        .news-content tr:nth-child(even) td {
          background: #f9f9f9;
        }
        .news-content blockquote {
          border-left: 4px solid #e5e7eb;
          padding: 12px 20px;
          margin: 20px 0;
          color: #6b7280;
          font-style: italic;
          background: #f9f9f9;
        }
        .news-content a {
          color: #111;
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .news-content a:hover {
          color: #555;
        }
        .news-content figure {
          margin: 24px 0;
        }
        .news-content figcaption {
          text-align: center;
          font-size: 13px;
          color: #9ca3af;
          margin-top: 8px;
        }
        .news-content hr {
          border: none;
          border-top: 1px solid #e5e7eb;
          margin: 32px 0;
        }
      `}</style>
    </div>
  );
};

export default NewsDetail;
