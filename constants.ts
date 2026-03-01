import { Project, ProjectCategory, NewsItem, NewsCategory } from './types';

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: '제주시 애월읍 곽지리',
    category: ProjectCategory.COUNTRY_HOUSE,
    location: 'Jeju Aewol Gwakji-ri',
    price: '₩270,000,000',
    specs: '36py',
    description: '합리적이며 투명한 시공가격, 제주스러움이 녹아 내리는 현대적 전원주택.',
    imageUrl: 'https://picsum.photos/seed/arch1/800/600',
    images: ['https://picsum.photos/seed/arch1/800/600'],
    date: '2024.03'
  },
  {
    id: '2',
    title: '제주시 한경면 두모리',
    category: ProjectCategory.RURAL_IMPROVEMENT,
    location: 'Jeju Hangyeong Dumori',
    price: '₩225,000,000',
    specs: '30py',
    description: '옛집의 고즈넉함을 살리면서 현대적 편리함을 더한 농촌주택 개량 사업.',
    imageUrl: 'https://picsum.photos/seed/arch2/800/600',
    images: ['https://picsum.photos/seed/arch2/800/600'],
    date: '2024.02'
  },
  {
    id: '3',
    title: '제주시 한경면 용수리',
    category: ProjectCategory.COUNTRY_HOUSE,
    location: 'Jeju Hangyeong Yongsu-ri',
    price: '₩300,000,000',
    specs: '25py',
    description: '바람직한 제주의 삶을 위한 맞춤형 설계와 시공.',
    imageUrl: 'https://picsum.photos/seed/arch3/800/600',
    images: ['https://picsum.photos/seed/arch3/800/600'],
    date: '2024.01'
  },
  {
    id: '4',
    title: '서귀포시 대정읍 신도리',
    category: ProjectCategory.STONE_WALL,
    location: 'Seogwipo Daejeong Sindo-ri',
    price: '₩2,300,000,000',
    specs: '31py',
    description: '전통 방식의 돌담 시공으로 제주만의 아이덴티티를 완성합니다.',
    imageUrl: 'https://picsum.photos/seed/arch4/800/600',
    images: ['https://picsum.photos/seed/arch4/800/600'],
    date: '2023.12'
  },
  {
    id: '5',
    title: '서귀포시 남원읍 의귀리',
    category: ProjectCategory.RURAL_IMPROVEMENT,
    location: 'Seogwipo Namwon Uigwi-ri',
    price: '₩300,000,000',
    specs: '40py',
    description: '농촌 주택의 새로운 가치를 발견하고 삶의 질을 높이는 프로젝트.',
    imageUrl: 'https://picsum.photos/seed/arch5/800/600',
    images: ['https://picsum.photos/seed/arch5/800/600'],
    date: '2023.11'
  }
];

export const NEWS_ITEMS: NewsItem[] = [
  {
    id: 'n1',
    title: '2024년 농촌주택개량사업 신청 안내',
    category: NewsCategory.COUNTRY_HOUSE_NEWS,
    date: '2024.03.15',
    summary: '올해 지원사업의 자격 요건 및 신청 절차에 대한 상세 가이드입니다.'
  },
  {
    id: 'n2',
    title: '한경면 용수리 현장 착공 소식',
    category: NewsCategory.SITE_NEWS,
    date: '2024.03.10',
    summary: '새로운 프로젝트가 시작되었습니다. 기초 공사 현장을 공개합니다.'
  },
  {
    id: 'n3',
    title: '제주 건축 조례 변경 사항 정리',
    category: NewsCategory.JEJU_NEWS,
    date: '2024.02.28',
    summary: '건축주분들이 꼭 알아야 할 2024년 변경된 제주 건축 조례입니다.'
  },
  {
    id: 'n4',
    title: '전통 돌담의 미학, 서귀포 현장',
    category: NewsCategory.SITE_NEWS,
    date: '2024.02.15',
    summary: '장인의 손끝에서 완성되는 제주 돌담의 아름다움을 확인하세요.'
  }
];