/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable prettier/prettier */
import { cloneDeep } from "lodash";
import {
  createContext,
  Dispatch,
  useContext,
  useEffect,
  useReducer
} from "react";
import { v4 as uuidv4 } from "uuid";

import { removeExplorerItems } from "@/services/mockData/contractDetection";
import { deduplicate } from "@/utils/common";

import {
  BSC_assertion_failure,
  BSC_block_dependency_onChain,
  BSC_integer_overflow,
  BSC_integer_overflow_onChain,
  BSC_leaking_ether_onChain,
  BSC_locking_ether,
  BSC_locking_ether_onChain,
  BSC_transaction_order_dependency,
  BSC_transaction_order_dependency_onChain,
  BSC_unchecked_return_value,
  BSC_unchecked_return_value_onChain,
  ETH_arbitrary_memory_access,
  ETH_arbitrary_memory_access_onChain,
  ETH_assertion_failure_onChain,
  ETH_block_dependency,
  ETH_leaking_ether,
  ETH_reentrancy,
  ETH_reentrancy_onChain,
  ETH_unprotected_selfdestruct,
  ETH_unprotected_selfdestruct_onChain,
  ETH_unsafe_delegatecall
} from "./files/files";

// import * as integer_overflow from "./files/integer_overflow.ts"; // 导入.sol文件

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
  ETH_default = "ETH_default",
  BSC_default = "BSC_default",
  ETH_onChain = "ETH_onChain",
  BSC_onChain = "BSC_onChain"
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

const generateFile = () => {
  const res = [] as any;
  const fileMap: any = {
    ETH_default: [
      {
        name: "arbitrary_memory_access.sol",
        content: ETH_arbitrary_memory_access
      },
      {
        name: "block_dependency.sol",
        content: ETH_block_dependency
      },
      {
        name: "leaking_ether.sol",
        content: ETH_leaking_ether
      },
      {
        name: "unprotected_selfdestruct.sol",
        content: ETH_unprotected_selfdestruct
      },
      {
        name: "unsafe_delegatecall.sol",
        content: ETH_unsafe_delegatecall
      },
      {
        name: "reentrancy.sol",
        content: ETH_reentrancy
      }
    ],
    BSC_default: [
      {
        name: "integer_overflow.sol",
        content: BSC_integer_overflow
      },
      {
        name: "locking_ether.sol",
        content: BSC_locking_ether
      },
      {
        name: "transaction_order_dependency.sol",
        content: BSC_transaction_order_dependency
      },
      {
        name: "unchecked_return_value.sol",
        content: BSC_unchecked_return_value
      },
      {
        name: "assertion_failure.sol",
        content: BSC_assertion_failure
      }
    ],
    ETH_onChain: [
      {
        name: "arbitrary_memory_access_onChain.abi",
        content: ETH_arbitrary_memory_access_onChain
      },
      {
        name: "reentrancy_onChain.abi",
        content: ETH_reentrancy_onChain
      },
      {
        name: "assertion_failure_onChain.abi",
        content: ETH_assertion_failure_onChain
      },
      {
        name: "unprotected_selfdestruct_onChain.abi",
        content: ETH_unprotected_selfdestruct_onChain
      }
    ],
    BSC_onChain: [
      {
        name: "block_dependency_onChain",
        content: BSC_block_dependency_onChain
      },
      {
        name: "integer_overflow_onChain",
        content: BSC_integer_overflow_onChain
      },
      {
        name: "leaking_ether_onChain",
        content: BSC_leaking_ether_onChain
      },
      {
        name: "locking_ether_onChain",
        content: BSC_locking_ether_onChain
      },
      {
        name: "transaction_order_dependency_onChain",
        content: BSC_transaction_order_dependency_onChain
      },
      {
        name: "unchecked_return_value_onChain",
        content: BSC_unchecked_return_value_onChain
      }
    ]
  };
  const keys = Object.keys(fileMap);
  for (const item of keys) {
    const projectId = uuidv4();
    const files = fileMap[item];
    const parentItem = {
      id: projectId,
      parentId: null,
      name: item,
      type: ExplorerItemType.PROJECT,
      projectType: item
    };
    res.push(parentItem);

    files.forEach((file: any) => {
      const fileItem = {
        id: uuidv4(),
        parentId: projectId,
        type: ExplorerItemType.FILE,
        name: file.name,
        content: file.content
      };
      res.push(fileItem);
    });
  }

  return res;
};
const initialExplorerList = generateFile();
const initialContractState: ContractState = {
  explorerList: [...initialExplorerList],
  openFiles: [
    {
      id: initialExplorerList[1].id,
      type: ExplorerItemType.FILE,
      name: "arbitrary_memory_access.sol",
      content: initialExplorerList[1].content
    }
  ],
  focusFileId: initialExplorerList[1].id,
  chainFlag: "offchain"
};

const reducer = (
  state: ContractState,
  action: IContractAction
): ContractState => {
  switch (action.type) {
    case ContractAction.ADD_ITEM: {
      if (
        state.explorerList.filter((item: any) => item.id === action.data.id)
          .length
      )
        break;
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
  const contractStateStorage = localStorage.getItem("initialContractState");
  const target: ContractState = contractStateStorage
    ? JSON.parse(contractStateStorage)
    : "";
  const [contractState, dispatch] = useReducer(
    reducer,
    target || initialContractState
  );

  return (
    <ContractContext.Provider value={{ contractState, dispatch }}>
      {children}
    </ContractContext.Provider>
  );
};
