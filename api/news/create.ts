import type { VercelRequest, VercelResponse } from '@vercel/node';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

// ===== Firebase Config =====
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

// ===== Firebase Init (중복 방지) =====
function getFirebaseDB() {
  try {
    if (!firebaseConfig.projectId) {
      throw new Error('Firebase 환경변수가 설정되지 않았습니다.');
    }

    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    return getFirestore(app);
  } catch (err) {
    console.error('[Firebase Init Error]', err);
    throw err;
  }
}

// ===== Category Mapping =====
const CATEGORY_MAP: Record<string, string> = {
  '부동산': '전원주택소식',
  '전원주택': '전원주택소식',
  '현장': '현장소식',
  '생활': '현장소식',
  '문화': '현장소식',
  '지역소식': '현장소식',
  '제주': '제주소식',

  '현장소식': '현장소식',
  '전원주택소식': '전원주택소식',
  '제주소식': '제주소식',
};

const VALID_CATEGORIES = ['현장소식', '전원주택소식', '제주소식'];

function mapCategory(raw?: string): string {
  if (!raw) return '현장소식';

  for (const key in CATEGORY_MAP) {
    if (raw.includes(key)) return CATEGORY_MAP[key];
  }

  return VALID_CATEGORIES.includes(raw) ? raw : '현장소식';
}

// ===== 유틸 =====
function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, '');
}

// ===== 메인 핸들러 =====
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // ===== CORS =====
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method Not Allowed',
    });
  }

  // ===== 인증 =====
  try {
    const authHeader = req.headers['authorization'] || '';
    const expectedToken =
      process.env.N8N_API_SECRET || 'doldamhouse-secret-2026';

    if (authHeader !== `Bearer ${expectedToken}`) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Auth Error',
    });
  }

  // ===== 본문 처리 =====
  const {
    title,
    content,
    summary,
    category,
    author,
    sourceUrl,
    thumbnail,
    images,
  } = req.body || {};

  if (!title || !content) {
    return res.status(400).json({
      success: false,
      message: 'title과 content는 필수입니다.',
    });
  }

  const today = new Date().toISOString().split('T')[0];

  const docData = {
    title: title.trim(),
    content,
    summary:
      summary?.trim() ||
      stripHtml(content).slice(0, 150) + '...',
    category: mapCategory(category),
    author: author || '돌담하우스',
    sourceUrl: sourceUrl || '',
    imageUrl:
      thumbnail ||
      (Array.isArray(images) && images.length > 0 ? images[0] : ''),
    images: Array.isArray(images) ? images : [],
    date: today,
    createdAt: serverTimestamp(),
    source: 'tistory-n8n',
  };

  // ===== Firestore 저장 (타임아웃 방지) =====
  try {
    const db = getFirebaseDB();

    const savePromise = addDoc(collection(db, 'news'), docData);

    // 8초 타임아웃 설정
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Firestore Timeout')), 8000)
    );

    const docRef: any = await Promise.race([
      savePromise,
      timeoutPromise,
    ]);

    return res.status(200).json({
      success: true,
      id: docRef.id,
      message: '뉴스 등록 성공',
    });
  } catch (error: any) {
    console.error('[news/create error]', error);

    // 🔥 중요: 무조건 응답 반환 (타임아웃 방지)
    return res.status(500).json({
      success: false,
      message: 'DB 저장 실패',
      error: error?.message || 'unknown error',
    });
  }
}
