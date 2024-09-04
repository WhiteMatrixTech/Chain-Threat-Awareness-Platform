/* eslint-disable prettier/prettier */
/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-08-26 10:16:45
 * @LastEditors: didadida262
 * @LastEditTime: 2024-09-04 18:10:02
 */
import "./App.less";

import { Navigate, Route, Routes } from "react-router-dom";

import { AppLayout } from "@/components/AppLayout";
import NoFoundPage from "@/pages/404";
import { BitcoinmixedcoinDetection } from "@/pages/bitcoinmixedcoin-detection";
import { BitcoinmixedcoinDetectionResult } from "@/pages/bitcoinmixedcoin-detection/bitcoinmixedcoin-detectionResult";
import { ChaincodevulnerabilityDetection } from "@/pages/chaincodevulnerability-detection";
import { ChaincodevulnerabilityDetectionResult } from "@/pages/chaincodevulnerability-detection/chaincodevulnerability-detectionResult";
import { CrossChain } from "@/pages/cross-chain";
import { CrossChainResult } from "@/pages/cross-chain/cross-chainResult";
import { FewidentityInference } from "@/pages/fewidentity-inference";
import { FewidentityInferenceResult } from "@/pages/fewidentity-inference/fewidentity-inferenceResult";
import { IdentityInference } from "@/pages/identity-inference";
import { IdentityInferenceResult } from "@/pages/identity-inference/IdentityInferenceResult";
import { MaliciousTransaction } from "@/pages/malicious-transaction";
import { MaliciousTransactionResult } from "@/pages/malicious-transaction/malicious-transactionResult";

import { AddressAnalysis } from "./pages/address-analysis";
import { ContractDetection } from "./pages/contract-detection";
import { DataScreens } from "./pages/data-screens";
import { DataStore } from "./pages/data-store";
import { DetectionAttack } from "./pages/detection-attack";
import { DetectionChart } from "./pages/detection-chart";
import { DetectionFish } from "./pages/detection-fish";
import { DetectionPrivacy } from "./pages/detection-privacy";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { TransactionGraph } from "./pages/transaction-graph";

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
          path="/threat-evidence/fewidentity-inference/result"
          element={<FewidentityInferenceResult />}
        />
        <Route
          path="/threat-evidence/malicious-transaction"
          element={<MaliciousTransaction />}
        />
        <Route
          path="/threat-evidence/malicious-transaction/result"
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
          path="/threat-evidence/chaincodevulnerability-detection/result"
          element={<ChaincodevulnerabilityDetectionResult />}
        />

        <Route
          path="/threat-evidence/bitcoinmixedcoin-detection"
          element={<BitcoinmixedcoinDetection />}
        />
        <Route
          path="/threat-evidence/bitcoinmixedcoin-detection/result"
          element={<BitcoinmixedcoinDetectionResult />}
        />

        <Route path="/data-screens" element={<DataScreens />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </AppLayout>
  );
}

export default App;
