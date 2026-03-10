import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { ImageIcon, X, ChevronLeft, ChevronRight } from 'lucide-react';

const Gallery: React.FC = () => {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [selectedGallery, setSelectedGallery] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

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

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedGallery) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedGallery]);

  const openModal = (img: any) => {
    setSelectedGallery(img);
    setCurrentImageIndex(0);
  };

  const closeModal = () => {
    setSelectedGallery(null);
    setCurrentImageIndex(0);
  };

  const getImagesArray = (item: any) => {
    if (item?.images && item.images.length > 0) return item.images;
    if (item?.imageUrl) return [item.imageUrl];
    return ["https://picsum.photos/seed/doldam/800/1000"];
  };

  const galleryImages = getImagesArray(selectedGallery);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  return (
    <div className="w-full pt-20 bg-white min-h-screen relative">
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
                <div 
                  key={img.id} 
                  onClick={() => openModal(img)}
                  className="break-inside-avoid group relative overflow-hidden bg-gray-50 shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer"
                >
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
                    {img.images && img.images.length > 1 && (
                      <p className="text-doldam-accent text-xs font-bold tracking-widest mb-4">+{img.images.length - 1} PHOTOS</p>
                    )}
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

      {/* Image Popup Modal */}
      {selectedGallery && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 md:p-10 animate-fadeIn"
          onClick={closeModal}
        >
          <button 
            onClick={closeModal}
            className="fixed top-24 right-4 md:top-32 md:right-16 flex items-center gap-3 text-white bg-black/80 hover:bg-doldam-accent rounded-full px-6 py-3 transition-all z-[9999] backdrop-blur-md border-2 border-white/30 shadow-[0_0_30px_rgba(0,0,0,0.5)] cursor-pointer"
          >
            <span className="text-sm font-bold tracking-widest uppercase">Close</span>
            <X size={24} />
          </button>

          <div 
            className="relative w-full max-w-6xl max-h-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Main Image */}
            <div className="relative w-full flex items-center justify-center h-[70vh] md:h-[80vh]">
              <img 
                src={galleryImages[currentImageIndex]} 
                alt={`${selectedGallery.title} - ${currentImageIndex + 1}`}
                className="max-w-full max-h-full object-contain shadow-2xl"
              />

              {/* Navigation Arrows (only if multiple images) */}
              {galleryImages.length > 1 && (
                <>
                  <button 
                    onClick={prevImage}
                    className="absolute left-4 md:left-8 p-3 bg-black/50 hover:bg-doldam-accent text-white rounded-full backdrop-blur-md transition-all border border-white/10 hover:border-transparent"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button 
                    onClick={nextImage}
                    className="absolute right-4 md:right-8 p-3 bg-black/50 hover:bg-doldam-accent text-white rounded-full backdrop-blur-md transition-all border border-white/10 hover:border-transparent"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>

            {/* Title & Counter */}
            <div className="mt-6 text-center">
              <h3 className="text-white text-xl md:text-2xl font-bold tracking-widest uppercase mb-2">
                {selectedGallery.title}
              </h3>
              {galleryImages.length > 1 && (
                <p className="text-gray-400 text-sm font-mono tracking-widest">
                  {currentImageIndex + 1} / {galleryImages.length}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;