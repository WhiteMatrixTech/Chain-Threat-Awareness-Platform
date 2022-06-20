import { Button, ButtonProps } from 'antd';
import cn from 'classnames';

import styles from './Button.module.less';

export function PrimaryButton(props: ButtonProps) {
  const { className, children, ...rest } = props;

  return (
    <Button
      type="primary"
      {...rest}
      className={cn(
        styles.Button,
        className,
        'h-auto w-full rounded-[4px] bg-[#166CDD] !text-base'
      )}
    >
      {children}
    </Button>
  );
}

export function DefaultButton(props: ButtonProps) {
  const { className, children, ...rest } = props;

  return (
    <Button
      type="default"
      {...rest}
      className={cn(
        styles.Button,
        className,
        'h-auto w-full rounded-[4px] border border-solid !border-[#166CDD] bg-[#166CDD] !text-base !text-[#166CDD]'
      )}
    >
      {children}
    </Button>
  );
}
