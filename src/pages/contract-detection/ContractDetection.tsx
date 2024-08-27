/* eslint-disable prettier/prettier */
/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-08-26 10:16:45
 * @LastEditors: didadida262
 * @LastEditTime: 2024-08-27 15:53:26
 */
import cn from "classnames";

import { AppBreadcrumb } from "@/components/Breadcrumb";

import { Detection } from "./Components/Detection";
import { Explorer } from "./Components/Explorer";
import { WorkBench } from "./Components/WorkBench";
import styles from "./ContractDetection.module.less";
import { ContractProvider } from "./ContractStore";

const breadCrumbItems = [
  {
    menuHref: "/threat-detection",
    menuName: "威胁感知"
  },
  {
    menuHref: "/threat-detection/contract-detection",
    menuName: "合约检测",
    isLeftMenu: true
  }
];

export function ContractDetection() {
  return (
    <div className={styles.contractDetection}>
      {/* <AppBreadcrumb breadCrumbItems={breadCrumbItems} /> */}
      <div
        className={cn(
          styles.workspace,
          "flex max-w-full gap-x-2 overflow-hidden"
        )}
      >
        <ContractProvider>
          <Explorer />
          <WorkBench />
          <Detection />
        </ContractProvider>
      </div>
    </div>
  );
}
