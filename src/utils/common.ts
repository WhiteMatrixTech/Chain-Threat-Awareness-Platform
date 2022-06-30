/* eslint-disable no-case-declarations */
export function waitTime(timeMs: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('');
    }, timeMs);
  });
}

// 生成从minNum到maxNum的随机数
export function randomNum(minNum: number, maxNum: number) {
  let num = '';
  switch (arguments.length) {
    case 1:
      num = (Math.random() * minNum + 1).toString();
      return parseInt(num, 10);
    case 2:
      num = (Math.random() * (maxNum - minNum + 1) + minNum).toString();
      return parseInt(num, 10);
    default:
      return 0;
  }
}

// 地址格式化(展示前六位...后四位)
export function transformAddress(address: string, prefixLen = 6): string {
  if (address.length <= 10) {
    return address;
  }
  let prefix = '';
  let suffix = '';
  try {
    prefix = address.substring(0, prefixLen);
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

export function deduplicate<T extends Record<string, unknown>>(
  arr: T[],
  key = 'id'
) {
  const record: Record<string, boolean> = {};
  const newList: T[] = [];
  arr.forEach((item) => {
    const recordKey = item[key] as string;
    if (!record[recordKey]) {
      newList.push(item);
      record[recordKey] = true;
    }
  });

  return newList;
}
