import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

type QueryProviderProps = {
  children: React.ReactNode;
};

export const queryClient = new QueryClient();

export function QueryProvider(props: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {props.children} <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
