import React, { useEffect, useRef, useState } from 'react';
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";
import { useNavigate } from 'react-router-dom';

const ProjectMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);

  // 마커와 클러스터러를 관리하기 위한 Ref
  const markersRef = useRef<any[]>([]);
  const clustererRef = useRef<any>(null);

  const navigate = useNavigate();

  // 1. 구글 맵 초기화 (최초 1회)
  useEffect(() => {
    if (!mapRef.current) return;
    if (!(window as any).google) {
      console.error("Google Maps API not loaded");
      return;
    }

    const jejuCenter = { lat: 33.38, lng: 126.55 };
    const map = new (window as any).google.maps.Map(mapRef.current, {
      zoom: 10,
      center: jejuCenter,
      mapId: "DEMO_MAP_ID",
      disableDefaultUI: false,
      zoomControl: true,
      streetViewControl: false,
      mapTypeControl: false,
      styles: [
        {
          "featureType": "all",
          "elementType": "geometry",
          "stylers": [{ "color": "#f5f5f5" }]
        },
        {
          "featureType": "water",
          "elementType": "geometry",
          "stylers": [{ "color": "#c9c9c9" }]
        }
      ]
    });

    setMapInstance(map);
  }, []);

  // 2. 실시간 데이터 리스너 등록 및 마커 업데이트
  useEffect(() => {
    if (!mapInstance) return;

    // projects 컬렉션 구독
    const q = query(collection(db, "projects"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      // 기존 마커 및 클러스터 제거
      if (clustererRef.current) {
        clustererRef.current.clearMarkers();
      }
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];

      // 데이터 매핑
      const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      // lat, lng가 있는 데이터만 필터링
      const validProjects = projects.filter(p => p.lat && p.lng);

      // 새 마커 생성
      const newMarkers = validProjects.map((project) => {
        const marker = new (window as any).google.maps.Marker({
          position: { lat: project.lat, lng: project.lng },
          map: mapInstance,
          title: project.title,
          icon: {
            path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z",
            fillColor: "#E85C41",
            fillOpacity: 1,
            strokeWeight: 1,
            strokeColor: "#FFFFFF",
            scale: 2,
            anchor: new (window as any).google.maps.Point(12, 22),
          }
        });

        // 커스텀 InfoWindow HTML
        const infoWindowContent = `
          <div style="width: 240px; font-family: 'Noto Sans KR', sans-serif;">
            <div style="position: relative; width: 100%; aspect-ratio: 16/9; background-color: #eee; border-radius: 8px 8px 0 0; overflow: hidden;">
              <img src="${project.images?.[0] || project.imageUrl || 'https://picsum.photos/300/200'}" style="width: 100%; height: 100%; object-fit: cover;" alt="${project.title}" />
            </div>
            <div style="padding: 16px;">
              <h3 style="font-size: 16px; font-weight: bold; margin: 0 0 4px 0; color: #1a1a1a;">${project.title}</h3>
              <p style="font-size: 12px; color: #888; margin: 0 0 12px 0;">${project.location}</p>
              <button id="btn-${project.id}" style="width: 100%; padding: 8px 0; background-color: #1a1a1a; color: white; border: none; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; cursor: pointer; border-radius: 2px;">
                View Details
              </button>
            </div>
          </div>
        `;

        const infoWindow = new (window as any).google.maps.InfoWindow({
          content: infoWindowContent,
          maxWidth: 280,
        });

        marker.addListener("click", () => {
          infoWindow.open({
            anchor: marker,
            map: mapInstance,
            shouldFocus: false,
          });
        });

        // InfoWindow 내부 버튼 클릭 이벤트 처리
        (window as any).google.maps.event.addListener(infoWindow, 'domready', () => {
          const btn = document.getElementById(`btn-${project.id}`);
          if (btn) {
            btn.addEventListener("click", () => {
              navigate(`/projects/${project.id}`);
            });
          }
        });

        return marker;
      });

      markersRef.current = newMarkers;

      // 마커 클러스터러 적용
      if ((window as any).markerClusterer) {
        clustererRef.current = new (window as any).markerClusterer.MarkerClusterer({
          map: mapInstance,
          markers: newMarkers,
          renderer: {
            render: ({ count, position }: any) => {
              return new (window as any).google.maps.Marker({
                position,
                label: { text: String(count), color: "white", fontWeight: "bold" },
                icon: {
                  path: (window as any).google.maps.SymbolPath.CIRCLE,
                  scale: 20,
                  fillColor: "#1a1a1a",
                  fillOpacity: 0.9,
                  strokeWeight: 2,
                  strokeColor: "#E85C41",
                },
                zIndex: Number((window as any).google.maps.Marker.MAX_ZINDEX) + count,
              });
            }
          }
        });
      }

    });

    return () => unsubscribe();
  }, [mapInstance, navigate]);

  return (
    <div className="w-full h-[600px] bg-gray-100 border border-gray-100 rounded-sm relative overflow-hidden shadow-2xl">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};

export default ProjectMap;