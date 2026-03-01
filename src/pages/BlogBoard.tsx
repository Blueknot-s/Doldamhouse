import React from 'react';

// 테스트를 위한 가짜 데이터 (데이터가 없어서 안 보이는 현상 방지)
const DUMMY_DATA = [
  {
    id: 'test-1',
    title: '티스토리 연동 테스트 포스팅',
    content: 'n8n과 파이어베이스를 통해 들어올 데이터가 이 자리에 표시됩니다.',
    pubDate: new Date().toLocaleDateString(),
    category: '블로그'
  }
];

const BlogBoard: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto py-20 px-4 min-h-screen">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-doldam-dark">돌담하우스 뉴스 & 블로그</h1>
        <p className="text-gray-500 mt-4">새로운 소식을 확인하세요.</p>
      </div>
      
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {DUMMY_DATA.map((post) => (
          <div key={post.id} className="bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
            <div className="p-6">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-600 mb-4">
                {post.category}
              </span>
              <h2 className="text-2xl font-bold mb-3 text-gray-800">{post.title}</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {post.content}
              </p>
              <div className="flex justify-between items-center text-sm text-gray-400 border-t pt-4">
                <span>{post.pubDate}</span>
                <span className="text-doldam-accent font-medium cursor-pointer">더 보기 →</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// [중요] 반드시 export default가 있어야 App.tsx에서 불러올 수 있습니다.
export default BlogBoard;
