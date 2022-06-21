/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

const solVersionTextRegex = /soljson-(.*)\.js/;

const getSolcVersionsMap = () => {
  const originSolcVersionMap = window.soljsonReleases || {};
  const solcVersionsMap: Map<string, string> = new Map();
  Object.keys(originSolcVersionMap).forEach((key) => {
    const oVersion = originSolcVersionMap[key];
    if (oVersion) {
      const match = solVersionTextRegex.exec(oVersion);
      if (match && match[1]) {
        solcVersionsMap.set(key, match[1]);
      }
    }
  });

  const originSolcVersionList = Object.keys(originSolcVersionMap);

  return { solcVersionsMap, originSolcVersionList };
};

export const { solcVersionsMap, originSolcVersionList } = getSolcVersionsMap();
