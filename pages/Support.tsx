import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Coins, Landmark, CheckCircle, ArrowRight, Home as HomeIcon, Layout, ShieldCheck } from 'lucide-react';

type Tab = 'guide' | 'models';

const Support: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('guide');

  const steps = [
    { num: '01', title: '사업신청', desc: '읍·면·동 주민센터 방문 신청' },
    { num: '02', title: '대상자 선정', desc: '지자체 심사 및 대상자 확정 통보' },
    { num: '03', title: '건축신고/허가', desc: '설계 도면 작성 및 인허가 진행' },
    { num: '04', title: '주택 건축', desc: '착공 및 시공 (돌담하우스 시공)' },
    { num: '05', title: '사용승인', desc: '준공 검사 및 건축물 대장 등재' },
    { num: '06', title: '대출신청', desc: '농협 방문 및 대출 실행' }
  ];

  const standardModels = [
    {
        id: 1,
        title: "TYPE A - Minimal Modern",
        specs: "84.82㎡ (25.7평형)",
        rooms: "방 3개, 욕실 2개, 거실, 주방",
        desc: "실용성을 극대화한 컴팩트 디자인으로, 젊은 귀농인 부부나 소가족에게 적합한 현대적 스타일의 전원주택입니다.",
        features: ["효율적 동선 설계", "남향 위주의 채광 확보", "모던한 외관 디자인"],
        image: "https://picsum.photos/seed/plan1/800/600"
    },
    {
        id: 2,
        title: "TYPE B - Jeju Traditional",
        specs: "99.17㎡ (30.0평형)",
        rooms: "방 3개, 욕실 2개, 거실, 주방, 다용도실",
        desc: "제주 전통 가옥의 '안거리' 형태를 현대적으로 재해석하여 돌담과 조화를 이루는 클래식 모델입니다.",
        features: ["제주 현무암 마감 포인트", "높은 층고의 거실", "넓은 데크 공간"],
        image: "https://picsum.photos/seed/plan2/800/600"
    },
    {
        id: 3,
        title: "TYPE C - Luxury Heritage",
        specs: "115.70㎡ (35.0평형)",
        rooms: "방 4개, 욕실 2개, 거실, 주방, 드레스룸",
        desc: "대가족이 거주하기에도 부족함 없는 여유로운 공간 구성과 고급 자재를 사용한 프리미엄 모델입니다.",
        features: ["마스터존 분리 설계", "프리미엄 키친 시스템", "친환경 자재 사용"],
        image: "https://picsum.photos/seed/plan3/800/600"
    }
  ];

  return (
    <div className="w-full bg-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-doldam-dark text-white py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
            <img src="https://picsum.photos/seed/support_bg/1920/1080" alt="Background" className="w-full h-full object-cover grayscale" />
        </div>
        <div className="container mx-auto max-w-5xl relative z-10">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
                Rural Housing<br/>
                <span className="text-doldam-accent">Support.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl leading-relaxed">
                농촌주택개량지원사업은 농촌 주민의 삶의 질 향상과 도시민의 농촌 유입 촉진을 위해
                노후 불량 주택 개량 및 신축 시 저금리 융자를 지원하는 정부 사업입니다.
            </p>
        </div>
      </div>

      {/* Tab Navigation - Updated sticky to top-0 */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-200">
        <div className="container mx-auto px-6 max-w-5xl">
            <div className="flex gap-8">
                <button 
                    onClick={() => setActiveTab('guide')}
                    className={`py-6 text-sm font-bold uppercase tracking-widest border-b-2 transition-colors ${
                        activeTab === 'guide' ? 'border-doldam-accent text-doldam-accent' : 'border-transparent text-gray-400 hover:text-black'
                    }`}
                >
                    사업안내 (Guide)
                </button>
                <button 
                    onClick={() => setActiveTab('models')}
                    className={`py-6 text-sm font-bold uppercase tracking-widest border-b-2 transition-colors ${
                        activeTab === 'models' ? 'border-doldam-accent text-doldam-accent' : 'border-transparent text-gray-400 hover:text-black'
                    }`}
                >
                    표준모델 (Standard Plans)
                </button>
            </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-20 max-w-5xl">
        {activeTab === 'guide' ? (
            <div className="space-y-24 animate-fadeIn">
                <section>
                    <h2 className="text-3xl font-bold mb-12 flex items-center gap-3">
                        <span className="w-2 h-8 bg-doldam-accent block"></span>
                        주요 혜택
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-gray-50 p-8 border border-gray-100 group hover:border-doldam-accent hover:shadow-lg transition-all duration-300">
                            <Coins className="w-10 h-10 text-doldam-accent mb-6" strokeWidth={1.5} />
                            <h3 className="text-xl font-bold mb-4">저금리 융자 지원</h3>
                            <p className="text-gray-600 leading-relaxed text-sm">
                                연 2% 대의 저렴한 고정 금리 또는 변동 금리로 최대 2억원(신축)까지 융자를 지원합니다.
                            </p>
                        </div>
                        <div className="bg-gray-50 p-8 border border-gray-100 group hover:border-doldam-accent hover:shadow-lg transition-all duration-300">
                            <Landmark className="w-10 h-10 text-doldam-accent mb-6" strokeWidth={1.5} />
                            <h3 className="text-xl font-bold mb-4">세금 감면 혜택</h3>
                            <p className="text-gray-600 leading-relaxed text-sm">
                                취득세 최대 280만원 면제 및 지적측량 수수료 30% 감면 등 다양한 세제 혜택을 제공합니다.
                            </p>
                        </div>
                        <div className="bg-gray-50 p-8 border border-gray-100 group hover:border-doldam-accent hover:shadow-lg transition-all duration-300">
                            <Building2 className="w-10 h-10 text-doldam-accent mb-6" strokeWidth={1.5} />
                            <h3 className="text-xl font-bold mb-4">주거 환경 개선</h3>
                            <p className="text-gray-600 leading-relaxed text-sm">
                                노후된 주택을 철거하고 신축하거나 리모델링하여 쾌적하고 안전한 주거 환경을 조성합니다.
                            </p>
                        </div>
                    </div>
                </section>

                <section>
                     <h2 className="text-3xl font-bold mb-12 flex items-center gap-3">
                        <span className="w-2 h-8 bg-doldam-accent block"></span>
                        신청 대상
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="border border-gray-200 p-8 relative">
                            <div className="absolute top-0 right-0 bg-black text-white px-3 py-1 text-xs font-bold uppercase">Target 01</div>
                            <h3 className="text-xl font-bold mb-6">농촌 거주자</h3>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-doldam-accent shrink-0" />
                                    <span className="text-gray-600 text-sm">본인 소유의 노후 주택을 개량하고자 하는 자</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-doldam-accent shrink-0" />
                                    <span className="text-gray-600 text-sm">세대주 또는 배우자 (무주택자 포함)</span>
                                </li>
                            </ul>
                        </div>
                        <div className="border border-gray-200 p-8 relative">
                             <div className="absolute top-0 right-0 bg-black text-white px-3 py-1 text-xs font-bold uppercase">Target 02</div>
                            <h3 className="text-xl font-bold mb-6">귀농·귀촌인</h3>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-doldam-accent shrink-0" />
                                    <span className="text-gray-600 text-sm">도시 지역에서 농촌 지역으로 이주하려는 자</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-doldam-accent shrink-0" />
                                    <span className="text-gray-600 text-sm">융자 대출 신청일 이전까지 전입 신고 완료 필수</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-3xl font-bold mb-12 flex items-center gap-3">
                        <span className="w-2 h-8 bg-doldam-accent block"></span>
                        진행 절차
                    </h2>
                    <div className="relative">
                        <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 z-0"></div>
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 relative z-10">
                            {steps.map((step, idx) => (
                                <div key={idx} className="bg-white p-4 border border-gray-200 md:border-transparent text-center md:text-left group hover:shadow-xl transition-shadow duration-300">
                                    <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold mb-4 mx-auto md:mx-0 group-hover:bg-doldam-accent transition-colors">
                                        {step.num}
                                    </div>
                                    <h4 className="font-bold text-lg mb-2">{step.title}</h4>
                                    <p className="text-xs text-gray-500 break-keep">{step.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                
                <div className="bg-gray-100 p-8 flex flex-col md:flex-row items-center justify-between gap-6 rounded-sm">
                    <div>
                        <h4 className="text-xl font-bold mb-2">전문가와 상담하세요</h4>
                        <p className="text-gray-600 text-sm">복잡한 행정 절차와 서류 준비, 돌담하우스가 꼼꼼하게 도와드립니다.</p>
                    </div>
                    <Link to="/contact" className="px-8 py-3 bg-doldam-accent text-white font-bold uppercase tracking-widest hover:bg-black transition-colors">
                        무료 상담 신청
                    </Link>
                </div>
            </div>
        ) : (
            <div className="animate-fadeIn">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">Standard Models</h2>
                    <p className="text-gray-500">돌담하우스가 제안하는 합리적이고 아름다운 표준 설계안입니다.</p>
                </div>

                <div className="space-y-20">
                    {standardModels.map((model, idx) => (
                        <div key={model.id} className={`flex flex-col ${idx % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-12 items-center`}>
                            <div className="w-full md:w-1/2">
                                <div className="aspect-[4/3] bg-gray-100 overflow-hidden relative group">
                                    <img 
                                        src={model.image} 
                                        alt={model.title} 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-2 text-xs font-bold uppercase tracking-wider">
                                        Standard Plan {String(idx + 1).padStart(2, '0')}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="w-full md:w-1/2">
                                <h3 className="text-3xl font-bold mb-2">{model.title}</h3>
                                <div className="w-20 h-1 bg-doldam-accent mb-6"></div>
                                
                                <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-8 text-sm">
                                    <div>
                                        <span className="block text-gray-400 text-xs uppercase font-bold mb-1">Area</span>
                                        <span className="font-medium">{model.specs}</span>
                                    </div>
                                    <div>
                                        <span className="block text-gray-400 text-xs uppercase font-bold mb-1">Composition</span>
                                        <span className="font-medium">{model.rooms}</span>
                                    </div>
                                </div>
                                
                                <p className="text-gray-600 leading-relaxed mb-8 border-l-2 border-gray-200 pl-4">
                                    {model.desc}
                                </p>
                                
                                <div className="space-y-3 mb-8">
                                    {model.features.map((feature, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <ShieldCheck className="w-4 h-4 text-doldam-accent" />
                                            <span className="text-sm font-medium text-gray-700">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                                
                                <button className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest border-b-2 border-black pb-1 hover:text-doldam-accent hover:border-doldam-accent transition-colors">
                                    상세 도면 보기 <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default Support;