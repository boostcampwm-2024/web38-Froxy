import { CodeSideBar } from './CodeSideBar';
import { CodeViewer } from './CodeViewer';
import { CodeViewProvider } from './CodeViewProvider';

import '@froxy/react-markdown/github.css';

export interface CodeViewValue {
  fileName: string;
  ext: string;
  code: string;
}

export const CodeView = Object.assign(CodeViewProvider, { SideBar: CodeSideBar, Viewer: CodeViewer });
