import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

type QueryProviderProps = {
  children: React.ReactNode;
};

const queryClient = new QueryClient();

export function QueryProvider(props: QueryProviderProps) {
  return <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>;
}
