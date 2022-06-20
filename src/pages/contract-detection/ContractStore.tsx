/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createContext, Dispatch, useContext, useReducer } from 'react';

import { BasicContract } from '@/services/mockData/contractDetection';

enum FileType {
  FOLDER = 'folder',
  FILE = 'file'
}

export enum ContractAction {
  ADD_FOLDER = 'ADD_FOLDER',
  ADD_FILE = 'ADD_FILE',
  OPEN_FILE = 'OPEN_FILE',
  CLOSE_FILE = 'CLOSE_FILE',
  SET_FOCUS_FILE = 'SET_FOCUS_FILE'
}

interface ContractState {
  files: Array<{
    type: FileType;
    name: string;
    files: Array<{
      type: FileType;
      name: string;
      content: string;
    }>;
  }>;
  openFiles: string[];
  focusFile: string;
}

interface AddFolderAction {
  type: ContractAction.ADD_FOLDER;
  data: {
    name: string;
  };
}

interface AddFileAction {
  type: ContractAction.ADD_FILE;
  data: {
    fileName: string;
    fileContent: string;
    folderName: string;
  };
}

interface OpenFileAction {
  type: ContractAction.OPEN_FILE;
  data: {
    name: string;
  };
}

interface CloseFileAction {
  type: ContractAction.CLOSE_FILE;
  data: {
    name: string;
  };
}

interface SetFocusFileAction {
  type: ContractAction.SET_FOCUS_FILE;
  data: {
    name: string;
  };
}

type IContractAction =
  | AddFolderAction
  | AddFileAction
  | OpenFileAction
  | CloseFileAction
  | SetFocusFileAction;

const initialContractState: ContractState = {
  files: [
    {
      type: FileType.FOLDER,
      name: 'ETH_default',
      files: [
        {
          type: FileType.FILE,
          name: 'BaseAudioContext.sol',
          content: BasicContract
        }
      ]
    }
  ],
  openFiles: [],
  focusFile: ''
};

const reducer = (
  state: ContractState,
  action: IContractAction
): ContractState => {
  switch (action.type) {
    case ContractAction.ADD_FOLDER: {
      state.files.push({
        type: FileType.FOLDER,
        name: action.data.name,
        files: []
      });
      break;
    }
    case ContractAction.ADD_FILE: {
      state.files = state.files.map((folder) => {
        if (folder.name === action.data.folderName) {
          folder.files.push({
            type: FileType.FILE,
            name: action.data.fileName,
            content: action.data.fileContent
          });
        }
        return folder;
      });
      break;
    }
    case ContractAction.OPEN_FILE: {
      if (!state.openFiles.includes(action.data.name)) {
        state.openFiles.push(action.data.name);
      }
      state.focusFile = action.data.name;
      break;
    }
    case ContractAction.CLOSE_FILE: {
      state.openFiles = state.openFiles.filter(
        (fileName) => fileName !== action.data.name
      );
      break;
    }
    case ContractAction.SET_FOCUS_FILE: {
      state.focusFile = action.data.name;
      break;
    }
    default:
      break;
  }
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
