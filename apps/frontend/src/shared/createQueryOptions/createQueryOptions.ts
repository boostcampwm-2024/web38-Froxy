import { CreateQueryOptions, Fn } from './type';

const isLiteralObject = (data: unknown): data is Record<string, unknown> => data !== null && typeof data === 'object';

export function createQueryOptions<Actions extends Record<string, Fn>, Scope extends string>(
  scope: Scope,
  actions: Actions
) {
  const options: CreateQueryOptions<Actions, Scope> = Object.fromEntries(
    Object.entries(actions).map(([type, action]) => {
      const handler = (data: unknown) => ({
        queryKey: [{ scope, type, ...(isLiteralObject(data) ? data : data !== undefined ? { data } : {}) }],
        queryFn: async () => action(data)
      });

      return [type, handler];
    })
  ) as CreateQueryOptions<Actions, Scope>;

  return {
    all: () => ({ queryKey: [{ scope }] }),
    type: (typeKey: keyof Actions) => ({ queryKey: [{ scope, type: typeKey }] }),
    ...options
  };
}
