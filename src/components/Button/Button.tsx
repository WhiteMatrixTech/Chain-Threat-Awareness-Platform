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
        '!h-fit w-full rounded !border-[#166CDD] !bg-common !text-lg',
        className
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
        '!h-fit w-full rounded border border-solid !border-[#166CDD] !bg-common !text-lg !text-[#166CDD]'
      )}
    >
      {children}
    </Button>
  );
}
