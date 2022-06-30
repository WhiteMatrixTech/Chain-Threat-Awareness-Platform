import { cloneDeep } from 'lodash';

import { IExplorerItem, IFile } from '@/pages/contract-detection/ContractStore';

const BasicContract = `pragma solidity >=0.6.2 <0.7.0;

/**
 * @title Storage
 * @dev Store & retrieve value in a variable
 */
contract Storage {

    uint256 number;

    /**
     * @dev Store value in variable
     * @param num value to store
     */
    function store(uint256 num) public {
        number = num;
    }

    /**
     * @dev Return value
     * @return value of 'number'
     */
    function retrieve() public view returns (uint256){
        return number;
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

const ContractDetectionResults = [
  {
    type: DetectionResultType.ERROR,
    message: 'xxxx',
    position: {
      line: 66,
      columns: 66
    }
  },
  {
    type: DetectionResultType.ERROR,
    message: 'xxxx',
    position: {
      line: 66,
      columns: 66
    }
  },
  {
    type: DetectionResultType.WARNING,
    message: 'xxxx',
    position: {
      line: 66,
      columns: 66
    }
  },
  {
    type: DetectionResultType.INFO,
    message: 'xxxx',
    position: {
      line: 66,
      columns: 66
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
  ResultIconColor
};
