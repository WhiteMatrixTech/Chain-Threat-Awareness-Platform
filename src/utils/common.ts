export function waitTime(timeMs: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('');
    }, timeMs);
  });
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
