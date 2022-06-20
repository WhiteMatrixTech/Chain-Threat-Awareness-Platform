import './App.less';

import { Navigate, Route, Routes } from 'react-router-dom';

import { AppLayout } from '@/components/AppLayout';
import NoFoundPage from '@/pages/404';

import { ContractDetection } from './pages/contract-detection';
import { DataStore } from './pages/data-store';

function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/404" replace={true} />} />
        <Route path="/404" element={<NoFoundPage />} />
        <Route path="/data-store" element={<DataStore />} />
        <Route
          path="/threat-detection/contract-detection"
          element={<ContractDetection />}
        />
      </Routes>
    </AppLayout>
  );
}

export default App;
