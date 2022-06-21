/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createContext, Dispatch, useContext, useReducer } from 'react';

import { BasicContract } from '@/services/mockData/contractDetection';

export enum FileType {
  PROJECT = 'project',
  FILE = 'file'
}

export const ProjectType = {
  ETH: 'ETH'
};

export enum ContractAction {
  ADD_PROJECT = 'ADD_PROJECT',
  ADD_FILE = 'ADD_FILE',
  OPEN_FILE = 'OPEN_FILE',
  CLOSE_FILE = 'CLOSE_FILE',
  SET_FOCUS_FILE = 'SET_FOCUS_FILE'
}

interface IFile {
  type: FileType;
  name: string;
  content: string;
}

interface ContractState {
  projects: Array<{
    type: FileType;
    name: string;
    files: IFile[];
  }>;
  openFiles: IFile[];
  focusFile: string;
}

interface AddProjectAction {
  type: ContractAction.ADD_PROJECT;
  data: {
    name: string;
  };
}

interface AddFileAction {
  type: ContractAction.ADD_FILE;
  data: {
    fileName: string;
    fileContent: string;
    projectName: string;
  };
}

interface OpenFileAction {
  type: ContractAction.OPEN_FILE;
  data: IFile;
}

interface CloseFileAction {
  type: ContractAction.CLOSE_FILE;
  data: {
    fileName: string;
  };
}

interface SetFocusFileAction {
  type: ContractAction.SET_FOCUS_FILE;
  data: {
    fileName: string;
  };
}

type IContractAction =
  | AddProjectAction
  | AddFileAction
  | OpenFileAction
  | CloseFileAction
  | SetFocusFileAction;

const initialContractState: ContractState = {
  projects: [
    {
      type: FileType.PROJECT,
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
    case ContractAction.ADD_PROJECT: {
      state.projects = [
        ...state.projects,
        {
          type: FileType.PROJECT,
          name: action.data.name,
          files: []
        }
      ];
      break;
    }
    case ContractAction.ADD_FILE: {
      state.projects = state.projects.map((folder) => {
        if (folder.name === action.data.projectName) {
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
      if (!state.openFiles.find((file) => file.name === action.data.name)) {
        state.openFiles.push(action.data);
      }
      state.focusFile = action.data.name;
      break;
    }
    case ContractAction.CLOSE_FILE: {
      state.openFiles = state.openFiles.filter(
        (file) => file.name !== action.data.fileName
      );
      if (state.focusFile === action.data.fileName) {
        const len = state.openFiles.length;
        state.focusFile = len > 0 ? state.openFiles[len - 1].name : '';
      }
      break;
    }
    case ContractAction.SET_FOCUS_FILE: {
      state.focusFile = action.data.fileName;
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
