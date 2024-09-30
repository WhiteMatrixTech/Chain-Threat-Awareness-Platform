/* eslint-disable prettier/prettier */
import { cloneDeep } from "lodash";
import { createContext, Dispatch, useContext, useReducer } from "react";
import { v4 as uuidv4 } from "uuid";

import {
  BasicContract,
  BasicContractAssert_constructor,
  BasicContractAssert_minimal,
  BasicContractAssert_multitx_1,
  BasicContractProxy,
  BSC_AMA,
  BSC_BD,
  BSC_IO,
  BSC_leakingE,
  BSC_URV,
  BscContract_proxy_fixed,
  BscContract_proxy_pattern_false_positive,
  BscContract_simple_suicide,
  BscContract_suicide_multitx_feasible,
  BscContract_suicide_multitx_infeasible,
  ETH_AMA,
  ETH_BD,
  ETH_IO_AF,
  ETH_URV,
  removeExplorerItems
} from "@/services/mockData/contractDetection";
import { deduplicate } from "@/utils/common";

const initProjectId = uuidv4();
const initBSCProjectId = uuidv4();
const initBSCAfterChainProjectId = uuidv4();
const initETHAfterChainProjectId = uuidv4();
const initFileId = uuidv4();

export enum ExplorerItemType {
  PROJECT = "project",
  FOLDER = "folder",
  FILE = "file"
}

export enum ProjectType {
  ETH = "ETH",
  BSC = "BSC",
  ETH2 = "ETH2",
  BSC2 = "BSC2"
}

export enum ContractAction {
  ADD_ITEM = "ADD_ITEM",
  RENAME_ITEM = "RENAME_ITEM",
  DELETE_ITEM = "DELETE_ITEM",
  OPEN_FILE = "OPEN_FILE",
  CLOSE_FILE = "CLOSE_FILE",
  SET_FOCUS_FILE = "SET_FOCUS_FILE",
  SAVE_FILE_CONTENT = "SAVE_FILE_CONTENT",
  CHANGE_CHAIN_TYPE = "CHANGE_CHAIN_TYPE"
}

export interface IExplorerItem extends Record<string, unknown> {
  id: string;
  parentId: string | null;
  type: ExplorerItemType;
  name: string;
  content?: string;
  projectType?: ProjectType;
  children?: IExplorerItem[];
}

export interface IFile {
  id: string;
  type: ExplorerItemType.FILE;
  name: string;
  content?: string;
}

interface ContractState {
  explorerList: IExplorerItem[];
  openFiles: IFile[];
  focusFileId: string;
  chainFlag: string;
}

interface AddItemAction {
  type: ContractAction.ADD_ITEM;
  data: IExplorerItem;
}

interface RenameItemAction {
  type: ContractAction.RENAME_ITEM;
  data: {
    id: string;
    name: string;
  };
}

interface DeleteItemAction {
  type: ContractAction.DELETE_ITEM;
  data: {
    id: string;
  };
}

interface OpenFileAction {
  type: ContractAction.OPEN_FILE;
  data: IFile;
}

interface CloseFileAction {
  type: ContractAction.CLOSE_FILE;
  data: {
    id: string;
  };
}

interface SaveFileContentAction {
  type: ContractAction.SAVE_FILE_CONTENT;
  data: {
    id: string;
    content: string;
  };
}

interface SetFocusFileAction {
  type: ContractAction.SET_FOCUS_FILE;
  data: {
    id: string;
  };
}

interface ChangeChainType {
  type: ContractAction.CHANGE_CHAIN_TYPE;
  data: string;
}

type IContractAction =
  | AddItemAction
  | RenameItemAction
  | DeleteItemAction
  | OpenFileAction
  | CloseFileAction
  | SetFocusFileAction
  | SaveFileContentAction
  | ChangeChainType;

const initialContractState: ContractState = {
  explorerList: [
    {
      id: initProjectId,
      parentId: null,
      name: "ETH_default",
      type: ExplorerItemType.PROJECT,
      projectType: ProjectType.ETH
    },
    {
      id: initFileId,
      parentId: initProjectId,
      type: ExplorerItemType.FILE,
      name: "Storage.sol",
      content: BasicContract
    },
    {
      id: uuidv4(),
      parentId: initProjectId,
      type: ExplorerItemType.FILE,
      name: "assert_constructor.sol",
      content: BasicContractAssert_constructor
    },
    {
      id: uuidv4(),
      parentId: initProjectId,
      type: ExplorerItemType.FILE,
      name: "proxy.sol",
      content: BasicContractProxy
    },
    {
      id: uuidv4(),
      parentId: initProjectId,
      type: ExplorerItemType.FILE,
      name: "assert_minimal.sol",
      content: BasicContractAssert_minimal
    },
    {
      id: uuidv4(),
      parentId: initProjectId,
      type: ExplorerItemType.FILE,
      name: "assert_multitx_1.sol",
      content: BasicContractAssert_multitx_1
    },
    // bsc
    {
      id: initBSCProjectId,
      parentId: null,
      name: "BSC_default",
      type: ExplorerItemType.PROJECT,
      projectType: ProjectType.BSC
    },

    {
      id: uuidv4(),
      parentId: initBSCProjectId,
      type: ExplorerItemType.FILE,
      name: "proxy_fixed.sol",
      content: BscContract_proxy_fixed
    },
    {
      id: uuidv4(),
      parentId: initBSCProjectId,
      type: ExplorerItemType.FILE,
      name: "proxy_pattern_false_positive.sol",
      content: BscContract_proxy_pattern_false_positive
    },
    {
      id: uuidv4(),
      parentId: initBSCProjectId,
      type: ExplorerItemType.FILE,
      name: "simple_suicide.sol",
      content: BscContract_simple_suicide
    },
    {
      id: uuidv4(),
      parentId: initBSCProjectId,
      type: ExplorerItemType.FILE,
      name: "suicide_multitx_feasible.sol",
      content: BscContract_suicide_multitx_feasible
    },
    {
      id: uuidv4(),
      parentId: initBSCProjectId,
      type: ExplorerItemType.FILE,
      name: "suicide_multitx_infeasible.sol",
      content: BscContract_suicide_multitx_infeasible
    },
    // eth-afterchain
    {
      id: initETHAfterChainProjectId,
      parentId: null,
      name: "ETH_onchain",
      type: ExplorerItemType.PROJECT,
      projectType: ProjectType.BSC2
    },
    {
      id: uuidv4(),
      parentId: initETHAfterChainProjectId,
      type: ExplorerItemType.FILE,
      name: "ETH_IO_AF.abi",
      content: ETH_IO_AF
    },
    {
      id: uuidv4(),
      parentId: initETHAfterChainProjectId,
      type: ExplorerItemType.FILE,
      name: "ETH_URV.abi",
      content: ETH_URV
    },
    {
      id: uuidv4(),
      parentId: initETHAfterChainProjectId,
      type: ExplorerItemType.FILE,
      name: "ETH_BD.abi",
      content: ETH_BD
    },
    {
      id: uuidv4(),
      parentId: initETHAfterChainProjectId,
      type: ExplorerItemType.FILE,
      name: "ETH_AMA.abi",
      content: ETH_AMA
    },
    // bsc-afterchain
    {
      id: initBSCAfterChainProjectId,
      parentId: null,
      name: "BSC_onchain",
      type: ExplorerItemType.PROJECT,
      projectType: ProjectType.BSC2
    },
    {
      id: uuidv4(),
      parentId: initBSCAfterChainProjectId,
      type: ExplorerItemType.FILE,
      name: "BSC_AMA.abi",
      content: BSC_AMA
    },
    {
      id: uuidv4(),
      parentId: initBSCAfterChainProjectId,
      type: ExplorerItemType.FILE,
      name: "BSC_BD.abi",
      content: BSC_BD
    },
    {
      id: uuidv4(),
      parentId: initBSCAfterChainProjectId,
      type: ExplorerItemType.FILE,
      name: "BSC_leakingE.abi",
      content: BSC_leakingE
    },
    {
      id: uuidv4(),
      parentId: initBSCAfterChainProjectId,
      type: ExplorerItemType.FILE,
      name: "BSC_URV.abi",
      content: BSC_URV
    },
    {
      id: uuidv4(),
      parentId: initBSCAfterChainProjectId,
      type: ExplorerItemType.FILE,
      name: "BSC_IO.abi",
      content: BSC_IO
    }
  ],
  openFiles: [
    {
      id: initFileId,
      type: ExplorerItemType.FILE,
      name: "Storage.sol",
      content: BasicContract
    }
  ],
  focusFileId: initFileId,
  chainFlag: "beforeChain"
};

const reducer = (
  state: ContractState,
  action: IContractAction
): ContractState => {
  switch (action.type) {
    case ContractAction.ADD_ITEM: {
      state.explorerList = [...state.explorerList, action.data];
      break;
    }
    case ContractAction.RENAME_ITEM: {
      state.explorerList = state.explorerList.map(item => {
        if (item.id === action.data.id) {
          item.name = action.data.name;
        }
        return item;
      });
      break;
    }
    case ContractAction.DELETE_ITEM: {
      const { newExplorerList, newOpenFiles } = removeExplorerItems(
        action.data.id,
        state.explorerList,
        state.openFiles
      );
      state.explorerList = [...newExplorerList];
      state.openFiles = [...newOpenFiles];

      break;
    }
    case ContractAction.SAVE_FILE_CONTENT: {
      state.explorerList = state.explorerList.map(item => {
        if (item.id === action.data.id) {
          item.content = action.data.content;
        }
        return item;
      });
      state.openFiles = state.openFiles.map(item => {
        if (item.id === action.data.id) {
          item.content = action.data.content;
        }
        return item;
      });

      break;
    }
    case ContractAction.OPEN_FILE: {
      if (!state.openFiles.find(file => file.id === action.data.id)) {
        state.openFiles.push(action.data);
      }
      state.focusFileId = action.data.id;
      break;
    }
    case ContractAction.CLOSE_FILE: {
      state.openFiles = state.openFiles.filter(
        file => file.id !== action.data.id
      );
      if (state.focusFileId === action.data.id) {
        const len = state.openFiles.length;
        state.focusFileId = len > 0 ? state.openFiles[len - 1].id : "";
      }
      break;
    }
    case ContractAction.SET_FOCUS_FILE: {
      state.focusFileId = action.data.id;
      break;
    }
    case ContractAction.CHANGE_CHAIN_TYPE: {
      // state.openFiles =
      //   action.data === "beforeChain"
      //     ? initialContractState.openFiles
      //     : initialContractState.explorerList[12];
      // state.openFiles = state.openFiles.filter(
      //   file => file.id !== action.data.id
      // );
      // if (state.focusFileId === action.data.id) {
      //   const len = state.openFiles.length;
      //   state.focusFileId = len > 0 ? state.openFiles[len - 1].id : "";
      // }
      state.chainFlag = action.data;
      break;
    }
    default:
      break;
  }

  const preExplorerList = cloneDeep(state.explorerList);
  state.explorerList = deduplicate<IExplorerItem>(preExplorerList);
  return { ...state };
};

export const ContractContext = createContext(
  {} as {
    contractState: ContractState;
    dispatch: Dispatch<IContractAction>;
  }
);

export const useContractContext = (): {
  contractState: ContractState;
  dispatch: Dispatch<IContractAction>;
} => {
  const { contractState, dispatch } = useContext(ContractContext);
  return { contractState, dispatch };
};

export const ContractProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [contractState, dispatch] = useReducer(reducer, initialContractState);

  return (
    <ContractContext.Provider value={{ contractState, dispatch }}>
      {children}
    </ContractContext.Provider>
  );
};
