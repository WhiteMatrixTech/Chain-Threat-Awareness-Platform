/*
 * @Description: 
 * @Author: didadida262
 * @Date: 2024-08-26 10:16:45
 * @LastEditors: didadida262
 * @LastEditTime: 2024-08-26 17:25:09
 */
import cn from 'classnames';

import styles from './index.module.less';

interface {{name}}Props {
  className?: string;
}

function {{pascalCase name}}(props: {{name}}Props) {
  const { className } = props;

  return (
    <div className={cn(styles.{{camelCase name}}, className)}>{{name}}</div>
  );
}

export default {{pascalCase name}};
