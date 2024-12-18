/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-09-24 17:31:53
 * @LastEditors: didadida262
 * @LastEditTime: 2024-09-29 22:47:04
 */
/* eslint-disable prettier/prettier */
/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-08-26 10:16:45
 * @LastEditors: didadida262
 * @LastEditTime: 2024-09-24 18:06:30
 */
import './App.less';

import { Navigate, Route, Routes } from 'react-router-dom';

import { AppLayout } from '@/components/AppLayout';
import NoFoundPage from '@/pages/404';
import { BitcoinmixedcoinDetection } from '@/pages/bitcoinmixedcoin-detection';
import { BitcoinmixedcoinDetectionResult } from '@/pages/bitcoinmixedcoin-detection/bitcoinmixedcoin-detectionResult';
import { ChaincodevulnerabilityDetection } from '@/pages/chaincodevulnerability-detection';
import { ChaincodevulnerabilityDetectionResult } from '@/pages/chaincodevulnerability-detection/chaincodevulnerability-detectionResult';
import { CrossChain } from '@/pages/cross-chain';
import { CrossChainResult } from '@/pages/cross-chain/cross-chainResult';
import { FewidentityInference } from '@/pages/fewidentity-inference';
import { FewidentityInferenceResult } from '@/pages/fewidentity-inference/fewidentity-inferenceResult';
import { IdentityInference } from '@/pages/identity-inference';
import { IdentityInferenceResult } from '@/pages/identity-inference/IdentityInferenceResult';
import { MaliciousTransaction } from '@/pages/malicious-transaction';
import { MaliciousTransactionResult } from '@/pages/malicious-transaction/malicious-transactionResult';

import { AddressAnalysis } from './pages/address-analysis';
import { BitcoinmixedcoinDetectionCopied } from './pages/bitcoinmixedcoin-detection-copied';
import { BitcoinmixedcoinDetectionResultCopied } from './pages/bitcoinmixedcoin-detection-copied/bitcoinmixedcoin-detectionResult';
import { ContractDetection } from './pages/contract-detection';
import { DataScreens } from './pages/data-screensV2';
import { DataStore } from './pages/data-store';
import { DetectionAttack } from './pages/detection-attack';
import { DetectionChart } from './pages/detection-chart';
import { DetectionChartAfterChain } from './pages/detection-chart-afterChain';
import { DetectionFish } from './pages/detection-fish';
import { DetectionPrivacy } from './pages/detection-privacy';
import { Login } from './pages/login';
import { MaliciousTransactionCopied } from './pages/malicious-transaction-copied';
import { MaliciousTransactionResultCopied } from './pages/malicious-transaction-copied/malicious-transactionResult';
import { Register } from './pages/register';
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
          path="/threat-detection/detection-chart-afterchain"
          element={<DetectionChartAfterChain />}
        />
        <Route
          path="/threat-detection/detection-privacy"
          element={<DetectionPrivacy />}
        />
        <Route
          path="/threat-detection/detection-attack"
          element={<DetectionAttack />}
        />
        <Route
          path="/threat-detection/detection-fish"
          element={<DetectionFish />}
        />
        <Route
          path="/threat-evidence/address-analysis"
          element={<AddressAnalysis />}
        />
        <Route
          path="/threat-evidence/transaction-graph"
          element={<TransactionGraph />}
        />
        <Route
          path="/threat-evidence/identity-inference"
          element={<IdentityInference />}
        />
        <Route
          path="/threat-evidence/identity-inference/result/:address"
          element={<IdentityInferenceResult />}
        />

        <Route
          path="/threat-evidence/fewidentity-inference"
          element={<FewidentityInference />}
        />
        <Route
          path="/threat-evidence/fewidentity-inference/result/:address/:samples"
          element={<FewidentityInferenceResult />}
        />
        <Route
          path="/threat-evidence/malicious-transaction"
          element={<MaliciousTransaction />}
        />
        <Route
          path="/threat-evidence/malicious-transaction/result/:tx"
          element={<MaliciousTransactionResult />}
        />
        <Route path="/threat-evidence/cross-chain" element={<CrossChain />} />
        <Route
          path="/threat-evidence/cross-chain/result/:tx"
          element={<CrossChainResult />}
        />
        <Route
          path="/threat-evidence/chaincodevulnerability-detection"
          element={<ChaincodevulnerabilityDetection />}
        />
        <Route
          path="/threat-evidence/chaincodevulnerability-detection/result/:name"
          element={<ChaincodevulnerabilityDetectionResult />}
        />

        <Route
          path="/threat-evidence/bitcoinmixedcoin-detection"
          element={<BitcoinmixedcoinDetection />}
        />
        <Route
          path="/threat-evidence/bitcoinmixedcoin-detection/result/:tx"
          element={<BitcoinmixedcoinDetectionResult />}
        />

        {/* 临时添加的路由 */}
        <Route
          path="/threat-evidence/malicious-transaction-copied"
          element={<MaliciousTransactionCopied />}
        />
        <Route
          path="/threat-evidence/malicious-transaction-copied/result/:tx"
          element={<MaliciousTransactionResultCopied />}
        />
        <Route
          path="/threat-evidence/bitcoinmixedcoin-detection-copied"
          element={<BitcoinmixedcoinDetectionCopied />}
        />
        <Route
          path="/threat-evidence/bitcoinmixedcoin-detection-copied/result/:tx"
          element={<BitcoinmixedcoinDetectionResultCopied />}
        />

        <Route path="/data-screens" element={<DataScreens />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </AppLayout>
  );
}

export default App;
