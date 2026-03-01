import React, { useState } from 'react';
import { ClipboardList, Ruler, FileCheck, Hammer, Key, Search, Calculator, Check, X } from 'lucide-react';

type Tab = 'process' | 'price';

const CountryHouse: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('process');

  const processSteps = [
    { 
        icon: <Search className="w-8 h-8" />,
        title: "01. 상담 및 현장조사", 
        desc: "건축주의 요구사항을 파악하고 현장의 입지 조건, 법규 검토, 예산 계획을 수립합니다." 
    },
    { 
        icon: <ClipboardList className="w-8 h-8" />,
        title: "02. 기획설계 및 계약", 
        desc: "평면도 및 3D 모델링을 통한 디자인 제안 후 시공 계약을 체결합니다." 
    },
    { 
        icon: <Ruler className="w-8 h-8" />,
        title: "03. 실시설계", 
        desc: "시공에 필요한 상세 도면(건축, 구조, 전기, 설비 등)을 작성합니다." 
    },
    { 
        icon: <FileCheck className="w-8 h-8" />,
        title: "04. 인허가 진행", 
        desc: "관할 관청에 건축 인허가를 접수하고 승인을 받습니다." 
    },
    { 
        icon: <Hammer className="w-8 h-8" />,
        title: "05. 착공 및 공사", 
        desc: "기초 공사부터 골조, 내외장 마감까지 책임 시공을 진행합니다." 
    },
    { 
        icon: <FileCheck className="w-8 h-8" />,
        title: "06. 사용승인(준공)", 
        desc: "공사 완료 후 사용 승인 검사를 받고 건축물 대장을 생성합니다." 
    },
    { 
        icon: <Key className="w-8 h-8" />,
        title: "07. 입주 및 사후관리", 
        desc: "입주 청소 및 키 불출 후, 철저한 A/S 및 유지관리를 약속합니다." 
    }
  ];

  return (
    <div className="w-full bg-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-doldam-dark text-white py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
            <img src="https://picsum.photos/seed/country_bg/1920/1080" alt="Background" className="w-full h-full object-cover grayscale" />
        </div>
        <div className="container mx-auto max-w-5xl relative z-10">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
                Country<br/>
                <span className="text-doldam-accent">House.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl leading-relaxed">
                제주의 자연을 닮은 집. <br/>
                투명한 공정과 합리적인 가격으로 당신의 꿈을 짓습니다.
            </p>
        </div>
      </div>

      {/* Tab Navigation - Updated sticky to top-0 */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-200">
        <div className="container mx-auto px-6 max-w-5xl">
            <div className="flex gap-8">
                <button 
                    onClick={() => setActiveTab('process')}
                    className={`py-6 text-sm font-bold uppercase tracking-widest border-b-2 transition-colors ${
                        activeTab === 'process' ? 'border-doldam-accent text-doldam-accent' : 'border-transparent text-gray-400 hover:text-black'
                    }`}
                >
                    건축 프로세스 (Process)
                </button>
                <button 
                    onClick={() => setActiveTab('price')}
                    className={`py-6 text-sm font-bold uppercase tracking-widest border-b-2 transition-colors ${
                        activeTab === 'price' ? 'border-doldam-accent text-doldam-accent' : 'border-transparent text-gray-400 hover:text-black'
                    }`}
                >
                    건축시공가격비교 (Price)
                </button>
            </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-20 max-w-5xl animate-fadeIn">
        {activeTab === 'process' ? (
            <div className="space-y-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">Construction Process</h2>
                    <p className="text-gray-500">돌담하우스의 체계적이고 투명한 건축 과정을 소개합니다.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                    {processSteps.map((step, idx) => (
                        <div key={idx} className="relative group">
                            <div className="absolute -top-4 -left-4 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-lg font-bold text-gray-300 group-hover:bg-doldam-accent group-hover:text-white transition-colors duration-300">
                                {idx + 1}
                            </div>
                            <div className="bg-white border border-gray-100 p-8 shadow-sm hover:shadow-xl transition-all duration-300 h-full pt-12">
                                <div className="text-doldam-accent mb-6 group-hover:scale-110 transition-transform duration-300 origin-left">
                                    {step.icon}
                                    </div>
                                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed break-keep">
                                    {step.desc}
                                </p>
                            </div>
                            {idx < processSteps.length - 1 && (
                                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-[2px] bg-gray-200 transform translate-x-0" />
                            )}
                        </div>
                    ))}
                </div>
                
                <div className="bg-gray-50 p-10 mt-12 rounded-sm border-l-4 border-doldam-accent">
                    <h4 className="text-xl font-bold mb-4">무료 현장 방문 컨설팅</h4>
                    <p className="text-gray-600 leading-relaxed">
                        건축 예정지의 상황을 전문가가 직접 방문하여 점검해드립니다. <br/>
                        토목, 기반 시설, 인허가 가능 여부 등 초기 단계의 리스크를 무료로 진단받으세요.
                    </p>
                </div>
            </div>
        ) : (
            <div className="space-y-16">
                <div className="text-center mb-12">
                     <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
                        <Calculator className="w-8 h-8 text-doldam-accent" />
                        Price Comparison
                    </h2>
                    <p className="text-gray-500">구조별 장단점 및 시공 비용 비교 (2024년 기준)</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px] border-collapse">
                        <thead>
                            <tr className="bg-black text-white">
                                <th className="p-4 text-left w-1/4">구분</th>
                                <th className="p-4 text-left w-1/4">철근콘크리트 (RC)</th>
                                <th className="p-4 text-left w-1/4">경량철골조</th>
                                <th className="p-4 text-left w-1/4 bg-doldam-accent">목조 (Wood)</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            <tr className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="p-4 font-bold bg-gray-50">평당 예상 건축비</td>
                                <td className="p-4">750 ~ 850만원</td>
                                <td className="p-4">550 ~ 650만원</td>
                                <td className="p-4 font-bold text-doldam-accent">650 ~ 750만원</td>
                            </tr>
                            <tr className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="p-4 font-bold bg-gray-50">수명 / 내구성</td>
                                <td className="p-4">매우 높음 (50년 이상)</td>
                                <td className="p-4">중간 (30~40년)</td>
                                <td className="p-4">높음 (관리 시 100년)</td>
                            </tr>
                            <tr className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="p-4 font-bold bg-gray-50">단열 성능</td>
                                <td className="p-4">중간 (추가 단열 필요)</td>
                                <td className="p-4">낮음 (단열재 의존)</td>
                                <td className="p-4 text-doldam-accent">최상 (자체 단열성 우수)</td>
                            </tr>
                            <tr className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="p-4 font-bold bg-gray-50">친환경성</td>
                                <td className="p-4 text-gray-400">낮음</td>
                                <td className="p-4 text-gray-400">중간</td>
                                <td className="p-4 text-doldam-accent flex items-center gap-1"><Check size={14}/> 매우 우수</td>
                            </tr>
                            <tr className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="p-4 font-bold bg-gray-50">내진 설계</td>
                                <td className="p-4">가능</td>
                                <td className="p-4">가능</td>
                                <td className="p-4">우수 (유연성)</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <div className="mt-8 text-xs text-gray-400 text-right">
                    * 위 단가는 마감재 등급, 현장 여건, 옵션 사항에 따라 변동될 수 있습니다.
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                    <div className="bg-white border border-gray-200 p-8 shadow-lg">
                        <h3 className="text-xl font-bold mb-4">왜 돌담하우스인가요?</h3>
                        <ul className="space-y-4">
                             <li className="flex items-start gap-3">
                                <div className="bg-doldam-accent/10 p-1 rounded-full"><Check className="w-4 h-4 text-doldam-accent" /></div>
                                <div>
                                    <span className="font-bold block">투명한 견적 공개</span>
                                    <span className="text-sm text-gray-600">자재비, 인건비, 경비 등 세부 내역서를 제공합니다.</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="bg-doldam-accent/10 p-1 rounded-full"><Check className="w-4 h-4 text-doldam-accent" /></div>
                                <div>
                                    <span className="font-bold block">추가 공사비 최소화</span>
                                    <span className="text-sm text-gray-600">계약 시 정확한 스펙 지정으로 공사 중 분쟁을 방지합니다.</span>
                                </div>
                            </li>
                             <li className="flex items-start gap-3">
                                <div className="bg-doldam-accent/10 p-1 rounded-full"><Check className="w-4 h-4 text-doldam-accent" /></div>
                                <div>
                                    <span className="font-bold block">제주 특화 설계</span>
                                    <span className="text-sm text-gray-600">제주의 바람, 습도, 염분을 고려한 내구성 중심 설계.</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                    
                    <div className="bg-doldam-dark text-white p-8">
                         <h3 className="text-xl font-bold mb-4">견적 문의 가이드</h3>
                         <p className="text-gray-400 text-sm mb-6">
                            정확한 견적 산출을 위해 다음 정보를 준비해주시면 상담이 더욱 원활합니다.
                         </p>
                         <ul className="space-y-3 text-sm">
                            <li className="flex items-center gap-2 text-gray-300">
                                <span className="w-1.5 h-1.5 bg-doldam-accent rounded-full"></span>
                                대지 위치 (지번)
                            </li>
                            <li className="flex items-center gap-2 text-gray-300">
                                <span className="w-1.5 h-1.5 bg-doldam-accent rounded-full"></span>
                                희망 건축 평수 및 구조
                            </li>
                            <li className="flex items-center gap-2 text-gray-300">
                                <span className="w-1.5 h-1.5 bg-doldam-accent rounded-full"></span>
                                예상 예산 범위
                            </li>
                            <li className="flex items-center gap-2 text-gray-300">
                                <span className="w-1.5 h-1.5 bg-doldam-accent rounded-full"></span>
                                입주 희망 시기
                            </li>
                         </ul>
                         <a href="/#/contact" className="block w-full text-center mt-8 py-3 bg-doldam-accent font-bold hover:bg-white hover:text-doldam-accent transition-colors">견적 상담 신청하기</a>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default CountryHouse;