import {
  DeleteOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { Tooltip } from 'antd';

export enum AnalysisType {
  VIEW_SOURCE = 'VIEW_SOURCE',
  VIEW_PLACE = 'VIEW_PLACE',
  VIEW_TARGET = 'VIEW_TARGET',
  DELETE = 'DELETE'
}

interface IAnalysisToolProps {
  type: AnalysisType;
  title: string;
  address: string;
  onClick?: () => void;
}

const toolIcons = {
  [AnalysisType.VIEW_SOURCE]: <MenuFoldOutlined className="text-lg" />,
  [AnalysisType.VIEW_PLACE]: <MenuUnfoldOutlined className="text-lg" />,
  [AnalysisType.VIEW_TARGET]: <TeamOutlined className="text-lg" />,
  [AnalysisType.DELETE]: <DeleteOutlined className="text-lg" />
};

export function AnalysisTool(props: IAnalysisToolProps) {
  const { type, title, address, onClick } = props;
  const icon = toolIcons[type];

  if (!address) {
    return (
      <Tooltip title="请先点选要分析的地址">
        <div className="flex cursor-not-allowed flex-col items-center justify-center gap-y-2 text-disabled">
          {icon}
          <span className="select-none text-sm">{title}</span>
        </div>
      </Tooltip>
    );
  }
  return (
    <div
      onClick={onClick}
      className="flex cursor-pointer flex-col items-center justify-center gap-y-2 text-common hover:text-[#004cff]"
    >
      {icon}
      <span className="select-none text-sm">{title}</span>
    </div>
  );
}
