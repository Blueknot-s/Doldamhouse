import React from 'react';
import { CheckCircle, Grid, Users, ShieldCheck } from 'lucide-react';
// 대소문자가 파일 이름(ProjectMap)과 일치해야 합니다.
import ProjectMap from '../components/ProjectMap'; 

const About: React.FC = () => {
  const advantages = [
    { 
      icon: <CheckCircle className="w-8 h-8 text-doldam-accent" />, 
      title: "건축주와 함께하는 디자인", 
      desc: "토지 구입 단계부터 디자인 및 설계를 함께 진행하는 토털 서비스로 명확한 내집짓기는 물론 디자인 설계까지 대응 및 감리 가능 합니다." 
    },
    { 
      icon: <Grid className="w-8 h-8 text-doldam-accent" />, 
      title: "제주스러운 건축자재", 
      desc: "제주땅에서 출토되는 오리지널 자연석인 곰보석, 자연스러운 고재 느낌 물씬 나는 제주 삼나무를 사용합니다." 
    },
    { 
      icon: <Users className="w-8 h-8 text-doldam-accent" />, 
      title: "공정 관리", 
      desc: "오픈 공정은 투명하게 공유하며, 생생한 현장 사진과 검증된 자재납품서, 시방서 제시를 고객에게 확인하실 수 있습니다." 
    },
    { 
      icon: <ShieldCheck className="w-8 h-8 text-doldam-accent" />, 
      title: "1일 방문 책임제", 
      desc: "돌담하우스는 시공 후 1년 동안 하자 발생 시 1일 이내 방문을 책임지는 책임 A/S 제도를 운영중입니다." 
    }
  ];

  return (
    <div className="w-full pt-20">
      <div className="bg-white py-20 px-6">
        <div className="container mx-auto max-w-5xl">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-12">
            About<br/><span className="text-doldam-accent">Doldam.</span>
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-32">
            <div className="text-xl leading-relaxed font-medium">
              <p className="mb-6 italic text-doldam-accent">
                제주 한경면에서 시작된,<br/>가장 제주다운 집을 향한 진심.
              </p>
              <p className="text-gray-500 text-base leading-relaxed">
                돌담하우스는 제주의 자연과 어우러지는 건축을 지향합니다.
                바람 많은 제주의 특성을 고려한 설계와 현무암을 활용한 돌담 시공을 통해, 
                거주자가 제주 자연의 일부가 되는 가장 제주다운 집을 짓습니다.
              </p>
            </div>
            <div className="relative h-64 md:h-auto overflow-hidden rounded-sm shadow-sm">
               <img 
                 src="https://images.unsplash.com/photo-1505673542670-a5e3ff5b14a3?auto=format&fit=crop&q=80&w=1200" 
                 alt="Jeju Stone Wall" 
                 className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" 
               />
            </div>
          </div>

          <div className="border-t border-gray-100 pt-20">
            <h2 className="text-3xl font-bold mb-16 text-center tracking-tighter uppercase">Our Strength</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {advantages.map((adv, idx) => (
                <div key={idx} className="bg-gray-50 p-8 hover:bg-white hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-gray-100 group">
                  <div className="mb-6 group-hover:scale-110 transition-transform duration-500">{adv.icon}</div>
                  <h3 className="text-xl font-bold mb-4 tracking-tight">{adv.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed break-keep font-light">
                    {adv.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-40">
             <div className="text-center mb-12">
                <span className="text-doldam-accent font-bold tracking-[0.2em] uppercase text-xs mb-3 block">Project Location</span>
                <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tighter">돌담 History Map</h2>
                <p className="text-gray-400 text-sm max-w-lg mx-auto leading-relaxed">
                  제주 전역에 새겨진 돌담하우스의 시공 발자취입니다. 
                  마커를 클릭하여 해당 현장의 상세 이야기를 만나보세요.
                </p>
             </div>
             
             {/* 실제 지도 컴포넌트를 렌더링합니다. */}
             <div className="rounded-sm overflow-hidden shadow-2xl border border-gray-100">
                <ProjectMap />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;