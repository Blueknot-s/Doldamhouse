import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; //
import './index.css'; // Tailwind CSS 스타일 적용

// root 엘리먼트에 리액트 앱을 렌더링합니다.
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);