import { CopyOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

interface ClipboardProps {
  text: string;
  tip?: string;
  className?: string;
}

export function CopyClipboard(props: ClipboardProps) {
  const { text, tip = '复制' } = props;

  const [tipMessage, setTipMessage] = useState(tip);

  const onCopy = () => {
    setTipMessage('复制成功');
  };

  const onLeave = () => {
    setTimeout(() => setTipMessage(tip), 500);
  };

  return (
    <CopyToClipboard text={text} onCopy={onCopy}>
      <Tooltip title={tipMessage} onVisibleChange={onLeave}>
        <CopyOutlined className="cursor-pointer" />
      </Tooltip>
    </CopyToClipboard>
  );
}
