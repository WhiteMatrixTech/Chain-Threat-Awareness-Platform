/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-08-26 10:16:45
 * @LastEditors: didadida262
 * @LastEditTime: 2024-09-23 15:25:50
 */
import { SaveOutlined } from '@ant-design/icons';
import { Tabs, Tooltip } from 'antd';
import cn from 'classnames';
import { useEffect, useState } from 'react';

import { emitter, InternalEventType } from '@/services/event';

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
    contractState: { openFiles, focusFileId },
    dispatch
  } = useContractContext();

  const [panes, setPanes] = useState<IPanesProps[]>([]);
  useEffect(() => {
    setPanes(
      openFiles.map((file) => {
        return {
          title: file.name,
          content: file.content ?? '',
          key: file.id
        };
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openFiles.length]);

  const remove = (targetKey: string) => {
    dispatch({
      type: ContractAction.CLOSE_FILE,
      data: {
        id: targetKey
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
        id: newActiveKey
      }
    });
  };

  const onClickSave = () => {
    emitter.emit(InternalEventType.SAVE_CONTRACT);
  };

  return (
    <div className={cn(styles.WorkBench, 'relative h-full flex-1 bg-white')}>
      <div
        onClick={onClickSave}
        className="absolute right-6 top-2 z-50 cursor-pointer"
      >
        <Tooltip title="保存当前结果">
          <SaveOutlined className="cursor-pointer text-xl hover:text-[#465ebf]" />
        </Tooltip>
      </div>
      <Tabs
        className="h-full"
        type="editable-card"
        hideAdd={true}
        onChange={onChange}
        activeKey={focusFileId}
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
