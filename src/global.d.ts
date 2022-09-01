declare module 'giojs';
declare module 'react-giojs';
declare module '*.module.less' {
  const content: { [key: string]: string };
  export = content;
}

interface Window {
  soljsonReleases: any;
}
