import { DetectionResultType } from './contractDetection';

const SafetyInspectionItems = [
  '编译器警告或错误',
  '代码规范检测',
  '函数调用检测',
  '业务逻辑安全检测',
  '溢出检测',
  '异常可达状态检测',
  'ERC20规范'
];

interface IDetectionDetail {
  filePath: string;
  type: DetectionResultType;
  message: string;
  position: {
    line: number;
    columns: number;
  };
  suggestion: string;
  documentLink: string;
}

const DetectionResults: IDetectionDetail[] = [
  {
    filePath: 'ETH_default/BusinessLogic.sol',
    type: DetectionResultType.ERROR,
    message:
      '未初始化的状态变量: variable `revealedMoves`used before assign a value',
    position: {
      line: 25,
      columns: 36
    },
    suggestion: '尽可能在声明状态变量时便初始化该状态变量。',
    documentLink:
      'https://solidity.readthedocs.io/en/v0.5.0/contracts.html#state-variables'
  },
  {
    filePath: 'ETH_default/BusinessLogic.sol',
    type: DetectionResultType.INFO,
    message:
      '公开函数可以被声明为外部函数: ETHGame.resolveTimedOutDuel(uint256,uint256) can be set to external',
    position: {
      line: 14,
      columns: 21
    },
    suggestion: '使用`external`声明未被合约内其他函数调用的公开函数。',
    documentLink:
      'https://solidity.readthedocs.io/en/v0.5.0/contracts.html#external-functions'
  }
];

export { DetectionResults, SafetyInspectionItems };

export type { IDetectionDetail };
