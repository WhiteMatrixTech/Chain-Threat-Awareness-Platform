/* eslint-disable prettier/prettier */
/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-08-26 10:16:45
 * @LastEditors: didadida262
 * @LastEditTime: 2024-08-29 14:39:38
 */
import "./App.less";

import { Navigate, Route, Routes } from "react-router-dom";

import { AppLayout } from "@/components/AppLayout";
import NoFoundPage from "@/pages/404";
import { FewidentityInference } from "@/pages/fewidentity-inference";
import { IdentityInference } from "@/pages/identity-inference";
import { MaliciousTransaction } from "@/pages/malicious-transaction";

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
          path="/threat-evidence/fewidentity-inference"
          element={<FewidentityInference />}
        />
        <Route
          path="/threat-evidence/malicious-transaction"
          element={<MaliciousTransaction />}
        />
        {/* <Route
          path="/threat-evidence/cross-chain"
          element={<TransactionGraph />}
        />
        <Route
          path="/threat-evidence/chaincodevulnerability-detection"
          element={<TransactionGraph />}
        />
        <Route
          path="/threat-evidence/bitcoinmixedcoin-detection"
          element={<TransactionGraph />}
        /> */}

        <Route path="/data-screens" element={<DataScreens />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </AppLayout>
  );
}

export default App;
