/* eslint-disable prettier/prettier */
/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-09-06 00:03:37
 * @LastEditors: didadida262
 * @LastEditTime: 2024-09-09 13:47:16
 */
// 身份
export const modelListIdentityMock = [
  {
    name: "BMFF",
    version: "v1.0",
    time: "2024-07-24 21:02",
    x1: "96.07%",
    x2: "检测钓鱼诈骗地址"
  },
  {
    name: "I2GT",
    version: "v1.0",
    time: "2024-08-25 18:38",
    x1: "87.81%",
    x2: "检测十种常见的以太坊身份"
  }
];

// 少样本
export const modelListFewIdentityMock = [
  {
    name: "FLS",
    version: "v1.0",
    time: "2024-08-26 00:53",
    x1: "74.71%",
    x2: "在少样本环境下检测地址身份"
  }
];
// 链码
export const modelListChainCodeMock = [
  {
    name: "CCPre",
    version: "v1.0",
    time: "2024-07-26 10:28",
    x1: "93.52%",
    x2: "常见的五种链码漏洞检测"
  }
];
// 混检
export const modelListBitCoinMock = [
  {
    name: "TSTC",
    version: "v1.0",
    time: "2024-07-30 12:05",
    x1: "92.00%",
    x2: "检测混币交易"
  }
];

// 恶意检测（交易合法）
export const modelListMaliciousMock = [
  {
    name: "T2RNET",
    version: "v1.0",
    time: "2024-08-31 23:28",
    x1: "92.00%",
    x2: "检测非法交易"
  }
];
// 跨链
export const modelListCrossChainMock = [];
