import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";

/**
 * n8n Webhook으로부터 티스토리 포스팅 데이터를 수신하여 Firestore에 저장하는 예시 함수입니다.
 * 실제 구현 시에는 별도의 Backend(Next.js API routes 등)나 Firebase Functions에서 
 * 엔드포인트를 노출해야 합니다.
 * 
 * 여기서는 프로젝트 구조 내에 로직을 정의하여 자동화 구축의 기반을 마련합니다.
 */
export const handleTistoryWebhook = async (data: {
    title: string;
    content: string;
    category?: string;
    imageUrl?: string;
    date?: string;
}) => {
    try {
        const newsRef = collection(db, "news");

        // HTML 태그 제거 후 요약문 생성 (간이형)
        const summary = data.content
            .replace(/<[^>]*>?/gm, '')
            .substring(0, 150) + "...";

        const docData = {
            title: data.title,
            content: data.content, // 원본 HTML 포함
            summary: summary,
            category: data.category || "General",
            imageUrl: data.imageUrl || "",
            date: data.date || new Date().toISOString().split('T')[0],
            createdAt: serverTimestamp(),
            source: "tistory-n8n"
        };

        const docRef = await addDoc(newsRef, docData);
        console.log("Tistory news added with ID: ", docRef.id);
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error("Error adding Tistory news:", error);
        return { success: false, error };
    }
};
