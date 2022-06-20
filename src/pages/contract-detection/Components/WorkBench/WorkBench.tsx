import cn from 'classnames';

import styles from './WorkBench.module.less';

export function WorkBench() {
  return (
    <div className={cn(styles.WorkBench, 'h-full flex-1 bg-white')}>
      WorkBench
    </div>
  );
}
