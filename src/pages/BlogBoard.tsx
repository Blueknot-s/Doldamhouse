import React, { useEffect } from 'react';

const BlogBoard: React.FC = () => {
  useEffect(() => {
    // 이 로그가 콘솔에 찍히는지 확인하는 것이 핵심입니다.
    console.log("✅ BlogBoard 컴포넌트가 정상적으로 로드되었습니다!");
    console.log("현재 URL 경로:", window.location.hash || window.location.pathname);
  }, []);

  return (
    <div style={{ 
      padding: '150px 20px', 
      textAlign: 'center', 
      minHeight: '100vh',
      background: '#f8f9fa' 
    }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333' }}>
        🛠️ 블로그 보드 진단 모드
      </h1>
      <p style={{ marginTop: '20px', color: '#666' }}>
        이 화면이 보인다면 라우터 연결은 성공한 것입니다.
      </p>
      <div style={{ 
        marginTop: '30px', 
        padding: '20px', 
        border: '1px solid #ddd', 
        display: 'inline-block',
        background: '#fff'
      }}>
        <p>만약 이 화면은 보이는데 데이터가 없다면,</p>
        <p><strong>다음 단계는 Firebase 연결 설정 확인입니다.</strong></p>
      </div>
    </div>
  );
};

export default BlogBoard;
