import React, { useState, useEffect } from 'react';
import { ClipboardList, Ruler, FileCheck, Hammer, Key, Search, Calculator } from 'lucide-react';
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";

type Tab = 'process' | 'price';

const CountryHouse: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('process');
    const [processSteps, setProcessSteps] = useState<any[]>([]);
    const [priceData, setPriceData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch process steps
        const qProcess = query(collection(db, "house_process"), orderBy("order", "asc"));
        const unsubProcess = onSnapshot(qProcess, (snapshot) => {
            const steps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProcessSteps(steps);
            setLoading(false);
        });

        // Fetch price comparison data
        const qPrice = query(collection(db, "house_price"), orderBy("order", "asc"));
        const unsubPrice = onSnapshot(qPrice, (snapshot) => {
            const prices = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPriceData(prices);
        });

        return () => {
            unsubProcess();
            unsubPrice();
        };
    }, []);

    const defaultProcessSteps = [
        { iconName: "Search", title: "01. 상담 및 현장조사", desc: "건축주의 요구사항을 파악하고 현장의 입지 조건, 법규 검토, 예산 계획을 수립합니다." },
        { iconName: "ClipboardList", title: "02. 기획설계 및 계약", desc: "평면도 및 3D 모델링을 통한 디자인 제안 후 시공 계약을 체결합니다." },
        { iconName: "Ruler", title: "03. 실시설계", desc: "시공에 필요한 상세 도면(건축, 구조, 전기, 설비 등)을 작성합니다." },
        { iconName: "FileCheck", title: "04. 인허가 진행", desc: "관할 관청에 건축 인허가를 접수하고 승인을 받습니다." },
        { iconName: "Hammer", title: "05. 착공 및 공사", desc: "기초 공사부터 골조, 내외장 마감까지 책임 시공을 진행합니다." },
        { iconName: "FileCheck", title: "06. 사용승인(준공)", desc: "공사 완료 후 사용 승인 검사를 받고 건축물 대장을 생성합니다." },
        { iconName: "Key", title: "07. 입주 및 사후관리", desc: "입주 청소 및 키 불출 후, 철저한 A/S 및 유지관리를 약속합니다." }
    ];

    const getIcon = (name: string) => {
        switch (name) {
            case "Search": return <Search className="w-8 h-8" />;
            case "ClipboardList": return <ClipboardList className="w-8 h-8" />;
            case "Ruler": return <Ruler className="w-8 h-8" />;
            case "FileCheck": return <FileCheck className="w-8 h-8" />;
            case "Hammer": return <Hammer className="w-8 h-8" />;
            case "Key": return <Key className="w-8 h-8" />;
            default: return <Hammer className="w-8 h-8" />;
        }
    };

    const displayProcess = processSteps.length > 0 ? processSteps : defaultProcessSteps;

    return (
        <div className="w-full bg-white min-h-screen">
            {/* Hero Section */}
            <div className="bg-doldam-dark text-white py-24 px-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <img src="https://picsum.photos/seed/country_bg/1920/1080" alt="Background" className="w-full h-full object-cover grayscale" />
                </div>
                <div className="container mx-auto max-w-5xl relative z-10">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
                        Country<br />
                        <span className="text-doldam-accent">House.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 max-w-2xl leading-relaxed">
                        제주의 자연을 닮은 집. <br />
                        투명한 공정과 합리적인 가격으로 당신의 꿈을 짓습니다.
                    </p>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-200">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="flex gap-8">
                        <button
                            onClick={() => setActiveTab('process')}
                            className={`py-6 text-sm font-bold uppercase tracking-widest border-b-2 transition-colors ${activeTab === 'process' ? 'border-doldam-accent text-doldam-accent' : 'border-transparent text-gray-400 hover:text-black'
                                }`}
                        >
                            건축 프로세스 (Process)
                        </button>
                        <button
                            onClick={() => setActiveTab('price')}
                            className={`py-6 text-sm font-bold uppercase tracking-widest border-b-2 transition-colors ${activeTab === 'price' ? 'border-doldam-accent text-doldam-accent' : 'border-transparent text-gray-400 hover:text-black'
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
                            {displayProcess.map((step, idx) => (
                                <div key={step.id || idx} className="relative group p-8 bg-gray-50 border border-transparent hover:border-doldam-accent hover:bg-white transition-all duration-300">
                                    <div className="mb-6 text-gray-300 group-hover:text-doldam-accent transition-colors">
                                        {getIcon(step.iconName)}
                                    </div>
                                    <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed font-light">
                                        {step.desc}
                                    </p>
                                    <div className="absolute top-4 right-4 text-4xl font-black text-gray-100 group-hover:text-gray-50 transition-colors">
                                        0{idx + 1}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-16">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold mb-4">Price Comparison</h2>
                            <p className="text-gray-500">정직한 자재 사용과 공정한 내역 산출로 경쟁력을 확보합니다.</p>
                        </div>

                        <div className="bg-gray-50 p-12 text-center rounded-sm border-2 border-dashed border-gray-200">
                            <Calculator className="w-12 h-12 mx-auto mb-6 text-gray-300" />
                            <p className="text-gray-400 font-bold uppercase tracking-widest">상세 견적은 현장 상담을 통해 안내해 드립니다.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CountryHouse;