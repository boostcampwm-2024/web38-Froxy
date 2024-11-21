import { CodeSideBar } from './CodeSideBar';
import { CodeViewer } from './CodeViewer';
import { CodeViewProvider } from './CodeViewProvider';

export const CodeView = Object.assign(CodeViewProvider, { SideBar: CodeSideBar, Viewer: CodeViewer });
