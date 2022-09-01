/* eslint-disable no-case-declarations */
export function waitTime(timeMs: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('');
    }, timeMs);
  });
}

export function getParams(key: string) {
  // eslint-disable-next-line node/no-unsupported-features/node-builtins
  const params = new window.URLSearchParams(window.location.search);
  return params.get(key) ?? '';
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

export function validEmail(
  value: string,
  fn: (error?: string | undefined) => void
) {
  // eslint-disable-next-line prefer-regex-literals
  const reg = new RegExp(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
  if (!value) {
    return fn('请输入邮箱！');
  }

  if (value && reg.test(value)) {
    fn();
    return true;
  } else {
    fn('请输入正确邮箱');
  }
}

// 邮箱展示前两位 后两位@
export function ellipsisAddress(address: string) {
  if (address) {
    const list = address.split('@');
    return `${list[0].slice(0, 2)}...${list[0].slice(-2)}@${list[1]}`;
  }
  return address;
}
