import cn from 'classnames';

import styles from './AnalysisLoading.module.less';

interface AnalysisLoadingProps {
  tips?: string;
  className?: string;
}

export function AnalysisLoading(props: AnalysisLoadingProps) {
  const { className, tips = '分析中...' } = props;

  return (
    <div
      className={cn(
        styles.AnalysisLoading,
        'absolute inset-0 z-[999] bg-[#a8a8a873]',
        className
      )}
    >
      <div className="flex h-full w-full flex-col items-center justify-center">
        <svg className="iconfont !h-8 !w-8 animate-spin" aria-hidden="true">
          <use xlinkHref="#icon-loading"></use>
        </svg>
        {tips && <div className="mt-4 text-xl text-[#1890ff]">{tips}</div>}
      </div>
    </div>
  );
}
