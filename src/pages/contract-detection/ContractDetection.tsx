/* eslint-disable prettier/prettier */
/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-08-26 10:16:45
 * @LastEditors: didadida262
 * @LastEditTime: 2024-09-02 18:12:26
 */
import cn from "classnames";

import { Detection } from "./Components/Detection";
import { Explorer } from "./Components/Explorer";
import { WorkBench } from "./Components/WorkBench";
import styles from "./ContractDetection.module.less";
import { ContractProvider } from "./ContractStore";

export function ContractDetection() {
  return (
    <div className={styles.contractDetection}>
      {/* <AppBreadcrumb breadCrumbItems={breadCrumbItems} /> */}
      <div className={cn(styles.workspace, "flex max-w-full gap-x-2")}>
        <ContractProvider>
          <Explorer />
          <WorkBench />
          <Detection />
        </ContractProvider>
      </div>
    </div>
  );
}
