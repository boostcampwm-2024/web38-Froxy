import { useState } from 'react';
import { CodeViewActionContext, CodeViewContext } from '@/feature/codeView/hook';
import { CodeViewValue } from '@/feature/codeView/type';

type CodeViewProviderProps = {
  value: CodeViewValue[];
  children: React.ReactNode;
  current?: number;
};

export function CodeViewProvider({ value, children, current: currentIndex = 0 }: CodeViewProviderProps) {
  const [current, setCurrent] = useState(currentIndex);
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
