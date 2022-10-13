export const ERROR_TIPS: any = {
  '100': 'http://cw.hubwiz.com/card/c/swc-registry/1/1/1/',
  '101': 'http://cw.hubwiz.com/card/c/swc-registry/1/1/2/',
  '102': 'http://cw.hubwiz.com/card/c/swc-registry/1/1/3/',
  '103': 'http://cw.hubwiz.com/card/c/swc-registry/1/1/4/',
  '104': 'http://cw.hubwiz.com/card/c/swc-registry/1/1/5/',
  '105': 'http://cw.hubwiz.com/card/c/swc-registry/1/1/6/',
  '106': 'http://cw.hubwiz.com/card/c/swc-registry/1/1/7/',
  '107': 'http://cw.hubwiz.com/card/c/swc-registry/1/1/8/',
  '108': 'http://cw.hubwiz.com/card/c/swc-registry/1/1/9/',
  '109': 'http://cw.hubwiz.com/card/c/swc-registry/1/1/10/',
  '110': 'http://cw.hubwiz.com/card/c/swc-registry/1/1/11/',
  '111': 'http://cw.hubwiz.com/card/c/swc-registry/1/1/12/',
  '112': 'http://cw.hubwiz.com/card/c/swc-registry/1/1/13/',
  '113': 'http://cw.hubwiz.com/card/c/swc-registry/1/1/14/',
  '114': 'http://cw.hubwiz.com/card/c/swc-registry/1/1/15/',
  '115': 'http://cw.hubwiz.com/card/c/swc-registry/1/1/16/',
  '116': 'http://cw.hubwiz.com/card/c/swc-registry/1/1/17/',
  '117': 'http://cw.hubwiz.com/card/c/swc-registry/1/1/18/',
  '118': 'http://cw.hubwiz.com/card/c/swc-registry/1/1/19/',
  '119': 'http://cw.hubwiz.com/card/c/swc-registry/1/1/20/',
  '120': 'http://cw.hubwiz.com/card/c/swc-registry/1/1/21/',
  '121': 'http://cw.hubwiz.com/card/c/swc-registry/1/1/22/',
  '122': 'http://cw.hubwiz.com/card/c/swc-registry/1/1/23/',
  '123': 'http://cw.hubwiz.com/card/c/swc-registry/1/1/24/',
  '124': 'http://cw.hubwiz.com/card/c/swc-registry/1/1/25/',
  '125': 'http://cw.hubwiz.com/card/c/swc-registry/1/1/26/',
  '126': 'http://cw.hubwiz.com/card/c/swc-registry/1/1/27/',
  '127': 'http://cw.hubwiz.com/card/c/swc-registry/1/1/28/',
  '128': 'http://cw.hubwiz.com/card/c/swc-registry/1/1/29/',
  '129': 'http://cw.hubwiz.com/card/c/swc-registry/1/1/30/',
  '130': 'http://cw.hubwiz.com/card/c/swc-registry/1/1/31/',
  '131': 'http://cw.hubwiz.com/card/c/swc-registry/1/1/32/',
  '132': 'http://cw.hubwiz.com/card/c/swc-registry/1/1/33/',
  '133': 'http://cw.hubwiz.com/card/c/swc-registry/1/1/34/',
  '134': 'http://cw.hubwiz.com/card/c/swc-registry/1/1/35/',
  '135': 'http://cw.hubwiz.com/card/c/swc-registry/1/1/36/',
  '136': 'http://cw.hubwiz.com/card/c/swc-registry/1/1/37/'
};

export const ERROR_DETAIL: any = {
  '101': {
    desc: '当算术运算达到类型的最大或最小值时，将发生上溢/下溢。例如，如果一个数字以uint8类型存储， 则意味着该数字以8位无符号数字存储，值范围从0到2^8-1。',
    handle: '建议在整个智能合约系统中始终使用经过审查的安全数学库进行算术运算。'
  },
  '104': {
    desc: '未检查消息调用的返回值。即使被调用的合约引发异常，执行也将继续。如果调用意外失败， 或者攻击者强制调用失败，则可能导致后续程序逻辑中的意外行为。 ',
    handle:
      '如果选择使用底层调用方法，请确保通过检查返回值来处理调用失败的可能性。'
  },
  '105': {
    desc: '由于缺少访问控制或访问控制不充分，恶意方可以从合约账户中提取部分或全部以太币。',
    handle: '增加访问控制，以便提款只能由授权方或根据智能合约系统的规范来触发。'
  },
  '106': {
    desc: '由于缺少访问控制或访问控制充分，恶意方可以自毁合约。',
    handle:
      '除非绝对必要，否则请考虑删除自毁功能。如果存在有效的用例，建议实施多重签名方案，以便 多方批准后才可执行自毁操作。'
  },
  '107': {
    desc: '调用外部合约的主要风险之一是外部合约可以接管控制流程。在重入攻击（也称为递归调用攻击）中， 恶意合约会在函数的第一次调用完成之前回调发起调用的合约，这可能导致函数的不同调用以预期之外 的方式进行交互。',
    handle:
      '避免重入漏洞的最佳实践是：1. 确保在执行外部调用之前已经更新了所有的内部状态，这一模式被成为：Checks-Effects-Interactions。2.使用可重入锁，例如 OpenZeppelin的ReentrancyGuard'
  },
  '110': {
    desc: 'Solidity的assert()函数用于不变量的断言，正常运行的代码永远不会到达失败的assert语句。',
    handle:
      '考虑在assert()中检查的条件是否真的不变。如果不是，则应该使用require()语句替换该assert()。'
  },
  '112': {
    desc: 'delegatecall是一个消息调用的特殊变体，它类似于消息调用，不同之处在于目标地址上的代码 是在调用合约的上下文中执行的，msg.sender和msg.value保持不变。这允许智能合约在运行时 从其他地址动态加载代码。存储空间、当前地址和余额仍参考主叫合约。',
    handle:
      '请谨慎使用delegatecall，并确保切勿调用不受信任的合约。如果目标地址来自用户输入，请确保 使用受信任合约白名单进行检查。'
  },
  '114': {
    desc: '以太坊网络以区块为单位处理交易，新区块大约每17秒得到确认。矿工查看他们已收到的交易， 并根据谁支付了足够高的gas价格来选择要包含在区块中的交易。另外，当交易被发送到以太坊 网络时，它们被转发到每个节点进行处理。因此，运行以太坊节点的人可以在最终确定交易之前 就知道将要发生哪些交易。当代码取决于提交给它的交易的顺序时，就会出现竞争条件漏洞。',
    handle:
      '在提交信息以换取奖励时，可以解决竞争条件漏洞的一种可能方法称为提交显示哈希方案。合约没有存储 提交答案的一方提交hash(salt,address,answer) ——salt是他们选择的数量 —— 而是存储该哈希和发送者的地址。 为了获得奖励，发送者随后提交了带有salt的交易并做出答复。合约计算hash(salt,msg.sender,answer)并针对存储的哈希 检查生成的哈希，如果哈希与合约匹配，则释放奖励。'
  },
  '120': {
    desc: '生成随机数的能力在各种应用中都非常有用。一个明显的例子是博彩DApp，其中使用伪随机数 生成器选择获胜者。但是，在以太坊中创建足够强大的随机性来源非常具有挑战性。',
    handle:
      '1. 使用commitment方案，例如RANDAO。2.通过预言机/oracle使用外部随机性源，例如Oraclize。请注意，此方法需要信任oracle， 因此使用多个oracle是合理的。3.使用比特币区块哈希，因为它们的开采成本更高。'
  },
  '132': {
    desc: '如果合约逻辑仅处理特定的以太币余额，则其行为可能会错误。始终可以使用自毁或通过挖矿 来强制将以太币发送至合约（不触发其fallback函数）。在最坏的情况下，这可能导致拒绝服务条件， 使合约无法使用。',
    handle: '避免对合约中的以太币余额进行严格的等值检查。'
  }
};
