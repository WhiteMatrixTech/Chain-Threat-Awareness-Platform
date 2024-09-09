/* eslint-disable prettier/prettier */
/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-08-29 18:12:27
 * @LastEditors: didadida262
 * @LastEditTime: 2024-09-09 17:16:39
 */
// 模型信息
export const modelColumns: any = [
  {
    title: "模型名称",
    dataIndex: "name",
    width: 120
  },
  {
    title: "模型版本",
    dataIndex: "version",
    width: 120
  },
  {
    title: "模型训练生成时间",
    dataIndex: "time",
    width: 200
  },
  {
    title: "模型检测综合性能f1",
    dataIndex: "x1",
    width: 220
  },
  {
    title: "模型性能",
    dataIndex: "x2",
    width: 220
  }
];
// 自私挖矿检测样例
export const detectionSamplePrivacyColumns: any = [
  {
    title: "检测地址",
    dataIndex: "name"
  },
  {
    title: "检测时间",
    dataIndex: "time"
  },
  {
    title: "检测结果",
    dataIndex: "result",
    width: 150
  }
];
// fish检测样例
export const detectionSampleFishColumns: any = [
  {
    title: "检测地址",
    dataIndex: "name"
  },
  {
    title: "检测时间",
    dataIndex: "time"
  },
  {
    title: "检测结果",
    dataIndex: "result",
    width: 150
  }
];
// 抢跑攻击检测样例
export const detectionSampleAttackColumns: any = [
  {
    title: "检测地址",
    dataIndex: "name"
  },
  {
    title: "检测时间",
    dataIndex: "time"
  },
  {
    title: "检测结果",
    dataIndex: "result",
    width: 150
  }
];
// 身份推断检测样例
export const detectionSampleColumns: any = [
  {
    title: "检测地址",
    dataIndex: "name"
  },
  {
    title: "检测时间",
    dataIndex: "time"
  },
  {
    title: "检测结果",
    dataIndex: "result",
    width: 150
  }
];
// 少样本检测样例
export const detectionFewSampleColumns: any = [
  {
    title: "样本地址",
    dataIndex: "sample"
  },
  {
    title: "检测地址",
    dataIndex: "name",
    width: 150
  },
  {
    title: "检测时间",
    dataIndex: "time",
    width: 150
  },
  {
    title: "检测结果",
    dataIndex: "result",
    width: 150
  }
];
// 恶意交易检测样例
export const detectionMaliciousSampleColumns: any = [
  {
    title: "检测地址",
    dataIndex: "name"
  },
  {
    title: "检测时间",
    dataIndex: "time"
  },
  {
    title: "检测结果",
    dataIndex: "result",
    width: 150
  }
];
// 数据仓库列表
export const dataStoreColumns: any = [
  {
    title: "序号",
    ellipsis: true,
    width: 100
  },
  {
    title: "数据集名称",
    dataIndex: "name",
    ellipsis: true,
    width: 320
  },
  {
    title: "区块链",
    dataIndex: "chainType",
    ellipsis: true,
    width: 320
  },
  {
    title: "数量",
    dataIndex: "total",
    ellipsis: true,
    width: 320
  },
  {
    title: "描述",
    dataIndex: "desc",
    ellipsis: true
  }
];

// 身份推断页、少样本身份推断页表格
export const columns: any = [
  {
    title: "序号",
    ellipsis: true,
    width: 100
  },
  {
    title: "数据集名称",
    dataIndex: "name",
    ellipsis: true,
    width: 320
  },
  {
    title: "平台",
    dataIndex: "chainType",
    ellipsis: true,
    width: 320
  },
  {
    title: "数量",
    dataIndex: "number",
    ellipsis: true
  }
];
// 身份推断页、少样本身份推断页表格V2变动

export const columnsIdentity: any = [
  {
    title: "src",
    ellipsis: true,
    dataIndex: "src",
    width: 200
  },
  {
    title: "dst",
    ellipsis: true,
    dataIndex: "dst",
    width: 200
  },
  {
    title: "isError",
    dataIndex: "isError",
    ellipsis: true,
    width: 100
  },
  {
    title: "gas",
    dataIndex: "gas",
    ellipsis: true,
    width: 100
  },
  {
    title: "timeStamp",
    dataIndex: "timeStamp",
    ellipsis: true,
    width: 150
  },
  {
    title: "blockNumber",
    dataIndex: "blockNumber",
    ellipsis: true,
    width: 150
  },
  {
    title: "value",
    dataIndex: "value",
    ellipsis: true,
    width: 200
  },
  {
    title: "gasUsed",
    dataIndex: "gasUsed",
    ellipsis: true,
    width: 100
  },
  {
    title: "gasPrice",
    dataIndex: "gasPrice",
    ellipsis: true,
    width: 100
  }
];

// 跨链页表格1、2
export const columnsCrossChain1: any = [
  {
    title: "交易号",
    ellipsis: true,
    dataIndex: "Tx_id",
    width: 100
  },

  {
    title: "账户名",
    dataIndex: "Account_number",
    ellipsis: true,
    width: 320
  },
  {
    title: "来源",
    dataIndex: "From",
    ellipsis: true,
    width: 320
  },
  {
    title: "流向",
    dataIndex: "To",
    ellipsis: true,
    width: 320
  },
  {
    title: "输入金额",
    dataIndex: "Input_coin",
    ellipsis: true,
    width: 320
  },

  {
    title: "交易费",
    dataIndex: "Fee",
    ellipsis: true,
    width: 320
  },
  {
    title: "输出金额",
    dataIndex: "Output_coin",
    ellipsis: true,
    width: 120
  }
];

export const columnsCrossChain2: any = [
  {
    title: "依赖号",
    ellipsis: true,
    dataIndex: "Rcro_id",
    width: 100
  },
  {
    title: "下游交易",
    dataIndex: "To",
    ellipsis: true,
    width: 320
  },
  {
    title: "上游交易",
    dataIndex: "From",
    ellipsis: true,
    width: 320
  },

  {
    title: "账户名",
    dataIndex: "Account_number",
    ellipsis: true
  }
];
// 链码漏洞页面
export const columnsChainCode: any = [
  {
    title: "检测文件",
    ellipsis: true,
    dataIndex: "file",
    width: 100
  },
  {
    title: "检测时间",
    dataIndex: "time",
    ellipsis: true,
    width: 320
  },
  {
    title: "漏洞总数",
    dataIndex: "num",
    ellipsis: true,
    width: 320
  },
  {
    title: "漏洞类型",
    dataIndex: "type",
    ellipsis: true,
    width: 320
  },
  {
    title: "漏洞产生的原因",
    dataIndex: "resaon",
    ellipsis: true
  }
];
