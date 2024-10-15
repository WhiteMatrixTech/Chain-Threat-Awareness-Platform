/* eslint-disable prettier/prettier */
/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-08-29 18:12:27
 * @LastEditors: didadida262
 * @LastEditTime: 2024-10-15 15:44:03
 */

// 模型信息
export const modelColumns: any = [
  {
    title: "模型名称",
    dataIndex: "name"
  },
  {
    title: "模型版本",
    dataIndex: "version"
  },
  {
    title: "模型训练生成时间",
    dataIndex: "time"
  },
  {
    title: "模型检测综合性能f1",
    dataIndex: "x1",
    width: 160
  },
  {
    title: "模型描述",
    dataIndex: "x2"
  }
];
// 自私挖矿检测样例
export const detectionSamplePrivacyColumns: any = [
  {
    title: "检测区块",
    dataIndex: "name",
    width: 150,
    copy: true
  },
  {
    title: "检测时间",
    dataIndex: "time"
  },
  {
    title: "检测结果",
    dataIndex: "result"
  }
];
// 抢跑攻击检测样例
export const detectionSampleAttackColumns: any = [
  {
    title: "检测内容",
    dataIndex: "name",
    width: 150,
    copy: true
  },
  {
    title: "检测时间",
    dataIndex: "time"
  },
  {
    title: "检测结果",
    dataIndex: "result"
  }
];
// 抢跑结果表格列
export const detectionAttackResultColumns: any = [
  {
    title: "名称",
    dataIndex: "title",
    width: 200,
    copy: true
  },
  {
    title: "值",
    dataIndex: "value",
    copy: true
  }
];
// 钓鱼结果表格列
export const detectionFishResultColumns: any = [
  {
    title: "名称",
    dataIndex: "title",
    width: 250,
    copy: true
  },
  {
    title: "值",
    dataIndex: "value",
    copy: true
  }
];
// fish检测样例
export const detectionSampleFishColumns: any = [
  {
    title: "检测地址",
    dataIndex: "name",
    copy: true
  },
  {
    title: "检测时间",
    dataIndex: "time",
    width: 200
  },
  {
    title: "检测结果",
    dataIndex: "result"
  }
];

// 身份推断检测样例
export const detectionSampleColumns: any = [
  {
    title: "检测地址",
    dataIndex: "name",
    copy: true
  },
  {
    title: "检测时间",
    dataIndex: "time"
  },
  {
    title: "检测时长",
    dataIndex: "cost"
  },
  {
    title: "检测结果",
    dataIndex: "result",
    width: 150
  }
];
// 身份推断页、少样本身份推断页表格V2变动

export const columnsIdentity: any = [
  {
    title: "起始地址",
    ellipsis: true,
    dataIndex: "src"
  },
  {
    title: "目标地址",
    ellipsis: true,
    dataIndex: "dst"
  },
  {
    title: "是否失败",
    dataIndex: "isError",
    ellipsis: true,
    width: 100
  },

  {
    title: "时间戳",
    dataIndex: "timeStamp",
    ellipsis: true
  },
  {
    title: "区块高度",
    dataIndex: "blockNumber",
    ellipsis: true
  },
  {
    title: "金额/wei",
    dataIndex: "value",
    ellipsis: true
  },
  {
    title: "气体单价(gasPrice)/wei",
    dataIndex: "gasPrice",
    ellipsis: true
  },
  {
    title: "使用气体(gasUsed)/Gwei",
    dataIndex: "gasUsed",
    ellipsis: true
  },
  {
    title: "气体限制(gasLimit)/Gwei",
    dataIndex: "gas",
    ellipsis: true
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
    copy: true
  },
  {
    title: "检测时间",
    dataIndex: "time"
  },
  {
    title: "检测结果",
    dataIndex: "result",
    width: 200
  }
];
// 恶意交易检测样例
export const detectionMaliciousSampleColumns: any = [
  {
    title: "检测地址",
    dataIndex: "name",
    copy: true
  },
  {
    title: "检测时间",
    dataIndex: "time",
    width: 200
  },
  {
    title: "检测结果",
    dataIndex: "result",
    width: 150
  }
];
// 跨链检测样例
export const detectionSampleCrossChainColumns: any = [
  {
    title: "交易hash",
    dataIndex: "name",
    copy: true
  },
  {
    title: "交易时间",
    dataIndex: "time"
  },
  {
    title: "查询时间",
    dataIndex: "query_time"
  },
  {
    title: "输入金额",
    dataIndex: "inputMoney",
    width: 200
  },
  {
    title: "交易费用",
    dataIndex: "fee",
    width: 200
  },
  {
    title: "输出金额",
    dataIndex: "outputMoney",
    width: 200
  }
];
// 链码检测样例一级页面
export const detectionSampleChainCodeColumnsHome: any = [
  {
    title: "检测链码",
    dataIndex: "name",
    copy: true
  },
  {
    title: "检测时间",
    dataIndex: "time"
  },
  {
    title: "检测时长",
    dataIndex: "cost",
    width: 180
  },
  {
    title: "检测结果",
    dataIndex: "result"
  }
];
// 链码检测样例二级页面
export const detectionSampleChainCodeColumns: any = [
  // {
  //   title: "检测地址",
  //   dataIndex: "name"
  // },
  {
    title: "检测时间",
    dataIndex: "time"
  },
  {
    title: "检测时长",
    dataIndex: "cost",
    width: 180
  },
  {
    title: "检测结果",
    dataIndex: "result"
  }
];

// 混币检测样例
export const detectionSampleBitCoinColumns: any = [
  {
    title: "检测地址",
    dataIndex: "name",
    copy: true
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
    dataIndex: "datasetName",
    ellipsis: true
  },
  {
    title: "区块链",
    dataIndex: "chain",
    ellipsis: true
  },
  {
    title: "数据来源",
    dataIndex: "source",
    ellipsis: true
  },
  {
    title: "数量",
    dataIndex: "total",
    ellipsis: true
  },
  // {
  //   title: "描述",
  //   dataIndex: "desc",
  //   ellipsis: true
  // },
  {
    title: "下载地址",
    dataIndex: "downloadUrl",
    ellipsis: true
    // width: 150
  },
  {
    title: "",
    slot: "operation",
    width: 100
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

// 跨链页表格1、2
export const columnsCrossChain1: any = [
  {
    title: "交易hash",
    ellipsis: true,
    dataIndex: "Tx_id"
  },

  {
    title: "来源",
    dataIndex: "From",
    ellipsis: true
  },
  {
    title: "流向",
    dataIndex: "To",
    ellipsis: true
  },
  {
    title: "输入金额",
    dataIndex: "Input_coin",
    ellipsis: true
  },

  {
    title: "交易费用",
    dataIndex: "Fee",
    ellipsis: true
  },
  {
    title: "输出金额",
    dataIndex: "Output_coin",
    ellipsis: true
  },
  {
    title: "交易时间",
    dataIndex: "Time",
    ellipsis: true
  },
  {
    title: "交易所在链",
    dataIndex: "Chain",
    ellipsis: true,
    width: 120
  }
];

export const columnsCrossChain2: any = [
  {
    title: "依赖项",
    ellipsis: true,
    dataIndex: "Rcro_id",
    width: 100
  },
  {
    title: "下游交易",
    dataIndex: "To",
    ellipsis: true
  },
  {
    title: "上游交易",
    dataIndex: "From",
    ellipsis: true
  },
  {
    title: "下游交易所在链",
    dataIndex: "To_chain",
    ellipsis: true
  },
  {
    title: "上游交易所在链",
    dataIndex: "From_chain",
    ellipsis: true
  }

  // {
  //   title: "账户名",
  //   dataIndex: "Account_number",
  //   ellipsis: true
  // }
];
// 链码漏洞页面
export const columnsChainCode: any = [
  // {
  //   title: "检测文件",
  //   ellipsis: true,
  //   dataIndex: "file"
  // },
  {
    title: "检测时间",
    dataIndex: "time",
    ellipsis: true
  },
  {
    title: "漏洞总数",
    dataIndex: "num",
    ellipsis: true
  },
  {
    title: "漏洞类型",
    dataIndex: "type",
    ellipsis: true
  },
  {
    title: "漏洞产生的原因",
    dataIndex: "reason",
    ellipsis: true
    // width: 320
  }
];

// 自私挖矿结果表格
export const privacyResultCols: any = [
  {
    title: "连续区块对",
    dataIndex: "consecutive_blocks",
    ellipsis: true
  },
  {
    title: "哈希算力",
    dataIndex: "hashing_power",
    ellipsis: true
  },
  {
    title: "矿工",
    dataIndex: "miner",
    ellipsis: true
  }
];
