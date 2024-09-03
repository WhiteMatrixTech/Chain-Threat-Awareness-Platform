/* eslint-disable prettier/prettier */
/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-08-29 18:12:27
 * @LastEditors: didadida262
 * @LastEditTime: 2024-09-03 16:53:05
 */
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

// 跨链页表格1、2
export const columnsCrossChain1: any = [
  {
    title: "交易号",
    ellipsis: true,
    dataIndex: "dealID",
    width: 100
  },
  {
    title: "项目号",
    dataIndex: "projectId",
    ellipsis: true,
    width: 320
  },
  {
    title: "账户名",
    dataIndex: "username",
    ellipsis: true,
    width: 320
  },
  {
    title: "来源",
    dataIndex: "from",
    ellipsis: true
  },
  {
    title: "流向",
    dataIndex: "to",
    ellipsis: true
  },
  {
    title: "输入金额",
    dataIndex: "inputMo",
    ellipsis: true
  },
  {
    title: "交易费",
    dataIndex: "cost",
    ellipsis: true
  },
  {
    title: "输出金额",
    dataIndex: "outmoney",
    ellipsis: true
  }
];

export const columnsCrossChain2: any = [
  {
    title: "依赖号",
    ellipsis: true,
    dataIndex: "depId",
    width: 100
  },
  {
    title: "下游交易",
    dataIndex: "downdeal",
    ellipsis: true,
    width: 320
  },
  {
    title: "上游交易",
    dataIndex: "upDeal",
    ellipsis: true,
    width: 320
  },
  {
    title: "项目号",
    dataIndex: "projectId",
    ellipsis: true,
    width: 320
  },
  {
    title: "账户名",
    dataIndex: "accountName",
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
