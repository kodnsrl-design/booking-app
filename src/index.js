import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// ① PWA: 서비스 워커 등록
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// ② 서비스 워커 등록: 오프라인 사용 및 캐싱
serviceWorkerRegistration.register();

// ③ 기존 성능 측정 코드
reportWebVitals();