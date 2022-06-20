import cn from 'classnames';

import styles from './{{name}}.module.less';

interface {{name}}Props {
  className?: string;
}

export function {{pascalCase name}}(props: {{name}}Props) {
  const { className } = props;

  return <div className={cn(styles.{{name}}, className)}>{{name}}</div>;
}
