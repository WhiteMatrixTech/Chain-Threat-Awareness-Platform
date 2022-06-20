import './App.less';

import { Navigate, Route, Routes } from 'react-router-dom';

import { AppLayout } from '@/components/AppLayout';
import NoFoundPage from '@/pages/404';

function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/404" replace={true} />} />
        <Route path="/404" element={<NoFoundPage />} />
      </Routes>
    </AppLayout>
  );
}

export default App;
