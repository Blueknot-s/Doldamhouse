import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { ArrowLeft, MapPin, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentImgIndex, setCurrentImgIndex] = useState(0); // 현재 보고 있는 사진 번호

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, "projects", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProject({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Error fetching project:", error);
      }
      setLoading(false);
    };
    fetchProject();
  }, [id]);

  if (loading) return <div className="pt-40 text-center font-bold">데이터를 불러오는 중...</div>;
  if (!project) return <div className="pt-40 text-center">시공 사례를 찾을 수 없습니다.</div>;

  // ★ 다중 이미지(images) 또는 단일 이미지(imageUrl) 대응 로직
  const images = project.images || (project.imageUrl ? [project.imageUrl] : []);

  // 사진 넘기기 함수
  const nextImage = () => setCurrentImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  const prevImage = () => setCurrentImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  return (
    <div className="w-full pt-32 pb-24 bg-white min-h-screen">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* 이미지 영역 (Gallery) */}
          <div className="space-y-6">
            <button onClick={() => navigate(-1)} className="flex items-center text-gray-400 hover:text-black mb-4 transition-colors group">
              <ArrowLeft size={20} className="mr-2 transform group-hover:-translate-x-1 transition-transform" /> 목록으로 돌아가기
            </button>

            {/* 메인 대형 이미지 (16:9 비율 유지) */}
            <div className="relative aspect-[16/9] bg-gray-100 overflow-hidden shadow-2xl group">
              <img
                src={images[currentImgIndex] || "https://picsum.photos/seed/doldam/1200/800"}
                alt="Project Detail"
                className="w-full h-full object-cover transition-opacity duration-500"
              />

              {/* 좌우 네비게이션 버튼 (사진이 여러 장일 때만 표시) */}
              {images.length > 1 && (
                <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={prevImage} className="bg-black/50 text-white p-2 rounded-full hover:bg-black transition-colors">
                    <ChevronLeft size={24} />
                  </button>
                  <button onClick={nextImage} className="bg-black/50 text-white p-2 rounded-full hover:bg-black transition-colors">
                    <ChevronRight size={24} />
                  </button>
                </div>
              )}
            </div>

            {/* 썸네일 리스트 (여러 장일 때 하단에 표시) */}
            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-3">
                {images.map((img: string, idx: number) => (
                  <div
                    key={idx}
                    onClick={() => setCurrentImgIndex(idx)}
                    className={`aspect-video cursor-pointer border-2 transition-all ${currentImgIndex === idx ? 'border-doldam-accent' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                  >
                    <img src={img} alt={`thumbnail-${idx}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 정보 영역 */}
          <div className="pt-12">
            <span className="text-doldam-accent font-bold tracking-[0.2em] uppercase text-sm mb-4 block">
              {project.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-12 tracking-tighter leading-tight">
              {project.title}
            </h1>

            <div className="grid grid-cols-2 gap-8 border-y border-gray-100 py-10 mb-12">
              <div>
                <div className="flex items-center text-gray-400 mb-2 text-xs font-bold uppercase tracking-widest">
                  <MapPin size={14} className="mr-2" /> Location
                </div>
                <div className="font-bold text-lg">{project.location}</div>
              </div>
              <div>
                <div className="flex items-center text-gray-400 mb-2 text-xs font-bold uppercase tracking-widest">
                  <Calendar size={14} className="mr-2" /> Completed
                </div>
                <div className="font-bold text-lg">{project.date || '2026.02'}</div>
              </div>
            </div>

            <div className="text-lg text-gray-600 leading-relaxed font-light prose prose-lg max-w-none">
              <div dangerouslySetInnerHTML={{ __html: project.description || project.summary || "상세 설명이 등록되지 않았습니다." }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;