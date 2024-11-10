import { useState } from 'react';
import { CodeViewValue } from '.';
import { CodeViewActionContext, CodeViewContext } from './useCodeViewContext';

type CodeViewProviderProps = {
  value: CodeViewValue[];
  children: React.ReactNode;
};

export function CodeViewProvider({ value, children }: CodeViewProviderProps) {
  const [current, setCurrent] = useState(0);
  const setCurrentCode = (index: number) => setCurrent(index);

  return (
    <CodeViewActionContext.Provider value={setCurrentCode}>
      <CodeViewContext.Provider
        value={{
          value,
          current
        }}
      >
        {children}
      </CodeViewContext.Provider>
    </CodeViewActionContext.Provider>
  );
}
