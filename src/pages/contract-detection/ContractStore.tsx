import { cloneDeep } from 'lodash';
import { createContext, Dispatch, useContext, useReducer } from 'react';
import { v4 as uuidv4 } from 'uuid';

import {
  BasicContract,
  removeExplorerItems
} from '@/services/mockData/contractDetection';
import { deduplicate } from '@/utils/common';

const initProjectId = uuidv4();
const initFileId = uuidv4();

export enum ExplorerItemType {
  PROJECT = 'project',
  FOLDER = 'folder',
  FILE = 'file'
}

export enum ProjectType {
  ETH = 'ETH'
}

export enum ContractAction {
  ADD_ITEM = 'ADD_ITEM',
  RENAME_ITEM = 'RENAME_ITEM',
  DELETE_ITEM = 'DELETE_ITEM',
  OPEN_FILE = 'OPEN_FILE',
  CLOSE_FILE = 'CLOSE_FILE',
  SET_FOCUS_FILE = 'SET_FOCUS_FILE',
  SAVE_FILE_CONTENT = 'SAVE_FILE_CONTENT'
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

type IContractAction =
  | AddItemAction
  | RenameItemAction
  | DeleteItemAction
  | OpenFileAction
  | CloseFileAction
  | SetFocusFileAction
  | SaveFileContentAction;

const initialContractState: ContractState = {
  explorerList: [
    {
      id: initProjectId,
      parentId: null,
      name: 'ETH_default',
      type: ExplorerItemType.PROJECT,
      projectType: ProjectType.ETH
    },
    {
      id: initFileId,
      parentId: initProjectId,
      type: ExplorerItemType.FILE,
      name: 'Storage.sol',
      content: BasicContract
    }
  ],
  openFiles: [
    {
      id: initFileId,
      type: ExplorerItemType.FILE,
      name: 'Storage.sol',
      content: BasicContract
    }
  ],
  focusFileId: initFileId
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
      state.explorerList = state.explorerList.map((item) => {
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
      state.explorerList = state.explorerList.map((item) => {
        if (item.id === action.data.id) {
          item.content = action.data.content;
        }
        return item;
      });

      break;
    }
    case ContractAction.OPEN_FILE: {
      if (!state.openFiles.find((file) => file.id === action.data.id)) {
        state.openFiles.push(action.data);
      }
      state.focusFileId = action.data.id;
      break;
    }
    case ContractAction.CLOSE_FILE: {
      state.openFiles = state.openFiles.filter(
        (file) => file.id !== action.data.id
      );
      if (state.focusFileId === action.data.id) {
        const len = state.openFiles.length;
        state.focusFileId = len > 0 ? state.openFiles[len - 1].id : '';
      }
      break;
    }
    case ContractAction.SET_FOCUS_FILE: {
      state.focusFileId = action.data.id;
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
