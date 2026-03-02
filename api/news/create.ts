import { VercelRequest, VercelResponse } from '@vercel/node';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            process.env.VITE_FIREBASE_API_KEY,
  authDomain:        process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.VITE_FIREBASE_APP_ID,
};

// Vercel 서버리스 환경에서 cold start 시 중복 초기화 방지
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

// n8n AI 카테고리 → 홈페이지 NewsCategory 매핑
const CATEGORY_MAP: Record<string, string> = {
  '부동산':   '전원주택소식',
  '전원주택': '전원주택소식',
  '현장':     '현장소식',
  '생활':     '현장소식',
  '문화':     '현장소식',
  '지역소식': '현장소식',
  '제주':     '제주소식',
  // 이미 올바른 값이 들어올 경우 그대로 통과
  '현장소식':     '현장소식',
  '전원주택소식': '전원주택소식',
  '제주소식':     '제주소식',
};

const VALID_CATEGORIES = ['현장소식', '전원주택소식', '제주소식'];

function mapCategory(raw: string | undefined): string {
  if (!raw) return '현장소식';
  for (const [key, val] of Object.entries(CATEGORY_MAP)) {
    if (raw.includes(key)) return val;
  }
  return VALID_CATEGORIES.includes(raw) ? raw : '현장소식';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  // 인증 확인
  const authHeader = req.headers['authorization'] || '';
  const expectedToken = process.env.N8N_API_SECRET || 'doldamhouse-news-secret-2026';
  if (authHeader !== `Bearer ${expectedToken}`) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  try {
    const { title, content, summary, category, author, sourceUrl, thumbnail, images } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'title과 content는 필수입니다.' });
    }

    const today = new Date().toISOString().split('T')[0];

    const docData = {
      title:     title.trim(),
      content,                          // HTML (news-article 래퍼 포함)
      summary:   summary?.trim() || content.replace(/<[^>]+>/g, '').slice(0, 150) + '...',
      category:  mapCategory(category),
      author:    author || '돌담하우스',
      sourceUrl: sourceUrl || '',
      imageUrl:  thumbnail || (Array.isArray(images) && images[0]) || '',
      images:    Array.isArray(images) ? images : [],
      date:      today,
      createdAt: serverTimestamp(),
      source:    'tistory-n8n',
    };

    const docRef = await addDoc(collection(db, 'news'), docData);

    return res.status(200).json({
      success: true,
      id:      docRef.id,
      message: '뉴스가 성공적으로 등록되었습니다.',
    });
  } catch (error: any) {
    console.error('[news/create] error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
