/* eslint-disable prettier/prettier */
/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-08-26 10:16:45
 * @LastEditors: didadida262
 * @LastEditTime: 2024-09-29 22:48:06
 */
import { Col, Row } from "antd";
import cn from "classnames";

import { AppBreadcrumb } from "@/components/Breadcrumb";

import styles from "./DetectionChart.module.less";
import { DetectionDetail } from "./DetectionDetail";
import { DetectionStatisticColumn } from "./DetectionStatisticColumn";
import { VulnerabilityStatistics } from "./VulnerabilityStatisticsPie";

const breadCrumbItems = [
  {
    menuHref: "/threat-detection",
    menuName: "威胁感知"
  },
  {
    menuHref: "/threat-detection/detection-chart",
    menuName: "查看报表",
    isLeftMenu: true
  }
];

export function DetectionChartAfterChain() {
  return (
    <div className={styles.detectionChart}>
      {/* <AppBreadcrumb breadCrumbItems={breadCrumbItems} /> */}
      <div
        className={cn(styles.chart, "flex w-full flex-col gap-y-[10px] h-full")}
      >
        <Row gutter={[10, 10]}>
          <Col span={10}>
            <VulnerabilityStatistics />
          </Col>
          <Col span={14}>
            <DetectionStatisticColumn />
          </Col>
        </Row>
        <div className="rounded bg-white max-h-[calc(100%_-_400px)] ">
          <DetectionDetail />
        </div>
      </div>
    </div>
  );
}
