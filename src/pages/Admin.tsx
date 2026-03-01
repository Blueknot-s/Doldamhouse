import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp, getDocs, doc, deleteDoc, updateDoc, query, orderBy } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db, storage } from "../firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { ProjectCategory, NewsCategory } from '../types';
import { LogOut, Trash2, Edit3, Plus, Search, Image as ImageIcon, MapPin, Tag, FileText, Calendar, LayoutGrid, ArrowLeft, Eye, Edit2, X } from 'lucide-react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize-module-react';

// Register ImageResize module
Quill.register('modules/imageResize', ImageResize);

const Admin: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'projects' | 'news' | 'gallery'>('projects');
  const [viewMode, setViewMode] = useState<'list' | 'form'>('list');
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const navigate = useNavigate();
  const quillRef = useRef<ReactQuill>(null);

  // Form States
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    location: '',
    imageUrl: '',
    description: '',
    date: '',
    images: [] as string[], // For gallery multi-image upload
  });

  // Quill Modules & Formats
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
        ['link', 'image'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    },
    imageResize: {
      parchment: Quill.import('parchment'),
      modules: ['Resize', 'DisplaySize']
    }
  }), []);

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image',
    'color', 'background',
    'align'
  ];

  // Image Handler for Quill
  function imageHandler() {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files ? input.files[0] : null;
      if (!file) return;

      const storageRef = ref(storage, `editor/${Date.now()}_${file.name}`);
      try {
        const snapshot = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(snapshot.ref);
        const quill = quillRef.current?.getEditor();
        const range = quill?.getSelection();
        if (quill && range) {
          quill.insertEmbed(range.index, 'image', url);
        }
      } catch (error) {
        console.error("Image upload failed:", error);
        alert("이미지 업로드에 실패했습니다.");
      }
    };
  }

  // Gallery Multi-Image Upload Handler
  const handleGalleryUpload = async (files: File[]) => {
    const newImages: string[] = [];
    setLoading(true);
    try {
      for (const file of files) {
        const storageRef = ref(storage, `${activeTab}/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(snapshot.ref);
        newImages.push(url);
      }
      setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
    } catch (error) {
      console.error("Gallery upload failed:", error);
      alert("이미지 업로드에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleGalleryUpload(Array.from(e.target.files));
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      handleGalleryUpload(Array.from(e.dataTransfer.files));
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };


  const removeGalleryImage = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }));
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (!u) {
        navigate('/login');
      } else {
        setUser(u);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // 2. Fetch Data
  const fetchItems = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, activeTab), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Fetch error:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchItems();
      resetForm();
      setViewMode('list');
    }
  }, [activeTab, user]);

  // 3. Helper: Geocoding Function
  const getCoordinates = async (address: string): Promise<{ lat: number; lng: number } | null> => {
    return new Promise((resolve) => {
      if (!(window as any).google || !(window as any).google.maps) {
        resolve(null);
        return;
      }
      const geocoder = new (window as any).google.maps.Geocoder();
      geocoder.geocode({ address: address }, (results: any, status: any) => {
        if (status === 'OK' && results[0]) {
          const lat = results[0].geometry.location.lat();
          const lng = results[0].geometry.location.lng();
          resolve({ lat, lng });
        } else {
          resolve(null);
        }
      });
    });
  };

  // 4. Form Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (content: string) => {
    setFormData(prev => ({ ...prev, description: content }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return alert("제목은 필수입니다.");

    setLoading(true);
    try {
      const dataToSave: any = {
        title: formData.title,
        updatedAt: serverTimestamp(),
      };

      // Common fields
      dataToSave.date = formData.date || new Date().toISOString().split('T')[0];

      if (activeTab === 'projects') {
        dataToSave.category = formData.category;
        dataToSave.location = formData.location;
        dataToSave.description = formData.description; // HTML content
        // Use first image from gallery upload or manual URL
        const mainImage = formData.images.length > 0 ? formData.images[0] : formData.imageUrl;
        if (mainImage) {
          dataToSave.imageUrl = mainImage;
          dataToSave.images = formData.images.length > 0 ? formData.images : [mainImage];
        }

        if (formData.location) {
          const coords = await getCoordinates(formData.location);
          if (coords) {
            dataToSave.lat = coords.lat;
            dataToSave.lng = coords.lng;
          }
        }
      } else if (activeTab === 'news') {
        dataToSave.category = formData.category;
        dataToSave.content = formData.description; // HTML content
        // Extract summary from HTML (remove tags and take first 100 chars)
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = formData.description;
        const textContent = tempDiv.textContent || tempDiv.innerText || "";
        dataToSave.summary = textContent.substring(0, 100) + (textContent.length > 100 ? "..." : "");

        const mainImage = formData.images.length > 0 ? formData.images[0] : formData.imageUrl;
        if (mainImage) {
          dataToSave.imageUrl = mainImage;
          dataToSave.images = formData.images.length > 0 ? formData.images : [mainImage];
        }
      } else if (activeTab === 'gallery') {
        dataToSave.description = formData.description; // HTML content
        dataToSave.images = formData.images;
        if (formData.images.length > 0) {
          dataToSave.imageUrl = formData.images[0]; // Representative image
        } else if (formData.imageUrl) {
          dataToSave.imageUrl = formData.imageUrl;
          dataToSave.images = [formData.imageUrl];
        }
      }

      if (editingId) {
        await updateDoc(doc(db, activeTab, editingId), dataToSave);
        alert("성공적으로 수정되었습니다.");
      } else {
        dataToSave.createdAt = serverTimestamp();
        await addDoc(collection(db, activeTab), dataToSave);
        alert("성공적으로 등록되었습니다.");
      }

      resetForm();
      setViewMode('list');
      fetchItems();
    } catch (error) {
      console.error(error);
      alert("저장 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("정말로 삭제하시겠습니까? 복구할 수 없습니다.")) {
      try {
        await deleteDoc(doc(db, activeTab, id));
        fetchItems();
      } catch (e) {
        alert("삭제 실패");
      }
    }
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setFormData({
      title: item.title || '',
      category: item.category || '',
      location: item.location || '',
      imageUrl: item.imageUrl || '',
      description: item.description || item.content || '', // Load HTML content
      date: item.date || '',
      images: item.images || [],
    });
    setViewMode('form');
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: '',
      category: '',
      location: '',
      imageUrl: '',
      description: '',
      date: '',
      images: [],
    });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 font-sans text-doldam-dark">
      <div className="container mx-auto px-6 max-w-6xl">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 pb-6 border-b border-gray-200">
          <div>
            <h1 className="text-3xl font-bold tracking-tight uppercase">Doldam Admin</h1>
            <p className="text-sm text-gray-500 mt-1">Logged in as <span className="font-bold text-black">{user.email}</span></p>
          </div>
          <button
            onClick={() => signOut(auth)}
            className="mt-4 md:mt-0 flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-600 hover:text-red-600 hover:border-red-200 rounded-sm text-xs font-bold uppercase tracking-widest transition-all shadow-sm"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-4 mb-8">
          {[
            { id: 'projects', label: 'Projects' },
            { id: 'news', label: 'News' },
            { id: 'gallery', label: 'Gallery' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-8 py-3.5 rounded-sm text-xs font-bold uppercase tracking-widest transition-all shadow-sm ${activeTab === tab.id ? 'bg-doldam-dark text-white shadow-xl' : 'bg-white text-gray-400 hover:bg-gray-100'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-sm shadow-2xl border border-gray-100 overflow-hidden min-h-[600px]">

          <div className="p-7 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
              {viewMode === 'list' ? `${activeTab} List` : (editingId ? 'Edit Item' : 'New Item')}
              <span className="text-[10px] bg-doldam-accent text-white px-3 py-1 rounded-full">{activeTab}</span>
            </h2>
            {viewMode === 'list' ? (
              <button
                onClick={() => { resetForm(); setViewMode('form'); }}
                className="flex items-center gap-2 bg-doldam-accent text-white px-6 py-3 rounded-sm text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all shadow-lg active:scale-95"
              >
                <Plus size={16} /> New {activeTab}
              </button>
            ) : (
              <button
                onClick={() => setViewMode('list')}
                className="text-gray-400 hover:text-black text-xs font-bold uppercase tracking-widest flex items-center gap-2"
              >
                <ArrowLeft size={14} /> Back to List
              </button>
            )}
          </div>

          {viewMode === 'list' && (
            <div className="p-0 animate-fadeIn">
              {loading ? (
                <div className="p-24 text-center text-gray-400 animate-pulse font-bold tracking-widest uppercase">Loading items...</div>
              ) : items.length === 0 ? (
                <div className="p-32 text-center text-gray-400 bg-gray-50 m-8 border-2 border-dashed border-gray-200 rounded-sm">
                  <Search className="mx-auto w-12 h-12 mb-6 opacity-10" />
                  <p className="font-bold tracking-widest uppercase">No items found in {activeTab}</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {items.map((item) => (
                    <div key={item.id} className="p-7 flex items-center justify-between hover:bg-gray-50 transition-colors group">
                      <div className="flex items-center gap-8">
                        <div className="w-24 h-24 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0 border border-gray-200 shadow-inner">
                          {(item.imageUrl || (item.images && item.images[0])) ? (
                            <img src={item.imageUrl || item.images[0]} alt="thumb" className="w-full h-full object-cover transform transition-transform group-hover:scale-110" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300"><ImageIcon size={24} /></div>
                          )}
                        </div>
                        <div>
                          {item.category && (
                            <span className="text-[9px] font-bold text-doldam-accent uppercase tracking-[0.2em] bg-doldam-accent/10 px-2 py-1 rounded-sm">
                              {item.category}
                            </span>
                          )}
                          <h3 className="font-bold text-xl mt-2 text-gray-900 group-hover:text-doldam-accent transition-colors tracking-tight">{item.title}</h3>
                          <p className="text-xs text-gray-400 mt-2 flex items-center gap-4 font-medium uppercase tracking-wider">
                            {item.location && <span className="flex items-center gap-1"><MapPin size={12} /> {item.location}</span>}
                            {item.date && <span className="flex items-center gap-1"><Calendar size={12} /> {item.date}</span>}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(item)} className="p-3 text-gray-400 hover:text-black hover:bg-white rounded-full transition-all border border-transparent hover:border-gray-200 shadow-sm"><Edit3 size={20} /></button>
                        <button onClick={() => handleDelete(item.id)} className="p-3 text-gray-400 hover:text-red-500 hover:bg-white rounded-full transition-all border border-transparent hover:border-red-100 shadow-sm"><Trash2 size={20} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {viewMode === 'form' && (
            <form onSubmit={handleSubmit} className="p-10 max-w-4xl mx-auto animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div className="space-y-3 col-span-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Tag size={12} /> Item Title (제목)</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full p-4 border border-gray-200 rounded-sm focus:border-doldam-accent focus:ring-0 focus:outline-none transition-all bg-gray-50 focus:bg-white text-lg font-bold"
                    placeholder="제목을 입력하세요"
                    required
                  />
                </div>

                {activeTab !== 'gallery' && (
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><LayoutGrid size={12} /> Category (분류)</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full p-4 border border-gray-200 rounded-sm focus:border-doldam-accent focus:outline-none bg-gray-50 focus:bg-white cursor-pointer font-bold"
                      required
                    >
                      <option value="">카테고리 선택</option>
                      {activeTab === 'projects'
                        ? Object.values(ProjectCategory).map(c => <option key={c} value={c}>{c}</option>)
                        : Object.values(NewsCategory).map(c => <option key={c} value={c}>{c}</option>)
                      }
                    </select>
                  </div>
                )}

                {activeTab === 'projects' && (
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><MapPin size={12} /> Location (위치)</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full p-4 border border-gray-200 rounded-sm focus:border-doldam-accent focus:outline-none bg-gray-50 focus:bg-white font-bold"
                      placeholder="예: 제주시 애월읍"
                    />
                  </div>
                )}

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Calendar size={12} /> Date (날짜)</label>
                  <input
                    type="text"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full p-4 border border-gray-200 rounded-sm focus:border-doldam-accent focus:outline-none bg-gray-50 focus:bg-white font-bold"
                    placeholder="예: 2024.03.20"
                  />
                </div>
              </div>

              {/* Multi-Image Upload for Gallery */}
              <div className="space-y-3 mb-10">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><ImageIcon size={12} /> Images (이미지 업로드 - 드래그 앤 드롭 지원)</label>

                {/* Drag and Drop Zone */}
                <div
                  onDrop={onDrop}
                  onDragOver={onDragOver}
                  className="w-full p-12 border-2 border-dashed border-gray-200 rounded-sm bg-gray-50 hover:bg-white hover:border-doldam-accent transition-all flex flex-col items-center justify-center cursor-pointer group"
                  onClick={() => document.getElementById('fileInput')?.click()}
                >
                  <ImageIcon size={48} className="text-gray-300 group-hover:text-doldam-accent mb-4 transition-colors" />
                  <p className="text-sm font-bold text-gray-400 group-hover:text-black">이미지를 여기로 드래그하거나 클릭하여 선택하세요</p>
                  <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-widest">Supports JPG, PNG, WEBP</p>
                  <input
                    id="fileInput"
                    type="file"
                    multiple
                    onChange={onFileChange}
                    className="hidden"
                  />
                </div>

                {/* Image Previews */}
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    {formData.images.map((img, index) => (
                      <div key={index} className="relative group aspect-square overflow-hidden rounded-sm border border-gray-200 shadow-sm">
                        <img src={img} alt={`Preview ${index}`} className="w-full h-full object-cover transform transition-transform group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(index)}
                            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                            title="삭제"
                          >
                            <X size={16} />
                          </button>
                        </div>
                        {index === 0 && (
                          <span className="absolute top-2 left-2 bg-black text-white text-[9px] px-2 py-1 rounded-sm font-bold uppercase tracking-widest opacity-90">Main</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Legacy Single Image URL Input (Optional fallback) */}
                <div className="mt-4">
                  <p className="text-[10px] text-gray-400 mb-2">Or enter image URL directly:</p>
                  <input
                    type="text"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    className="w-full p-4 border border-gray-200 rounded-sm focus:border-doldam-accent focus:outline-none bg-gray-50 focus:bg-white font-mono text-xs"
                    placeholder="https://..."
                  />
                </div>
              </div>

              {/* Rich Text Editor */}
              <div className="space-y-3 mb-10">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><FileText size={12} /> Description (내용)</label>

                <div className="h-96 mb-12">
                  <ReactQuill
                    ref={quillRef}
                    theme="snow"
                    value={formData.description}
                    onChange={handleEditorChange}
                    modules={modules}
                    formats={formats}
                    className="h-full bg-white"
                  />
                </div>
              </div>

              <div className="flex gap-5 border-t border-gray-100 pt-8">
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className="flex-1 py-4 border border-gray-200 text-gray-400 font-bold uppercase tracking-widest hover:bg-gray-50 hover:text-black transition-all rounded-sm text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-[2] py-4 bg-black text-white font-bold uppercase tracking-widest hover:bg-doldam-accent transition-all shadow-2xl disabled:opacity-50 rounded-sm text-xs active:scale-95"
                >
                  {loading ? 'Processing...' : (editingId ? 'Update Content' : 'Publish Content')}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default Admin;