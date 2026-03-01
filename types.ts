export enum ProjectCategory {
  COUNTRY_HOUSE = '전원주택',
  RURAL_IMPROVEMENT = '농촌주택개량지원사업',
  STONE_WALL = '돌담시공'
}

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  location: string;
  price?: string;
  description: string;
  images: string[]; // ★ imageUrl 대신 images(배열)를 사용합니다.
  imageUrl?: string; // 기존 데이터와의 호환성을 위해 남겨둡니다.
  specs?: string; 
  date: string; 
  lat?: number; // 위도
  lng?: number; // 경도
}

export enum NewsCategory {
  SITE_NEWS = '현장소식',
  COUNTRY_HOUSE_NEWS = '전원주택소식',
  JEJU_NEWS = '제주소식'
}

export interface NewsItem {
  id: string;
  title: string;
  category: NewsCategory;
  date: string;
  summary: string;
  description?: string; // 상세 내용을 위해 추가합니다.
  images?: string[]; // 뉴스에도 여러 장의 사진을 올릴 수 있게 추가합니다.
  imageUrl?: string;
}