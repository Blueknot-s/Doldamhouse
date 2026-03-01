import React, { useState } from 'react';
import { Send, MapPin, Phone, Mail } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from "firebase/firestore"; // Firebase 도구
import { db } from "../firebase/config"; // 아까 만든 설정 파일

const Contact: React.FC = () => {
    // 1. 입력 데이터를 담을 바구니(상태) 만들기
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        type: '전원주택 문의',
        message: '',
        privacy: false
    });

    // 2. 입력 시 바구니에 데이터를 담는 함수
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setFormData(prev => ({ ...prev, [name]: val }));
    };

    // 3. '보내기' 버튼 클릭 시 Firebase에 저장하는 함수
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.privacy) {
            alert("개인정보 수집 동의에 체크해주세요.");
            return;
        }

        try {
            // 'inquiries'라는 이름의 컬렉션에 데이터를 저장합니다.
            await addDoc(collection(db, "inquiries"), {
                name: formData.name,
                phone: formData.phone,
                type: formData.type,
                message: formData.message,
                createdAt: serverTimestamp() // 저장된 시간 자동 기록
            });

            alert("상담 요청이 성공적으로 접수되었습니다. 곧 연락드리겠습니다!");
            // 입력 칸 초기화
            setFormData({ name: '', phone: '', type: '전원주택 문의', message: '', privacy: false });
        } catch (error) {
            console.error("Error adding document: ", error);
            alert("오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        }
    };

    return (
        <div className="w-full pt-20 bg-gray-50 min-h-screen">
            <div className="container mx-auto px-6 py-12">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-12">Contact.</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* 왼쪽 정보 컬럼 */}
                    <div className="space-y-12">
                        <div>
                            <h3 className="text-2xl font-bold mb-6">Get in Touch</h3>
                            <p className="text-gray-600 mb-8 leading-relaxed">
                                돌담하우스는 여러분의 소중한 보금자리를 위해 언제나 열려있습니다.
                                상담요청을 남겨주시면 담당자가 빠른 시일 내에 연락드리겠습니다.
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-start">
                                    <MapPin className="w-6 h-6 text-doldam-accent mr-4 mt-1" />
                                    <div>
                                        <h4 className="font-bold">Address</h4>
                                        <p className="text-gray-600">제주특별자치도 제주시 한경면 고산로8길 4-101</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <Phone className="w-6 h-6 text-doldam-accent mr-4 mt-1" />
                                    <div>
                                        <h4 className="font-bold">Phone</h4>
                                        <p className="text-gray-600">064-772-3697</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <Mail className="w-6 h-6 text-doldam-accent mr-4 mt-1" />
                                    <div>
                                        <h4 className="font-bold">Email</h4>
                                        <p className="text-gray-600">kangh_7@naver.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 구글 지도 (src 주소는 실제 지도로 추후 교체 필요) */}
                        <div className="w-full h-96 bg-gray-200 rounded-lg overflow-hidden relative grayscale hover:grayscale-0 transition-all shadow-lg border border-gray-200">
                            <iframe
                                title="Google Map" width="100%" height="100%" frameBorder="0" scrolling="no"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3332.2356561163475!2d126.1685834!3d33.3051408!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x356ca93d629a8a6f%3A0xc3f5c786a3d9078!2z7KCc7KO87Yq567OE7J6Q7LmY64-EIOygnOyekOyLnCDtlZzqsr3rqbQg6rOg7IKw66GcOOq4uCA0LTEwMQ!5e0!3m2!1sko!2skr!4v1710000000000"
                            ></iframe>
                        </div>
                    </div>

                    {/* 오른쪽 상담 폼 */}
                    <div className="bg-white p-8 md:p-12 shadow-2xl">
                        <h3 className="text-2xl font-bold mb-8">상담요청</h3>
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold mb-2">이름</label>
                                    <input name="name" value={formData.name} onChange={handleChange} type="text" required className="w-full border-b-2 border-gray-200 py-2 focus:outline-none focus:border-doldam-accent transition-colors bg-transparent" placeholder="홍길동" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2">연락처</label>
                                    <input name="phone" value={formData.phone} onChange={handleChange} type="tel" required className="w-full border-b-2 border-gray-200 py-2 focus:outline-none focus:border-doldam-accent transition-colors bg-transparent" placeholder="010-0000-0000" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2">문의유형</label>
                                <select name="type" value={formData.type} onChange={handleChange} className="w-full border-b-2 border-gray-200 py-2 focus:outline-none focus:border-doldam-accent transition-colors bg-transparent">
                                    <option>전원주택 문의</option>
                                    <option>농촌주택개량지원사업 문의</option>
                                    <option>돌담시공 문의</option>
                                    <option>기타</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2">내용</label>
                                <textarea name="message" value={formData.message} onChange={handleChange} rows={4} required className="w-full border-b-2 border-gray-200 py-2 focus:outline-none focus:border-doldam-accent transition-colors bg-transparent resize-none" placeholder="문의하실 내용을 자유롭게 적어주세요."></textarea>
                            </div>

                            <div className="flex items-center gap-2 mb-4">
                                <input type="checkbox" id="privacy" name="privacy" checked={formData.privacy} onChange={handleChange} className="accent-doldam-accent" />
                                <label htmlFor="privacy" className="text-xs text-gray-500 cursor-pointer">
                                    개인정보 수집 및 활용에 동의합니다.
                                </label>
                            </div>

                            <button type="submit" className="w-full bg-black text-white py-4 font-bold uppercase tracking-widest hover:bg-doldam-accent transition-colors flex items-center justify-center gap-2">
                                <span>보내기</span>
                                <Send size={16} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;