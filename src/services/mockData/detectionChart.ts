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
    filePath: 'ETH_default/CommonVulnerability.sol',
    type: DetectionResultType.ERROR,
    message: '未检查的底层`call`：unchecked the return value of low_level call',
    position: {
      line: 66,
      columns: 36
    },
    suggestion: '对所有底层`call`方法返回值进行校验。',
    documentLink: 'http://cw.hubwiz.com/card/c/swc-registry/1/1/1/'
  },
  {
    filePath: 'ETH_default/CommonVulnerability.sol',
    type: DetectionResultType.ERROR,
    message: '未检查的send方法：unchecked the return value of send',
    position: {
      line: 82,
      columns: 21
    },
    suggestion: '使用`send`进行转账时，对返回值进行校验。',
    documentLink: 'http://cw.hubwiz.com/card/c/swc-registry/1/1/1/'
  },
  {
    filePath: 'ETH_default/CommonVulnerability.sol',
    type: DetectionResultType.ERROR,
    message:
      '转账地址未知：msg.sender.send(address(this).balance) do not have any permission control',
    position: {
      line: 82,
      columns: 21
    },
    suggestion:
      '修复建议：当合约存在对外转账功能时，对包含转账函数添加正确的权限控制。',
    documentLink: 'http://cw.hubwiz.com/card/c/swc-registry/1/1/1/'
  },
  {
    filePath: 'ETH_default/CommonVulnerability.sol',
    type: DetectionResultType.ERROR,
    message:
      '重入风险：to.call{value: amount}() could exist reentrancy vulnerabilities, modified variables: TestToken.balances',
    position: {
      line: 66,
      columns: 21
    },
    suggestion: '使用`检查-生效-交互`模式避免重入攻击。',
    documentLink:
      'https://docs.soliditylang.org/en/latest/security-considerations.html#re-entrancy](https://docs.soliditylang.org/en/latest/security-considerations.html#re-entrancy'
  },
  {
    filePath: 'ETH_default/CommonVulnerability.sol',
    type: DetectionResultType.ERROR,
    message:
      '合约自毁函数：selfdestruct(address)(msg.sender) do not have any permission control',
    position: {
      line: 102,
      columns: 21
    },
    suggestion: '尽量避免使用自毁函数，或添加正确的权限控制。',
    documentLink: 'http://cw.hubwiz.com/card/c/swc-registry/1/1/1/'
  },
  {
    filePath: 'ETH_default/CommonVulnerability.sol',
    type: DetectionResultType.WARNING,
    message:
      '编译错误：SPDX license identifier not provided in source file. Before publishing, consider adding a comment containing "SPDX-License-Identifier: <SPDX-License>" to each source file. Use "SPDX-License-Identifier: UNLICENSED" for non-open-source code. Please see https://spdx.org for more information.',
    position: {
      line: 1,
      columns: 21
    },
    suggestion: '编译告警或编译失败信息。请根据编译信息修复。',
    documentLink: 'http://cw.hubwiz.com/card/c/swc-registry/1/1/1/'
  },
  {
    filePath: 'ETH_default/CommonVulnerability.sol',
    type: DetectionResultType.WARNING,
    message:
      '编译错误：This contract has a payable fallback function, but no receive ether function. Consider adding a receive ether function.',
    position: {
      line: 5,
      columns: 21
    },
    suggestion: '编译告警或编译失败信息。请根据编译信息修复。',
    documentLink: 'http://cw.hubwiz.com/card/c/swc-registry/1/1/1/'
  },
  {
    filePath: 'ETH_default/CommonVulnerability.sol',
    type: DetectionResultType.WARNING,
    message:
      '编译错误：Visibility for constructor is ignored. If you want the contract to be non-deployable, making it "abstract" is sufficient.',
    position: {
      line: 16,
      columns: 21
    },
    suggestion: '编译告警或编译失败信息。请根据编译信息修复。。',
    documentLink: 'http://cw.hubwiz.com/card/c/swc-registry/1/1/1/'
  },
  {
    filePath: 'ETH_default/CommonVulnerability.sol',
    type: DetectionResultType.WARNING,
    message:
      '公开函数可以被声明为外部函数: ETHGame.resolveTimedOutDuel(uint256,uint256) can be set to external',
    position: {
      line: 66,
      columns: 21
    },
    suggestion: '编译告警或编译失败信息。请根据编译信息修复。。',
    documentLink: 'http://cw.hubwiz.com/card/c/swc-registry/1/1/1/'
  },
  {
    filePath: 'ETH_default/CommonVulnerability.sol',
    type: DetectionResultType.WARNING,
    message: '编译错误：Return value of low-level calls not used.',
    position: {
      line: 74,
      columns: 21
    },
    suggestion: '编译告警或编译失败信息。请根据编译信息修复。。',
    documentLink: 'http://cw.hubwiz.com/card/c/swc-registry/1/1/1/'
  },
  {
    filePath: 'ETH_default/CommonVulnerability.sol',
    type: DetectionResultType.WARNING,
    message:
      "编译错误：Failure condition of 'send' ignored. Consider using 'transfer' instead.",
    position: {
      line: 82,
      columns: 21
    },
    suggestion: '编译告警或编译失败信息。请根据编译信息修复。',
    documentLink: 'http://cw.hubwiz.com/card/c/swc-registry/1/1/1/'
  },
  {
    filePath: 'ETH_default/CommonVulnerability.sol',
    type: DetectionResultType.WARNING,
    message: '编译错误：Unused local variable.',
    position: {
      line: 90,
      columns: 21
    },
    suggestion: '编译告警或编译失败信息。请根据编译信息修复。',
    documentLink: 'http://cw.hubwiz.com/card/c/swc-registry/1/1/1/'
  },
  {
    filePath: 'ETH_default/CommonVulnerability.sol',
    type: DetectionResultType.WARNING,
    message: '区块链参数依赖：`block.timestamp` could have influence on logic.',
    position: {
      line: 92,
      columns: 21
    },
    suggestion:
      '避免使用`block.timestamp`、`now`、`blockhash`等区块链参数生成随机数。',
    documentLink: 'http://cw.hubwiz.com/card/c/swc-registry/1/1/1/'
  },
  {
    filePath: 'ETH_default/CommonVulnerability.sol',
    type: DetectionResultType.WARNING,
    message:
      '缺少零地址校验：TestToken._walletLibrary is used before address(0) check.',
    position: {
      line: 74,
      columns: 21
    },
    suggestion: '在转账操作之前确认地址是有效的非零地址。',
    documentLink: 'http://cw.hubwiz.com/card/c/swc-registry/1/1/1/'
  },
  {
    filePath: 'ETH_default/CommonVulnerability.sol',
    type: DetectionResultType.INFO,
    message:
      '状态变量可以声明为constant：TestToken.owner can be set to `constant`',
    position: {
      line: 10,
      columns: 21
    },
    suggestion: '无状态改变的状态变量可以声明为`constant`常量。',
    documentLink: 'http://cw.hubwiz.com/card/c/swc-registry/1/1/1/'
  },
  {
    filePath: 'ETH_default/CommonVulnerability.sol',
    type: DetectionResultType.INFO,
    message:
      '公开函数可以被声明为外部函数：TestToken.withdraw(address,uint256) can be set to external.',
    position: {
      line: 62,
      columns: 21
    },
    suggestion: '使用`external`声明未被合约内其他函数调用的公开函数。',
    documentLink: 'http://cw.hubwiz.com/card/c/swc-registry/1/1/1/'
  },
  {
    filePath: 'ETH_default/CommonVulnerability.sol',
    type: DetectionResultType.INFO,
    message:
      '公开函数可以被声明为外部函数：TestToken.selfdestroy() can be set to external.',
    position: {
      line: 101,
      columns: 21
    },
    suggestion: '使用`external`声明未被合约内其他函数调用的公开函数。',
    documentLink: 'http://cw.hubwiz.com/card/c/swc-registry/1/1/1/'
  },
  {
    filePath: 'ETH_default/CommonVulnerability.sol',
    type: DetectionResultType.INFO,
    message: "`Solidity`命名规范：'_to' is not follow the naming-convention",
    position: {
      line: 21,
      columns: 21
    },
    suggestion: '推荐使用官方命名规范。',
    documentLink: 'http://cw.hubwiz.com/card/c/swc-registry/1/1/1/'
  }
];

export { DetectionResults, SafetyInspectionItems };

export type { IDetectionDetail };
