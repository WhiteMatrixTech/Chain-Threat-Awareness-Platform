import { Tabs } from 'antd';
import cn from 'classnames';
import { useEffect, useState } from 'react';

import { ContractAction, useContractContext } from '../../ContractStore';
import { ContractEditor } from './ContractEditor';
import styles from './WorkBench.module.less';

const { TabPane } = Tabs;

export interface IPanesProps {
  title: string;
  content: string;
  key: string;
}

export function WorkBench() {
  const {
    contractState: { openFiles, focusFile },
    dispatch
  } = useContractContext();

  const [panes, setPanes] = useState<IPanesProps[]>([]);
  useEffect(() => {
    setPanes(
      openFiles.map((file) => {
        return {
          title: file.name,
          content: file.content,
          key: file.name
        };
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openFiles.length]);

  const remove = (targetKey: string) => {
    dispatch({
      type: ContractAction.CLOSE_FILE,
      data: {
        fileName: targetKey
      }
    });
  };

  const onEdit = (targetKey: unknown, action: 'add' | 'remove') => {
    if (action === 'remove') {
      remove(targetKey as string);
    }
  };

  const onChange = (newActiveKey: string) => {
    dispatch({
      type: ContractAction.SET_FOCUS_FILE,
      data: {
        fileName: newActiveKey
      }
    });
  };

  return (
    <div className={cn(styles.WorkBench, 'h-full flex-1 bg-white')}>
      <Tabs
        className="h-full"
        type="editable-card"
        hideAdd={true}
        onChange={onChange}
        activeKey={focusFile}
        onEdit={onEdit}
      >
        {panes.map((pane) => (
          <TabPane
            className="h-full"
            tab={pane.title}
            key={pane.key}
            closable={true}
          >
            <ContractEditor contractData={pane} />
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
}
