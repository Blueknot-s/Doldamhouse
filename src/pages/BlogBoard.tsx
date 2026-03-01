// src/pages/BlogBoard.tsx
import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/config";

interface Post {
  id: string;
  title: string;
  content: string;
  link: string;
  pubDate: string;
  category: string;
  source: string;
  createdAt: string;
}

const CATEGORIES = ["전체", "일상", "여행", "음식", "IT/기술", "부동산", "육아", "건강", "기타"];
const POSTS_PER_PAGE = 9;

export default function BlogBoard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filtered, setFiltered] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Firestore에서 게시글 불러오기
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(collection(db, "blog_posts"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Post[];
        setPosts(data);
        setFiltered(data);
      } catch (error) {
        console.error("게시글 불러오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // 카테고리 + 검색 필터 적용
  useEffect(() => {
    let result = posts;
    if (selectedCategory !== "전체") {
      result = result.filter((p) => p.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
    setCurrentPage(1);
  }, [selectedCategory, searchQuery, posts]);

  // 페이지네이션 계산
  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  // 날짜 포맷
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200 py-10 px-4 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">블로그 게시판</h1>
        <p className="text-gray-500 text-sm">티스토리에서 자동으로 가져온 최신 포스팅</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 검색창 */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="제목 또는 내용으로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-md mx-auto block border border-gray-300 rounded-full px-5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
          />
        </div>

        {/* 카테고리 필터 */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white shadow"
                  : "bg-white text-gray-600 border border-gray-300 hover:bg-blue-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 로딩 */}
        {loading && (
          <div className="text-center py-20 text-gray-400">
            <div className="animate-spin text-4xl mb-3">⟳</div>
            <p>게시글 불러오는 중...</p>
          </div>
        )}

        {/* 게시글 없음 */}
        {!loading && paginated.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-3">📭</p>
            <p>게시글이 없습니다.</p>
          </div>
        )}

        {/* 게시글 카드 그리드 */}
        {!loading && paginated.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginated.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col"
              >
                {/* 카드 바디 */}
                <div className="p-5 flex-1 flex flex-col">
                  {/* 카테고리 배지 */}
                  <span className="inline-block text-xs font-semibold text-blue-600 bg-blue-50 rounded-full px-3 py-0.5 mb-3 w-fit">
                    {post.category || "기타"}
                  </span>

                  {/* 제목 */}
                  <h2 className="text-base font-bold text-gray-800 mb-2 line-clamp-2 leading-snug">
                    {post.title}
                  </h2>

                  {/* 내용 미리보기 */}
                  <p className="text-sm text-gray-500 line-clamp-3 flex-1 leading-relaxed">
                    {post.content}
                  </p>
                </div>

                {/* 카드 푸터 */}
                <div className="px-5 pb-5 flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    {formatDate(post.pubDate || post.createdAt)}
                  </span>
                  {/* 더보기 버튼 - 티스토리 원문 연결 */}
                  
                    href={post.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full transition-colors"
                  >
                    더보기 →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-full text-sm border border-gray-300 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ← 이전
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-9 h-9 rounded-full text-sm font-medium transition-all ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "border border-gray-300 hover:bg-gray-100 text-gray-600"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-full text-sm border border-gray-300 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              다음 →
            </button>
          </div>
        )}

        {/* 총 게시글 수 */}
        {!loading && (
          <p className="text-center text-xs text-gray-400 mt-6">
            총 {filtered.length}개의 게시글
          </p>
        )}
      </div>
    </div>
  );
}
