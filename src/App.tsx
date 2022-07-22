import './App.less';

import { Navigate, Route, Routes } from 'react-router-dom';

import { AppLayout } from '@/components/AppLayout';
import NoFoundPage from '@/pages/404';

import { AddressAnalysis } from './pages/address-analysis';
import { ContractDetection } from './pages/contract-detection';
import { DataScreens } from './pages/data-screens';
import { DataStore } from './pages/data-store';
import { DetectionChart } from './pages/detection-chart';
import { TransactionGraph } from './pages/transaction-graph';

function App() {
  return (
    <AppLayout>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/data-store" replace={true} />}
        />
        <Route path="/404" element={<NoFoundPage />} />
        <Route path="/data-store" element={<DataStore />} />
        <Route
          path="/threat-detection/contract-detection"
          element={<ContractDetection />}
        />
        <Route
          path="/threat-detection/detection-chart"
          element={<DetectionChart />}
        />
        <Route
          path="/threat-evidence/address-analysis"
          element={<AddressAnalysis />}
        />
        <Route
          path="/threat-evidence/transaction-graph"
          element={<TransactionGraph />}
        />
        <Route path="/data-screens" element={<DataScreens />} />
      </Routes>
    </AppLayout>
  );
}

export default App;
