export function waitTime(timeMs: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('');
    }, timeMs);
  });
}

// 地址格式化(展示前六位...后四位)
export function transformAddress(address: string): string {
  if (address.length <= 10) {
    return address;
  }
  let prefix = '';
  let suffix = '';
  try {
    prefix = address.substring(0, 6);
    suffix = address.substring(address.length - 4, address.length);
  } catch (err) {
    console.log(err);
  }
  return `${prefix}...${suffix}`;
}

export interface ITree {
  key: string;
  children?: ITree[];
  parentKeys: string[];
}
export function flatTreeData(treeData: ITree[] | null, parentKey = '') {
  const result: ITree[] = [];
  if (!treeData) {
    return [];
  }

  treeData.forEach((item: ITree) => {
    if (item && item.children) {
      result.push(...flatTreeData(item.children, item.key));
    } else {
      item.parentKeys = [];
      item.parentKeys.push(parentKey);
      result.push({
        ...item
      });
    }
  });

  return result;
}
