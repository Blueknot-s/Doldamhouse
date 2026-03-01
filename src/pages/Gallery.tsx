import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";
import { ImageIcon } from 'lucide-react';

const Gallery: React.FC = () => {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Firebase에서 실시간 갤러리 데이터 불러오기
  useEffect(() => {
    // gallery 컬렉션에서 최신순으로 가져옴
    const q = query(collection(db, "gallery"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const galleryData: any[] = [];
      querySnapshot.forEach((doc) => {
        galleryData.push({ id: doc.id, ...doc.data() });
      });
      setImages(galleryData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="w-full pt-20 bg-white min-h-screen">
      <div className="container mx-auto px-6 py-12">
        <div className="mb-16">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4">
            Gallery<span className="text-doldam-accent">.</span>
          </h1>
          <p className="text-xl text-gray-500 font-light">
            제주의 자연과 함께하는 돌담하우스의 현장 기록입니다.
          </p>
        </div>

        {loading ? (
          <div className="py-20 text-center text-gray-400 font-bold tracking-widest">사진을 불러오는 중...</div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
            {images.length > 0 ? (
              images.map((img) => (
                <div key={img.id} className="break-inside-avoid group relative overflow-hidden bg-gray-50 shadow-sm hover:shadow-2xl transition-all duration-500">
                  {/* 다중 이미지 배열(images) 또는 단일 이미지(imageUrl) 대응 */}
                  <img
                    src={img.images?.[0] || img.imageUrl || "https://picsum.photos/seed/doldam/800/1000"}
                    alt={img.title}
                    className="w-full h-auto object-cover grayscale hover:grayscale-0 transition-all duration-1000 transform group-hover:scale-105"
                  />

                  {/* 호버 시 제목 표시 효과 */}
                  <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center p-6 text-center backdrop-blur-sm">
                    <p className="text-white text-lg font-bold tracking-[0.2em] uppercase mb-2">{img.title}</p>
                    <div className="w-8 h-[1px] bg-doldam-accent mb-4"></div>
                    {img.description && (
                      <div className="text-gray-300 text-sm line-clamp-4 prose prose-invert prose-sm" dangerouslySetInnerHTML={{ __html: img.description }} />
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-32 text-center text-gray-300 border-2 border-dashed border-gray-100 rounded-lg">
                <ImageIcon className="mx-auto mb-4 opacity-20" size={48} />
                <p className="text-sm font-bold uppercase tracking-widest">No Gallery Images Found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;