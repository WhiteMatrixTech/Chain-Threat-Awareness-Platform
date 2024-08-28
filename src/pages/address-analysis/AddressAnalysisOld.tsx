/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { GraphinData } from "@antv/graphin";
import { DatePicker, Form, Input, Select, Spin } from "antd";
import cn from "classnames";
import { useMemo, useState } from "react";
import { useQuery } from "react-query";

import { PrimaryButton } from "@/components/Button";
import {
  generateAddressData,
  generateEdgeTxData,
  initGraphData,
  initQueryAddress
} from "@/services/mockData/addressAnalysis";
import { waitTime } from "@/utils/common";
import { getBlockByDate } from "@/utils/getBlockByDate";

import styles from "./AddressAnalysis.module.less";
import { AddressDetail } from "./Components/AddressDetail";
import {
  AddressTxGraph,
  TGraphinClickTarget
} from "./Components/graph/AddressTxGraph";
import { TxDetail } from "./Components/TxDetail";

const Option = Select.Option;
const { RangePicker } = DatePicker;

export interface IGraphFormData {
  date: string[];
  tokenType: string;
  address: string;
}

interface formDateType {
  date: moment.MomentInput[];
  tokenType: string;
  address: string;
}

export function AddressAnalysis() {
  const [form] = Form.useForm();
  const [graphData, setGraphData] = useState<GraphinData>(initGraphData);

  const [formData, setFormData] = useState<IGraphFormData>({
    date: ["0", "latest"],
    tokenType: "ETH",
    address: initQueryAddress
  });

  const [selectedHexData, setSelectedHexData] = useState(initQueryAddress);
  const isEdge = useMemo(() => selectedHexData.length > 42, [
    selectedHexData.length
  ]);

  const { data: addressData, isLoading: qryAddressLoading } = useQuery(
    ["getAddressData", selectedHexData, formData.address],
    async () => {
      await waitTime(1000);
      if (!selectedHexData || selectedHexData.length >= 64) {
        return undefined;
      }

      return generateAddressData(selectedHexData || formData.address);
    }
  );

  const { data: edgeTxData, isLoading: qryEdgeTxLoading } = useQuery(
    ["getEdgeTxData", selectedHexData],
    async () => {
      await waitTime(1000);
      const edge = graphData.edges.find(
        edge => edge.id === selectedHexData
      ) as any;

      if (!edge) {
        return undefined;
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return generateEdgeTxData(edge);
    }
  );
  const onClickAnalysis = () => {
    void form.validateFields().then(async (allValues: formDateType) => {
      if (allValues.date) {
        try {
          const fromBlock = await getBlockByDate(allValues.date[0]);
          const toBlock = await getBlockByDate(allValues.date[1]);

          setFormData({
            date: [fromBlock.toString(), toBlock.toString()],
            tokenType: allValues.tokenType,
            address: allValues.address
          });
          setSelectedHexData(allValues.address);
          return;
        } catch (e) {
          console.log("e", e);
        }
      }

      setFormData({
        date: ["0", "latest"],
        tokenType: allValues.tokenType,
        address: allValues.address
      });
      setSelectedHexData(allValues.address);
    });
  };

  const handleClickGraphin = (
    hexString: string,
    _type?: TGraphinClickTarget
  ) => {
    if (hexString) {
      setSelectedHexData(hexString);
    }
  };

  return (
    <div className={styles.AddressAnalysis}>
      <div className="flex items-center gap-x-3">
        <div className="text-2xl font-black">地址分析</div>
        <Form
          form={form}
          layout="inline"
          wrapperCol={{ span: 24 }}
          name="transaction-graph-form"
          className="flex flex-1 items-center justify-end"
        >
          <Form.Item className="max-w-3xl !flex-1">
            <Input.Group compact={true}>
              <Form.Item name="tokenType" noStyle={true} initialValue={"ETH"}>
                <Select
                  size="large"
                  style={{ width: "30%" }}
                  placeholder="请选择TOKEN类型"
                >
                  <Option value="BTC">BTC</Option>
                  <Option value="ETH">ETH</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="address"
                noStyle={true}
                initialValue={initQueryAddress}
              >
                <Input
                  size="large"
                  allowClear={true}
                  style={{ width: "70%" }}
                  className={styles.input}
                  placeholder="请输入钱包地址"
                />
              </Form.Item>
            </Input.Group>
          </Form.Item>
          <Form.Item name="date">
            <RangePicker size="large" className={styles.dataPicker} />
          </Form.Item>
          <PrimaryButton
            onClick={onClickAnalysis}
            className="ml-16 w-fit !px-10"
          >
            开始分析
          </PrimaryButton>
        </Form>
      </div>
      <div className={cn(styles.transactionDataContainer, "mt-6 flex gap-x-2")}>
        <div className="w-80 max-w-sm rounded bg-white shadow-card">
          <Spin spinning={qryAddressLoading || qryEdgeTxLoading}>
            {isEdge
              ? <TxDetail
                  unit={formData.tokenType}
                  edge={graphData.edges}
                  txData={edgeTxData}
                />
              : <AddressDetail
                  unit={formData.tokenType}
                  addressData={addressData}
                />}
          </Spin>
        </div>
        <div className="relative flex-1 overflow-hidden rounded bg-white shadow-card">
          <AddressTxGraph
            focusedId={selectedHexData}
            formData={formData}
            handleClick={handleClickGraphin}
            changeData={setGraphData}
          />
        </div>
      </div>
    </div>
  );
}
