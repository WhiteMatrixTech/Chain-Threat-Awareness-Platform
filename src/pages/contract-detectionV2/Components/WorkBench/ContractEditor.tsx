/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable prettier/prettier */
import { notification } from 'antd';
import { useEffect, useRef, useState } from 'react';
import MonacoEditor from 'react-monaco-editor';
import { useMutation } from 'react-query';
import { useDebounce, useMount } from 'react-use';

import { AnalysisLoading } from '@/components/AnalysisLoading';
import { emitter, InternalEventType } from '@/services/event';
import {
  getFileContentService,
  getFolderListService
} from '@/services/transaction';
import { waitTime } from '@/utils/common';

import { ContractAction, useContractContext } from '../../ContractStore';
import { IPanesProps } from './WorkBench';

const editorOptions = {
  scrollbar: {
    verticalScrollbarSize: 6
  },
  selectOnLineNumbers: true
};

const LANGUAGE_MAP: { [key: string]: string } = {
  sol: 'sol',
  go: 'go'
};

const getLanguage = (filePath: string): string => {
  let language = 'txt';
  const match = /[^.|/]\w*$/.exec(filePath);
  if (match && match.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    language = LANGUAGE_MAP[match[0]] || match[0] || 'txt';
  }

  return language;
};

interface IContractEditorProps {
  contractData: IPanesProps;
}

export function ContractEditor({ contractData }: IContractEditorProps) {
  const {
    contractState: { openFiles, focusFileId, explorerList, chainFlag }
, dispatch
} = useContractContext();
  const editorContainer = useRef<MonacoEditor | null>(null);
  const [editorValue, setEditorValue] = useState(contractData.content);

  const onChange = (newValue: string) => {
    setEditorValue(newValue);
  };
  useDebounce(
    () => {
      emitter.emit(InternalEventType.SAVE_CONTRACT);
    },
    1000,
    [editorValue]
  );

  const { mutate, status } = useMutation(async () => {
    console.warn('mute>>>')
    console.warn('editorValue>>>', editorValue)
    await waitTime(1000);
    if (focusFileId !== contractData.key) return
    dispatch({
      type: ContractAction.SAVE_FILE_CONTENT,
      data: {
        id: contractData.key,
        content: editorValue
      }
    });
    // notification.success({
    //   message: '保存成功',
    //   top: 64,
    //   duration: 2
    // });

    return true;
  });

  useMount(() => {
    emitter.on(InternalEventType.SAVE_CONTRACT, () => {
      if (editorContainer.current) {
        mutate();
      }
    });
  });
  const handleInitialContent = async () => {
    if (editorValue) return
    const initialContent = await getFileContentService(contractData.title);
    console.log('initialContent>>>', initialContent.data)
    setEditorValue(initialContent.data)
  }

  useEffect(() => {
    void handleInitialContent()
    window.addEventListener('resize', () => {
      if (editorContainer.current?.editor) {
        editorContainer.current.editor.layout();
      }
    });

    return () => {
      window.removeEventListener('resize', () => {
        console.log('remove');
      });
    };
  }, []);


  return (
    <div className=" mb-4 h-full overflow-hidden">
      {/* {status === 'loading' && <AnalysisLoading tips="保存中" />} */}
      <MonacoEditor
        width="100%"
        height="100%"
        onChange={onChange}
        ref={editorContainer}
        language={getLanguage(contractData.title)}
        value={editorValue}
        options={editorOptions}
      />
    </div>
  );
}
