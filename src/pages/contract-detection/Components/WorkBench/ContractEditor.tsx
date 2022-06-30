/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { useEffect, useRef } from 'react';
import MonacoEditor from 'react-monaco-editor';

import { IPanesProps } from './WorkBench';

const editorOptions = {
  scrollbar: {
    verticalScrollbarSize: 6
  },
  selectOnLineNumbers: true,
  readOnly: true
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
  const editorContainer = useRef<MonacoEditor | null>(null);

  useEffect(() => {
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
    <div className="mb-4 h-full overflow-hidden">
      <MonacoEditor
        width="100%"
        height="100%"
        ref={editorContainer}
        language={getLanguage(contractData.title)}
        value={contractData.content}
        options={editorOptions}
      />
    </div>
  );
}
