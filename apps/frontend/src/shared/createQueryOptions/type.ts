export type CreateQueryOptions<Actions extends Record<string, (arg: any) => unknown>, Scope extends string> = {
  [K in keyof Actions]: (data: Parameters<Actions[K]>[0] extends undefined ? void : Parameters<Actions[K]>[0]) => {
    queryKey: [
      { scope: Scope; type: K } & (Parameters<Actions[K]>[0] extends undefined
        ? Record<string, never>
        : Parameters<Actions[K]>[0])
    ];
    queryFn: () => ReturnType<Actions[K]>;
  };
};

export type Fn = (data: any) => unknown;
