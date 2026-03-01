import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";
import { NewsCategory } from '../types';
import { ChevronRight, Calendar } from 'lucide-react';

const News: React.FC = () => {
  const [newsItems, setNewsItems] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "news"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newsData: any[] = [];
      querySnapshot.forEach((doc) => {
        newsData.push({ id: doc.id, ...doc.data() });
      });
      setNewsItems(newsData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredNews = activeCategory === 'All'
    ? newsItems
    : newsItems.filter(n => n.category === activeCategory);

  const categories = ['All', ...Object.values(NewsCategory)];

  return (
    <div className="w-full bg-white min-h-screen">
      <div className="container mx-auto px-6 py-12 max-w-5xl relative">
        <div className="mb-12">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4">
            News<span className="text-doldam-accent">.</span>
          </h1>
          <p className="text-xl text-gray-500 font-light">
            현장 소식과 건축 정보를 전달해드립니다.
          </p>
        </div>

        {/* Tab Navigation - Updated sticky to top-0 */}
        <div className="flex border-b border-gray-100 mb-12 overflow-x-auto hide-scrollbar sticky top-0 bg-white z-10 pt-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-5 text-xs font-bold uppercase tracking-[0.2em] whitespace-nowrap border-b-2 transition-all ${activeCategory === cat
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-300 hover:text-gray-600'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-20 text-center text-gray-400 font-medium">소식을 불러오는 중입니다...</div>
        ) : (
          <div className="space-y-6">
            {filteredNews.map((item) => (
              <Link
                to={`/news/${item.id}`}
                key={item.id}
                className="group block p-10 border border-gray-50 hover:border-gray-200 hover:shadow-2xl transition-all duration-500 bg-white relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full -mr-16 -mt-16 group-hover:bg-doldam-accent/5 transition-colors duration-500" />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 relative z-10">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-6">
                      <span className="text-[10px] font-bold text-white bg-black px-3 py-1.5 uppercase tracking-widest">
                        {item.category}
                      </span>
                      <div className="flex items-center text-gray-400 text-xs font-medium uppercase tracking-widest">
                        <Calendar size={12} className="mr-2" /> {item.date}
                      </div>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-doldam-accent transition-colors tracking-tighter leading-tight">
                      {item.title}
                    </h3>

                    <p className="text-gray-500 line-clamp-2 leading-relaxed font-light text-base md:text-lg">
                      {item.description || item.content || item.summary}
                    </p>
                  </div>

                  {(item.images?.[0] || item.imageUrl) && (
                    <div className="w-full md:w-48 aspect-video md:aspect-square overflow-hidden bg-gray-100 grayscale group-hover:grayscale-0 transition-all duration-700">
                      <img
                        src={item.images?.[0] || item.imageUrl}
                        alt="News Thumb"
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                  )}

                  <div className="shrink-0 self-end md:self-center">
                    <div className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center group-hover:bg-black group-hover:border-black group-hover:text-white transition-all duration-500">
                      <ChevronRight size={20} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}

            {!loading && filteredNews.length === 0 && (
              <div className="py-32 text-center text-gray-300 bg-gray-50 rounded-lg border-2 border-dashed border-gray-100">
                <p className="text-sm font-bold uppercase tracking-widest">등록된 소식이 없습니다.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default News;