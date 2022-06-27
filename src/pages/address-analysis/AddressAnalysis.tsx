import { GraphinData } from '@antv/graphin';
import { DatePicker, Form, Input, Select, Spin } from 'antd';
import cn from 'classnames';
import { useCallback, useState } from 'react';
import { useQuery } from 'react-query';

import { PrimaryButton } from '@/components/Button';
import {
  EdgeType,
  generateAddressData,
  generateEdgeTxData,
  generateGraphData,
  initGraphData,
  initQueryAddress
} from '@/services/mockData/addressAnalysis';
import { waitTime } from '@/utils/common';

import styles from './AddressAnalysis.module.less';
import { AddressDetail } from './Components/AddressDetail';
import { AnalysisTool, AnalysisType } from './Components/AnalysisTool';
import {
  AddressTxGraph,
  TGraphinClickTarget
} from './Components/graph/AddressTxGraph';
import { TxDetail } from './Components/TxDetail';

const Option = Select.Option;
const { RangePicker } = DatePicker;

export function AddressAnalysis() {
  const [form] = Form.useForm();
  const [selectedAddress, setSelectedAddress] = useState(initQueryAddress);
  const [selectedEdge, setSelectedEdge] = useState('');
  const [graphData, setGraphData] = useState<GraphinData>(initGraphData);

  const {
    data: addressData,
    isLoading,
    isRefetching
  } = useQuery(['getAddressData', selectedAddress], async () => {
    await waitTime(1000);
    return generateAddressData(selectedAddress);
  });

  const { data: edgeTxData } = useQuery(
    ['getEdgeTxData', selectedEdge],
    async () => {
      await waitTime(1000);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const edge = graphData.edges.find(
        (edge) => edge.id === selectedEdge
      ) as any;

      if (!edge) {
        return null;
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return generateEdgeTxData(edge);
    }
  );

  const handleClickGraphin = (
    hexString: string,
    type?: TGraphinClickTarget
  ) => {
    if (type === 'node') {
      setSelectedAddress(hexString);
      setSelectedEdge('');
    }
    if (type === 'edge') {
      setSelectedEdge(hexString);
      setSelectedAddress('');
    }
  };

  const handleReset = () => {
    setGraphData(initGraphData);
    setSelectedAddress(initQueryAddress);
  };

  const handleGenerateData = useCallback(
    (type: EdgeType) => {
      const randomData = generateGraphData(selectedAddress, type);
      randomData.edges = [...randomData.edges, ...graphData.edges];
      randomData.nodes = [...randomData.nodes, ...graphData.nodes];

      setGraphData(randomData);
    },
    [graphData.edges, graphData.nodes, selectedAddress]
  );

  const handleDeleteNode = useCallback(() => {
    const edges = graphData.edges.filter(
      (edge) =>
        edge.source !== selectedAddress && edge.target !== selectedAddress
    );
    const nodes = graphData.nodes.filter((node) => {
      const isTargetNode = node.id === selectedAddress;

      // 孤立的节点
      const isLonelyNode =
        edges.findIndex((edge) =>
          [edge.source, edge.target].includes(node.id)
        ) < 0;

      return !(isTargetNode || isLonelyNode);
    });

    const randomData = {
      nodes,
      edges
    };

    setGraphData(randomData);
    setSelectedAddress('');
  }, [graphData.edges, graphData.nodes, selectedAddress]);

  const tools = [
    {
      onClick: () => handleGenerateData(EdgeType.SOURCE),
      type: AnalysisType.VIEW_SOURCE,
      title: '资金来源'
    },
    {
      onClick: () => handleGenerateData(EdgeType.PLACE),
      type: AnalysisType.VIEW_PLACE,
      title: '资金去向'
    },
    {
      onClick: () => handleGenerateData(EdgeType.TARGET),
      type: AnalysisType.VIEW_TARGET,
      title: '全部交易对象'
    },
    {
      onClick: handleDeleteNode,
      type: AnalysisType.DELETE,
      title: '删除地址'
    }
  ];

  return (
    <div className={styles.AddressAnalysis}>
      <div className="flex items-center gap-x-3">
        <div className="text-2xl font-black">地址分析</div>
        <Form
          form={form}
          wrapperCol={{ span: 24 }}
          name="transaction-graph-form"
          layout="inline"
          className="flex flex-1 items-center justify-end"
        >
          <Form.Item className="max-w-3xl !flex-1">
            <Input.Group compact={true}>
              <Form.Item
                name={['chain', 'tokenType']}
                noStyle={true}
                initialValue={['ETH']}
              >
                <Select
                  size="large"
                  style={{ width: '30%' }}
                  placeholder="请选择TOKEN类型"
                >
                  <Option value="BTC">BTC</Option>
                  <Option value="ETH">ETH</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name={['chain', 'address']}
                noStyle={true}
                initialValue={initQueryAddress}
              >
                <Input
                  size="large"
                  allowClear={true}
                  style={{ width: '70%' }}
                  className={styles.input}
                  placeholder="请输入交易哈希"
                />
              </Form.Item>
            </Input.Group>
          </Form.Item>
          <Form.Item name="date">
            <RangePicker size="large" className={styles.dataPicker} />
          </Form.Item>
          <PrimaryButton className="ml-16 w-fit !px-10">开始分析</PrimaryButton>
        </Form>
      </div>
      <div className={cn(styles.transactionDataContainer, 'mt-6 flex gap-x-2')}>
        <div className="flex w-80 max-w-sm rounded bg-white shadow-card">
          <Spin spinning={isLoading || isRefetching}>
            {selectedAddress && (
              <AddressDetail
                selectedAddress={selectedAddress}
                addressData={addressData}
              />
            )}
            {selectedEdge && edgeTxData && <TxDetail txData={edgeTxData} />}
          </Spin>
        </div>
        <div className="relative flex-1 overflow-hidden rounded bg-white shadow-card">
          <AddressTxGraph
            graphData={graphData}
            selectedAddress={selectedAddress}
            handleClick={handleClickGraphin}
            handleReset={handleReset}
          />
          <div className="absolute bottom-[15%] left-0 right-0 mx-[10%] flex  justify-between gap-x-4 rounded-3xl bg-[#B2BACB33] px-10 py-3 2xl:mx-[30%]">
            {tools.map((tool) => (
              <AnalysisTool
                {...tool}
                key={tool.type}
                address={selectedAddress}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
