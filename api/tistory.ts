import { VercelRequest, VercelResponse } from '@vercel/node';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

// Vercel serverless function for Tistory Webhook
// This provides a live endpoint: https://<your-domain>/api/tistory

const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const data = req.body;

        // Simple validation
        if (!data.title || !data.content) {
            return res.status(400).json({ message: 'Missing title or content' });
        }

        const newsRef = collection(db, "news");
        const summary = data.content
            .replace(/<[^>]*>?/gm, '')
            .substring(0, 150) + "...";

        const docData = {
            title: data.title,
            content: data.content,
            summary: summary,
            category: data.category || "General",
            imageUrl: data.imageUrl || "",
            date: data.date || new Date().toISOString().split('T')[0],
            createdAt: serverTimestamp(),
            source: "tistory-n8n"
        };

        const docRef = await addDoc(newsRef, docData);

        return res.status(200).json({
            success: true,
            id: docRef.id,
            message: 'News added successfully from Tistory'
        });
    } catch (error: any) {
        console.error("Webhook error:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
}
