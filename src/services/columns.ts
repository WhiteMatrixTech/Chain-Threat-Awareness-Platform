/* eslint-disable prettier/prettier */
/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-08-29 18:12:27
 * @LastEditors: didadida262
 * @LastEditTime: 2024-08-29 18:12:51
 */

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

export const columns1: any = [
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
