import cn from 'classnames';
import isNumber from 'lodash/isNumber';
import { ReactNode } from 'react';

import { CopyClipboard } from '../Clipboard';

interface IDescriptionCardProps {
  title: string;
  hashOrAddress: string;
  copyTip: string;
  children: ReactNode;
  className?: string;
}

export function DescriptionCard(props: IDescriptionCardProps) {
  const { title, hashOrAddress, copyTip, children, className } = props;

  return (
    <div className={cn('h-full w-full p-6', className)}>
      <div className="text-xl font-semibold">{title}</div>
      <div className="my-4 flex items-center">
        <span className="mr-2 overflow-hidden text-ellipsis whitespace-nowrap rounded-sm bg-[#EFF6FF] py-1 px-2 text-[#166CDD]">
          {hashOrAddress}
        </span>
        <CopyClipboard text={hashOrAddress} tip={copyTip} />
      </div>
      <div className="flex flex-col gap-y-4 overflow-y-auto">{children}</div>
    </div>
  );
}

export function DescriptionItem({
  label,
  content
}: // unit
{
  label: string;
  content: string | number | ReactNode;
  unit?: string;
}) {
  // const showUnit = unit && isNumber(content);

  return (
    <div>
      <div className="text-lg font-medium">{label}</div>
      <div>
        <span className="text-lg opacity-70">{content}</span>
        {/* {showUnit && <span className="pl-1 text-sm opacity-40">{unit}</span>} */}
      </div>
    </div>
  );
}
