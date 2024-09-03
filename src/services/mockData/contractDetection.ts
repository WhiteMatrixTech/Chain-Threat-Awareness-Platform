/* eslint-disable prettier/prettier */
import { cloneDeep } from "lodash";

import { IExplorerItem, IFile } from "@/pages/contract-detection/ContractStore";

// eth5个示例
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
const BasicContractProxy = `
pragma solidity ^0.4.24;

contract Proxy {
  address owner;
  constructor() public {
    owner = msg.sender;  
  }

  function forward(address callee, bytes _data) public {
    require(callee.delegatecall(_data));
  }

}
`;
const BasicContractAssert_constructor = `pragma solidity ^0.4.19;

contract AssertConstructor {
    function AssertConstructor() public {
        assert(false);
    }
}
`;
const BasicContractAssert_minimal = `/*
* @source: https://github.com/ConsenSys/evm-analyzer-benchmark-suite
* @author: Suhabe Bugrara
*/

pragma solidity ^0.4.19;

contract AssertMinimal {
   function run() public {
       assert(false);
   }
}
`;
const BasicContractAssert_multitx_1 = `
/*
 * @source: https://github.com/ConsenSys/evm-analyzer-benchmark-suite
 * @author: Suhabe Bugrara
 */

pragma solidity ^0.4.19;

contract AssertMultiTx1 {
    uint256 private param;

    function AssertMultiTx1(uint256 _param) public {
        require(_param > 0);
        param = _param;
    }

    function run() {
        assert(param > 0);
    }

}
`;

const BscContract_simple_suicide = `pragma solidity ^0.4.22;
contract SimpleSuicide {

  function sudicideAnyone() {
    selfdestruct(msg.sender);
  }

}`;
const BscContract_suicide_multitx_feasible = `pragma solidity ^0.4.23;

contract SuicideMultiTxFeasible {
    uint256 private initialized = 0;
    uint256 public count = 1;

    function init() public {
        initialized = 1;
    }

    function run(uint256 input) {
        if (initialized == 0) {
            return;
        }

        selfdestruct(msg.sender);
    }
}
`;
const BscContract_suicide_multitx_infeasible = `pragma solidity ^0.4.23;

contract SuicideMultiTxFeasible {
    uint256 private initialized = 0;
    uint256 public count = 1;

    function init() public {
        initialized = 1;
    }

    function run(uint256 input) {
        if (initialized != 2) {
            return;
        }

        selfdestruct(msg.sender);
    }
}
`;
const BscContract_proxy_fixed = `pragma solidity ^0.4.24;

contract Proxy {

  address callee;
  address owner;

  modifier onlyOwner {
    require(msg.sender == owner);
    _;
  }

  constructor() public {
  	callee = address(0x0);
    owner = msg.sender;
  }

  function setCallee(address newCallee) public onlyOwner {
  	callee = newCallee;
  }

  function forward(bytes _data) public {
    require(callee.delegatecall(_data));
  }

}
`;
const BscContract_proxy_pattern_false_positive = `pragma solidity ^0.4.24;

contract proxy{
  address owner;

  function proxyCall(address _to, bytes _data) external {
    require( !_to.delegatecall(_data));
  }
  function withdraw() external{
    require(msg.sender == owner);
    msg.sender.transfer(address(this).balance);
  }
} 

/*
You can't use proxyCall to change the owner address as either: 

1) the delegatecall reverts and thus does not change owner
2) the delegatecall does not revert and therefore will cause the proxyCall to revert and preventing owner from changing

This false positive may seem like a really edge case, however since you can revert data back to proxy this patern is useful for proxy architectures
*/`;
enum DetectionResultType {
  ERROR = "High",
  WARNING = "Medium",
  INFO = "Low"
}

const ResultIconColor = {
  [DetectionResultType.ERROR]: "#FF8787",
  [DetectionResultType.WARNING]: "#FFDD65",
  [DetectionResultType.INFO]: "#5DA4F7"
};

const ResultColor = {
  Low: "#5DA4F7",
  Medium: "#FFDD65",
  High: "#FF8787"
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
    message: "未检查的send方法",
    position: {
      line: 82,
      columns: 82
    }
  },
  {
    type: DetectionResultType.WARNING,
    message: "缺少零地址校验",
    position: {
      line: 74,
      columns: 74
    }
  },
  {
    type: DetectionResultType.INFO,
    message: "Solidity命名规范",
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
    .filter(item => item.parentId === targetId)
    .map(item => item.id);
  childrenIds.forEach(id => {
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
    item => !shouldRemoveIds.includes(item.id)
  );

  const newOpenFiles = preFiles.filter(
    file => shouldRemoveIds.indexOf(file.id) < 0
  );

  return { newExplorerList, newOpenFiles };
};

const arrToTreeData = (arr: IExplorerItem[]) => {
  arr.forEach(item => {
    const children = arr.filter(v => item.id === v.parentId);
    item.children = children.length > 0 ? (item.children = children) : [];
  });
  return arr.filter(item => item.projectType);
};

export {
  arrToTreeData,
  BasicContract,
  BasicContractAssert_constructor,
  BasicContractAssert_minimal,
  BasicContractAssert_multitx_1,
  BasicContractProxy,
  BscContract_proxy_fixed,
  BscContract_proxy_pattern_false_positive,
  BscContract_simple_suicide,
  BscContract_suicide_multitx_feasible,
  BscContract_suicide_multitx_infeasible,
  ContractDetectionResults,
  DetectionResultType,
  removeExplorerItems,
  ResultColor,
  ResultIconColor
};
