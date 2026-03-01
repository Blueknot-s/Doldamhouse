import React, { useEffect, useState } from 'react';

// 테스트용 가짜 데이터
const DUMMY_DATA = [
  {
    id: 'test-1',
    title: '테스트 포스팅입니다',
    content: '화면이 정상적으로 보인다면 이 문구가 출력됩니다.',
    pubDate: new Date().toISOString(),
    category: '테스트'
  }
];

const BlogBoard: React.FC = () => {
  const [posts, setPosts] = useState<any[]>(DUMMY_DATA); // 초기값을 가짜 데이터로 설정
  const [loading, setLoading] = useState(false); // 테스트를 위해 로딩은 꺼둡니다.

  return (
    <div className="max-w-6xl mx-auto py-20 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">돌담하우스 블로그 테스트</h1>
      
      {posts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <div key={post.id} className="border p-5 rounded-lg shadow-lg bg-white">
              <span className="text-orange-500 font-bold">{post.category}</span>
              <h2 className="text-xl font-bold mt-2">{post.title}</h2>
              <p className="text-gray-600 mt-2">{post.content}</p>
              <div className="text-gray-400 text-sm mt-4">{post.pubDate}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-xl text-gray-500">표시할 게시글이 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export default BlogBoard;
