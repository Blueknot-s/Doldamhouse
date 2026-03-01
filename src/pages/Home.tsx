import React, { useState, useEffect } from 'react';
import { ArrowRight, PenTool, Gem, Users, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, query, orderBy, limit, onSnapshot, QuerySnapshot, DocumentData } from "firebase/firestore";
import { db } from "../firebase/config";

const Home: React.FC = () => {
  // 1. 실시간 데이터 및 상태 관리
  const [realNews, setRealNews] = useState<any[]>([]);
  const [realProjects, setRealProjects] = useState<any[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  // 2. Firebase 실시간 뉴스 불러오기
  useEffect(() => {
    // Admin에서 createdAt으로 저장하므로 createdAt 기준 정렬이 더 정확합니다.
    const q = query(collection(db, "news"), orderBy("createdAt", "desc"), limit(4));
    const unsubscribe = onSnapshot(q, (querySnapshot: QuerySnapshot<DocumentData>) => {
      const newsData: any[] = [];
      querySnapshot.forEach((doc) => {
        newsData.push({ id: doc.id, ...doc.data() });
      });
      setRealNews(newsData);
    }, (error) => console.error("News fetch error:", error));
    return () => unsubscribe();
  }, []);

  // 3. Firebase 실시간 시공 사례 불러오기
  useEffect(() => {
    const q = query(collection(db, "projects"), orderBy("createdAt", "desc"), limit(3));
    const unsubscribe = onSnapshot(q, (querySnapshot: QuerySnapshot<DocumentData>) => {
      const projectData: any[] = [];
      querySnapshot.forEach((doc) => {
        projectData.push({ id: doc.id, ...doc.data() });
      });
      setRealProjects(projectData);
    }, (error) => console.error("Project fetch error:", error));
    return () => unsubscribe();
  }, []);

  // 로컬 고정 비주얼 데이터
  const visualSections = [
    {
      id: 'center',
      title: "삶이 머무는 공간",
      subtitle: "Architecture for Life",
      desc: "당신의 삶과 이야기가 쓰여질 소중한 보금자리, 행복한 웃음이 피어나는 곳.",
      img: "https://firebasestorage.googleapis.com/v0/b/doldamhouse-92fd3.firebasestorage.app/o/Home_main%2FKakaoTalk_20260208_182750232_01.png?alt=media&token=25081439-891f-4cf9-a226-4759c247cd05",
      linkTo: "/country-house",
      linkText: "전원주택 바로가기"
    },
    {
      id: 'left',
      title: "농촌 주택의 재해석",
      subtitle: "Modern Comfort",
      desc: "기존의 가치를 보존하며 현대적 편리함을 더한, 살기 좋은 새로운 공간을 제안합니다.",
      img: "https://firebasestorage.googleapis.com/v0/b/doldamhouse-92fd3.firebasestorage.app/o/Home_main%2FKakaoTalk_20260129_205229780.png?alt=media&token=764fd4b6-478b-4365-90b3-5bcb6c9b70f0",
      linkTo: "/support",
      linkText: "농촌주택개량지원사업 바로가기"
    },
    {
      id: 'right',
      title: "제주의 숨결, 돌담",
      subtitle: "Jeju's Heritage",
      desc: "투박하지만 따뜻한 현무암의 질감으로 완성하는 제주만의 건축 미학.",
      img: "https://firebasestorage.googleapis.com/v0/b/doldamhouse-92fd3.firebasestorage.app/o/Home_main%2FKakaoTalk_20260208_182750232_03.png?alt=media&token=785aab5a-c256-4f0f-99c5-86ff0a395dbf",
      linkTo: "/stone-wall",
      linkText: "돌담시공 바로가기"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % visualSections.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + visualSections.length) % visualSections.length);
  };

  const advantages = [
    { icon: <PenTool className="w-12 h-12" strokeWidth={1} />, title: "Bespoke Design", korTitle: "맞춤형 디자인", desc: "건축주의 라이프스타일을 담아내는 토털 디자인 솔루션" },
    { icon: <Gem className="w-12 h-12" strokeWidth={1} />, title: "Original Material", korTitle: "제주 오리지널 자재", desc: "제주 자연석과 고재 삼나무가 전하는 깊이 있는 물성" },
    { icon: <Users className="w-12 h-12" strokeWidth={1} />, title: "Transparency", korTitle: "투명한 공정", desc: "상세한 자재 내역 공개와 실시간 현장 소통 프로세스" },
    { icon: <Clock className="w-12 h-12" strokeWidth={1} />, title: "Responsibility", korTitle: "책임 A/S", desc: "신속한 유지보수를 약속하는 1일 이내 현장 방문 시스템" }
  ];

  return (
    <div className="w-full">
      {/* 3D Hero Section */}
      <section className="relative w-full h-screen bg-black overflow-hidden">
        {/* Spline 3D Background */}
        <div className="absolute inset-0 z-0">
          <iframe
            src='https://my.spline.design/distortingtypography-RXDXYNsmussRn0ng8aggDH4H/'
            frameBorder='0'
            width='100%'
            height='100%'
            className="w-full h-full opacity-40"
            title="Spline 3D Typography"
          ></iframe>
        </div>

        {/* 하단 브랜드 정보 (원본 그대로 유지) */}
        <div className="absolute bottom-10 left-6 md:left-20 z-10 text-white pointer-events-none">
          <p className="text-sm md:text-base font-bold tracking-widest uppercase mb-2 text-doldam-accent">Jeju Stone House Architecture</p>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter leading-none uppercase">Doldam<br />House</h2>
        </div>
      </section>

      {/* 비주얼 슬라이더 섹션 */}
      <section className="relative w-full h-screen bg-doldam-dark overflow-hidden group">
        {visualSections.map((section, index) => (
          <div
            key={section.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            <img src={section.img} alt={section.title} className="w-full h-full object-cover brightness-50" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-6">
              <span className="text-doldam-accent tracking-widest uppercase mb-4 font-bold">{section.subtitle}</span>
              <h2 className="text-4xl md:text-6xl font-bold mb-6 max-w-4xl tracking-tighter">{section.title}</h2>
              <p className="text-lg md:text-xl text-gray-300 max-w-2xl leading-relaxed mb-10 font-light">{section.desc}</p>
              <Link to={section.linkTo} className="group flex items-center gap-3 px-8 py-3 border border-white/30 hover:border-doldam-accent hover:bg-doldam-accent hover:text-white transition-all duration-300 rounded-sm">
                <span className="text-xs uppercase tracking-[0.2em] font-bold">{section.linkText}</span>
                <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        ))}

        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/20 hover:bg-doldam-accent/80 rounded-full backdrop-blur-sm transition-all text-white border border-white/10 hover:border-transparent"
          aria-label="Previous slide"
        >
          <ChevronLeft size={32} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/20 hover:bg-doldam-accent/80 rounded-full backdrop-blur-sm transition-all text-white border border-white/10 hover:border-transparent"
          aria-label="Next slide"
        >
          <ChevronRight size={32} />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {visualSections.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentSlide ? 'bg-doldam-accent w-8' : 'bg-white/50 hover:bg-white'}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Featured Projects (실시간 데이터 연동) */}
      <section className="bg-white py-32 px-6">
        <div className="container mx-auto">
          <div className="flex justify-between items-end mb-16 border-b border-gray-100 pb-8">
            <div><span className="text-doldam-accent font-bold tracking-[0.2em] uppercase text-xs mb-3 block">Portfolio</span><h3 className="text-4xl font-bold tracking-tighter">Featured Projects</h3></div>
            <Link to="/projects" className="text-xs font-bold uppercase tracking-widest flex items-center hover:text-doldam-accent transition-colors">View All Works <ArrowRight size={16} className="ml-2" /></Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {realProjects.length > 0 ? (
              realProjects.map((project) => (
                <Link to={`/projects/${project.id}`} key={project.id} className="group cursor-pointer">
                  <div className="aspect-[16/10] overflow-hidden mb-8 bg-gray-50 relative shadow-sm">
                    <img
                      src={project.images?.[0] || project.imageUrl || "https://picsum.photos/seed/doldam/1200/800"}
                      alt={project.title}
                      className="object-cover w-full h-full transform transition-transform duration-1000 group-hover:scale-110"
                    />
                  </div>
                  <div className="text-[10px] font-bold text-doldam-accent mb-3 uppercase tracking-widest">{project.category}</div>
                  <h4 className="text-2xl font-bold mb-3 group-hover:text-gray-600 transition-colors tracking-tighter leading-tight">{project.title}</h4>
                  <p className="text-sm text-gray-400 font-medium uppercase tracking-widest">{project.location}</p>
                </Link>
              ))
            ) : (
              <div className="col-span-3 py-20 text-center text-gray-300 font-bold uppercase tracking-widest border-2 border-dashed border-gray-50">No Projects Found</div>
            )}
          </div>
        </div>
      </section>

      {/* Latest News (실시간 데이터 연동) */}
      <section className="bg-white py-32 px-6 border-t border-gray-100">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 border-b border-gray-100 pb-8">
            <div><span className="text-doldam-accent font-bold tracking-[0.2em] uppercase text-xs mb-3 block">Journal</span><h3 className="text-4xl font-bold tracking-tighter">Latest News</h3></div>
            <Link to="/news" className="text-xs font-bold uppercase tracking-widest flex items-center hover:text-doldam-accent transition-colors mt-6 md:mt-0">Read All News <ArrowRight size={16} className="ml-2" /></Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            {realNews.length > 0 && (
              <Link to={`/news/${realNews[0].id}`} className="group cursor-pointer block">
                <div className="aspect-[16/9] overflow-hidden mb-8 bg-gray-50 relative shadow-sm">
                  <img
                    src={realNews[0].images?.[0] || realNews[0].imageUrl || "https://picsum.photos/1200/800"}
                    alt="News Headline"
                    className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-105"
                  />
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-[10px] font-bold text-white bg-black px-3 py-1.5 uppercase tracking-widest">{realNews[0].category}</span>
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">{realNews[0].date}</span>
                </div>
                <h4 className="text-3xl font-bold mb-4 group-hover:text-doldam-accent transition-colors leading-tight tracking-tighter">{realNews[0].title}</h4>
                <p className="text-gray-500 line-clamp-2 leading-relaxed font-light">
                  {(realNews[0].content || realNews[0].summary || "").replace(/<[^>]*>?/gm, '')}
                </p>
              </Link>
            )}
            <div className="flex flex-col justify-center divide-y divide-gray-100">
              {realNews.slice(1, 4).map((item) => (
                <Link to={`/news/${item.id}`} key={item.id} className="group block py-10 first:pt-0 last:pb-0 transition-all">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-[9px] font-bold text-doldam-accent uppercase tracking-[0.2em]">{item.category}</span>
                    <span className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">{item.date}</span>
                  </div>
                  <h4 className="text-xl font-bold group-hover:text-gray-500 transition-colors mb-3 tracking-tighter leading-tight">{item.title}</h4>
                  <p className="text-sm text-gray-400 line-clamp-1 font-light">
                    {(item.content || item.summary || "").replace(/<[^>]*>?/gm, '')}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 브랜드 철학 */}
      <section className="bg-black text-white py-40 px-6">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 tracking-tighter uppercase leading-none">Doldam's Promise</h2>
          <div className="w-[1px] h-24 bg-gradient-to-b from-doldam-accent to-transparent mx-auto mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-l border-white/10 mt-20">
            {advantages.map((adv, idx) => (
              <div key={idx} className="group relative p-12 border-r border-b border-white/10 hover:bg-white/[0.02] transition-colors duration-500 text-left">
                <div className="mb-8 text-white/30 group-hover:text-doldam-accent transition-colors duration-500 transform group-hover:-translate-y-2">{adv.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-white uppercase tracking-tighter">{adv.title}</h3>
                <p className="text-[10px] text-doldam-accent uppercase tracking-[0.2em] mb-4 font-bold opacity-70 group-hover:opacity-100 transition-opacity">{adv.korTitle}</p>
                <p className="text-gray-500 text-sm leading-relaxed font-light break-keep">{adv.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;