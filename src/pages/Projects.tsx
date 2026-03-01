import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ProjectCategory } from '../types';
import { Filter, ArrowRight } from 'lucide-react';
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";

const Projects: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [realProjects, setRealProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const projectData: any[] = [];
      querySnapshot.forEach((doc) => {
        projectData.push({ id: doc.id, ...doc.data() });
      });
      setRealProjects(projectData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam && Object.values(ProjectCategory).includes(categoryParam as ProjectCategory)) {
      setActiveCategory(categoryParam);
    } else {
      setActiveCategory('All');
    }
  }, [searchParams]);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setSearchParams({ category });
  };

  const filteredProjects = activeCategory === 'All'
    ? realProjects
    : realProjects.filter(p => p.category === activeCategory);

  const categories = ['All', ...Object.values(ProjectCategory)];

  return (
    <div className="w-full min-h-screen bg-white">
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4">
          Projects<span className="text-doldam-accent">.</span>
        </h1>
        <p className="text-xl text-gray-500 mb-12">
          삶을 담아내는 그릇, 돌담하우스의 포트폴리오
        </p>

        {/* Filters - Updated sticky to top-0 */}
        <div className="flex flex-wrap gap-4 mb-16 border-b border-gray-200 pb-6 sticky top-0 bg-white z-10 pt-4">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`text-xs md:text-sm px-6 py-2.5 rounded-full transition-all duration-300 font-bold uppercase tracking-widest ${activeCategory === cat
                  ? 'bg-black text-white shadow-lg'
                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 font-medium text-gray-400">시공 사례를 불러오는 중입니다...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20">
            {filteredProjects.map((project) => (
              <Link to={`/projects/${project.id}`} key={project.id} className="group flex flex-col cursor-pointer">
                <div className="w-full aspect-[16/10] overflow-hidden bg-gray-100 mb-8 relative">
                  <img
                    src={(project.images && project.images[0]) || project.imageUrl || "https://picsum.photos/seed/doldam/1200/800"}
                    alt={project.title}
                    className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                  <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="bg-white p-4 rounded-full shadow-2xl">
                      <ArrowRight size={20} className="text-black" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-start px-2">
                  <div className="flex-grow">
                    <span className="text-doldam-accent text-[10px] font-bold uppercase tracking-[0.2em] mb-3 block">
                      {project.category}
                    </span>
                    <h3 className="text-3xl font-bold mb-4 tracking-tighter group-hover:text-gray-600 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-gray-500 text-base leading-relaxed mb-6 line-clamp-2 font-light">
                      {project.description}
                    </p>
                  </div>
                </div>

                <div className="mt-auto border-t border-gray-100 pt-6 flex items-center justify-between text-[11px] font-bold text-gray-400 uppercase tracking-widest px-2">
                  <div className="flex gap-4">
                    {project.specs && <span>{project.specs}</span>}
                    {project.specs && <span>|</span>}
                    <span>{project.location}</span>
                  </div>
                  <span className="text-black">{project.date || '2026.02'}</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && filteredProjects.length === 0 && (
          <div className="text-center py-32 text-gray-400 bg-gray-50 rounded-lg border-2 border-dashed border-gray-100">
            <Filter className="mx-auto w-12 h-12 mb-4 opacity-20" />
            <p className="text-sm font-bold uppercase tracking-widest">No Projects Found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;