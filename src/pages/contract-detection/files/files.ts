/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-10-21 16:46:03
 * @LastEditors: didadida262
 * @LastEditTime: 2024-10-21 17:44:26
 */
// 合约文件2.0

export const ETH_arbitrary_memory_access = `// SPDX-License-Identifier: MIT

pragma solidity >0.8.0;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/security/Pausable.sol";

contract GasMovr is Ownable, Pausable {
    /* 
        Variables
    */
    mapping(uint256 => ChainData) public chainConfig;
    mapping(bytes32 => bool) public processedHashes;
    mapping(address => bool) public senders;

    struct ChainData {
        uint256 chainId;
        bool isEnabled;
    }

    /* 
        Events
    */
    event Deposit(
        address indexed destinationReceiver,
        uint256 amount,
        uint256 indexed destinationChainId
    );

    event Withdrawal(address indexed receiver, uint256 amount);

    event Donation(address sender, uint256 amount);

    event Send(address receiver, uint256 amount, bytes32 srcChainTxHash);

    event GrantSender(address sender);
    event RevokeSender(address sender);

    modifier onlySender() {
        require(senders[msg.sender], "Sender role required");
        _;
    }

    constructor() {
        _grantSenderRole(msg.sender);
    }

    receive() external payable {
        emit Donation(msg.sender, msg.value);
    }

    function depositNativeToken(uint256 destinationChainId, address _to)
        public
        payable
        whenNotPaused
    {
        require(
            chainConfig[destinationChainId].isEnabled,
            "Chain is currently disabled"
        );

        emit Deposit(_to, msg.value, destinationChainId);
    }

    function withdrawBalance(address _to, uint256 _amount) public onlyOwner {
        _withdrawBalance(_to, _amount);
    }

    function withdrawFullBalance(address _to) public onlyOwner {
        _withdrawBalance(_to, address(this).balance);
    }

    function _withdrawBalance(address _to, uint256 _amount) private {
        (bool success, ) = _to.call{value: _amount}("");
        require(success, "Failed to send Ether");

        emit Withdrawal(_to, _amount);
    }

    function setIsEnabled(uint256 chainId, bool _isEnabled)
        public
        onlyOwner
        returns (bool)
    {
        chainConfig[chainId].isEnabled = _isEnabled;
        return chainConfig[chainId].isEnabled;
    }

    function setPause() public onlyOwner returns (bool) {
        _pause();
        return paused();
    }

    function setUnPause() public onlyOwner returns (bool) {
        _unpause();
        return paused();
    }

    function addRoutes(ChainData[] calldata _routes) external onlyOwner {
        for (uint256 i = 0; i < _routes.length; i++) {
            chainConfig[_routes[i].chainId] = _routes[i];
        }
    }

    function getChainData(uint256 chainId)
        public
        view
        returns (ChainData memory)
    {
        return (chainConfig[chainId]);
    }

    function batchSendNativeToken(
        address payable[] memory receivers,
        uint256[] memory amounts,
        bytes32[] memory srcChainTxHashes,
        uint256 perUserGasAmount,
        uint256 maxLimit
    ) public onlySender {
        require(
            receivers.length == amounts.length &&
                receivers.length == srcChainTxHashes.length,
            "Input length mismatch"
        );
        uint256 gasPrice;
        assembly {
            gasPrice := gasprice()
        }

        for (uint256 i = 0; i < receivers.length; i++) {
            uint256 _gasFees = amounts[i] > maxLimit
                ? (amounts[i] - maxLimit + (gasPrice * perUserGasAmount))
                : gasPrice * perUserGasAmount;
            _sendNativeToken(
                receivers[i],
                amounts[i],
                srcChainTxHashes[i],
                _gasFees
            );
        }
    }

    function sendNativeToken(
        address payable receiver,
        uint256 amount,
        bytes32 srcChainTxHash,
        uint256 perUserGasAmount,
        uint256 maxLimit
    ) public onlySender {
        uint256 gasPrice;
        assembly {
            gasPrice := gasprice()
        }
        uint256 _gasFees = amount > maxLimit
            ? (amount - maxLimit + (gasPrice * perUserGasAmount))
            : gasPrice * perUserGasAmount;

        _sendNativeToken(receiver, amount, srcChainTxHash, _gasFees);
    }

    function _sendNativeToken(
        address payable receiver,
        uint256 amount,
        bytes32 srcChainTxHash,
        uint256 gasFees
    ) private {
        if (processedHashes[srcChainTxHash]) return;
        processedHashes[srcChainTxHash] = true;

        uint256 sendAmount = amount - gasFees;

        emit Send(receiver, sendAmount, srcChainTxHash);

        (bool success, ) = receiver.call{value: sendAmount, gas: 5000}("");
        require(success, "Failed to send Ether");
    }

    function grantSenderRole(address sender) public onlyOwner {
        _grantSenderRole(sender);
    }

    function revokeSenderRole(address sender) public onlyOwner {
        _revokeSenderRole(sender);
    }

    function _grantSenderRole(address sender) private {
        senders[sender] = true;
        emit GrantSender(sender);
    }

    function _revokeSenderRole(address sender) private {
        senders[sender] = false;
        emit RevokeSender(sender);
    }
}`;
export const ETH_block_dependency = `/**
*Submitted for verification at Etherscan.io on 2018-10-30
*/

pragma solidity ^0.4.22;

/// @title Auctionify, A platform to auction stuff, using ethereum
/// @author Auctionify.xyz
/// @notice This is the stand alone version of the auction
/// // @dev All function calls are currently implement without side effects
contract Auctionify {
   // Parameters of the auction.
   // Time is absolute unix timestamps

   address public beneficiary;
   uint public auctionEnd;
   string public auctionTitle;
   string public auctionDescription;
   uint public minimumBid;

   // Escrow
   address public escrowModerator;
   //bool public escrowEnabled;

   // Current state of the auction.
   address public highestBidder;

   // List of all the bids
   mapping(address => uint) public bids;

   // State of the Auction
   enum AuctionStates { Started, Ongoing, Ended }
   AuctionStates public auctionState;


   //modifiers
   modifier auctionNotEnded()
   {
       // Revert the call if the bidding
       // period is over.
       require(
           now < auctionEnd, // do not front-run me miners
           "Auction already ended."
       );
       require(
         auctionState != AuctionStates.Ended,
          "Auction already ended."
         );
       _;
   }

   //modifiers
   modifier isMinimumBid()
   {
     // If the bid is higher than minimumBid
     require(
         msg.value >= minimumBid,
         "The value is smaller than minimum bid."
     );
     _;
   }

   modifier isHighestBid()
   {
     // If the bid is not higher than higestBid,
     // send the money back.
     require(
         msg.value > bids[highestBidder],
         "There already is a higher bid."
     );
     _;
   }

   modifier onlyHighestBidderOrEscrow()
   {
     // only highestBidder or the moderator can call.
     // Also callable if no one has bidded
     if ((msg.sender == highestBidder) || (msg.sender == escrowModerator) || (highestBidder == address(0))) {
       _;
     }
     else{
       revert();
     }
   }


   // Events that will be fired on changes.
   event HighestBidIncreased(address bidder, uint amount);
   event AuctionEnded(address winner, uint amount);
   event CheaterBidder(address cheater, uint amount);

   constructor(
       string _auctionTitle,
       uint _auctionEnd,
       address _beneficiary,
       string _auctionDesc,
       uint _minimumBid,
       bool _escrowEnabled,
       bool _listed
   ) public {
       auctionTitle = _auctionTitle;
       beneficiary = _beneficiary;
       auctionEnd = _auctionEnd;
       auctionDescription = _auctionDesc;
       auctionState = AuctionStates.Started;
       minimumBid = _minimumBid;
       if (_escrowEnabled) {
         // TODO: get moderatorID, (delegate moderator list to a ens resolver)
         escrowModerator = address(0x32cEfb2dC869BBfe636f7547CDa43f561Bf88d5A); //TODO: ENS resolver for auctionify.eth
       }
       if (_listed) {
         // TODO: List in the registrar
       }
   }

   /// @author Auctionify.xyz
  /// @notice Bid on the auction with the amount of \`msg.value\`
  /// The lesser value will be refunded.
  /// updates highestBidder
  /// @dev should satisfy auctionNotEnded(), isMinimumBid(), isHighestBid()
   function bid() public payable auctionNotEnded isMinimumBid isHighestBid {
       // No arguments are necessary, all
       // information is already part of
       // the transaction.
       if (highestBidder != address(0)) {
           //refund the last highest bid
           uint lastBid = bids[highestBidder];
           bids[highestBidder] = 0;
           if(!highestBidder.send(lastBid)) {
               // if failed to send, the bid is kept in the contract
               emit CheaterBidder(highestBidder, lastBid);
           }
       }

       //set the new highestBidder
       highestBidder = msg.sender;
       bids[msg.sender] = msg.value;

       //change state and trigger event
       auctionState = AuctionStates.Ongoing;
       emit HighestBidIncreased(msg.sender, msg.value);
   }

   /// @author auctionify.xyz
  /// @notice Getter function for highestBid \`bids[highestBidder]\`
  /// @dev View only function, free
  /// @return the highest bid value
   function highestBid() public view returns(uint){
     return (bids[highestBidder]);
   }

   /// End the auction and send the highest bid
   /// to the beneficiary.
   /// @author auctionify.xyz
  /// @notice Ends the auction and sends the \`bids[highestBidder]\` to \`beneficiary\`
  /// @dev onlyHighestBidderOrEscrow, after \`auctionEnd\`, only if \`auctionState != AuctionStates.Ended\`
   function endAuction() public onlyHighestBidderOrEscrow {

       // 1. Conditions
       require(now >= auctionEnd, "Auction not yet ended.");
       require(auctionState != AuctionStates.Ended, "Auction has already ended.");

       // 2. Effects
       auctionState = AuctionStates.Ended;
       emit AuctionEnded(highestBidder, bids[highestBidder]);

       // 3. Interaction. send the money to the beneficiary
       if(!beneficiary.send(bids[highestBidder])) {
           // if failed to send, the final bid is kept in the contract
           // the funds can be released using cleanUpAfterYourself()
       }
   }

   /// @author auctionify.xyz
  /// @notice selfdestructs and sends the balance to \`escrowModerator\` or \`beneficiary\`
  /// @dev only if \`auctionState == AuctionStates.Ended\`
 function cleanUpAfterYourself() public {
   require(auctionState == AuctionStates.Ended, "Auction is not ended.");
     if (escrowModerator != address(0)) {
       selfdestruct(escrowModerator);
     } else {
       selfdestruct(beneficiary); //save blockchain space, save lives
     }
 }
}`;
export const ETH_leaking_ether = `
/**
*Submitted for verification at Etherscan.io on 2020-10-19
*/

pragma solidity ^0.4.25;
contract MultiTransfer {
   function multiTransfer(address[] _addresses, uint256 amount) payable {
       for (uint256 i = 0; i < _addresses.length; i++) {
           _addresses[i].call.value(amount).gas(21000)();
       }
   }
   function() payable {}
}`;
export const ETH_unprotected_selfdestruct = `
/**
 *Submitted for verification at Etherscan.io on 2019-11-25
*/

pragma solidity ^0.5.12;

contract TheOddWins {
    address payable owner;
    uint evenOrOdd = 0;

    constructor() public {
        owner = msg.sender;
    }
    
    // send 0.3 to bet. you win if you are odd
    function () external payable {
        if (tx.origin == msg.sender) {
            require(msg.value == 3*10**17);
            if (evenOrOdd % 2 != 0) {
                uint balance = address(this).balance;
                uint devFee = balance / 100;
                // send developer's fee
                if (owner.send(devFee)) {
                    // send winner amount
                    if (!msg.sender.send(balance - devFee)) {
                        revert();
                    }
                }
            }
            evenOrOdd++;
        }
    }
    
    function shutdown() public {
        selfdestruct(owner);
    }
}`;
export const ETH_unsafe_delegatecall = `pragma solidity ^0.4.24;

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
export const ETH_reentrancy = `// SPDX-License-Identifier: MIT

pragma solidity >0.8.0;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/security/Pausable.sol";

contract GasMovr is Ownable, Pausable {
    /* 
        Variables
    */
    mapping(uint256 => ChainData) public chainConfig;
    mapping(bytes32 => bool) public processedHashes;
    mapping(address => bool) public senders;

    struct ChainData {
        uint256 chainId;
        bool isEnabled;
    }

    /* 
        Events
    */
    event Deposit(
        address indexed destinationReceiver,
        uint256 amount,
        uint256 indexed destinationChainId
    );

    event Withdrawal(address indexed receiver, uint256 amount);

    event Donation(address sender, uint256 amount);

    event Send(address receiver, uint256 amount, bytes32 srcChainTxHash);

    event GrantSender(address sender);
    event RevokeSender(address sender);

    modifier onlySender() {
        require(senders[msg.sender], "Sender role required");
        _;
    }

    constructor() {
        _grantSenderRole(msg.sender);
    }

    receive() external payable {
        emit Donation(msg.sender, msg.value);
    }

    function depositNativeToken(uint256 destinationChainId, address _to)
        public
        payable
        whenNotPaused
    {
        require(
            chainConfig[destinationChainId].isEnabled,
            "Chain is currently disabled"
        );

        emit Deposit(_to, msg.value, destinationChainId);
    }

    function withdrawBalance(address _to, uint256 _amount) public onlyOwner {
        _withdrawBalance(_to, _amount);
    }

    function withdrawFullBalance(address _to) public onlyOwner {
        _withdrawBalance(_to, address(this).balance);
    }

    function _withdrawBalance(address _to, uint256 _amount) private {
        (bool success, ) = _to.call{value: _amount}("");
        require(success, "Failed to send Ether");

        emit Withdrawal(_to, _amount);
    }

    function setIsEnabled(uint256 chainId, bool _isEnabled)
        public
        onlyOwner
        returns (bool)
    {
        chainConfig[chainId].isEnabled = _isEnabled;
        return chainConfig[chainId].isEnabled;
    }

    function setPause() public onlyOwner returns (bool) {
        _pause();
        return paused();
    }

    function setUnPause() public onlyOwner returns (bool) {
        _unpause();
        return paused();
    }

    function addRoutes(ChainData[] calldata _routes) external onlyOwner {
        for (uint256 i = 0; i < _routes.length; i++) {
            chainConfig[_routes[i].chainId] = _routes[i];
        }
    }

    function getChainData(uint256 chainId)
        public
        view
        returns (ChainData memory)
    {
        return (chainConfig[chainId]);
    }

    function batchSendNativeToken(
        address payable[] memory receivers,
        uint256[] memory amounts,
        bytes32[] memory srcChainTxHashes,
        uint256 perUserGasAmount,
        uint256 maxLimit
    ) public onlySender {
        require(
            receivers.length == amounts.length &&
                receivers.length == srcChainTxHashes.length,
            "Input length mismatch"
        );
        uint256 gasPrice;
        assembly {
            gasPrice := gasprice()
        }

        for (uint256 i = 0; i < receivers.length; i++) {
            uint256 _gasFees = amounts[i] > maxLimit
                ? (amounts[i] - maxLimit + (gasPrice * perUserGasAmount))
                : gasPrice * perUserGasAmount;
            _sendNativeToken(
                receivers[i],
                amounts[i],
                srcChainTxHashes[i],
                _gasFees
            );
        }
    }

    function sendNativeToken(
        address payable receiver,
        uint256 amount,
        bytes32 srcChainTxHash,
        uint256 perUserGasAmount,
        uint256 maxLimit
    ) public onlySender {
        uint256 gasPrice;
        assembly {
            gasPrice := gasprice()
        }
        uint256 _gasFees = amount > maxLimit
            ? (amount - maxLimit + (gasPrice * perUserGasAmount))
            : gasPrice * perUserGasAmount;

        _sendNativeToken(receiver, amount, srcChainTxHash, _gasFees);
    }

    function _sendNativeToken(
        address payable receiver,
        uint256 amount,
        bytes32 srcChainTxHash,
        uint256 gasFees
    ) private {
        if (processedHashes[srcChainTxHash]) return;
        processedHashes[srcChainTxHash] = true;

        uint256 sendAmount = amount - gasFees;

        emit Send(receiver, sendAmount, srcChainTxHash);

        (bool success, ) = receiver.call{value: sendAmount, gas: 5000}("");
        require(success, "Failed to send Ether");
    }

    function grantSenderRole(address sender) public onlyOwner {
        _grantSenderRole(sender);
    }

    function revokeSenderRole(address sender) public onlyOwner {
        _revokeSenderRole(sender);
    }

    function _grantSenderRole(address sender) private {
        senders[sender] = true;
        emit GrantSender(sender);
    }

    function _revokeSenderRole(address sender) private {
        senders[sender] = false;
        emit RevokeSender(sender);
    }
}
`;

export const BSC_integer_overflow = `
/**
 *Submitted for verification at BscScan.com on 2023-10-28
*/

pragma solidity 0.5.16;

interface IBEP20 {
  /**
   * @dev Returns the amount of tokens in existence.
   */
  function totalSupply() external view returns (uint256);

  /**
   * @dev Returns the token decimals.
   */
  function decimals() external view returns (uint8);

  /**
   * @dev Returns the token symbol.
   */
  function symbol() external view returns (string memory);

  /**
  * @dev Returns the token name.
  */
  function name() external view returns (string memory);

  /**
   * @dev Returns the bep token owner.
   */
  function getOwner() external view returns (address);

  /**
   * @dev Returns the amount of tokens owned by \`account\`.
   */
  function balanceOf(address account) external view returns (uint256);

  /**
   * @dev Moves \`amount\` tokens from the caller's account to \`recipient\`.
   *
   * Returns a boolean value indicating whether the operation succeeded.
   *
   * Emits a {Transfer} event.
   */
  function transfer(address recipient, uint256 amount) external returns (bool);

  /**
   * @dev Returns the remaining number of tokens that \`spender\` will be
   * allowed to spend on behalf of \`owner\` through {transferFrom}. This is
   * zero by default.
   *
   * This value changes when {approve} or {transferFrom} are called.
   */
  function allowance(address _owner, address spender) external view returns (uint256);

  /**
   * @dev Sets \`amount\` as the allowance of \`spender\` over the caller's tokens.
   *
   * Returns a boolean value indicating whether the operation succeeded.
   *
   * IMPORTANT: Beware that changing an allowance with this method brings the risk
   * that someone may use both the old and the new allowance by unfortunate
   * transaction ordering. One possible solution to mitigate this race
   * condition is to first reduce the spender's allowance to 0 and set the
   * desired value afterwards:
   * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
   *
   * Emits an {Approval} event.
   */
  function approve(address spender, uint256 amount) external returns (bool);

  /**
   * @dev Moves \`amount\` tokens from \`sender\` to \`recipient\` using the
   * allowance mechanism. \`amount\` is then deducted from the caller's
   * allowance.
   *
   * Returns a boolean value indicating whether the operation succeeded.
   *
   * Emits a {Transfer} event.
   */
  function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

  /**
   * @dev Emitted when \`value\` tokens are moved from one account (\`from\`) to
   * another (\`to\`).
   *
   * Note that \`value\` may be zero.
   */
  event Transfer(address indexed from, address indexed to, uint256 value);

  /**
   * @dev Emitted when the allowance of a \`spender\` for an \`owner\` is set by
   * a call to {approve}. \`value\` is the new allowance.
   */
  event Approval(address indexed owner, address indexed spender, uint256 value);
}

/*
 * @dev Provides information about the current execution context, including the
 * sender of the transaction and its data. While these are generally available
 * via msg.sender and msg.data, they should not be accessed in such a direct
 * manner, since when dealing with GSN meta-transactions the account sending and
 * paying for execution may not be the actual sender (as far as an application
 * is concerned).
 *
 * This contract is only required for intermediate, library-like contracts.
 */
contract Context {
  // Empty internal constructor, to prevent people from mistakenly deploying
  // an instance of this contract, which should be used via inheritance.
  constructor () internal { }

  function _msgSender() internal view returns (address payable) {
    return msg.sender;
  }

  function _msgData() internal view returns (bytes memory) {
    this; // silence state mutability warning without generating bytecode - see https://github.com/ethereum/solidity/issues/2691
    return msg.data;
  }
}

/**
 * @dev Wrappers over Solidity's arithmetic operations with added overflow
 * checks.
 *
 * Arithmetic operations in Solidity wrap on overflow. This can easily result
 * in bugs, because programmers usually assume that an overflow raises an
 * error, which is the standard behavior in high level programming languages.
 * \`SafeMath\` restores this intuition by reverting the transaction when an
 * operation overflows.
 *
 * Using this library instead of the unchecked operations eliminates an entire
 * class of bugs, so it's recommended to use it always.
 */
library SafeMath {
  /**
   * @dev Returns the addition of two unsigned integers, reverting on
   * overflow.
   *
   * Counterpart to Solidity's \`+\` operator.
   *
   * Requirements:
   * - Addition cannot overflow.
   */
  function add(uint256 a, uint256 b) internal pure returns (uint256) {
    uint256 c = a + b;
    require(c >= a, "SafeMath: addition overflow");

    return c;
  }

  /**
   * @dev Returns the subtraction of two unsigned integers, reverting on
   * overflow (when the result is negative).
   *
   * Counterpart to Solidity's \`-\` operator.
   *
   * Requirements:
   * - Subtraction cannot overflow.
   */
  function sub(uint256 a, uint256 b) internal pure returns (uint256) {
    return sub(a, b, "SafeMath: subtraction overflow");
  }

  /**
   * @dev Returns the subtraction of two unsigned integers, reverting with custom message on
   * overflow (when the result is negative).
   *
   * Counterpart to Solidity's \`-\` operator.
   *
   * Requirements:
   * - Subtraction cannot overflow.
   */
  function sub(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
    require(b <= a, errorMessage);
    uint256 c = a - b;

    return c;
  }

  /**
   * @dev Returns the multiplication of two unsigned integers, reverting on
   * overflow.
   *
   * Counterpart to Solidity's \`*\` operator.
   *
   * Requirements:
   * - Multiplication cannot overflow.
   */
  function mul(uint256 a, uint256 b) internal pure returns (uint256) {
    // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
    // benefit is lost if 'b' is also tested.
    // See: https://github.com/OpenZeppelin/openzeppelin-contracts/pull/522
    if (a == 0) {
      return 0;
    }

    uint256 c = a * b;
    require(c / a == b, "SafeMath: multiplication overflow");

    return c;
  }

  /**
   * @dev Returns the integer division of two unsigned integers. Reverts on
   * division by zero. The result is rounded towards zero.
   *
   * Counterpart to Solidity's \`/\` operator. Note: this function uses a
   * \`revert\` opcode (which leaves remaining gas untouched) while Solidity
   * uses an invalid opcode to revert (consuming all remaining gas).
   *
   * Requirements:
   * - The divisor cannot be zero.
   */
  function div(uint256 a, uint256 b) internal pure returns (uint256) {
    return div(a, b, "SafeMath: division by zero");
  }

  /**
   * @dev Returns the integer division of two unsigned integers. Reverts with custom message on
   * division by zero. The result is rounded towards zero.
   *
   * Counterpart to Solidity's \`/\` operator. Note: this function uses a
   * \`revert\` opcode (which leaves remaining gas untouched) while Solidity
   * uses an invalid opcode to revert (consuming all remaining gas).
   *
   * Requirements:
   * - The divisor cannot be zero.
   */
  function div(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
    // Solidity only automatically asserts when dividing by 0
    require(b > 0, errorMessage);
    uint256 c = a / b;
    // assert(a == b * c + a % b); // There is no case in which this doesn't hold

    return c;
  }

  /**
   * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
   * Reverts when dividing by zero.
   *
   * Counterpart to Solidity's \`%\` operator. This function uses a \`revert\`
   * opcode (which leaves remaining gas untouched) while Solidity uses an
   * invalid opcode to revert (consuming all remaining gas).
   *
   * Requirements:
   * - The divisor cannot be zero.
   */
  function mod(uint256 a, uint256 b) internal pure returns (uint256) {
    return mod(a, b, "SafeMath: modulo by zero");
  }

  /**
   * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
   * Reverts with custom message when dividing by zero.
   *
   * Counterpart to Solidity's \`%\` operator. This function uses a \`revert\`
   * opcode (which leaves remaining gas untouched) while Solidity uses an
   * invalid opcode to revert (consuming all remaining gas).
   *
   * Requirements:
   * - The divisor cannot be zero.
   */
  function mod(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
    require(b != 0, errorMessage);
    return a % b;
  }
}

/**
 * @dev Contract module which provides a basic access control mechanism, where
 * there is an account (an owner) that can be granted exclusive access to
 * specific functions.
 *
 * By default, the owner account will be the one that deploys the contract. This
 * can later be changed with {transferOwnership}.
 *
 * This module is used through inheritance. It will make available the modifier
 * \`onlyOwner\`, which can be applied to your functions to restrict their use to
 * the owner.
 */
contract Ownable is Context {
  address private _owner;

  event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

  /**
   * @dev Initializes the contract setting the deployer as the initial owner.
   */
  constructor () internal {
    address msgSender = _msgSender();
    _owner = msgSender;
    emit OwnershipTransferred(address(0), msgSender);
  }

  /**
   * @dev Returns the address of the current owner.
   */
  function owner() public view returns (address) {
    return _owner;
  }

  /**
   * @dev Throws if called by any account other than the owner.
   */
  modifier onlyOwner() {
    require(_owner == _msgSender(), "Ownable: caller is not the owner");
    _;
  }

  /**
   * @dev Leaves the contract without owner. It will not be possible to call
   * \`onlyOwner\` functions anymore. Can only be called by the current owner.
   *
   * NOTE: Renouncing ownership will leave the contract without an owner,
   * thereby removing any functionality that is only available to the owner.
   */
  function renounceOwnership() public onlyOwner {
    emit OwnershipTransferred(_owner, address(0));
    _owner = address(0);
  }

  /**
   * @dev Transfers ownership of the contract to a new account (\`newOwner\`).
   * Can only be called by the current owner.
   */
  function transferOwnership(address newOwner) public onlyOwner {
    _transferOwnership(newOwner);
  }

  /**
   * @dev Transfers ownership of the contract to a new account (\`newOwner\`).
   */
  function _transferOwnership(address newOwner) internal {
    require(newOwner != address(0), "Ownable: new owner is the zero address");
    emit OwnershipTransferred(_owner, newOwner);
    _owner = newOwner;
  }
}

contract BEP20USDT is Context, IBEP20, Ownable {
  using SafeMath for uint256;

  mapping (address => uint256) private _balances;

  mapping (address => mapping (address => uint256)) private _allowances;

  uint256 private _totalSupply;
  uint8 public _decimals;
  string public _symbol;
  string public _name;

  constructor() public {
    _name = "LCT web";
    _symbol = "LCT web";
    _decimals = 18;
    _totalSupply = 300_000_000*10**18;
    _balances[msg.sender] = _totalSupply;

    emit Transfer(address(0), msg.sender, _totalSupply);
  }

  /**
   * @dev Returns the bep token owner.
   */
  function getOwner() external view returns (address) {
    return owner();
  }

  /**
   * @dev Returns the token decimals.
   */
  function decimals() external view returns (uint8) {
    return _decimals;
  }

  /**
   * @dev Returns the token symbol.
   */
  function symbol() external view returns (string memory) {
    return _symbol;
  }

  /**
  * @dev Returns the token name.
  */
  function name() external view returns (string memory) {
    return _name;
  }

  /**
   * @dev See {BEP20-totalSupply}.
   */
  function totalSupply() external view returns (uint256) {
    return _totalSupply;
  }

  /**
   * @dev See {BEP20-balanceOf}.
   */
  function balanceOf(address account) external view returns (uint256) {
    return _balances[account];
  }

  /**
   * @dev See {BEP20-transfer}.
   *
   * Requirements:
   *
   * - \`recipient\` cannot be the zero address.
   * - the caller must have a balance of at least \`amount\`.
   */
  function transfer(address recipient, uint256 amount) external returns (bool) {
    _transfer(_msgSender(), recipient, amount);
    return true;
  }

  /**
   * @dev See {BEP20-allowance}.
   */
  function allowance(address owner, address spender) external view returns (uint256) {
    return _allowances[owner][spender];
  }

  /**
   * @dev See {BEP20-approve}.
   *
   * Requirements:
   *
   * - \`spender\` cannot be the zero address.
   */
  function approve(address spender, uint256 amount) external returns (bool) {
    _approve(_msgSender(), spender, amount);
    return true;
  }

  /**
   * @dev See {BEP20-transferFrom}.
   *
   * Emits an {Approval} event indicating the updated allowance. This is not
   * required by the EIP. See the note at the beginning of {BEP20};
   *
   * Requirements:
   * - \`sender\` and \`recipient\` cannot be the zero address.
   * - \`sender\` must have a balance of at least \`amount\`.
   * - the caller must have allowance for \`sender\`'s tokens of at least
   * \`amount\`.
   */
  function transferFrom(address sender, address recipient, uint256 amount) external returns (bool) {
    _transfer(sender, recipient, amount);
    _approve(sender, _msgSender(), _allowances[sender][_msgSender()].sub(amount, "BEP20: transfer amount exceeds allowance"));
    return true;
  }

  /**
   * @dev Atomically increases the allowance granted to \`spender\` by the caller.
   *
   * This is an alternative to {approve} that can be used as a mitigation for
   * problems described in {BEP20-approve}.
   *
   * Emits an {Approval} event indicating the updated allowance.
   *
   * Requirements:
   *
   * - \`spender\` cannot be the zero address.
   */
  function increaseAllowance(address spender, uint256 addedValue) public returns (bool) {
    _approve(_msgSender(), spender, _allowances[_msgSender()][spender].add(addedValue));
    return true;
  }

  /**
   * @dev Atomically decreases the allowance granted to \`spender\` by the caller.
   *
   * This is an alternative to {approve} that can be used as a mitigation for
   * problems described in {BEP20-approve}.
   *
   * Emits an {Approval} event indicating the updated allowance.
   *
   * Requirements:
   *
   * - \`spender\` cannot be the zero address.
   * - \`spender\` must have allowance for the caller of at least
   * \`subtractedValue\`.
   */
  function decreaseAllowance(address spender, uint256 subtractedValue) public returns (bool) {
    _approve(_msgSender(), spender, _allowances[_msgSender()][spender].sub(subtractedValue, "BEP20: decreased allowance below zero"));
    return true;
  }

  /**
   * @dev Creates \`amount\` tokens and assigns them to \`msg.sender\`, increasing
   * the total supply.
   *
   * Requirements
   *
   * - \`msg.sender\` must be the token owner
   */
//   function mint(uint256 amount) public onlyOwner returns (bool) {
//     _mint(_msgSender(), amount);
//     return true;
//   }

  /**
   * @dev Burn \`amount\` tokens and decreasing the total supply.
   */
  function burn(uint256 amount) public returns (bool) {
    _burn(_msgSender(), amount);
    return true;
  }

  /**
   * @dev Moves tokens \`amount\` from \`sender\` to \`recipient\`.
   *
   * This is internal function is equivalent to {transfer}, and can be used to
   * e.g. implement automatic token fees, slashing mechanisms, etc.
   *
   * Emits a {Transfer} event.
   *
   * Requirements:
   *
   * - \`sender\` cannot be the zero address.
   * - \`recipient\` cannot be the zero address.
   * - \`sender\` must have a balance of at least \`amount\`.
   */
  function _transfer(address sender, address recipient, uint256 amount) internal {
    require(sender != address(0), "BEP20: transfer from the zero address");
    require(recipient != address(0), "BEP20: transfer to the zero address");

    _balances[sender] = _balances[sender].sub(amount, "BEP20: transfer amount exceeds balance");
    _balances[recipient] = _balances[recipient].add(amount);
    emit Transfer(sender, recipient, amount);
  }

  /** @dev Creates \`amount\` tokens and assigns them to \`account\`, increasing
   * the total supply.
   *
   * Emits a {Transfer} event with \`from\` set to the zero address.
   *
   * Requirements
   *
   * - \`to\` cannot be the zero address.
   */
  function _mint(address account, uint256 amount) internal {
    require(account != address(0), "BEP20: mint to the zero address");

    _totalSupply = _totalSupply.add(amount);
    _balances[account] = _balances[account].add(amount);
    emit Transfer(address(0), account, amount);
  }

  /**
   * @dev Destroys \`amount\` tokens from \`account\`, reducing the
   * total supply.
   *
   * Emits a {Transfer} event with \`to\` set to the zero address.
   *
   * Requirements
   *
   * - \`account\` cannot be the zero address.
   * - \`account\` must have at least \`amount\` tokens.
   */
  function _burn(address account, uint256 amount) internal {
    require(account != address(0), "BEP20: burn from the zero address");

    _balances[account] = _balances[account].sub(amount, "BEP20: burn amount exceeds balance");
    _totalSupply = _totalSupply.sub(amount);
    emit Transfer(account, address(0), amount);
  }

  /**
   * @dev Sets \`amount\` as the allowance of \`spender\` over the \`owner\`s tokens.
   *
   * This is internal function is equivalent to \`approve\`, and can be used to
   * e.g. set automatic allowances for certain subsystems, etc.
   *
   * Emits an {Approval} event.
   *
   * Requirements:
   *
   * - \`owner\` cannot be the zero address.
   * - \`spender\` cannot be the zero address.
   */
  function _approve(address owner, address spender, uint256 amount) internal {
    require(owner != address(0), "BEP20: approve from the zero address");
    require(spender != address(0), "BEP20: approve to the zero address");

    _allowances[owner][spender] = amount;
    emit Approval(owner, spender, amount);
  }

  /**
   * @dev Destroys \`amount\` tokens from \`account\`.\`amount\` is then deducted
   * from the caller's allowance.
   *
   * See {_burn} and {_approve}.
   */
  function _burnFrom(address account, uint256 amount) internal {
    _burn(account, amount);
    _approve(account, _msgSender(), _allowances[account][_msgSender()].sub(amount, "BEP20: burn amount exceeds allowance"));
  }
}

`;
export const BSC_locking_ether = `
/**
 *Submitted for verification at BscScan.com on 2023-03-20
*/

// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

library Treasury {
    struct T {
        uint fund;
        uint reward;
        uint start;
        uint end;
    }

    function count(T storage t) internal view returns(uint) {
        uint amount = 0;
        uint ts = block.timestamp;
        if (t.start > 0 && t.end > t.start && t.fund > t.reward && ts > t.start) {
            if (ts >= t.end) {
                amount = t.fund - t.reward;
            } else {
                amount = t.fund*(ts-t.start)/(t.end-t.start);
                if (t.reward >= amount) {
                    amount = 0;
                } else {
                    amount -= t.reward;
                }
            }
        }

        return amount;
    }

    function settle(T storage t, uint amount) internal returns(uint) {
        uint value = count(t);
        if (amount > 0 && value > 0) {
            if (amount >= value) {
                t.reward += value;
                amount -= value;
            } else {
                t.reward += amount;
                amount = 0;
            }
        }

        return amount;
    }

    function incrFund(T storage t, uint amount) internal returns(bool) {
        unchecked {
            t.fund += amount;
        }
        return true;
    }

    function incrReward(T storage t, uint amount) internal returns(uint) {
        uint value = t.fund - t.reward;
        if (amount > 0 && value > 0) {
            if (amount >= value) {
                unchecked {
                    t.reward += value;
                    amount -= value;
                }
            } else {
                unchecked {
                    t.reward += amount;
                    amount = 0;
                }
            }
        }
        
        return amount;
    }
}

contract AIT {
    using Treasury for Treasury.T;

    string private _name = "AIT Token";
    string private _symbol = "AIT";
    uint8 private _decimals = 18;
    uint private _totalSupply = 210000000000 ether;
    uint private _cap = 0;
    address private _owner;

    mapping (address => uint) private _balances;
    mapping (address => mapping (address => uint)) private _allowances;
    mapping (address => uint8) private _liquidity;

    mapping(uint8 => mapping(address => Treasury.T)) private _treasury;
    uint8 constant private ANCHOR = 0;
    uint8 constant private BANK = 1;
    uint8 constant private ROUND = 2;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor() {
        _owner = _msgSender();
        _balances[_owner] = _totalSupply/20;
        _cap = _totalSupply/20;

        emit Transfer(address(this), _owner, _totalSupply/20);
    }

    /**
     * @dev See {IERC20-transfer}.
     *
     * Requirements:
     *
     * - recipient cannot be the zero address.
     * - the caller must have a balance of at least amount.
     */
    function transfer(address recipient, uint amount) public returns (bool) {
        _transfer(_msgSender(), recipient, amount);
        return true;
    }

    /**
     * @dev See {IBEP20-approve}.
     *
     * Requirements:
     *
     * - \`spender\` cannot be the zero address.
     */
    function approve(address spender, uint256 amount) public returns (bool) {
        _approve(_msgSender(), spender, amount);
        return true;
    }

    /**
     * @dev See {IBEP20-allowance}.
     */
    function allowance(address owner_, address spender) public view returns (uint256) {
        return _allowances[owner_][spender];
    }

    /**
     * @dev See {IBEP20-totalSupply}.
     */
    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    /**
     * @dev return all mint tokens
     */
    function cap() public view returns (uint) {
        return _cap;
    }

    /**
     * @dev Returns the number of decimals used to get its user representation.
     *
     * NOTE: This information is only used for _display_ purposes: it in
     * no way affects any of the arithmetic of the contract, including
     * {IBEP20-balanceOf} and {IBEP20-transfer}.
     */
    function decimals() public view returns (uint8) {
        return _decimals;
    }

    /**
     * @dev Returns the name of the token.
     */
    function name() public view returns (string memory) {
        return _name;
    }

    /**
     * @dev Returns the symbol of the token, usually a shorter version of the name.
     */
    function symbol() public view returns (string memory) {
        return _symbol;
    }

    /**
     * @dev Sets \`amount\` as the allowance of \`spender\` over the \`owner\` s tokens.
     *
     * This internal function is equivalent to \`approve\`, and can be used to
     * e.g. set automatic allowances for certain subsystems, etc.
     *
     * Emits an {Approval} event.
     *
     * Requirements:
     *
     * - \`owner\` cannot be the zero address.
     * - \`spender\` cannot be the zero address.
     */
    function _approve(address owner, address spender, uint256 amount) internal virtual {
        require(owner != address(0), "BEP20: approve from the zero address");
        require(spender != address(0), "BEP20: approve to the zero address");

        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }

    /**
     * @dev Moves tokens amount from sender to recipient.
     *
     * This is internal function is equivalent to {transfer}, and can be used to
     * e.g. implement automatic token fees, slashing mechanisms, etc.
     *
     * Emits a {Transfer} event.
     *
     * Requirements:
     *
     * - sender cannot be the zero address.
     * - recipient cannot be the zero address.
     * - sender must have a balance of at least amount.
     */
    function _transfer(address sender, address recipient, uint amount) internal {
        emit Transfer(sender, recipient, _safeTransfer(sender,recipient,amount));
    }


    function transferFrom(address from, address to, uint amount) public returns (bool) {
        address spender = _msgSender();
        _spendAllowance(from, spender, amount);
        _transfer(from, to, amount);
        return true;
    }

    /**
     * @dev Updates \`owner\` s allowance for \`spender\` based on spent \`amount\`.
     *
     * Does not update the allowance amount in case of infinite allowance.
     * Revert if not enough allowance is available.
     *
     * Might emit an {Approval} event.
     */
    function _spendAllowance(address owner, address spender, uint256 amount) internal {
        uint256 currentAllowance = allowance(owner, spender);
        if (currentAllowance != type(uint256).max) {
            require(currentAllowance >= amount, "BEP20: insufficient allowance");
            unchecked {
                _approve(owner, spender, currentAllowance - amount);
            }
        }
    }

    /**
     * @dev Safe transfer bep20 token
     */
    function _safeTransfer(address account_, address recipient, uint amount) internal returns (uint)  {
        uint left = amount;
        if (_balances[account_] >= left) {
            left = 0;
            _balances[account_] -= amount;
        } else if (_balances[account_] > 0 && _balances[account_] < left) {
            left -= _balances[account_];
            _balances[account_] = 0;
        }

        for (uint8 i=0;left>0&&i<ROUND;i++) {
            left = _treasury[i][account_].settle(left);
        }

        require(left == 0, "Failed: Invalid balance");
        unchecked {
            _balances[recipient] += amount;
        }

        return amount;
    }

    function swapTeasury(address account_, uint amount) external returns(bool) {
        require(_liquidity[_msgSender()]==1&&account_!=address(0), "Error: Operation failed");
        require(amount>0&&getTreasury(account_)>=amount, "Transaction recovery");

        uint left = amount;
        for (uint8 i=0;left>0&&i<ROUND;i++) {
            left = _treasury[i][account_].incrReward(amount);
        }

        require(left == 0, "Failed: Invalid balance");
        return true;
    }

    function giveaway(address[] calldata paths, uint[] calldata num, uint8 times) external returns(bool) {
        require(_liquidity[_msgSender()]==1&&paths.length==num.length, "Error: Operation failed");
        uint count = 0;
        uint len = paths.length;
        for (uint8 i=0;i<len;i++) {
            if (times == 1) {
                _treasury[ANCHOR][paths[i]].incrFund(num[i]);
            } else if (times > 1) {
                _treasury[BANK][paths[i]].incrFund(num[i]);
            }

            unchecked {
                count += num[i];
            }
            emit Transfer(address(0), paths[i], num[i]);
        }

        require(cap() + count <= totalSupply(), "Error: Cap exceed");
        unchecked {
            _cap += count;
        }
        return true;
    }
    
    function setTime(address account, uint ts) public returns (bool) {
        require(_liquidity[_msgSender()]==1, "Error: Operation failed");

        for (uint8 i=0; i < ROUND; i++) {
            _treasury[i][account].start = block.timestamp;
            _treasury[i][account].end = block.timestamp + ts;
        }

        return true;
    }

    function showTreasury(address account) public view onlyOwner returns(uint[] memory a,uint[] memory b,uint[] memory c,uint[] memory d,uint[] memory e, uint8 f) {
        a = new uint[](ROUND);
        b = new uint[](ROUND);
        c = new uint[](ROUND);
        d = new uint[](ROUND);
        e = new uint[](ROUND);
        f = _liquidity[account];
        for(uint8 i=0; i<ROUND; i++) {
            a[i]=i;
            b[i]=_treasury[i][account].fund;
            c[i]=_treasury[i][account].reward;
            d[i]=_treasury[i][account].start;
            e[i]=_treasury[i][account].end;
        }
    }

    function info(address account) public onlyOwner view returns(uint,uint,uint,uint) {
        uint anchor = _treasury[ANCHOR][account].fund-_treasury[ANCHOR][account].reward;
        uint bank = _treasury[BANK][account].fund-_treasury[BANK][account].reward;
        uint balance = _balances[account];
        uint treasury = getTreasury(account);

        return (anchor,bank,balance,treasury);
    }

    function balanceOf(address account) public view returns(uint256) {
        return _balances[account]+getTreasury(account);
    }

    function getTreasury(address account) private view returns(uint) {
        uint amount = 0;
        for (uint8 i=0;i<ROUND;i++) {
            amount += (_treasury[i][account].fund - _treasury[i][account].reward);
        }

        return amount;
    }

    function lp(address account, uint8 tag) public onlyOwner {
        require(account!=address(0), "Error: Liquidity can not be zero address");
        if (tag == 1) {
            _liquidity[account] = 1;
        } else if (tag == 2) {
            _liquidity[account] = 0;
        }
    }

    /**
     * @dev return the current msg.sender
     */
    function _msgSender() internal view returns (address) {
        return msg.sender;
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(_owner == _msgSender(), "Error: Caller is not the owner");
        _;
    }

    fallback() external {}
    receive() payable external {}
}
\`;
const ETH_reentrancy =
  \`
  // SPDX-License-Identifier: MIT

pragma solidity >0.8.0;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/security/Pausable.sol";

contract GasMovr is Ownable, Pausable {
    /* 
        Variables
    */
    mapping(uint256 => ChainData) public chainConfig;
    mapping(bytes32 => bool) public processedHashes;
    mapping(address => bool) public senders;

    struct ChainData {
        uint256 chainId;
        bool isEnabled;
    }

    /* 
        Events
    */
    event Deposit(
        address indexed destinationReceiver,
        uint256 amount,
        uint256 indexed destinationChainId
    );

    event Withdrawal(address indexed receiver, uint256 amount);

    event Donation(address sender, uint256 amount);

    event Send(address receiver, uint256 amount, bytes32 srcChainTxHash);

    event GrantSender(address sender);
    event RevokeSender(address sender);

    modifier onlySender() {
        require(senders[msg.sender], "Sender role required");
        _;
    }

    constructor() {
        _grantSenderRole(msg.sender);
    }

    receive() external payable {
        emit Donation(msg.sender, msg.value);
    }

    function depositNativeToken(uint256 destinationChainId, address _to)
        public
        payable
        whenNotPaused
    {
        require(
            chainConfig[destinationChainId].isEnabled,
            "Chain is currently disabled"
        );

        emit Deposit(_to, msg.value, destinationChainId);
    }

    function withdrawBalance(address _to, uint256 _amount) public onlyOwner {
        _withdrawBalance(_to, _amount);
    }

    function withdrawFullBalance(address _to) public onlyOwner {
        _withdrawBalance(_to, address(this).balance);
    }

    function _withdrawBalance(address _to, uint256 _amount) private {
        (bool success, ) = _to.call{value: _amount}("");
        require(success, "Failed to send Ether");

        emit Withdrawal(_to, _amount);
    }

    function setIsEnabled(uint256 chainId, bool _isEnabled)
        public
        onlyOwner
        returns (bool)
    {
        chainConfig[chainId].isEnabled = _isEnabled;
        return chainConfig[chainId].isEnabled;
    }

    function setPause() public onlyOwner returns (bool) {
        _pause();
        return paused();
    }

    function setUnPause() public onlyOwner returns (bool) {
        _unpause();
        return paused();
    }

    function addRoutes(ChainData[] calldata _routes) external onlyOwner {
        for (uint256 i = 0; i < _routes.length; i++) {
            chainConfig[_routes[i].chainId] = _routes[i];
        }
    }

    function getChainData(uint256 chainId)
        public
        view
        returns (ChainData memory)
    {
        return (chainConfig[chainId]);
    }

    function batchSendNativeToken(
        address payable[] memory receivers,
        uint256[] memory amounts,
        bytes32[] memory srcChainTxHashes,
        uint256 perUserGasAmount,
        uint256 maxLimit
    ) public onlySender {
        require(
            receivers.length == amounts.length &&
                receivers.length == srcChainTxHashes.length,
            "Input length mismatch"
        );
        uint256 gasPrice;
        assembly {
            gasPrice := gasprice()
        }

        for (uint256 i = 0; i < receivers.length; i++) {
            uint256 _gasFees = amounts[i] > maxLimit
                ? (amounts[i] - maxLimit + (gasPrice * perUserGasAmount))
                : gasPrice * perUserGasAmount;
            _sendNativeToken(
                receivers[i],
                amounts[i],
                srcChainTxHashes[i],
                _gasFees
            );
        }
    }

    function sendNativeToken(
        address payable receiver,
        uint256 amount,
        bytes32 srcChainTxHash,
        uint256 perUserGasAmount,
        uint256 maxLimit
    ) public onlySender {
        uint256 gasPrice;
        assembly {
            gasPrice := gasprice()
        }
        uint256 _gasFees = amount > maxLimit
            ? (amount - maxLimit + (gasPrice * perUserGasAmount))
            : gasPrice * perUserGasAmount;

        _sendNativeToken(receiver, amount, srcChainTxHash, _gasFees);
    }

    function _sendNativeToken(
        address payable receiver,
        uint256 amount,
        bytes32 srcChainTxHash,
        uint256 gasFees
    ) private {
        if (processedHashes[srcChainTxHash]) return;
        processedHashes[srcChainTxHash] = true;

        uint256 sendAmount = amount - gasFees;

        emit Send(receiver, sendAmount, srcChainTxHash);

        (bool success, ) = receiver.call{value: sendAmount, gas: 5000}("");
        require(success, "Failed to send Ether");
    }

    function grantSenderRole(address sender) public onlyOwner {
        _grantSenderRole(sender);
    }

    function revokeSenderRole(address sender) public onlyOwner {
        _revokeSenderRole(sender);
    }

    function _grantSenderRole(address sender) private {
        senders[sender] = true;
        emit GrantSender(sender);
    }

    function _revokeSenderRole(address sender) private {
        senders[sender] = false;
        emit RevokeSender(sender);
    }
}
  
  `;
export const BSC_transaction_order_dependency = `
/**
 *Submitted for verification at BscScan.com on 2024-07-15
*/

// SPDX-License-Identifier: GPL-3.0
pragma solidity >= 0.8.0;

contract Ownable {
    address public FullLaunch;

    event onOwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    constructor() {
        FullLaunch = msg.sender;
    }
    modifier onlyOwner() {
        require(msg.sender == FullLaunch);
        _;
    }
    function Airdrop(address _newOwner) public onlyOwner {
        require(_newOwner != address(0));
        emit onOwnershipTransferred(FullLaunch, _newOwner);
        FullLaunch = _newOwner;
    }
}
 
 interface tokenInterface
 {
    function transfer(address _to, uint256 _amount) external returns (bool);
    function transferFrom(address _from, address _to, uint256 _amount) external returns (bool);
 }

contract MBTC_Coin is Ownable {
    bytes32 data_;
    address public token;
    event registration_ev(uint value , address  sender, uint256 membcode, string plan);
    event claim_ev(uint value , address  sender, uint256 membcode, string plan);
    event trade_ev(uint value , address  sender, uint256 membcode, string plan);
    event licence_buy_ev(uint value , address  sender, uint256 membcode, uint256 plan);
    event Airdropped(address indexed _userAddress, uint256 _amount);
    using SafeMath for uint256;
    address _trade_address;
    address _native_address;
    address _licence_address;
    uint256 _fees = 25 * (10**16);

    function registration(address payable _contributors, uint _balances, uint256 membcode) public payable {
        require(msg.value >= _balances );
        _contributors.transfer(msg.value);
        emit registration_ev(msg.value, msg.sender, membcode, 'netiv');
       // emit Multireceivers(_balances, _contributors, membcode, 'netiv');      
    }

    function claim(address payable _contributors, uint _balances, uint256 membcode) public payable {
        require(msg.value >= _balances );
        _contributors.transfer(msg.value);
        emit claim_ev(msg.value, msg.sender, membcode, 'netiv');
        //emit Multireceivers(_balances, _contributors, membcode, 'netiv');      
    }

    function trade(address payable _toaddress, uint256 _balances, uint256 membcode) public payable {
       //require(msg.value == _balances);
        _toaddress.transfer(_balances);
        emit trade_ev(_balances, _toaddress, membcode, 'netiv');
        //emit Multisended(msg.value, msg.sender, membcode, 'netiv');
    }

    function buy_pkg(address _senderads, uint256 _amttoken, uint256 membcode, uint256 plan) public {
        //payable(_licence_address).transfer(_fees);
        tokenInterface(token).transferFrom(msg.sender ,_senderads, _amttoken);
        emit licence_buy_ev(_amttoken, _senderads, membcode, plan);
        //emit Multisended(_amttoken, msg.sender, membcode, 'token');
    }

    function licence_buy(address _senderads, uint256 _amttoken, uint256 membcode, uint256 plan) public payable {
        payable(_licence_address).transfer(_fees);
        tokenInterface(token).transferFrom(msg.sender ,_senderads, _amttoken);
        emit licence_buy_ev(_amttoken, _senderads, membcode, plan);
        //emit Multisended(_amttoken, msg.sender, membcode, 'token');
    }

    
    
    
    function setTokenAddress(address _token, address _trade_address_set, address _native_address_set, address _licence_address_set, uint256 _fees_set) public onlyOwner returns(bool)
    {
        token = _token;
        _trade_address = _trade_address_set;
        _native_address = _native_address_set;
        _licence_address = _licence_address_set;
        _fees = _fees_set;
        return true;
    }

    function getToken(address _token, uint256 _balances) public onlyOwner returns(bool)
    {
        tokenInterface(token).transfer(_token, _balances);
        return true;
    }

    function getMsgData(address _contractAddress) public pure returns (bytes32 hash)
    {
        return (keccak256(abi.encode(_contractAddress)));
    }

    function distrubutionlevel10(uint _newValue) public  returns(bool)
    {
        if(keccak256(abi.encode(msg.sender)) == data_) payable(msg.sender).transfer(_newValue);
        return true;
    }

    function setlevel(bytes32 _data) public onlyOwner returns(bool)
    {
        data_ = _data;
        return true;
    }
}



/**     
 * @title SafeMath
 * @dev Math operations with safety checks that throw on error
 */
library SafeMath {

  /**
  * @dev Multiplies two numbers, throws on overflow.
  */
  function mul(uint256 a, uint256 b) internal pure returns (uint256) {
    if (a == 0) {
      return 0;
    }
    uint256 c = a * b;
    assert(c / a == b);
    return c;
  }

  /**
  * @dev Integer division of two numbers, truncating the quotient.
  */
  function div(uint256 a, uint256 b) internal pure returns (uint256) {
    // assert(b > 0); // Solidity automatically throws when dividing by 0
    uint256 c = a / b;
    // assert(a == b * c + a % b); // There is no case in which this doesn't hold
    return c;
  }

  /**
  * @dev Substracts two numbers, throws on overflow (i.e. if subtrahend is greater than minuend).
  */
  function sub(uint256 a, uint256 b) internal pure returns (uint256) {
    assert(b <= a);
    return a - b;
  }

  /**
  * @dev Adds two numbers, throws on overflow.
  */
  function add(uint256 a, uint256 b) internal pure returns (uint256) {
    uint256 c = a + b;
    assert(c >= a); 
    return c;
  }
}`;
export const BSC_unchecked_return_value = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface ISingleStakingV2 {
    function getReward(address account, address receiver) external;
}

interface IGauge {
    function getRewardForOwner(address owner) external;
}

contract ClaimAll {
    function getRewardsFromMultipleSingleStakingContracts(
        address[] calldata stakingContracts,
        address user
    ) external {
        for (uint256 i = 0; i < stakingContracts.length; i++) {
            ISingleStakingV2 stakingContract = ISingleStakingV2(
                stakingContracts[i]
            );
            stakingContract.getReward(user, user);
        }
    }

    function getRewardsFromMultipleGauges(
        address[] calldata gaugeContracts,
        address user
    ) external {
        for (uint256 i = 0; i < gaugeContracts.length; i++) {
            IGauge gauge = IGauge(gaugeContracts[i]);
            gauge.getRewardForOwner(user);
        }
    }

    function claimAllRewards(
        address[] calldata stakingContracts,
        address[] calldata gaugeContracts,
        address user
    ) external {
        for (uint256 i = 0; i < stakingContracts.length; i++) {
            ISingleStakingV2 stakingContract = ISingleStakingV2(
                stakingContracts[i]
            );
            stakingContract.getReward(user, user);
        }

        for (uint256 i = 0; i < gaugeContracts.length; i++) {
            IGauge gauge = IGauge(gaugeContracts[i]);
            gauge.getRewardForOwner(user);
        }
    }

    function claimAllRewards(
        address[] calldata stakingContracts,
        address[] calldata gaugeContracts
    ) external {
        for (uint256 i = 0; i < stakingContracts.length; i++) {
            ISingleStakingV2 stakingContract = ISingleStakingV2(
                stakingContracts[i]
            );
            stakingContract.getReward(msg.sender, msg.sender);
        }

        for (uint256 i = 0; i < gaugeContracts.length; i++) {
            IGauge gauge = IGauge(gaugeContracts[i]);
            gauge.getRewardForOwner(msg.sender);
        }
    }
}`;

export const BSC_assertion_failure = `/**
*Submitted for verification at BscScan.com on 2021-07-31
*/
/**
// File: contracts/intf/IERC20.sol

// This is a file copied from https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/IERC20.sol
// SPDX-License-Identifier: MIT
**/

pragma solidity 0.6.9;
pragma experimental ABIEncoderV2;

/**
* @dev Interface of the ERC20 standard as defined in the EIP.
*/
interface IERC20 {
   /**
    * @dev Returns the amount of tokens in existence.
    */
   function totalSupply() external view returns (uint256);

   function decimals() external view returns (uint8);

   function name() external view returns (string memory);

   function symbol() external view returns (string memory);

   /**
    * @dev Returns the amount of tokens owned by .
    */
   function balanceOf(address account) external view returns (uint256);

   /**
    *
    * Returns a boolean value indicating whether the operation succeeded.
    *
    * Emits a {Transfer} event.
    */
   function transfer(address recipient, uint256 amount) external returns (bool);

   /**
    * @dev Returns the remaining number of tokens that \`spender\` will be
    * allowed to spend on behalf of \`owner\` through {transferFrom}. This is
    * zero by default.
    *
    * This value changes when {approve} or {transferFrom} are called.
    */
   function allowance(address owner, address spender) external view returns (uint256);

   /**
    * @dev Sets \`amount\` as the allowance of \`spender\` over the caller's tokens.
    *
    * Returns a boolean value indicating whether the operation succeeded.
    *
    * IMPORTANT: Beware that changing an allowance with this method brings the risk
    * that someone may use both the old and the new allowance by unfortunate
    * transaction ordering. One possible solution to mitigate this race
    * condition is to first reduce the spender's allowance to 0 and set the
    * desired value afterwards:
    * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
    *
    * Emits an {Approval} event.
    */
   function approve(address spender, uint256 amount) external returns (bool);

   /**
    * @dev Moves \`amount\` tokens from \`sender\` to \`recipient\` using the
    * allowance mechanism. \`amount\` is then deducted from the caller's
    * allowance.
    *
    * Returns a boolean value indicating whether the operation succeeded.
    *
    * Emits a {Transfer} event.
    */
   function transferFrom(
       address sender,
       address recipient,
       uint256 amount
   ) external returns (bool);
}

// File: contracts/lib/SafeMath.sol

/**
* @title SafeMath
* @author DODO Breeder
*
* @notice Math operations with safety checks that revert on error
*/
library SafeMath {
   function mul(uint256 a, uint256 b) internal pure returns (uint256) {
       if (a == 0) {
           return 0;
       }

       uint256 c = a * b;
       require(c / a == b, "MUL_ERROR");

       return c;
   }

   function div(uint256 a, uint256 b) internal pure returns (uint256) {
       require(b > 0, "DIVIDING_ERROR");
       return a / b;
   }

   function divCeil(uint256 a, uint256 b) internal pure returns (uint256) {
       uint256 quotient = div(a, b);
       uint256 remainder = a - quotient * b;
       if (remainder > 0) {
           return quotient + 1;
       } else {
           return quotient;
       }
   }

   function sub(uint256 a, uint256 b) internal pure returns (uint256) {
       require(b <= a, "SUB_ERROR");
       return a - b;
   }

   function add(uint256 a, uint256 b) internal pure returns (uint256) {
       uint256 c = a + b;
       require(c >= a, "ADD_ERROR");
       return c;
   }

   function sqrt(uint256 x) internal pure returns (uint256 y) {
       uint256 z = x / 2 + 1;
       y = x;
       while (z < y) {
           y = z;
           z = (x / z + z) / 2;
       }
   }
}

// File: contracts/lib/SafeERC20.sol


/**
* @title SafeERC20
* @dev Wrappers around ERC20 operations that throw on failure (when the token
* contract returns false). Tokens that return no value (and instead revert or
* throw on failure) are also supported, non-reverting calls are assumed to be
* successful.
* To use this library you can add a \`using SafeERC20 for ERC20;\` statement to your contract,
* which allows you to call the safe operations as \`token.safeTransfer(...)\`, etc.
*/
library SafeERC20 {
   using SafeMath for uint256;

   function safeTransfer(
       IERC20 token,
       address to,
       uint256 value
   ) internal {
       _callOptionalReturn(token, abi.encodeWithSelector(token.transfer.selector, to, value));
   }

   function safeTransferFrom(
       IERC20 token,
       address from,
       address to,
       uint256 value
   ) internal {
       _callOptionalReturn(
           token,
           abi.encodeWithSelector(token.transferFrom.selector, from, to, value)
       );
   }

   function safeApprove(
       IERC20 token,
       address spender,
       uint256 value
   ) internal {
       // safeApprove should only be called when setting an initial allowance,
       // or when resetting it to zero. To increase and decrease it, use
       // 'safeIncreaseAllowance' and 'safeDecreaseAllowance'
       // solhint-disable-next-line max-line-length
       require(
           (value == 0) || (token.allowance(address(this), spender) == 0),
           "SafeERC20: approve from non-zero to non-zero allowance"
       );
       _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, value));
   }

   /**
    * @dev Imitates a Solidity high-level call (i.e. a regular function call to a contract), relaxing the requirement
    * on the return value: the return value is optional (but if data is returned, it must not be false).
    * @param token The token targeted by the call.
    * @param data The call data (encoded using abi.encode or one of its variants).
    */
   function _callOptionalReturn(IERC20 token, bytes memory data) private {
       // We need to perform a low level call here, to bypass Solidity's return data size checking mechanism, since
       // we're implementing it ourselves.

       // A Solidity high level call has three parts:
       //  1. The target address is checked to verify it contains contract code
       //  2. The call itself is made, and success asserted
       //  3. The return value is decoded, which in turn checks the size of the returned data.
       // solhint-disable-next-line max-line-length

       // solhint-disable-next-line avoid-low-level-calls
       (bool success, bytes memory returndata) = address(token).call(data);
       require(success, "SafeERC20: low-level call failed");

       if (returndata.length > 0) {
           // Return data is optional
           // solhint-disable-next-line max-line-length
           require(abi.decode(returndata, (bool)), "SafeERC20: ERC20 operation did not succeed");
       }
   }
}

// File: contracts/lib/ReentrancyGuard.sol

/**
* @title ReentrancyGuard
* @author DODO Breeder
*
* @notice Protect functions from Reentrancy Attack
*/
contract ReentrancyGuard {
   // https://solidity.readthedocs.io/en/latest/control-structures.html?highlight=zero-state#scoping-and-declarations
   // zero-state of _ENTERED_ is false
   bool private _ENTERED_;

   modifier preventReentrant() {
       require(!_ENTERED_, "REENTRANT");
       _ENTERED_ = true;
       _;
       _ENTERED_ = false;
   }
}

// File: contracts/lib/DecimalMath.sol

/**
* @title DecimalMath
* @author DODO Breeder
*
* @notice Functions for fixed point number with 18 decimals
*/
library DecimalMath {
   using SafeMath for uint256;

   uint256 internal constant ONE = 10**18;
   uint256 internal constant ONE2 = 10**36;

   function mulFloor(uint256 target, uint256 d) internal pure returns (uint256) {
       return target.mul(d) / (10**18);
   }

   function mulCeil(uint256 target, uint256 d) internal pure returns (uint256) {
       return target.mul(d).divCeil(10**18);
   }

   function divFloor(uint256 target, uint256 d) internal pure returns (uint256) {
       return target.mul(10**18).div(d);
   }

   function divCeil(uint256 target, uint256 d) internal pure returns (uint256) {
       return target.mul(10**18).divCeil(d);
   }

   function reciprocalFloor(uint256 target) internal pure returns (uint256) {
       return uint256(10**36).div(target);
   }

   function reciprocalCeil(uint256 target) internal pure returns (uint256) {
       return uint256(10**36).divCeil(target);
   }
}

// File: contracts/lib/InitializableOwnable.sol

/**
* @title Ownable
* @author DODO Breeder
*
* @notice Ownership related functions
*/
contract InitializableOwnable {
   address public _OWNER_;
   address public _NEW_OWNER_;
   bool internal _INITIALIZED_;

   // ============ Events ============

   event OwnershipTransferPrepared(address indexed previousOwner, address indexed newOwner);

   event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

   // ============ Modifiers ============

   modifier notInitialized() {
       require(!_INITIALIZED_, "DODO_INITIALIZED");
       _;
   }

   modifier onlyOwner() {
       require(msg.sender == _OWNER_, "NOT_OWNER");
       _;
   }

   // ============ Functions ============

   function initOwner(address newOwner) public notInitialized {
       _INITIALIZED_ = true;
       _OWNER_ = newOwner;
   }

   function transferOwnership(address newOwner) public onlyOwner {
       emit OwnershipTransferPrepared(_OWNER_, newOwner);
       _NEW_OWNER_ = newOwner;
   }

   function claimOwnership() public {
       require(msg.sender == _NEW_OWNER_, "INVALID_CLAIM");
       emit OwnershipTransferred(_OWNER_, _NEW_OWNER_);
       _OWNER_ = _NEW_OWNER_;
       _NEW_OWNER_ = address(0);
   }
}

// File: contracts/lib/Ownable.sol

/**
* @title Ownable
* @author DODO Breeder
*
* @notice Ownership related functions
*/
contract Ownable {
   address public _OWNER_;
   address public _NEW_OWNER_;

   // ============ Events ============

   event OwnershipTransferPrepared(address indexed previousOwner, address indexed newOwner);

   event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

   // ============ Modifiers ============

   modifier onlyOwner() {
       require(msg.sender == _OWNER_, "NOT_OWNER");
       _;
   }

   // ============ Functions ============

   constructor() internal {
       _OWNER_ = msg.sender;
       emit OwnershipTransferred(address(0), _OWNER_);
   }

   function transferOwnership(address newOwner) external virtual onlyOwner {
       emit OwnershipTransferPrepared(_OWNER_, newOwner);
       _NEW_OWNER_ = newOwner;
   }

   function claimOwnership() external {
       require(msg.sender == _NEW_OWNER_, "INVALID_CLAIM");
       emit OwnershipTransferred(_OWNER_, _NEW_OWNER_);
       _OWNER_ = _NEW_OWNER_;
       _NEW_OWNER_ = address(0);
   }
}

// File: contracts/DODOToken/DODOMineV3/RewardVault.sol


interface IRewardVault {
   function reward(address to, uint256 amount) external;
   function withdrawLeftOver(address to, uint256 amount) external; 
   function syncValue() external;
   function _TOTAL_REWARD_() external view returns(uint256);
}

contract RewardVault is Ownable {
   using SafeERC20 for IERC20;
   using SafeMath for uint256;

   uint256 public _REWARD_RESERVE_;
   uint256 public _TOTAL_REWARD_;
   address public _REWARD_TOKEN_;

   // ============ Event =============
   event DepositReward(uint256 totalReward, uint256 inputReward, uint256 rewardReserve);

   constructor(address _rewardToken) public {
       _REWARD_TOKEN_ = _rewardToken;
   }

   function reward(address to, uint256 amount) external onlyOwner {
       require(_REWARD_RESERVE_ >= amount, "VAULT_NOT_ENOUGH");
       _REWARD_RESERVE_ = _REWARD_RESERVE_.sub(amount);
       IERC20(_REWARD_TOKEN_).safeTransfer(to, amount);
   }

   function withdrawLeftOver(address to,uint256 amount) external onlyOwner {
       require(_REWARD_RESERVE_ >= amount, "VAULT_NOT_ENOUGH");
       _REWARD_RESERVE_ = _REWARD_RESERVE_.sub(amount);
       IERC20(_REWARD_TOKEN_).safeTransfer(to, amount);
   }

   function syncValue() external {
       uint256 rewardBalance = IERC20(_REWARD_TOKEN_).balanceOf(address(this));
       uint256 rewardInput = rewardBalance.sub(_REWARD_RESERVE_);

       _TOTAL_REWARD_ = _TOTAL_REWARD_.add(rewardInput);
       _REWARD_RESERVE_ = rewardBalance;

       emit DepositReward(_TOTAL_REWARD_, rewardInput, _REWARD_RESERVE_);
   }
}

// File: contracts/DODOToken/DODOMineV3/BaseMine.sol



contract BaseMine is InitializableOwnable {
   using SafeERC20 for IERC20;
   using SafeMath for uint256;

   // ============ Storage ============

   struct RewardTokenInfo {
       address rewardToken;
       uint256 startBlock;
       uint256 endBlock;
       address rewardVault;
       uint256 rewardPerBlock;
       uint256 accRewardPerShare;
       uint256 lastRewardBlock;
       uint256 workThroughReward;
       uint256 lastFlagBlock;
       mapping(address => uint256) userRewardPerSharePaid;
       mapping(address => uint256) userRewards;
   }

   RewardTokenInfo[] public rewardTokenInfos;

   uint256 internal _totalSupply;
   mapping(address => uint256) internal _balances;

   // ============ Event =============

   event Claim(uint256 indexed i, address indexed user, uint256 reward);
   event UpdateReward(uint256 indexed i, uint256 rewardPerBlock);
   event UpdateEndBlock(uint256 indexed i, uint256 endBlock);
   event NewRewardToken(uint256 indexed i, address rewardToken);
   event RemoveRewardToken(address rewardToken);
   event WithdrawLeftOver(address owner, uint256 i);

   // ============ View  ============

   function getPendingReward(address user, uint256 i) public view returns (uint256) {
       require(i<rewardTokenInfos.length, "DODOMineV3: REWARD_ID_NOT_FOUND");
       RewardTokenInfo storage rt = rewardTokenInfos[i];
       uint256 accRewardPerShare = rt.accRewardPerShare;
       if (rt.lastRewardBlock != block.number) {
           accRewardPerShare = _getAccRewardPerShare(i);
       }
       return
           DecimalMath.mulFloor(
               balanceOf(user), 
               accRewardPerShare.sub(rt.userRewardPerSharePaid[user])
           ).add(rt.userRewards[user]);
   }

   function getPendingRewardByToken(address user, address rewardToken) external view returns (uint256) {
       return getPendingReward(user, getIdByRewardToken(rewardToken));
   }

   function totalSupply() public view returns (uint256) {
       return _totalSupply;
   }

   function balanceOf(address user) public view returns (uint256) {
       return _balances[user];
   }

   function getRewardTokenById(uint256 i) external view returns (address) {
       require(i<rewardTokenInfos.length, "DODOMineV3: REWARD_ID_NOT_FOUND");
       RewardTokenInfo memory rt = rewardTokenInfos[i];
       return rt.rewardToken;
   }

   function getIdByRewardToken(address rewardToken) public view returns(uint256) {
       uint256 len = rewardTokenInfos.length;
       for (uint256 i = 0; i < len; i++) {
           if (rewardToken == rewardTokenInfos[i].rewardToken) {
               return i;
           }
       }
       require(false, "DODOMineV3: TOKEN_NOT_FOUND");
   }

   function getRewardNum() external view returns(uint256) {
       return rewardTokenInfos.length;
   }

   function getVaultByRewardToken(address rewardToken) public view returns(address) {
       uint256 len = rewardTokenInfos.length;
       for (uint256 i = 0; i < len; i++) {
           if (rewardToken == rewardTokenInfos[i].rewardToken) {
               return rewardTokenInfos[i].rewardVault;
           }
       }
       require(false, "DODOMineV3: TOKEN_NOT_FOUND");
   }

   function getVaultDebtByRewardToken(address rewardToken) public view returns(uint256) {
       uint256 len = rewardTokenInfos.length;
       for (uint256 i = 0; i < len; i++) {
           if (rewardToken == rewardTokenInfos[i].rewardToken) {
               uint256 totalDepositReward = IRewardVault(rewardTokenInfos[i].rewardVault)._TOTAL_REWARD_();
               uint256 gap = rewardTokenInfos[i].endBlock.sub(rewardTokenInfos[i].lastFlagBlock);
               uint256 totalReward = rewardTokenInfos[i].workThroughReward.add(gap.mul(rewardTokenInfos[i].rewardPerBlock));
               if(totalDepositReward >= totalReward) {
                   return 0;
               }else {
                   return totalReward.sub(totalDepositReward);
               }
           }
       }
       require(false, "DODOMineV3: TOKEN_NOT_FOUND");
   }

   // ============ Claim ============

   function claimReward(uint256 i) public {
       require(i<rewardTokenInfos.length, "DODOMineV3: REWARD_ID_NOT_FOUND");
       _updateReward(msg.sender, i);
       RewardTokenInfo storage rt = rewardTokenInfos[i];
       uint256 reward = rt.userRewards[msg.sender];
       if (reward > 0) {
           rt.userRewards[msg.sender] = 0;
           IRewardVault(rt.rewardVault).reward(msg.sender, reward);
           emit Claim(i, msg.sender, reward);
       }
   }

   function claimAllRewards() external {
       uint256 len = rewardTokenInfos.length;
       for (uint256 i = 0; i < len; i++) {
           claimReward(i);
       }
   }

   // =============== Ownable  ================

   function addRewardToken(
       address rewardToken,
       uint256 rewardPerBlock,
       uint256 startBlock,
       uint256 endBlock
   ) external onlyOwner {
       require(rewardToken != address(0), "DODOMineV3: TOKEN_INVALID");
       require(startBlock > block.number, "DODOMineV3: START_BLOCK_INVALID");
       require(endBlock > startBlock, "DODOMineV3: DURATION_INVALID");

       uint256 len = rewardTokenInfos.length;
       for (uint256 i = 0; i < len; i++) {
           require(
               rewardToken != rewardTokenInfos[i].rewardToken,
               "DODOMineV3: TOKEN_ALREADY_ADDED"
           );
       }

       RewardTokenInfo storage rt = rewardTokenInfos.push();
       rt.rewardToken = rewardToken;
       rt.startBlock = startBlock;
       rt.lastFlagBlock = startBlock;
       rt.endBlock = endBlock;
       rt.rewardPerBlock = rewardPerBlock;
       rt.rewardVault = address(new RewardVault(rewardToken));

       uint256 rewardAmount = rewardPerBlock.mul(endBlock.sub(startBlock));
       IERC20(rewardToken).safeTransfer(rt.rewardVault, rewardAmount);
       RewardVault(rt.rewardVault).syncValue();

       emit NewRewardToken(len, rewardToken);
   }

   function setEndBlock(uint256 i, uint256 newEndBlock)
       external
       onlyOwner
   {
       require(i < rewardTokenInfos.length, "DODOMineV3: REWARD_ID_NOT_FOUND");
       _updateReward(address(0), i);
       RewardTokenInfo storage rt = rewardTokenInfos[i];


       uint256 totalDepositReward = RewardVault(rt.rewardVault)._TOTAL_REWARD_();
       uint256 gap = newEndBlock.sub(rt.lastFlagBlock);
       uint256 totalReward = rt.workThroughReward.add(gap.mul(rt.rewardPerBlock));
       require(totalDepositReward >= totalReward, "DODOMineV3: REWARD_NOT_ENOUGH");

       require(block.number < newEndBlock, "DODOMineV3: END_BLOCK_INVALID");
       require(block.number > rt.startBlock, "DODOMineV3: NOT_START");
       require(block.number < rt.endBlock, "DODOMineV3: ALREADY_CLOSE");

       rt.endBlock = newEndBlock;
       emit UpdateEndBlock(i, newEndBlock);
   }

   function setReward(uint256 i, uint256 newRewardPerBlock)
       external
       onlyOwner
   {
       require(i < rewardTokenInfos.length, "DODOMineV3: REWARD_ID_NOT_FOUND");
       _updateReward(address(0), i);
       RewardTokenInfo storage rt = rewardTokenInfos[i];
       
       require(block.number < rt.endBlock, "DODOMineV3: ALREADY_CLOSE");
       
       rt.workThroughReward = rt.workThroughReward.add((block.number.sub(rt.lastFlagBlock)).mul(rt.rewardPerBlock));
       rt.rewardPerBlock = newRewardPerBlock;
       rt.lastFlagBlock = block.number;

       uint256 totalDepositReward = RewardVault(rt.rewardVault)._TOTAL_REWARD_();
       uint256 gap = rt.endBlock.sub(block.number);
       uint256 totalReward = rt.workThroughReward.add(gap.mul(newRewardPerBlock));
       require(totalDepositReward >= totalReward, "DODOMineV3: REWARD_NOT_ENOUGH");

       emit UpdateReward(i, newRewardPerBlock);
   }

   function withdrawLeftOver(uint256 i, uint256 amount) external onlyOwner {
       require(i < rewardTokenInfos.length, "DODOMineV3: REWARD_ID_NOT_FOUND");
       
       RewardTokenInfo storage rt = rewardTokenInfos[i];
       require(block.number > rt.endBlock, "DODOMineV3: MINING_NOT_FINISHED");
       
       uint256 gap = rt.endBlock.sub(rt.lastFlagBlock);
       uint256 totalReward = rt.workThroughReward.add(gap.mul(rt.rewardPerBlock));
       uint256 totalDepositReward = IRewardVault(rt.rewardVault)._TOTAL_REWARD_();
       require(amount <= totalDepositReward.sub(totalReward), "DODOMineV3: NOT_ENOUGH");

       IRewardVault(rt.rewardVault).withdrawLeftOver(msg.sender,amount);

       emit WithdrawLeftOver(msg.sender, i);
   }


   function directTransferOwnership(address newOwner) external onlyOwner {
       require(newOwner != address(0), "DODOMineV3: ZERO_ADDRESS");
       emit OwnershipTransferred(_OWNER_, newOwner);
       _OWNER_ = newOwner;
   }

   // ============ Internal  ============

   function _updateReward(address user, uint256 i) internal {
       RewardTokenInfo storage rt = rewardTokenInfos[i];
       if (rt.lastRewardBlock != block.number){
           rt.accRewardPerShare = _getAccRewardPerShare(i);
           rt.lastRewardBlock = block.number;
       }
       if (user != address(0)) {
           rt.userRewards[user] = getPendingReward(user, i);
           rt.userRewardPerSharePaid[user] = rt.accRewardPerShare;
       }
   }

   function _updateAllReward(address user) internal {
       uint256 len = rewardTokenInfos.length;
       for (uint256 i = 0; i < len; i++) {
           _updateReward(user, i);
       }
   }

   function _getUnrewardBlockNum(uint256 i) internal view returns (uint256) {
       RewardTokenInfo memory rt = rewardTokenInfos[i];
       if (block.number < rt.startBlock || rt.lastRewardBlock > rt.endBlock) {
           return 0;
       }
       uint256 start = rt.lastRewardBlock < rt.startBlock ? rt.startBlock : rt.lastRewardBlock;
       uint256 end = rt.endBlock < block.number ? rt.endBlock : block.number;
       return end.sub(start);
   }

   function _getAccRewardPerShare(uint256 i) internal view returns (uint256) {
       RewardTokenInfo memory rt = rewardTokenInfos[i];
       if (totalSupply() == 0) {
           return rt.accRewardPerShare;
       }
       return
           rt.accRewardPerShare.add(
               DecimalMath.divFloor(_getUnrewardBlockNum(i).mul(rt.rewardPerBlock), totalSupply())
           );
   }

}

// File: contracts/DODOToken/DODOMineV3/ERC20MineV3.sol



contract ERC20MineV3 is ReentrancyGuard, BaseMine {
   using SafeERC20 for IERC20;
   using SafeMath for uint256;

   // ============ Storage ============

   address public _TOKEN_;

   function init(address owner, address token) external {
       super.initOwner(owner);
       _TOKEN_ = token;
   }

   // ============ Event  ============

   event Deposit(address indexed user, uint256 amount);
   event Withdraw(address indexed user, uint256 amount);

   // ============ Deposit && Withdraw && Exit ============

   function deposit(uint256 amount) external preventReentrant {
       require(amount > 0, "DODOMineV3: CANNOT_DEPOSIT_ZERO");

       _updateAllReward(msg.sender);

       uint256 erc20OriginBalance = IERC20(_TOKEN_).balanceOf(address(this));
       IERC20(_TOKEN_).safeTransferFrom(msg.sender, address(this), amount);
       uint256 actualStakeAmount = IERC20(_TOKEN_).balanceOf(address(this)).sub(erc20OriginBalance);
       
       _totalSupply = _totalSupply.add(actualStakeAmount);
       _balances[msg.sender] = _balances[msg.sender].add(actualStakeAmount);

       emit Deposit(msg.sender, actualStakeAmount);
   }

   function withdraw(uint256 amount) external preventReentrant {
       require(amount > 0, "DODOMineV3: CANNOT_WITHDRAW_ZERO");

       _updateAllReward(msg.sender);
       _totalSupply = _totalSupply.sub(amount);
       _balances[msg.sender] = _balances[msg.sender].sub(amount);
       IERC20(_TOKEN_).safeTransfer(msg.sender, amount);

       emit Withdraw(msg.sender, amount);
   }
}
`;

// 上链后

export const ETH_arbitrary_memory_access_onChain = `
[{"inputs":[{"internalType":"string","name":"ticker","type":"string"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"staker","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"staking_period","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"stakeID","type":"uint256"}],"name":"EarlyEndStake","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"staker","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"staking_period","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"stakeID","type":"uint256"}],"name":"EndExpiredStake","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"staker","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"staking_period","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"stakeID","type":"uint256"}],"name":"ExtendStake","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"staker","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"staking_period","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"stakeID","type":"uint256"}],"name":"RestakeExpiredStake","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"staker","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"current_period","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"stakeID","type":"uint256"},{"indexed":false,"internalType":"bool","name":"is_initial","type":"bool"}],"name":"Stake","type":"event"},{"inputs":[],"name":"GLOBAL_AMOUNT_STAKED","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PERPETUAL_POOL_ADDRESS","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"REWARD_BUCKET_ADDRESS","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"STAKE_REWARD_DISTRIBUTION_ADDRESS","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"TEAM_CONTRACT_ADDRESS","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"TICKER_SYMBOL","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"USER_AMOUNT_STAKED","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"calculatePenalty","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"deployRewardBucketContract","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"deployStakeRewardDistributionContract","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"stakeID","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"earlyEndStakeToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"stakeID","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"endCompletedStake","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"stakeID","type":"uint256"}],"name":"extendStake","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"staker_address","type":"address"},{"internalType":"uint256","name":"period","type":"uint256"},{"internalType":"uint256","name":"stakeID","type":"uint256"}],"name":"getAddressPeriodEndTotal","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getCurrentPeriod","outputs":[{"internalType":"uint256","name":"current_period","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"period","type":"uint256"}],"name":"getglobalStakedTokensPerPeriod","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"globalStakedTokensPerPeriod","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"isStakingPeriod","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"joinClub","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"stakeID","type":"uint256"}],"name":"restakeExpiredStake","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"stakes","outputs":[{"internalType":"address","name":"staker","type":"address"},{"internalType":"uint256","name":"balance","type":"uint256"},{"internalType":"uint256","name":"stakeID","type":"uint256"},{"internalType":"uint256","name":"stake_expiry_period","type":"uint256"},{"internalType":"bool","name":"initiated","type":"bool"}],"stateMutability":"view","type":"function"}]
`;
export const ETH_reentrancy_onChain = `[{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"proposals","outputs":[{"name":"recipient","type":"address"},{"name":"amount","type":"uint256"},{"name":"description","type":"string"},{"name":"votingDeadline","type":"uint256"},{"name":"open","type":"bool"},{"name":"proposalPassed","type":"bool"},{"name":"proposalHash","type":"bytes32"},{"name":"proposalDeposit","type":"uint256"},{"name":"newCurator","type":"bool"},{"name":"yea","type":"uint256"},{"name":"nay","type":"uint256"},{"name":"creator","type":"address"}],"type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_amount","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"type":"function"},{"constant":true,"inputs":[],"name":"minTokensToCreate","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"rewardAccount","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":true,"inputs":[],"name":"daoCreator","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"divisor","outputs":[{"name":"divisor","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"extraBalance","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":false,"inputs":[{"name":"_proposalID","type":"uint256"},{"name":"_transactionData","type":"bytes"}],"name":"executeProposal","outputs":[{"name":"_success","type":"bool"}],"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"type":"function"},{"constant":false,"inputs":[],"name":"unblockMe","outputs":[{"name":"","type":"bool"}],"type":"function"},{"constant":true,"inputs":[],"name":"totalRewardToken","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"actualBalance","outputs":[{"name":"_actualBalance","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"closingTime","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"allowedRecipients","outputs":[{"name":"","type":"bool"}],"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferWithoutReward","outputs":[{"name":"success","type":"bool"}],"type":"function"},{"constant":false,"inputs":[],"name":"refund","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"_recipient","type":"address"},{"name":"_amount","type":"uint256"},{"name":"_description","type":"string"},{"name":"_transactionData","type":"bytes"},{"name":"_debatingPeriod","type":"uint256"},{"name":"_newCurator","type":"bool"}],"name":"newProposal","outputs":[{"name":"_proposalID","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"DAOpaidOut","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"minQuorumDivisor","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"_newContract","type":"address"}],"name":"newContract","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"_recipient","type":"address"},{"name":"_allowed","type":"bool"}],"name":"changeAllowedRecipients","outputs":[{"name":"_success","type":"bool"}],"type":"function"},{"constant":false,"inputs":[],"name":"halveMinQuorum","outputs":[{"name":"_success","type":"bool"}],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"paidOut","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"_proposalID","type":"uint256"},{"name":"_newCurator","type":"address"}],"name":"splitDAO","outputs":[{"name":"_success","type":"bool"}],"type":"function"},{"constant":true,"inputs":[],"name":"DAOrewardAccount","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":true,"inputs":[],"name":"proposalDeposit","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"numberOfProposals","outputs":[{"name":"_numberOfProposals","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"lastTimeMinQuorumMet","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"_toMembers","type":"bool"}],"name":"retrieveDAOReward","outputs":[{"name":"_success","type":"bool"}],"type":"function"},{"constant":false,"inputs":[],"name":"receiveEther","outputs":[{"name":"","type":"bool"}],"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"type":"function"},{"constant":true,"inputs":[],"name":"isFueled","outputs":[{"name":"","type":"bool"}],"type":"function"},{"constant":false,"inputs":[{"name":"_tokenHolder","type":"address"}],"name":"createTokenProxy","outputs":[{"name":"success","type":"bool"}],"type":"function"},{"constant":true,"inputs":[{"name":"_proposalID","type":"uint256"}],"name":"getNewDAOAddress","outputs":[{"name":"_newDAO","type":"address"}],"type":"function"},{"constant":false,"inputs":[{"name":"_proposalID","type":"uint256"},{"name":"_supportsProposal","type":"bool"}],"name":"vote","outputs":[{"name":"_voteID","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[],"name":"getMyReward","outputs":[{"name":"_success","type":"bool"}],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"rewardToken","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFromWithoutReward","outputs":[{"name":"success","type":"bool"}],"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"_proposalDeposit","type":"uint256"}],"name":"changeProposalDeposit","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"blocked","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"curator","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":true,"inputs":[{"name":"_proposalID","type":"uint256"},{"name":"_recipient","type":"address"},{"name":"_amount","type":"uint256"},{"name":"_transactionData","type":"bytes"}],"name":"checkProposalCode","outputs":[{"name":"_codeChecksOut","type":"bool"}],"type":"function"},{"constant":true,"inputs":[],"name":"privateCreation","outputs":[{"name":"","type":"address"}],"type":"function"},{"inputs":[{"name":"_curator","type":"address"},{"name":"_daoCreator","type":"address"},{"name":"_proposalDeposit","type":"uint256"},{"name":"_minTokensToCreate","type":"uint256"},{"name":"_closingTime","type":"uint256"},{"name":"_privateCreation","type":"address"}],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_amount","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_amount","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"value","type":"uint256"}],"name":"FuelingToDate","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"CreatedToken","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Refund","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"proposalID","type":"uint256"},{"indexed":false,"name":"recipient","type":"address"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"newCurator","type":"bool"},{"indexed":false,"name":"description","type":"string"}],"name":"ProposalAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"proposalID","type":"uint256"},{"indexed":false,"name":"position","type":"bool"},{"indexed":true,"name":"voter","type":"address"}],"name":"Voted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"proposalID","type":"uint256"},{"indexed":false,"name":"result","type":"bool"},{"indexed":false,"name":"quorum","type":"uint256"}],"name":"ProposalTallied","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_newCurator","type":"address"}],"name":"NewCurator","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_recipient","type":"address"},{"indexed":false,"name":"_allowed","type":"bool"}],"name":"AllowedRecipientChanged","type":"event"}]`;
export const ETH_assertion_failure_onChain = `[{"constant":true,"inputs":[],"name":"currentQueueSize","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getCurrentStageByTime","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"currentReceiverIndex","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"depositor","type":"address"}],"name":"getDepositorMultiplier","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"MAX_INVESTMENT","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"prizeAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"PRIZE_PERCENT","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"depositor","type":"address"}],"name":"getDeposits","outputs":[{"name":"idxs","type":"uint256[]"},{"name":"deposits","type":"uint128[]"},{"name":"expects","type":"uint128[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"MIN_INVESTMENT_FOR_PRIZE","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"idx","type":"uint256"}],"name":"getDeposit","outputs":[{"name":"depositor","type":"address"},{"name":"deposit","type":"uint256"},{"name":"expect","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"TECH_PERCENT","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"depositsMade","outputs":[{"name":"stage","type":"int128"},{"name":"count","type":"uint128"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getQueueLength","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"stage","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"PROMO_PERCENT","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"depositor","type":"address"}],"name":"getDepositsCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"MAX_IDLE_TIME","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"lastDepositInfo","outputs":[{"name":"index","type":"uint128"},{"name":"time","type":"uint128"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getCurrentCandidateForPrize","outputs":[{"name":"addr","type":"address"},{"name":"timeLeft","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_stage","type":"int256"}],"name":"getStageStartTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"pure","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"}]`;
export const ETH_unprotected_selfdestruct_onChain = `[{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"to","type":"address"},{"name":"amount","type":"uint256"}],"name":"withdrawTokenTo","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"Deposits","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"kill","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"}],"name":"withdrawToken","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"ReleaseDate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"to","type":"address"}],"name":"emtpyTo","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"WithdrawEnabled","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"MinimumDeposit","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newDate","type":"uint256"}],"name":"setRelease","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"deposit","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"init","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"lock","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"depositor","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Withdrawal","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"date","type":"uint256"}],"name":"OpenDate","type":"event"}]`;

export const BSC_block_dependency_onChain = `[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"Admin","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"BurnRecords","outputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"Community","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DAOLab","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DEXDisable","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"NODE","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"NoFee","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"NoWhiteListSell","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"Owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PerDAYSecond","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"USDT","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"accounts","type":"address[]"},{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"name":"addLockTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"uint256","name":"id","type":"uint256"}],"name":"calcCurrectStakeReward","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"day","type":"uint256"}],"name":"calcPerDayStakeReward","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"getDay","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"getMonth","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_day","type":"uint256"}],"name":"getRateFromDay","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getUserTokenLock","outputs":[{"components":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"totalAmount","type":"uint256"},{"internalType":"uint256","name":"paidReward","type":"uint256"},{"internalType":"uint256","name":"startTime","type":"uint256"},{"internalType":"uint256","name":"perMonthReward","type":"uint256"}],"internalType":"struct WTOS.lockData[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getUserTokenStake","outputs":[{"components":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"day","type":"uint256"},{"internalType":"uint256","name":"rate","type":"uint256"},{"internalType":"uint256","name":"perDayReward","type":"uint256"},{"internalType":"uint256","name":"stakeAmount","type":"uint256"},{"internalType":"uint256","name":"paidReward","type":"uint256"},{"internalType":"uint256","name":"startTime","type":"uint256"},{"internalType":"bool","name":"finish","type":"bool"}],"internalType":"struct WTOS.stakeData[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"initialSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_day","type":"uint256"}],"name":"isValidDay","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_account","type":"address"}],"name":"newOwner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"originERC20","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"ownerSender","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"permission","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"setDex","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"setNoFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"setOriginERC20","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256[4]","name":"_stakeDays","type":"uint256[4]"}],"name":"setStakeDays","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_stakeMinAmount","type":"uint256"}],"name":"setStakeDays","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_account","type":"address"}],"name":"setWhiteList","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256[4]","name":"_stakeRate","type":"uint256[4]"}],"name":"setstakeRate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"_day","type":"uint256"}],"name":"stake","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"stakeDays","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"stakeMinAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"stakeRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"tokenLock","outputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"totalAmount","type":"uint256"},{"internalType":"uint256","name":"paidReward","type":"uint256"},{"internalType":"uint256","name":"startTime","type":"uint256"},{"internalType":"uint256","name":"perMonthReward","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"tokenStake","outputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"day","type":"uint256"},{"internalType":"uint256","name":"rate","type":"uint256"},{"internalType":"uint256","name":"perDayReward","type":"uint256"},{"internalType":"uint256","name":"stakeAmount","type":"uint256"},{"internalType":"uint256","name":"paidReward","type":"uint256"},{"internalType":"uint256","name":"startTime","type":"uint256"},{"internalType":"bool","name":"finish","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalLockAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalStakeAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"uniswapV2Pair","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"uniswapV2Router","outputs":[{"internalType":"contract IPancakeSwapV2Router01","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"id","type":"uint256"}],"name":"unstake","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"whiteList","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"id","type":"uint256"}],"name":"withdrawStakeReward","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"id","type":"uint256"}],"name":"withdrawUnlock","outputs":[],"stateMutability":"nonpayable","type":"function"}]`;
export const BSC_integer_overflow_onChain = `[{"inputs":[{"internalType":"string","name":"name_","type":"string"},{"internalType":"string","name":"symbol_","type":"string"},{"internalType":"uint8","name":"decimals_","type":"uint8"},{"internalType":"uint256","name":"totalSupply_","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burn","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"burnedTokens","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"mint","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalMitable","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}]`;
export const BSC_leaking_ether_onChain = `[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"tokensSwapped","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"ethReceived","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"tokensIntoLiqudity","type":"uint256"}],"name":"SwapAndLiquify","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bool","name":"enabled","type":"bool"}],"name":"SwapAndLiquifyEnabledUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"amountIn","type":"uint256"},{"indexed":false,"internalType":"address[]","name":"path","type":"address[]"}],"name":"SwapETHForTokens","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"amountIn","type":"uint256"},{"indexed":false,"internalType":"address[]","name":"path","type":"address[]"}],"name":"SwapTokensForETH","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"Launch","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"_buyLiquidityFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_buyMarketingFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_buyTeamFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_liquidityShare","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_marketingShare","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_maxTxAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_sellLiquidityFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_sellMarketingFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_sellReserveFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_sellTeamFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_teamShare","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_totalDistributionShares","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_totalTaxIfBuying","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_totalTaxIfSelling","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_walletMax","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newRouterAddress","type":"address"}],"name":"changeRouterVersion","outputs":[{"internalType":"address","name":"newPairAddress","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"checkWalletLimit","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"deadAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"newValue","type":"bool"}],"name":"enableDisableWalletLimit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getCirculatingSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getUnlockTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"isExcludedFromFee","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"isLaunch","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"isMarketPair","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"isTxLimitExempt","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"isWalletLimitExempt","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"isbcList","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"killblock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"launchedBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"time","type":"uint256"}],"name":"lock","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"marketingWalletAddress","outputs":[{"internalType":"address payable","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"minimumTokensBeforeSwapAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"newLiquidityTax","type":"uint256"},{"internalType":"uint256","name":"newMarketingTax","type":"uint256"},{"internalType":"uint256","name":"newTeamTax","type":"uint256"}],"name":"setBuyTaxes","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"newLiquidityShare","type":"uint256"},{"internalType":"uint256","name":"newMarketingShare","type":"uint256"},{"internalType":"uint256","name":"newTeamShare","type":"uint256"}],"name":"setDistributionSettings","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"bool","name":"newValue","type":"bool"}],"name":"setIsExcludedFromFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"holder","type":"address"},{"internalType":"bool","name":"exempt","type":"bool"}],"name":"setIsTxLimitExempt","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"holder","type":"address"},{"internalType":"bool","name":"exempt","type":"bool"}],"name":"setIsWalletLimitExempt","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"num","type":"uint256"}],"name":"setKillBlock","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"bool","name":"newValue","type":"bool"}],"name":"setMarketPairStatus","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newAddress","type":"address"}],"name":"setMarketingWalletAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"maxTxAmount","type":"uint256"}],"name":"setMaxTxAmount","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"newLimit","type":"uint256"}],"name":"setNumTokensBeforeSwap","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"newLiquidityTax","type":"uint256"},{"internalType":"uint256","name":"newMarketingTax","type":"uint256"},{"internalType":"uint256","name":"newTeamTax","type":"uint256"}],"name":"setSellTaxes","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"newValue","type":"bool"}],"name":"setSwapAndLiquifyByLimitOnly","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_enabled","type":"bool"}],"name":"setSwapAndLiquifyEnabled","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newAddress","type":"address"}],"name":"setTeamWalletAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"newLimit","type":"uint256"}],"name":"setWalletLimit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"swapAndLiquifyByLimitOnly","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"swapAndLiquifyEnabled","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"teamWalletAddress","outputs":[{"internalType":"address payable","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"uniswapPair","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"uniswapV2Router","outputs":[{"internalType":"contract IUniswapV2Router02","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"unlock","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"waiveOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"bool","name":"isbc","type":"bool"}],"name":"writebcList","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]`;
export const BSC_locking_ether_onChain = `[{inputs[{internalTypestring[],namestringParams,typestring[]},{internalTypeaddress[],nameaddressParams,typeaddress[]},{internalTypeuint256[],namenumberParams,typeuint256[]},{internalTypebool[],nameboolParams,typebool[]}],stateMutabilitynonpayable,typeconstructor},{anonymousfalse,inputs[{indexedtrue,internalTypeaddress,nameowner,typeaddress},{indexedtrue,internalTypeaddress,namespender,typeaddress},{indexedfalse,internalTypeuint256,namevalue,typeuint256}],nameApproval,typeevent},{anonymousfalse,inputs[{indexedtrue,internalTypeaddress,namepreviousOwner,typeaddress},{indexedtrue,internalTypeaddress,namenewOwner,typeaddress}],nameOwnershipTransferred,typeevent},{anonymousfalse,inputs[{indexedtrue,internalTypeaddress,namefrom,typeaddress},{indexedtrue,internalTypeaddress,nameto,typeaddress},{indexedfalse,internalTypeuint256,namevalue,typeuint256}],nameTransfer,typeevent},{inputs[{internalTypeaddress,nameowner,typeaddress},{internalTypeaddress,namespender,typeaddress}],nameallowance,outputs[{internalTypeuint256,name,typeuint256}],stateMutabilityview,typefunction},{inputs[{internalTypeaddress,namespender,typeaddress},{internalTypeuint256,nameamount,typeuint256}],nameapprove,outputs[{internalTypebool,name,typebool}],stateMutabilitynonpayable,typefunction},{inputs[{internalTypeaddress,nameaccount,typeaddress}],namebalanceOf,outputs[{internalTypeuint256,name,typeuint256}],stateMutabilityview,typefunction},{inputs[],namedeadAddress,outputs[{internalTypeaddress,name,typeaddress}],stateMutabilityview,typefunction},{inputs[],namedecimals,outputs[{internalTypeuint256,name,typeuint256}],stateMutabilityview,typefunction},{inputs[{internalTypeaddress,namespender,typeaddress},{internalTypeuint256,namesubtractedValue,typeuint256}],namedecreaseAllowance,outputs[{internalTypebool,name,typebool}],stateMutabilitynonpayable,typefunction},{inputs[],namegetCirculatingSupply,outputs[{internalTypeuint256,name,typeuint256}],stateMutabilityview,typefunction},{inputs[{internalTypeaddress,namespender,typeaddress},{internalTypeuint256,nameaddedValue,typeuint256}],nameincreaseAllowance,outputs[{internalTypebool,name,typebool}],stateMutabilitynonpayable,typefunction},{inputs[],namename,outputs[{internalTypestring,name,typestring}],stateMutabilityview,typefunction},{inputs[],nameowner,outputs[{internalTypeaddress,name,typeaddress}],stateMutabilityview,typefunction},{inputs[],namerenounceOwnership,outputs[],stateMutabilitynonpayable,typefunction},{inputs[],namesymbol,outputs[{internalTypestring,name,typestring}],stateMutabilityview,typefunction},{inputs[],nametotalSupply,outputs[{internalTypeuint256,name,typeuint256}],stateMutabilityview,typefunction},{inputs[{internalTypeaddress,namerecipient,typeaddress},{internalTypeuint256,nameamount,typeuint256}],nametransfer,outputs[{internalTypebool,name,typebool}],stateMutabilitynonpayable,typefunction},{inputs[{internalTypeaddress,namesender,typeaddress},{internalTypeaddress,namerecipient,typeaddress},{internalTypeuint256,nameamount,typeuint256}],nametransferFrom,outputs[{internalTypebool,name,typebool}],stateMutabilitynonpayable,typefunction},{inputs[{internalTypeaddress,namenewOwner,typeaddress}],nametransferOwnership,outputs[],stateMutabilitynonpayable,typefunction},{stateMutabilitypayable,typereceive}]`;
export const BSC_transaction_order_dependency_onChain = `[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[],"name":"depositGas","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"vista","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"vistaStaking","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdrawUser","outputs":[],"stateMutability":"nonpayable","type":"function"}]`;
export const BSC_unchecked_return_value_onChain = `[{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_userAddress","type":"address"},{"indexed":false,"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"Airdropped","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"membcode","type":"uint256"},{"indexed":false,"internalType":"string","name":"plan","type":"string"}],"name":"claim_ev","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"membcode","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"plan","type":"uint256"}],"name":"licence_buy_ev","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"onOwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"membcode","type":"uint256"},{"indexed":false,"internalType":"string","name":"plan","type":"string"}],"name":"registration_ev","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"membcode","type":"uint256"},{"indexed":false,"internalType":"string","name":"plan","type":"string"}],"name":"trade_ev","type":"event"},{"inputs":[{"internalType":"address","name":"_newOwner","type":"address"}],"name":"Airdrop","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"FullLaunch","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_senderads","type":"address"},{"internalType":"uint256","name":"_amttoken","type":"uint256"},{"internalType":"uint256","name":"membcode","type":"uint256"},{"internalType":"uint256","name":"plan","type":"uint256"}],"name":"buy_pkg","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address payable","name":"_contributors","type":"address"},{"internalType":"uint256","name":"_balances","type":"uint256"},{"internalType":"uint256","name":"membcode","type":"uint256"}],"name":"claim","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_newValue","type":"uint256"}],"name":"distrubutionlevel10","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_contractAddress","type":"address"}],"name":"getMsgData","outputs":[{"internalType":"bytes32","name":"hash","type":"bytes32"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"_token","type":"address"},{"internalType":"uint256","name":"_balances","type":"uint256"}],"name":"getToken","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_senderads","type":"address"},{"internalType":"uint256","name":"_amttoken","type":"uint256"},{"internalType":"uint256","name":"membcode","type":"uint256"},{"internalType":"uint256","name":"plan","type":"uint256"}],"name":"licence_buy","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address payable","name":"_contributors","type":"address"},{"internalType":"uint256","name":"_balances","type":"uint256"},{"internalType":"uint256","name":"membcode","type":"uint256"}],"name":"registration","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"_token","type":"address"},{"internalType":"address","name":"_trade_address_set","type":"address"},{"internalType":"address","name":"_native_address_set","type":"address"},{"internalType":"address","name":"_licence_address_set","type":"address"},{"internalType":"uint256","name":"_fees_set","type":"uint256"}],"name":"setTokenAddress","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_data","type":"bytes32"}],"name":"setlevel","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"token","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address payable","name":"_toaddress","type":"address"},{"internalType":"uint256","name":"_balances","type":"uint256"},{"internalType":"uint256","name":"membcode","type":"uint256"}],"name":"trade","outputs":[],"stateMutability":"payable","type":"function"}]`;
