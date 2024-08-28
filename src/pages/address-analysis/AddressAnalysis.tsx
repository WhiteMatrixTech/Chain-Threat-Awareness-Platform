/* eslint-disable simple-import-sort/imports */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  generateAddressData,
  generateEdgeTxData,
  initGraphData,
  initQueryAddress
} from "@/services/mockData/addressAnalysis";
import {
  AddressTxGraph,
  TGraphinClickTarget
} from "./Components/graph/AddressTxGraph";
import { DatePicker, Form, Input, Select, Spin } from "antd";
import cn from "classnames";
import { useMemo, useState } from "react";
import { useQuery } from "react-query";

import { GraphinData } from "@antv/graphin";
import { PrimaryButton } from "@/components/Button";
import { DateCommon } from "@/components/DateCommon";
import { InputCommonV2 } from "@/components/InputCommonV2";
import { SelectorCommonV3 } from "@/components/SelectorCommonV3";
import { waitTime } from "@/utils/common";
import { getBlockByDate } from "@/utils/getBlockByDate";
import pattern from "@/styles/pattern";

import { AddressDetail } from "./Components/AddressDetail";
import { TxDetail } from "./Components/TxDetail";
import styles from "./AddressAnalysis.module.less";

export interface IGraphFormData {
  date: any;
  tokenType: string;
  address: string;
}

interface formDateType {
  date: moment.MomentInput[];
  tokenType: string;
  address: string;
}

const typeList = [
  {
    label: "ETH",
    value: "ETH"
  },
  {
    label: "BTC",
    value: "BTC"
  }
];

export function AddressAnalysis() {
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
  const onClickAnalysis = async () => {
    // void form.validateFields().then(async (allValues: formDateType) => {
    const allValues = { ...formData };
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
    // });
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
      <div className={cn(styles.transactionDataContainer, "mt-6 flex gap-x-2")}>
        <div className="w-80 max-w-sm rounded shadow-card ">
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
        <div className={cn(`flex-1 flex flex-col gap-y-[10px] pl-[40px]`)}>
          <div className={`${pattern.flexbet}  w-full h-[36px]`}>
            <div
              className={cn(
                `max-w-[1000px] h-full flex items-center gap-x-[10px] `
              )}
            >
              <div className="text-[#ffffff] text-[16px] font-[500]">地址分析</div>
              <div className="flex flex-1 gap-x-[20px]">
                <div className="w-[124px] 3xl:w-[164px] h-[36px] flex items-center">
                  <SelectorCommonV3
                    placeholder="以太坊区块的区块号或区块哈希"
                    value={{
                      label: formData.tokenType,
                      value: formData.tokenType
                    }}
                    options={typeList}
                    setValue={(item: any) => {
                      setFormData({
                        ...formData,
                        tokenType: item.value
                      });
                    }}
                  />
                </div>
                <div
                  className={`w-[208px] 3xl:w-[408px] h-[36px] flex items-center`}
                >
                  <InputCommonV2
                    initVal={formData.address}
                    placeholder="地址"
                    onInput={(val: any) => {
                      setFormData({
                        ...formData,
                        address: val
                      });
                    }}
                  />
                </div>
                <div
                  className={cn(`w-[291px] h-[36px]  ${pattern.flexCenter}`)}
                >
                  <DateCommon
                    className="w-[291px] h-full"
                    onSelect={(date: any) => {
                      setFormData({
                        ...formData,
                        date: date
                      });
                    }}
                  />
                </div>
              </div>
            </div>

            <div
              onClick={onClickAnalysis}
              className={cn(
                "w-[113px] h-full hover:cursor-pointer",
                `bg-[url('./assets/analyses_start.png')] bg-cover bg-center`
              )}
            />
          </div>
          <div className=" relative flex-1 overflow-hidden rounded bg-white shadow-card">
            <AddressTxGraph
              focusedId={selectedHexData}
              formData={formData}
              handleClick={handleClickGraphin}
              changeData={setGraphData}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
