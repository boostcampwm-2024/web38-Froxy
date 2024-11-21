import { createContext, useContext } from 'react';
import { CodeViewValue } from '.';

export interface CodeViewContext {
  value: CodeViewValue[];
  current: number;
}
export type CodeViewActionContext = (arg: number) => void;

export const CodeViewContext = createContext<CodeViewContext | null>(null);
export const CodeViewActionContext = createContext<CodeViewActionContext | null>(null);

export const useCodeViewContext = () => {
  const value = useContext(CodeViewContext);

  if (!value) {
    throw new Error('useCodeViewContext must be used within a CodeViewProvider');
  }

  return value;
};

export const useCodeViewActionContext = () => {
  const value = useContext(CodeViewActionContext);

  if (!value) {
    throw new Error('useCodeViewActionContext must be used within a CodeViewProvider');
  }

  return value;
};
