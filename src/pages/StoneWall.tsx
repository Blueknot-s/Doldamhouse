import React, { useState, useEffect } from 'react';
import { Leaf, Layers, Shield, Grip } from 'lucide-react';
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";
import { Link } from 'react-router-dom';

type Tab = 'philosophy' | 'types';

const StoneWall: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('philosophy');
    const [wallTypes, setWallTypes] = useState<any[]>([]);
    const [philosophyContent, setPhilosophyContent] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch wall types
        const qTypes = query(collection(db, "stonewall_types"), orderBy("order", "asc"));
        const unsubTypes = onSnapshot(qTypes, (snapshot) => {
            const types = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setWallTypes(types);
            setLoading(false);
        });

        // Fetch philosophy content (single doc or first in collection)
        const qPhil = query(collection(db, "stonewall_philosophy"));
        const unsubPhil = onSnapshot(qPhil, (snapshot) => {
            if (!snapshot.empty) {
                setPhilosophyContent({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
            }
        });

        return () => {
            unsubTypes();
            unsubPhil();
        };
    }, []);

    // Fallback data if Firestore is empty
    const defaultWallTypes = [
        {
            title: "외담 (Single Wall)",
            desc: "돌을 한 줄로 쌓는 방식으로, 주로 경계 표시나 밭담(밭의 경계)으로 사용됩니다. 바람이 숭숭 통하는 구멍이 있어 태풍에도 잘 무너지지 않는 과학적인 구조입니다.",
            features: ["통풍성 우수", "자연스러운 미관", "밭담/울타리 용도"],
            img: "https://picsum.photos/seed/wall1/800/600"
        },
        {
            title: "겹담 (Double Wall)",
            desc: "겉돌과 속돌을 구분하여 두 줄로 쌓고 그 사이를 작은 잡석(채움석)으로 채우는 방식입니다. 구조적으로 매우 튼튼하며 집의 외벽이나 축대, 성곽 등에 주로 사용되었습니다.",
            features: ["높은 구조적 안정성", "방풍 효과", "주택 외벽/조경 용도"],
            img: "https://picsum.photos/seed/wall2/800/600"
        },
        {
            title: "산담 (Grave Wall)",
            desc: "제주의 묘지 주변을 네모나게 둘러싼 돌담입니다. 망자의 영혼을 보호하고 소나 말의 침입을 막기 위한 목적으로, 제주만의 독특한 장묘 문화를 보여줍니다.",
            features: ["제의적 의미", "직사각형/사다리꼴 형태", "신성한 공간 구획"],
            img: "https://picsum.photos/seed/wall3/800/600"
        }
    ];

    const displayTypes = wallTypes.length > 0 ? wallTypes : defaultWallTypes;

    return (
        <div className="w-full bg-white min-h-screen">
            {/* Hero Section */}
            <div className="bg-doldam-dark text-white py-24 px-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <img src="https://picsum.photos/seed/stonewall_bg/1920/1080" alt="Background" className="w-full h-full object-cover grayscale" />
                </div>
                <div className="container mx-auto max-w-5xl relative z-10">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
                        Jeju Stone<br />
                        <span className="text-doldam-accent">Wall.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 max-w-2xl leading-relaxed">
                        제주의 숨결, 천 년을 이어온 돌담의 미학. <br />
                        투박하지만 가장 아름다운 제주 건축의 원형을 시공합니다.
                    </p>
                </div>
            </div>

            {/* Tab Navigation - Updated sticky to top-0 */}
            <div className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-200">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="flex gap-8">
                        <button
                            onClick={() => setActiveTab('philosophy')}
                            className={`py-6 text-sm font-bold uppercase tracking-widest border-b-2 transition-colors ${activeTab === 'philosophy' ? 'border-doldam-accent text-doldam-accent' : 'border-transparent text-gray-400 hover:text-black'
                                }`}
                        >
                            돌담의 가치 (Philosophy)
                        </button>
                        <button
                            onClick={() => setActiveTab('types')}
                            className={`py-6 text-sm font-bold uppercase tracking-widest border-b-2 transition-colors ${activeTab === 'types' ? 'border-doldam-accent text-doldam-accent' : 'border-transparent text-gray-400 hover:text-black'
                                }`}
                        >
                            시공 종류 (Types)
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-20 max-w-5xl animate-fadeIn">
                {activeTab === 'philosophy' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div className="relative">
                            <div className="absolute top-4 left-4 w-full h-full border-2 border-black z-0"></div>
                            <img src={philosophyContent?.mainImage || "https://picsum.photos/seed/stoneworker/600/800"} alt="Stone Worker" className="relative z-10 w-full grayscale shadow-xl" />
                        </div>
                        <div>
                            <span className="text-doldam-accent font-bold uppercase tracking-widest text-xs mb-4 block">Our Spirit</span>
                            <h2 className="text-4xl font-bold mb-8 leading-tight">
                                {philosophyContent?.title || "돌 하나에 땀,\n돌 하나에 혼을 담다."}
                            </h2>
                            <div className="text-gray-600 mb-8 leading-relaxed prose prose-sm max-w-none"
                                dangerouslySetInnerHTML={{
                                    __html: philosophyContent?.content || `
                        <p>제주의 돌담은 단순한 경계가 아닙니다. 거센 바닷바람을 걸러내고, 흙이 쓸려나가는 것을 막으며 척박한 땅을 일구어낸 제주 선조들의 지혜이자 삶의 역사입니다.</p>
                        <p>돌담하우스는 기계로 찍어낸 듯한 획일적인 시공을 거부합니다. 자연석 하나하나의 생김새를 살피고 서로 맞물리게 쌓아올려, 시간이 흐를수록 더욱 단단해지고 아름다워지는 전통 돌담의 가치를 계승합니다.</p>
                     ` }} />

                            <div className="grid grid-cols-2 gap-6 mt-12">
                                <div className="bg-gray-50 p-6">
                                    <Leaf className="w-8 h-8 text-doldam-accent mb-4" />
                                    <h4 className="font-bold mb-2">친환경성</h4>
                                    <p className="text-xs text-gray-500">시멘트를 최소화하고 자연 그대로의 돌을 활용합니다.</p>
                                </div>
                                <div className="bg-gray-50 p-6">
                                    <Layers className="w-8 h-8 text-doldam-accent mb-4" />
                                    <h4 className="font-bold mb-2">내구성</h4>
                                    <p className="text-xs text-gray-500">전통 방식의 겹담 시공으로 태풍에도 끄떡없습니다.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-24">
                        {displayTypes.map((type, idx) => (
                            <div key={type.id || idx} className={`flex flex-col ${idx % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-12 items-center`}>
                                <div className="w-full md:w-1/2 aspect-[4/3] overflow-hidden">
                                    <img src={type.img || type.imageUrl} alt={type.title} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                                </div>
                                <div className="w-full md:w-1/2">
                                    <h3 className="text-3xl font-bold mb-6 flex items-center gap-4">
                                        <span className="text-6xl text-gray-100 font-black">0{idx + 1}</span>
                                        {type.title}
                                    </h3>
                                    <p className="text-gray-500 mb-8 leading-relaxed text-lg">
                                        {type.desc}
                                    </p>
                                    <ul className="space-y-4">
                                        {type.features?.map((f: string, i: number) => (
                                            <li key={i} className="flex items-center gap-3 font-bold text-xs uppercase tracking-widest">
                                                <Grip size={14} className="text-doldam-accent" />
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="bg-gray-50 py-20 px-6 mt-20 text-center">
                <h3 className="text-2xl font-bold mb-8">당신의 공간에 가치를 더하는 돌담을 쌓습니다.</h3>
                <Link to="/admin" className="inline-block bg-black text-white px-10 py-5 text-xs font-bold uppercase tracking-[0.2em] hover:bg-doldam-accent transition-colors">
                    시공 상담 신청하기
                </Link>
            </div>
        </div>
    );
};

export default StoneWall;