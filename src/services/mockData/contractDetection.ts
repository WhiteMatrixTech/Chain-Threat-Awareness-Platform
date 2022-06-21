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

export {
  BasicContract,
  ContractDetectionResults,
  DetectionResultType,
  ResultIconColor
};
