import { cloneDeep } from 'lodash';

import { IExplorerItem, IFile } from '@/pages/contract-detection/ContractStore';

const BasicContract = `pragma solidity ^0.7.0;

/**
 * @title Storage
 * @dev Store & retrieve value in a variable
 */
 contract TestToken {
  event Transfer(address indexed _from, address indexed _to, uint256 _value);
  event Approval(address indexed _owner, address indexed _spender, uint256 _value);
  event Deposit(address _from, uint value);
  address constant _walletLibrary = 0x0000000000000000000000000000000000000000;
  address public owner = _walletLibrary;
  mapping (address => uint256) balances;
  mapping (address => mapping (address => uint256)) allowed;
  uint256 public totalSupply;
  uint256 public settime;

  constructor() public {
      totalSupply=100000000;
      settime = block.timestamp;
  }

  function transfer(address _to, uint256 _value) external returns (bool success) {
      require (balances[msg.sender] >= _value);
      require (_value > 0);
      balances[msg.sender] -= _value;
      balances[_to] += _value;
      emit Transfer(msg.sender, _to, _value);
      return true;
  }

  function transferFrom(address _from, address _to, uint256 _value) external  returns (bool success) {
      require (balances[_from] >= _value);
      require (balances[_to] + _value > balances[_to]);
      balances[_to] += _value;
      balances[_from] -= _value;
      allowed[_from][msg.sender] -= _value;
      emit Transfer(_from, _to, _value);
      return true;
  }

  function mint(address account, uint256 amount) external {
      require(account != address(0));

      totalSupply += amount;
      balances[account] += amount;
      emit Transfer(address(0), account, amount);
  }

  function balanceOf(address _owner)external view returns (uint256 balance) {
      return balances[_owner];
  }

  function approve(address _spender, uint256 _value) external returns (bool success) {
      allowed[msg.sender][_spender] = _value;
      Approval(msg.sender, _spender, _value);
      return true;
  }

  function allowance(address _owner, address _spender) external view returns (uint256 remaining) {
    return allowed[_owner][_spender];
  }

  function withdraw(address to, uint256 amount) public{
      assert (to!=address(0x0));
      require(balances[msg.sender] > amount);
      require(address(this).balance > amount);
      to.call{value:amount}('');
      balances[msg.sender] -= amount;
  }

  fallback() external payable {
    if (msg.value > 0)
         Deposit(msg.sender, msg.value);
    else if (msg.data.length > 0)
       _walletLibrary.delegatecall(msg.data);
  }

  function getNow() external view returns(uint){
      return block.timestamp;
  }

  function  senderther() public{
      msg.sender.send(address(this).balance);
  }

  function allocate() public{
      balances[msg.sender] += 100;
  }

  function dosomething() external{
      bytes32 hash = blockhash(block.number);
      uint256 time = block.timestamp;
      if(time >= settime){
          allocate();
      }
      uint256 num = block.number;
      if(num >= 255556){
          senderther();
      }
  }

  function selfdestroy() public{
      selfdestruct(msg.sender);
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
    message: '未检查的底层"call"',
    position: {
      line: 66,
      columns: 66
    }
  },
  {
    type: DetectionResultType.ERROR,
    message: '重入风险',
    position: {
      line: 66,
      columns: 66
    }
  },
  {
    type: DetectionResultType.WARNING,
    message: '未检查的send方法',
    position: {
      line: 66,
      columns: 66
    }
  },
  {
    type: DetectionResultType.INFO,
    message: '转账地址未知',
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
