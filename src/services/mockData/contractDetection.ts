import { cloneDeep } from 'lodash';

import { IExplorerItem, IFile } from '@/pages/contract-detection/ContractStore';

const BasicContract = `pragma solidity ^0.4.26;
interface Token {
  function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
  function allowance(address owner, address spender) external view returns (uint256);
}
contract TokenSale {
  uint256 start = now;
  uint256 end = now + 30 days;
  address wallet = 0xCafEBAbECAFEbAbEcaFEbabECAfebAbEcAFEBaBe;
  Token token = Token(0x1234567812345678123456781234567812345678);
  address owner;
  bool sold;
  function Tokensale() public {
    owner = msg.sender;
  }
  function buy() public payable {
    require(now < end);
    require(msg.value == 42 ether + (now - start) / 60 / 60 / 24 * 1 ether);
    require(token.transferFrom(this, msg.sender, token.allowance(wallet, this)));
    sold = true;
  }
  function withdraw() public {
    require(msg.sender == owner);
    require(now >= end);
    require(sold);
    owner.transfer(address(this).balance);
  }
}
`;

enum DetectionResultType {
  ERROR = 'ERROR',
  WARNING = 'WARNING',
  INFO = 'INFO'
}

const ResultIconColor = {
  [DetectionResultType.ERROR]: '#FF8787',
  [DetectionResultType.WARNING]: '#FFDD65',
  [DetectionResultType.INFO]: '#5DA4F7'
};

const ResultColor = {
  Low: '#5DA4F7',
  Medium: '#FFDD65',
  High: '#FF8787'
};

const ContractDetectionResults = [
  {
    type: DetectionResultType.ERROR,
    message: '未检查的底层"call"',
    position: {
      line: 66,
      columns: 66
    }
  },
  {
    type: DetectionResultType.ERROR,
    message: '未检查的send方法',
    position: {
      line: 82,
      columns: 82
    }
  },
  {
    type: DetectionResultType.WARNING,
    message: '缺少零地址校验',
    position: {
      line: 74,
      columns: 74
    }
  },
  {
    type: DetectionResultType.INFO,
    message: 'Solidity命名规范',
    position: {
      line: 9,
      columns: 9
    }
  }
];

const getShouldRemoveIds = (
  targetId: string,
  explorerList: IExplorerItem[]
) => {
  let ids = [targetId];
  const childrenIds = explorerList
    .filter((item) => item.parentId === targetId)
    .map((item) => item.id);
  childrenIds.forEach((id) => {
    const nextChildrenIds = getShouldRemoveIds(id, explorerList);
    ids = ids.concat(nextChildrenIds);
  });

  ids = ids.concat(childrenIds);

  return ids;
};

const removeExplorerItems = (
  targetId: string,
  explorerList: IExplorerItem[],
  openFiles: IFile[]
) => {
  const preList = cloneDeep(explorerList);
  const preFiles = cloneDeep(openFiles);
  const shouldRemoveIds = getShouldRemoveIds(targetId, explorerList);

  const newExplorerList = preList.filter(
    (item) => !shouldRemoveIds.includes(item.id)
  );

  const newOpenFiles = preFiles.filter(
    (file) => shouldRemoveIds.indexOf(file.id) < 0
  );

  return { newExplorerList, newOpenFiles };
};

const arrToTreeData = (arr: IExplorerItem[]) => {
  arr.forEach((item) => {
    const children = arr.filter((v) => item.id === v.parentId);
    item.children = children.length > 0 ? (item.children = children) : [];
  });
  return arr.filter((item) => item.projectType);
};

export {
  arrToTreeData,
  BasicContract,
  ContractDetectionResults,
  DetectionResultType,
  removeExplorerItems,
  ResultColor,
  ResultIconColor
};
